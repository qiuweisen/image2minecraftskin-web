import type { Candle } from './types';

/**
 * Play data is deliberately split into small immutable objects.  The first
 * request only needs one chunk, while the old full-symbol JSON remains
 * available as a backwards-compatible fallback.
 */
export const PLAY_DATA_CHUNK_SIZE = 512;

export type BundledSource = 'stooq' | 'binancev' | 'binance';

export type ChunkDescriptor = {
  id: string;
  count: number;
  first: string;
  last: string;
};

export type SymbolChunkManifest = {
  total: number;
  chunkSize: number;
  chunks: ChunkDescriptor[];
};

export type BundledManifest = {
  stooq?: string[];
  binancev?: string[];
  binance?: string[];
  chunks?: Partial<Record<BundledSource, Record<string, SymbolChunkManifest>>>;
};

export function buildSymbolChunkManifest(
  candles: Candle[],
  chunkSize = PLAY_DATA_CHUNK_SIZE
): SymbolChunkManifest {
  const safeChunkSize = Math.max(1, Math.floor(chunkSize));
  const chunks: ChunkDescriptor[] = [];

  for (let offset = 0; offset < candles.length; offset += safeChunkSize) {
    const rows = candles.slice(offset, offset + safeChunkSize);
    if (!rows.length) continue;
    chunks.push({
      id: String(chunks.length).padStart(4, '0'),
      count: rows.length,
      first: rows[0].time,
      last: rows[rows.length - 1].time,
    });
  }

  return {
    total: candles.length,
    chunkSize: safeChunkSize,
    chunks,
  };
}

export function findChunkIndexForTime(
  chunks: ChunkDescriptor[],
  requestedTime: string
): number {
  const target = Date.parse(requestedTime);
  if (!Number.isFinite(target) || chunks.length === 0) return -1;

  const containing = chunks.findIndex((chunk) => {
    const first = Date.parse(chunk.first);
    const last = Date.parse(chunk.last);
    return (
      Number.isFinite(first) &&
      Number.isFinite(last) &&
      target >= first &&
      target <= last
    );
  });
  if (containing >= 0) return containing;

  return target < Date.parse(chunks[0].first) ? 0 : chunks.length - 1;
}
