import type { TaskProvider } from '@/credits/workflow-helpers';
import { updateTask } from '@/credits/tasks';
import { env } from 'cloudflare:workers';
import { serverEnv } from '@/env/server';

const endpoint = 'https://api.kie.ai/api/v1/jobs';
const uploadEndpoint = 'https://kieai.redpandaai.co/api/file-base64-upload';

async function publicImageUrl(
  task: Parameters<TaskProvider['submit']>[0],
  apiKey: string
) {
  if (task.providerInputUrl) return task.providerInputUrl;
  if (!task.inputR2Key) throw new Error('KIE_INPUT_MISSING');
  const object = await env.BUCKET.get(task.inputR2Key);
  if (!object) throw new Error('KIE_INPUT_NOT_FOUND');
  const bytes = new Uint8Array(await object.arrayBuffer());
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const imageData = `data:${object.httpMetadata?.contentType ?? 'image/jpeg'};base64,${btoa(binary)}`;
  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Data: imageData,
      uploadPath: 'images/generation-references',
      fileName: `minecraft-skin-reference-${task.id}.jpg`,
    }),
  });
  const body = await response.text();
  if (!response.ok) {
    console.error('KIE reference upload failed', response.status, body);
    throw new Error(`KIE_UPLOAD_${response.status}`);
  }
  const result = JSON.parse(body) as {
    data?: { downloadUrl?: string; fileUrl?: string };
  };
  const url = result.data?.downloadUrl ?? result.data?.fileUrl;
  if (!url) throw new Error('KIE_UPLOAD_MISSING_URL');
  await updateTask(task.id, { providerInputUrl: url });
  return url;
}

export const kieSkinProvider: TaskProvider = {
  async submit(task, signal) {
    if (import.meta.env.MODE === 'e2e') return { jobId: `e2e:${task.id}` };
    const apiKey = serverEnv.KIE_API_KEY;
    if (!apiKey)
      throw new Error('KIE_API_KEY is required when AI skin is enabled');
    const input = JSON.parse(task.inputJson) as {
      inputKey: string;
      preset: string;
    };
    const imageUrl = await publicImageUrl(task, apiKey);
    const requestBody = {
      model: 'nano-banana-2',
      input: {
        prompt: `Create a Minecraft character skin reference sheet from the subject in this user photo. Output ONE square image, plain WHITE background, no text, no labels, no props, no weapons. Layout: FRONT view on the LEFT half, BACK view on the RIGHT half, clear white gap, both figures same height, standing straight, arms relaxed at sides (NO T-pose), orthographic, flat lighting, full body head-to-toe, Steve/Alex cube-head proportions. CRITICAL clothing fidelity: preserve the EXACT outfit type and colors (hoodie stays hoodie, jacket stays jacket); ALWAYS draw opaque pants/trousers AND shoes — NEVER bare legs or skin-colored legs as pants; if the photo is cropped and lower body is missing, invent matching pants + sneakers. Keep hair volume and color. Use large flat color blocks with simple pixel-art shading suitable for a 64x64 Minecraft skin, 8x8-style face, no gradients, no background shadows. Front and back must match in colors, hair, and clothing. Style: ${input.preset}.`,
        image_input: [imageUrl],
        aspect_ratio: '1:1',
        resolution: '1K',
        output_format: 'png',
      },
    };
    const response = await fetch(`${endpoint}/createTask`, {
      method: 'POST',
      signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('KIE createTask failed', response.status, body);
      throw new Error(`KIE_CREATE_${response.status}:${body}`);
    }
    const body = (await response.json()) as {
      code?: number;
      msg?: string;
      data?: { taskId?: string };
      taskId?: string;
    };
    const jobId = body.data?.taskId ?? body.taskId;
    if (body.code !== undefined && body.code !== 200)
      throw new Error(`KIE_CREATE_${body.code}:${body.msg ?? 'failed'}`);
    if (!jobId) throw new Error('KIE_MISSING_TASK_ID');
    return { jobId };
  },
  async poll(_task, jobId, _attempt, signal) {
    if (import.meta.env.MODE === 'e2e' && jobId.startsWith('e2e:')) {
      const startedAt = _task.startedAt ?? _task.createdAt;
      if (Date.now() - startedAt < 40_000) return { status: 'pending' };
      // A tiny valid PNG, deterministic and available only in local E2E mode.
      const png = Uint8Array.from(
        atob(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5l8AAAAASUVORK5CYII='
        ),
        (c) => c.charCodeAt(0)
      );
      return {
        status: 'succeeded',
        result: { body: png.buffer, contentType: 'image/png' },
      };
    }
    const apiKey = serverEnv.KIE_API_KEY;
    if (!apiKey)
      throw new Error('KIE_API_KEY is required when AI skin is enabled');
    const response = await fetch(
      `${endpoint}/recordInfo?taskId=${encodeURIComponent(jobId)}`,
      {
        signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    if (!response.ok) throw new Error(`KIE_POLL_${response.status}`);
    const body = (await response.json()) as {
      msg?: string;
      data?: {
        state?: string;
        resultJson?: string;
        failMsg?: string;
        failCode?: string;
      };
    };
    const data = body.data ?? {};
    if (data.state?.toLowerCase() === 'success') {
      let url: string | undefined;
      try {
        const result = JSON.parse(data.resultJson ?? '') as {
          resultUrls?: string[];
          imageUrls?: string[];
          url?: string;
        };
        url = result.resultUrls?.[0] ?? result.imageUrls?.[0] ?? result.url;
      } catch {
        url = data.resultJson?.match(/https?:\/\/[^"\\\s]+/)?.[0];
      }
      if (!url) return { status: 'failed', error: 'KIE returned no image' };
      return { status: 'succeeded', result: { url, contentType: 'image/png' } };
    }
    if (
      data.state?.toLowerCase() === 'fail' ||
      data.state?.toLowerCase() === 'failed'
    )
      return {
        status: 'failed',
        error:
          data.failMsg ?? data.failCode ?? body.msg ?? 'KIE generation failed',
      };
    return { status: 'pending' };
  },
};
