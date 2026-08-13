import { createFileRoute } from '@tanstack/react-router';
import { getBaseUrl } from '@/lib/urls';

const disallowedPaths = ['/api/', '/admin/', '/go/'];

function getDisallowRules() {
  return disallowedPaths.map((path) => `Disallow: ${path}`).join('\n');
}

/**
 * Dynamic robots.txt
 * https://tanstack.dev/start/latest/docs/framework/react/guide/seo#dynamic-robotstxt
 */
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = getBaseUrl().replace(/\/$/, '');
        const isStaging = [
          'chartmini-v2.sudotradecom.workers.dev',
          'v2.chartmini.com',
        ].includes(new URL(request.url).hostname);
        const robots = isStaging
          ? `User-agent: *
Disallow: /`
          : `User-agent: *
Allow: /
${getDisallowRules()}

Sitemap: ${base}/sitemap.xml`;

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      },
    },
  },
});
