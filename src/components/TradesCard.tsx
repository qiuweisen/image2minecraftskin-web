'use client';
import { useMemo } from 'react';
import { useSessionStore, type SessionState } from '@/store/useSessionStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TradeRow = {
  entryKind: 'B' | 'S';
  enter: number;
  exit: number;
  shares: number;
  gain: number;
  gainPct: number;
};

type Props = {
  className?: string;
  sessionStore?: <T>(selector: (state: SessionState) => T) => T;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TradesCard({
  className,
  sessionStore = useSessionStore,
}: Props) {
  const marks = sessionStore((s) => s.marks);
  const { t } = usePlayI18n();

  const rows: TradeRow[] = useMemo(() => {
    let side: 'long' | 'short' | null = null;
    let qty = 0;
    let avg = 0;
    const out: TradeRow[] = [];

    for (const m of marks) {
      const mQty = Math.max(0, Math.floor((m as any).qty ?? 0));
      if (!mQty) continue;
      if (m.kind === 'buy') {
        if (side === 'short' && qty > 0) {
          const close = Math.min(mQty, qty);
          const gain = (avg - m.price) * close;
          const notional = Math.max(1e-9, avg * close);
          out.push({
            entryKind: 'S',
            enter: avg,
            exit: m.price,
            shares: close,
            gain,
            gainPct: gain / notional,
          });
          qty -= close;
          if (qty === 0) {
            side = null;
            avg = 0;
          }
          const remainder = mQty - close;
          if (remainder > 0) {
            // open/increase long with remainder
            const newQty = remainder;
            avg = m.price * remainder;
            qty = newQty;
            side = 'long';
            avg = avg / newQty;
          }
        } else {
          // open/increase long
          const newQty = qty + mQty;
          avg = (avg * qty + m.price * mQty) / newQty;
          qty = newQty;
          side = 'long';
        }
      } else {
        // sell
        if (side === 'long' && qty > 0) {
          const close = Math.min(mQty, qty);
          const gain = (m.price - avg) * close;
          const notional = Math.max(1e-9, avg * close);
          out.push({
            entryKind: 'B',
            enter: avg,
            exit: m.price,
            shares: close,
            gain,
            gainPct: gain / notional,
          });
          qty -= close;
          if (qty === 0) {
            side = null;
            avg = 0;
          }
          const remainder = mQty - close;
          if (remainder > 0) {
            // open/increase short with remainder
            const newQty = remainder;
            avg = m.price * remainder;
            qty = newQty;
            side = 'short';
            avg = avg / newQty;
          }
        } else {
          // open/increase short
          const newQty = qty + mQty;
          avg = (avg * qty + m.price * mQty) / newQty;
          qty = newQty;
          side = 'short';
        }
      }
    }
    return out;
  }, [marks]);

  return (
    <Card className={cn('min-h-0 gap-0 py-0', className ?? 'h-52')}>
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-sm">{t('trades')}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="custom-scrollbar h-full overflow-y-auto text-[10px] leading-snug">
          <div
            className="sticky top-0 grid gap-1 border-b border-border bg-background/95 px-4 py-2 font-medium text-muted-foreground backdrop-blur"
            style={{ gridTemplateColumns: '2rem 1fr 1fr 0.8fr 1fr 0.8fr' }}
          >
            <div>{t('tradeBS')}</div>
            <div>{t('tradeEnter')}</div>
            <div>{t('tradeExit')}</div>
            <div>{t('shares')}</div>
            <div>{t('tradeGains')}</div>
            <div>{t('tradeGainsPct')}</div>
          </div>
          {rows.length === 0 ? (
            <div className="px-4 py-4 text-center text-muted-foreground">—</div>
          ) : (
            rows.map((r, i) => (
              <div
                key={i}
                className="grid gap-1 border-b border-border/50 px-4 py-2.5 text-foreground/80 last:border-0 hover:bg-muted/50"
                style={{ gridTemplateColumns: '2rem 1fr 1fr 0.8fr 1fr 0.8fr' }}
              >
                <div
                  className={`font-medium ${r.entryKind === 'B' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                >
                  {r.entryKind}
                </div>
                <div>${fmt(r.enter)}</div>
                <div>${fmt(r.exit)}</div>
                <div>{r.shares}</div>
                <div
                  className={`font-medium ${r.gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                >
                  {r.gain >= 0 ? '+' : ''}
                  {fmt(r.gain)}
                </div>
                <div
                  className={`font-medium ${r.gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                >
                  {(r.gainPct * 100).toFixed(2)}%
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
