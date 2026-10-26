import { CreditTransactionType } from './types';

export interface CreditExpiryContext {
  expirationDate?: Date;
  periodEnd?: Date;
}

export function resolveCreditExpiry(
  type: CreditTransactionType,
  context: CreditExpiryContext
): Date | undefined {
  if (type === CreditTransactionType.SUBSCRIPTION_RENEWAL) {
    if (!context.periodEnd) {
      throw new Error('Subscription credits require a billing period end');
    }
    return context.periodEnd;
  }

  return context.expirationDate;
}
