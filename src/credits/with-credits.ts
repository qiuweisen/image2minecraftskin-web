import {
  claimTask,
  createCreditTask,
  getCreditTask,
  updateTask,
} from './tasks';
import {
  consumeTaskCredits,
  persistTaskResult,
  refundTaskCredits,
  type TaskResult,
} from './workflow-helpers';

/** Sync run MUST be idempotent by context.idempotencyKey; throws mean confirmed failure. */
export async function runWithCredits(
  input: Parameters<typeof createCreditTask>[0],
  run: (context: {
    taskId: string;
    idempotencyKey: string;
  }) => Promise<TaskResult>
) {
  const task = await createCreditTask(input);
  if (task.status === 'refund_pending')
    return refundTaskCredits(
      task.id,
      task.errorMessage ?? 'Confirmed synchronous failure',
      true
    );
  if (!(await claimTask(task.id, `sync:${crypto.randomUUID()}`)))
    return getCreditTask(task.id);
  let charged: Awaited<ReturnType<typeof consumeTaskCredits>>;
  try {
    charged = await consumeTaskCredits(task.id);
  } catch (error) {
    await updateTask(task.id, {
      status: 'unknown',
      executionOwner: null,
      errorCode: 'CREDIT_RETRY',
      errorMessage: 'Retry credit checkpoint',
    });
    throw error;
  }
  if (charged.status === 'rejected') return charged;
  let result: TaskResult;
  try {
    result = await run({ taskId: task.id, idempotencyKey: task.id });
  } catch {
    return refundTaskCredits(task.id, 'Confirmed synchronous failure', true);
  }
  // Storage failure keeps the charge; same-key retry recovers via idempotent run.
  try {
    return await persistTaskResult(task.id, result);
  } catch (error) {
    await updateTask(task.id, {
      status: 'unknown',
      errorCode: 'RESULT_PERSISTENCE_UNKNOWN',
      errorMessage: 'Result storage pending',
      executionOwner: null,
    });
    throw error;
  }
}
export const withCredits = runWithCredits;
