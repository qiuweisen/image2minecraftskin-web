'use client';

import { useEffect, useRef, memo, useState } from 'react';
import type { Candle } from '@/lib/ohlcv/types';
import { useTheme } from '@/components/theme/theme-provider';
import {
  loadChartPersistence,
  readLocalChartPersistence,
  markLocalIndicatorTemplateSynced,
  persistChartIndicatorTemplateRemote,
  removeChartUserSettingLocal,
  saveChartLayoutLocal,
  saveChartUserSettingLocal,
  type ChartPersistenceState,
  type LoadedChartPersistenceState,
} from '@/lib/chartPersistence';
import {
  extractBarCountInputs,
  hashIndicatorTemplate,
  hasUserIndicators,
  hasUserIndicatorsInLayout,
  removeUserIndicatorsFromLayout,
  SHARED_INDICATOR_SCOPE,
  type ChartIndicatorTemplate,
  type JsonRecord,
} from '@/lib/chartIndicators';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { chartResolutionBucketStart } from '@/lib/ohlcv/chartResolution';
import {
  BAR_COUNT_STUDY_NAME,
  barCountFontSize,
  buildBarCountLabels,
  createBarCountIndicator,
  readBarCountStudySettings,
} from '@/lib/tradingview/barCountIndicator';

// Types for TradingView widget
declare global {
  interface Window {
    TradingView: any;
  }
}

export type ChartMarker = {
  kind: 'buy' | 'sell';
  price: number;
  time: string; // ISO string from store
  high: number;
  low: number;
};

type Props = {
  candles: Candle[];
  markers?: ChartMarker[];
  symbol?: string;
  interval?: string;
  supportedResolutions?: string[];
  persistenceKey?: string;
  syncPersistenceRemotely?: boolean;
  indicatorScope?: typeof SHARED_INDICATOR_SCOPE;
  iframeCompatibilityMode?: boolean;
  enableBarCountIndicator?: boolean;
  onReadyChange?: (ready: boolean) => void;
  onIntervalChange?: (resolution: string) => void;
  onRequestEarlierHistory?: () => Promise<Candle[]>;
};

const areMarkersEqual = (a: ChartMarker[], b: ChartMarker[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const left = a[i];
    const right = b[i];
    if (
      left.kind !== right.kind ||
      left.price !== right.price ||
      left.time !== right.time ||
      left.high !== right.high ||
      left.low !== right.low
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Custom Datafeed implementation for TradingView
 * Bridges our simple Candle[] data to TradingView's JS API.
 */
class CustomDatafeed {
  private cachedBars: any[]; // Processed bars cache
  private symbol: string;
  private priceScale: number;
  private baseResolution: string;
  private supportedResolutions: string[];
  private activeResolution: string = '1D';
  private subscribers = new Map<
    string,
    { resolution: string; callback: (bar: any) => void }
  >();
  private requestEarlierHistory?: () => Promise<Candle[]>;
  private historyRequestQueue: Promise<void> = Promise.resolve();

  constructor(
    candles: Candle[],
    symbol: string,
    baseResolution = '1D',
    supportedResolutions?: string[],
    requestEarlierHistory?: () => Promise<Candle[]>
  ) {
    this.symbol = symbol;
    this.baseResolution = baseResolution;
    this.requestEarlierHistory = requestEarlierHistory;
    this.supportedResolutions = supportedResolutions?.length
      ? supportedResolutions
      : baseResolution === '1D'
        ? ['1D', '1W', '1M']
        : [baseResolution];
    let maxDecimals = 2;
    for (const c of candles) {
      for (const v of [c.open, c.high, c.low, c.close]) {
        const s = String(v);
        if (s.includes('e') || s.includes('E')) {
          maxDecimals = Math.max(maxDecimals, 6);
          continue;
        }
        const decimals = s.includes('.') ? s.split('.')[1].length : 0;
        maxDecimals = Math.max(maxDecimals, Math.min(decimals, 6));
      }
    }
    this.priceScale = 10 ** Math.min(6, Math.max(2, maxDecimals));
    this.cachedBars = this.buildBars(candles);
  }

  private buildBars(candles: Candle[]) {
    // Pre-process candles once for performance
    return candles
      .map((c) => ({
        time: new Date(c.time).getTime(),
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume ?? 0,
      }))
      .sort((a, b) => a.time - b.time);
  }

  replaceCandles(candles: Candle[]) {
    this.cachedBars = this.buildBars(candles);
  }

  setHistoryLoader(loader?: () => Promise<Candle[]>) {
    this.requestEarlierHistory = loader;
  }

  private prependCandles(candles: Candle[]) {
    if (!candles.length) return;
    const firstTime = this.cachedBars[0]?.time ?? Number.POSITIVE_INFINITY;
    const earlierBars = this.buildBars(candles).filter(
      (bar) => bar.time < firstTime
    );
    if (earlierBars.length)
      this.cachedBars = [...earlierBars, ...this.cachedBars];
  }

  private loadEarlierUntil(fromSeconds: number) {
    const run = this.historyRequestQueue.then(async () => {
      while (
        this.requestEarlierHistory &&
        this.cachedBars.length &&
        this.cachedBars[0].time / 1000 > fromSeconds
      ) {
        const rows = await this.requestEarlierHistory();
        if (!rows.length) break;
        this.prependCandles(rows);
      }
    });
    this.historyRequestQueue = run.catch(() => undefined);
    return run;
  }

  onReady(callback: (config: any) => void) {
    setTimeout(() => {
      callback({
        supported_resolutions: this.supportedResolutions,
        supports_marks: false,
        supports_timescale_marks: false,
      });
    }, 0);
  }

  searchSymbols(
    _userInput: string,
    _exchange: string,
    _symbolType: string,
    onResult: (result: any[]) => void
  ) {
    setTimeout(() => onResult([]), 0); // No search needed, we control the symbol
  }

  resolveSymbol(
    _symbolName: string,
    onResolve: (symbolInfo: any) => void,
    _onError: (error: string) => void
  ) {
    setTimeout(
      () =>
        onResolve({
          ticker: this.symbol,
          name: this.symbol,
          description: this.symbol,
          type: this.baseResolution === '1D' ? 'stock' : 'crypto',
          session: '24x7',
          timezone: 'Etc/UTC',
          exchange: '',
          minmov: 1,
          pricescale: this.priceScale,
          has_intraday: this.supportedResolutions.some((resolution) =>
            /^\d+$/.test(resolution)
          ),
          intraday_multipliers:
            this.baseResolution === '1D' ? undefined : [this.baseResolution],
          has_daily: this.supportedResolutions.some((resolution) =>
            /D$/.test(resolution)
          ),
          daily_multipliers: ['1'],
          has_weekly_and_monthly: this.supportedResolutions.some((resolution) =>
            /[WM]$/.test(resolution)
          ),
          weekly_multipliers: ['1'],
          monthly_multipliers: ['1', '3', '6', '12'],
          supported_resolutions: this.supportedResolutions,
          volume_precision: 2,
          data_status: 'streaming',
        }),
      0
    );
  }

  private aggregateBars(resolution: string) {
    if (resolution === this.baseResolution) return this.cachedBars;

    const buckets = new Map<number, any>();
    for (const bar of this.cachedBars) {
      const key = chartResolutionBucketStart(bar.time, resolution);
      const existing = buckets.get(key);
      if (!existing) {
        buckets.set(key, {
          time: key,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume ?? 0,
        });
      } else {
        existing.high = Math.max(existing.high, bar.high);
        existing.low = Math.min(existing.low, bar.low);
        existing.close = bar.close;
        existing.volume = (existing.volume ?? 0) + (bar.volume ?? 0);
      }
    }

    return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
  }

  setResolution(resolution: string) {
    this.activeResolution = resolution;
  }

  getBars(
    _symbolInfo: any,
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onResult: (bars: any[], meta: { noData: boolean }) => void,
    onError: (error: string) => void
  ) {
    const { from, to, firstDataRequest } = periodParams;
    const respond = () => {
      let bars = this.aggregateBars(resolution);

      if (!firstDataRequest) {
        bars = bars.filter((b) => {
          const timeSec = b.time / 1000;
          return timeSec >= from && timeSec < to;
        });
      }

      setTimeout(() => onResult(bars, { noData: bars.length === 0 }), 0);
    };
    const earliestTime = this.cachedBars[0]?.time / 1000;
    if (
      !firstDataRequest &&
      this.requestEarlierHistory &&
      Number.isFinite(earliestTime) &&
      from < earliestTime
    ) {
      void this.loadEarlierUntil(from)
        .then(respond)
        .catch((error) =>
          onError(
            error instanceof Error ? error.message : 'History request failed.'
          )
        );
      return;
    }
    respond();
  }

  subscribeBars(
    _symbolInfo: any,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
    subscriberUID: string,
    _onResetCacheNeededCallback: () => void
  ) {
    this.subscribers.set(subscriberUID, {
      resolution,
      callback: onRealtimeCallback,
    });
  }

  unsubscribeBars(subscriberUID: string) {
    this.subscribers.delete(subscriberUID);
  }

  updateBar(candle: Candle) {
    const bar = {
      time: new Date(candle.time).getTime(),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume ?? 0,
    };

    const last = this.cachedBars[this.cachedBars.length - 1];
    if (!last || bar.time > last.time) {
      this.cachedBars.push(bar);
    } else if (bar.time === last.time) {
      this.cachedBars[this.cachedBars.length - 1] = bar;
    } else {
      const idx = this.cachedBars.findIndex((b) => b.time === bar.time);
      if (idx >= 0) this.cachedBars[idx] = bar;
      else {
        this.cachedBars.push(bar);
        this.cachedBars.sort((a, b) => a.time - b.time);
      }
    }

    if (this.subscribers.size === 0) {
      return;
    }

    for (const { resolution, callback } of this.subscribers.values()) {
      const bars = this.aggregateBars(resolution || this.activeResolution);
      const latest = bars[bars.length - 1];
      if (latest) {
        try {
          callback(latest);
        } catch {
          // Ignore subscriber callback failures during teardown.
        }
      }
    }
  }
}

/**
 * Main TradingView Chart Component
 */
function TradingViewChartInner({
  candles,
  markers = [],
  symbol = 'SYMBOL',
  interval = '1D',
  supportedResolutions,
  persistenceKey = 'cg-chart-persistence-v1',
  syncPersistenceRemotely = true,
  indicatorScope = SHARED_INDICATOR_SCOPE,
  iframeCompatibilityMode = false,
  enableBarCountIndicator = false,
  onReadyChange,
  onIntervalChange,
  onRequestEarlierHistory,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const themeRef = useRef<'light' | 'dark'>('dark');
  const datafeedRef = useRef<CustomDatafeed | null>(null);
  const prevCandlesLengthRef = useRef<number>(0);
  const prevFirstCandleTimeRef = useRef<string | undefined>(undefined);
  const markerIdsRef = useRef<any[]>([]);
  const candlesRef = useRef(candles);
  const activeResolutionRef = useRef(interval === '1D' ? 'D' : interval);
  const barCountShapesRef = useRef<
    Map<
      string,
      { status: 'pending'; token: symbol } | { status: 'ready'; id: any }
    >
  >(new Map());
  const barCountDesiredKeysRef = useRef<Set<string>>(new Set());
  const syncBarCountDrawingsRef = useRef<() => void>(() => undefined);
  const [isChartReady, setIsChartReady] = useState(false);
  const prevMarkersRef = useRef<ChartMarker[]>([]);
  const chartPersistenceRef = useRef<ChartPersistenceState>({
    layout: null,
    userSettings: {},
    updatedAt: null,
    indicatorTemplateHash: null,
    indicatorLastSyncedHash: null,
    indicatorUpdatedAt: null,
  });
  const remoteSyncTimeoutRef = useRef<number | null>(null);
  const latestIndicatorTemplateRef = useRef<ChartIndicatorTemplate | null>(
    null
  );
  const latestIndicatorHashRef = useRef<string | null>(null);
  const chartSaveInFlightRef = useRef<Promise<void> | null>(null);

  // Keep TradingView on the same resolved theme as the TanStarter shell.
  const { resolvedTheme } = useTheme();
  themeRef.current = resolvedTheme;
  const { lang } = usePlayI18n();

  const mapLocale = (l: string) => {
    if (l.startsWith('zh')) return 'zh';
    if (l.startsWith('ja')) return 'ja';
    if (l.startsWith('ko')) return 'ko';
    return 'en';
  };

  candlesRef.current = candles;
  const hasEntityId = (id: unknown) => id !== null && id !== undefined;
  const queueRemoteIndicatorSync = (
    template: ChartIndicatorTemplate,
    templateHash: string
  ) => {
    if (typeof window === 'undefined' || !syncPersistenceRemotely) return;

    latestIndicatorTemplateRef.current = template;
    latestIndicatorHashRef.current = templateHash;

    if (remoteSyncTimeoutRef.current !== null) {
      window.clearTimeout(remoteSyncTimeoutRef.current);
    }

    remoteSyncTimeoutRef.current = window.setTimeout(() => {
      remoteSyncTimeoutRef.current = null;
      const latestTemplate = latestIndicatorTemplateRef.current;
      const latestHash = latestIndicatorHashRef.current;
      if (!latestTemplate || !latestHash) return;
      if (chartPersistenceRef.current.indicatorLastSyncedHash === latestHash) {
        return;
      }

      void persistChartIndicatorTemplateRemote(latestTemplate, indicatorScope)
        .then((profile) => {
          if (!profile?.templateHash) return;
          if (profile.templateHash !== latestHash) return;
          chartPersistenceRef.current = markLocalIndicatorTemplateSynced(
            profile.templateHash,
            persistenceKey,
            profile.updatedAt
          );
        })
        .catch(() => undefined);
    }, 900);
  };

  const captureChartState = () => {
    const widget = widgetRef.current;
    if (!widget || chartSaveInFlightRef.current) return;

    const savePromise = new Promise<void>((resolve) => {
      try {
        widget.save(async (state: object) => {
          if (!widgetRef.current || widgetRef.current !== widget) {
            resolve();
            return;
          }

          let template: ChartIndicatorTemplate | null = null;
          let templateHash: string | null = null;
          try {
            template = widget.activeChart?.()?.createStudyTemplate?.({
              saveSymbol: false,
              saveInterval: false,
            }) as ChartIndicatorTemplate;
            templateHash = await hashIndicatorTemplate(template);
          } catch {
            // Keep the complete local layout even if an older library build
            // cannot expose the indicator-template API.
          }

          chartPersistenceRef.current = saveChartLayoutLocal(
            state as Record<string, unknown>,
            persistenceKey,
            templateHash ? { templateHash } : undefined
          );

          if (template && templateHash) {
            queueRemoteIndicatorSync(template, templateHash);
          }
          resolve();
        });
      } catch {
        resolve();
      }
    });

    chartSaveInFlightRef.current = savePromise.finally(() => {
      chartSaveInFlightRef.current = null;
    });
  };

  syncBarCountDrawingsRef.current = () => {
    const widget = widgetRef.current;
    if (!widget) return;
    let chart: any = null;
    try {
      chart = widget.activeChart?.();
    } catch {
      return;
    }
    if (!chart) return;

    const panes = chart.getPanes?.() ?? [];
    const mainPane =
      panes.find((pane: any) => pane?.hasMainSeries?.()) ?? panes[0];
    const priceScale = mainPane?.getMainSourcePriceScale?.();
    const visiblePriceRange = priceScale?.getVisiblePriceRange?.();
    const paneHeight = Math.max(1, Number(mainPane?.getHeight?.() ?? 0));
    let dataLow = Number.POSITIVE_INFINITY;
    let dataHigh = Number.NEGATIVE_INFINITY;
    for (const candle of candlesRef.current) {
      dataLow = Math.min(dataLow, candle.low);
      dataHigh = Math.max(dataHigh, candle.high);
    }
    const visibleSpan = visiblePriceRange
      ? Math.abs(Number(visiblePriceRange.to) - Number(visiblePriceRange.from))
      : Math.abs(dataHigh - dataLow);
    const pricePerPixel = visibleSpan > 0 ? visibleSpan / paneHeight : 0;
    const belowDirection = priceScale?.isInverted?.() ? 1 : -1;

    const desired = new Map<
      string,
      {
        leftTimeSec: number;
        rightTimeSec: number;
        price: number;
        text: string;
        color: string;
        fontSize: number;
        ownerStudyId: any;
      }
    >();
    if (
      enableBarCountIndicator &&
      /^\d+$/.test(activeResolutionRef.current) &&
      pricePerPixel > 0
    ) {
      for (const info of chart.getAllStudies?.() ?? []) {
        if (info.name !== BAR_COUNT_STUDY_NAME) continue;
        let study: any;
        try {
          study = chart.getStudyById(info.id);
        } catch {
          continue;
        }
        if (!study?.isVisible?.()) continue;

        const settings = readBarCountStudySettings(study);
        const fontSize = barCountFontSize(settings.labelSize);
        for (const label of buildBarCountLabels(
          candlesRef.current,
          activeResolutionRef.current,
          settings.every,
          500
        )) {
          const key = `${String(info.id)}:${label.key}:${settings.textColor}:${fontSize}`;
          desired.set(key, {
            leftTimeSec: label.leftTimeSec,
            rightTimeSec: label.rightTimeSec,
            price:
              label.low + belowDirection * pricePerPixel * settings.distancePx,
            text: label.text,
            color: settings.textColor,
            fontSize,
            ownerStudyId: info.id,
          });
        }
      }
    }

    const desiredKeys = new Set(desired.keys());
    barCountDesiredKeysRef.current = desiredKeys;

    for (const [key, entry] of barCountShapesRef.current.entries()) {
      if (desiredKeys.has(key)) continue;
      if (entry.status === 'ready') {
        try {
          chart.removeEntity(entry.id);
        } catch {}
      }
      barCountShapesRef.current.delete(key);
    }

    for (const [key, label] of desired.entries()) {
      const existing = barCountShapesRef.current.get(key);
      if (existing?.status === 'ready') {
        try {
          chart.getShapeById(existing.id).setPoints([
            { time: label.leftTimeSec, price: label.price },
            { time: label.rightTimeSec, price: label.price },
          ]);
          continue;
        } catch {
          try {
            chart.removeEntity(existing.id);
          } catch {}
          barCountShapesRef.current.delete(key);
        }
      } else if (existing?.status === 'pending') {
        continue;
      }

      const pending = { status: 'pending' as const, token: Symbol(key) };
      barCountShapesRef.current.set(key, pending);

      try {
        void Promise.resolve(
          chart.createMultipointShape(
            [
              { time: label.leftTimeSec, price: label.price },
              { time: label.rightTimeSec, price: label.price },
            ],
            {
              shape: 'trend_line',
              text: label.text,
              ownerStudyId: label.ownerStudyId,
              lock: true,
              disableSelection: true,
              disableSave: true,
              disableUndo: true,
              showInObjectsTree: false,
              overrides: {
                linecolor: 'rgba(0, 0, 0, 0)',
                textcolor: label.color,
                fontsize: label.fontSize,
                linewidth: 1,
                linestyle: 0,
                extendLeft: false,
                extendRight: false,
                showMiddlePoint: false,
                showPriceLabels: false,
                showPriceRange: false,
                showPercentPriceRange: false,
                showPipsPriceRange: false,
                showBarsRange: false,
                showDateTimeRange: false,
                showDistance: false,
                showAngle: false,
                alwaysShowStats: false,
                horzLabelsAlign: 'center',
                vertLabelsAlign: 'top',
                bold: false,
                italic: false,
              },
            }
          )
        )
          .then((id) => {
            if (!hasEntityId(id)) {
              if (barCountShapesRef.current.get(key) === pending)
                barCountShapesRef.current.delete(key);
              return;
            }

            if (
              widgetRef.current === widget &&
              barCountDesiredKeysRef.current.has(key) &&
              barCountShapesRef.current.get(key) === pending
            ) {
              barCountShapesRef.current.set(key, { status: 'ready', id });
              return;
            }

            try {
              chart.removeEntity(id);
            } catch {}
            if (barCountShapesRef.current.get(key) === pending)
              barCountShapesRef.current.delete(key);
          })
          .catch((error) => {
            if (barCountShapesRef.current.get(key) === pending)
              barCountShapesRef.current.delete(key);
            console.error('[TradingView] Bar Count drawing failed', error);
          });
      } catch (error) {
        if (barCountShapesRef.current.get(key) === pending)
          barCountShapesRef.current.delete(key);
        console.error('[TradingView] Bar Count drawing failed', error);
      }
    }
  };

  /**
   * 1. Widget Initialization Effect
   * Creates the widget when the library and container are ready.
   */
  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return;

    let isMounted = true;
    let retryTimer: ReturnType<typeof setTimeout>;
    let retryCount = 0;
    const MAX_RETRIES = 80;
    let intervalChangedSource: any = null;
    let intervalChangedHandler: ((interval: string) => void) | null = null;
    let autoSaveHandler: (() => void) | null = null;
    let studyEventHandler: ((entityId: any, eventType: string) => void) | null =
      null;
    let studyPropertiesChangedHandler: ((entityId: any) => void) | null = null;
    let seriesEventHandler: ((eventType: string) => void) | null = null;
    let panesHeightChangedHandler: (() => void) | null = null;
    let visibleRangeSource: any = null;
    let visibleRangeHandler: (() => void) | null = null;
    let barCountSyncFrame: number | null = null;
    let sharedTemplateToApply: ChartIndicatorTemplate | null = null;
    let barCountInputsToRestore: JsonRecord | null = null;
    const scheduleBarCountSync = () => {
      if (barCountSyncFrame !== null) return;
      barCountSyncFrame = window.requestAnimationFrame(() => {
        barCountSyncFrame = null;
        syncBarCountDrawingsRef.current();
      });
    };
    const managedBarCountShapes = barCountShapesRef.current;
    setIsChartReady(false);
    onReadyChange?.(false);
    prevMarkersRef.current = [];

    const restorePageOwnedBarCount = async (chart: any) => {
      if (
        !enableBarCountIndicator ||
        !barCountInputsToRestore ||
        typeof chart?.createStudy !== 'function'
      ) {
        return;
      }

      const alreadyPresent = (chart.getAllStudies?.() ?? []).some(
        (study: any) => study?.name === BAR_COUNT_STUDY_NAME
      );
      if (alreadyPresent) return;

      try {
        await chart.createStudy(
          BAR_COUNT_STUDY_NAME,
          true,
          false,
          barCountInputsToRestore,
          undefined,
          { disableUndo: true }
        );
      } catch {
        // The custom indicator is optional; a missing page-owned study must
        // not prevent the user's shared indicators from loading.
      }
    };

    const initWidget = () => {
      if (!window.TradingView) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          retryTimer = setTimeout(initWidget, 100);
        }
        return;
      }

      if (!containerRef.current) return;

      // Cleanup previous
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch {}
        widgetRef.current = null;
      }

      const datafeed = new CustomDatafeed(
        candles,
        symbol,
        interval,
        supportedResolutions,
        onRequestEarlierHistory
      );
      datafeedRef.current = datafeed;
      prevCandlesLengthRef.current = candles.length;
      prevFirstCandleTimeRef.current = candles[0]?.time;

      const isMobile = window.innerWidth < 768;

      const widget = new window.TradingView.widget({
        container: containerRef.current,
        datafeed: datafeed,
        symbol: symbol,
        interval: interval === '1D' ? 'D' : interval,
        library_path: '/TradingView/charting_library/',
        locale: mapLocale(lang),
        theme: themeRef.current,
        autosize: true,
        fullscreen: false,
        timezone: 'Etc/UTC',
        debug: false,
        auto_save_delay: 1,
        workers: { enabled: true },
        custom_css_url: '/chartmini-tradingview.css',
        preset: isMobile ? 'mobile' : undefined,
        saved_data: chartPersistenceRef.current.layout ?? undefined,
        custom_indicators_getter: enableBarCountIndicator
          ? () => Promise.resolve([createBarCountIndicator()])
          : undefined,
        enabled_features: iframeCompatibilityMode
          ? ['iframe_loading_compatibility_mode']
          : undefined,
        settings_adapter: {
          initialSettings: chartPersistenceRef.current.userSettings,
          setValue: (key: string, value: string) => {
            chartPersistenceRef.current = saveChartUserSettingLocal(
              key,
              value,
              persistenceKey
            );
          },
          removeValue: (key: string) => {
            chartPersistenceRef.current = removeChartUserSettingLocal(
              key,
              persistenceKey
            );
          },
        },
        disabled_features: [
          'header_symbol_search',
          'header_compare',
          'header_undo_redo',
          'header_saveload',
          'go_to_date',
          'volume_force_overlay',
          'study_templates',
          'use_localstorage_for_settings',
        ],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#26a69a',
          'mainSeriesProperties.candleStyle.downColor': '#ef5350',
          'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
          'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
          // Hide symbol label in top-left legend.
          'paneProperties.legendProperties.showSeriesTitle': false,
          // Hide the date shown below the crosshair on the time scale.
          'scalesProperties.showTimeScaleCrosshairLabel': false,
        },
      });

      widgetRef.current = widget;

      const handleChartReady = async () => {
        if (!isMounted) return;
        const chart = widget.activeChart?.();

        // Re-apply after saved state restore to ensure privacy overrides stay active.
        widget.applyOverrides?.({
          'paneProperties.legendProperties.showSeriesTitle': false,
          'scalesProperties.showTimeScaleCrosshairLabel': false,
        });

        if (sharedTemplateToApply && chart) {
          try {
            // A shared template is applied only when its sources were removed
            // from saved_data before initialization. This is the single
            // indicator hydration point and prevents duplicate studies.
            chart.applyStudyTemplate?.(sharedTemplateToApply);
            await restorePageOwnedBarCount(chart);
          } catch {
            // Keep the page-local layout if a template from a newer library
            // version cannot be applied.
          }
        }

        // Capture the final, single-hydrated state once before subscribing to
        // auto-save notifications. User settings remain local-only.
        captureChartState();

        try {
          const syncResolution = (interval: string) => {
            activeResolutionRef.current = interval;
            datafeedRef.current?.setResolution(interval);
            onIntervalChange?.(interval);
          };

          const initialInterval =
            chart?.resolution?.() ?? chart?.getResolution?.() ?? 'D';
          syncResolution(initialInterval);

          intervalChangedSource = chart?.onIntervalChanged?.();
          intervalChangedHandler = (interval: string) => {
            if (!isMounted || widgetRef.current !== widget) return;
            syncResolution(interval);
            widget.resetCache?.();
            chart.resetData?.();
            window.setTimeout(scheduleBarCountSync, 0);
          };
          intervalChangedSource?.subscribe?.(null, intervalChangedHandler);
        } catch {
          // Ignore if this Charting Library build lacks interval change events.
        }

        studyEventHandler = () => scheduleBarCountSync();
        studyPropertiesChangedHandler = () => scheduleBarCountSync();
        seriesEventHandler = (eventType: string) => {
          if (eventType === 'price_scale_changed') scheduleBarCountSync();
        };
        panesHeightChangedHandler = () => scheduleBarCountSync();
        visibleRangeSource = chart?.onVisibleRangeChanged?.();
        visibleRangeHandler = () => scheduleBarCountSync();

        widget.subscribe('study_event', studyEventHandler);
        widget.subscribe(
          'study_properties_changed',
          studyPropertiesChangedHandler
        );
        widget.subscribe('series_event', seriesEventHandler);
        widget.subscribe('panes_height_changed', panesHeightChangedHandler);
        visibleRangeSource?.subscribe?.(null, visibleRangeHandler);

        setIsChartReady(true);
        onReadyChange?.(true);
        window.setTimeout(scheduleBarCountSync, 0);

        // Auto-save hook
        autoSaveHandler = () => {
          if (!isMounted || widgetRef.current !== widget) return;
          captureChartState();
        };
        widget.subscribe('onAutoSaveNeeded', autoSaveHandler);
      };

      if (typeof widget.chartReady === 'function') {
        void widget
          .chartReady()
          .then(handleChartReady)
          .catch(() => undefined);
      } else {
        widget.onChartReady(handleChartReady);
      }
    };

    const hydrateAndInit = async () => {
      const initialPersistence = readLocalChartPersistence(persistenceKey);
      let persisted: LoadedChartPersistenceState = {
        ...initialPersistence,
        remoteProfile: {
          authenticated: false,
          template: null,
          templateHash: null,
          updatedAt: null,
          version: 1,
        },
      };

      if (syncPersistenceRemotely) {
        persisted = await loadChartPersistence(
          persistenceKey,
          true,
          indicatorScope
        );
      }
      if (!isMounted) return;

      chartPersistenceRef.current = persisted;
      const localLayout = persisted.layout;
      const remote = persisted.remoteProfile;
      const remoteHash = remote.templateHash;
      const localHash = persisted.indicatorTemplateHash;
      const localIsClean = Boolean(
        localHash &&
          persisted.indicatorLastSyncedHash &&
          localHash === persisted.indicatorLastSyncedHash
      );
      const remoteDiffers = Boolean(remoteHash && remoteHash !== localHash);
      const localHasUserIndicators = Boolean(
        localLayout && hasUserIndicatorsInLayout(localLayout)
      );
      const localHasLegacyIndicators = Boolean(
        localLayout && !localHash && localHasUserIndicators
      );
      const localIsLegacyEmpty = Boolean(
        localLayout && !localHash && !localHasUserIndicators
      );

      // A page-local layout that has already been synced is allowed to adopt a
      // newer shared profile. Its old user indicators are stripped before the
      // widget is created, so TradingView never renders both versions.
      const shouldApplySharedTemplate =
        Boolean(remote.template) &&
        (!localLayout ||
          localIsLegacyEmpty ||
          (localIsClean && remoteDiffers)) &&
        !(
          !localLayout &&
          remote.template &&
          !hasUserIndicators(remote.template)
        );

      if (shouldApplySharedTemplate && remote.template) {
        sharedTemplateToApply = remote.template;
        barCountInputsToRestore = enableBarCountIndicator
          ? extractBarCountInputs(localLayout)
          : null;

        chartPersistenceRef.current = {
          ...persisted,
          layout: localLayout
            ? removeUserIndicatorsFromLayout(localLayout)
            : null,
          indicatorTemplateHash: remoteHash,
          indicatorLastSyncedHash: remoteHash,
          indicatorUpdatedAt: remote.updatedAt,
        };
      } else if (localHasLegacyIndicators) {
        // Existing localStorage from before cloud sync is preserved once. The
        // first successful capture canonicalizes it into the shared template.
        chartPersistenceRef.current = persisted;
      }

      initWidget();
    };

    void hydrateAndInit();

    return () => {
      isMounted = false;
      onReadyChange?.(false);
      clearTimeout(retryTimer);
      if (remoteSyncTimeoutRef.current !== null) {
        window.clearTimeout(remoteSyncTimeoutRef.current);
        remoteSyncTimeoutRef.current = null;
      }
      if (intervalChangedSource && intervalChangedHandler) {
        try {
          intervalChangedSource.unsubscribe?.(null, intervalChangedHandler);
        } catch {}
      }
      if (widgetRef.current && autoSaveHandler) {
        try {
          widgetRef.current.unsubscribe?.('onAutoSaveNeeded', autoSaveHandler);
        } catch {}
      }
      if (widgetRef.current && studyEventHandler) {
        try {
          widgetRef.current.unsubscribe?.('study_event', studyEventHandler);
        } catch {}
      }
      if (widgetRef.current && studyPropertiesChangedHandler) {
        try {
          widgetRef.current.unsubscribe?.(
            'study_properties_changed',
            studyPropertiesChangedHandler
          );
        } catch {}
      }
      if (widgetRef.current && seriesEventHandler) {
        try {
          widgetRef.current.unsubscribe?.('series_event', seriesEventHandler);
        } catch {}
      }
      if (widgetRef.current && panesHeightChangedHandler) {
        try {
          widgetRef.current.unsubscribe?.(
            'panes_height_changed',
            panesHeightChangedHandler
          );
        } catch {}
      }
      if (visibleRangeSource && visibleRangeHandler) {
        try {
          visibleRangeSource.unsubscribe?.(null, visibleRangeHandler);
        } catch {}
      }
      if (barCountSyncFrame !== null) {
        window.cancelAnimationFrame(barCountSyncFrame);
        barCountSyncFrame = null;
      }
      let chart: any = null;
      try {
        chart = widgetRef.current?.activeChart?.();
      } catch {}
      barCountDesiredKeysRef.current = new Set();
      if (chart) {
        for (const entry of managedBarCountShapes.values()) {
          if (entry.status === 'ready') {
            try {
              chart.removeEntity(entry.id);
            } catch {}
          }
        }
      }
      managedBarCountShapes.clear();
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch {}
        widgetRef.current = null;
      }
    };
  }, [
    symbol,
    interval,
    supportedResolutions,
    persistenceKey,
    syncPersistenceRemotely,
    indicatorScope,
    iframeCompatibilityMode,
    enableBarCountIndicator,
    onIntervalChange,
    lang,
    candles.length === 0,
  ]); // Re-init on symbol, interval, resolutions, persistence scope, indicator availability, or lang change

  useEffect(() => {
    datafeedRef.current?.setHistoryLoader(onRequestEarlierHistory);
  }, [onRequestEarlierHistory]);

  /**
   * 3. Markers Effect
   * Updates chart markers (Buy/Sell arrows) efficiently.
   */
  useEffect(() => {
    if (!widgetRef.current || !isChartReady) return;

    if (areMarkersEqual(markers, prevMarkersRef.current)) return;
    prevMarkersRef.current = markers;

    try {
      const chart = widgetRef.current.activeChart();
      if (!chart) return;

      // Clear old
      markerIdsRef.current.forEach((id) => {
        try {
          chart.removeEntity(id);
        } catch {}
      });
      markerIdsRef.current = [];

      if (!markers.length) return;

      markers.forEach((m) => {
        const isBuy = m.kind === 'buy';
        const timeSec = Math.floor(new Date(m.time).getTime() / 1000);
        const color = isBuy ? '#26a69a' : '#ef5350';
        const offset = Math.max((m.high - m.low) * 0.4, m.low * 0.01);
        const markerPrice = isBuy ? m.low - offset : m.high + offset;

        const id = chart.createShape(
          { time: timeSec, price: markerPrice },
          {
            shape: isBuy ? 'arrow_up' : 'arrow_down',
            text: m.price.toFixed(2),
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            overrides: {
              color,
              fontsize: 9,
              arrowColor: color,
              backgroundColor: 'transparent',
            },
          }
        );
        if (hasEntityId(id)) markerIdsRef.current.push(id);
      });
    } catch (e) {
      console.error('[TradingView] Marker update failed', e);
    }
  }, [markers, isChartReady]);

  /**
   * 4. Theme Update Effect
   */
  useEffect(() => {
    if (widgetRef.current && isChartReady && widgetRef.current.changeTheme) {
      widgetRef.current.changeTheme(resolvedTheme);
      widgetRef.current.applyOverrides?.({
        'paneProperties.legendProperties.showSeriesTitle': false,
        'scalesProperties.showTimeScaleCrosshairLabel': false,
      });
    }
  }, [resolvedTheme, isChartReady]);

  /**
   * 5. Realtime Updates Effect
   */
  useEffect(() => {
    const prev = prevCandlesLengthRef.current;
    const curr = candles.length;
    const firstTime = candles[0]?.time;
    const isAppend =
      curr > prev && prev > 0 && firstTime === prevFirstCandleTimeRef.current;
    if (isAppend && datafeedRef.current) {
      candles.slice(prev).forEach((c) => {
        datafeedRef.current?.updateBar(c);
      });
      prevCandlesLengthRef.current = curr;
    } else if (curr !== prev || firstTime !== prevFirstCandleTimeRef.current) {
      if (datafeedRef.current) {
        datafeedRef.current.replaceCandles(candles);
      }
      prevCandlesLengthRef.current = curr;
    }
    prevFirstCandleTimeRef.current = firstTime;
    if (isChartReady)
      window.setTimeout(() => syncBarCountDrawingsRef.current(), 0);
  }, [candles, isChartReady]);

  // Chart settings sync removed to reduce CPU usage
  // Users' chart states are now only saved in localStorage

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}

export default memo(TradingViewChartInner);
