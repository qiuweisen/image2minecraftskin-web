'use client';
import type { Position } from '@/store/useSessionStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  position: Position;
  lastClose: number;
  unrealized: number;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PositionCard({
  position,
  lastClose,
  unrealized,
}: Props) {
  const { t } = usePlayI18n();
  const typeLabel = position.side
    ? position.side === 'long'
      ? t('buy')
      : t('sell')
    : 'n/a';
  const shares = position.qty || 0;
  const costBasis = position.avgPrice || 0;
  const mkt = lastClose || 0;
  const pnlTone =
    unrealized >= 0
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';
  return (
    <Card className="shrink-0 gap-0 py-0">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-sm" title={String(t('positionPanel'))}>
          {t('positionPanel')}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 p-4 text-sm">
        <div className="flex min-w-0 flex-col">
          <div className="mb-0.5 text-xs font-medium text-muted-foreground">
            {t('type')}
          </div>
          <div
            className="truncate font-semibold leading-tight"
            title={String(typeLabel)}
          >
            {typeLabel}
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="mb-0.5 text-xs font-medium text-muted-foreground">
            {t('shares')}
          </div>
          <div
            className="truncate font-semibold leading-tight"
            title={String(shares)}
          >
            {shares}
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="mb-0.5 text-xs font-medium text-muted-foreground">
            {t('costBasis')}
          </div>
          <div
            className="truncate font-semibold leading-tight"
            title={`$${fmt(costBasis)}`}
          >
            ${fmt(costBasis)}
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="mb-0.5 text-xs font-medium text-muted-foreground">
            {t('marketPrice')}
          </div>
          <div
            className="truncate font-semibold leading-tight"
            title={`$${fmt(mkt)}`}
          >
            ${fmt(mkt)}
          </div>
        </div>
        <div className="col-span-2 flex min-w-0 flex-col">
          <div className="mb-0.5 text-xs font-medium text-muted-foreground">
            {t('unrealizedPL')}
          </div>
          <div
            className={`truncate font-semibold leading-tight ${pnlTone}`}
            title={`${unrealized >= 0 ? '+' : ''}${fmt(unrealized)}`}
          >
            {unrealized >= 0 ? '+' : ''}
            {fmt(unrealized)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
