import { createFileRoute } from '@tanstack/react-router';
import { MarketReplayPage } from '@/components/marketing/simulator-landing-pages';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/market-replay')({
  head: () =>
    seo('/market-replay', {
      title: m.seo_market_replay_title(),
      description: m.seo_market_replay_description(),
    }),
  component: MarketReplayPage,
});
