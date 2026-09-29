import { ClientScript } from '@/components/shared/client-script';
import { analyticsConfig } from '@/config/analytics-config';

/**
 * Google Analytics (GA4)
 * https://analytics.google.com
 */
export function GoogleAnalytics() {
  if (!import.meta.env.PROD) return null;
  const id = analyticsConfig.googleAnalyticsId;
  if (!id) return null;

  const inlineHtml = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}');
  `;
  return (
    <>
      <ClientScript
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        async
      />
      <ClientScript id="google-analytics" inlineHtml={inlineHtml} />
    </>
  );
}
