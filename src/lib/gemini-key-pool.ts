import { DurableObject } from 'cloudflare:workers';

const POOL_STATE_ID = 1;
const MAX_KEY_COUNT = 100;
const MAX_COOLDOWN_MS = 60 * 60 * 1000;

export type GeminiKeyFailureReason =
  | 'invalid'
  | 'rate-limit'
  | 'provider'
  | 'timeout'
  | 'network';

export type GeminiKeySlotOrder = {
  slots: number[];
  allCoolingDown: boolean;
};

type PoolStateRow = {
  key_count: number;
  next_slot: number;
};

type KeyHealthRow = {
  slot: number;
  cooldown_until: number;
};

function normalizeKeyCount(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > MAX_KEY_COUNT) {
    throw new RangeError(
      `Gemini key count must be between 1 and ${MAX_KEY_COUNT}`
    );
  }
  return value;
}

function normalizeSlot(value: number) {
  return Number.isInteger(value) && value >= 0 && value < MAX_KEY_COUNT
    ? value
    : null;
}

function getBaseCooldown(reason: GeminiKeyFailureReason) {
  switch (reason) {
    case 'invalid':
      return 15 * 60 * 1000;
    case 'rate-limit':
      return 30 * 1000;
    case 'timeout':
      return 15 * 1000;
    case 'network':
      return 10 * 1000;
    case 'provider':
      return 20 * 1000;
  }
}

function getCooldownMs(
  reason: GeminiKeyFailureReason,
  previousFailures: number,
  requestedCooldownMs?: number
) {
  const requested =
    Number.isFinite(requestedCooldownMs) && requestedCooldownMs !== undefined
      ? Math.max(1_000, requestedCooldownMs)
      : getBaseCooldown(reason) * 2 ** Math.min(previousFailures, 3);
  return Math.min(MAX_COOLDOWN_MS, requested);
}

/**
 * Coordinates the Gemini key pool across Worker isolates.
 *
 * The Durable Object stores only slot numbers and temporary health state. The
 * actual API keys remain in Worker secrets and never cross the RPC boundary.
 */
export class GeminiKeyPool extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS pool_state (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          key_count INTEGER NOT NULL,
          next_slot INTEGER NOT NULL
        )
      `);
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS key_health (
          slot INTEGER PRIMARY KEY,
          cooldown_until INTEGER NOT NULL DEFAULT 0,
          failure_count INTEGER NOT NULL DEFAULT 0,
          last_failure INTEGER NOT NULL DEFAULT 0
        )
      `);
    });
  }

  nextKeySlots(keyCount: number, now = Date.now()): GeminiKeySlotOrder {
    const normalizedKeyCount = normalizeKeyCount(keyCount);

    this.ctx.storage.sql.exec(
      `
        INSERT INTO pool_state (id, key_count, next_slot)
        VALUES (?, ?, 0)
        ON CONFLICT(id) DO UPDATE SET
          key_count = excluded.key_count,
          next_slot = CASE
            WHEN pool_state.key_count = excluded.key_count
              THEN pool_state.next_slot % excluded.key_count
            ELSE pool_state.next_slot % excluded.key_count
          END
      `,
      POOL_STATE_ID,
      normalizedKeyCount
    );

    const state = this.ctx.storage.sql
      .exec<PoolStateRow>(
        'SELECT key_count, next_slot FROM pool_state WHERE id = ?',
        POOL_STATE_ID
      )
      .toArray()[0];

    const startSlot = (state?.next_slot ?? 0) % normalizedKeyCount;
    const nextSlot = (startSlot + 1) % normalizedKeyCount;
    this.ctx.storage.sql.exec(
      'UPDATE pool_state SET next_slot = ?, key_count = ? WHERE id = ?',
      nextSlot,
      normalizedKeyCount,
      POOL_STATE_ID
    );

    const order = Array.from(
      { length: normalizedKeyCount },
      (_, offset) => (startSlot + offset) % normalizedKeyCount
    );
    const healthRows = this.ctx.storage.sql
      .exec<KeyHealthRow>(
        'SELECT slot, cooldown_until FROM key_health WHERE slot >= 0 AND slot < ?',
        normalizedKeyCount
      )
      .toArray();
    const cooldownBySlot = new Map(
      healthRows.map((row) => [row.slot, row.cooldown_until])
    );
    const available = order.filter(
      (slot) => (cooldownBySlot.get(slot) ?? 0) <= now
    );

    return {
      slots: available.length > 0 ? available : order,
      allCoolingDown: available.length === 0,
    };
  }

  reportSuccess(slot: number) {
    const normalizedSlot = normalizeSlot(slot);
    if (normalizedSlot === null) return;

    this.ctx.storage.sql.exec(
      `
        INSERT INTO key_health (slot, cooldown_until, failure_count, last_failure)
        VALUES (?, 0, 0, 0)
        ON CONFLICT(slot) DO UPDATE SET
          cooldown_until = 0,
          failure_count = 0,
          last_failure = 0
      `,
      normalizedSlot
    );
  }

  reportFailure(
    slot: number,
    reason: GeminiKeyFailureReason,
    requestedCooldownMs?: number
  ) {
    const normalizedSlot = normalizeSlot(slot);
    if (normalizedSlot === null) return;

    const previous =
      this.ctx.storage.sql
        .exec<{ failure_count: number }>(
          'SELECT failure_count FROM key_health WHERE slot = ?',
          normalizedSlot
        )
        .toArray()[0]?.failure_count ?? 0;
    const cooldownMs = getCooldownMs(reason, previous, requestedCooldownMs);
    const now = Date.now();

    this.ctx.storage.sql.exec(
      `
        INSERT INTO key_health (slot, cooldown_until, failure_count, last_failure)
        VALUES (?, ?, 1, ?)
        ON CONFLICT(slot) DO UPDATE SET
          cooldown_until = MAX(key_health.cooldown_until, excluded.cooldown_until),
          failure_count = key_health.failure_count + 1,
          last_failure = excluded.last_failure
      `,
      normalizedSlot,
      now + cooldownMs,
      now
    );
  }
}
