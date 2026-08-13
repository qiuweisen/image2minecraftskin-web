'use client';
import type React from 'react';
import { useId, useMemo, useState, useRef, useEffect } from 'react';
import {
  useSessionStore,
  selectEquity,
  type SessionState,
} from '@/store/useSessionStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';

type SessionStoreHook = <T>(selector: (state: SessionState) => T) => T;

export default function Controls({
  afterButtons,
  layout = 'default',
  sessionStore = useSessionStore,
  defaultQuantity = 100,
  quantityStep = 100,
  onAdvance,
  canAdvance = false,
  advancing = false,
}: {
  afterButtons?: React.ReactNode;
  layout?: 'default' | 'mobile';
  sessionStore?: SessionStoreHook;
  defaultQuantity?: number;
  quantityStep?: number;
  onAdvance?: () => void | Promise<void>;
  canAdvance?: boolean;
  advancing?: boolean;
}) {
  // ... existing hooks ...
  const [qtyInput, setQtyInput] = useState<string>(String(defaultQuantity));
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = usePlayI18n();
  const { nextBar, buy, sell } = sessionStore((s) => ({
    nextBar: s.nextBar,
    buy: s.buy,
    sell: s.sell,
  }));
  const { candles, visible, position, cash } = sessionStore((s) => ({
    candles: s.candles,
    visible: s.visible,
    position: s.position,
    cash: s.cash,
  }));
  const equity = sessionStore((s) => selectEquity(s));

  const noData = candles.length === 0;
  const lastClose = useMemo(
    () =>
      visible > 0 && candles.length > 0
        ? candles[Math.min(visible - 1, candles.length - 1)].close
        : 0,
    [visible, candles]
  );
  const qty = useMemo(() => {
    const n = parseInt(qtyInput || '0', 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [qtyInput]);
  const atEnd = noData || (visible >= candles.length && !canAdvance);
  const advance = onAdvance || nextBar;
  const hasPosition = position.qty > 0;
  const qtyInputId = useId();
  // Check if user can afford to buy
  const isShort = position.qty > 0 && position.side === 'short';
  const isLong = position.qty > 0 && position.side === 'long';

  // Calculate canAffordBuy considering flip to long scenario
  const canAffordBuy = useMemo(() => {
    if (qty <= 0 || lastClose <= 0) return false;
    if (isLong) {
      // Adding to long: just check if we have enough cash
      return qty * lastClose <= cash;
    } else if (isShort) {
      // Covering short and potentially flipping to long
      const coverQty = Math.min(qty, position.qty);
      const flipQty = qty - coverQty;
      if (flipQty === 0) {
        // Just covering short, no extra cash needed (we get cash back from covering)
        return true;
      }
      // Covering short gives us back cash, but flipping to long costs cash
      const coverCost = coverQty * lastClose;
      const flipCost = flipQty * lastClose;
      // After covering, our cash changes: cash - coverCost (to buy back shorts)
      // Then we need flipCost to open long
      return flipCost <= cash - coverCost;
    } else {
      // No position: opening new long
      return qty * lastClose <= cash;
    }
  }, [qty, lastClose, cash, isLong, isShort, position.qty]);

  // Check if user can afford to sell/short - considering flip to short scenario
  const canAffordSell = useMemo(() => {
    if (qty <= 0 || lastClose <= 0) return false;
    if (isShort) {
      // Adding to short: check margin (total short value <= current equity)
      // When short: equity = cash - shortPosition * currentPrice
      // The max short exposure allowed is the current equity (1x leverage)
      const currentEquity = cash - position.qty * lastClose;
      const newShortQty = position.qty + qty;
      const newShortValue = newShortQty * lastClose;
      // After adding to short: newEquity = (cash + qty*price) - newShortQty*price = currentEquity
      // So we check: newShortValue <= currentEquity
      return newShortValue <= currentEquity;
    } else if (isLong) {
      // Closing long and potentially flipping to short
      const closeQty = Math.min(qty, position.qty);
      const flipQty = qty - closeQty;
      if (flipQty === 0) {
        // Just closing long, always allowed
        return true;
      }
      // After closing long, check if flip to short is within margin
      // Equity after closing long = cash + closeQty * lastClose
      const equityAfterClose = cash + closeQty * lastClose;
      const newShortValue = flipQty * lastClose;
      return newShortValue <= equityAfterClose;
    } else {
      // No position: opening new short, check margin
      // equity = cash when no position, so short value <= cash
      return qty * lastClose <= cash;
    }
  }, [qty, lastClose, cash, isLong, isShort, position.qty]);

  // Calculate max shares user can afford to buy
  const maxBuyShares = useMemo(() => {
    if (lastClose <= 0) return 0;
    return Math.floor(cash / lastClose);
  }, [cash, lastClose]);

  // Position fraction options
  const positionOptions = [
    { label: t('fullPosition') || 'Full', fraction: 1 },
    { label: '1/2', fraction: 0.5 },
    { label: '1/3', fraction: 1 / 3 },
    { label: '1/4', fraction: 0.25 },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPositionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePositionSelect = (fraction: number) => {
    const shares = Math.floor(maxBuyShares * fraction);
    setQtyInput(String(Math.max(1, shares)));
    setShowPositionDropdown(false);
  };

  if (layout === 'mobile') {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 w-full">
          {/* Left: Qty Control (Compact) with Position Dropdown */}
          <div className="flex-none flex items-center gap-1">
            <div className="flex items-center h-12 bg-slate-100 dark:bg-[#0F0F0F] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2e39]">
              <button
                type="button"
                aria-label={`Decrease quantity by ${quantityStep}`}
                onClick={() => {
                  const cur = parseInt(qtyInput || '0', 10);
                  const next = Math.max(
                    0,
                    Number.isFinite(cur) ? cur - quantityStep : 0
                  );
                  setQtyInput(String(next));
                }}
                className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <input
                id={qtyInputId}
                type="number"
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                className="w-16 text-center bg-transparent text-sm font-semibold focus:outline-none"
                inputMode="numeric"
                aria-label={t('qty') || 'Quantity'}
              />
              <button
                type="button"
                aria-label={`Increase quantity by ${quantityStep}`}
                onClick={() => {
                  const cur = parseInt(qtyInput || '0', 10);
                  const next = Number.isFinite(cur)
                    ? cur + quantityStep
                    : quantityStep;
                  setQtyInput(String(next));
                }}
                className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {/* Position fraction dropdown for mobile */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                className="h-12 w-10 rounded-lg border border-slate-200 dark:border-[#2a2e39] bg-slate-50 dark:bg-[#1e222d] hover:bg-slate-100 dark:hover:bg-[#2a2e39] transition-colors flex items-center justify-center"
                aria-label={t('positionSize') || 'Select position size'}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-slate-500 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>

              {showPositionDropdown && (
                <div className="absolute left-0 top-full mt-1 py-1 bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-lg shadow-lg z-50 min-w-[80px]">
                  {positionOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handlePositionSelect(opt.fraction)}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2a2e39] transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <button
              type="button"
              aria-label={t('next') || 'Next'}
              onClick={() => advance()}
              disabled={atEnd || advancing}
              className={`flex-none h-12 w-16 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#0F0F0F] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2e39] shadow-sm active:scale-95 transition-all`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                if (qty > 0 && canAffordBuy) {
                  buy(qty);
                  if (!atEnd) advance();
                }
              }}
              disabled={qty <= 0 || noData || !canAffordBuy || advancing}
              className={`flex-1 min-w-[48px] h-12 px-2 rounded-lg font-bold text-white text-sm shadow-sm transition-all truncate ${qty <= 0 || !canAffordBuy ? 'bg-slate-300 dark:bg-[#2a2e39] text-slate-500' : 'bg-emerald-700 active:bg-emerald-800'}`}
            >
              {t('buy')}
            </button>
            <button
              onClick={() => {
                if (qty > 0 && canAffordSell) {
                  sell(qty);
                  if (!atEnd) advance();
                }
              }}
              disabled={qty <= 0 || noData || !canAffordSell || advancing}
              className={`flex-1 min-w-[48px] h-12 px-2 rounded-lg font-bold text-white text-sm shadow-sm transition-all truncate ${qty <= 0 || !canAffordSell ? 'bg-slate-300 dark:bg-[#2a2e39] text-slate-500' : 'bg-rose-500 active:bg-rose-600'}`}
            >
              {t('sell')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ... rest of existing default render ...
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => advance()}
          disabled={atEnd || advancing}
          className={`px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
            atEnd
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-[#3a3f4b] dark:text-slate-600'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-[#3a3f4b] dark:text-white dark:hover:bg-[#4a4f5b]'
          }`}
        >
          {t('next')}
        </button>
        <button
          onClick={() => {
            if (qty > 0 && canAffordBuy) {
              buy(qty);
              if (!atEnd) advance();
            }
          }}
          disabled={qty <= 0 || noData || !canAffordBuy || advancing}
          className={`px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
            qty <= 0 || !canAffordBuy
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-[#2a2e39] dark:text-slate-600'
              : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm hover:shadow'
          }`}
        >
          {t('buy')}
        </button>
        <button
          onClick={() => {
            if (qty > 0 && canAffordSell) {
              sell(qty);
              if (!atEnd) advance();
            }
          }}
          disabled={qty <= 0 || noData || !canAffordSell || advancing}
          className={`px-4 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
            qty <= 0 || !canAffordSell
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-[#2a2e39] dark:text-slate-600'
              : 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm hover:shadow'
          }`}
        >
          {t('sell')}
        </button>
      </div>
      {/* On mobile, show Qty directly under the three buttons */}

      <div className="space-y-2">
        <label
          htmlFor={qtyInputId}
          className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide"
        >
          {t('qty')}
        </label>
        <div className="flex items-center gap-2">
          {/* Main QTY input with +/- buttons */}
          <div className="flex-1 flex items-center rounded-xl overflow-hidden border border-slate-200 dark:border-[#2a2e39]">
            <button
              type="button"
              aria-label={`Decrease quantity by ${quantityStep}`}
              onClick={() => {
                const cur = parseInt(qtyInput || '0', 10);
                const next = Math.max(
                  0,
                  Number.isFinite(cur) ? cur - quantityStep : 0
                );
                setQtyInput(String(next));
              }}
              className="px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              step={1}
              id={qtyInputId}
              value={qtyInput}
              onChange={(e) => {
                const v = e.target.value;
                // Allow empty string
                if (v === '') {
                  setQtyInput('');
                  return;
                }
                // Only allow digits
                if (/^\d+$/.test(v)) {
                  setQtyInput(v);
                }
              }}
              className="no-spinner text-center flex-1 w-full bg-transparent text-slate-900 dark:text-white text-lg font-semibold py-3 focus:outline-none"
              aria-label={t('qty') || 'Quantity'}
            />
            <button
              type="button"
              aria-label={`Increase quantity by ${quantityStep}`}
              onClick={() => {
                const cur = parseInt(qtyInput || '0', 10);
                const next = Number.isFinite(cur)
                  ? cur + quantityStep
                  : quantityStep;
                setQtyInput(String(next));
              }}
              className="px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* Position fraction dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowPositionDropdown(!showPositionDropdown)}
              className="h-[52px] px-3 rounded-xl border border-slate-200 dark:border-[#2a2e39] bg-slate-50 dark:bg-[#1e222d] hover:bg-slate-100 dark:hover:bg-[#2a2e39] transition-colors flex items-center gap-1"
              title={t('positionSize') || 'Position Size'}
              aria-label={t('positionSize') || 'Select position size'}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-slate-500 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showPositionDropdown && (
              <div className="absolute right-0 top-full mt-1 py-1 bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-lg shadow-lg z-50 min-w-[100px]">
                {positionOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handlePositionSelect(opt.fraction)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2a2e39] transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Finish button moved to top of sidebar */}

      <div className="text-xs text-slate-400 flex items-baseline justify-between gap-3">
        <div
          className="truncate flex-1 min-w-0"
          title={
            hasPosition
              ? `${position.side === 'short' ? '-' : ''}${position.qty} @ ${position.avgPrice.toFixed(2)}`
              : '—'
          }
        >
          {t('position')}:{' '}
          {hasPosition
            ? `${position.side === 'short' ? '-' : ''}${position.qty} @ ${position.avgPrice.toFixed(2)}`
            : '—'}
        </div>
        <div
          className="truncate flex-none whitespace-nowrap"
          title={`$${equity.toLocaleString()}`}
        >
          {t('equity')}: ${equity.toLocaleString()}
        </div>
      </div>

      {/* Removed quick fraction buttons per requirement */}

      {/* On mobile, show the extra card after qty + quick buttons */}
      {afterButtons ? <div className="md:hidden">{afterButtons}</div> : null}

      {/* Removed duplicated equity/unrealized/realized summary; StatsCard shows these */}
    </div>
  );
}
