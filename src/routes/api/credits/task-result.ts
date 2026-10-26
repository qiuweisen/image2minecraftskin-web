import { env } from 'cloudflare:workers';
import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/auth/auth';
import { getCreditTask } from '@/credits/tasks';

export const Route = createFileRoute('/api/credits/task-result')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user)
          return new Response('Unauthorized', { status: 401 });
        const taskId = new URL(request.url).searchParams.get('taskId');
        const download =
          new URL(request.url).searchParams.get('download') === '1';
        if (!taskId) return new Response('Not found', { status: 404 });
        try {
          const task = await getCreditTask(taskId, session.user.id);
          if (task.status !== 'succeeded' || !task.resultRef)
            return new Response('Result not ready', { status: 409 });
          const object = await env.BUCKET.get(task.resultRef);
          if (!object) return new Response('Not found', { status: 404 });
          const headers = new Headers({
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
            'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="minecraft-skin-${task.id}.png"`,
          });
          object.writeHttpMetadata(headers);
          return new Response(object.body, { headers });
        } catch {
          return new Response('Not found', { status: 404 });
        }
      },
    },
  },
});
