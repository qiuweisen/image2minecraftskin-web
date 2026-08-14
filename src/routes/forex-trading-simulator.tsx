import { createFileRoute } from '@tanstack/react-router';
import { loadMarketingContent } from '@/api/marketing-content';
import { ForexTradingSimulatorPage } from '@/components/marketing/forex-trading-simulator-page';
import { getCanonicalLocale, getLocale } from '@/lib/locale';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/forex-trading-simulator')({
  loader: () =>
    loadMarketingContent({
      data: {
        page: 'forex',
        locale: getCanonicalLocale(getLocale()),
      },
    }),
  head: () =>
    seo('/forex-trading-simulator', {
      title: m.seo_forex_title(),
      description: m.seo_forex_description(),
    }),
  component: ForexTradingSimulatorRoute,
});

function ForexTradingSimulatorRoute() {
  const content = Route.useLoaderData();
  return <ForexTradingSimulatorPage content={content} />;
}
