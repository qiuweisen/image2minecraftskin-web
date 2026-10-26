import { env } from 'cloudflare:workers';
import { nanoid } from 'nanoid';
import { websiteConfig } from '@/config/website';

export interface RedeemCodeResult {
  success: boolean;
  creditsGranted?: number;
  error?: string;
  reason?: string;
}

interface CodeRow {
  id: string;
  code: string;
  creditsAmount: number;
  maxRedemptions: number | null;
  redemptionsCount: number;
  perUserLimit: number;
  expiresAt: number | null;
  creditExpiresAt: number | null;
  creditExpireDays: number | null;
  boundUserId: string | null;
  disabled: number;
}

function constraintError(error: unknown) {
  return error instanceof Error && /constraint|unique/i.test(error.message);
}

export async function redeemCode(
  userId: string,
  codeInput: string,
  now = new Date()
): Promise<RedeemCodeResult> {
  const normalized = codeInput.trim().toUpperCase();
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = await env.DB.prepare(
      `SELECT id,code,credits_amount AS creditsAmount,max_redemptions AS maxRedemptions,
              redemptions_count AS redemptionsCount,per_user_limit AS perUserLimit,
              expires_at AS expiresAt,credit_expires_at AS creditExpiresAt,
              credit_expire_days AS creditExpireDays,bound_user_id AS boundUserId,
              disabled FROM redemption_code WHERE code=? LIMIT 1`
    )
      .bind(normalized)
      .first<CodeRow>();
    if (!code)
      return {
        success: false,
        error: 'Code not found',
        reason: 'invalid_code',
      };
    if (code.disabled)
      return {
        success: false,
        error: 'Code is disabled',
        reason: 'code_disabled',
      };
    if (code.expiresAt !== null && code.expiresAt <= now.getTime()) {
      return {
        success: false,
        error: 'Code has expired',
        reason: 'code_expired',
      };
    }
    if (code.boundUserId && code.boundUserId !== userId) {
      return {
        success: false,
        error: 'This code is not for you',
        reason: 'user_mismatch',
      };
    }
    const count = await env.DB.prepare(
      'SELECT COUNT(*) AS count FROM redemption_record WHERE code_id=? AND user_id=?'
    )
      .bind(code.id, userId)
      .first<{ count: number }>();
    const seq = Number(count?.count ?? 0) + 1;
    if (seq > code.perUserLimit) {
      return {
        success: false,
        error: 'Per-user limit reached',
        reason: 'per_user_limit_reached',
      };
    }
    if (
      code.maxRedemptions !== null &&
      code.redemptionsCount >= code.maxRedemptions
    ) {
      return {
        success: false,
        error: 'Code exhausted',
        reason: 'max_redeemed',
      };
    }
    const txId = nanoid();
    const expiresAt =
      code.creditExpiresAt ??
      now.getTime() +
        (code.creditExpireDays ??
          websiteConfig.credits?.redemptionDefaultExpireDays ??
          90) *
          86_400_000;
    try {
      await env.DB.batch([
        env.DB.prepare(
          `UPDATE redemption_code SET redemptions_count=redemptions_count+1,updated_at=?
           WHERE id=? AND disabled=0 AND (expires_at IS NULL OR expires_at>?)
             AND (bound_user_id IS NULL OR bound_user_id=?)
             AND (max_redemptions IS NULL OR redemptions_count<max_redemptions)
             AND (SELECT COUNT(*) FROM redemption_record WHERE code_id=? AND user_id=?) < per_user_limit`
        ).bind(now.getTime(), code.id, now.getTime(), userId, code.id, userId),
        env.DB.prepare(
          'INSERT INTO credit_guard(ok) SELECT CASE WHEN changes()=1 THEN 1 ELSE 0 END'
        ),
        env.DB.prepare(
          `INSERT INTO redemption_record
           (id,code_id,user_id,seq,credits_granted,credit_transaction_id,created_at)
           VALUES (?,?,?,?,?,?,?)`
        ).bind(
          nanoid(),
          code.id,
          userId,
          seq,
          code.creditsAmount,
          txId,
          now.getTime()
        ),
        env.DB.prepare(
          `INSERT INTO user_credit(id,user_id,current_credits,created_at,updated_at)
           VALUES (?,?,0,?,?) ON CONFLICT(user_id) DO NOTHING`
        ).bind(nanoid(), userId, now.getTime(), now.getTime()),
        env.DB.prepare(
          `INSERT INTO credit_transaction
           (id,user_id,type,description,amount,remaining_amount,biz_key,expiration_date,created_at)
           VALUES (?,?,'REDEMPTION_CODE',?,?,?,?,?,?)`
        ).bind(
          txId,
          userId,
          `Redeemed code: ${code.code}`,
          code.creditsAmount,
          code.creditsAmount,
          `redeem:${code.id}:${seq}`,
          expiresAt,
          now.getTime()
        ),
        env.DB.prepare(
          'UPDATE user_credit SET current_credits=current_credits+?,updated_at=? WHERE user_id=?'
        ).bind(code.creditsAmount, now.getTime(), userId),
        env.DB.prepare(
          'INSERT INTO credit_guard(ok) SELECT CASE WHEN changes()=1 THEN 1 ELSE 0 END'
        ),
        env.DB.prepare('DELETE FROM credit_guard'),
      ]);
      return { success: true, creditsGranted: code.creditsAmount };
    } catch (error) {
      if (!constraintError(error) || attempt === 19) break;
    }
  }
  return {
    success: false,
    error: 'Code limit reached',
    reason: 'limit_reached',
  };
}
