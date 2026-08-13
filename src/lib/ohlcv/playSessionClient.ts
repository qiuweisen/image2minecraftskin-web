import { MAX_CANDLES } from '@/lib/config';
import {
  findChunkIndexForTime,
  type BundledManifest,
  type BundledSource,
  type SymbolChunkManifest,
} from '@/lib/ohlcv/chunkManifest';
import type {
  Candle,
  LocalSessionMode,
  MarketCategory,
  PlayChunkLoader,
  PlaySessionPayload,
} from '@/lib/ohlcv/types';

const env = import.meta.env as Record<string, unknown>;
const configuredOhlcvBaseUrl =
  env.VITE_OHLCV_BASE ?? env.NEXT_PUBLIC_OHLCV_BASE;
const BUNDLED_BASE_URL =
  typeof configuredOhlcvBaseUrl === 'string' && configuredOhlcvBaseUrl
    ? configuredOhlcvBaseUrl.replace(/\/$/, '')
    : '/api/play-data';
const INITIAL_VISIBLE_CANDLES = 180;
const MIN_PLAYABLE_CANDLES = 100;

let manifestCache: BundledManifest | null = null;
let manifestPromise: Promise<BundledManifest | null> | null = null;
const chunkPromises = new Map<string, Promise<Candle[]>>();

async function fetchManifest(): Promise<BundledManifest | null> {
  if (manifestCache) return manifestCache;
  if (!manifestPromise) {
    manifestPromise = fetch(`${BUNDLED_BASE_URL}/manifest.json`, {
      cache: 'force-cache',
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as BundledManifest;
        manifestCache = data;
        return data;
      })
      .catch(() => null)
      .finally(() => {
        manifestPromise = null;
      });
  }
  return manifestPromise;
}

export function preloadPlayManifest(): void {
  void fetchManifest();
}

const isCryptoSymbol = (s: string) =>
  /USDT$|BUSD$/.test(s) ||
  /^(BTC|ETH|SOL|BNB|ADA|XRP|DOGE|DOT|AVAX|LINK|LTC|TRX|MATIC|SHIB|ATOM|NEAR|AAVE|OP|ARB)/.test(
    s
  );

const isFxSymbol = (s: string) => /^[A-Z]{6}$/.test(s) && !isCryptoSymbol(s);

function resolvePool(
  manifest: BundledManifest,
  category: MarketCategory
): { pool: string[]; source: BundledSource } {
  const stooqSymbols = manifest.stooq || [];

  if (category === 'stocks') {
    return {
      pool: stooqSymbols.filter((s) => !isFxSymbol(s) && !isCryptoSymbol(s)),
      source: 'stooq',
    };
  }

  if (category === 'fx') {
    return {
      pool: stooqSymbols.filter((s) => isFxSymbol(s)),
      source: 'stooq',
    };
  }

  if (manifest.binancev && manifest.binancev.length > 0) {
    return {
      pool: manifest.binancev,
      source: 'binancev',
    };
  }

  if (manifest.binance && manifest.binance.length > 0) {
    return {
      pool: manifest.binance,
      source: 'binance',
    };
  }

  return {
    pool: stooqSymbols.filter((s) => isCryptoSymbol(s)),
    source: 'stooq',
  };
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomTimeInitialVisible(totalCandles: number): number {
  if (totalCandles <= 0) return 0;
  const minVisible = Math.min(INITIAL_VISIBLE_CANDLES, totalCandles);
  const maxVisible = Math.max(minVisible, totalCandles - MIN_PLAYABLE_CANDLES);
  if (maxVisible <= minVisible) return minVisible;
  return minVisible + Math.floor(Math.random() * (maxVisible - minVisible + 1));
}

async function fetchSymbolCandles(
  source: string,
  symbol: string
): Promise<Candle[]> {
  const res = await fetch(`${BUNDLED_BASE_URL}/${source}/${symbol}.json`, {
    cache: 'force-cache',
  });
  if (!res.ok) return [];
  return (await res.json()) as Candle[];
}

async function fetchSymbolChunk(
  source: BundledSource,
  symbol: string,
  chunkId: string
): Promise<Candle[]> {
  const key = `${source}/${symbol}/${chunkId}`;
  const existing = chunkPromises.get(key);
  if (existing) return existing;

  const promise = fetch(
    `${BUNDLED_BASE_URL}/${source}/${symbol}/chunks/${chunkId}.json`,
    { cache: 'force-cache' }
  )
    .then(async (res) => {
      if (!res.ok) return [];
      const rows = (await res.json()) as unknown;
      return Array.isArray(rows) ? (rows as Candle[]) : [];
    })
    .catch(() => {
      throw new Error(`Unable to load ${symbol} history chunk.`);
    });
  chunkPromises.set(key, promise);
  return promise;
}

function normalizePreferredStartTime(value?: string): number {
  if (!value) return Number.NaN;
  const legacyMonth = /^\d{4}\/\d{2}$/.test(value)
    ? `${value.replace('/', '-')}-01`
    : value;
  return Date.parse(legacyMonth);
}

function getChunkManifest(
  manifest: BundledManifest,
  source: BundledSource,
  symbol: string
): SymbolChunkManifest | null {
  const value = manifest.chunks?.[source]?.[symbol];
  if (!value || !Array.isArray(value.chunks) || value.chunks.length === 0)
    return null;
  return value;
}

function pickChunkIndex(chunkManifest: SymbolChunkManifest): number {
  const preferred = chunkManifest.chunks.filter(
    (chunk) => chunk.count >= INITIAL_VISIBLE_CANDLES
  );
  const candidates =
    preferred.length > 0
      ? preferred
      : chunkManifest.chunks.filter(
          (chunk) => chunk.count >= MIN_PLAYABLE_CANDLES
        );
  const pool = candidates.length > 0 ? candidates : chunkManifest.chunks;
  const selected = pickRandom(pool);
  return Math.max(
    0,
    chunkManifest.chunks.findIndex((chunk) => chunk.id === selected.id)
  );
}

export async function loadPlaySessionClient({
  category,
  preferredSymbol,
  preferredStartTime,
  mode = 'random-segment',
}: {
  category: MarketCategory;
  preferredSymbol?: string;
  preferredStartTime?: string;
  mode?: LocalSessionMode;
}): Promise<PlaySessionPayload> {
  const manifest = await fetchManifest();
  if (!manifest) throw new Error('Unable to load play session.');

  const { pool, source } = resolvePool(manifest, category);
  if (pool.length === 0) throw new Error('Unable to load play session.');

  const upperSymbol = preferredSymbol?.toUpperCase();
  const symbol =
    upperSymbol && pool.includes(upperSymbol) ? upperSymbol : pickRandom(pool);
  const chunkManifest = getChunkManifest(manifest, source, symbol);

  // New releases expose immutable chunks. Fetch only the selected chunk for
  // the first paint; the next chunk is fetched only when the user reaches it.
  if (chunkManifest) {
    const requestedStart = normalizePreferredStartTime(preferredStartTime);
    const selectedChunkIndex =
      mode === 'random-segment' && Number.isFinite(requestedStart)
        ? Math.max(
            0,
            findChunkIndexForTime(
              chunkManifest.chunks,
              new Date(requestedStart).toISOString()
            )
          )
        : pickChunkIndex(chunkManifest);
    const selectedChunk =
      chunkManifest.chunks[selectedChunkIndex] || chunkManifest.chunks[0];
    const selectedRows = await fetchSymbolChunk(
      source,
      symbol,
      selectedChunk.id
    );
    if (selectedRows.length === 0)
      throw new Error('Unable to load play session.');

    let startIndex = 0;
    if (mode === 'random-segment') {
      if (Number.isFinite(requestedStart)) {
        const found = selectedRows.findIndex(
          (candle) => Date.parse(candle.time) >= requestedStart
        );
        startIndex = found >= 0 ? found : 0;
      } else {
        const maxOffset = Math.max(
          0,
          selectedRows.length - INITIAL_VISIBLE_CANDLES
        );
        startIndex = Math.floor(Math.random() * (maxOffset + 1));
      }
    }

    const candles = selectedRows.slice(startIndex);
    if (candles.length === 0) throw new Error('Unable to load play session.');

    let nextChunkIndex = selectedChunkIndex + 1;
    const loadNextChunk: PlayChunkLoader = {
      hasMore: () => nextChunkIndex < chunkManifest.chunks.length,
      load: async () => {
        while (nextChunkIndex < chunkManifest.chunks.length) {
          const nextChunk = chunkManifest.chunks[nextChunkIndex];
          const rows = await fetchSymbolChunk(source, symbol, nextChunk.id);
          nextChunkIndex++;
          if (rows.length > 0) return rows;
        }
        return [];
      },
    };

    return {
      symbol,
      interval: '1D',
      candles,
      startMonth: candles[0].time,
      initialVisible:
        mode === 'random-time'
          ? pickRandomTimeInitialVisible(candles.length)
          : Math.min(INITIAL_VISIBLE_CANDLES, candles.length),
      loadNextChunk:
        nextChunkIndex < chunkManifest.chunks.length
          ? loadNextChunk
          : undefined,
    };
  }

  // Backward-compatible path for currently published manifests/releases.
  const allCandles = await fetchSymbolCandles(source, symbol);
  if (allCandles.length === 0) throw new Error('Unable to load play session.');

  let startIndex: number | null = null;
  if (mode === 'random-segment') {
    const requestedStart = normalizePreferredStartTime(preferredStartTime);
    const idx = Number.isFinite(requestedStart)
      ? allCandles.findIndex((c) => Date.parse(c.time) >= requestedStart)
      : -1;
    if (idx >= 0 && allCandles.length - idx >= MIN_PLAYABLE_CANDLES)
      startIndex = idx;
    if (startIndex === null && allCandles.length > MIN_PLAYABLE_CANDLES) {
      startIndex = Math.floor(
        Math.random() * (allCandles.length - MIN_PLAYABLE_CANDLES)
      );
    }
  }

  const sessionCandles =
    mode === 'random-time' ? allCandles : allCandles.slice(startIndex ?? 0);
  const candles =
    MAX_CANDLES > 0 && sessionCandles.length > MAX_CANDLES
      ? sessionCandles.slice(sessionCandles.length - MAX_CANDLES)
      : sessionCandles;
  if (candles.length === 0) throw new Error('Unable to load play session.');

  return {
    symbol,
    interval: '1D',
    candles,
    startMonth: candles[0].time,
    initialVisible:
      mode === 'random-time'
        ? pickRandomTimeInitialVisible(candles.length)
        : Math.min(INITIAL_VISIBLE_CANDLES, candles.length),
  };
}
