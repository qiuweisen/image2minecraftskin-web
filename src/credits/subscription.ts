import { addCredits } from './ledger';
import { CreditTransactionType } from './types';
import { websiteConfig } from '@/config/website';

/** Stage A intentionally supports one-time credit packages only. */
export async function grantCreditPackage(input: {
  provider: 'stripe' | 'creem';
  eventId: string;
  userId: string;
  packageId: string;
  amount: number;
  expireDays?: number;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  return addCredits({
    userId: input.userId,
    amount: input.amount,
    type: CreditTransactionType.PURCHASE_PACKAGE,
    bizKey: `pkg:${input.provider}:${input.eventId}`,
    provider: input.provider,
    paymentId: input.eventId,
    expirationDate: input.expireDays
      ? new Date(now.getTime() + input.expireDays * 86_400_000)
      : undefined,
    now,
    description: `Credit package: ${input.packageId}`,
  });
}
export async function processSubscriptionRenewal(): Promise<null> {
  return null;
}
export async function voidSubscriptionCredits(): Promise<number> {
  return 0;
}
export async function grantDueYearlySlices(): Promise<number> {
  return 0;
}
export async function grantSignupCredits(userId: string, now = new Date()) {
  const amount = websiteConfig.credits?.registerGift?.amount ?? 0;
  if (amount <= 0) return null;
  return addCredits({
    userId,
    amount,
    type: CreditTransactionType.REGISTER_GIFT,
    bizKey: `register:${userId}`,
    now,
    expirationDate: websiteConfig.credits?.registerGift?.expireDays
      ? new Date(
          now.getTime() +
            websiteConfig.credits.registerGift.expireDays * 86_400_000
        )
      : undefined,
    description: 'Registration gift',
  });
}
