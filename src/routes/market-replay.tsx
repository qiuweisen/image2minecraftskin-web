import { createFileRoute } from '@tanstack/react-router';
import { loadMarketingContent } from '@/api/marketing-content';
import { MarketReplayPage } from '@/components/marketing/market-replay-page';
import { getCanonicalLocale, getLocale } from '@/lib/locale';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/market-replay')({
  loader: () =>
    loadMarketingContent({
      data: {
        page: 'market-replay',
        locale: getCanonicalLocale(getLocale()),
      },
    }),
  head: () =>
    seo('/market-replay', {
      title: m.seo_market_replay_title(),
      description: m.seo_market_replay_description(),
    }),
  component: MarketReplayRoute,
});

function MarketReplayRoute() {
  const content = Route.useLoaderData();
  return <MarketReplayPage content={content} />;
}
