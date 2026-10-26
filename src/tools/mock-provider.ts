import type { TaskProvider } from '@/credits/workflow-helpers';

/** Deterministic local provider. It never calls paid AI services. */
export const mockProvider: TaskProvider = {
  async submit(task) {
    return { jobId: task.id };
  },
  async poll(task, _jobId, attempt) {
    const input = JSON.parse(task.inputJson) as { scenario?: string };
    if (input.scenario === 'failure')
      return { status: 'failed', error: 'Mock provider confirmed failure' };
    if (
      input.scenario === 'unknown' ||
      (input.scenario === 'unknown-success' && attempt < 2)
    )
      return { status: 'unknown' };
    const png = Uint8Array.from(
      atob(
        'iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAQAAAC1+jfqAAAAI0lEQVR42mP8z8Dwn4GBgYGJgYGB4T8MDAwMDAwMDAwMAAAASUVORK5CYII='
      ),
      (c) => c.charCodeAt(0)
    );
    return {
      status: 'succeeded',
      result: { body: png.buffer, contentType: 'image/png' },
    };
  },
};
