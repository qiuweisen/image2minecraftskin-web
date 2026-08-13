import { createFileRoute } from '@tanstack/react-router';
import { affiliateLinks, affiliateQueryParams } from '@/lib/affiliate-links';

/**
 * Preserve ChartMini's tracked affiliate URLs during the migration.
 * These URLs are intentionally not included in the sitemap.
 */
export const Route = createFileRoute('/go/$slug')({
  server: {
    handlers: {
      GET: ({ request, params }) => {
        const item = affiliateLinks[params.slug as keyof typeof affiliateLinks];
        const headers = new Headers({
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        });

        if (!item) {
          headers.set('Location', new URL('/', request.url).toString());
          return new Response(null, {
            status: 302,
            headers,
          });
        }

        const targetUrl = new URL(item.targetUrl);
        const requestUrl = new URL(request.url);
        for (const key of affiliateQueryParams) {
          const value = requestUrl.searchParams.get(key);
          if (value) targetUrl.searchParams.set(key, value);
        }

        headers.set('Location', targetUrl.toString());
        return new Response(null, { status: 302, headers });
      },
    },
  },
});
