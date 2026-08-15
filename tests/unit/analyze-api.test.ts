import { beforeEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  db: {
    prepare: vi.fn(),
  },
  dbFirst: vi.fn(),
  getRequestHeaders: vi.fn(),
  getSession: vi.fn(),
  prepareAnalysisPrompt: vi.fn(),
  serverEnv: {
    GEMINI_API_BASE: 'http://gemini.local',
    GEMINI_API_KEY: undefined,
    GEMINI_API_KEYS: 'local-key-1,local-key-2',
    GEMINI_API_MODEL: 'gemini-test',
  },
}));

vi.mock('cloudflare:workers', () => ({
  env: { DB: mocks.db },
}));

vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: mocks.getRequestHeaders,
}));

vi.mock('@/auth/auth', () => ({
  auth: {
    api: {
      getSession: mocks.getSession,
    },
  },
}));

vi.mock('@/env/server', () => ({ serverEnv: mocks.serverEnv }));

vi.mock('@/lib/analyze-utils', () => ({
  prepareAnalysisPrompt: mocks.prepareAnalysisPrompt,
}));

import { Route } from '@/routes/api/analyze';

const postHandler = (Route as any).options.server.handlers.POST as (context: {
  request: Request;
}) => Promise<Response>;

const COMPLETE_ANALYSIS = JSON.stringify({
  personality: { type: 'rabbit' },
  score: 74,
});

function geminiResponse(content: string, finishReason = 'STOP') {
  return new Response(
    JSON.stringify({
      candidates: [
        {
          content: { parts: [{ text: content }] },
          finishReason,
        },
      ],
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

function analysisRequest(stream = true) {
  return new Request('http://localhost/api/analyze', {
    body: JSON.stringify({
      lang: 'en',
      stats: { totalTrades: 1 },
      stream,
      trades: [{ symbol: 'TEST', pnl: 10 }],
    }),
    method: 'POST',
  });
}

describe('AI analysis completion boundary', () => {
  beforeEach(() => {
    mocks.dbFirst.mockResolvedValue({ count: 1 });
    mocks.db.prepare.mockImplementation(() => ({
      bind: vi.fn(() => ({ first: mocks.dbFirst })),
    }));
    mocks.getRequestHeaders.mockReturnValue(new Headers());
    mocks.getSession.mockResolvedValue({ user: { id: 'local-user' } });
    mocks.prepareAnalysisPrompt.mockReturnValue({
      prompt: 'local prompt',
      systemMessage: 'local system message',
    });
    mocks.serverEnv.GEMINI_API_BASE = 'http://gemini.local';
    vi.unstubAllGlobals();
  });

  test('returns a validated complete response through the SSE contract', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(geminiResponse(COMPLETE_ANALYSIS));
    vi.stubGlobal('fetch', fetchMock);

    const response = await postHandler({ request: analysisRequest() });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/event-stream');
    expect(body).toContain(JSON.stringify({ content: COMPLETE_ANALYSIS }));
    expect(body).toContain(
      JSON.stringify({ finishReason: 'STOP', complete: true })
    );
    expect(body).toContain('data: [DONE]');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'http://gemini.local/v1beta/models/gemini-test:generateContent'
    );
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(requestInit.body))).toMatchObject({
      generationConfig: { maxOutputTokens: 9600 },
    });
  });

  test('retries a truncated MAX_TOKENS response and returns the next complete response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        geminiResponse('{"personality":{"type":"rabbit"', 'MAX_TOKENS')
      )
      .mockResolvedValueOnce(geminiResponse(COMPLETE_ANALYSIS));
    vi.stubGlobal('fetch', fetchMock);

    const response = await postHandler({ request: analysisRequest(false) });
    const body = (await response.json()) as { content?: string };

    expect(response.status).toBe(200);
    expect(body.content).toBe(COMPLETE_ANALYSIS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('does not expose an incomplete response after retry exhaustion', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(geminiResponse('{"personality":{"type":"rabbit"'));
    vi.stubGlobal('fetch', fetchMock);

    const response = await postHandler({ request: analysisRequest(false) });
    const body = (await response.json()) as { code?: string; content?: string };

    expect(response.status).toBe(502);
    expect(body.code).toBe('INCOMPLETE_AI_RESPONSE');
    expect(body.content).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
