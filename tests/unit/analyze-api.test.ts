import { beforeEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  db: {
    prepare: vi.fn(),
  },
  dbFirst: vi.fn(),
  getRequestHeaders: vi.fn(),
  getSession: vi.fn(),
  prepareAnalysisPrompt: vi.fn(),
  keyPool: {
    nextKeySlots: vi.fn(),
    reportSuccess: vi.fn(),
    reportFailure: vi.fn(),
  },
  serverEnv: {
    GEMINI_API_BASE: 'http://gemini.local',
    GEMINI_API_KEY: undefined,
    GEMINI_API_KEYS: 'local-key-1,local-key-2',
    GEMINI_API_MODEL: 'gemini-test',
  },
}));

vi.mock('cloudflare:workers', () => ({
  env: { DB: mocks.db, GEMINI_KEY_POOL: mocks.keyPool },
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
  personality: {
    type: 'rabbit',
    emoji: '🐇',
    name: 'Agile Rabbit',
    description: 'Fast and disciplined practice trader.',
  },
  score: 74,
  rank: { stars: 3, title: 'Agile Operator' },
  superpower: 'Fast reaction and disciplined stops',
  weakness: 'Limited profit per trade',
  keyStats: 'Win Rate 75.0% | P/L Ratio 0.73:1 | Expectancy +$145.77',
  badges: [{ emoji: '🧊', name: 'Cold-Blooded Discipline' }],
  tagline: 'Fast entries, fast exits.',
  comparison: 'A compact sample with disciplined execution.',
  riskAssessment: 'Keep position sizing consistent.',
  tradingStyle: 'Short-horizon momentum practice.',
  analysis: {
    strengths: 'Consistent execution.',
    weaknesses: 'Profit targets are too small.',
    actionItem: 'Review reward-to-risk before each entry.',
  },
  improvementPlan: ['Track reward-to-risk', 'Review exits', 'Keep a journal'],
  labels: {
    superpower: 'Superpower',
    weakness: 'Weakness',
    keyStats: 'Key Stats',
    badges: 'Badges',
    tradingStyle: 'Trading Style',
    riskAssessment: 'Risk Assessment',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    actionItem: 'Action Item',
    improvementPlan: 'Improvement Plan',
  },
});

function geminiResponse(content: string, finishReason = 'STOP') {
  return new Response(
    `data: ${JSON.stringify({
      candidates: [
        {
          content: { parts: [{ text: content }] },
          finishReason,
        },
      ],
    })}\n\n`,
    {
      headers: { 'Content-Type': 'text/event-stream' },
      status: 200,
    }
  );
}

function geminiError(status: number, body = 'provider error') {
  return new Response(body, { status });
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
    mocks.keyPool.nextKeySlots.mockResolvedValue({
      slots: [0, 1],
      allCoolingDown: false,
    });
    mocks.keyPool.reportSuccess.mockResolvedValue(undefined);
    mocks.keyPool.reportFailure.mockResolvedValue(undefined);
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
      'http://gemini.local/v1beta/models/gemini-test:streamGenerateContent?alt=sse'
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

  test('fails over to the next key and reports the unhealthy slot', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(geminiError(429, 'quota exceeded'))
      .mockResolvedValueOnce(geminiResponse(COMPLETE_ANALYSIS));
    vi.stubGlobal('fetch', fetchMock);

    const response = await postHandler({ request: analysisRequest(false) });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect((fetchMock.mock.calls[0]?.[1] as RequestInit).headers).toMatchObject(
      { 'x-goog-api-key': 'local-key-1' }
    );
    expect((fetchMock.mock.calls[1]?.[1] as RequestInit).headers).toMatchObject(
      { 'x-goog-api-key': 'local-key-2' }
    );
    expect(mocks.keyPool.reportFailure).toHaveBeenCalledWith(0, 'rate-limit');
    expect(mocks.keyPool.reportSuccess).toHaveBeenCalledWith(1);
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

  test('returns a stream error without triggering a second browser request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(geminiResponse('{"personality":{"type":"rabbit"'));
    vi.stubGlobal('fetch', fetchMock);

    const response = await postHandler({ request: analysisRequest() });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('INCOMPLETE_AI_RESPONSE');
    expect(body).toContain('data: [DONE]');
    expect(body).not.toContain('{"content":');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
