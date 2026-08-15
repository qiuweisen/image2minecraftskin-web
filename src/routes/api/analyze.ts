import { createFileRoute } from '@tanstack/react-router';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { auth } from '@/auth/auth';
import { serverEnv } from '@/env/server';
import { prepareAnalysisPrompt } from '@/lib/analyze-utils';

const DEFAULT_GEMINI_BASE = 'https://generativelanguage.googleapis.com';
const DEFAULT_GEMINI_MODEL = 'gemini-3.7-flash';
const DAILY_AI_ANALYSIS_LIMIT = 10;
const DAILY_LIMIT_TIMEZONE_OFFSET_MS = 8 * 60 * 60 * 1000;
const MAX_REQUEST_BYTES = 256 * 1024;
const MAX_TRADES = 2_000;
const GEMINI_STREAM_TIMEOUT_MS = 30_000;
const GEMINI_NON_STREAM_TIMEOUT_MS = 45_000;
const GEMINI_COMPLETION_RETRIES = 2;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
};

const analysisRequestSchema = z.object({
  trades: z.array(z.unknown()).min(1).max(MAX_TRADES),
  stats: z.unknown(),
  lang: z.string().trim().min(1).max(32).default('en'),
  stream: z.boolean().optional().default(true),
});

type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

type ProviderResult =
  | { response: Response }
  | { errorStatus: number; rateLimited: boolean };

let geminiKeyCursor = 0;

function splitApiKeys(...values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => {
          const normalized = value?.trim() ?? '';
          if (!normalized) return [];

          // Cloudflare secrets are usually comma/newline separated. Accept a
          // JSON array as well so deploying the same value from a secret
          // manager does not silently collapse the pool to one key.
          if (normalized.startsWith('[')) {
            try {
              const parsed = JSON.parse(normalized);
              if (Array.isArray(parsed)) {
                return parsed.filter(
                  (item): item is string => typeof item === 'string'
                );
              }
            } catch {
              // Fall back to the normal delimiter parser below.
            }
          }

          return normalized.split(/[,\n]/);
        })
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter(Boolean)
    )
  );
}

function getGeminiApiKeys() {
  return splitApiKeys(serverEnv.GEMINI_API_KEYS, serverEnv.GEMINI_API_KEY);
}

function getGeminiKeyOrder(apiKeys: string[]) {
  if (apiKeys.length <= 1) return apiKeys;

  const start = geminiKeyCursor % apiKeys.length;
  geminiKeyCursor = (geminiKeyCursor + 1) % apiKeys.length;
  console.info(`[AI] provider=gemini key-slot=${start + 1}/${apiKeys.length}`);
  return apiKeys.map((_, offset) => apiKeys[(start + offset) % apiKeys.length]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getDayStartMs(now = Date.now()) {
  const shifted = new Date(now + DAILY_LIMIT_TIMEZONE_OFFSET_MS);
  const shiftedDayStartUtc = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate()
  );
  return shiftedDayStartUtc - DAILY_LIMIT_TIMEZONE_OFFSET_MS;
}

function getDailyLimitMessage(lang: string) {
  if (lang.toLowerCase().startsWith('zh-hant')) {
    return `今天的 AI 分析次數已用完。每位使用者每天最多可使用 ${DAILY_AI_ANALYSIS_LIMIT} 次 AI 分析。`;
  }
  if (lang.toLowerCase().startsWith('zh')) {
    return `今天的 AI 分析次数已用完。每位用户每天最多可使用 ${DAILY_AI_ANALYSIS_LIMIT} 次 AI 分析。`;
  }
  return `Daily AI analysis limit reached. You can use AI analysis up to ${DAILY_AI_ANALYSIS_LIMIT} times per day.`;
}

async function consumeDailyAiAnalysisQuota(userId: string) {
  const day = getDayStartMs();
  const now = Date.now();

  // The unique (user_id, day) index makes this one atomic counter per user/day.
  const consumed = await env.DB.prepare(
    `
      INSERT INTO ai_analysis_daily_usage
        (id, user_id, day, count, created_at, updated_at)
      VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(user_id, day) DO UPDATE SET
        count = ai_analysis_daily_usage.count + 1,
        updated_at = excluded.updated_at
      WHERE ai_analysis_daily_usage.count < ?
      RETURNING count
    `
  )
    .bind(
      `ai_${crypto.randomUUID()}`,
      userId,
      day,
      now,
      now,
      DAILY_AI_ANALYSIS_LIMIT
    )
    .first<{ count: number }>();

  if (consumed) {
    return { ok: true as const, used: Number(consumed.count) };
  }

  const existing = await env.DB.prepare(
    `
      SELECT count
      FROM ai_analysis_daily_usage
      WHERE user_id = ? AND day = ?
      LIMIT 1
    `
  )
    .bind(userId, day)
    .first<{ count: number }>();

  if (existing && Number(existing.count) >= DAILY_AI_ANALYSIS_LIMIT) {
    return { ok: false as const, used: Number(existing.count) };
  }

  const retry = await env.DB.prepare(
    `
      UPDATE ai_analysis_daily_usage
      SET count = count + 1, updated_at = ?
      WHERE user_id = ? AND day = ? AND count < ?
      RETURNING count
    `
  )
    .bind(now, userId, day, DAILY_AI_ANALYSIS_LIMIT)
    .first<{ count: number }>();

  return retry
    ? { ok: true as const, used: Number(retry.count) }
    : {
        ok: false as const,
        used: Number(existing?.count ?? DAILY_AI_ANALYSIS_LIMIT),
      };
}

function extractTextPart(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (typeof part === 'string') return part;
        if (isRecord(part)) return extractTextPart(part.text);
        return '';
      })
      .join('');
  }
  if (isRecord(value)) return extractTextPart(value.text);
  return '';
}

function extractGeminiText(json: unknown) {
  if (!isRecord(json)) return '';
  const candidates = Array.isArray(json.candidates) ? json.candidates : [];
  const candidate = isRecord(candidates[0]) ? candidates[0] : null;
  const content =
    candidate && isRecord(candidate.content) ? candidate.content : null;
  return content ? extractTextPart(content.parts) : '';
}

function extractGeminiFinishReason(json: unknown) {
  if (!isRecord(json)) return undefined;
  const candidates = Array.isArray(json.candidates) ? json.candidates : [];
  const candidate = isRecord(candidates[0]) ? candidates[0] : null;
  return candidate && typeof candidate.finishReason === 'string'
    ? candidate.finishReason
    : undefined;
}

function extractJsonObjectCandidate(value: string) {
  let text = value.trim();
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) text = fenced[1].trim();

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  return start >= 0 && end > start ? text.slice(start, end + 1) : '';
}

function isCompleteJsonObject(value: string) {
  const candidate = extractJsonObjectCandidate(value);
  if (!candidate) return false;

  try {
    return isRecord(JSON.parse(candidate));
  } catch {
    return false;
  }
}

async function readGeminiCompletion(response: Response) {
  const json = (await response.json().catch(() => null)) as unknown;
  return {
    content: extractGeminiText(json),
    finishReason: extractGeminiFinishReason(json),
  };
}

function isRetryableStatus(status: number, errorText: string) {
  const normalized = errorText.toLowerCase();
  return (
    status === 401 ||
    status === 403 ||
    status === 429 ||
    status >= 500 ||
    normalized.includes('api key not valid') ||
    normalized.includes('invalid api key') ||
    normalized.includes('api_key_invalid') ||
    normalized.includes('rate limit') ||
    normalized.includes('quota')
  );
}

function isRateLimited(status: number, errorText: string) {
  const normalized = errorText.toLowerCase();
  return (
    status === 429 ||
    normalized.includes('rate limit') ||
    normalized.includes('quota')
  );
}

function buildGeminiUrl(model: string, stream: boolean) {
  const base = (serverEnv.GEMINI_API_BASE || DEFAULT_GEMINI_BASE).replace(
    /\/$/,
    ''
  );
  const action = stream ? 'streamGenerateContent' : 'generateContent';
  const query = stream ? '?alt=sse' : '';
  return `${base}/v1beta/models/${encodeURIComponent(model)}:${action}${query}`;
}

function buildGeminiPayload(
  model: string,
  systemMessage: string,
  prompt: string,
  allowJsonMode: boolean
) {
  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: 9600,
  };
  if (model.startsWith('gemini-3')) {
    generationConfig.thinkingConfig = { thinkingLevel: 'low' };
  } else {
    // Keep compatibility with an explicitly configured Gemini 2.x model.
    generationConfig.temperature = 0.4;
  }
  if (allowJsonMode) generationConfig.responseMimeType = 'application/json';

  return {
    systemInstruction: { parts: [{ text: systemMessage }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  };
}

function geminiNeedsJsonModeRetry(status: number, errorText: string) {
  if (status !== 400) return false;
  const normalized = errorText.toLowerCase();
  return (
    normalized.includes('response_mime_type') ||
    normalized.includes('responsemime') ||
    normalized.includes('response schema') ||
    normalized.includes('response_schema')
  );
}

async function callGemini(
  apiKeys: string[],
  systemMessage: string,
  prompt: string,
  stream: boolean,
  clientSignal: AbortSignal
): Promise<ProviderResult> {
  const model = serverEnv.GEMINI_API_MODEL || DEFAULT_GEMINI_MODEL;
  const timeoutMs = stream
    ? GEMINI_STREAM_TIMEOUT_MS
    : GEMINI_NON_STREAM_TIMEOUT_MS;
  const orderedKeys = getGeminiKeyOrder(apiKeys);
  let lastStatus = 503;
  let lastRateLimited = false;

  // Gemini model versions may reject responseMimeType. Retry without it while
  // keeping the prompt's JSON-only requirement.
  for (const allowJsonMode of [true, false]) {
    let shouldRetryWithoutJsonMode = false;

    for (let index = 0; index < orderedKeys.length; index += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const onClientAbort = () => controller.abort();
      clientSignal.addEventListener('abort', onClientAbort);

      try {
        const response = await fetch(buildGeminiUrl(model, stream), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': orderedKeys[index],
          },
          body: JSON.stringify(
            buildGeminiPayload(model, systemMessage, prompt, allowJsonMode)
          ),
          signal: controller.signal,
        });

        if (response.ok) return { response };

        const errorText = await response.text().catch(() => '');
        lastStatus = response.status;
        lastRateLimited = isRateLimited(response.status, errorText);
        console.error(
          `[AI] provider=gemini attempt=${index + 1}/${orderedKeys.length} status=${response.status}`
        );

        if (
          allowJsonMode &&
          geminiNeedsJsonModeRetry(response.status, errorText)
        ) {
          shouldRetryWithoutJsonMode = true;
          break;
        }

        const canRetry =
          index < orderedKeys.length - 1 &&
          isRetryableStatus(response.status, errorText);
        if (!canRetry) break;
      } catch (error) {
        if (clientSignal.aborted) throw error;
        lastStatus = controller.signal.aborted ? 504 : 502;
        lastRateLimited = false;
        console.error(
          `[AI] provider=gemini ${controller.signal.aborted ? 'timeout' : 'network'} attempt=${index + 1}/${orderedKeys.length}`
        );
        if (index >= orderedKeys.length - 1) break;
      } finally {
        clearTimeout(timeout);
        clientSignal.removeEventListener('abort', onClientAbort);
      }
    }

    if (!shouldRetryWithoutJsonMode) break;
  }

  return { errorStatus: lastStatus, rateLimited: lastRateLimited };
}

type CompleteProviderResult =
  | { content: string }
  | {
      errorStatus: number;
      rateLimited: boolean;
      code?: 'INCOMPLETE_AI_RESPONSE';
    };

// The analysis payload is a small, bounded JSON document. Buffering the
// provider's non-stream response lets us validate finishReason and JSON
// completeness before anything reaches the browser.
async function callGeminiUntilComplete(
  apiKeys: string[],
  systemMessage: string,
  prompt: string,
  clientSignal: AbortSignal
): Promise<CompleteProviderResult> {
  let lastFailure: CompleteProviderResult = {
    errorStatus: 502,
    rateLimited: false,
    code: 'INCOMPLETE_AI_RESPONSE',
  };

  for (let retry = 0; retry < GEMINI_COMPLETION_RETRIES; retry += 1) {
    const upstream = await callGemini(
      apiKeys,
      systemMessage,
      prompt,
      false,
      clientSignal
    );

    if (!('response' in upstream)) return upstream;

    const completion = await readGeminiCompletion(upstream.response);
    const isComplete =
      completion.finishReason === 'STOP' &&
      isCompleteJsonObject(completion.content);

    if (isComplete) {
      console.info(
        `[AI] provider=gemini complete retry=${retry + 1}/${GEMINI_COMPLETION_RETRIES} content-length=${completion.content.length}`
      );
      return { content: completion.content };
    }

    console.warn(
      `[AI] provider=gemini incomplete retry=${retry + 1}/${GEMINI_COMPLETION_RETRIES} finish-reason=${completion.finishReason ?? 'UNKNOWN'} content-length=${completion.content.length}`
    );
    lastFailure = {
      errorStatus: 502,
      rateLimited: false,
      code: 'INCOMPLETE_AI_RESPONSE',
    };
  }

  return lastFailure;
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {}
) {
  return Response.json(
    { code, message, ...extra },
    { status, headers: NO_STORE_HEADERS }
  );
}

function buildGeminiContentStreamResponse(content: string, request: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      if (request.signal.aborted) {
        controller.close();
        return;
      }

      controller.enqueue(encoder.encode(': stream started\n\n'));
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
      );
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ finishReason: 'STOP', complete: true })}\n\n`
        )
      );
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      ...NO_STORE_HEADERS,
      'Cache-Control': 'no-cache, no-store',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  return session?.user?.id ?? null;
}

export const Route = createFileRoute('/api/analyze')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const userId = await getSessionUserId();
          if (!userId)
            return errorResponse(401, 'UNAUTHORIZED', 'Unauthorized');

          const contentLength = Number(request.headers.get('content-length'));
          if (
            Number.isFinite(contentLength) &&
            contentLength > MAX_REQUEST_BYTES
          ) {
            return errorResponse(
              413,
              'REQUEST_TOO_LARGE',
              'Analysis request is too large.'
            );
          }

          const rawBody = await request.text();
          if (rawBody.length > MAX_REQUEST_BYTES) {
            return errorResponse(
              413,
              'REQUEST_TOO_LARGE',
              'Analysis request is too large.'
            );
          }

          let body: unknown;
          try {
            body = JSON.parse(rawBody);
          } catch {
            return errorResponse(
              400,
              'INVALID_JSON',
              'Invalid analysis request.'
            );
          }

          const parsed = analysisRequestSchema.safeParse(body);
          if (!parsed.success || !isRecord(parsed.data.stats)) {
            return errorResponse(
              400,
              'INVALID_ANALYSIS_REQUEST',
              'Invalid analysis request.'
            );
          }

          const data: AnalysisRequest = parsed.data;
          const {
            systemMessage,
            prompt,
            error: promptError,
          } = prepareAnalysisPrompt(
            data.trades as any[],
            data.stats,
            data.lang
          );
          if (promptError) return errorResponse(400, 'NO_TRADES', promptError);

          const apiKeys = getGeminiApiKeys();
          if (apiKeys.length === 0) {
            return errorResponse(
              503,
              'AI_NOT_CONFIGURED',
              'AI analysis is not configured on this environment.'
            );
          }

          const quota = await consumeDailyAiAnalysisQuota(userId);
          if (!quota.ok) {
            return errorResponse(
              429,
              'DAILY_AI_ANALYSIS_LIMIT',
              getDailyLimitMessage(data.lang),
              { limit: DAILY_AI_ANALYSIS_LIMIT, used: quota.used }
            );
          }

          const completion = await callGeminiUntilComplete(
            apiKeys,
            systemMessage,
            prompt,
            request.signal
          );
          if (!('content' in completion)) {
            const isIncomplete = completion.code === 'INCOMPLETE_AI_RESPONSE';
            return errorResponse(
              completion.rateLimited ? 429 : isIncomplete ? 502 : 503,
              completion.rateLimited
                ? 'RATE_LIMIT'
                : isIncomplete
                  ? 'INCOMPLETE_AI_RESPONSE'
                  : 'AI_PROVIDER_ERROR',
              completion.rateLimited
                ? 'AI analysis is temporarily rate limited. Please try again shortly.'
                : isIncomplete
                  ? 'AI analysis returned an incomplete response. Please try again.'
                  : 'AI analysis is temporarily unavailable. Please try again later.'
            );
          }

          if (!data.stream) {
            return Response.json(
              { content: completion.content },
              {
                headers: {
                  ...NO_STORE_HEADERS,
                  'Content-Type': 'application/json',
                },
              }
            );
          }

          return buildGeminiContentStreamResponse(completion.content, request);
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response(null, { status: 204 });
          }
          console.error('[AI] analyze route failed', error);
          return errorResponse(
            500,
            'AI_ANALYSIS_FAILED',
            'AI analysis failed. Please try again later.'
          );
        }
      },
    },
  },
});
