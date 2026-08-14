'use client';

import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  IconLayoutGrid,
  IconMinus,
  IconPlayerTrackNext,
  IconPlus,
} from '@tabler/icons-react';
import {
  useSessionStore,
  selectEquity,
  type SessionState,
} from '@/store/useSessionStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  afterButtons?: ReactNode;
  layout?: 'default' | 'mobile';
  sessionStore?: SessionStoreHook;
  defaultQuantity?: number;
  quantityStep?: number;
  onAdvance?: () => void | Promise<void>;
  canAdvance?: boolean;
  advancing?: boolean;
}) {
  const [qtyInput, setQtyInput] = useState<string>(String(defaultQuantity));
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
  const isShort = position.qty > 0 && position.side === 'short';
  const isLong = position.qty > 0 && position.side === 'long';

  const canAffordBuy = useMemo(() => {
    if (qty <= 0 || lastClose <= 0) return false;
    if (isLong) return qty * lastClose <= cash;
    if (isShort) {
      const coverQty = Math.min(qty, position.qty);
      const flipQty = qty - coverQty;
      if (flipQty === 0) return true;
      const coverCost = coverQty * lastClose;
      return flipQty * lastClose <= cash - coverCost;
    }
    return qty * lastClose <= cash;
  }, [qty, lastClose, cash, isLong, isShort, position.qty]);

  const canAffordSell = useMemo(() => {
    if (qty <= 0 || lastClose <= 0) return false;
    if (isShort) {
      const currentEquity = cash - position.qty * lastClose;
      const newShortValue = (position.qty + qty) * lastClose;
      return newShortValue <= currentEquity;
    }
    if (isLong) {
      const closeQty = Math.min(qty, position.qty);
      const flipQty = qty - closeQty;
      if (flipQty === 0) return true;
      const equityAfterClose = cash + closeQty * lastClose;
      return flipQty * lastClose <= equityAfterClose;
    }
    return qty * lastClose <= cash;
  }, [qty, lastClose, cash, isLong, isShort, position.qty]);

  const maxBuyShares = useMemo(() => {
    if (lastClose <= 0) return 0;
    return Math.floor(cash / lastClose);
  }, [cash, lastClose]);

  const positionOptions = [
    { label: t('fullPosition') || 'Full', fraction: 1 },
    { label: '1/2', fraction: 0.5 },
    { label: '1/3', fraction: 1 / 3 },
    { label: '1/4', fraction: 0.25 },
  ];

  const handlePositionSelect = (fraction: number) => {
    const shares = Math.floor(maxBuyShares * fraction);
    setQtyInput(String(Math.max(1, shares)));
  };

  const decreaseQuantity = () => {
    const current = parseInt(qtyInput || '0', 10);
    const next = Math.max(
      0,
      Number.isFinite(current) ? current - quantityStep : 0
    );
    setQtyInput(String(next));
  };

  const increaseQuantity = () => {
    const current = parseInt(qtyInput || '0', 10);
    const next = Number.isFinite(current)
      ? current + quantityStep
      : quantityStep;
    setQtyInput(String(next));
  };

  const buyPosition = () => {
    if (qty > 0 && canAffordBuy) {
      buy(qty);
      if (!atEnd) void advance();
    }
  };

  const sellPosition = () => {
    if (qty > 0 && canAffordSell) {
      sell(qty);
      if (!atEnd) void advance();
    }
  };

  const positionMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="h-12 w-10"
            aria-label={t('positionSize') || 'Select position size'}
          />
        }
      >
        <IconLayoutGrid />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-28">
        {positionOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={() => handlePositionSelect(option.fraction)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const quantityStepper = (
    <div className="flex h-12 items-center overflow-hidden rounded-lg border border-input bg-muted/50">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-full w-8 rounded-none text-muted-foreground hover:bg-background hover:text-foreground"
        aria-label={`Decrease quantity by ${quantityStep}`}
        onClick={decreaseQuantity}
      >
        <IconMinus />
      </Button>
      <Input
        id={qtyInputId}
        type="number"
        value={qtyInput}
        onChange={(event) => setQtyInput(event.target.value)}
        className="no-spinner h-10 w-16 border-0 bg-transparent px-0 text-center text-sm font-semibold shadow-none focus-visible:ring-0"
        inputMode="numeric"
        aria-label={t('qty') || 'Quantity'}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-full w-8 rounded-none text-muted-foreground hover:bg-background hover:text-foreground"
        aria-label={`Increase quantity by ${quantityStep}`}
        onClick={increaseQuantity}
      >
        <IconPlus />
      </Button>
    </div>
  );

  if (layout === 'mobile') {
    return (
      <div className="w-full space-y-2">
        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
          {quantityStepper}
          <div className="flex min-w-0 items-center gap-2">
            {positionMenu}
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="h-12 w-16"
              aria-label={t('next') || 'Next'}
              onClick={() => void advance()}
              disabled={atEnd || advancing}
            >
              <IconPlayerTrackNext />
            </Button>
            <Button
              type="button"
              className="h-12 min-w-0 flex-1 bg-emerald-600 px-2 text-sm text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
              onClick={buyPosition}
              disabled={qty <= 0 || noData || !canAffordBuy || advancing}
            >
              {t('buy')}
            </Button>
            <Button
              type="button"
              className="h-12 min-w-0 flex-1 bg-rose-600 px-2 text-sm text-white hover:bg-rose-700 dark:bg-rose-500 dark:text-rose-950 dark:hover:bg-rose-400"
              onClick={sellPosition}
              disabled={qty <= 0 || noData || !canAffordSell || advancing}
            >
              {t('sell')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => void advance()}
          disabled={atEnd || advancing}
        >
          <IconPlayerTrackNext />
          {t('next')}
        </Button>
        <Button
          type="button"
          className="h-10 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
          onClick={buyPosition}
          disabled={qty <= 0 || noData || !canAffordBuy || advancing}
        >
          {t('buy')}
        </Button>
        <Button
          type="button"
          className="h-10 bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:text-rose-950 dark:hover:bg-rose-400"
          onClick={sellPosition}
          disabled={qty <= 0 || noData || !canAffordSell || advancing}
        >
          {t('sell')}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={qtyInputId} className="text-xs text-muted-foreground">
          {t('qty')}
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-input bg-background">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Decrease quantity by ${quantityStep}`}
              onClick={decreaseQuantity}
            >
              <IconMinus />
            </Button>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              step={1}
              id={qtyInputId}
              value={qtyInput}
              onChange={(event) => {
                const value = event.target.value;
                if (value === '' || /^\d+$/.test(value)) setQtyInput(value);
              }}
              className="no-spinner h-10 flex-1 border-0 bg-transparent px-1 text-center text-lg font-semibold shadow-none focus-visible:ring-0"
              aria-label={t('qty') || 'Quantity'}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Increase quantity by ${quantityStep}`}
              onClick={increaseQuantity}
            >
              <IconPlus />
            </Button>
          </div>
          {positionMenu}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <div
          className="min-w-0 flex-1 truncate"
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
          className="flex-none truncate whitespace-nowrap"
          title={`$${equity.toLocaleString()}`}
        >
          {t('equity')}: ${equity.toLocaleString()}
        </div>
      </div>

      {afterButtons ? <div className="md:hidden">{afterButtons}</div> : null}
    </div>
  );
}
