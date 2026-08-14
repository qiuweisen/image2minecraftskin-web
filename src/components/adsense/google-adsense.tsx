import { clientEnv } from '@/env/client';

/**
 * Google AdSense Auto ads loader.
 *
 * The script is intentionally rendered in the document head so AdSense can
 * verify the site and apply the page exclusions configured in the AdSense
 * dashboard. The Publisher ID is public configuration, not a secret.
 */
export function GoogleAdSense() {
  const client = clientEnv.VITE_GOOGLE_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`}
      crossOrigin="anonymous"
    />
  );
}
