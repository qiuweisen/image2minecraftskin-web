import { clientEnv } from '@/env/client';
import { getCanonicalPathname } from '@/lib/locale';

const ADSENSE_EXCLUDED_SECTIONS = [
  '/play',
  '/day-trading-simulator',
  '/dashboard',
] as const;

function isExcludedPath(pathname: string) {
  const canonicalPathname = getCanonicalPathname(pathname);

  return ADSENSE_EXCLUDED_SECTIONS.some(
    (section) =>
      canonicalPathname === section ||
      canonicalPathname.startsWith(`${section}/`)
  );
}

/**
 * Google AdSense Auto ads loader.
 *
 * The script is intentionally rendered in the document head so AdSense can
 * verify the site and apply the page exclusions configured in the AdSense
 * dashboard. The Publisher ID is public configuration, not a secret.
 */
export function GoogleAdSense({ pathname }: { pathname: string }) {
  const client = clientEnv.VITE_GOOGLE_ADSENSE_CLIENT;
  if (!client || isExcludedPath(pathname)) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`}
      crossOrigin="anonymous"
    />
  );
}
