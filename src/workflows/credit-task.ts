import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from 'cloudflare:workers';
import { executeCreditTask } from '@/credits/workflow-helpers';
import { mockProvider } from '@/tools/mock-provider';
import { kieSkinProvider } from '@/tools/kie-skin-provider';
import { getCreditTask } from '@/credits/tasks';
import { env } from 'cloudflare:workers';

/** Hourly repair of interrupted enqueue/errored Workflow, never sync tasks. */
export async function recoverCreditWorkflows() {
  const tasks = await env.DB.prepare(
    "SELECT id FROM credit_task WHERE workflow_instance_id IS NOT NULL AND status IN ('pending','running','unknown','refund_pending') ORDER BY updated_at LIMIT 100"
  ).all<{ id: string }>();
  for (const task of tasks.results) {
    try {
      const instance = await env.CREDIT_TASK_WORKFLOW.get(task.id);
      const status = await instance.status();
      if (status.status === 'errored' || status.status === 'terminated')
        await instance.restart();
    } catch {
      try {
        await env.CREDIT_TASK_WORKFLOW.create({
          id: task.id,
          params: { taskId: task.id },
        });
      } catch {
        console.error('Credit Workflow recovery failed', task.id);
      }
    } finally {
      // Rotate inspected rows so a bad adapter cannot starve later repairs.
      await env.DB.prepare('UPDATE credit_task SET updated_at=? WHERE id=?')
        .bind(Date.now(), task.id)
        .run();
    }
  }
}

export class CreditTaskWorkflow extends WorkflowEntrypoint<
  Env,
  { taskId: string }
> {
  async run(event: WorkflowEvent<{ taskId: string }>, step: WorkflowStep) {
    const task = await getCreditTask(event.payload.taskId);
    const provider =
      task.toolId === 'demo.mock'
        ? mockProvider
        : task.toolId === 'skin.kie'
          ? import.meta.env.MODE === 'e2e'
            ? mockProvider
            : kieSkinProvider
          : null;
    if (!provider) throw new Error('UNKNOWN_TOOL_ADAPTER');
    const result = await executeCreditTask(task.id, provider, {
      now: () => Date.now(),
      sleep: (ms, name) => step.sleep(name, ms),
      step: (name, run) =>
        step.do(
          name,
          {
            retries: { limit: 3, delay: '5 seconds', backoff: 'exponential' },
            timeout: '5 minutes',
          },
          async () => run()
        ),
    });
    return {
      taskId: result.id,
      status: result.status,
      resultRef: result.resultRef,
    };
  }
}
