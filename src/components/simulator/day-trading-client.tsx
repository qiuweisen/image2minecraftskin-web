'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { clientDynamic } from '@/lib/client-dynamic';
import Controls from '@/components/Controls';
import PositionCard from '@/components/PositionCard';
import StatsCard from '@/components/StatsCard';
import TradesCard from '@/components/TradesCard';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import {
  useDayTradingSessionStore,
  selectDayTradingEquity,
  selectDayTradingUnrealized,
} from '@/store/useDayTradingSessionStore';
import {
  DAY_TRADING_CHART_RESOLUTIONS,
  loadDayTradingSessionClient,
  preloadDayTradingManifest,
} from '@/lib/ohlcv/dayTradingSessionClient';
import type { DayTradingMarket } from '@/lib/ohlcv/dayTradingSessionClient';
import type { Candle } from '@/lib/ohlcv/types';
import type { SessionMode } from '@/store/useSessionStore';
import { nextVisibleForChartResolution } from '@/lib/ohlcv/chartResolution';
import { getDayTradingCopy } from '@/lib/i18n/dayTrading';
import { toLegacySupportedLang } from '@/lib/locale';
import { waitForTradingView } from '@/lib/tradingviewLoader';

const importTradingViewChart = () => import('@/components/TradingViewChart');
const TradingViewChart = clientDynamic(importTradingViewChart);
const SessionSummary = clientDynamic(
  () => import('@/components/SessionSummary')
);
const PartnerPromo = clientDynamic(() => import('@/components/PartnerPromo'));

const SESSION_KEY = 'cg-dt-active-session';
const MODE_KEY = 'cg-dt-session-mode';
const HISTORY_KEY = 'cg-dt-sessions';
const PROMO_COUNT_KEY = 'cg-dt-partner-promo-session-count';
const PROMO_COUNTS = new Set([2, 5, 9]);

function getRequestedMarket(): DayTradingMarket | null {
  if (typeof window === 'undefined') return null;
  const market = new URLSearchParams(window.location.search)
    .get('market')
    ?.toLowerCase();
  if (market === 'forex' || market === 'fx') return 'fx';
  if (market === 'crypto') return 'crypto';
  return null;
}

function DayTradingSimulatorContent() {
  const { t, lang } = usePlayI18n();
  const pageCopy = getDayTradingCopy(toLegacySupportedLang(lang));
  const {
    candles,
    visible,
    position,
    pnlRealized,
    marks,
    symbol,
    category,
    sessionMode,
    summaryOpen,
    lastResult,
    loadData,
    appendData,
    setCategory,
    setSessionMode,
    restoreSessionState,
    finish,
    reset,
    clearResult,
    nextBar,
  } = useDayTradingSessionStore(
    (state) => ({
      candles: state.candles,
      visible: state.visible,
      position: state.position,
      pnlRealized: state.pnlRealized,
      marks: state.marks,
      symbol: state.symbol,
      category: state.category,
      sessionMode: state.sessionMode,
      summaryOpen: state.summaryOpen,
      lastResult: state.lastResult,
      loadData: state.loadData,
      appendData: state.appendData,
      setCategory: state.setCategory,
      setSessionMode: state.setSessionMode,
      restoreSessionState: state.restoreSessionState,
      finish: state.finish,
      reset: state.reset,
      clearResult: state.clearResult,
      nextBar: state.nextBar,
    }),
    shallow
  );

  const [loading, setLoading] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [chartResolution, setChartResolution] = useState('5');
  const [error, setError] = useState<string | null>(null);
  const [promoTrigger, setPromoTrigger] = useState(0);
  const [promoIsProfit, setPromoIsProfit] = useState<boolean | undefined>();
  const [chartHistory, setChartHistory] = useState<Candle[]>([]);
  const restoreStarted = useRef(false);
  const previousSummaryOpen = useRef(false);
  const sessionLoadController = useRef<AbortController | null>(null);
  const earlierHistoryLoader = useRef<null | (() => Promise<Candle[]>)>(null);

  const visibleCandles = useMemo(
    () =>
      visible >= candles.length
        ? candles
        : candles.slice(0, Math.max(0, visible)),
    [candles, visible]
  );
  const chartCandles = useMemo(
    () =>
      chartHistory.length
        ? [...chartHistory, ...visibleCandles]
        : visibleCandles,
    [chartHistory, visibleCandles]
  );
  const currentPrice = useMemo(
    () =>
      visible > 0 && candles.length > 0
        ? candles[Math.min(visible - 1, candles.length - 1)].close
        : 0,
    [candles, visible]
  );
  const equity = useDayTradingSessionStore(selectDayTradingEquity);
  const unrealized = useDayTradingSessionStore(selectDayTradingUnrealized);
  const active = candles.length > 0;
  const selectedMarket: DayTradingMarket = category === 'fx' ? 'fx' : 'crypto';
  const marketLabel = selectedMarket === 'fx' ? t('fx') : t('crypto');
  const advanceChartBar = useCallback(() => {
    const target = nextVisibleForChartResolution(
      candles,
      visible,
      chartResolution
    );
    const count = target - visible;
    if (count > 0) nextBar(count);
  }, [candles, chartResolution, nextBar, visible]);
  const requestEarlierHistory = useCallback(async () => {
    const loader = earlierHistoryLoader.current;
    const controller = sessionLoadController.current;
    if (!loader || !controller || controller.signal.aborted) return [];
    const rows = await loader();
    if (
      !rows.length ||
      controller.signal.aborted ||
      sessionLoadController.current !== controller
    ) {
      return [];
    }

    setChartHistory((current) => {
      const sessionFirstTime = Date.parse(
        useDayTradingSessionStore.getState().candles[0]?.time || ''
      );
      const currentFirstTime = current.length
        ? Date.parse(current[0].time)
        : sessionFirstTime;
      const earlier = rows.filter(
        (candle) => Date.parse(candle.time) < currentFirstTime
      );
      return earlier.length ? [...earlier, ...current] : current;
    });
    return rows;
  }, []);

  useEffect(() => {
    preloadDayTradingManifest();
    return () => {
      sessionLoadController.current?.abort();
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MODE_KEY);
      if (stored === 'random-segment' || stored === 'random-time')
        setSessionMode(stored);
    } catch {}
  }, [setSessionMode]);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, sessionMode);
    } catch {}
  }, [sessionMode]);

  const loadSession = useCallback(
    async ({
      restore,
      preferredSymbol,
      market = selectedMarket,
    }: {
      restore?: Record<string, unknown>;
      preferredSymbol?: string;
      market?: DayTradingMarket;
    } = {}) => {
      sessionLoadController.current?.abort();
      earlierHistoryLoader.current = null;
      setChartHistory([]);
      const controller = new AbortController();
      sessionLoadController.current = controller;
      const payload = await loadDayTradingSessionClient({
        preferredSymbol,
        preferredStartTime:
          typeof restore?.startMonth === 'string'
            ? restore.startMonth
            : undefined,
        market,
        interval: '5m',
        historyMonths: 12,
        mode:
          restore?.sessionMode === 'random-time' ? 'random-time' : sessionMode,
        minimumInitialCandles:
          typeof restore?.visible === 'number' ? restore.visible : 180,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      earlierHistoryLoader.current = payload.loadEarlier;
      loadData(
        payload.candles,
        payload.symbol,
        payload.interval,
        payload.startMonth,
        typeof restore?.visible === 'number'
          ? restore.visible
          : payload.initialVisible
      );
      const appendChunk = (rows: typeof payload.candles) => {
        const state = useDayTradingSessionStore.getState();
        if (
          !controller.signal.aborted &&
          sessionLoadController.current === controller &&
          state.startMonth === payload.startMonth &&
          state.symbol === payload.symbol &&
          state.candles.length > 0
        ) {
          appendData(rows);
        }
      };
      void (async () => {
        for (let retry = 0; retry < 3 && !controller.signal.aborted; retry++) {
          try {
            await payload.loadRemaining(appendChunk);
            return;
          } catch {
            if (controller.signal.aborted) return;
            await new Promise((resolve) => window.setTimeout(resolve, 2_000));
          }
        }
      })();
    },
    [appendData, loadData, selectedMarket, sessionMode]
  );

  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;
    const requestedMarket = getRequestedMarket();
    let saved: Record<string, any> | null = null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      saved = raw ? JSON.parse(raw) : null;
    } catch {}

    if (requestedMarket) {
      const current = useDayTradingSessionStore.getState();
      if (current.category !== requestedMarket && current.candles.length > 0) {
        current.dismissSummaryAndReset();
      }
      setCategory(requestedMarket);
    }

    if (!saved?.symbol) return;

    const savedMarket: DayTradingMarket =
      saved.category === 'fx' ? 'fx' : 'crypto';
    if (requestedMarket && requestedMarket !== savedMarket) return;

    const restoreMarket = requestedMarket || savedMarket;
    setCategory(restoreMarket);
    setSessionMode(
      saved.sessionMode === 'random-time' ? 'random-time' : 'random-segment'
    );
    setLoading(true);
    setError(null);
    void Promise.all([
      loadSession({
        restore: saved,
        preferredSymbol: saved.symbol,
        market: restoreMarket,
      }),
      waitForTradingView(),
      importTradingViewChart(),
    ])
      .then(() => restoreSessionState(saved))
      .catch(() => setError(t('loadFailed')))
      .finally(() => setLoading(false));
  }, [loadSession, restoreSessionState, setCategory, setSessionMode, t]);

  useEffect(() => {
    if (summaryOpen && lastResult) setPromoIsProfit(lastResult.pnlReal > 0);
    if (previousSummaryOpen.current && !summaryOpen) {
      try {
        const count =
          Number(sessionStorage.getItem(PROMO_COUNT_KEY) || '0') + 1;
        sessionStorage.setItem(PROMO_COUNT_KEY, String(count));
        if (PROMO_COUNTS.has(count)) setPromoTrigger((value) => value + 1);
      } catch {}
    }
    previousSummaryOpen.current = summaryOpen;
  }, [lastResult, summaryOpen]);

  const onStart = async () => {
    useDayTradingSessionStore.setState({ summaryOpen: false });
    reset();
    clearResult();
    useDayTradingSessionStore.setState({
      sessionMode,
    });
    setChartReady(false);
    setChartResolution('5');
    setChartKey((value) => value + 1);
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadSession(),
        waitForTradingView(),
        importTradingViewChart(),
      ]);
    } catch {
      setError(t('loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const onFinish = () => {
    const result = finish();
    try {
      const previous = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      localStorage.setItem(HISTORY_KEY, JSON.stringify([...previous, result]));
    } catch {}
  };

  const setMode = (mode: SessionMode) => {
    if (active || loading) return;
    setSessionMode(mode);
  };

  const loadCategory = (market: DayTradingMarket) => {
    if (loading || market === selectedMarket) return;
    sessionLoadController.current?.abort();
    earlierHistoryLoader.current = null;
    setChartHistory([]);
    useDayTradingSessionStore.getState().dismissSummaryAndReset();
    setCategory(market);
    setChartReady(false);
    setChartResolution('5');
    setError(null);
  };

  const renderMarketSelector = (compact = false) => (
    <div
      className={`grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-[#2a2e39] dark:bg-[#1a1a1a] ${compact ? 'min-w-[154px]' : ''}`}
    >
      {(['crypto', 'fx'] as const).map((market) => (
        <button
          key={market}
          type="button"
          onClick={() => loadCategory(market)}
          disabled={loading}
          aria-pressed={selectedMarket === market}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            selectedMarket === market
              ? 'bg-white text-slate-900 shadow-sm dark:bg-[#3a3f4b] dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          } disabled:cursor-wait disabled:opacity-60`}
        >
          {t(market)}
        </button>
      ))}
    </div>
  );

  const renderModes = () => (
    <div className="grid grid-cols-2 gap-2">
      {(
        [
          [
            'random-segment',
            t('modeRandomSegment'),
            t('modeRandomSegmentHint'),
          ],
          ['random-time', t('modeRandomTime'), t('modeRandomTimeHint')],
        ] as const
      ).map(([mode, label, hint]) => (
        <button
          key={mode}
          type="button"
          onClick={() => setMode(mode)}
          disabled={active || loading}
          className={`rounded-lg border px-3 py-2 text-left ${
            sessionMode === mode
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
              : 'border-slate-200 bg-white text-slate-700 dark:border-[#2a2e39] dark:bg-[#111418] dark:text-slate-300'
          }`}
        >
          <span className="block text-sm font-semibold">{label}</span>
          <span className="mt-1 block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div
      id="day-trading-simulator-tool"
      data-day-trading-root
      className="flex h-[100dvh] scroll-mt-16 flex-col bg-slate-50 dark:bg-[#0F0F0F] md:h-[calc(100vh-3.5rem)] md:flex-row md:overflow-hidden"
    >
      <div className="flex-none border-b border-slate-200 bg-white px-3 py-2 dark:border-[#2a2e39] dark:bg-[#0F0F0F] md:hidden">
        <div className="flex items-center justify-between gap-2">
          {renderMarketSelector(true)}
          {active ? (
            <button
              type="button"
              onClick={onFinish}
              className="h-10 rounded-lg bg-sky-600 px-3 text-xs font-bold text-white"
            >
              {t('finish')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              disabled={loading || summaryOpen}
              className="h-10 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white disabled:bg-slate-400"
            >
              {loading ? t('loading') : t('startSession')}
            </button>
          )}
        </div>
      </div>
      {!active && (
        <div className="flex-none border-b border-slate-200 bg-white px-3 py-2 dark:border-[#2a2e39] dark:bg-[#0F0F0F] md:hidden">
          {renderModes()}
        </div>
      )}

      <section className="relative flex min-h-0 flex-[3] flex-col bg-white dark:bg-[#0F0F0F]">
        <div className="relative h-full w-full flex-1">
          {active ? (
            <TradingViewChart
              key={chartKey}
              candles={chartCandles}
              markers={marks}
              symbol={symbol}
              interval="5"
              supportedResolutions={DAY_TRADING_CHART_RESOLUTIONS}
              persistenceKey="cg-dt-chart-persistence-v1"
              syncPersistenceRemotely={true}
              iframeCompatibilityMode
              enableBarCountIndicator
              onReadyChange={setChartReady}
              onIntervalChange={setChartResolution}
              onRequestEarlierHistory={requestEarlierHistory}
            />
          ) : null}

          {!active && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/75 p-4 backdrop-blur-sm dark:bg-[#0F0F0F]/90">
              <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-[#2a2e39] dark:bg-[#111418] sm:p-8">
                <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-600">
                  ▶
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {pageCopy.overlayTitle}
                </h1>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  {pageCopy.overlaySubtitle}
                </p>
                <button
                  type="button"
                  onClick={loading ? undefined : onStart}
                  disabled={loading}
                  className="mt-6 inline-flex rounded-lg bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:bg-slate-400"
                >
                  {loading ? t('loading') : t('startSession')}
                </button>
              </div>
            </div>
          )}

          {active && !chartReady && (
            <output
              className="absolute inset-0 z-10 animate-pulse bg-white dark:bg-[#0F0F0F]"
              aria-label={t('loading')}
            />
          )}
        </div>
      </section>

      <div className="flex-none border-t border-slate-200 bg-white p-2 dark:border-[#2a2e39] dark:bg-[#0F0F0F] md:hidden">
        <Controls
          layout="mobile"
          sessionStore={useDayTradingSessionStore}
          defaultQuantity={1}
          quantityStep={1}
          onAdvance={advanceChartBar}
        />
      </div>
      <div className="min-h-0 flex-[1] space-y-2 overflow-y-auto border-t border-slate-200 bg-slate-50 p-2 dark:border-[#2a2e39] dark:bg-[#0F0F0F] md:hidden">
        <PositionCard
          position={position}
          lastClose={currentPrice}
          unrealized={unrealized}
        />
        <StatsCard
          equity={equity}
          unrealized={unrealized}
          realized={pnlRealized}
        />
        <TradesCard sessionStore={useDayTradingSessionStore} />
      </div>

      <aside className="hidden h-full w-[440px] flex-shrink-0 border-l border-slate-200 bg-white dark:border-[#2a2e39] dark:bg-[#0F0F0F] md:flex">
        <div className="flex h-full min-h-0 w-full flex-col p-4">
          <div className="flex-none space-y-4">
            {renderMarketSelector()}
            {!active && renderModes()}
            {active ? (
              <button
                type="button"
                onClick={onFinish}
                className="w-full rounded-xl bg-slate-700 py-3 font-bold text-white hover:bg-slate-600"
              >
                {t('finish')}
              </button>
            ) : (
              <button
                type="button"
                onClick={onStart}
                disabled={loading || summaryOpen}
                className="w-full rounded-xl bg-emerald-700 py-3 font-bold text-white shadow-lg hover:bg-emerald-800 disabled:bg-slate-400"
              >
                {loading ? t('loading') : t('startSession')}
              </button>
            )}
            <Controls
              sessionStore={useDayTradingSessionStore}
              defaultQuantity={1}
              quantityStep={1}
              onAdvance={advanceChartBar}
            />
            <PositionCard
              position={position}
              lastClose={currentPrice}
              unrealized={unrealized}
            />
            <StatsCard
              equity={equity}
              unrealized={unrealized}
              realized={pnlRealized}
            />
          </div>
          <div className="min-h-0 flex-1 pt-4">
            <TradesCard
              className="h-full min-h-0"
              sessionStore={useDayTradingSessionStore}
            />
          </div>
          <div className="mt-4 flex-none border-t border-slate-100 pt-3 text-center dark:border-[#2a2e39]">
            <div className="font-mono text-xs text-slate-400">
              {active
                ? `${symbol} · ${marketLabel} · 5m ${pageCopy.baseLabel} · ${visible}/${candles.length}`
                : `${marketLabel} · ${pageCopy.randomMarket} · TradingView 5m–12M`}
            </div>
            {error && (
              <div className="mt-2 rounded bg-rose-50 px-2 py-1 text-xs font-medium text-rose-600 dark:bg-rose-900/20">
                {error}
              </div>
            )}
          </div>
        </div>
      </aside>

      {summaryOpen ? (
        <SessionSummary sessionStore={useDayTradingSessionStore} />
      ) : null}
      {promoTrigger > 0 ? (
        <PartnerPromo
          trigger={promoTrigger}
          isProfit={promoIsProfit}
          allowBitget={getRequestedMarket() === 'crypto'}
        />
      ) : null}
    </div>
  );
}

export default DayTradingSimulatorContent;
