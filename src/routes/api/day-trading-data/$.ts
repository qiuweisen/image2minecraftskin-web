import { createFileRoute } from '@tanstack/react-router';

const CRYPTO_R2_BASE_URL = 'https://r2.chartmini.com/ohlcv/dt/5m';
const FX_R2_BASE_URL = 'https://r2.chartmini.com/ohlcv/dt/fx/5m-test';
const CRYPTO_SHARD_PATH =
  /^binance\/[A-Z0-9]{2,24}USDT\/\d{4}-(0[1-9]|1[0-2])\.json$/;
const FX_SHARD_PATH = /^dukascopy\/[A-Z]{6}\/\d{4}-(0[1-9]|1[0-2])\.json$/;

async function getDayTradingData(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  const prefix = '/api/day-trading-data/';
  const objectPath = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : '';
  const isFx = objectPath.startsWith('fx/');
  const upstreamPath = isFx ? objectPath.slice('fx/'.length) : objectPath;
  const isManifest = upstreamPath === 'manifest.json';
  const isValidShard = isFx
    ? FX_SHARD_PATH.test(upstreamPath)
    : CRYPTO_SHARD_PATH.test(upstreamPath);

  if (!isManifest && !isValidShard) {
    return Response.json(
      { error: 'Invalid day-trading data path.' },
      { status: 400 }
    );
  }

  const upstreamBaseUrl = isFx ? FX_R2_BASE_URL : CRYPTO_R2_BASE_URL;
  // The downstream response is explicitly cacheable. Omitting Request.cache
  // here keeps the proxy compatible with both Vite's local runtime and
  // Cloudflare Workers' fetch implementation.
  const upstream = await fetch(`${upstreamBaseUrl}/${upstreamPath}`);

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: 'Day-trading data is unavailable.' },
      { status: upstream.status === 404 ? 404 : 502 }
    );
  }

  const headers = new Headers({
    'Content-Type':
      upstream.headers.get('content-type') || 'application/json; charset=utf-8',
    'Cache-Control': isManifest
      ? 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'
      : 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    'X-Content-Type-Options': 'nosniff',
  });
  const etag = upstream.headers.get('etag');
  const lastModified = upstream.headers.get('last-modified');
  if (etag) headers.set('ETag', etag);
  if (lastModified) headers.set('Last-Modified', lastModified);

  return new Response(upstream.body, { status: 200, headers });
}

export const Route = createFileRoute('/api/day-trading-data/$')({
  server: {
    handlers: {
      GET: ({ request }) => getDayTradingData(request),
    },
  },
});
