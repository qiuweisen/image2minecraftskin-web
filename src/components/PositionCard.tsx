'use client';
import type { Position } from '@/store/useSessionStore';
import { usePlayI18n } from '@/components/PlayI18nProvider';

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
      ? 'text-emerald-700 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';
  return (
    <div className="glass-panel overflow-hidden dark:bg-[#0F0F0F]">
      <div
        className="px-4 py-3 border-b border-slate-100 dark:border-[#2a2e39] text-sm font-semibold text-slate-900 dark:text-white"
        title={String(t('positionPanel'))}
      >
        {t('positionPanel')}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4 text-sm">
        <div className="flex flex-col min-w-0">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">
            {t('type')}
          </div>
          <div
            className="font-semibold truncate leading-tight text-slate-900 dark:text-white"
            title={String(typeLabel)}
          >
            {typeLabel}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">
            {t('shares')}
          </div>
          <div
            className="font-semibold truncate leading-tight text-slate-900 dark:text-white"
            title={String(shares)}
          >
            {shares}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">
            {t('costBasis')}
          </div>
          <div
            className="font-semibold truncate leading-tight text-slate-900 dark:text-white"
            title={`$${fmt(costBasis)}`}
          >
            ${fmt(costBasis)}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">
            {t('marketPrice')}
          </div>
          <div
            className="font-semibold truncate leading-tight text-slate-900 dark:text-white"
            title={`$${fmt(mkt)}`}
          >
            ${fmt(mkt)}
          </div>
        </div>
        <div className="flex flex-col min-w-0 col-span-2 md:col-span-2">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">
            {t('unrealizedPL')}
          </div>
          <div
            className={`font-semibold truncate leading-tight ${pnlTone}`}
            title={`${unrealized >= 0 ? '+' : ''}${fmt(unrealized)}`}
          >
            {unrealized >= 0 ? '+' : ''}
            {fmt(unrealized)}
          </div>
        </div>
      </div>
    </div>
  );
}
