import { useEffect } from 'react';
import { clientEnv } from '@/env/client';
import { getCanonicalPathname } from '@/lib/locale';

const ADSENSE_EXCLUDED_SECTIONS = [
  '/',
  '/play',
  '/day-trading-simulator',
  '/dashboard',
  '/resources',
] as const;

function isExcludedPath(pathname: string) {
  const canonicalPathname = getCanonicalPathname(pathname);

  return ADSENSE_EXCLUDED_SECTIONS.some((section) =>
    section === '/'
      ? canonicalPathname === '/' || canonicalPathname === ''
      : canonicalPathname === section ||
        canonicalPathname.startsWith(`${section}/`)
  );
}

const ADSENSE_SCRIPT_SELECTOR =
  'script[src*="adsbygoogle"], script[src*="googlesyndication.com"]';
const ADSENSE_NODE_SELECTOR = [
  'ins.adsbygoogle',
  '.google-auto-placed',
  'iframe#google_esf',
  'iframe[id^="aswift_"]',
  'iframe[src*="googleads.g.doubleclick.net"]',
  'iframe[src*="googlesyndication.com"]',
].join(',');

/**
 * Auto ads can outlive a TanStack Router navigation because Google injects
 * iframes outside React's tree. Remove those nodes when entering an excluded
 * route, including SPA transitions from an ad-enabled page.
 */
function removeAdSenseNodes() {
  document.querySelectorAll(ADSENSE_SCRIPT_SELECTOR).forEach((node) => {
    node.remove();
  });

  document.querySelectorAll(ADSENSE_NODE_SELECTOR).forEach((node) => {
    const element = node as Element;
    const container =
      element.closest('.google-auto-placed') ??
      element.closest('ins.adsbygoogle') ??
      element;
    container.remove();
  });
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
  const excluded = !client || isExcludedPath(pathname);

  useEffect(() => {
    if (!excluded) return;

    // Google may finish injecting an auto-ad shortly after the route changes.
    // A short bounded cleanup window avoids a permanent MutationObserver on
    // simulator pages, where TradingView mutates the DOM continuously.
    const cleanupDelays = [0, 100, 500, 1500, 3000];
    const timers = cleanupDelays.map((delay) =>
      window.setTimeout(removeAdSenseNodes, delay)
    );

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [excluded]);

  if (excluded) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`}
      crossOrigin="anonymous"
    />
  );
}
