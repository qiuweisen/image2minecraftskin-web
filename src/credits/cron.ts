import { expireUserCredits } from './ledger';
import { env } from 'cloudflare:workers';
export async function runCreditsCron(now = new Date()) {
  const users = await env.DB.prepare(
    `SELECT DISTINCT user_id AS userId FROM credit_transaction WHERE remaining_amount>0 AND expiration_date IS NOT NULL AND expiration_date<=? LIMIT 500`
  )
    .bind(now.getTime())
    .all<{ userId: string }>();
  for (const row of users.results) await expireUserCredits(row.userId, now);
  return {
    expiredUsers: users.results.length,
    yearlyGranted: 0,
    inconsistent: 0,
  };
}
