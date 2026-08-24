import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://image2minecraftskin.com/</loc></url><url><loc>https://image2minecraftskin.com/privacy</loc></url><url><loc>https://image2minecraftskin.com/terms</loc></url></urlset>', { headers: { 'Content-Type': 'application/xml' } }),
    },
  },
});
