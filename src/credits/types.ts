export enum CreditTransactionType {
  REGISTER_GIFT = 'REGISTER_GIFT',
  SUBSCRIPTION_RENEWAL = 'SUBSCRIPTION_RENEWAL',
  PURCHASE_PACKAGE = 'PURCHASE_PACKAGE',
  REDEMPTION_CODE = 'REDEMPTION_CODE',
  REFUND = 'REFUND',
  USAGE = 'USAGE',
  EXPIRE = 'EXPIRE',
  DAILY_FREE = 'DAILY_FREE',
  ADMIN_ADJUST = 'ADMIN_ADJUST',
}

export enum CreditValidity {
  BILLING_CYCLE = 'BILLING_CYCLE',
  PERMANENT = 'PERMANENT',
}

export const TRANSACTION_VALIDITY_MAP: Record<
  CreditTransactionType,
  CreditValidity
> = {
  [CreditTransactionType.SUBSCRIPTION_RENEWAL]: CreditValidity.BILLING_CYCLE,
  [CreditTransactionType.REGISTER_GIFT]: CreditValidity.PERMANENT,
  [CreditTransactionType.PURCHASE_PACKAGE]: CreditValidity.PERMANENT,
  [CreditTransactionType.REDEMPTION_CODE]: CreditValidity.PERMANENT,
  [CreditTransactionType.REFUND]: CreditValidity.PERMANENT,
  [CreditTransactionType.USAGE]: CreditValidity.PERMANENT,
  [CreditTransactionType.EXPIRE]: CreditValidity.PERMANENT,
  [CreditTransactionType.DAILY_FREE]: CreditValidity.BILLING_CYCLE,
  [CreditTransactionType.ADMIN_ADJUST]: CreditValidity.PERMANENT,
};

export type CreditErrorCode =
  | 'INSUFFICIENT_CREDITS'
  | 'CREDIT_CONFLICT'
  | 'INVALID_CREDIT_AMOUNT';
