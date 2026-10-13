import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            'User-agent: *',
            'Allow: /',
            '',
            '# Keep the site available to answer and search crawlers.',
            'User-agent: GPTBot',
            'Allow: /',
            'User-agent: ChatGPT-User',
            'Allow: /',
            'User-agent: PerplexityBot',
            'Allow: /',
            'User-agent: ClaudeBot',
            'Allow: /',
            'User-agent: anthropic-ai',
            'Allow: /',
            'User-agent: Google-Extended',
            'Allow: /',
            'User-agent: Bingbot',
            'Allow: /',
            '',
            'Sitemap: https://image2minecraftskin.com/sitemap.xml',
            'LLMs-Txt: https://image2minecraftskin.com/llms.txt',
            '',
          ].join('\n'),
          { headers: { 'Content-Type': 'text/plain' } }
        ),
    },
  },
});
