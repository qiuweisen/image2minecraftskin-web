import { createFileRoute } from '@tanstack/react-router';
import { ForexTradingSimulatorPage } from '@/components/marketing/simulator-landing-pages';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/forex-trading-simulator')({
  head: () =>
    seo('/forex-trading-simulator', {
      title: m.seo_forex_title(),
      description: m.seo_forex_description(),
    }),
  component: ForexTradingSimulatorPage,
});
