import { getLocale } from '@/lib/locale';

type DashboardUnit = 'day' | 'hour' | 'minute';

function getIntlLocale() {
  const locale = getLocale();

  // Keep the historical `zh` alias compatible with the site's canonical
  // Simplified Chinese locale while preserving the existing URL behavior.
  if (locale === 'zh' || locale === 'zh-hans') return 'zh-Hans';
  if (locale === 'zh-hant') return 'zh-Hant';
  return locale;
}

export function formatDashboardNumber(
  value: number,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat(getIntlLocale(), options).format(value);
}

export function formatDashboardUnit(value: number, unit: DashboardUnit) {
  return formatDashboardNumber(value, {
    style: 'unit',
    unit,
    unitDisplay: 'short',
    maximumFractionDigits: 0,
  });
}

export function formatDashboardPracticeDuration(seconds: number) {
  const minutes = Math.max(0, Math.floor(seconds / 60));

  if (minutes < 60) {
    return formatDashboardUnit(minutes, 'minute');
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${formatDashboardUnit(hours, 'hour')} ${formatDashboardUnit(remainingMinutes, 'minute')}`
    : formatDashboardUnit(hours, 'hour');
}

export function formatDashboardRecordDuration(seconds: number) {
  if (seconds < 60) {
    return `<${formatDashboardUnit(1, 'minute')}`;
  }

  return formatDashboardUnit(Math.round(seconds / 60), 'minute');
}

export function formatDashboardDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(getIntlLocale(), options).format(
    new Date(value)
  );
}

export function formatDashboardChartDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return formatDashboardDate(date, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDashboardPercent(value: number) {
  return formatDashboardNumber(value, {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
