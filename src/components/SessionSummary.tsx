'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconLoader2,
  IconSparkles,
} from '@tabler/icons-react';
import { useSessionStore, type SessionState } from '@/store/useSessionStore';
import {
  parseAnalysisResponse,
  type AnalysisResult,
} from '@/lib/analyze-utils';
import { markdownToHtml } from '@/lib/legacy-markdown';
import { getSessionSummaryCopy } from '@/lib/sessionSummaryCopy';
import { toLegacySupportedLang } from '@/lib/locale';
import Logo from './Logo';
import AuthModal from './AuthModal';
import { usePlayI18n } from './PlayI18nProvider';
import { useTheme } from './theme/theme-provider';
import { getSimulatorSession } from '@/lib/auth-client-compat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress, ProgressLabel } from '@/components/ui/progress';

type ApiErrorPayload = {
  code?: string;
  message?: string;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function markdownInlineToHtml(markdown: string) {
  return markdownToHtml(markdown)
    .replace(/^<p>/, '')
    .replace(/<\/p>\s*$/, '');
}

function parseApiErrorPayload(raw: string): ApiErrorPayload {
  const text = raw.trim();
  if (!text) return {};

  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (typeof parsed.error === 'string') {
      const nested = parseApiErrorPayload(parsed.error);
      return {
        code:
          nested.code ||
          (typeof parsed.code === 'string' ? parsed.code : undefined),
        message: nested.message || parsed.error,
      };
    }

    return {
      code: typeof parsed.code === 'string' ? parsed.code : undefined,
      message:
        typeof parsed.message === 'string'
          ? parsed.message
          : typeof parsed.error === 'string'
            ? parsed.error
            : undefined,
    };
  } catch {
    return { message: text };
  }
}

function getApiErrorCopy(
  raw: string,
  rateLimitText: string,
  emptyResponseText: string,
  fallbackText: string
) {
  const parsed = parseApiErrorPayload(raw);
  const haystack =
    `${raw} ${parsed.code || ''} ${parsed.message || ''}`.toLowerCase();

  if (
    haystack.includes('rate_limit') ||
    haystack.includes('rate limit') ||
    haystack.includes('1302')
  ) {
    return rateLimitText;
  }

  if (
    haystack.includes('incomplete_ai_response') ||
    haystack.includes('incomplete response')
  ) {
    return fallbackText;
  }

  if (!raw.trim()) {
    return emptyResponseText;
  }

  return parsed.message?.trim() || fallbackText;
}

async function readAnalysisStream(
  response: Response,
  onThinking: (value: string) => void,
  onContent: (value: string) => void
) {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let fullThinking = '';
  let finishReason: string | null = null;
  let complete = false;
  let streamError = '';

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed === 'data: [DONE]' ||
      !trimmed.startsWith('data: ')
    ) {
      return;
    }

    try {
      const json = JSON.parse(trimmed.slice(6)) as {
        thinking?: string;
        content?: string;
        finishReason?: string;
        complete?: boolean;
        error?: string;
      };
      if (typeof json.finishReason === 'string') {
        finishReason = json.finishReason;
      }
      if (json.complete === true) complete = true;
      if (typeof json.error === 'string') streamError = json.error;
      if (json.thinking) {
        fullThinking += json.thinking;
        onThinking(fullThinking);
      }
      if (json.content) {
        fullText += json.content;
        onContent(fullText);
      }
    } catch {
      // Ignore incomplete or comment chunks.
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      processLine(line);
    }
  }

  const trailing = buffer.trim();
  if (trailing) {
    processLine(trailing);
  }

  return { fullText, fullThinking, finishReason, complete, streamError };
}

type SessionStoreHook = <T>(selector: (state: SessionState) => T) => T;

function SessionSummaryInner({
  sessionStore,
}: {
  sessionStore: SessionStoreHook;
}) {
  const result = sessionStore((s) => s.lastResult);
  const open = sessionStore((s) => s.summaryOpen);
  const closeSummary = sessionStore((s) => s.closeSummary);
  const dismissSummaryAndReset = sessionStore((s) => s.dismissSummaryAndReset);
  const { resolvedTheme: theme } = useTheme();
  const { t, lang } = usePlayI18n();
  const [analysis, setAnalysis] = useState<AnalysisResult | string | null>(
    null
  );
  const [parseError, setParseError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [thinkingText, setThinkingText] = useState('');
  const [sharing, setSharing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [showAuthModal, setShowAuthModal] = useState(false);

  const shareRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const analysisAbortRef = useRef<AbortController | null>(null);

  const summaryCopy = useMemo(
    () => getSessionSummaryCopy(toLegacySupportedLang(lang)),
    [lang]
  );
  const hasSuccessfulAnalysis =
    !!analysis && !parseError && typeof analysis === 'object';
  const loadingStage = !loading ? -1 : streamingText ? 2 : thinkingText ? 1 : 0;
  const loadingProgress =
    loadingStage === 0 ? 24 : loadingStage === 1 ? 58 : 86;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      analysisAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const abortAnalysis = () => {
      analysisAbortRef.current?.abort();
    };

    window.addEventListener('pagehide', abortAnalysis);
    window.addEventListener('beforeunload', abortAnalysis);

    return () => {
      window.removeEventListener('pagehide', abortAnalysis);
      window.removeEventListener('beforeunload', abortAnalysis);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      analysisAbortRef.current?.abort();
      setAnalysis(null);
      setParseError(false);
      setLoading(false);
      setStreamingText('');
      setThinkingText('');
      setGeneratedImage(null);
      setCopyStatus('idle');
      setShowAuthModal(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setAnalysis(null);
    setParseError(false);
    setLoading(false);
    setStreamingText('');
    setThinkingText('');
    setGeneratedImage(null);
    setCopyStatus('idle');
    setShowAuthModal(false);
  }, [open, result?.id]);

  const handleAnalyze = async () => {
    if (!result || loading) return;

    const activeSession = await getSimulatorSession();
    if (!activeSession) {
      setShowAuthModal(true);
      return;
    }

    const fallbackText = t('aiAnalysisError');
    const requestPayload = {
      trades: result.trades,
      stats: result,
      lang,
    };

    setLoading(true);
    setParseError(false);
    setStreamingText('');
    setThinkingText('');
    setAnalysis(null);
    setGeneratedImage(null);

    try {
      analysisAbortRef.current?.abort();
      const controller = new AbortController();
      analysisAbortRef.current = controller;

      const streamResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ ...requestPayload, stream: true }),
      });

      if (!streamResponse.ok) {
        const errorText = await streamResponse.text();
        if (streamResponse.status === 401) {
          if (mountedRef.current) setShowAuthModal(true);
          return;
        }
        if (mountedRef.current) {
          setAnalysis(
            getApiErrorCopy(
              errorText,
              summaryCopy.rateLimit,
              summaryCopy.emptyResponse,
              fallbackText
            )
          );
          setParseError(true);
        }
        return;
      }

      const streamed = await readAnalysisStream(
        streamResponse,
        (value) => {
          if (mountedRef.current) setThinkingText(value);
        },
        (value) => {
          if (mountedRef.current) setStreamingText(value);
        }
      );

      if (
        streamed.streamError ||
        (streamed.finishReason && streamed.finishReason !== 'STOP') ||
        (streamed.fullText.trim() && !streamed.complete)
      ) {
        throw new Error('INCOMPLETE_AI_RESPONSE');
      }

      let finalText = streamed.fullText.trim();

      if (!finalText) {
        const fallbackResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ ...requestPayload, stream: false }),
        });

        if (!fallbackResponse.ok) {
          const errorText = await fallbackResponse.text();
          if (fallbackResponse.status === 401) {
            if (mountedRef.current) setShowAuthModal(true);
            return;
          }
          if (mountedRef.current) {
            setAnalysis(
              getApiErrorCopy(
                errorText,
                summaryCopy.rateLimit,
                summaryCopy.emptyResponse,
                fallbackText
              )
            );
            setParseError(true);
          }
          return;
        }

        const fallbackJson = (await fallbackResponse.json()) as {
          content?: unknown;
        };
        finalText =
          typeof fallbackJson.content === 'string'
            ? fallbackJson.content.trim()
            : '';
      }

      if (!finalText) {
        if (mountedRef.current) {
          setAnalysis(
            getApiErrorCopy(
              '',
              summaryCopy.rateLimit,
              summaryCopy.emptyResponse,
              fallbackText
            )
          );
          setParseError(true);
        }
        return;
      }

      const parsed = parseAnalysisResponse(finalText);
      if (mountedRef.current) {
        setAnalysis(parsed.analysis);
        setParseError(parsed.parseError);
        setStreamingText('');
        setThinkingText('');
      }
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return;
      if (mountedRef.current) {
        setAnalysis(
          getApiErrorCopy(
            (error as Error)?.message || '',
            summaryCopy.rateLimit,
            summaryCopy.emptyResponse,
            fallbackText
          )
        );
        setParseError(true);
      }
    } finally {
      analysisAbortRef.current = null;
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    const shareElement = shareRef.current;
    if (!shareElement) return;
    setSharing(true);
    try {
      // Let the report finish its layout before cloning it. The report is
      // rendered off-screen so it never changes the visible simulator layout.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const width = Math.max(1, shareElement.offsetWidth || 520);
      const height = Math.max(
        1,
        shareElement.scrollHeight || shareElement.offsetHeight
      );
      const reportBackground = theme === 'dark' ? '#131722' : '#ffffff';
      const reportForeground = theme === 'dark' ? '#f8fafc' : '#0f172a';

      const canvas = await html2canvas(shareElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: reportBackground,
        logging: false,
        windowWidth: width,
        windowHeight: height,
        width,
        height,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        ignoreElements: (element) =>
          element.tagName === 'IFRAME' ||
          element.hasAttribute('data-html2canvas-ignore'),
        onclone: (_document, clonedElement) => {
          // html2canvas clones the whole document before rendering the target.
          // TradingView's iframe must not be evaluated by that clone, and the
          // report itself must be moved back into the clone's viewport. The
          // TanStarter theme uses oklch CSS variables, which html2canvas 1.x
          // cannot parse, so the cloned document gets screenshot-safe colors.
          const unsupportedColorTest = /(?:oklch|oklab|color-mix)\([^)]*\)/i;
          const unsupportedColor = /(?:oklch|oklab|color-mix)\([^)]*\)/gi;
          const colorCanvas = _document.createElement('canvas');
          colorCanvas.width = 1;
          colorCanvas.height = 1;
          const colorContext = colorCanvas.getContext('2d');

          const fallbackForProperty = (property: string) => {
            if (
              property.includes('image') ||
              property.includes('shadow') ||
              property === 'filter'
            ) {
              return 'none';
            }
            if (property.includes('background')) return reportBackground;
            if (property.includes('border') || property.includes('outline')) {
              return theme === 'dark' ? '#334155' : '#e2e8f0';
            }
            return reportForeground;
          };

          const convertColor = (value: string, property: string) => {
            if (!colorContext) return fallbackForProperty(property);

            try {
              colorContext.clearRect(0, 0, 1, 1);
              colorContext.fillStyle = value;
              colorContext.fillRect(0, 0, 1, 1);
              const [red, green, blue, alpha] = colorContext.getImageData(
                0,
                0,
                1,
                1
              ).data;
              return `rgba(${red}, ${green}, ${blue}, ${(alpha / 255).toFixed(3)})`;
            } catch {
              return fallbackForProperty(property);
            }
          };

          _document.documentElement.style.backgroundColor = reportBackground;
          _document.documentElement.style.color = reportForeground;
          _document.body.style.backgroundColor = reportBackground;
          _document.body.style.color = reportForeground;
          clonedElement.style.position = 'absolute';
          clonedElement.style.left = '0';
          clonedElement.style.top = '0';
          clonedElement.style.margin = '0';
          clonedElement.style.backgroundColor = reportBackground;
          clonedElement.style.color = reportForeground;
          clonedElement.style.visibility = 'visible';
          clonedElement.style.opacity = '1';

          const clonedNodes = [
            clonedElement,
            ...Array.from(clonedElement.querySelectorAll('*')),
          ];
          for (const node of clonedNodes) {
            const computed = _document.defaultView?.getComputedStyle(node);
            if (!computed) continue;

            for (let index = 0; index < computed.length; index += 1) {
              const property = computed.item(index);
              const value = computed.getPropertyValue(property);
              if (!unsupportedColorTest.test(value)) continue;

              const safeValue = value.replace(unsupportedColor, (color) =>
                convertColor(color, property)
              );
              (node as HTMLElement | SVGElement).style.setProperty(
                property,
                safeValue
              );
            }
          }
        },
        removeContainer: true,
      });

      const dataUrl = canvas.toDataURL('image/png');
      if (mountedRef.current) setGeneratedImage(dataUrl);
    } catch (error) {
      console.error('[SessionSummary] Share image generation failed', error);
      if (mountedRef.current) {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    } finally {
      if (mountedRef.current) setSharing(false);
    }
  };

  const handleCopyImage = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `chartmini-analysis-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!result || !open) return null;

  const analysisProseClass =
    'prose prose-sm max-w-none text-slate-700 dark:text-slate-300 prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white prose-ul:my-2 prose-li:my-0.5';

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeSummary();
        }}
      >
        <DialogContent className="flex max-h-[min(90vh,900px)] w-[min(92vw,600px)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0 border-b bg-muted/30 px-6 py-4 pr-14">
            <DialogTitle>
              {generatedImage
                ? t('imageGenerated') || 'Image Ready'
                : t('sessionSummary')}
            </DialogTitle>
            <DialogDescription>
              {t('sessionSummary')}: {result.symbol} · {result.interval}
            </DialogDescription>
          </DialogHeader>

          <div className="custom-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
            {generatedImage ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="relative overflow-hidden rounded-lg border border-slate-200 shadow-2xl dark:border-slate-700">
                  <img
                    src={generatedImage}
                    alt={t('aiAnalysisHeader')}
                    className="h-auto max-h-[50vh] w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <>
                <Card
                  className={`relative overflow-hidden ${result.pnlPct >= 0 ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-950/30' : 'border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-950/30'}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                      {t('pnl')}
                    </div>
                    <div
                      className={`text-4xl font-black tracking-tight ${result.pnlPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                    >
                      {result.pnlPct >= 0 ? '+' : ''}
                      {(result.pnlPct * 100).toFixed(2)}%
                    </div>
                    <Badge
                      variant="outline"
                      className={`mt-2 ${result.pnlReal >= 0 ? 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'}`}
                    >
                      ${fmt(result.pnlReal)}
                    </Badge>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <Card size="sm">
                    <CardContent className="p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        {t('symbol')}
                      </div>
                      <div className="font-mono font-medium">
                        {result.symbol}
                      </div>
                    </CardContent>
                  </Card>
                  <Card size="sm">
                    <CardContent className="p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        {t('interval')}
                      </div>
                      <div className="font-mono font-medium">
                        {result.interval}
                      </div>
                    </CardContent>
                  </Card>
                  <Card size="sm">
                    <CardContent className="p-3">
                      <div className="mb-1 text-xs text-muted-foreground">
                        {t('trades')}
                      </div>
                      <div className="font-mono font-medium">
                        {result.trades.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  {!loading && !analysis && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center dark:border-[#2a2e39] dark:bg-[#11161f]">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('clickToAnalyze')}
                      </p>
                    </div>
                  )}

                  {loading && (
                    <Card size="sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold">
                              {summaryCopy.loadingTitle}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {summaryCopy.loadingSubtitle}
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="font-mono text-[11px]"
                          >
                            {result.symbol} · {result.interval}
                          </Badge>
                        </div>

                        <Progress value={loadingProgress} className="mt-4">
                          <ProgressLabel className="sr-only">
                            {summaryCopy.loadingTitle}
                          </ProgressLabel>
                        </Progress>

                        <div className="mt-4 space-y-2">
                          {summaryCopy.loadingStages.map((stage, index) => {
                            const completed = index < loadingStage;
                            const active = index === loadingStage;

                            return (
                              <div
                                key={stage}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? 'bg-muted/60' : ''}`}
                              >
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${completed ? 'border-emerald-500 bg-emerald-500 text-white' : active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                                >
                                  {completed ? (
                                    <IconCheck className="size-3" />
                                  ) : active ? (
                                    '•'
                                  ) : (
                                    ''
                                  )}
                                </span>
                                <span
                                  className={`${active ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                                >
                                  {stage}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                          {
                            summaryCopy.loadingDetails[
                              Math.max(loadingStage, 0)
                            ]
                          }
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {analysis && !loading && (
                    <Card size="sm">
                      <CardHeader className="px-5 pt-5">
                        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-primary">
                          <IconSparkles className="size-4" />
                          {t('aiAnalysisHeader')}
                        </CardTitle>
                        <CardDescription className="sr-only">
                          {t('aiAnalysisHeader')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 px-5 pb-5">
                        {typeof analysis === 'object' && !parseError ? (
                          <>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-[#2a2e39] dark:bg-[#131722]">
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-3xl">
                                    {analysis.personality?.emoji}
                                  </span>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                      {analysis.personality?.name}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {analysis.personality?.description}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    {analysis.score}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    /100
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm">
                                {'⭐'.repeat(analysis.rank?.stars || 1)}{' '}
                                {analysis.rank?.title}
                              </div>
                            </div>

                            <table className="w-full border-collapse text-sm">
                              <tbody>
                                <tr className="border-b border-slate-200 dark:border-[#2a2e39]">
                                  <td className="py-2 text-slate-500">
                                    💪{' '}
                                    {analysis.labels?.superpower ||
                                      'Superpower'}
                                  </td>
                                  <td className="py-2 text-right font-medium">
                                    {analysis.superpower}
                                  </td>
                                </tr>
                                <tr className="border-b border-slate-200 dark:border-[#2a2e39]">
                                  <td className="py-2 text-slate-500">
                                    ⚠️ {analysis.labels?.weakness || 'Weakness'}
                                  </td>
                                  <td className="py-2 text-right font-medium">
                                    {analysis.weakness}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-500">
                                    📊{' '}
                                    {analysis.labels?.keyStats || 'Key Stats'}
                                  </td>
                                  <td className="py-2 text-right font-mono text-xs">
                                    {analysis.keyStats}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {analysis.badges && analysis.badges.length > 0 && (
                              <div>
                                <div className="mb-2 text-sm font-semibold">
                                  🏅 {analysis.labels?.badges || 'Achievements'}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.badges.map((badge, index) => (
                                    <span
                                      key={`${badge.name}-${index}`}
                                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    >
                                      {badge.emoji} {badge.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {analysis.tagline && (
                              <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-600 dark:text-slate-400">
                                "{analysis.tagline}"
                              </blockquote>
                            )}

                            {analysis.comparison && (
                              <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                                📊 {analysis.comparison}
                              </div>
                            )}

                            {analysis.tradingStyle && (
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-semibold">
                                  🎯{' '}
                                  {analysis.labels?.tradingStyle ||
                                    'Trading Style'}
                                  :
                                </span>{' '}
                                {analysis.tradingStyle}
                              </div>
                            )}

                            {analysis.riskAssessment && (
                              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                                ⚠️{' '}
                                <span className="font-semibold">
                                  {analysis.labels?.riskAssessment ||
                                    'Risk Assessment'}
                                  :
                                </span>{' '}
                                {analysis.riskAssessment}
                              </div>
                            )}

                            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                                <div className="mb-1 font-semibold text-emerald-700 dark:text-emerald-400">
                                  ✓{' '}
                                  {analysis.labels?.strengths ||
                                    'What You Did Well'}
                                </div>
                                <p>{analysis.analysis?.strengths}</p>
                              </div>
                              <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
                                <div className="mb-1 font-semibold text-rose-700 dark:text-rose-400">
                                  ✗{' '}
                                  {analysis.labels?.weaknesses ||
                                    'Needs Improvement'}
                                </div>
                                <p>{analysis.analysis?.weaknesses}</p>
                              </div>
                              <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                                <div className="mb-1 font-semibold text-indigo-700 dark:text-indigo-400">
                                  →{' '}
                                  {analysis.labels?.actionItem || 'Action Item'}
                                </div>
                                <p>{analysis.analysis?.actionItem}</p>
                              </div>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                              <div className="mb-2 text-sm font-semibold">
                                📈 {summaryCopy.roadmapTitle}
                              </div>
                              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
                                {summaryCopy.roadmapSteps.map((step, index) => (
                                  <li
                                    key={`roadmap-${index}`}
                                    dangerouslySetInnerHTML={{
                                      __html: markdownInlineToHtml(step),
                                    }}
                                  />
                                ))}
                              </ol>
                            </div>
                          </>
                        ) : (
                          <div className={analysisProseClass}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: markdownToHtml(
                                  typeof analysis === 'string'
                                    ? analysis
                                    : JSON.stringify(analysis)
                                ),
                              }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter className="m-0 shrink-0 rounded-none border-t px-6 py-4 sm:flex-row sm:justify-end">
            {generatedImage ? (
              <>
                <Button
                  type="button"
                  onClick={handleCopyImage}
                  size="lg"
                  variant={copyStatus === 'success' ? 'default' : 'secondary'}
                  className="flex-1"
                >
                  {copyStatus === 'success' ? <IconCheck /> : <IconCopy />}
                  {copyStatus === 'success'
                    ? t('copySuccess') || 'Copied!'
                    : t('copyImage') || 'Copy Image'}
                </Button>

                <Button
                  type="button"
                  onClick={handleDownloadImage}
                  size="lg"
                  className="flex-1"
                >
                  <IconDownload />
                  {t('downloadImage') || 'Download'}
                </Button>

                <Button
                  type="button"
                  onClick={() => setGeneratedImage(null)}
                  variant="outline"
                  size="icon-lg"
                  aria-label={t('dismiss')}
                >
                  ×
                </Button>
              </>
            ) : (
              <>
                {!hasSuccessfulAnalysis && (
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={loading}
                    size="lg"
                    className="flex-1"
                  >
                    {loading ? (
                      <IconLoader2 className="animate-spin" />
                    ) : (
                      <IconSparkles />
                    )}
                    {loading ? t('analyzing') : t('aiAnalyze')}
                  </Button>
                )}

                {hasSuccessfulAnalysis && (
                  <Button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={sharing}
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                  >
                    {sharing && <IconLoader2 className="animate-spin" />}
                    {sharing
                      ? summaryCopy.generating
                      : t('share') || 'Share Image'}
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    dismissSummaryAndReset();
                  }}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  {t('dismiss')}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showAuthModal ? (
        <AuthModal open onClose={() => setShowAuthModal(false)} />
      ) : null}

      <div className="pointer-events-none fixed left-[9999px] top-0">
        <div
          ref={shareRef}
          className={`relative w-[520px] p-0 font-sans ${theme === 'dark' ? 'bg-[#131722] text-slate-100' : 'bg-white text-slate-900'}`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <div
            className={`flex items-center justify-between border-b px-6 pb-4 pt-6 ${theme === 'dark' ? 'border-[#2a2e39]' : 'border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
              <Logo
                className={`h-7 w-auto ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              />
              <div
                className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {summaryCopy.reportTitle}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
              >
                {result.symbol} · {result.interval}
              </div>
              <div
                className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div
            className={`px-6 py-5 text-center ${theme === 'dark' ? 'bg-[#1e222d]' : 'bg-slate-50'}`}
          >
            <div
              className={`mb-2 text-[10px] font-bold uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
            >
              {t('pnl')}
            </div>
            <div
              className={`text-5xl font-black tracking-tight ${result.pnlPct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {result.pnlPct >= 0 ? '+' : ''}
              {(result.pnlPct * 100).toFixed(2)}%
            </div>
            <div
              className={`mt-2 text-sm font-semibold ${result.pnlReal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              ${fmt(result.pnlReal)}
            </div>
          </div>

          <div
            className={`space-y-4 px-6 py-5 ${theme === 'dark' ? 'bg-[#131722]' : 'bg-white'}`}
          >
            {typeof analysis === 'object' && !parseError && analysis ? (
              <>
                <div
                  className={`flex items-center justify-between border-b pb-3 ${theme === 'dark' ? 'border-[#2a2e39]' : 'border-slate-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {analysis.personality?.emoji}
                    </span>
                    <div>
                      <div
                        className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                      >
                        {analysis.personality?.name}
                      </div>
                      <div
                        className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
                      >
                        {analysis.personality?.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-indigo-500">
                      {analysis.score}
                      <span
                        className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        /100
                      </span>
                    </div>
                    <div
                      className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      {'⭐'.repeat(analysis.rank?.stars || 1)}{' '}
                      {analysis.rank?.title}
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded p-2 text-center font-mono text-[11px] ${theme === 'dark' ? 'bg-[#1e222d] text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                >
                  {analysis.keyStats}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div
                    className={`rounded p-2 text-center ${theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}
                  >
                    <div className="font-semibold text-emerald-600">
                      💪 {analysis.labels?.superpower || 'Superpower'}
                    </div>
                    <div
                      className={`mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      {analysis.superpower}
                    </div>
                  </div>
                  <div
                    className={`rounded p-2 text-center ${theme === 'dark' ? 'bg-rose-900/30' : 'bg-rose-50'}`}
                  >
                    <div className="font-semibold text-rose-600">
                      ⚠️ {analysis.labels?.weakness || 'Weakness'}
                    </div>
                    <div
                      className={`mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      {analysis.weakness}
                    </div>
                  </div>
                </div>

                {analysis.badges && analysis.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {analysis.badges.map((badge, index) => (
                      <span
                        key={`${badge.name}-${index}`}
                        className={`rounded px-2 py-0.5 text-[10px] ${theme === 'dark' ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'}`}
                      >
                        {badge.emoji} {badge.name}
                      </span>
                    ))}
                  </div>
                )}

                {analysis.tagline && (
                  <div
                    className={`border-b border-t py-2 text-center ${theme === 'dark' ? 'border-[#2a2e39]' : 'border-slate-200'}`}
                  >
                    <p className="text-sm italic text-indigo-500">
                      "{analysis.tagline}"
                    </p>
                  </div>
                )}

                {analysis.comparison && (
                  <div
                    className={`rounded p-2 text-[11px] ${theme === 'dark' ? 'bg-indigo-900/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}
                  >
                    📊 {analysis.comparison}
                  </div>
                )}

                <div className="space-y-1 text-[10px]">
                  <div className="text-emerald-600">
                    ✓ {analysis.analysis?.strengths}
                  </div>
                  <div className="text-rose-600">
                    ✗ {analysis.analysis?.weaknesses}
                  </div>
                  <div className="text-indigo-600">
                    → {analysis.analysis?.actionItem}
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`text-[12px] leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {typeof analysis === 'string'
                  ? analysis
                  : summaryCopy.generating}
              </div>
            )}
          </div>

          <div
            className={`flex items-center justify-between border-t px-6 py-5 ${theme === 'dark' ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-slate-200 bg-slate-50'}`}
          >
            <div>
              <p
                className={`mb-1 text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              >
                {summaryCopy.reportCtaTitle}
              </p>
              <p
                className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {summaryCopy.reportCtaSubtitle}
              </p>
              <div className="mt-1.5 font-mono text-[11px] text-indigo-500">
                chartmini.com
              </div>
            </div>
            <div
              className={`rounded-lg p-1.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
            >
              <QRCodeCanvas
                value="https://chartmini.com"
                size={56}
                bgColor={theme === 'dark' ? '#1e293b' : '#ffffff'}
                fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
                level="M"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SessionSummary({
  sessionStore = useSessionStore,
}: {
  sessionStore?: SessionStoreHook;
}) {
  const resultId = sessionStore((s) => s.lastResult?.id || 'session-summary');

  return <SessionSummaryInner key={resultId} sessionStore={sessionStore} />;
}
