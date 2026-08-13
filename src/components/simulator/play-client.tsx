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
    const result = finish();
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

  const renderModeSelector = (compact = false) => (
    <div className={`space-y-2 ${compact ? '' : 'mb-1'}`}>
      <div className={`grid grid-cols-2 gap-2 ${compact ? '' : ''}`}>
        {modeOptions.map((opt) => {
          const active = sessionMode === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => switchSessionMode(opt.mode)}
              disabled={loading || candles.length > 0}
              className={`text-left rounded-lg border px-3 py-2 transition-colors ${
                active
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/15 dark:text-emerald-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2a2e39] dark:bg-[#111418] dark:text-slate-300 dark:hover:bg-[#171b22]'
              } ${loading || candles.length > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="text-sm font-semibold leading-tight">
                {opt.label}
              </div>
              <div className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {opt.hint}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const showStartOverlay = candles.length === 0;
  const showChartLoadingOverlay = candles.length > 0 && !chartReady;

  return (
    <div
      data-play-root
      className="flex flex-col md:flex-row h-[100dvh] md:h-[calc(100vh-3.5rem)] md:overflow-hidden bg-slate-50 dark:bg-[#0F0F0F]"
      suppressHydrationWarning
    >
      {/* Mobile Top Bar */}
      <div className="md:hidden flex-none z-20 px-4 py-2 bg-white dark:bg-[#0F0F0F] border-b border-slate-200 dark:border-[#2a2e39] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-fade-right flex-1">
          {(['stocks', 'fx', 'crypto'] as const).map((cat) => (
            <button
              key={cat}
              className={`flex-none px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
              onClick={() => loadCategory(cat)}
              disabled={loading}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        <div className="flex-none">
          {candles.length === 0 ? (
            <button
              onClick={() => {
                try {
                  localStorage.setItem('cg-guide-start', '1');
                } catch {}
                setGuide(false);
                onStart();
              }}
              disabled={summaryOpen}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${summaryOpen ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-700 text-white'}`}
            >
              {t('startSession')}
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-600 text-white shadow-sm"
            >
              {t('finish')}
            </button>
          )}
        </div>
      </div>

      {candles.length === 0 && (
        <div className="md:hidden flex-none z-20 px-4 py-2 bg-white dark:bg-[#0F0F0F] border-b border-slate-200 dark:border-[#2a2e39]">
          {renderModeSelector(true)}
        </div>
      )}

      {/* Main Chart Area (3/4 of available space) */}
      <section className="flex-[3] relative min-h-0 flex flex-col bg-white dark:bg-[#0F0F0F]">
        {/* Chart */}
        <div className="flex-1 relative w-full h-full">
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
            <div
              onClick={loading ? undefined : onStart}
              className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#0F0F0F]/90 backdrop-blur-sm transition-all ${loading ? 'cursor-wait' : 'cursor-pointer hover:bg-slate-100/60 dark:hover:bg-[#1a1a1a]/90'}`}
            >
              <div className="text-center p-8 bg-white dark:bg-[#0F0F0F] rounded-2xl shadow-xl border border-slate-200 dark:border-[#2a2e39] mx-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-emerald-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('playOverlayTitle')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {t('playOverlaySubtitle')}
                </p>
                <div
                  className={`inline-flex items-center px-6 py-3 text-white font-bold rounded-lg transition-colors ${loading ? 'bg-slate-400 dark:bg-slate-600' : 'bg-emerald-700 hover:bg-emerald-800 shadow-lg shadow-emerald-700/20'}`}
                >
                  {loading ? t('loading') : t('startSession')}
                </div>
              </div>
            </div>
          )}

          {showChartLoadingOverlay && (
            <div className="absolute inset-0 z-10 bg-white dark:bg-[#0F0F0F]">
              <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_40%),linear-gradient(180deg,rgba(148,163,184,0.12),transparent)] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_42%),linear-gradient(180deg,rgba(30,41,59,0.45),transparent)]">
                <div className="grid h-full grid-cols-7 gap-px bg-slate-100/80 dark:bg-[#171b22]">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <div key={i} className="bg-white/70 dark:bg-[#111418]/85" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Controls (Placed above stats) */}
      <div className="md:hidden flex-none z-20 bg-white dark:bg-[#0F0F0F] border-t border-slate-200 dark:border-[#2a2e39] p-2">
        <Controls
          layout="mobile"
          onAdvance={advanceChartBar}
          canAdvance={hasMoreData}
          advancing={loadingMore}
        />
      </div>

      {/* Mobile Stats Area (Bottom, 1/4 space) */}
      <div className="md:hidden flex-[1] min-h-0 overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-[#0F0F0F]/50 p-2 pb-[env(safe-area-inset-bottom,20px)] space-y-2 border-t border-slate-200 dark:border-[#2a2e39]">
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
        className="hidden md:flex w-[440px] flex-shrink-0 h-full min-h-0 overflow-hidden border-l border-slate-200 dark:border-[#2a2e39] bg-white dark:bg-[#0F0F0F]"
        suppressHydrationWarning
      >
        <div className="flex h-full min-h-0 flex-col p-4 bg-white dark:bg-[#0F0F0F]">
          {/* Desktop Top Controls */}
          <div className="flex-none space-y-4">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2e39] rounded-lg">
                {(['stocks', 'fx', 'crypto'] as const).map((cat) => (
                  <button
                    key={cat}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${category === cat ? 'bg-white dark:bg-[#3a3f4b] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
                    onClick={() => loadCategory(cat)}
                    disabled={loading}
                  >
                    {t(cat)}
                  </button>
                ))}
              </div>

              {candles.length === 0 && renderModeSelector()}

              {candles.length === 0 ? (
                <div className="relative group">
                  <button
                    onClick={() => {
                      try {
                        localStorage.setItem('cg-guide-start', '1');
                      } catch {}
                      setGuide(false);
                      onStart();
                    }}
                    disabled={summaryOpen}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${summaryOpen ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 hover:shadow-emerald-700/25 active:scale-[0.98]'}`}
                  >
                    {t('startSession')}
                  </button>
                  {/* Guide Pulse */}
                  {guide && !summaryOpen && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={onFinish}
                  className="w-full py-3 rounded-xl font-bold text-white bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-lg transition-all active:scale-[0.98]"
                >
                  {t('finish')}
                </button>
              )}
            </div>

            {/* Main Controls */}
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
          </div>

          <div className="flex-1 min-h-0 pt-4">
            <TradesCard className="h-full min-h-0" />
          </div>

          {/* Info Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#2a2e39] text-center flex-none">
            <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
              {candles.length > 0
                ? `${interval} · ${visible}/${candles.length}`
                : '—'}
            </div>
            {error && (
              <div className="mt-2 text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-900/20 py-1 px-2 rounded">
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
