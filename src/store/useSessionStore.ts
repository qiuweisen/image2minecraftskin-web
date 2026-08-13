'use client';
import { createWithEqualityFn } from 'zustand/traditional';
import type { Candle } from '@/lib/ohlcv/types';

export type Position = {
  side: 'long' | 'short' | null;
  qty: number;
  avgPrice: number;
};
export type SessionMode = 'random-segment' | 'random-time';

export type SessionResult = {
  id: string;
  symbol: string; // e.g. "AAPL"
  interval: string; // e.g. "1D"
  bars: number; // visible bars
  pnlPct: number; // decimal, e.g. 0.123
  pnlReal: number; // realized PnL
  createdAt: string; // ISO
  trades: {
    side: 'buy' | 'sell';
    price: number;
    qty: number;
    time: string;
    profit?: number; // for closing trades (optional estimation)
    // Enhanced market context for AI analysis
    open?: number;
    prevClose?: number;
    priceVsHigh20?: number;
    priceVsLow20?: number;
    trendDirection?: 'up' | 'down' | 'sideways';
    candlesBefore?: number;
  }[];
};

export type SessionState = {
  candles: Candle[];
  visible: number; // initially 60
  cash: number; // initial 100000
  position: Position;
  pnlRealized: number;
  marks: {
    kind: 'buy' | 'sell';
    index: number;
    price: number;
    qty: number;
    time: string;
    high: number;
    low: number;
    // Enhanced context for AI analysis
    open: number; // Current candle open price
    prevClose: number; // Previous candle close price
    priceVsHigh20: number; // Position relative to 20-bar high (0-100%)
    priceVsLow20: number; // Position relative to 20-bar low (0-100%)
    trendDirection: 'up' | 'down' | 'sideways'; // Recent trend based on price action
    candlesBefore: number; // How many candles since session start
  }[];
  lastResult?: SessionResult;
  symbol: string;
  interval: string;
  category: 'stocks' | 'fx' | 'crypto';
  sessionMode: SessionMode;
  summaryOpen: boolean;
  isFinished: boolean;
  startMonth?: string;
  loadData: (
    rows: Candle[],
    symbol?: string,
    interval?: string,
    startMonth?: string,
    visible?: number
  ) => void;
  appendData: (rows: Candle[]) => void;
  nextBar: (count?: number) => void;
  buy: (qty: number) => void;
  sell: (qty: number) => void;
  finish: () => SessionResult;
  reset: () => void;
  clearResult: () => void;
  setCategory: (c: 'stocks' | 'fx' | 'crypto') => void;
  setSessionMode: (mode: SessionMode) => void;
  closeSummary: () => void;
  dismissSummaryAndReset: () => void;
  restoreSessionState: (data: any) => void;
};

const INITIAL_CASH = 100000;
const INITIAL_VISIBLE = 180;
const SESSION_DEBUG = !import.meta.env.PROD;

const debugSession = (...args: unknown[]) => {
  if (SESSION_DEBUG) console.log(...args);
};

const calcUnrealizedPnL = (position: Position, price: number) => {
  if (!position.qty) return 0;
  return position.side === 'short'
    ? (position.avgPrice - price) * position.qty
    : (price - position.avgPrice) * position.qty;
};
const calcEquity = (cash: number, position: Position, price: number) => {
  if (!position.qty) return cash;
  return position.side === 'short'
    ? cash - position.qty * price
    : cash + position.qty * price;
};

// Helper function to calculate market context for AI analysis
const calculateMarketContext = (candles: Candle[], currentIndex: number) => {
  const lookback = 20;
  const startIdx = Math.max(0, currentIndex - lookback + 1);
  const recentCandles = candles.slice(startIdx, currentIndex + 1);

  const currentCandle = candles[currentIndex];
  const prevCandle =
    currentIndex > 0 ? candles[currentIndex - 1] : currentCandle;

  // Calculate 20-bar high and low
  const high20 = Math.max(...recentCandles.map((c) => c.high));
  const low20 = Math.min(...recentCandles.map((c) => c.low));
  const range = high20 - low20;

  // Price position as percentage (0% = at low, 100% = at high)
  const priceVsHigh20 =
    range > 0 ? ((high20 - currentCandle.close) / range) * 100 : 50;
  const priceVsLow20 =
    range > 0 ? ((currentCandle.close - low20) / range) * 100 : 50;

  // Trend direction based on recent price action
  let trendDirection: 'up' | 'down' | 'sideways' = 'sideways';
  if (recentCandles.length >= 5) {
    const firstHalf = recentCandles.slice(
      0,
      Math.floor(recentCandles.length / 2)
    );
    const secondHalf = recentCandles.slice(
      Math.floor(recentCandles.length / 2)
    );
    const firstAvg =
      firstHalf.reduce((s, c) => s + c.close, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((s, c) => s + c.close, 0) / secondHalf.length;
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    if (change > 2) trendDirection = 'up';
    else if (change < -2) trendDirection = 'down';
  }

  return {
    open: currentCandle.open,
    prevClose: prevCandle.close,
    priceVsHigh20: Math.round(priceVsHigh20 * 10) / 10,
    priceVsLow20: Math.round(priceVsLow20 * 10) / 10,
    trendDirection,
    candlesBefore: currentIndex,
  };
};

// Helper function to persist session state (defined outside store for reuse)
const saveSessionState = (state: SessionState) => {
  try {
    const sessionData = {
      category: state.category,
      sessionMode: state.sessionMode,
      symbol: state.symbol,
      interval: state.interval,
      startMonth: state.startMonth,
      marks: state.marks,
      position: state.position,
      cash: state.cash,
      pnlRealized: state.pnlRealized,
      visible: state.visible,
    };
    localStorage.setItem('cg-active-session', JSON.stringify(sessionData));
  } catch {}
};

const buildResetState = (): Pick<
  SessionState,
  | 'candles'
  | 'visible'
  | 'cash'
  | 'position'
  | 'pnlRealized'
  | 'marks'
  | 'startMonth'
  | 'isFinished'
> => ({
  candles: [],
  visible: INITIAL_VISIBLE,
  cash: INITIAL_CASH,
  position: { side: null, qty: 0, avgPrice: 0 },
  pnlRealized: 0,
  marks: [],
  startMonth: undefined,
  isFinished: false,
});

export const useSessionStore = createWithEqualityFn<SessionState>(
  (set, get) => ({
    candles: [],
    visible: INITIAL_VISIBLE,
    cash: INITIAL_CASH,
    position: { side: null, qty: 0, avgPrice: 0 },
    pnlRealized: 0,
    marks: [],
    lastResult: undefined,
    symbol: 'AAPL',
    interval: '1D',
    category: 'stocks',
    sessionMode: 'random-segment',
    summaryOpen: false,
    isFinished: false,
    startMonth: undefined,

    loadData: (
      rows: Candle[],
      symbol?: string,
      interval?: string,
      startMonth?: string,
      visible?: number
    ) => {
      const next: Partial<SessionState> = {
        candles: rows,
        visible: visible ?? INITIAL_VISIBLE,
      };
      if (symbol) next.symbol = symbol;
      if (interval) next.interval = interval;
      if (startMonth) next.startMonth = startMonth;
      set(next);
      // Persist session
      saveSessionState(get());
    },

    appendData: (rows: Candle[]) => {
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
      const { visible, candles } = get();
      const nextVisible = Math.min(
        candles.length,
        visible + Math.max(1, Math.floor(count))
      );
      debugSession(`[Store] NextBar: visible=${visible} -> ${nextVisible}`);
      if (visible < candles.length) {
        set({ visible: nextVisible });
        saveSessionState(get());
      }
    },

    buy: (qty: number) => {
      if (qty <= 0) return;
      const state = get();
      const { visible, candles, position } = state;
      if (visible === 0 || candles.length === 0) return;
      const candle = candles[Math.min(visible - 1, candles.length - 1)];
      const price = candle.close;
      const time = candle.time;
      const cost = price * qty;

      debugSession(
        `[Store] Buy request: visible=${visible}, price=${price}, time=${time}`
      );

      // Prevent buying if insufficient cash (only for opening/adding to long positions)
      // Covering shorts is allowed as it doesn't require additional cash outlay beyond covering cost
      if (
        !(position.qty > 0 && position.side === 'short') &&
        cost > state.cash
      ) {
        debugSession('[Store] Buy failed: Insufficient cash');
        return; // Insufficient funds
      }
      if (position.qty > 0 && position.side === 'long') {
        // add to long
        const newQty = position.qty + qty;
        const avgPrice =
          (position.avgPrice * position.qty + price * qty) / newQty;
        set({
          position: { side: 'long', qty: newQty, avgPrice },
          cash: state.cash - cost,
          marks: [
            ...state.marks,
            {
              kind: 'buy',
              index: visible - 1,
              price,
              qty,
              time,
              high: candle.high,
              low: candle.low,
              ...calculateMarketContext(candles, visible - 1),
            },
          ],
        });
      } else if (position.qty > 0 && position.side === 'short') {
        // buy to cover short (and potentially flip to long)
        const coverQty = Math.min(qty, position.qty); // qty to cover short
        const flipQty = qty - coverQty; // qty to open long after covering short
        const realized = (position.avgPrice - price) * coverQty; // short P&L

        // Check funds if flipping to long
        const coverCost = price * coverQty;
        const flipCost = price * flipQty;
        if (flipQty > 0 && flipCost > state.cash - coverCost) {
          debugSession(
            '[Store] Buy failed: Insufficient cash for flip to long'
          );
          return;
        }

        const nextState: Partial<SessionState> = {
          pnlRealized: state.pnlRealized + realized,
          cash: state.cash - price * qty, // pay for all shares bought
          marks: [
            ...state.marks,
            {
              kind: 'buy',
              index: visible - 1,
              price,
              qty,
              time,
              high: candle.high,
              low: candle.low,
              ...calculateMarketContext(candles, visible - 1),
            },
          ],
        };
        if (flipQty > 0) {
          // Flip to long position
          nextState.position = { side: 'long', qty: flipQty, avgPrice: price };
        } else if (coverQty === position.qty) {
          // Fully covered, no position
          nextState.position = { side: null, qty: 0, avgPrice: 0 };
        } else {
          // Partially covered, still short
          nextState.position = { ...position, qty: position.qty - coverQty };
        }
        set(nextState);
      } else {
        // open new long
        set({
          position: { side: 'long', qty, avgPrice: price },
          cash: state.cash - cost,
          marks: [
            ...state.marks,
            {
              kind: 'buy',
              index: visible - 1,
              price,
              qty,
              time,
              high: candle.high,
              low: candle.low,
              ...calculateMarketContext(candles, visible - 1),
            },
          ],
        });
      }
      saveSessionState(get());
    },

    sell: (qty: number) => {
      if (qty <= 0) return;
      const state = get();
      const { visible, candles, position } = state;
      if (visible === 0 || candles.length === 0) return;
      const candle = candles[Math.min(visible - 1, candles.length - 1)];
      const price = candle.close;
      const time = candle.time;
      const cost = price * qty;

      debugSession(
        `[Store] Sell request: visible=${visible}, price=${price}, time=${time}`
      );

      // Margin requirement for shorting: total short exposure cannot exceed current equity
      // This allows profitable traders to use their gains for larger positions
      const isClosingLong = position.qty > 0 && position.side === 'long';
      if (!isClosingLong) {
        // Calculate current equity (cash + position value if long, cash - position value if short)
        const currentEquity =
          position.side === 'short'
            ? state.cash - position.qty * price
            : state.cash +
              (position.side === 'long' ? position.qty * price : 0);
        // Calculate current short exposure + new short value
        const currentShortValue =
          position.side === 'short' ? position.qty * price : 0;
        const newTotalShortValue = currentShortValue + cost;
        if (newTotalShortValue > currentEquity) {
          debugSession(
            '[Store] Sell failed: Margin exceeded (max: ' + currentEquity + ')'
          );
          return; // Exceeds maximum short exposure (1x leverage limit based on current equity)
        }
      }
      if (position.qty > 0 && position.side === 'short') {
        // add to short
        const newQty = position.qty + qty;
        const avgPrice =
          (position.avgPrice * position.qty + price * qty) / newQty;
        set({
          position: { side: 'short', qty: newQty, avgPrice },
          cash: state.cash + price * qty,
          marks: [
            ...state.marks,
            {
              kind: 'sell',
              index: visible - 1,
              price,
              qty,
              time,
              high: candle.high,
              low: candle.low,
              ...calculateMarketContext(candles, visible - 1),
            },
          ],
        });
      } else if (position.qty > 0 && position.side === 'long') {
        // sell to reduce/close long (and potentially flip to short)
        const closeQty = Math.min(qty, position.qty); // qty to close long
        const flipQty = qty - closeQty; // qty to open short after closing long
        const realized = (price - position.avgPrice) * closeQty;

        // Check margin if flipping to short
        if (flipQty > 0) {
          // After closing long: cash increases by closeQty * price
          // Equity after close = new cash = state.cash + closeQty * price
          const equityAfterClose = state.cash + price * closeQty;
          const newShortValue = flipQty * price;
          if (newShortValue > equityAfterClose) {
            debugSession(
              '[Store] Sell failed: Margin exceeded for flip to short'
            );
            return;
          }
        }

        const nextState: Partial<SessionState> = {
          pnlRealized: state.pnlRealized + realized,
          cash: state.cash + price * qty, // receive cash for all shares sold
          marks: [
            ...state.marks,
            {
              kind: 'sell',
              index: visible - 1,
              price,
              qty,
              time,
              high: candle.high,
              low: candle.low,
              ...calculateMarketContext(candles, visible - 1),
            },
          ],
        };
        if (flipQty > 0) {
          // Flip to short position
          nextState.position = { side: 'short', qty: flipQty, avgPrice: price };
        } else if (closeQty === position.qty) {
          // Fully closed, no position
          nextState.position = { side: null, qty: 0, avgPrice: 0 };
        } else {
          // Partially closed, still long
          nextState.position = { ...position, qty: position.qty - closeQty };
        }
        set(nextState);
      } else {
        // open new short
        set({
          position: { side: 'short', qty, avgPrice: price },
          cash: state.cash + price * qty,
          marks: [
            ...state.marks,
            {
              kind: 'sell',
              index: visible - 1,
              price,
              qty,
              time,
              high: candle.high,
              low: candle.low,
              ...calculateMarketContext(candles, visible - 1),
            },
          ],
        });
      }
      saveSessionState(get());
    },

    finish: () => {
      const state = get();
      const {
        candles,
        visible,
        position,
        cash,
        pnlRealized,
        symbol,
        interval,
      } = state;
      const lastClose =
        candles[Math.min(visible - 1, candles.length - 1)]?.close ?? 0;
      const equity = calcEquity(cash, position, lastClose);
      const pnlPct = (equity - INITIAL_CASH) / INITIAL_CASH;
      const result: SessionResult = {
        id: Math.random().toString(36).slice(2),
        symbol,
        interval,
        bars: visible,
        pnlPct,

        pnlReal: pnlRealized,
        createdAt: new Date().toISOString(),
        trades: state.marks.map((m) => ({
          side: m.kind,
          price: m.price,
          qty: m.qty,
          time: m.time || candles[m.index]?.time || new Date().toISOString(),
          // Enhanced market context for AI analysis
          open: m.open,
          prevClose: m.prevClose,
          priceVsHigh20: m.priceVsHigh20,
          priceVsLow20: m.priceVsLow20,
          trendDirection: m.trendDirection,
          candlesBefore: m.candlesBefore,
        })),
      };
      // Do NOT clear session here. Allow user to review/dismiss.
      set({ lastResult: result, summaryOpen: true });
      return result;
    },

    reset: () => {
      localStorage.removeItem('cg-active-session');
      localStorage.removeItem('cg-active-session-drawings');
      set(buildResetState());
    },

    clearResult: () => set({ lastResult: undefined }),
    setCategory: (c) => set({ category: c }),
    setSessionMode: (mode) => set({ sessionMode: mode }),
    closeSummary: () => set({ summaryOpen: false }),
    dismissSummaryAndReset: () => {
      localStorage.removeItem('cg-active-session');
      localStorage.removeItem('cg-active-session-drawings');
      set({
        ...buildResetState(),
        lastResult: undefined,
        summaryOpen: false,
      });
    },

    restoreSessionState: (data: any) => {
      const mode =
        data?.sessionMode === 'random-time' ? 'random-time' : 'random-segment';
      if (!data) return;
      set({
        marks: data.marks || [],
        position: data.position || { side: null, qty: 0, avgPrice: 0 },
        cash: data.cash ?? INITIAL_CASH,
        pnlRealized: data.pnlRealized ?? 0,
        visible: data.visible ?? INITIAL_VISIBLE,
        category: (['stocks', 'fx', 'crypto'].includes(data.category)
          ? data.category
          : 'stocks') as 'stocks' | 'fx' | 'crypto',
        sessionMode: mode,
      });
      // Ensure the restored state is immediately saved back to localStorage
      saveSessionState(get());
    },
  })
);

// Selectors for derived values
export const selectLastClose = (s: SessionState) =>
  s.visible > 0 && s.candles.length > 0
    ? s.candles[Math.min(s.visible - 1, s.candles.length - 1)].close
    : 0;
export const selectUnrealized = (s: SessionState) => {
  const last = selectLastClose(s);
  return calcUnrealizedPnL(s.position, last);
};
export const selectEquity = (s: SessionState) => {
  const last = selectLastClose(s);
  return calcEquity(s.cash, s.position, last);
};
