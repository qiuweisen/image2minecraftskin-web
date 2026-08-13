'use client';

import { createWithEqualityFn } from 'zustand/traditional';
import type { Candle } from '@/lib/ohlcv/types';
import type {
  Position,
  SessionResult,
  SessionState,
} from '@/store/useSessionStore';

export type DayTradingState = SessionState & {
  historyMonths: 1 | 3 | 6 | 12;
  setHistoryMonths: (months: 1 | 3 | 6 | 12) => void;
  appendData: (rows: Candle[]) => void;
};

const INITIAL_CASH = 100000;
const INITIAL_VISIBLE = 180;
const STORAGE_KEY = 'cg-dt-active-session';

const emptyPosition = (): Position => ({ side: null, qty: 0, avgPrice: 0 });

const lastClose = (state: SessionState) =>
  state.visible > 0 && state.candles.length > 0
    ? state.candles[Math.min(state.visible - 1, state.candles.length - 1)].close
    : 0;

const unrealizedPnl = (position: Position, price: number) => {
  if (!position.qty) return 0;
  return position.side === 'short'
    ? (position.avgPrice - price) * position.qty
    : (price - position.avgPrice) * position.qty;
};

const equityValue = (cash: number, position: Position, price: number) => {
  if (!position.qty) return cash;
  return position.side === 'short'
    ? cash - position.qty * price
    : cash + position.qty * price;
};

const marketContext = (candles: Candle[], index: number) => {
  const recent = candles.slice(Math.max(0, index - 19), index + 1);
  const current = candles[index];
  const previous = index > 0 ? candles[index - 1] : current;
  const high = Math.max(...recent.map((c) => c.high));
  const low = Math.min(...recent.map((c) => c.low));
  const range = high - low;
  let trendDirection: 'up' | 'down' | 'sideways' = 'sideways';

  if (recent.length >= 5) {
    const middle = Math.floor(recent.length / 2);
    const first = recent.slice(0, middle);
    const second = recent.slice(middle);
    const firstAverage =
      first.reduce((sum, candle) => sum + candle.close, 0) / first.length;
    const secondAverage =
      second.reduce((sum, candle) => sum + candle.close, 0) / second.length;
    const change = ((secondAverage - firstAverage) / firstAverage) * 100;
    if (change > 2) trendDirection = 'up';
    if (change < -2) trendDirection = 'down';
  }

  return {
    open: current.open,
    prevClose: previous.close,
    priceVsHigh20:
      Math.round(
        (range > 0 ? ((high - current.close) / range) * 100 : 50) * 10
      ) / 10,
    priceVsLow20:
      Math.round(
        (range > 0 ? ((current.close - low) / range) * 100 : 50) * 10
      ) / 10,
    trendDirection,
    candlesBefore: index,
  };
};

const resetState = () => ({
  candles: [] as Candle[],
  visible: INITIAL_VISIBLE,
  cash: INITIAL_CASH,
  position: emptyPosition(),
  pnlRealized: 0,
  marks: [] as DayTradingState['marks'],
  startMonth: undefined,
  isFinished: false,
});

const persist = (state: DayTradingState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        category: state.category,
        sessionMode: state.sessionMode,
        symbol: state.symbol,
        interval: state.interval,
        historyMonths: state.historyMonths,
        startMonth: state.startMonth,
        marks: state.marks,
        position: state.position,
        cash: state.cash,
        pnlRealized: state.pnlRealized,
        visible: state.visible,
      })
    );
  } catch {}
};

export const useDayTradingSessionStore = createWithEqualityFn<DayTradingState>(
  (set, get) => ({
    ...resetState(),
    lastResult: undefined,
    symbol: 'BTCUSDT',
    interval: '5m',
    category: 'crypto',
    sessionMode: 'random-segment',
    summaryOpen: false,
    historyMonths: 12,

    loadData: (rows, symbol, interval, startMonth, visible) => {
      set({
        candles: rows,
        visible: visible ?? INITIAL_VISIBLE,
        symbol: symbol || get().symbol,
        interval: interval || get().interval,
        startMonth: startMonth || get().startMonth,
      });
      persist(get());
    },

    appendData: (rows) => {
      if (!rows.length) return;
      const current = get().candles;
      const lastTime = current.length
        ? Date.parse(current[current.length - 1].time)
        : Number.NEGATIVE_INFINITY;
      const appended = rows.filter(
        (candle) => Date.parse(candle.time) > lastTime
      );
      if (!appended.length) return;
      set({ candles: [...current, ...appended] });
    },

    nextBar: (count = 1) => {
      const state = get();
      if (state.visible < state.candles.length) {
        set({
          visible: Math.min(
            state.candles.length,
            state.visible + Math.max(1, Math.floor(count))
          ),
        });
        persist(get());
      }
    },

    buy: (qty) => {
      if (qty <= 0) return;
      const state = get();
      if (!state.candles.length || state.visible <= 0) return;
      const index = Math.min(state.visible - 1, state.candles.length - 1);
      const candle = state.candles[index];
      const price = candle.close;
      const position = state.position;
      const cost = price * qty;
      const mark = {
        kind: 'buy' as const,
        index,
        price,
        qty,
        time: candle.time,
        high: candle.high,
        low: candle.low,
        ...marketContext(state.candles, index),
      };

      if (!(position.qty > 0 && position.side === 'short') && cost > state.cash)
        return;

      if (position.qty > 0 && position.side === 'long') {
        const nextQty = position.qty + qty;
        set({
          position: {
            side: 'long',
            qty: nextQty,
            avgPrice: (position.avgPrice * position.qty + cost) / nextQty,
          },
          cash: state.cash - cost,
          marks: [...state.marks, mark],
        });
      } else if (position.qty > 0 && position.side === 'short') {
        const coverQty = Math.min(qty, position.qty);
        const flipQty = qty - coverQty;
        const coverCost = price * coverQty;
        if (flipQty > 0 && price * flipQty > state.cash - coverCost) return;
        set({
          position:
            flipQty > 0
              ? { side: 'long', qty: flipQty, avgPrice: price }
              : coverQty === position.qty
                ? emptyPosition()
                : { ...position, qty: position.qty - coverQty },
          pnlRealized:
            state.pnlRealized + (position.avgPrice - price) * coverQty,
          cash: state.cash - cost,
          marks: [...state.marks, mark],
        });
      } else {
        set({
          position: { side: 'long', qty, avgPrice: price },
          cash: state.cash - cost,
          marks: [...state.marks, mark],
        });
      }
      persist(get());
    },

    sell: (qty) => {
      if (qty <= 0) return;
      const state = get();
      if (!state.candles.length || state.visible <= 0) return;
      const index = Math.min(state.visible - 1, state.candles.length - 1);
      const candle = state.candles[index];
      const price = candle.close;
      const position = state.position;
      const value = price * qty;
      const mark = {
        kind: 'sell' as const,
        index,
        price,
        qty,
        time: candle.time,
        high: candle.high,
        low: candle.low,
        ...marketContext(state.candles, index),
      };

      if (!(position.qty > 0 && position.side === 'long')) {
        const equity =
          position.side === 'short'
            ? state.cash - position.qty * price
            : state.cash;
        const currentShortValue =
          position.side === 'short' ? position.qty * price : 0;
        if (currentShortValue + value > equity) return;
      }

      if (position.qty > 0 && position.side === 'short') {
        const nextQty = position.qty + qty;
        set({
          position: {
            side: 'short',
            qty: nextQty,
            avgPrice: (position.avgPrice * position.qty + value) / nextQty,
          },
          cash: state.cash + value,
          marks: [...state.marks, mark],
        });
      } else if (position.qty > 0 && position.side === 'long') {
        const closeQty = Math.min(qty, position.qty);
        const flipQty = qty - closeQty;
        const equityAfterClose = state.cash + price * closeQty;
        if (flipQty > 0 && price * flipQty > equityAfterClose) return;
        set({
          position:
            flipQty > 0
              ? { side: 'short', qty: flipQty, avgPrice: price }
              : closeQty === position.qty
                ? emptyPosition()
                : { ...position, qty: position.qty - closeQty },
          pnlRealized:
            state.pnlRealized + (price - position.avgPrice) * closeQty,
          cash: state.cash + value,
          marks: [...state.marks, mark],
        });
      } else {
        set({
          position: { side: 'short', qty, avgPrice: price },
          cash: state.cash + value,
          marks: [...state.marks, mark],
        });
      }
      persist(get());
    },

    finish: () => {
      const state = get();
      const equity = equityValue(state.cash, state.position, lastClose(state));
      const result: SessionResult = {
        id: Math.random().toString(36).slice(2),
        symbol: state.symbol,
        interval: state.interval,
        bars: state.visible,
        pnlPct: (equity - INITIAL_CASH) / INITIAL_CASH,
        pnlReal: state.pnlRealized,
        createdAt: new Date().toISOString(),
        trades: state.marks.map((mark) => ({
          side: mark.kind,
          price: mark.price,
          qty: mark.qty,
          time: mark.time,
          open: mark.open,
          prevClose: mark.prevClose,
          priceVsHigh20: mark.priceVsHigh20,
          priceVsLow20: mark.priceVsLow20,
          trendDirection: mark.trendDirection,
          candlesBefore: mark.candlesBefore,
        })),
      };
      set({ lastResult: result, summaryOpen: true, isFinished: true });
      return result;
    },

    reset: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      set(resetState());
    },
    clearResult: () => set({ lastResult: undefined }),
    setCategory: (category) => set({ category }),
    setSessionMode: (sessionMode) => set({ sessionMode }),
    setHistoryMonths: (historyMonths) => set({ historyMonths }),
    closeSummary: () => set({ summaryOpen: false }),
    dismissSummaryAndReset: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      set({ ...resetState(), lastResult: undefined, summaryOpen: false });
    },
    restoreSessionState: (data) => {
      if (!data) return;
      set({
        marks: data.marks || [],
        position: data.position || emptyPosition(),
        cash: data.cash ?? INITIAL_CASH,
        pnlRealized: data.pnlRealized ?? 0,
        visible: data.visible ?? INITIAL_VISIBLE,
        category: data.category === 'fx' ? 'fx' : 'crypto',
        sessionMode:
          data.sessionMode === 'random-time' ? 'random-time' : 'random-segment',
        historyMonths: [1, 3, 6, 12].includes(data.historyMonths)
          ? data.historyMonths
          : 12,
      });
      persist(get());
    },
  })
);

export const selectDayTradingUnrealized = (state: DayTradingState) =>
  unrealizedPnl(state.position, lastClose(state));
export const selectDayTradingEquity = (state: DayTradingState) =>
  equityValue(state.cash, state.position, lastClose(state));
