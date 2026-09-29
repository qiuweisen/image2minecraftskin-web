import { createFileRoute } from '@tanstack/react-router';

const SITEMAP_ENTRIES = [
  { path: '/', lastModified: '2026-09-26' },
  { path: '/minecraft-skin-viewer', lastModified: '2026-09-26' },
  { path: '/privacy', lastModified: '2026-08-26' },
  { path: '/terms', lastModified: '2026-08-26' },
] as const;

function createSitemap() {
  const urls = SITEMAP_ENTRIES.map(
    ({ path, lastModified }) =>
      `<url><loc>https://image2minecraftskin.com${path}</loc><lastmod>${lastModified}</lastmod></url>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
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
