import { createFileRoute } from '@tanstack/react-router';
import { getSortedPosts, isIndexablePost } from '@/lib/blog';
import { getBaseUrl } from '@/lib/urls';
import { websiteConfig } from '@/config/website';
import { chartMiniLocalePaths } from '@/lib/locale';

const LOCALIZED_ROUTES = ['/', '/play', '/day-trading-simulator'] as const;
const UNLOCALIZED_ROUTES = [
  '/crypto-trading-simulator',
  '/forex-trading-simulator',
  '/intraday-trading-practice',
  '/market-replay',
  '/resources',
  '/about',
  '/contact',
  '/privacy-policy',
  '/user-agreement',
] as const;

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

function alternateLinks(base: string, route: string): string {
  const links = chartMiniLocalePaths
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
    changefreq?: string;
    lastmod?: string;
    priority?: string;
  }
): string {
  const alternate = options?.alternateRoute
    ? alternateLinks(base, options.alternateRoute)
    : '';
  const lastmod = options?.lastmod
    ? `\n    <lastmod>${escapeXml(options.lastmod)}</lastmod>`
    : '';
  const changefreq = options?.changefreq
    ? `\n    <changefreq>${options.changefreq}</changefreq>`
    : '';
  const priority = options?.priority
    ? `\n    <priority>${options.priority}</priority>`
    : '';
  return `  <url>\n    <loc>${escapeXml(`${base}${path}`)}</loc>${alternate}${lastmod}${changefreq}${priority}\n  </url>`;
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

        for (const route of LOCALIZED_ROUTES) {
          for (const { prefix } of chartMiniLocalePaths) {
            entries.push(
              urlEntry(base, localizedPath(prefix, route), {
                alternateRoute: route,
              })
            );
          }
        }

        for (const route of UNLOCALIZED_ROUTES) {
          entries.push(urlEntry(base, route));
        }

        if (websiteConfig.blog?.enable) {
          entries.push(urlEntry(base, '/blog', { changefreq: 'weekly' }));
          for (const post of getSortedPosts('en').filter(isIndexablePost)) {
            entries.push(
              urlEntry(base, `/blog/${post.slug}`, {
                changefreq: 'weekly',
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
          },
        });
      },
    },
  },
});
