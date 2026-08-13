export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type MarketCategory = 'stocks' | 'fx' | 'crypto';
export type LocalSessionMode = 'random-segment' | 'random-time';

export type PlayChunkLoader = {
  load: () => Promise<Candle[]>;
  hasMore: () => boolean;
};

export type PlaySessionPayload = {
  symbol: string;
  interval: string;
  candles: Candle[];
  startMonth: string;
  initialVisible: number;
  /** Loads the next immutable history chunk when the current chunk is exhausted. */
  loadNextChunk?: PlayChunkLoader;
};
