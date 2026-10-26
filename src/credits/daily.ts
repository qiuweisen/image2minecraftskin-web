import { websiteConfig } from '@/config/website';
import { addCredits } from './ledger';
import { CreditTransactionType } from './types';

/** Lazy UTC-day grant, using the existing batch/idempotency authority. */
export async function grantDailyCredits(userId: string, now = new Date()) {
  const config = websiteConfig.credits;
  if (!config?.enable || !config.dailyFree?.enable) return;
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  return addCredits({
    userId,
    amount: config.dailyFree.amount,
    type: CreditTransactionType.DAILY_FREE,
    bizKey: `daily:${start.toISOString().slice(0, 10)}`,
    description: 'Daily free credits',
    periodStart: start,
    periodEnd: new Date(start.getTime() + 86400000),
    expirationDate: new Date(start.getTime() + 86400000),
    now,
  });
}
