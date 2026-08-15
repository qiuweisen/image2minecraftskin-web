// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from '@tanstack/react-start/server-entry';
import { localeMiddleware } from '@/locale/middleware';
import { getChartMiniLegacyRedirect } from '@/lib/chartmini-legacy-redirects';
import { GeminiKeyPool } from '@/lib/gemini-key-pool';

// Wrangler discovers Durable Object classes from the Worker entry module.
export { GeminiKeyPool };

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
    pathname.startsWith('/badges/') ||
    pathname.startsWith('/fonts/') ||
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

function addStaticAssetCacheHeaders(request: Request, response: Response) {
  if (!response.ok) return response;

  const pathname = new URL(request.url).pathname;
  const isHashedClientAsset = pathname.startsWith('/assets/');
  const isLongLivedStaticAsset =
    pathname.startsWith('/fonts/') ||
    /^\/images\/simulators\/[^/]+-(?:480|600|768)\.webp$/.test(pathname);
  const isStableStaticAsset =
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/TradingView/') ||
    pathname.startsWith('/badges/') ||
    pathname === '/chartmini-favicon.svg';

  if (!isHashedClientAsset && !isStableStaticAsset) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set(
    'Cache-Control',
    isHashedClientAsset || isLongLivedStaticAsset
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=86400, stale-while-revalidate=604800'
  );

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

function getTrailingSlashRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const { pathname } = url;
  const isAssetPath =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/TradingView/') ||
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico' ||
    /\/[^/]+\.[^/]+\/$/.test(pathname);

  if (pathname.length <= 1 || !pathname.endsWith('/') || isAssetPath) {
    return null;
  }

  url.pathname = pathname.replace(/\/+$/, '');
  return Response.redirect(url, 308);
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

    const trailingSlashRedirect = getTrailingSlashRedirect(request);
    if (trailingSlashRedirect) {
      return addStagingRobotsHeader(request, trailingSlashRedirect);
    }

    return localeMiddleware(request, () =>
      Promise.resolve(
        // TanStack Start handles localized URL rewriting itself. Passing the
        // de-localized request from Paraglide here makes Start normalize every
        // localized subpath back to itself with a 307 redirect.
        handler.fetch(request, {
          context: {
            fromFetch: true,
          },
        })
      )
        .then((response) => addStagingRobotsHeader(request, response))
        .then((response) => addStaticAssetCacheHeaders(request, response))
    );
  },
};
