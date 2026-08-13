import { createFileRoute } from '@tanstack/react-router';
import { IntradayTradingPracticePage } from '@/components/marketing/intraday-practice-page';
import { seo } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/intraday-trading-practice')({
  head: () =>
    seo('/intraday-trading-practice', {
      title: m.seo_intraday_practice_title(),
      description: m.seo_intraday_practice_description(),
    }),
  component: IntradayTradingPracticePage,
});
