import { createFileRoute } from '@tanstack/react-router';
import { CryptoTradingSimulatorPage } from '@/components/marketing/simulator-landing-pages';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/crypto-trading-simulator')({
  head: () =>
    seo('/crypto-trading-simulator', {
      title: m.seo_crypto_title(),
      description: m.seo_crypto_description(),
    }),
  component: CryptoTradingSimulatorPage,
});
