import { env } from 'cloudflare:workers';
import { nanoid } from 'nanoid';
import { resolveCreditExpiry } from './expiry';
import { CreditTransactionType, type CreditErrorCode } from './types';

const MAX_CONFLICT_RETRIES = 12;

export interface AddCreditsParams {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  bizKey: string;
  description?: string;
  paymentId?: string;
  provider?: string;
  subscriptionId?: string;
  periodStart?: Date;
  periodEnd?: Date;
  expirationDate?: Date;
  metadata?: Record<string, unknown>;
  now?: Date;
}

export interface ConsumeCreditsParams {
  userId: string;
  amount: number;
  bizKey: string;
  description?: string;
  now?: Date;
}

export interface CreditOperationResult {
  success: boolean;
  usageTransactionId?: string;
  error?: string;
  code?: CreditErrorCode;
}

interface GrantRow {
  id: string;
  remainingAmount: number;
  expirationDate: number | null;
}

interface TransactionRow {
  id: string;
  userId: string;
  type: string;
  amount: number;
  remainingAmount: number | null;
  expirationDate: number | null;
  createdAt: number;
  description: string | null;
}

export interface GetUserCreditsResult {
  balance: number;
  totalUsed: number;
  transactions: Array<{
    id: string;
    type: CreditTransactionType;
    amount: number;
    remaining: number | null;
    expirationDate: Date | null;
    createdAt: Date;
    description: string | null;
  }>;
}

function assertPositiveInteger(amount: number) {
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive safe integer');
  }
}

function isConstraintError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('SQLITE_CONSTRAINT') ||
      error.message.includes('constraint failed') ||
      error.message.includes('UNIQUE constraint'))
  );
}

async function backoff(attempt: number): Promise<void> {
  const delay = Math.min(50, 5 + attempt * 4 + Math.floor(Math.random() * 8));
  await new Promise((resolve) => setTimeout(resolve, delay));
}

async function findTransactionByBizKey(
  userId: string,
  type: CreditTransactionType,
  bizKey: string
): Promise<{ id: string } | null> {
  return env.DB.prepare(
    `SELECT id FROM credit_transaction
     WHERE user_id = ? AND type = ? AND biz_key = ? LIMIT 1`
  )
    .bind(userId, type, bizKey)
    .first<{ id: string }>();
}

export async function ensureUserCredit(userId: string): Promise<void> {
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO user_credit
       (id, user_id, current_credits, created_at, updated_at)
     VALUES (?, ?, 0, ?, ?)
     ON CONFLICT(user_id) DO NOTHING`
  )
    .bind(nanoid(), userId, now, now)
    .run();
}

export async function addCredits(params: AddCreditsParams): Promise<string> {
  assertPositiveInteger(params.amount);
  const now = params.now ?? new Date();
  const expirationDate = resolveCreditExpiry(params.type, params);
  const alreadyExpired = Boolean(
    expirationDate && expirationDate.getTime() <= now.getTime()
  );
  const transactionId = nanoid();
  const balanceId = nanoid();
  const statements: D1PreparedStatement[] = [
    env.DB.prepare(
      `INSERT INTO user_credit
         (id, user_id, current_credits, created_at, updated_at)
       VALUES (?, ?, 0, ?, ?)
       ON CONFLICT(user_id) DO NOTHING`
    ).bind(balanceId, params.userId, now.getTime(), now.getTime()),
    env.DB.prepare(
      `INSERT INTO credit_transaction
         (id, user_id, type, description, amount, remaining_amount, biz_key,
          payment_id, provider, subscription_id, period_start, period_end,
          expiration_date, expired_at, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, type, biz_key) DO NOTHING`
    ).bind(
      transactionId,
      params.userId,
      params.type,
      params.description ?? null,
      params.amount,
      alreadyExpired ? 0 : params.amount,
      params.bizKey,
      params.paymentId ?? null,
      params.provider ?? null,
      params.subscriptionId ?? null,
      params.periodStart?.getTime() ?? null,
      params.periodEnd?.getTime() ?? null,
      expirationDate?.getTime() ?? null,
      alreadyExpired ? now.getTime() : null,
      params.metadata ? JSON.stringify(params.metadata) : null,
      now.getTime()
    ),
  ];
  if (alreadyExpired) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO credit_transaction
           (id, user_id, type, description, amount, remaining_amount, biz_key,
            related_transaction_id, created_at)
         SELECT ?, ?, 'EXPIRE', 'Credit batch expired before grant', ?, NULL,
                ?, ?, ?
         FROM credit_transaction WHERE id = ?`
      ).bind(
        nanoid(),
        params.userId,
        -params.amount,
        `expire:${transactionId}`,
        transactionId,
        now.getTime(),
        transactionId
      )
    );
  }
  statements.push(
    env.DB.prepare(
      `UPDATE user_credit
       SET current_credits = current_credits + ?, updated_at = ?
       WHERE user_id = ? AND EXISTS (
         SELECT 1 FROM credit_transaction WHERE id = ?
       )`
    ).bind(
      alreadyExpired ? 0 : params.amount,
      now.getTime(),
      params.userId,
      transactionId
    )
  );
  await env.DB.batch(statements);

  const inserted = await findTransactionByBizKey(
    params.userId,
    params.type,
    params.bizKey
  );
  if (!inserted) throw new Error('Credit grant was not persisted');
  return inserted.id;
}

async function expireTransaction(
  userId: string,
  grant: GrantRow,
  now: Date
): Promise<void> {
  const expireId = nanoid();
  const bizKey = `expire:${grant.id}`;
  try {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO credit_transaction
           (id, user_id, type, description, amount, remaining_amount, biz_key,
            related_transaction_id, created_at)
         VALUES (?, ?, 'EXPIRE', 'Credit batch expired', ?, NULL, ?, ?, ?)`
      ).bind(
        expireId,
        userId,
        -grant.remainingAmount,
        bizKey,
        grant.id,
        now.getTime()
      ),
      env.DB.prepare(
        `UPDATE credit_transaction
         SET remaining_amount = 0, expired_at = ?
         WHERE id = ? AND user_id = ? AND remaining_amount = ?
           AND expiration_date <= ?`
      ).bind(
        now.getTime(),
        grant.id,
        userId,
        grant.remainingAmount,
        now.getTime()
      ),
      env.DB.prepare(
        `INSERT INTO credit_guard(ok)
         SELECT CASE WHEN changes() = 1 THEN 1 ELSE 0 END`
      ),
      env.DB.prepare(
        `UPDATE user_credit
         SET current_credits = current_credits - ?, updated_at = ?
         WHERE user_id = ? AND current_credits >= ?`
      ).bind(
        grant.remainingAmount,
        now.getTime(),
        userId,
        grant.remainingAmount
      ),
      env.DB.prepare(
        `INSERT INTO credit_guard(ok)
         SELECT CASE WHEN changes() = 1 THEN 1 ELSE 0 END`
      ),
      env.DB.prepare('DELETE FROM credit_guard'),
    ]);
  } catch (error) {
    const existing = await findTransactionByBizKey(
      userId,
      CreditTransactionType.EXPIRE,
      bizKey
    );
    if (!existing) throw error;
  }
}

export async function expireUserCredits(
  userId: string,
  now = new Date()
): Promise<void> {
  for (let attempt = 0; attempt <= MAX_CONFLICT_RETRIES; attempt++) {
    const expired = await env.DB.prepare(
      `SELECT id, remaining_amount AS remainingAmount,
              expiration_date AS expirationDate
       FROM credit_transaction
       WHERE user_id = ? AND remaining_amount > 0
         AND expiration_date IS NOT NULL AND expiration_date <= ?
       ORDER BY expiration_date ASC, created_at ASC`
    )
      .bind(userId, now.getTime())
      .all<GrantRow>();

    if (expired.results.length === 0) return;

    try {
      for (const grant of expired.results) {
        await expireTransaction(userId, grant, now);
      }
      return;
    } catch (error) {
      if (!isConstraintError(error) || attempt === MAX_CONFLICT_RETRIES) {
        throw error;
      }
      await backoff(attempt);
    }
  }
}

export async function consumeCredits(
  params: ConsumeCreditsParams
): Promise<CreditOperationResult> {
  try {
    assertPositiveInteger(params.amount);
  } catch (error) {
    return {
      success: false,
      code: 'INVALID_CREDIT_AMOUNT',
      error: error instanceof Error ? error.message : 'Invalid credit amount',
    };
  }

  const existing = await findTransactionByBizKey(
    params.userId,
    CreditTransactionType.USAGE,
    params.bizKey
  );
  if (existing) return { success: true, usageTransactionId: existing.id };

  const now = params.now ?? new Date();
  await ensureUserCredit(params.userId);
  await (await import('./daily')).grantDailyCredits(params.userId, now);
  await expireUserCredits(params.userId, now);

  for (let attempt = 0; attempt <= MAX_CONFLICT_RETRIES; attempt++) {
    const duplicate = await findTransactionByBizKey(
      params.userId,
      CreditTransactionType.USAGE,
      params.bizKey
    );
    if (duplicate) {
      return { success: true, usageTransactionId: duplicate.id };
    }

    const grants = await env.DB.prepare(
      `SELECT id, remaining_amount AS remainingAmount,
              expiration_date AS expirationDate
       FROM credit_transaction
       WHERE user_id = ? AND remaining_amount > 0
         AND (expiration_date IS NULL OR expiration_date > ?)
       ORDER BY expiration_date IS NULL ASC, expiration_date ASC, created_at ASC`
    )
      .bind(params.userId, now.getTime())
      .all<GrantRow>();

    const totalAvailable = grants.results.reduce(
      (sum, grant) => sum + grant.remainingAmount,
      0
    );
    if (totalAvailable < params.amount) {
      return {
        success: false,
        code: 'INSUFFICIENT_CREDITS',
        error: 'Insufficient credits',
      };
    }

    let amountLeft = params.amount;
    const allocations: Array<GrantRow & { take: number }> = [];
    for (const grant of grants.results) {
      if (amountLeft === 0) break;
      const take = Math.min(grant.remainingAmount, amountLeft);
      allocations.push({ ...grant, take });
      amountLeft -= take;
    }

    const usageId = nanoid();
    const statements: D1PreparedStatement[] = [
      env.DB.prepare(
        `INSERT INTO credit_transaction
           (id, user_id, type, description, amount, remaining_amount, biz_key,
            expiration_date, metadata, created_at)
         VALUES (?, ?, 'USAGE', ?, ?, NULL, ?, ?, ?, ?)`
      ).bind(
        usageId,
        params.userId,
        params.description ?? null,
        -params.amount,
        params.bizKey,
        allocations[0]?.expirationDate ?? null,
        JSON.stringify(
          allocations.map(({ id, take, expirationDate }) => ({
            id,
            amount: take,
            expirationDate,
          }))
        ),
        now.getTime()
      ),
    ];

    for (const allocation of allocations) {
      statements.push(
        env.DB.prepare(
          `UPDATE credit_transaction
           SET remaining_amount = remaining_amount - ?
           WHERE id = ? AND user_id = ? AND remaining_amount = ?
             AND (expiration_date IS NULL OR expiration_date > ?)`
        ).bind(
          allocation.take,
          allocation.id,
          params.userId,
          allocation.remainingAmount,
          now.getTime()
        ),
        env.DB.prepare(
          `INSERT INTO credit_guard(ok)
           SELECT CASE WHEN changes() = 1 THEN 1 ELSE 0 END`
        )
      );
    }

    statements.push(
      env.DB.prepare(
        `UPDATE user_credit
         SET current_credits = current_credits - ?, updated_at = ?
         WHERE user_id = ? AND current_credits >= ?`
      ).bind(params.amount, now.getTime(), params.userId, params.amount),
      env.DB.prepare(
        `INSERT INTO credit_guard(ok)
         SELECT CASE WHEN changes() = 1 THEN 1 ELSE 0 END`
      ),
      env.DB.prepare('DELETE FROM credit_guard')
    );

    try {
      await env.DB.batch(statements);
      return { success: true, usageTransactionId: usageId };
    } catch (error) {
      const racedDuplicate = await findTransactionByBizKey(
        params.userId,
        CreditTransactionType.USAGE,
        params.bizKey
      );
      if (racedDuplicate) {
        return { success: true, usageTransactionId: racedDuplicate.id };
      }
      if (!isConstraintError(error) || attempt === MAX_CONFLICT_RETRIES) {
        return {
          success: false,
          code: 'CREDIT_CONFLICT',
          error: 'Credit update conflicted. Please retry.',
        };
      }
      await backoff(attempt);
    }
  }

  return {
    success: false,
    code: 'CREDIT_CONFLICT',
    error: 'Credit update conflicted. Please retry.',
  };
}

export async function refundCredits(
  userId: string,
  usageTransactionId: string,
  reason = 'Failed operation - automatic refund'
): Promise<string> {
  const usage = await env.DB.prepare(
    `SELECT id, user_id AS userId, amount,
            expiration_date AS expirationDate, metadata
     FROM credit_transaction WHERE id = ? AND type = 'USAGE' LIMIT 1`
  )
    .bind(usageTransactionId)
    .first<{
      id: string;
      userId: string;
      amount: number;
      expirationDate: number | null;
      metadata: string | null;
    }>();

  if (!usage || usage.userId !== userId || usage.amount >= 0) {
    throw new Error('Invalid usage transaction for refund');
  }

  const bizKey = `refund:${usageTransactionId}:0`;
  const existing = await findTransactionByBizKey(
    userId,
    CreditTransactionType.REFUND,
    bizKey
  );
  if (existing) return existing.id;

  const now = new Date();
  const amount = Math.abs(usage.amount);
  let allocations: Array<{ amount: number; expirationDate: number | null }> =
    [];
  try {
    allocations = JSON.parse(usage.metadata ?? '[]');
  } catch {
    allocations = [];
  }
  if (allocations.length === 0) {
    allocations = [{ amount, expirationDate: usage.expirationDate }];
  }

  const grouped = new Map<number | null, number>();
  for (const allocation of allocations) {
    const expirationDate =
      allocation.expirationDate && allocation.expirationDate <= now.getTime()
        ? now.getTime() + 24 * 60 * 60 * 1000
        : allocation.expirationDate;
    grouped.set(
      expirationDate,
      (grouped.get(expirationDate) ?? 0) + allocation.amount
    );
  }
  const refunds = Array.from(
    grouped,
    ([expirationDate, refundAmount], index) => ({
      id: nanoid(),
      bizKey: `refund:${usageTransactionId}:${index}`,
      expirationDate,
      amount: refundAmount,
    })
  );

  try {
    const statements: D1PreparedStatement[] = refunds.map((refund) =>
      env.DB.prepare(
        `INSERT INTO credit_transaction
           (id, user_id, type, description, amount, remaining_amount, biz_key,
            related_transaction_id, expiration_date, created_at)
         VALUES (?, ?, 'REFUND', ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        refund.id,
        userId,
        reason,
        refund.amount,
        refund.amount,
        refund.bizKey,
        usageTransactionId,
        refund.expirationDate,
        now.getTime()
      )
    );
    statements.push(
      env.DB.prepare(
        `UPDATE user_credit
         SET current_credits = current_credits + ?, updated_at = ?
         WHERE user_id = ?`
      ).bind(amount, now.getTime(), userId),
      env.DB.prepare(
        `INSERT INTO credit_guard(ok)
         SELECT CASE WHEN changes() = 1 THEN 1 ELSE 0 END`
      ),
      env.DB.prepare('DELETE FROM credit_guard')
    );
    await env.DB.batch(statements);
    return refunds[0].id;
  } catch (error) {
    const raced = await findTransactionByBizKey(
      userId,
      CreditTransactionType.REFUND,
      bizKey
    );
    if (raced) return raced.id;
    throw error;
  }
}

export async function getUserCredits(
  userId: string,
  now = new Date()
): Promise<GetUserCreditsResult> {
  await (await import('./daily')).grantDailyCredits(userId, now);
  await ensureUserCredit(userId);
  await expireUserCredits(userId, now);

  const record = await env.DB.prepare(
    'SELECT current_credits AS balance FROM user_credit WHERE user_id = ?'
  )
    .bind(userId)
    .first<{ balance: number }>();
  const transactions = await env.DB.prepare(
    `SELECT id, user_id AS userId, type, amount,
            remaining_amount AS remainingAmount,
            expiration_date AS expirationDate, created_at AS createdAt,
            description
     FROM credit_transaction WHERE user_id = ? ORDER BY created_at DESC`
  )
    .bind(userId)
    .all<TransactionRow>();
  const usage = await env.DB.prepare(
    `SELECT COALESCE(SUM(
       CASE WHEN type = 'USAGE' THEN ABS(amount)
            WHEN type = 'REFUND' THEN -ABS(amount) ELSE 0 END
     ), 0) AS totalUsed
     FROM credit_transaction WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ totalUsed: number }>();

  return {
    balance: record?.balance ?? 0,
    totalUsed: Math.max(0, Number(usage?.totalUsed ?? 0)),
    transactions: transactions.results.map((transaction) => ({
      id: transaction.id,
      type: transaction.type as CreditTransactionType,
      amount: transaction.amount,
      remaining: transaction.remainingAmount,
      expirationDate: transaction.expirationDate
        ? new Date(transaction.expirationDate)
        : null,
      createdAt: new Date(transaction.createdAt),
      description: transaction.description,
    })),
  };
}

export async function reconcileUserCredits(
  userId: string,
  now = new Date()
): Promise<{ consistent: boolean; balance: number; ledger: number }> {
  await ensureUserCredit(userId);
  await expireUserCredits(userId, now);
  const result = await env.DB.prepare(
    `SELECT uc.current_credits AS balance,
       COALESCE(SUM(CASE
         WHEN ct.remaining_amount > 0
          AND (ct.expiration_date IS NULL OR ct.expiration_date > ?)
         THEN ct.remaining_amount ELSE 0 END), 0) AS ledger
     FROM user_credit uc
     LEFT JOIN credit_transaction ct ON ct.user_id = uc.user_id
     WHERE uc.user_id = ? GROUP BY uc.user_id`
  )
    .bind(now.getTime(), userId)
    .first<{ balance: number; ledger: number }>();
  const balance = Number(result?.balance ?? 0);
  const ledger = Number(result?.ledger ?? 0);
  return { consistent: balance === ledger, balance, ledger };
}
