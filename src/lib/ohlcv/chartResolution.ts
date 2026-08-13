import type { Candle } from '@/lib/ohlcv/types';

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const WEEK_MS = 7 * DAY_MS;
const EPOCH_MONDAY = Date.UTC(1970, 0, 5);

const weekBucketStart = (timeMs: number, weeks: number) => {
  const date = new Date(timeMs);
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day);
  date.setUTCHours(0, 0, 0, 0);
  return (
    EPOCH_MONDAY +
    Math.floor((date.getTime() - EPOCH_MONDAY) / (weeks * WEEK_MS)) *
      weeks *
      WEEK_MS
  );
};

const monthBucketStart = (timeMs: number, months: number) => {
  const date = new Date(timeMs);
  const totalMonths = date.getUTCFullYear() * 12 + date.getUTCMonth();
  const bucketMonth = Math.floor(totalMonths / months) * months;
  return Date.UTC(Math.floor(bucketMonth / 12), bucketMonth % 12, 1);
};

export const chartResolutionBucketStart = (
  timeMs: number,
  resolution: string
) => {
  if (/^\d+$/.test(resolution)) {
    const bucketMs = Number(resolution) * MINUTE_MS;
    return Math.floor(timeMs / bucketMs) * bucketMs;
  }

  const daily = resolution.match(/^(\d*)D$/);
  if (daily) {
    const bucketMs = Number(daily[1] || 1) * DAY_MS;
    return Math.floor(timeMs / bucketMs) * bucketMs;
  }

  const weekly = resolution.match(/^(\d*)W$/);
  if (weekly) return weekBucketStart(timeMs, Number(weekly[1] || 1));

  const monthly = resolution.match(/^(\d*)M$/);
  if (monthly) return monthBucketStart(timeMs, Number(monthly[1] || 1));

  return timeMs;
};

const candleBucket = (candle: Candle, resolution: string) =>
  chartResolutionBucketStart(Date.parse(candle.time), resolution);

/**
 * Returns the raw 5-minute visibility count required to reveal one complete
 * TradingView bar after the bar that is currently visible.
 */
export const nextVisibleForChartResolution = (
  candles: Candle[],
  visible: number,
  resolution: string
) => {
  if (candles.length === 0 || visible >= candles.length)
    return Math.min(visible, candles.length);
  if (visible <= 0) return 1;

  const currentBucket = candleBucket(candles[visible - 1], resolution);
  let index = visible;

  // If the current displayed bar is partial, finish it before revealing the next bar.
  while (
    index < candles.length &&
    candleBucket(candles[index], resolution) === currentBucket
  ) {
    index += 1;
  }
  if (index >= candles.length) return candles.length;

  const nextBucket = candleBucket(candles[index], resolution);
  while (
    index < candles.length &&
    candleBucket(candles[index], resolution) === nextBucket
  ) {
    index += 1;
  }

  return index;
};
