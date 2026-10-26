import { env } from 'cloudflare:workers';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import {
  createCreditTask,
  getCreditTask,
  isTerminal,
  publicTask,
  updateTask,
} from '@/credits/tasks';
import { ownsSkinInput } from '@/credits/input-validation';
import { serverEnv } from '@/env/server';

export const startDemoTask = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      bizKey: z.string().min(1).max(128),
      text: z.string().min(1).max(2000),
      scenario: z
        .enum(['success', 'failure', 'unknown-success', 'unknown'])
        .default('success'),
    })
  )
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    if (import.meta.env.MODE !== 'e2e') throw new Error('NOT_FOUND');
    const task = await createCreditTask({
      userId: context.userId,
      toolId: 'demo.mock',
      bizKey: data.bizKey,
      params: { text: data.text, scenario: data.scenario },
    });
    if (!isTerminal(task)) {
      await updateTask(task.id, { workflowInstanceId: task.id });
      // Stable instance ID: concurrent requests cannot enqueue another execution.
      try {
        await env.CREDIT_TASK_WORKFLOW.create({
          id: task.id,
          params: { taskId: task.id },
        });
      } catch (error) {
        // Verify an existing instance instead of swallowing arbitrary enqueue failures.
        const existing = await env.CREDIT_TASK_WORKFLOW.get(task.id);
        try {
          const status = await existing.status();
          if (status.status === 'errored' || status.status === 'terminated')
            await existing.restart();
        } catch {
          throw error;
        }
      }
    }
    return publicTask(await getCreditTask(task.id, context.userId));
  });

export const getCreditTaskStatus = createServerFn({ method: 'GET' })
  .validator(z.object({ taskId: z.string().min(1) }))
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) =>
    publicTask(await getCreditTask(data.taskId, context.userId))
  );

export const listSkinTasks = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().int().min(1).max(50).default(20),
    })
  )
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    let cursor: { createdAt: number; id: string } | undefined;
    if (data.cursor) {
      try {
        cursor = JSON.parse(atob(data.cursor)) as typeof cursor;
        if (!Number.isSafeInteger(cursor?.createdAt) || !cursor?.id)
          throw new Error();
      } catch {
        throw new Error('INVALID_CURSOR');
      }
    }
    const rows = await env.DB.prepare(
      `SELECT id,preset,status,created_at AS createdAt,completed_at AS completedAt,refund_transaction_id AS refundTransactionId FROM credit_task WHERE user_id=? AND tool_id='skin.kie'${cursor ? ' AND (created_at < ? OR (created_at = ? AND id < ?))' : ''} ORDER BY created_at DESC,id DESC LIMIT ?`
    )
      .bind(
        context.userId,
        ...(cursor ? [cursor.createdAt, cursor.createdAt, cursor.id] : []),
        data.limit + 1
      )
      .all<{
        id: string;
        preset: string | null;
        status: string;
        createdAt: number;
        completedAt: number | null;
        refundTransactionId: string | null;
      }>();
    const hasMore = rows.results.length > data.limit;
    const items = rows.results.slice(0, data.limit);
    const last = items.at(-1);
    return {
      items,
      nextCursor:
        hasMore && last
          ? btoa(JSON.stringify({ createdAt: last.createdAt, id: last.id }))
          : null,
    };
  });

export const startSkinTask = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      bizKey: z.string().min(1).max(128),
      inputKey: z.string().min(1).max(512),
      preset: z.string().min(1).max(64),
    })
  )
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    if (serverEnv.AI_SKIN_ENABLED !== 'true')
      throw new Error('AI_SKIN_DISABLED');
    const object = await env.BUCKET.head(data.inputKey);
    if (
      !ownsSkinInput(
        data.inputKey,
        context.userId,
        !!object,
        object?.size ?? 0,
        object?.httpMetadata?.contentType ?? '',
        object?.customMetadata?.ownerId
      )
    )
      throw new Error('INPUT_NOT_OWNED');
    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const [active, daily] = await Promise.all([
      env.DB.prepare(
        "SELECT id FROM credit_task WHERE user_id=? AND tool_id='skin.kie' AND status IN ('pending','running','unknown','refund_pending') AND biz_key<>? LIMIT 1"
      )
        .bind(context.userId, data.bizKey)
        .first<{ id: string }>(),
      env.DB.prepare(
        "SELECT COUNT(*) AS count FROM credit_task WHERE tool_id='skin.kie' AND created_at>=?"
      )
        .bind(dayStart.getTime())
        .first<{ count: number }>(),
    ]);
    if (active) throw new Error('SKIN_TASK_ALREADY_RUNNING');
    if (
      serverEnv.AI_DAILY_MAX_TASKS !== undefined &&
      (daily?.count ?? 0) >= serverEnv.AI_DAILY_MAX_TASKS
    )
      throw new Error('AI_DAILY_CAP_REACHED');
    const task = await createCreditTask({
      userId: context.userId,
      toolId: 'skin.kie',
      bizKey: data.bizKey,
      params: { inputKey: data.inputKey, preset: data.preset },
      inputR2Key: data.inputKey,
      preset: data.preset,
    });
    if (!isTerminal(task)) {
      await updateTask(task.id, { workflowInstanceId: task.id });
      await env.CREDIT_TASK_WORKFLOW.create({
        id: task.id,
        params: { taskId: task.id },
      }).catch(async () => {
        const existing = await env.CREDIT_TASK_WORKFLOW.get(task.id);
        const status = await existing.status();
        if (status.status === 'errored' || status.status === 'terminated')
          await existing.restart();
      });
    }
    return publicTask(await getCreditTask(task.id, context.userId));
  });

export const uploadSkinInput = createServerFn({ method: 'POST' })
  .validator(
    z
      .custom<FormData>((value): value is FormData => value instanceof FormData)
      .transform((form) => {
        const file = form.get('file');
        if (!(file instanceof File)) throw new Error('FILE_REQUIRED');
        return { file };
      })
  )
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    if (serverEnv.AI_SKIN_ENABLED !== 'true')
      throw new Error('AI_SKIN_DISABLED');
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(data.file.type) ||
      data.file.size > 10 * 1024 * 1024
    )
      throw new Error('INVALID_INPUT');
    const key = `credit-inputs/${context.userId}/${crypto.randomUUID()}`;
    await env.BUCKET.put(key, await data.file.arrayBuffer(), {
      httpMetadata: { contentType: data.file.type },
      customMetadata: { ownerId: context.userId },
    });
    return { key };
  });
