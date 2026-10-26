import { env } from 'cloudflare:workers';
import { websiteConfig } from '@/config/website';
import { getToolCost } from './pricing';

export type TaskStatus =
  | 'pending'
  | 'running'
  | 'unknown'
  | 'succeeded'
  | 'failed'
  | 'rejected'
  | 'refund_pending';
export interface TaskPolicy {
  providerTimeoutMs: number;
  maxWindowMs: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
}
export interface CreditTask {
  id: string;
  userId: string;
  toolId: string;
  bizKey: string;
  inputHash: string;
  inputJson: string;
  cost: number;
  pricingVersion: string;
  policyJson: string;
  status: TaskStatus;
  usageTransactionId: string | null;
  refundTransactionId: string | null;
  workflowInstanceId: string | null;
  externalJobId: string | null;
  inputR2Key: string | null;
  preset: string | null;
  providerInputUrl: string | null;
  executionOwner: string | null;
  resultRef: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: number;
  updatedAt: number;
  startedAt: number | null;
  completedAt: number | null;
}
const columns = `id,user_id AS userId,tool_id AS toolId,biz_key AS bizKey,input_hash AS inputHash,input_json AS inputJson,cost,pricing_version AS pricingVersion,policy_json AS policyJson,status,usage_transaction_id AS usageTransactionId,refund_transaction_id AS refundTransactionId,workflow_instance_id AS workflowInstanceId,external_job_id AS externalJobId,input_r2_key AS inputR2Key,preset,provider_input_url AS providerInputUrl,execution_owner AS executionOwner,result_ref AS resultRef,error_code AS errorCode,error_message AS errorMessage,created_at AS createdAt,updated_at AS updatedAt,started_at AS startedAt,completed_at AS completedAt`;

export async function getCreditTask(
  id: string,
  userId?: string
): Promise<CreditTask> {
  const task = await env.DB.prepare(
    `SELECT ${columns} FROM credit_task WHERE id=?${userId ? ' AND user_id=?' : ''}`
  )
    .bind(id, ...(userId ? [userId] : []))
    .first<CreditTask>();
  if (!task) throw new Error('TASK_NOT_FOUND');
  return task;
}
export function publicTask(task: CreditTask) {
  return {
    id: task.id,
    status: task.status,
    cost: task.cost,
    preset: task.preset,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    refundTransactionId: task.refundTransactionId,
  };
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(',')}}`;
  const json = JSON.stringify(value);
  if (json === undefined) throw new Error('INVALID_TASK_INPUT');
  return json;
}
export async function createCreditTask(input: {
  userId: string;
  toolId: string;
  bizKey: string;
  params: Record<string, unknown>;
  inputR2Key?: string;
  preset?: string;
}) {
  if (!websiteConfig.credits?.enable) throw new Error('CREDITS_DISABLED');
  if (!input.bizKey || input.bizKey.length > 128)
    throw new Error('INVALID_BIZ_KEY');
  const inputJson = canonical(input.params);
  if (inputJson.length > 16000) throw new Error('TASK_INPUT_TOO_LARGE');
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(inputJson)
  );
  const inputHash = Array.from(new Uint8Array(digest), (v) =>
    v.toString(16).padStart(2, '0')
  ).join('');
  const existing = await env.DB.prepare(
    `SELECT ${columns} FROM credit_task WHERE user_id=? AND biz_key=?`
  )
    .bind(input.userId, input.bizKey)
    .first<CreditTask>();
  if (existing) {
    if (existing.toolId !== input.toolId || existing.inputHash !== inputHash)
      throw new Error('IDEMPOTENCY_CONFLICT');
    return existing;
  }
  const quote = getToolCost(input.toolId, input.params);
  const policy = websiteConfig.credits.taskPolicy!;
  if (Object.values(policy).some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error('INVALID_TASK_POLICY');
  const id = crypto.randomUUID(),
    now = Date.now();
  await env.DB.prepare(
    `INSERT INTO credit_task(id,user_id,tool_id,biz_key,input_hash,input_json,cost,pricing_version,policy_json,input_r2_key,preset,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,'pending',?,?) ON CONFLICT(user_id,biz_key) DO NOTHING`
  )
    .bind(
      id,
      input.userId,
      input.toolId,
      input.bizKey,
      inputHash,
      inputJson,
      quote.amount,
      quote.pricingVersion,
      JSON.stringify(policy),
      input.inputR2Key ?? null,
      input.preset ?? null,
      now,
      now
    )
    .run();
  const task = await env.DB.prepare(
    `SELECT ${columns} FROM credit_task WHERE user_id=? AND biz_key=?`
  )
    .bind(input.userId, input.bizKey)
    .first<CreditTask>();
  if (!task || task.toolId !== input.toolId || task.inputHash !== inputHash)
    throw new Error('IDEMPOTENCY_CONFLICT');
  return task;
}
export async function claimTask(id: string, owner: string) {
  const result = await env.DB.prepare(
    `UPDATE credit_task SET execution_owner=?,status='running',updated_at=? WHERE id=? AND execution_owner IS NULL AND status IN ('pending','unknown')`
  )
    .bind(owner, Date.now(), id)
    .run();
  return result.meta.changes === 1;
}
export async function updateTask(
  id: string,
  fields: Partial<
    Pick<
      CreditTask,
      | 'status'
      | 'usageTransactionId'
      | 'refundTransactionId'
      | 'externalJobId'
      | 'providerInputUrl'
      | 'resultRef'
      | 'errorCode'
      | 'errorMessage'
      | 'startedAt'
      | 'completedAt'
      | 'workflowInstanceId'
      | 'executionOwner'
    >
  >
) {
  const mapping: Record<string, string> = {
    status: 'status',
    usageTransactionId: 'usage_transaction_id',
    refundTransactionId: 'refund_transaction_id',
    externalJobId: 'external_job_id',
    providerInputUrl: 'provider_input_url',
    resultRef: 'result_ref',
    errorCode: 'error_code',
    errorMessage: 'error_message',
    startedAt: 'started_at',
    completedAt: 'completed_at',
    workflowInstanceId: 'workflow_instance_id',
    executionOwner: 'execution_owner',
  };
  const entries = Object.entries(fields);
  await env.DB.prepare(
    `UPDATE credit_task SET ${entries.map(([k]) => `${mapping[k]}=?`).join(',')},updated_at=? WHERE id=? AND status NOT IN ('succeeded','failed','rejected')`
  )
    .bind(...entries.map(([, v]) => v ?? null), Date.now(), id)
    .run();
}
export const isTerminal = (task: CreditTask) =>
  ['succeeded', 'failed', 'rejected'].includes(task.status);
