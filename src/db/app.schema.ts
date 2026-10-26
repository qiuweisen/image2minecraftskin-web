/**
 * Application database schema (non-auth tables).
 * Add your app tables here; keep Better Auth tables in auth.schema.ts.
 */

import { relations, sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';
import type { PaymentScene, PaymentStatus, PaymentType, PlanInterval } from '@/payment/types';

/** 
 * Payment: subscription and one-time 
 */
export const payment = sqliteTable(
  'payment',
  {
    id: text('id').primaryKey(),
    priceId: text('price_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').notNull(),
    subscriptionId: text('subscription_id'),
    sessionId: text('session_id'),
    invoiceId: text('invoice_id').unique(),
    type: text('type').notNull().$type<PaymentType>(), // 'subscription' | 'one_time'
    scene: text('scene').$type<PaymentScene>(), // 'subscription' | 'lifetime'
    interval: text('interval').$type<PlanInterval>(), // 'month' | 'year'
    status: text('status').notNull().$type<PaymentStatus>(),
    paid: integer('paid', { mode: 'boolean' }).notNull().default(false),
    periodStart: integer('period_start', { mode: 'timestamp_ms' }),
    periodEnd: integer('period_end', { mode: 'timestamp_ms' }),
    cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }),
    trialStart: integer('trial_start', { mode: 'timestamp_ms' }),
    trialEnd: integer('trial_end', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('payment_user_id_idx').on(table.userId),
    index('payment_customer_id_idx').on(table.customerId),
    index('payment_subscription_id_idx').on(table.subscriptionId),
    index('payment_session_id_idx').on(table.sessionId),
    index('payment_invoice_id_idx').on(table.invoiceId),
    index('payment_paid_idx').on(table.paid),
    index('payment_user_paid_idx').on(table.userId, table.paid),
  ]
);

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, { fields: [payment.userId], references: [user.id] }),
}));

/**
 * User files
 * metadata for files uploaded to R2 (path userfiles/{userId}/xxx);
 * filename = stored name on R2 (e.g. uuid.ext);
 * originalName = user's file name.
 */
export const userFiles = sqliteTable(
  'user_files',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    originalName: text('original_name').notNull(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull(),
    r2Key: text('r2_key').notNull(),
    isPublic: integer('is_public', { mode: 'boolean' }),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('user_files_user_id_idx').on(table.userId),
    index('user_files_r2_key_idx').on(table.r2Key),
  ]
);

export const userFilesRelations = relations(userFiles, ({ one }) => ({
  user: one(user, {
    fields: [userFiles.userId],
    references: [user.id],
  }),
}));

export const aiWaitlist = sqliteTable('ai_waitlist', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  locale: text('locale'),
  notifiedAt: integer('notified_at', { mode: 'timestamp_ms' }),
});


/** Immutable financial/admin audit; IDs survive account deletion. */
export const creditAdminAudit = sqliteTable('credit_admin_audit', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').notNull(),
  userId: text('user_id'),
  action: text('action').notNull(),
  reason: text('reason').notNull(),
  bizKey: text('biz_key').notNull(),
  payload: text('payload').notNull(),
  amount: integer('amount'),
  beforeBalance: integer('before_balance'),
  afterBalance: integer('after_balance'),
  transactionId: text('transaction_id'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
}, (table) => [uniqueIndex('credit_admin_audit_actor_biz_unique').on(table.actorId, table.bizKey), index('credit_admin_audit_user_idx').on(table.userId)]);

/** Generic execution and financial state; results must live in our R2. */
export const creditTask = sqliteTable('credit_task', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  toolId: text('tool_id').notNull(),
  bizKey: text('biz_key').notNull(),
  inputHash: text('input_hash').notNull(),
  inputJson: text('input_json').notNull(),
  cost: integer('cost').notNull(),
  pricingVersion: text('pricing_version').notNull(),
  policyJson: text('policy_json').notNull(),
  status: text('status').notNull().default('pending'),
  usageTransactionId: text('usage_transaction_id'),
  refundTransactionId: text('refund_transaction_id'),
  workflowInstanceId: text('workflow_instance_id'),
  externalJobId: text('external_job_id'),
  inputR2Key: text('input_r2_key'),
  preset: text('preset'),
  providerInputUrl: text('provider_input_url'),
  executionOwner: text('execution_owner'),
  resultRef: text('result_ref'),
  errorCode: text('error_code'),
  errorMessage: text('error_message'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  startedAt: integer('started_at'),
  completedAt: integer('completed_at'),
}, table => [
  uniqueIndex('credit_task_user_biz_unique_idx').on(table.userId, table.bizKey),
  index('credit_task_user_created_idx').on(table.userId, table.createdAt),
  index('credit_task_status_updated_idx').on(table.status, table.updatedAt),
  check('credit_task_positive_cost', sql`${table.cost} > 0`),
  check('credit_task_valid_status', sql`${table.status} IN ('pending','running','unknown','succeeded','failed','rejected','refund_pending')`),
  check('credit_task_success_has_result', sql`${table.status} != 'succeeded' OR ${table.resultRef} IS NOT NULL`),
]);



export const userCredit = sqliteTable(
  'user_credit',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    currentCredits: integer('current_credits').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('user_credit_user_id_idx').on(table.userId),
    check('user_credit_nonnegative_check', sql`${table.currentCredits} >= 0`),
  ]
);

export const creditTransaction = sqliteTable(
  'credit_transaction',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    description: text('description'),
    amount: integer('amount').notNull(),
    remainingAmount: integer('remaining_amount'),
    bizKey: text('biz_key'),
    paymentId: text('payment_id'),
    provider: text('provider'),
    subscriptionId: text('subscription_id'),
    relatedTransactionId: text('related_transaction_id'),
    periodStart: integer('period_start', { mode: 'timestamp_ms' }),
    periodEnd: integer('period_end', { mode: 'timestamp_ms' }),
    expirationDate: integer('expiration_date', { mode: 'timestamp_ms' }),
    expiredAt: integer('expired_at', { mode: 'timestamp_ms' }),
    metadata: text('metadata'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('credit_transaction_user_id_idx').on(table.userId),
    index('credit_transaction_type_idx').on(table.type),
    index('credit_transaction_user_type_idx').on(table.userId, table.type),
    index('credit_transaction_expiration_remaining_idx').on(
      table.expirationDate,
      table.remainingAmount
    ),
    index('credit_transaction_user_expiration_idx').on(
      table.userId,
      table.expirationDate
    ),
    uniqueIndex('credit_transaction_user_type_biz_key_unique_idx').on(
      table.userId,
      table.type,
      table.bizKey
    ),
    uniqueIndex('credit_transaction_related_type_biz_key_unique_idx').on(
      table.relatedTransactionId,
      table.type,
      table.bizKey
    ),
    check(
      'credit_transaction_remaining_nonnegative_check',
      sql`${table.remainingAmount} IS NULL OR ${table.remainingAmount} >= 0`
    ),
  ]
);

export const creditGuard = sqliteTable(
  'credit_guard',
  { ok: integer('ok').notNull() },
  (table) => [check('credit_guard_ok_check', sql`${table.ok} = 1`)]
);

export const userCreditRelations = relations(userCredit, ({ one, many }) => ({
  user: one(user, { fields: [userCredit.userId], references: [user.id] }),
  transactions: many(creditTransaction),
}));

export const creditTransactionRelations = relations(
  creditTransaction,
  ({ one }) => ({
    user: one(user, {
      fields: [creditTransaction.userId],
      references: [user.id],
    }),
    relatedTransaction: one(creditTransaction, {
      fields: [creditTransaction.relatedTransactionId],
      references: [creditTransaction.id],
      relationName: 'relatedCreditTransaction',
    }),
  })
);

export const redemptionCode = sqliteTable(
  'redemption_code',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(),
    creditsAmount: integer('credits_amount').notNull(),
    maxRedemptions: integer('max_redemptions'),
    redemptionsCount: integer('redemptions_count').notNull().default(0),
    perUserLimit: integer('per_user_limit').notNull().default(1),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
    creditExpiresAt: integer('credit_expires_at', { mode: 'timestamp_ms' }),
    creditExpireDays: integer('credit_expire_days'),
    boundUserId: text('bound_user_id').references(() => user.id, {
      onDelete: 'cascade',
    }),
    note: text('note'),
    createdBy: text('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    disabled: integer('disabled', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('redemption_code_code_idx').on(table.code),
    index('redemption_code_bound_user_idx').on(table.boundUserId),
    index('redemption_code_disabled_idx').on(table.disabled),
  ]
);

export const redemptionRecord = sqliteTable(
  'redemption_record',
  {
    id: text('id').primaryKey(),
    codeId: text('code_id')
      .notNull()
      .references(() => redemptionCode.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    seq: integer('seq').notNull(),
    creditsGranted: integer('credits_granted').notNull(),
    creditTransactionId: text('credit_transaction_id').references(
      () => creditTransaction.id,
      { onDelete: 'set null' }
    ),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('redemption_record_code_idx').on(table.codeId),
    index('redemption_record_user_idx').on(table.userId),
    index('redemption_record_user_code_idx').on(table.userId, table.codeId),
    uniqueIndex('redemption_record_code_user_seq_unique_idx').on(
      table.codeId,
      table.userId,
      table.seq
    ),
  ]
);
