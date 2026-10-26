import { env } from 'cloudflare:workers';
import { consumeCredits, refundCredits } from './ledger';
import {
  getCreditTask,
  isTerminal,
  updateTask,
  type CreditTask,
  type TaskPolicy,
} from './tasks';

export type TaskResult =
  | { body: string | ArrayBuffer; contentType: string }
  | { url: string; contentType: string };
export type ProviderStatus =
  | { status: 'pending' | 'unknown' }
  | { status: 'failed'; error: string }
  | { status: 'succeeded'; result: TaskResult };
/** submit MUST be idempotent for task.id, including retries after unknown responses. */
export interface TaskProvider {
  submit(task: CreditTask, signal: AbortSignal): Promise<{ jobId: string }>;
  poll(
    task: CreditTask,
    jobId: string,
    attempt: number,
    signal: AbortSignal
  ): Promise<ProviderStatus>;
}
export interface TaskRuntime {
  now(): number;
  sleep(ms: number, name: string): Promise<void>;
  step?<T extends Rpc.Serializable<T>>(
    name: string,
    run: () => Promise<T>
  ): Promise<T>;
}
const realRuntime: TaskRuntime = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

export async function consumeTaskCredits(id: string) {
  const task = await getCreditTask(id);
  if (isTerminal(task) || task.status === 'refund_pending') return task;
  const consumed = await consumeCredits({
    userId: task.userId,
    amount: task.cost,
    bizKey: `task:${task.id}`,
    description: `Tool ${task.toolId}, task ${task.id}`,
  });
  if (!consumed.success || !consumed.usageTransactionId) {
    if (consumed.code === 'INSUFFICIENT_CREDITS') {
      await updateTask(id, {
        status: 'rejected',
        errorCode: consumed.code,
        errorMessage: 'Insufficient credits',
        completedAt: Date.now(),
      });
      return getCreditTask(id);
    }
    throw new Error(consumed.code ?? 'CREDIT_CONFLICT');
  }
  await updateTask(id, {
    usageTransactionId: consumed.usageTransactionId,
    status: 'running',
    startedAt: task.startedAt ?? Date.now(),
  });
  return getCreditTask(id);
}
export async function refundTaskCredits(
  id: string,
  reason: string,
  confirmed = false
) {
  const task = await getCreditTask(id);
  if (isTerminal(task)) return task;
  if (!confirmed && task.status !== 'refund_pending')
    throw new Error('REFUND_NOT_CONFIRMED');
  // Recover a charge committed before the workflow checkpoint/task write.
  const usageId =
    task.usageTransactionId ??
    (
      await env.DB.prepare(
        `SELECT id FROM credit_transaction WHERE user_id=? AND type='USAGE' AND biz_key=?`
      )
        .bind(task.userId, `task:${id}`)
        .first<{ id: string }>()
    )?.id;
  if (!usageId) throw new Error('REFUND_WITHOUT_CHARGE');
  await updateTask(id, {
    status: 'refund_pending',
    usageTransactionId: usageId,
    errorCode: 'TASK_FAILED',
    errorMessage: reason.slice(0, 300),
  });
  // Deliberately propagate failures; step retries must not declare a false refund.
  const refundId = await refundCredits(
    task.userId,
    usageId,
    `Task ${id} failed: ${reason.slice(0, 200)}`
  );
  await updateTask(id, {
    status: 'failed',
    refundTransactionId: refundId,
    completedAt: Date.now(),
  });
  return getCreditTask(id);
}
export async function persistTaskResult(id: string, result: TaskResult) {
  const task = await getCreditTask(id);
  if (isTerminal(task)) return task;
  const key = `credit-tasks/${task.userId}/${id}/result`;
  // Stable object key makes write replay safe. No external URL is a success result.
  if ('url' in result) {
    const response = await fetch(result.url, {
      signal: AbortSignal.timeout(120000),
    });
    if (!response.ok || !response.body)
      throw new Error('RESULT_DOWNLOAD_FAILED');
    await env.BUCKET.put(key, response.body, {
      httpMetadata: { contentType: result.contentType },
    });
  } else
    await env.BUCKET.put(key, result.body, {
      httpMetadata: { contentType: result.contentType },
    });
  if (!(await env.BUCKET.head(key))) throw new Error('R2_RESULT_NOT_PERSISTED');
  await updateTask(id, {
    status: 'succeeded',
    resultRef: key,
    errorCode: null,
    errorMessage: null,
    completedAt: Date.now(),
  });
  return getCreditTask(id);
}
async function timed<T>(
  ms: number,
  run: (signal: AbortSignal) => Promise<T>
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      run(controller.signal),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error('PROVIDER_TIMEOUT'));
        }, ms);
      }),
    ]);
  } finally {
    clearTimeout(timer!);
  }
}

/** Borrowed app step lifecycle; unknown provider outcomes keep the charge. */
export async function executeCreditTask(
  id: string,
  provider: TaskProvider,
  runtime: TaskRuntime = realRuntime
) {
  const step =
    runtime.step ??
    (async <T extends Rpc.Serializable<T>>(
      _name: string,
      run: () => Promise<T>
    ) => run());
  let task = await getCreditTask(id);
  if (isTerminal(task)) return task;
  if (task.status === 'refund_pending')
    return step('refund-credits', () =>
      refundTaskCredits(id, task.errorMessage ?? 'Task failed')
    );
  task = await step('consume-credits', () => consumeTaskCredits(id));
  if (isTerminal(task)) return task;
  const policy = JSON.parse(task.policyJson) as TaskPolicy;
  const deadline = (task.startedAt ?? task.createdAt) + policy.maxWindowMs;
  let attempt = 0;
  while (runtime.now() < deadline) {
    task = await getCreditTask(id);
    if (isTerminal(task)) return task;
    try {
      if (!task.externalJobId) {
        const submission = await step(`submit-${attempt}`, () =>
          timed(policy.providerTimeoutMs, (signal) =>
            provider.submit(task, signal)
          )
        );
        await step(`save-job-${attempt}`, () =>
          updateTask(id, { externalJobId: submission.jobId })
        );
        task = await getCreditTask(id);
      }
      // Provider bytes never cross the Workflow checkpoint's output-size limit.
      // Persist inside this retryable step, checkpoint only the small task record.
      const outcome = await step(`poll-${attempt}`, async () => {
        const status = await timed(policy.providerTimeoutMs, (signal) =>
          provider.poll(task, task.externalJobId!, attempt, signal)
        );
        if (status.status === 'succeeded')
          return {
            status: 'stored' as const,
            task: await persistTaskResult(id, status.result),
          };
        return status;
      });
      if (outcome.status === 'failed')
        return step('refund-credits', () =>
          refundTaskCredits(id, 'Provider confirmed failure', true)
        );
      if (outcome.status === 'stored') return outcome.task;
      await step(`status-${attempt}`, () =>
        updateTask(id, {
          status: outcome.status === 'unknown' ? 'unknown' : 'running',
        })
      );
    } catch (error) {
      // Network timeout/ambiguous submit/poll/storage is not confirmed failure.
      // Never turn a checkpoint failure after success into a refund.
      task = await getCreditTask(id);
      if (isTerminal(task)) return task;
      if (task.status === 'refund_pending') throw error;
      await step(`unknown-${attempt}`, () =>
        updateTask(id, {
          status: 'unknown',
          errorCode: 'PROVIDER_UNKNOWN',
          errorMessage:
            'Waiting for provider confirmation or result persistence',
        })
      );
    }
    const delay = Math.min(
      policy.maxBackoffMs,
      policy.initialBackoffMs * 2 ** Math.min(attempt, 20),
      deadline - runtime.now()
    );
    await runtime.sleep(Math.max(1, delay), `poll-wait-${attempt}`);
    attempt++;
  }
  task = await getCreditTask(id);
  if (isTerminal(task)) return task;
  if (task.externalJobId) {
    try {
      const final = await timed(policy.providerTimeoutMs, (signal) =>
        provider.poll(task, task.externalJobId!, attempt, signal)
      );
      if (final.status === 'succeeded')
        return persistTaskResult(id, final.result);
      if (final.status === 'failed')
        return refundTaskCredits(id, 'Provider confirmed failure', true);
    } catch {
      // A final ambiguous check does not override bounded-window policy.
    }
  }
  task = await getCreditTask(id);
  if (isTerminal(task)) return task;
  return step('refund-credits', () =>
    refundTaskCredits(id, 'Result unknown after maximum retry window', true)
  );
}
