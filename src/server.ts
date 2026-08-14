// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from '@tanstack/react-start/server-entry';
import { localeMiddleware } from '@/locale/middleware';
import { getChartMiniLegacyRedirect } from '@/lib/chartmini-legacy-redirects';

/**
 * TanStack Start server entry
 * https://github.com/backpine/tanstack-start-on-cloudflare/blob/main/src/server.ts
 */
console.log("[server-entry]: using custom server entry in 'src/server.ts'");

const stagingHosts = new Set([
  'chartmini-v2.sudotradecom.workers.dev',
  'v2.chartmini.com',
]);

function addStagingRobotsHeader(request: Request, response: Response) {
  if (!stagingHosts.has(new URL(request.url).hostname)) {
    return response;
  }

  const headers = new Headers(response.headers);
  const pathname = new URL(request.url).pathname;
  const isStaticAsset =
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/TradingView/') ||
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico';

  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (!isStaticAsset) {
    headers.set(
      'Cache-Control',
      'no-store, no-cache, max-age=0, must-revalidate'
    );
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export default {
  fetch(request: Request) {
    // All historical ChartMini locale prefixes are now first-class Paraglide
    // locales. Keep the original request intact so middleware can select the
    // locale and canonical URL without changing public links.
    const legacyRedirect = getChartMiniLegacyRedirect(request);
    if (legacyRedirect) {
      return addStagingRobotsHeader(request, legacyRedirect);
    }

    return localeMiddleware(request, () =>
      Promise.resolve(
        handler.fetch(request, {
          context: {
            fromFetch: true,
          },
        })
      ).then((response) => addStagingRobotsHeader(request, response))
    );
  },
};
