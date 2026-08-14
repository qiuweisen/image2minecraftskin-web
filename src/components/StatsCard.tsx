'use client';
import { usePlayI18n } from '@/components/PlayI18nProvider';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  equity: number;
  unrealized: number;
  realized: number;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function StatsCard({ equity, unrealized, realized }: Props) {
  const { t } = usePlayI18n();
  const initialCash = Math.max(1e-9, equity - realized - unrealized);
  const realizedPct = realized / initialCash;
  const positiveTone = 'text-emerald-700 dark:text-emerald-400';
  const negativeTone = 'text-rose-600 dark:text-rose-400';
  return (
    <Card className="shrink-0 gap-0 py-0">
      <CardContent className="space-y-2 p-4 text-sm md:text-[13px]">
        <div className="flex min-w-0 items-baseline justify-between">
          <span className="truncate font-medium text-muted-foreground">
            {t('equity')}
          </span>
          <span className="whitespace-nowrap font-semibold">
            ${fmt(equity)}
          </span>
        </div>
        <div className="flex min-w-0 items-baseline justify-between">
          <span className="truncate font-medium text-muted-foreground">
            {t('unrealized')}$
          </span>
          <span
            className={`${unrealized >= 0 ? positiveTone : negativeTone} whitespace-nowrap font-semibold`}
          >
            {unrealized >= 0 ? '+' : ''}
            {fmt(unrealized)}
          </span>
        </div>
        <div className="flex min-w-0 items-baseline justify-between">
          <span className="truncate font-medium text-muted-foreground">
            {t('realized')}$
          </span>
          <span
            className={`${realized >= 0 ? positiveTone : negativeTone} whitespace-nowrap font-semibold`}
          >
            {realized >= 0 ? '+' : ''}
            {fmt(realized)}
          </span>
        </div>
        <div className="flex min-w-0 items-baseline justify-between">
          <span className="truncate font-medium text-muted-foreground">
            {t('realized')}%
          </span>
          <span
            className={`${realized >= 0 ? positiveTone : negativeTone} whitespace-nowrap font-semibold`}
          >
            {(realizedPct * 100).toFixed(2)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
