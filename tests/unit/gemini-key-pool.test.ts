import { describe, expect, test, vi } from 'vitest';

const FakeDurableObject = vi.hoisted(
  () =>
    class FakeDurableObject {
      protected ctx: unknown;

      constructor(ctx: unknown) {
        this.ctx = ctx;
      }
    }
);

vi.mock('cloudflare:workers', () => ({
  DurableObject: FakeDurableObject,
}));

import { GeminiKeyPool } from '@/lib/gemini-key-pool';

type PoolState = { key_count: number; next_slot: number };
type KeyHealth = {
  cooldown_until: number;
  failure_count: number;
  last_failure: number;
};

class FakeCursor<T extends Record<string, unknown>> {
  constructor(private readonly rows: T[]) {}

  toArray() {
    return this.rows;
  }
}

class FakeSql {
  poolState: PoolState | null = null;
  health = new Map<number, KeyHealth>();

  exec<T extends Record<string, unknown>>(
    query: string,
    ...bindings: unknown[]
  ) {
    const normalized = query.replace(/\s+/g, ' ').trim().toUpperCase();

    if (normalized.startsWith('CREATE TABLE')) {
      return new FakeCursor<T>([]);
    }

    if (normalized.startsWith('INSERT INTO POOL_STATE')) {
      const keyCount = Number(bindings[1]);
      this.poolState = this.poolState
        ? {
            key_count: keyCount,
            next_slot: this.poolState.next_slot % keyCount,
          }
        : { key_count: keyCount, next_slot: 0 };
      return new FakeCursor<T>([]);
    }

    if (normalized.startsWith('SELECT KEY_COUNT, NEXT_SLOT')) {
      return new FakeCursor<T>(
        this.poolState ? [this.poolState as unknown as T] : []
      );
    }

    if (normalized.startsWith('UPDATE POOL_STATE')) {
      this.poolState = {
        key_count: Number(bindings[1]),
        next_slot: Number(bindings[0]),
      };
      return new FakeCursor<T>([]);
    }

    if (normalized.startsWith('SELECT SLOT, COOLDOWN_UNTIL')) {
      const keyCount = Number(bindings[0]);
      const rows = [...this.health.entries()]
        .filter(([slot]) => slot >= 0 && slot < keyCount)
        .map(([slot, state]) => ({
          slot,
          cooldown_until: state.cooldown_until,
        }));
      return new FakeCursor<T>(rows as unknown as T[]);
    }

    if (normalized.startsWith('SELECT FAILURE_COUNT')) {
      const slot = Number(bindings[0]);
      const failureCount = this.health.get(slot)?.failure_count;
      return new FakeCursor<T>(
        failureCount === undefined
          ? []
          : [{ failure_count: failureCount } as unknown as T]
      );
    }

    if (normalized.startsWith('INSERT INTO KEY_HEALTH')) {
      const slot = Number(bindings[0]);
      if (normalized.includes('VALUES (?, 0, 0, 0)')) {
        this.health.set(slot, {
          cooldown_until: 0,
          failure_count: 0,
          last_failure: 0,
        });
      } else {
        const current = this.health.get(slot);
        this.health.set(slot, {
          cooldown_until: Math.max(
            current?.cooldown_until ?? 0,
            Number(bindings[1])
          ),
          failure_count: (current?.failure_count ?? 0) + 1,
          last_failure: Number(bindings[2]),
        });
      }
      return new FakeCursor<T>([]);
    }

    throw new Error(`Unhandled SQL: ${query}`);
  }
}

function createPool() {
  const sql = new FakeSql();
  const ctx = {
    storage: { sql },
    blockConcurrencyWhile: (callback: () => Promise<void>) => callback(),
  } as unknown as DurableObjectState;
  return { pool: new GeminiKeyPool(ctx, {} as Env), sql };
}

describe('GeminiKeyPool', () => {
  test('allocates a persistent round-robin sequence', () => {
    const { pool } = createPool();

    expect(pool.nextKeySlots(3, 0).slots).toEqual([0, 1, 2]);
    expect(pool.nextKeySlots(3, 0).slots).toEqual([1, 2, 0]);
    expect(pool.nextKeySlots(3, 0).slots).toEqual([2, 0, 1]);
    expect(pool.nextKeySlots(3, 0).allCoolingDown).toBe(false);
  });

  test('skips cooled-down keys and probes all keys when the pool is unhealthy', () => {
    const { pool } = createPool();

    pool.nextKeySlots(3, 0);
    pool.reportFailure(1, 'rate-limit', 10_000);
    expect(pool.nextKeySlots(3, 1_000).slots).toEqual([2, 0]);

    pool.reportFailure(0, 'provider', 10_000);
    pool.reportFailure(2, 'timeout', 10_000);
    const allCoolingDown = pool.nextKeySlots(3, 1_000);
    expect(allCoolingDown.slots).toEqual([2, 0, 1]);
    expect(allCoolingDown.allCoolingDown).toBe(true);

    pool.reportSuccess(1);
    expect(pool.nextKeySlots(3, 1_000).slots).toContain(1);
  });
});
