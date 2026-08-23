import { createFileRoute } from '@tanstack/react-router';
import { getSortedPosts, isIndexablePost } from '@/lib/blog';
import { getBaseUrl } from '@/lib/urls';
import { websiteConfig } from '@/config/website';
import { baseLocale, chartMiniLocalePaths } from '@/lib/locale';
import {
  SITEMAP_BASE_LOCALE_ROUTES,
  SITEMAP_LOCALIZED_ROUTES,
  SITEMAP_ROUTE_LOCALE_PREFIXES,
} from '@/lib/sitemap-routes';

type LocalePath = (typeof chartMiniLocalePaths)[number];

function localizedPath(prefix: string, route: string): string {
  if (prefix === '/') return route;
  return route === '/' ? prefix : `${prefix}${route}`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function alternateLinks(
  base: string,
  route: string,
  localePaths: readonly LocalePath[] = chartMiniLocalePaths
): string {
  const links = localePaths
    .map(
      ({ prefix, hreflang }) =>
        `\n    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(`${base}${localizedPath(prefix, route)}`)}" />`
    )
    .join('');
  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${base}${route}`)}" />`;
}

function urlEntry(
  base: string,
  path: string,
  options?: {
    alternateRoute?: string;
    alternateLocalePaths?: readonly LocalePath[];
    lastmod?: string;
  }
): string {
  const alternate = options?.alternateRoute
    ? alternateLinks(base, options.alternateRoute, options.alternateLocalePaths)
    : '';
  const lastmod = options?.lastmod
    ? `\n    <lastmod>${escapeXml(options.lastmod)}</lastmod>`
    : '';
  return `  <url>\n    <loc>${escapeXml(`${base}${path}`)}</loc>${alternate}${lastmod}\n  </url>`;
}

/**
 * ChartMini's production sitemap contract. Keep this list in lockstep with
 * the current site until the DNS cutover has passed the URL/SEO gate.
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const entries: string[] = [];

        for (const route of SITEMAP_LOCALIZED_ROUTES) {
          const allowedPrefixes = SITEMAP_ROUTE_LOCALE_PREFIXES[route];
          const localePaths = allowedPrefixes
            ? chartMiniLocalePaths.filter(({ prefix }) =>
                allowedPrefixes.includes(prefix)
              )
            : chartMiniLocalePaths;

          for (const { prefix } of localePaths) {
            entries.push(
              urlEntry(base, localizedPath(prefix, route), {
                alternateRoute: route,
                alternateLocalePaths: localePaths,
              })
            );
          }
        }

        for (const route of SITEMAP_BASE_LOCALE_ROUTES) {
          entries.push(urlEntry(base, route));
        }

        if (websiteConfig.blog?.enable) {
          // Blog content currently exists only in the base locale. Keep the
          // sitemap English-only instead of synthesizing locale fallbacks.
          entries.push(urlEntry(base, '/blog'));
          for (const post of getSortedPosts(baseLocale).filter(
            isIndexablePost
          )) {
            entries.push(
              urlEntry(base, `/blog/${post.slug}`, {
                lastmod: new Date(post.dateModified ?? post.date)
                  .toISOString()
                  .slice(0, 10),
              })
            );
          }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        });
      },
    },
  },
});
