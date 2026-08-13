'use client';
import { usePlayI18n } from '@/components/PlayI18nProvider';

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
    <div className="glass-panel p-4 space-y-2 text-sm md:text-[13px] dark:bg-[#0F0F0F]">
      <div className="flex justify-between items-baseline min-w-0">
        <span className="text-slate-500 dark:text-slate-400 truncate font-medium">
          {t('equity')}
        </span>
        <span className="font-semibold whitespace-nowrap text-slate-900 dark:text-white">
          ${fmt(equity)}
        </span>
      </div>
      <div className="flex justify-between items-baseline min-w-0">
        <span className="text-slate-500 dark:text-slate-400 truncate font-medium">
          {t('unrealized')}$
        </span>
        <span
          className={`${unrealized >= 0 ? positiveTone : negativeTone} whitespace-nowrap font-semibold`}
        >
          {unrealized >= 0 ? '+' : ''}
          {fmt(unrealized)}
        </span>
      </div>
      <div className="flex justify-between items-baseline min-w-0">
        <span className="text-slate-500 dark:text-slate-400 truncate font-medium">
          {t('realized')}$
        </span>
        <span
          className={`${realized >= 0 ? positiveTone : negativeTone} whitespace-nowrap font-semibold`}
        >
          {realized >= 0 ? '+' : ''}
          {fmt(realized)}
        </span>
      </div>
      <div className="flex justify-between items-baseline min-w-0">
        <span className="text-slate-500 dark:text-slate-400 truncate font-medium">
          {t('realized')}%
        </span>
        <span
          className={`${realized >= 0 ? positiveTone : negativeTone} whitespace-nowrap font-semibold`}
        >
          {(realizedPct * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
