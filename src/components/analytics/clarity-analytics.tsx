import { ClientScript } from '@/components/shared/client-script';
import { analyticsConfig } from '@/config/analytics-config';

/**
 * Microsoft Clarity
 * https://clarity.microsoft.com
 */
export function ClarityAnalytics() {
  if (!import.meta.env.PROD) return null;
  const projectId = analyticsConfig.clarityProjectId;

  const inlineHtml = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${projectId}");`;

  return <ClientScript id="clarity-analytics" inlineHtml={inlineHtml} />;
}
