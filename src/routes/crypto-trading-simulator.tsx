import { createFileRoute } from '@tanstack/react-router';
import { loadMarketingContent } from '@/api/marketing-content';
import { CryptoTradingSimulatorPage } from '@/components/marketing/crypto-trading-simulator-page';
import { getCanonicalLocale, getLocale } from '@/lib/locale';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/crypto-trading-simulator')({
  loader: () =>
    loadMarketingContent({
      data: {
        page: 'crypto',
        locale: getCanonicalLocale(getLocale()),
      },
    }),
  head: () =>
    seo('/crypto-trading-simulator', {
      title: m.seo_crypto_title(),
      description: m.seo_crypto_description(),
    }),
  component: CryptoTradingSimulatorRoute,
});

function CryptoTradingSimulatorRoute() {
  const content = Route.useLoaderData();
  return <CryptoTradingSimulatorPage content={content} />;
}
