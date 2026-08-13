import type {
  Candle,
  LocalSessionMode,
  PlaySessionPayload,
} from '@/lib/ohlcv/types';

export const DAY_TRADING_INTERVALS = [
  { value: '5m', label: '5m', resolution: '5', bucketMs: 5 * 60_000 },
  { value: '15m', label: '15m', resolution: '15', bucketMs: 15 * 60_000 },
  { value: '30m', label: '30m', resolution: '30', bucketMs: 30 * 60_000 },
  { value: '1h', label: '1h', resolution: '60', bucketMs: 60 * 60_000 },
  { value: '2h', label: '2h', resolution: '120', bucketMs: 2 * 60 * 60_000 },
  { value: '4h', label: '4h', resolution: '240', bucketMs: 4 * 60 * 60_000 },
  { value: '6h', label: '6h', resolution: '360', bucketMs: 6 * 60 * 60_000 },
  { value: '12h', label: '12h', resolution: '720', bucketMs: 12 * 60 * 60_000 },
  { value: '1D', label: '1D', resolution: '1D', bucketMs: 24 * 60 * 60_000 },
] as const;

export const DAY_TRADING_CHART_RESOLUTIONS = [
  '5',
  '15',
  '30',
  '60',
  '120',
  '240',
  '360',
  '720',
  '1D',
  '1W',
  '1M',
  '3M',
  '6M',
  '12M',
];

export type DayTradingInterval =
  (typeof DAY_TRADING_INTERVALS)[number]['value'];
export type DayTradingHistoryMonths = 1 | 3 | 6 | 12;
export type DayTradingMarket = 'crypto' | 'fx';

type ManifestFile = {
  month: string;
  path: string;
  candleCount: number;
  firstCandle: string;
  lastCandle: string;
};

export type DayTradingSymbol = {
  selectionRank: number;
  marketCapRank?: number;
  coinGeckoId?: string;
  assetName: string;
  symbol: string;
  firstCandle: string;
  lastCandle: string;
  availableMonths: string[];
  coverageStatus?: 'full-window' | 'partial-window';
  candleCount: number;
  files: ManifestFile[];
};

type DayTradingManifest = {
  schemaVersion: number;
  releaseId: string;
  interval: '5m';
  generatedAt: string;
  market?: DayTradingMarket;
  testOnly?: boolean;
  symbols: DayTradingSymbol[];
};

export type DayTradingSessionLoadResult = PlaySessionPayload & {
  loadRemaining: (onChunk: (candles: Candle[]) => void) => Promise<void>;
  loadEarlier: () => Promise<Candle[]>;
};

const env = import.meta.env as Record<string, unknown>;
const configuredCryptoBase =
  env.VITE_DT_OHLCV_BASE ?? env.NEXT_PUBLIC_DT_OHLCV_BASE;
const configuredFxBase =
  env.VITE_DT_FX_OHLCV_BASE ?? env.NEXT_PUBLIC_DT_FX_OHLCV_BASE;
const DT_BASE_URLS: Record<DayTradingMarket, string> = {
  crypto:
    typeof configuredCryptoBase === 'string' && configuredCryptoBase
      ? configuredCryptoBase.replace(/\/$/, '')
      : '/api/day-trading-data',
  fx:
    typeof configuredFxBase === 'string' && configuredFxBase
      ? configuredFxBase.replace(/\/$/, '')
      : '/api/day-trading-data/fx',
};

const manifestCache: Partial<Record<DayTradingMarket, DayTradingManifest>> = {};
const manifestPromises: Partial<
  Record<DayTradingMarket, Promise<DayTradingManifest>>
> = {};

export function getTradingViewResolution(interval: DayTradingInterval) {
  return (
    DAY_TRADING_INTERVALS.find((item) => item.value === interval)?.resolution ||
    '5'
  );
}

export async function getDayTradingManifest(
  market: DayTradingMarket = 'crypto'
): Promise<DayTradingManifest> {
  if (manifestCache[market]) return manifestCache[market];
  if (!manifestPromises[market]) {
    manifestPromises[market] = fetch(`${DT_BASE_URLS[market]}/manifest.json`, {
      cache: 'force-cache',
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            `Day-trading manifest request failed (${response.status}).`
          );
        const manifest = (await response.json()) as DayTradingManifest;
        const validSchema =
          market === 'crypto'
            ? manifest.schemaVersion === 2
            : manifest.schemaVersion === 1;
        const validMarket =
          market === 'crypto' ||
          (manifest.market === 'fx' && manifest.testOnly === true);
        if (
          !validSchema ||
          !validMarket ||
          manifest.interval !== '5m' ||
          !Array.isArray(manifest.symbols)
        ) {
          throw new Error('Day-trading manifest is invalid.');
        }
        manifestCache[market] = manifest;
        return manifest;
      })
      .finally(() => {
        delete manifestPromises[market];
      });
  }
  return manifestPromises[market];
}

export function preloadDayTradingManifest(market?: DayTradingMarket) {
  const markets: DayTradingMarket[] = market ? [market] : ['crypto', 'fx'];
  for (const item of markets)
    void getDayTradingManifest(item).catch(() => undefined);
}

const subtractUtcMonths = (isoTime: string, months: number) => {
  const date = new Date(isoTime);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - months);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.getTime();
};

const aggregateCandles = (
  candles: Candle[],
  interval: DayTradingInterval
): Candle[] => {
  const bucketMs =
    DAY_TRADING_INTERVALS.find((item) => item.value === interval)?.bucketMs ||
    5 * 60_000;
  if (bucketMs === 5 * 60_000) return candles;

  const output: Candle[] = [];
  let bucketStart = -1;
  let current: Candle | null = null;

  for (const candle of candles) {
    const time = Date.parse(candle.time);
    if (!Number.isFinite(time)) continue;
    const nextBucket = Math.floor(time / bucketMs) * bucketMs;
    if (!current || nextBucket !== bucketStart) {
      if (current) output.push(current);
      bucketStart = nextBucket;
      current = { ...candle, time: new Date(nextBucket).toISOString() };
      continue;
    }
    current.high = Math.max(current.high, candle.high);
    current.low = Math.min(current.low, candle.low);
    current.close = candle.close;
    current.volume = (current.volume || 0) + (candle.volume || 0);
  }

  if (current) output.push(current);
  return output;
};

const SHARD_TIMEOUT_MS = 8_000;
const SHARD_ATTEMPTS = 2;

const abortError = () => {
  const error = new Error('Day-trading data request was aborted.');
  error.name = 'AbortError';
  return error;
};

const fetchCandleFile = async (
  market: DayTradingMarket,
  symbol: DayTradingSymbol,
  file: ManifestFile,
  signal?: AbortSignal
) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < SHARD_ATTEMPTS; attempt++) {
    if (signal?.aborted) throw abortError();

    const controller = new AbortController();
    const abortFromParent = () => controller.abort();
    signal?.addEventListener('abort', abortFromParent, { once: true });
    const timeout = window.setTimeout(
      () => controller.abort(),
      SHARD_TIMEOUT_MS
    );

    try {
      const response = await fetch(`${DT_BASE_URLS[market]}/${file.path}`, {
        cache: 'force-cache',
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(
          `${symbol.symbol} data request failed (${response.status}).`
        );
      return (await response.json()) as Candle[];
    } catch (error) {
      if (signal?.aborted) throw abortError();
      lastError = error;
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener('abort', abortFromParent);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`${symbol.symbol} data request failed.`);
};

const randomItem = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

const initialVisibleCount = (length: number) => {
  if (length <= 2) return Math.max(1, length - 1);
  return Math.min(
    180,
    Math.max(2, Math.min(length - 1, Math.floor(length * 0.35)))
  );
};

export async function loadDayTradingSessionClient({
  preferredSymbol,
  preferredStartTime,
  market = 'crypto',
  interval,
  historyMonths,
  mode = 'random-segment',
  minimumInitialCandles = 180,
  signal,
}: {
  preferredSymbol?: string;
  preferredStartTime?: string;
  market?: DayTradingMarket;
  interval: DayTradingInterval;
  historyMonths: DayTradingHistoryMonths;
  mode?: LocalSessionMode;
  minimumInitialCandles?: number;
  signal?: AbortSignal;
}): Promise<DayTradingSessionLoadResult> {
  const manifest = await getDayTradingManifest(market);
  if (!manifest.symbols.length)
    throw new Error(`No ${market} day-trading symbols are available.`);

  const normalized = preferredSymbol?.toUpperCase();
  const symbol =
    manifest.symbols.find((item) => item.symbol === normalized) ||
    randomItem(manifest.symbols);
  const cutoff = subtractUtcMonths(symbol.lastCandle, historyMonths);
  const files = symbol.files
    .filter((file) => Date.parse(file.lastCandle) >= cutoff)
    .sort((left, right) => left.month.localeCompare(right.month));
  if (!files.length)
    throw new Error(
      `${symbol.symbol} does not have data in the requested window.`
    );

  let fileIndex = 0;
  let estimatedOffset = 0;
  const preferredTime = preferredStartTime
    ? Date.parse(preferredStartTime)
    : Number.NaN;

  if (Number.isFinite(preferredTime)) {
    const found = files.findIndex(
      (file) => Date.parse(file.lastCandle) >= preferredTime
    );
    fileIndex = found >= 0 ? found : files.length - 1;
  } else {
    const totalCandles = files.reduce(
      (sum, file) => sum + Math.max(0, file.candleCount),
      0
    );
    const minimumRemaining = Math.min(
      500,
      Math.max(20, Math.floor(totalCandles * 0.25))
    );
    let randomOffset = Math.floor(
      Math.random() * (Math.max(0, totalCandles - minimumRemaining) + 1)
    );
    for (let index = 0; index < files.length; index++) {
      const count = Math.max(0, files[index].candleCount);
      if (randomOffset < count || index === files.length - 1) {
        fileIndex = index;
        estimatedOffset = randomOffset;
        break;
      }
      randomOffset -= count;
    }
  }

  const firstFileCandles = (
    await fetchCandleFile(market, symbol, files[fileIndex], signal)
  )
    .filter((candle) => Date.parse(candle.time) >= cutoff)
    .sort((left, right) => Date.parse(left.time) - Date.parse(right.time));
  let startIndex = 0;
  if (mode === 'random-segment') {
    if (Number.isFinite(preferredTime)) {
      const found = firstFileCandles.findIndex(
        (candle) => Date.parse(candle.time) >= preferredTime
      );
      startIndex = found >= 0 ? found : 0;
    } else {
      startIndex = Math.min(
        estimatedOffset,
        Math.max(0, firstFileCandles.length - 1)
      );
    }
  }

  const initialRawCandles =
    mode === 'random-time'
      ? [...firstFileCandles]
      : firstFileCandles.slice(startIndex);
  let nextFileIndex = fileIndex + 1;
  const requiredInitialCandles = Math.max(3, Math.floor(minimumInitialCandles));

  while (
    initialRawCandles.length < requiredInitialCandles &&
    nextFileIndex < files.length
  ) {
    const rows = await fetchCandleFile(
      market,
      symbol,
      files[nextFileIndex],
      signal
    );
    initialRawCandles.push(
      ...rows.filter((candle) => Date.parse(candle.time) >= cutoff)
    );
    nextFileIndex++;
  }

  const candles = aggregateCandles(initialRawCandles, interval);
  if (candles.length < 3)
    throw new Error(
      `${symbol.symbol} does not have enough data for ${interval}.`
    );

  const baseVisible =
    mode === 'random-segment'
      ? Math.min(180, Math.max(1, candles.length - 1))
      : initialVisibleCount(candles.length);
  const maxRandomVisible = Math.max(
    baseVisible,
    candles.length -
      Math.min(100, Math.max(2, Math.floor(candles.length * 0.1)))
  );
  const initialVisible =
    mode === 'random-time' && maxRandomVisible > baseVisible
      ? baseVisible +
        Math.floor(Math.random() * (maxRandomVisible - baseVisible + 1))
      : baseVisible;
  let remainingFileIndex = nextFileIndex;
  let earlierFileIndex = fileIndex - 1;
  let earlierCandlesInSelectedFile =
    mode === 'random-segment' ? firstFileCandles.slice(0, startIndex) : [];

  return {
    symbol: symbol.symbol,
    interval,
    candles,
    startMonth: candles[0].time,
    initialVisible,
    loadRemaining: async (onChunk) => {
      while (remainingFileIndex < files.length) {
        if (signal?.aborted) throw abortError();
        const rows = await fetchCandleFile(
          market,
          symbol,
          files[remainingFileIndex],
          signal
        );
        const chunk = aggregateCandles(
          rows
            .filter((candle) => Date.parse(candle.time) >= cutoff)
            .sort(
              (left, right) => Date.parse(left.time) - Date.parse(right.time)
            ),
          interval
        );
        if (chunk.length) onChunk(chunk);
        remainingFileIndex++;
      }
    },
    loadEarlier: async () => {
      if (signal?.aborted) throw abortError();

      if (earlierCandlesInSelectedFile.length) {
        const chunk = aggregateCandles(earlierCandlesInSelectedFile, interval);
        earlierCandlesInSelectedFile = [];
        return chunk;
      }

      if (earlierFileIndex < 0) return [];
      const rows = await fetchCandleFile(
        market,
        symbol,
        files[earlierFileIndex],
        signal
      );
      earlierFileIndex--;
      return aggregateCandles(
        rows
          .filter((candle) => Date.parse(candle.time) >= cutoff)
          .sort(
            (left, right) => Date.parse(left.time) - Date.parse(right.time)
          ),
        interval
      );
    },
  };
}
