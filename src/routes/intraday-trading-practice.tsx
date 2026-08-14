import { createFileRoute } from '@tanstack/react-router';
import { loadMarketingContent } from '@/api/marketing-content';
import { IntradayTradingPracticePage } from '@/components/marketing/intraday-practice-page';
import { getCanonicalLocale, getLocale } from '@/lib/locale';
import { jsonLdScript, seo, siteStructuredData } from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/intraday-trading-practice')({
  loader: () =>
    loadMarketingContent({
      data: {
        page: 'intraday',
        locale: getCanonicalLocale(getLocale()),
      },
    }),
  head: () => ({
    ...seo('/intraday-trading-practice', {
      title: m.seo_intraday_practice_title(),
      description: m.seo_intraday_practice_description(),
    }),
    scripts: [jsonLdScript(siteStructuredData())],
  }),
  component: IntradayTradingPracticeRoute,
});

function IntradayTradingPracticeRoute() {
  const content = Route.useLoaderData();
  return <IntradayTradingPracticePage content={content} />;
}
