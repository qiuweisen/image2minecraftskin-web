'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { clientDynamic } from '@/lib/client-dynamic';
import Controls from '@/components/Controls';
import PositionCard from '@/components/PositionCard';
import StatsCard from '@/components/StatsCard';
import TradesCard from '@/components/TradesCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { saveCompletedTraining } from '@/lib/training-records';

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
  const sessionStartedAt = useRef<number | null>(null);

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
    sessionStartedAt.current = Date.now();
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
    if (summaryOpen) return;
    if (lastResult) {
      useDayTradingSessionStore.setState({ summaryOpen: true });
      return;
    }
    const result = finish();
    saveCompletedTraining(
      result,
      'day-trading-simulator',
      sessionStartedAt.current
    );
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
    <Tabs
      value={selectedMarket}
      onValueChange={(value) => loadCategory(value as DayTradingMarket)}
      className={compact ? 'min-w-0 flex-1' : 'w-full'}
    >
      <TabsList className="grid w-full grid-cols-2">
        {(['crypto', 'fx'] as const).map((market) => (
          <TabsTrigger key={market} value={market} disabled={loading}>
            {t(market)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  const renderModes = () => {
    const selectedMode =
      sessionMode === 'random-time'
        ? t('modeRandomTimeHint')
        : t('modeRandomSegmentHint');

    return (
      <div className="space-y-2">
        <Tabs
          value={sessionMode}
          onValueChange={(value) => setMode(value as SessionMode)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="random-segment" disabled={active || loading}>
              {t('modeRandomSegment')}
            </TabsTrigger>
            <TabsTrigger value="random-time" disabled={active || loading}>
              {t('modeRandomTime')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="px-1 text-[11px] leading-snug text-muted-foreground">
          {selectedMode}
        </p>
      </div>
    );
  };

  return (
    <div
      id="day-trading-simulator-tool"
      data-day-trading-root
      className="flex h-[100dvh] scroll-mt-16 flex-col bg-background md:h-[calc(100vh-3.5rem)] md:flex-row md:overflow-hidden"
    >
      <div className="flex flex-none items-center justify-between gap-2 border-b border-border bg-background px-3 py-2 md:hidden">
        {renderMarketSelector(true)}
        <div className="flex-none">
          {active ? (
            <Button
              type="button"
              onClick={onFinish}
              variant="destructive"
              size="sm"
              className="bg-destructive font-semibold text-white shadow-md shadow-destructive/20 hover:bg-destructive/90 dark:bg-destructive dark:text-red-950 dark:hover:bg-destructive/90"
            >
              {t('finish')}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onStart}
              disabled={loading || summaryOpen}
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
            >
              {loading ? t('loading') : t('startSession')}
            </Button>
          )}
        </div>
      </div>
      {!active && (
        <div className="flex-none border-b border-border bg-background px-3 py-2 md:hidden">
          {renderModes()}
        </div>
      )}

      <section className="relative flex min-h-0 flex-[3] flex-col bg-background">
        {/* Keep TradingView unframed; this wrapper only provides sizing and overlays. */}
        <div className="relative min-h-0 flex-1 w-full">
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
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm">
              <Card className="max-w-xl bg-card/95 shadow-xl">
                <CardContent className="p-6 text-center sm:p-8">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl text-emerald-600 dark:text-emerald-400">
                    ▶
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {pageCopy.overlayTitle}
                  </h1>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground sm:text-base">
                    {pageCopy.overlaySubtitle}
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    className="mt-6 w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400 sm:w-auto"
                    onClick={() => void onStart()}
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('startSession')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {active && !chartReady && (
            <output
              className="absolute inset-0 z-10 animate-pulse bg-background/95"
              aria-label={t('loading')}
            />
          )}
        </div>
      </section>

      <div className="z-20 flex-none border-t border-border bg-background p-2 md:hidden">
        <Controls
          layout="mobile"
          sessionStore={useDayTradingSessionStore}
          defaultQuantity={1}
          quantityStep={1}
          onAdvance={advanceChartBar}
        />
      </div>
      <div className="min-h-0 flex-[1] space-y-2 overflow-y-auto border-t border-border bg-muted/30 p-2 md:hidden">
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

      <aside className="hidden h-full min-h-0 w-[440px] flex-shrink-0 overflow-hidden border-l border-border bg-background md:flex">
        <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto p-4">
          <div className="flex-none space-y-4">
            {renderMarketSelector()}
            {!active && renderModes()}
            {active ? (
              <Button
                type="button"
                onClick={onFinish}
                variant="destructive"
                size="lg"
                className="w-full bg-destructive font-semibold text-white shadow-md shadow-destructive/20 hover:bg-destructive/90 dark:bg-destructive dark:text-red-950 dark:hover:bg-destructive/90"
              >
                {t('finish')}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onStart}
                disabled={loading || summaryOpen}
                size="lg"
                className="w-full bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/15 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
              >
                {loading ? t('loading') : t('startSession')}
              </Button>
            )}
          </div>

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
          <TradesCard
            className="min-h-52 flex-1"
            sessionStore={useDayTradingSessionStore}
          />
          <div className="flex-none border-t border-border pt-3 text-center">
            <div className="font-mono text-xs text-muted-foreground">
              {active
                ? `${symbol} · ${marketLabel} · 5m ${pageCopy.baseLabel} · ${visible}/${candles.length}`
                : `${marketLabel} · ${pageCopy.randomMarket} · TradingView 5m–12M`}
            </div>
            {error && (
              <div className="mt-2 rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
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
