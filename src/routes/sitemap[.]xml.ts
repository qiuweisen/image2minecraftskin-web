import { createFileRoute } from '@tanstack/react-router';
import { baseLocale, localeConfig, locales } from '@/lib/locale';
import { getCanonicalUrlForLocale } from '@/lib/urls';

const SITEMAP_ENTRIES = [
  { path: '/', lastModified: '2026-10-12' },
  { path: '/minecraft-skin-viewer', lastModified: '2026-10-12' },
  { path: '/image-to-minecraft-skin', lastModified: '2026-10-12' },
  { path: '/minecraft-skin-formats', lastModified: '2026-10-12' },
  { path: '/privacy', lastModified: '2026-08-26' },
  { path: '/terms', lastModified: '2026-08-26' },
] as const;

function createSitemap() {
  const urls = SITEMAP_ENTRIES.map(({ path, lastModified }) => {
    const alternates = locales
      .map(
        (locale) =>
          `<xhtml:link rel="alternate" hreflang="${localeConfig[locale].hreflang}" href="${getCanonicalUrlForLocale(path, locale)}"/>`
      )
      .join('');
    const defaultAlternate = `<xhtml:link rel="alternate" hreflang="x-default" href="${getCanonicalUrlForLocale(path, baseLocale)}"/>`;
    return `<url><loc>${getCanonicalUrlForLocale(path, baseLocale)}</loc><lastmod>${lastModified}</lastmod>${alternates}${defaultAlternate}</url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(createSitemap(), {
          headers: { 'Content-Type': 'application/xml' },
        }),
    },
  },
});
