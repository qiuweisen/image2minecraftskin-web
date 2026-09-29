import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/manifest.json')({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          name: 'image2minecraftskin',
          short_name: 'image2minecraftskin',
          start_url: '/',
          display: 'standalone',
          background_color: '#f4f3ef',
          theme_color: '#081013',
          icons: [
            {
              src: '/brand/logo-mark.svg',
              sizes: 'any',
              type: 'image/svg+xml',
            },
          ],
        }),
    },
  },
});
