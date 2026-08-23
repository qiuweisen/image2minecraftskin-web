// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from '@tanstack/react-start/server-entry';
import { env } from 'cloudflare:workers';
import { localeMiddleware } from '@/locale/middleware';
import { getChartMiniLegacyRedirect } from '@/lib/chartmini-legacy-redirects';
import { GeminiKeyPool } from '@/lib/gemini-key-pool';
import {
  chartMiniLocalePaths,
  getBaseLocaleOnlyRedirectPath,
} from '@/lib/locale';
import {
  isBaseLocaleOnlyPath,
  SITEMAP_LOCALIZED_ROUTES,
} from '@/lib/sitemap-routes';

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

/**
 * Public HTML is immutable for the duration of a short edge-cache window:
 * its URL already contains the locale, and the page has no user-specific
 * data. Keep this allowlist deliberately narrow so auth, dashboard, API and
 * simulator state never enter the shared cache.
 */
const publicLocalizedPaths = new Set<string>([
  ...SITEMAP_LOCALIZED_ROUTES,
  '/ai',
  '/changelog',
  '/cookie',
  '/languages',
  '/pricing',
  '/privacy',
  '/roadmap',
  '/terms',
  '/waitlist',
]);

const publicLocalePrefixes = chartMiniLocalePaths
  .map(({ prefix }) => prefix)
  .filter((prefix) => prefix !== '/')
  .sort((left, right) => right.length - left.length);

const htmlCacheTtl = 10 * 60;
const htmlCacheStaleTtl = 24 * 60 * 60;
const htmlCacheOperationTimeout = 100;
const htmlCacheInFlight = new Map<string, Promise<Response>>();

async function withCacheTimeout<T>(
  operation: Promise<T>,
  timeoutMilliseconds: number
): Promise<T | undefined> {
  return Promise.race([
    operation,
    new Promise<undefined>((resolve) =>
      setTimeout(() => resolve(undefined), timeoutMilliseconds)
    ),
  ]);
}

function getLocaleFreePath(pathname: string): string {
  const prefix = publicLocalePrefixes.find(
    (candidate) =>
      pathname === candidate || pathname.startsWith(`${candidate}/`)
  );

  return prefix ? pathname.slice(prefix.length) || '/' : pathname;
}

function isPublicHtmlPath(pathname: string): boolean {
  const localeFreePath = getLocaleFreePath(pathname);

  return (
    publicLocalizedPaths.has(localeFreePath) ||
    isBaseLocaleOnlyPath(localeFreePath)
  );
}

function isCacheableHtmlRequest(request: Request): boolean {
  if (request.method !== 'GET') return false;

  const url = new URL(request.url);
  if (request.headers.has('X-ChartMini-Prerender')) return false;
  if (stagingHosts.has(url.hostname)) return false;
  if (url.search || url.hash) return false;
  if (!isPublicHtmlPath(url.pathname)) return false;

  // A locale cookie or auth/session cookie can change the rendered shell.
  // Explicit locale URLs are the canonical SEO contract, so do not let a
  // cookie-bearing request populate a shared response.
  if (request.headers.has('Authorization')) return false;
  if (request.headers.has('Cookie')) return false;

  return true;
}

function withHtmlCacheHeaders(
  response: Response,
  cacheStatus: 'HIT' | 'MISS'
): Response {
  const headers = new Headers(response.headers);
  headers.set(
    'Cache-Control',
    `public, s-maxage=${htmlCacheTtl}, stale-while-revalidate=${htmlCacheStaleTtl}`
  );
  headers.set('X-ChartMini-Page-Cache', cacheStatus);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

async function renderPublicHtmlWithCache(
  request: Request,
  render: () => Promise<Response>
): Promise<Response> {
  if (!isCacheableHtmlRequest(request)) return render();

  const cacheKey = new Request(request.url, { method: 'GET' });
  const cache = (caches as unknown as { default: Cache }).default;
  if (!cache) return render();

  let cached: Response | undefined;
  try {
    cached = await withCacheTimeout(
      Promise.resolve().then(() => cache.match(cacheKey)),
      htmlCacheOperationTimeout
    );
  } catch {
    cached = undefined;
  }
  if (cached) return withHtmlCacheHeaders(cached, 'HIT');

  const key = request.url;
  let pending = htmlCacheInFlight.get(key);
  if (!pending) {
    pending = render()
      .then(async (response) => {
        const contentType = response.headers.get('Content-Type') ?? '';
        if (response.status !== 200 || !contentType.includes('text/html')) {
          return response;
        }

        let body: ArrayBuffer;
        try {
          // Buffer the document before Cache API writes. This keeps the
          // response body independent from the cache clone on both Workers
          // and Wrangler's local Cache API implementation.
          body = await response.arrayBuffer();
        } catch {
          return response;
        }

        const cacheableResponse = withHtmlCacheHeaders(
          new Response(body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          }),
          'MISS'
        );
        try {
          await withCacheTimeout(
            Promise.resolve().then(() =>
              cache.put(cacheKey, cacheableResponse.clone())
            ),
            htmlCacheOperationTimeout
          );
        } catch {
          // Cache availability must never turn a valid page into a 5xx.
        }
        return cacheableResponse;
      })
      .finally(() => {
        htmlCacheInFlight.delete(key);
      });
    htmlCacheInFlight.set(key, pending);
  }

  // Each concurrent caller gets its own body stream while the underlying
  // render/cache fill is shared inside this Worker isolate.
  return (await pending).clone();
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

function getBaseLocaleOnlyRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const destination = getBaseLocaleOnlyRedirectPath(url.pathname);
  if (!destination) return null;

  url.pathname = destination;
  return Response.redirect(url, 308);
}

const staleStaticLocalePrefixes = [
  '/zh-hans',
  '/es-419',
  '/fa',
  '/ro',
  '/ta',
] as const;

function isStaleStaticLocalePath(pathname: string): boolean {
  return staleStaticLocalePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

async function serveStaleStaticLocaleFromAssets(
  request: Request
): Promise<Response | null> {
  const url = new URL(request.url);
  if (
    request.method !== 'GET' ||
    !isStaleStaticLocalePath(url.pathname) ||
    url.pathname.endsWith('/')
  ) {
    return null;
  }

  try {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type') ?? '';
    if (!response.ok || !contentType.includes('text/html')) return null;

    // Return the binding response unchanged. In particular, do not rebuild
    // it from `response.body`: local and edge asset bindings may reuse the
    // stream for concurrent requests, and wrapping that stream can produce a
    // false 200 with an empty body.
    return response;
  } catch {
    // A binding failure should fall through to the normal route handler,
    // which preserves the existing availability behavior.
    return null;
  }
}

export default {
  async fetch(request: Request) {
    // All historical ChartMini locale prefixes are now first-class Paraglide
    // locales. Keep the original request intact so middleware can select the
    // locale and canonical URL without changing public links.
    const legacyRedirect = getChartMiniLegacyRedirect(request);
    if (legacyRedirect) {
      return addStagingRobotsHeader(request, legacyRedirect);
    }

    const baseLocaleOnlyRedirect = getBaseLocaleOnlyRedirect(request);
    if (baseLocaleOnlyRedirect) {
      return addStagingRobotsHeader(request, baseLocaleOnlyRedirect);
    }

    const trailingSlashRedirect = getTrailingSlashRedirect(request);
    if (trailingSlashRedirect) {
      return addStagingRobotsHeader(request, trailingSlashRedirect);
    }

    const staticLocaleDocument =
      await serveStaleStaticLocaleFromAssets(request);
    if (staticLocaleDocument) {
      return addStagingRobotsHeader(request, staticLocaleDocument);
    }

    return localeMiddleware(request, () =>
      renderPublicHtmlWithCache(request, () =>
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
      )
    );
  },
};
