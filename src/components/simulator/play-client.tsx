'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { clientDynamic } from '@/lib/client-dynamic';

const SessionSummary = clientDynamic(
  () => import('@/components/SessionSummary')
);
const PartnerPromo = clientDynamic(() => import('@/components/PartnerPromo'));
const PARTNER_PROMO_SESSION_COUNTS = new Set([2, 5, 9]);
const PARTNER_PROMO_SESSION_COUNT_KEY = 'cg-partner-promo-session-count';

import Controls from '@/components/Controls';
import PositionCard from '@/components/PositionCard';
import StatsCard from '@/components/StatsCard';
import TradesCard from '@/components/TradesCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  useSessionStore,
  selectEquity,
  selectUnrealized,
  type SessionMode,
} from '@/store/useSessionStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import {
  loadPlaySessionClient,
  preloadPlayManifest,
} from '@/lib/ohlcv/playSessionClient';
import type { PlayChunkLoader } from '@/lib/ohlcv/types';
import { preloadChartPersistence } from '@/lib/chartPersistence';
import { waitForTradingView } from '@/lib/tradingviewLoader';
import { saveCompletedTraining } from '@/lib/training-records';

type MarketCategory = 'stocks' | 'fx' | 'crypto';
type ModeOption = { mode: SessionMode; label: string; hint: string };

const importTradingViewChart = () => import('@/components/TradingViewChart');
const TradingViewChart = clientDynamic(importTradingViewChart);

function getCurrentSearchParams(): URLSearchParams | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search);
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function PlayContent() {
  const [error, setError] = useState<string | null>(null);
  const {
    candles,
    visible,
    loadData,
    appendData,
    position,
    pnlRealized,
    marks,
    symbol,
    interval,
    category,
    sessionMode,
    setCategory,
    setSessionMode,
    restoreSessionState,
    finish,
    reset,
    clearResult,
    summaryOpen,
    lastResult,
  } = useSessionStore(
    (s) => ({
      candles: s.candles,
      visible: s.visible,
      loadData: s.loadData,
      appendData: s.appendData,
      position: s.position,
      pnlRealized: s.pnlRealized,
      marks: s.marks,
      symbol: s.symbol,
      interval: s.interval,
      category: s.category,
      sessionMode: s.sessionMode,
      setCategory: s.setCategory,
      setSessionMode: s.setSessionMode,
      restoreSessionState: s.restoreSessionState,
      finish: s.finish,
      reset: s.reset,
      clearResult: s.clearResult,
      summaryOpen: s.summaryOpen,
      lastResult: s.lastResult,
    }),
    shallow
  );

  const lastClose = useMemo(
    () =>
      visible > 0 && candles.length > 0
        ? candles[Math.min(visible - 1, candles.length - 1)].close
        : 0,
    [candles, visible]
  );
  const visibleCandles = useMemo(() => {
    if (visible <= 0) return [];
    if (visible >= candles.length) return candles;
    return candles.slice(0, visible);
  }, [candles, visible]);
  const unrealized = useSessionStore(selectUnrealized);
  const equity = useSessionStore(selectEquity);
  const { t, lang } = usePlayI18n();
  const modeOptions = useMemo<ModeOption[]>(
    () => [
      {
        mode: 'random-segment',
        label: t('modeRandomSegment'),
        hint: t('modeRandomSegmentHint'),
      },
      {
        mode: 'random-time',
        label: t('modeRandomTime'),
        hint: t('modeRandomTimeHint'),
      },
    ],
    [lang, t]
  );

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [guide, setGuide] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  // Partner promo: trigger when session summary closes.
  const [promoTrigger, setPromoTrigger] = useState(0);
  const [deferredPromoTrigger, setDeferredPromoTrigger] = useState(0);
  const [promoIsProfit, setPromoIsProfit] = useState<boolean | undefined>(
    undefined
  );
  const prevSummaryOpen = useRef(false);
  const summaryResultIsProfit = useRef<boolean | undefined>(undefined);
  const sessionStartedAt = useRef<number | null>(null);
  const loadMoreRef = useRef<PlayChunkLoader | null>(null);
  const loadingMoreRef = useRef(false);
  useEffect(() => {
    if (summaryOpen && lastResult) {
      summaryResultIsProfit.current = lastResult.pnlReal > 0;
    }

    if (prevSummaryOpen.current && !summaryOpen) {
      const isProfit = summaryResultIsProfit.current;
      try {
        const sessionCount =
          Number(
            sessionStorage.getItem(PARTNER_PROMO_SESSION_COUNT_KEY) || '0'
          ) + 1;
        sessionStorage.setItem(
          PARTNER_PROMO_SESSION_COUNT_KEY,
          String(sessionCount)
        );
        if (PARTNER_PROMO_SESSION_COUNTS.has(sessionCount)) {
          setPromoTrigger((t) => t + 1);
          setPromoIsProfit(isProfit);
        }
      } catch {
        setPromoTrigger((t) => t + 1);
        setPromoIsProfit(isProfit);
      }
    }
    prevSummaryOpen.current = summaryOpen;
  }, [summaryOpen, lastResult]);

  useEffect(() => {
    if (promoTrigger === 0 || typeof window === 'undefined') return;

    const idleWindow = window as IdleWindow;
    let cancelled = false;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    const revealPromo = () => {
      timeoutHandle = window.setTimeout(() => {
        if (!cancelled) {
          setDeferredPromoTrigger(promoTrigger);
        }
      }, 700);
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleHandle = idleWindow.requestIdleCallback(revealPromo, {
        timeout: 1600,
      });
    } else {
      revealPromo();
    }

    return () => {
      cancelled = true;
      if (
        idleHandle !== null &&
        typeof idleWindow.cancelIdleCallback === 'function'
      ) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [promoTrigger]);

  // One-time guide: pulse near the Start button (no text)
  useEffect(() => {
    try {
      if (!localStorage.getItem('cg-guide-start')) {
        setGuide(true);
        const id = setTimeout(() => {
          setGuide(false);
          localStorage.setItem('cg-guide-start', '1');
        }, 5000);
        return () => clearTimeout(id);
      }
    } catch {}
  }, []);

  useEffect(() => {
    preloadPlayManifest();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cg-session-mode');
      if (stored === 'random-segment' || stored === 'random-time') {
        useSessionStore.setState({ sessionMode: stored });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cg-session-mode', sessionMode);
    } catch {}
  }, [sessionMode]);

  useEffect(() => {
    if (candles.length === 0) {
      setChartReady(false);
    }
  }, [candles.length]);

  const loadNewSession = useCallback(
    async (restoreVisible?: number) => {
      try {
        loadMoreRef.current = null;
        setHasMoreData(false);
        const searchParams = getCurrentSearchParams();
        const urlSymbol = searchParams?.get('symbol');

        let preferredSymbol: string | undefined;
        let preferredStartTime: string | undefined;
        try {
          const stored = localStorage.getItem('cg-active-session');
          if (stored) {
            const sess = JSON.parse(stored);
            if (sess.category === category && sess.symbol) {
              preferredSymbol = sess.symbol;
              if (sess.startMonth) preferredStartTime = sess.startMonth;
            }
          }
        } catch {}

        const payload = await loadPlaySessionClient({
          category,
          mode: sessionMode,
          preferredSymbol: urlSymbol || preferredSymbol,
          preferredStartTime,
        });

        const initialVisible = restoreVisible ?? payload.initialVisible;
        loadMoreRef.current = payload.loadNextChunk ?? null;
        setHasMoreData(Boolean(payload.loadNextChunk?.hasMore()));
        loadData(
          payload.candles,
          payload.symbol.toUpperCase(),
          payload.interval,
          payload.startMonth,
          initialVisible
        );
      } catch (e) {
        setError((e as Error).message);
        throw e;
      }
    },
    [category, loadData, sessionMode]
  );

  const advanceChartBar = useCallback(async () => {
    const state = useSessionStore.getState();
    if (state.visible < state.candles.length) {
      state.nextBar();
      return;
    }

    const loader = loadMoreRef.current;
    if (!loader || !loader.hasMore() || loadingMoreRef.current) {
      setHasMoreData(Boolean(loader?.hasMore()));
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const rows = await loader.load();
      if (rows.length > 0) {
        appendData(rows);
        setHasMoreData(loader.hasMore());
        // Zustand updates synchronously; reveal exactly one new bar after the
        // next chunk has been appended.
        useSessionStore.getState().nextBar();
      } else {
        loadMoreRef.current = null;
        setHasMoreData(false);
      }
    } catch (loadError) {
      setError((loadError as Error).message || 'Unable to load more history.');
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [appendData]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('cg-active-session');
        if (!stored || candles.length > 0 || loading) return;

        const sess = JSON.parse(stored);
        const sessCategory = (
          ['stocks', 'fx', 'crypto'].includes(sess.category)
            ? sess.category
            : null
        ) as MarketCategory | null;
        if (sessCategory && sessCategory !== category) {
          setCategory(sessCategory);
          return;
        }
        const sessMode: SessionMode =
          sess.sessionMode === 'random-time' ? 'random-time' : 'random-segment';
        if (sessMode !== sessionMode) {
          setSessionMode(sessMode);
          return;
        }

        setLoading(true);
        sessionStartedAt.current = Date.now();
        setChartReady(false);
        setError(null);
        // Start the guest settings request alongside the market data and chart library.
        preloadChartPersistence();
        try {
          await Promise.all([
            loadNewSession(sess.visible),
            waitForTradingView(),
            importTradingViewChart(),
          ]);
          // Restore other trading state after candles loaded
          restoreSessionState(sess);
        } finally {
          setLoading(false);
        }
      } catch {}
    };
    void restoreSession();
  }, [
    candles.length,
    category,
    loadNewSession,
    loading,
    restoreSessionState,
    sessionMode,
    setCategory,
    setSessionMode,
  ]);

  const loadCategory = (cat: MarketCategory) => {
    useSessionStore.getState().dismissSummaryAndReset();
    loadMoreRef.current = null;
    setHasMoreData(false);
    setError(null);
    setCategory(cat);
  };

  const switchSessionMode = (mode: SessionMode) => {
    if (loading || candles.length > 0 || mode === sessionMode) return;
    useSessionStore.getState().dismissSummaryAndReset();
    setError(null);
    setSessionMode(mode);
  };

  const onFinish = () => {
    if (summaryOpen || lastResult) return;
    const result = finish();
    saveCompletedTraining(result, 'play', sessionStartedAt.current);
    try {
      const key = 'cg-sessions';
      const prev = JSON.parse(localStorage.getItem(key) || '[]') as any[];
      localStorage.setItem(key, JSON.stringify([...prev, result]));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
    // Don't reset here anymore - let the user review the summary first
    // reset();
    // try { localStorage.removeItem('cg-active-session'); } catch { }
  };

  const onStart = async () => {
    // 关闭弹窗，清空结果与状态
    useSessionStore.setState({ summaryOpen: false });
    try {
      localStorage.removeItem('cg-active-session');
    } catch {}
    setChartKey((k) => k + 1);
    setChartReady(false);
    sessionStartedAt.current = Date.now();
    clearResult();
    reset();
    loadMoreRef.current = null;
    setHasMoreData(false);
    setLoading(true);
    setError(null);

    try {
      // The chart component will reuse this in-flight request after the candles arrive.
      preloadChartPersistence();
      // Parallel loading: K-line data + TradingView library
      await Promise.all([
        loadNewSession(),
        waitForTradingView(),
        importTradingViewChart(),
      ]);
    } catch (e) {
      // Error already handled in loadNewSession for data errors
      // TradingView timeout error handled here
      if ((e as Error).message?.includes('TradingView')) {
        setError('Chart library failed to load. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryTabs = (compact = false) => (
    <Tabs
      value={category}
      onValueChange={(value) => loadCategory(value as MarketCategory)}
      className={compact ? 'min-w-0 flex-1' : 'w-full'}
    >
      <TabsList className="grid w-full grid-cols-3">
        {(['stocks', 'fx', 'crypto'] as const).map((cat) => (
          <TabsTrigger key={cat} value={cat} disabled={loading}>
            {t(cat)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  const renderModeSelector = (compact = false) => {
    const selectedMode = modeOptions.find(
      (option) => option.mode === sessionMode
    );

    return (
      <div className={compact ? 'space-y-2' : 'space-y-2 pb-1'}>
        <Tabs
          value={sessionMode}
          onValueChange={(value) => switchSessionMode(value as SessionMode)}
        >
          <TabsList className="grid w-full grid-cols-2">
            {modeOptions.map((option) => (
              <TabsTrigger
                key={option.mode}
                value={option.mode}
                disabled={loading || candles.length > 0}
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="px-1 text-[11px] leading-snug text-muted-foreground">
          {selectedMode?.hint}
        </p>
      </div>
    );
  };

  const showStartOverlay = candles.length === 0;
  const showChartLoadingOverlay = candles.length > 0 && !chartReady;

  return (
    <div
      data-play-root
      className="flex h-[100dvh] flex-col bg-background md:h-[calc(100vh-3.5rem)] md:flex-row md:overflow-hidden"
      suppressHydrationWarning
    >
      {/* Mobile Top Bar */}
      <div className="z-20 flex flex-none items-center justify-between gap-2 border-b border-border bg-background px-3 py-2 md:hidden">
        {renderCategoryTabs(true)}
        <div className="flex-none">
          {candles.length === 0 ? (
            <Button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('cg-guide-start', '1');
                } catch {}
                setGuide(false);
                onStart();
              }}
              disabled={summaryOpen}
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
            >
              {t('startSession')}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onFinish}
              size="sm"
              variant="secondary"
            >
              {t('finish')}
            </Button>
          )}
        </div>
      </div>

      {candles.length === 0 && (
        <div className="z-20 flex-none border-b border-border bg-background px-3 py-2 md:hidden">
          {renderModeSelector(true)}
        </div>
      )}

      {/* Main Chart Area (3/4 of available space) */}
      <section className="relative flex min-h-0 flex-[3] flex-col bg-background">
        {/* Keep TradingView unframed; this wrapper only provides sizing and overlays. */}
        <div className="relative min-h-0 flex-1 w-full">
          {candles.length > 0 && symbol ? (
            <TradingViewChart
              key={chartKey}
              candles={visibleCandles}
              markers={marks}
              symbol={symbol}
              onReadyChange={setChartReady}
            />
          ) : null}

          {/* Overlay when no data */}
          {showStartOverlay && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm">
              <Card className="mx-4 max-w-md bg-card/95 shadow-xl">
                <CardContent className="p-6 text-center sm:p-8">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl text-emerald-600 dark:text-emerald-400">
                    ▶
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {t('playOverlayTitle')}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t('playOverlaySubtitle')}
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => void onStart()}
                    disabled={loading}
                    className="mt-6 w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                  >
                    {loading ? t('loading') : t('startSession')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {showChartLoadingOverlay && (
            <div className="absolute inset-0 z-10 animate-pulse bg-background/95">
              <div className="grid h-full grid-cols-7 gap-px bg-muted/60">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} className="bg-card/80" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Controls (Placed above stats) */}
      <div className="z-20 flex-none border-t border-border bg-background p-2 md:hidden">
        <Controls
          layout="mobile"
          onAdvance={advanceChartBar}
          canAdvance={hasMoreData}
          advancing={loadingMore}
        />
      </div>

      {/* Mobile Stats Area (Bottom, 1/4 space) */}
      <div className="flex-[1] min-h-0 space-y-2 overflow-y-auto border-t border-border bg-muted/30 p-2 pb-[env(safe-area-inset-bottom,20px)] md:hidden">
        <PositionCard
          position={position}
          lastClose={lastClose}
          unrealized={unrealized}
        />
        <StatsCard
          equity={equity}
          unrealized={unrealized}
          realized={pnlRealized}
        />
        <TradesCard />
      </div>

      {/* Desktop Sidebar (Controls) */}
      <aside
        className="hidden h-full min-h-0 w-[440px] flex-shrink-0 overflow-hidden border-l border-border bg-background md:flex"
        suppressHydrationWarning
      >
        <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto p-4">
          <div className="flex-none space-y-4">
            {renderCategoryTabs()}

            {candles.length === 0 && renderModeSelector()}

            {candles.length === 0 ? (
              <div className="relative">
                <Button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.setItem('cg-guide-start', '1');
                    } catch {}
                    setGuide(false);
                    void onStart();
                  }}
                  disabled={summaryOpen}
                  size="lg"
                  className="w-full bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/15 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                >
                  {t('startSession')}
                </Button>
                {guide && !summaryOpen && (
                  <span className="absolute -right-1 -top-1 flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                  </span>
                )}
              </div>
            ) : (
              <Button
                type="button"
                onClick={onFinish}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                {t('finish')}
              </Button>
            )}
          </div>

          <Controls
            afterButtons={null}
            onAdvance={advanceChartBar}
            canAdvance={hasMoreData}
            advancing={loadingMore}
          />

          <PositionCard
            position={position}
            lastClose={lastClose}
            unrealized={unrealized}
          />

          <StatsCard
            equity={equity}
            unrealized={unrealized}
            realized={pnlRealized}
          />

          <TradesCard className="min-h-52 flex-1" />

          <div className="flex-none border-t border-border pt-3 text-center">
            <div className="font-mono text-xs text-muted-foreground">
              {candles.length > 0
                ? `${interval} · ${visible}/${candles.length}`
                : '—'}
            </div>
            {error && (
              <div className="mt-2 rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                {t('loadFailed')}: {error}
              </div>
            )}
          </div>
        </div>
      </aside>

      {summaryOpen ? <SessionSummary /> : null}
      {deferredPromoTrigger > 0 ? (
        <PartnerPromo trigger={deferredPromoTrigger} isProfit={promoIsProfit} />
      ) : null}
    </div>
  );
}

export default function PlayPage() {
  return <PlayContent />;
}
