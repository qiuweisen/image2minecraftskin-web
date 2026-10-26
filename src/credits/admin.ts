import { env } from 'cloudflare:workers';
import { expireUserCredits } from './ledger';

type Operation = {
  actorId: string;
  userId: string;
  reason: string;
  bizKey: string;
  now?: Date;
};
type Audit = {
  id: string;
  actorId: string;
  userId: string | null;
  action: string;
  reason: string;
  bizKey: string;
  payload: string;
  amount: number | null;
  beforeBalance: number | null;
  afterBalance: number | null;
  transactionId: string | null;
  createdAt: number;
};
const auditColumns =
  'id,actor_id actorId,user_id userId,action,reason,biz_key bizKey,payload,amount,before_balance beforeBalance,after_balance afterBalance,transaction_id transactionId,created_at createdAt';
export async function assertAdmin(actorId: string) {
  const actor = await env.DB.prepare('SELECT role FROM user WHERE id=?')
    .bind(actorId)
    .first<{ role: string }>();
  if (actor?.role !== 'admin') throw new Error('Forbidden');
}
function validate(p: Operation) {
  if (
    !p.reason.trim() ||
    p.reason.length > 1000 ||
    !p.bizKey.trim() ||
    p.bizKey.length > 200
  )
    throw new Error('Reason and biz_key are required');
}
function guard() {
  return env.DB.prepare(
    'INSERT INTO credit_guard(ok) VALUES(CASE WHEN changes()=1 THEN 1 ELSE 0 END)'
  );
}
function roleGuard(actorId: string) {
  return env.DB.prepare(
    "INSERT INTO credit_guard(ok) SELECT CASE WHEN EXISTS(SELECT 1 FROM user WHERE id=? AND role='admin') THEN 1 ELSE 0 END"
  ).bind(actorId);
}
function result(a: Audit) {
  return {
    auditId: a.id,
    transactionId: a.transactionId ?? undefined,
    balance: a.afterBalance ?? 0,
  };
}
async function replay(p: Operation, payload: string) {
  const a = await env.DB.prepare(
    `SELECT ${auditColumns} FROM credit_admin_audit WHERE actor_id=? AND biz_key=?`
  )
    .bind(p.actorId, p.bizKey)
    .first<Audit>();
  if (a && a.payload !== payload)
    throw new Error('Idempotency key conflicts with another operation');
  return a;
}
function auditInsert(
  p: Operation,
  action: string,
  payload: string,
  id: string,
  amount: number | null,
  before: number,
  after: number,
  tx: string | null,
  now: number
) {
  return env.DB.prepare(
    'INSERT INTO credit_admin_audit(id,actor_id,user_id,action,reason,biz_key,payload,amount,before_balance,after_balance,transaction_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'
  ).bind(
    id,
    p.actorId,
    p.userId,
    action,
    p.reason.trim(),
    p.bizKey,
    payload,
    amount,
    before,
    after,
    tx,
    now
  );
}
export async function adjustAdminCredits(p: Operation & { amount: number }) {
  await assertAdmin(p.actorId);
  validate(p);
  if (!Number.isSafeInteger(p.amount) || p.amount === 0)
    throw new Error('Amount must be a nonzero safe integer');
  const payload = JSON.stringify({
    action: 'adjust',
    userId: p.userId,
    amount: p.amount,
    reason: p.reason.trim(),
  });
  const now = p.now ?? new Date();
  for (let retry = 0; retry < 30; retry++) {
    const prior = await replay(p, payload);
    if (prior) return result(prior);
    if (
      !(await env.DB.prepare('SELECT id FROM user WHERE id=?')
        .bind(p.userId)
        .first())
    )
      throw new Error('Unknown user');
    await env.DB.prepare(
      'INSERT INTO user_credit(id,user_id,current_credits,created_at,updated_at) VALUES(?,?,0,?,?) ON CONFLICT(user_id) DO NOTHING'
    )
      .bind(crypto.randomUUID(), p.userId, now.getTime(), now.getTime())
      .run();
    await expireUserCredits(p.userId, now);
    const cached = await env.DB.prepare(
      'SELECT current_credits balance FROM user_credit WHERE user_id=?'
    )
      .bind(p.userId)
      .first<{ balance: number }>();
    const grants = await env.DB.prepare(
      'SELECT id,remaining_amount remaining FROM credit_transaction WHERE user_id=? AND remaining_amount>0 ORDER BY expiration_date IS NULL,expiration_date,created_at,id'
    )
      .bind(p.userId)
      .all<{ id: string; remaining: number }>();
    const before = cached!.balance,
      after = before + p.amount;
    if (before !== grants.results.reduce((s, r) => s + r.remaining, 0))
      throw new Error('Ledger mismatch; repair first');
    if (after < 0) throw new Error('Insufficient credits');
    if (!Number.isSafeInteger(after)) throw new Error('Balance overflow');
    const id = crypto.randomUUID(),
      tx = crypto.randomUUID();
    let remaining = -p.amount;
    const statements = [
      roleGuard(p.actorId),
      env.DB.prepare(
        "INSERT INTO credit_transaction(id,user_id,type,description,amount,remaining_amount,biz_key,metadata,created_at) VALUES(?,?,'ADMIN_ADJUST',?,?,?,?,?,?)"
      ).bind(
        tx,
        p.userId,
        p.reason.trim(),
        p.amount,
        p.amount > 0 ? p.amount : null,
        `admin:${p.actorId}:${p.bizKey}`,
        JSON.stringify({ actorId: p.actorId, auditId: id }),
        now.getTime()
      ),
    ];
    for (const grant of grants.results) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, grant.remaining);
      remaining -= take;
      statements.push(
        env.DB.prepare(
          'UPDATE credit_transaction SET remaining_amount=remaining_amount-? WHERE id=? AND remaining_amount=?'
        ).bind(take, grant.id, grant.remaining),
        guard()
      );
    }
    statements.push(
      env.DB.prepare(
        'UPDATE user_credit SET current_credits=?,updated_at=? WHERE user_id=? AND current_credits=?'
      ).bind(after, now.getTime(), p.userId, before),
      guard(),
      auditInsert(
        p,
        'adjust',
        payload,
        id,
        p.amount,
        before,
        after,
        tx,
        now.getTime()
      ),
      env.DB.prepare('DELETE FROM credit_guard')
    );
    try {
      await env.DB.batch(statements);
      return { auditId: id, transactionId: tx, balance: after };
    } catch (error) {
      const prior = await replay(p, payload);
      if (prior) return result(prior);
      if (!String(error).includes('constraint')) throw error;
    }
  }
  throw new Error('Credit conflict; retry with same key');
}
export async function repairAdminCredits(p: Operation) {
  await assertAdmin(p.actorId);
  validate(p);
  const payload = JSON.stringify({
    action: 'repair',
    userId: p.userId,
    reason: p.reason.trim(),
  });
  const prior = await replay(p, payload);
  if (prior) return result(prior);
  if (
    !(await env.DB.prepare('SELECT id FROM user WHERE id=?')
      .bind(p.userId)
      .first())
  )
    throw new Error('Unknown user');
  const now = (p.now ?? new Date()).getTime(),
    id = crypto.randomUUID();
  try {
    await env.DB.batch([
      roleGuard(p.actorId),
      env.DB.prepare(
        'INSERT INTO user_credit(id,user_id,current_credits,created_at,updated_at) VALUES(?,?,0,?,?) ON CONFLICT(user_id) DO NOTHING'
      ).bind(crypto.randomUUID(), p.userId, now, now),
      env.DB.prepare(
        `INSERT INTO credit_admin_audit(id,actor_id,user_id,action,reason,biz_key,payload,before_balance,after_balance,created_at) SELECT ?,?,?,'repair',?,?,?,current_credits,(SELECT COALESCE(SUM(remaining_amount),0) FROM credit_transaction WHERE user_id=? AND remaining_amount>0 AND (expiration_date IS NULL OR expiration_date>?)),? FROM user_credit WHERE user_id=?`
      ).bind(
        id,
        p.actorId,
        p.userId,
        p.reason.trim(),
        p.bizKey,
        payload,
        p.userId,
        now,
        now,
        p.userId
      ),
      env.DB.prepare(
        `INSERT INTO credit_transaction(id,user_id,type,amount,biz_key,related_transaction_id,created_at,description) SELECT 'repair-expire:'||id,user_id,'EXPIRE',-remaining_amount,'repair-expire:'||id,id,?,'Expired during admin reconciliation' FROM credit_transaction WHERE user_id=? AND remaining_amount>0 AND expiration_date<=?`
      ).bind(now, p.userId, now),
      env.DB.prepare(
        'UPDATE credit_transaction SET remaining_amount=0,expired_at=? WHERE user_id=? AND remaining_amount>0 AND expiration_date<=?'
      ).bind(now, p.userId, now),
      env.DB.prepare(
        'UPDATE user_credit SET current_credits=(SELECT COALESCE(SUM(remaining_amount),0) FROM credit_transaction WHERE user_id=? AND remaining_amount>0),updated_at=? WHERE user_id=?'
      ).bind(p.userId, now, p.userId),
      env.DB.prepare('DELETE FROM credit_guard'),
    ]);
  } catch (error) {
    const a = await replay(p, payload);
    if (a) return result(a);
    throw error;
  }
  return result((await replay(p, payload))!);
}
export async function listAdminBalances({
  search = '',
  pageIndex = 0,
  pageSize = 20,
}: {
  search?: string;
  pageIndex: number;
  pageSize: number;
}) {
  const pattern = `%${search}%`;
  const items = await env.DB.prepare(
    'SELECT u.id userId,u.name,u.email,COALESCE(c.current_credits,0) balance FROM user u LEFT JOIN user_credit c ON c.user_id=u.id WHERE u.email LIKE ? OR u.name LIKE ? ORDER BY u.created_at DESC,u.id LIMIT ? OFFSET ?'
  )
    .bind(pattern, pattern, pageSize, pageIndex * pageSize)
    .all<{ userId: string; name: string; email: string; balance: number }>();
  const count = await env.DB.prepare(
    'SELECT COUNT(*) total FROM user WHERE email LIKE ? OR name LIKE ?'
  )
    .bind(pattern, pattern)
    .first<{ total: number }>();
  return { items: items.results, total: count?.total ?? 0 };
}
export async function listAdminAudit(userId?: string) {
  const rows = await env.DB.prepare(
    `SELECT ${auditColumns} FROM credit_admin_audit WHERE (? IS NULL OR user_id=?) ORDER BY created_at DESC,id DESC LIMIT 200`
  )
    .bind(userId ?? null, userId ?? null)
    .all<Audit>();
  return rows.results.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
}
export async function getAdminCreditDetail(userId: string) {
  const user = await env.DB.prepare('SELECT id,name,email FROM user WHERE id=?')
    .bind(userId)
    .first<{ id: string; name: string; email: string }>();
  if (!user) throw new Error('Unknown user');
  // Read raw financial state: admin inspection must not grant gifts or hide corruption.
  const rows = await env.DB.prepare(
    'SELECT id,type,amount,remaining_amount remaining,expiration_date expiry,created_at createdAt,description FROM credit_transaction WHERE user_id=? ORDER BY created_at DESC'
  )
    .bind(userId)
    .all<{
      id: string;
      type: string;
      amount: number;
      remaining: number | null;
      expiry: number | null;
      createdAt: number;
      description: string | null;
    }>();
  const transactions = rows.results.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    expirationDate: r.expiry === null ? null : new Date(r.expiry),
  }));
  const balance =
    (
      await env.DB.prepare(
        'SELECT current_credits balance FROM user_credit WHERE user_id=?'
      )
        .bind(userId)
        .first<{ balance: number }>()
    )?.balance ?? 0;
  const batches = transactions.filter((r) => (r.remaining ?? 0) > 0);
  const ledger = batches.reduce((sum, r) => sum + (r.remaining ?? 0), 0);
  return {
    user,
    balance,
    totalUsed: transactions.reduce(
      (s, r) => s + (r.type === 'USAGE' ? -r.amount : 0),
      0
    ),
    transactions,
    batches,
    reconciliation: { consistent: balance === ledger, balance, ledger },
    audit: await listAdminAudit(userId),
  };
}
