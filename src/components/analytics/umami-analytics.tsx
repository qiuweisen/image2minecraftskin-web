import { ClientScript } from '@/components/shared/client-script';
import { analyticsConfig } from '@/config/analytics-config';

/**
 * Umami Analytics
 * https://umami.is
 */
export function UmamiAnalytics() {
  if (!import.meta.env.PROD) return null;
  const { websiteId, script } = analyticsConfig.umami;
  if (!websiteId || !script) return null;

  return <ClientScript src={script} defer dataAttributes={{ websiteId }} />;
}
