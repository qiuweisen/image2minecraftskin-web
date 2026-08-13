import { createFileRoute } from '@tanstack/react-router';
import PlayI18nProvider from '@/components/PlayI18nProvider';
import DayTradingPage from '@/components/simulator/day-trading-client';
import { getLocale } from '@/lib/locale';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/day-trading-simulator')({
  head: () =>
    seo('/day-trading-simulator', {
      title: m.seo_day_trading_title(),
      description: m.seo_day_trading_description(),
    }),
  component: DayTradingMigrationPage,
});

function DayTradingMigrationPage() {
  const locale = getLocale();

  return (
    <PlayI18nProvider lang={locale}>
      <DayTradingPage />
    </PlayI18nProvider>
  );
}
