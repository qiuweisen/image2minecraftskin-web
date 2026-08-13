import { createFileRoute } from '@tanstack/react-router';

const R2_BUNDLED_BASE_URL = 'https://r2.chartmini.com/ohlcv/bundled';
const SYMBOL_PATH =
  /^(stooq|binancev|binance)\/[A-Z0-9.]{1,24}(?:\.json|\/chunks\/\d{4}\.json)$/;

async function getPlayData(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  const prefix = '/api/play-data/';
  const objectPath = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : '';
  const isManifest = objectPath === 'manifest.json';

  if (!isManifest && !SYMBOL_PATH.test(objectPath)) {
    return Response.json({ error: 'Invalid play data path.' }, { status: 400 });
  }

  const upstream = await fetch(`${R2_BUNDLED_BASE_URL}/${objectPath}`, {
    cache: 'no-store',
  });

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: 'Play data is unavailable.' },
      { status: upstream.status === 404 ? 404 : 502 }
    );
  }

  const headers = new Headers({
    'Content-Type':
      upstream.headers.get('content-type') || 'application/json; charset=utf-8',
    'Cache-Control': isManifest
      ? 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'
      : 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    'X-Content-Type-Options': 'nosniff',
  });
  const etag = upstream.headers.get('etag');
  const lastModified = upstream.headers.get('last-modified');
  if (etag) headers.set('ETag', etag);
  if (lastModified) headers.set('Last-Modified', lastModified);

  return new Response(upstream.body, { status: 200, headers });
}

export const Route = createFileRoute('/api/play-data/$')({
  server: {
    handlers: {
      GET: ({ request }) => getPlayData(request),
    },
  },
});
