import { env } from 'cloudflare:workers';
import { nanoid } from 'nanoid';

interface Operation {
  actorId: string;
  reason: string;
  bizKey: string;
  now?: Date;
}

interface CreateCode extends Operation {
  code: string;
  creditsAmount: number;
  maxRedemptions?: number;
  perUserLimit?: number;
  expiresAt?: Date;
  creditExpiresAt?: Date;
  boundUserId?: string;
  note?: string;
}

function validateOperation(input: Operation) {
  if (!input.reason.trim()) throw new Error('A reason is required');
  if (!input.bizKey.trim() || input.bizKey.length > 200)
    throw new Error('Invalid idempotency key');
}

async function requireAdmin(actorId: string) {
  const actor = await env.DB.prepare('SELECT role FROM user WHERE id=?')
    .bind(actorId)
    .first<{ role: string }>();
  if (actor?.role !== 'admin') throw new Error('Admin permission required');
}

async function replay(
  actorId: string,
  bizKey: string,
  action: string,
  payload: string
) {
  const row = await env.DB.prepare(
    'SELECT action,payload,transaction_id AS id FROM credit_admin_audit WHERE actor_id=? AND biz_key=?'
  )
    .bind(actorId, bizKey)
    .first<{ action: string; payload: string; id: string }>();
  if (row && (row.action !== action || row.payload !== payload))
    throw new Error('Idempotency key payload conflict');
  return row;
}

function roleGuard(actorId: string) {
  return env.DB.prepare(
    `INSERT INTO credit_guard(ok) VALUES (CASE WHEN EXISTS(SELECT 1 FROM user WHERE id=? AND role='admin') THEN 1 ELSE 0 END)`
  ).bind(actorId);
}

function audit(
  input: Operation,
  action: string,
  payload: string,
  id: string,
  now: number
) {
  return env.DB.prepare(
    `INSERT INTO credit_admin_audit(id,actor_id,user_id,action,reason,biz_key,payload,transaction_id,created_at) VALUES (?,?,NULL,?,?,?,?,?,?)`
  ).bind(
    nanoid(),
    input.actorId,
    action,
    input.reason.trim(),
    input.bizKey,
    payload,
    id,
    now
  );
}

// Port of mkfast-app createRedemptionCode, with atomic audit/idempotency and role recheck.
export async function createAdminRedemptionCode(
  input: CreateCode
): Promise<string> {
  validateOperation(input);
  await requireAdmin(input.actorId);
  const code = input.code.trim().toUpperCase();
  const now = (input.now ?? new Date()).getTime();
  const perUserLimit = input.perUserLimit ?? 1;
  if (!code || code.length > 32) throw new Error('Invalid code');
  for (const amount of [
    input.creditsAmount,
    perUserLimit,
    ...(input.maxRedemptions === undefined ? [] : [input.maxRedemptions]),
  ]) {
    if (!Number.isSafeInteger(amount) || amount <= 0)
      throw new Error('Positive safe integer required');
  }
  const payload = JSON.stringify({
    code,
    creditsAmount: input.creditsAmount,
    maxRedemptions: input.maxRedemptions ?? null,
    perUserLimit,
    expiresAt: input.expiresAt?.getTime() ?? null,
    creditExpiresAt: input.creditExpiresAt?.getTime() ?? null,
    boundUserId: input.boundUserId ?? null,
    note: input.note ?? null,
    reason: input.reason.trim(),
  });
  const previous = await replay(
    input.actorId,
    input.bizKey,
    'redemption_create',
    payload
  );
  if (previous) return previous.id;
  for (const expiry of [input.expiresAt, input.creditExpiresAt]) {
    if (
      expiry &&
      (!Number.isFinite(expiry.getTime()) || expiry.getTime() <= now)
    )
      throw new Error('Expiry must be in the future');
  }
  const id = nanoid();
  try {
    await env.DB.batch([
      roleGuard(input.actorId),
      env.DB.prepare(
        `INSERT INTO redemption_code(id,code,credits_amount,max_redemptions,per_user_limit,expires_at,credit_expires_at,bound_user_id,note,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        id,
        code,
        input.creditsAmount,
        input.maxRedemptions ?? null,
        perUserLimit,
        input.expiresAt?.getTime() ?? null,
        input.creditExpiresAt?.getTime() ?? null,
        input.boundUserId ?? null,
        input.note ?? null,
        input.actorId,
        now,
        now
      ),
      audit(input, 'redemption_create', payload, id, now),
      env.DB.prepare('DELETE FROM credit_guard'),
    ]);
  } catch (error) {
    const previous = await replay(
      input.actorId,
      input.bizKey,
      'redemption_create',
      payload
    );
    if (previous) return previous.id;
    throw error;
  }
  return id;
}

export async function toggleAdminRedemptionCode(
  input: Operation & { id: string; disabled: boolean }
) {
  validateOperation(input);
  await requireAdmin(input.actorId);
  const payload = JSON.stringify({
    id: input.id,
    disabled: input.disabled,
    reason: input.reason.trim(),
  });
  if (await replay(input.actorId, input.bizKey, 'redemption_toggle', payload))
    return { success: true };
  const now = (input.now ?? new Date()).getTime();
  try {
    await env.DB.batch([
      roleGuard(input.actorId),
      env.DB.prepare(
        'UPDATE redemption_code SET disabled=?,updated_at=? WHERE id=?'
      ).bind(Number(input.disabled), now, input.id),
      env.DB.prepare(
        'INSERT INTO credit_guard(ok) VALUES(CASE WHEN changes()=1 THEN 1 ELSE 0 END)'
      ),
      audit(input, 'redemption_toggle', payload, input.id, now),
      env.DB.prepare('DELETE FROM credit_guard'),
    ]);
  } catch (error) {
    if (await replay(input.actorId, input.bizKey, 'redemption_toggle', payload))
      return { success: true };
    throw error;
  }
  return { success: true };
}

export function generateRedemptionCode(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(
    crypto.getRandomValues(new Uint8Array(length)),
    (value) => alphabet[value % alphabet.length]
  ).join('');
}
