#!/usr/bin/env node

const sourceOrigin = (
  process.env.SOURCE_ORIGIN ?? 'https://chartmini.com'
).replace(/\/$/, '');
const targetOrigin = (
  process.env.TARGET_ORIGIN ?? 'https://v2.chartmini.com'
).replace(/\/$/, '');
const concurrency = Math.max(
  1,
  Number(process.env.URL_AUDIT_CONCURRENCY ?? 12)
);
const timeoutMs = Math.max(
  1000,
  Number(process.env.URL_AUDIT_TIMEOUT_MS ?? 15000)
);

function request(url, options = {}) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
}

async function getText(url) {
  const response = await request(url, {
    headers: { 'user-agent': 'ChartMini-URL-Parity-Audit/1.0' },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.text();
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].trim()
  );
}

function pathAndQuery(url) {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

async function checkUrl(path) {
  const targetUrl = `${targetOrigin}${path}`;
  const response = await request(targetUrl, {
    redirect: 'manual',
    headers: { 'user-agent': 'ChartMini-URL-Parity-Audit/1.0' },
  });
  const location = response.headers.get('location');
  return {
    path,
    status: response.status,
    location: location ? new URL(location, targetUrl).toString() : null,
  };
}

async function mapWithConcurrency(items, worker) {
  const results = [];
  let nextIndex = 0;

  async function consume() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => consume())
  );
  return results;
}

const sourceSitemapUrl = `${sourceOrigin}/sitemap.xml`;
const sourceXml = await getText(sourceSitemapUrl);
const sourceUrls = [...new Set(extractLocs(sourceXml))];
const targetSitemapUrl = `${targetOrigin}/sitemap.xml`;
const targetXml = await getText(targetSitemapUrl);
const targetUrls = [...new Set(extractLocs(targetXml))];
const sourcePaths = new Set(sourceUrls.map(pathAndQuery));
const targetPaths = new Set(targetUrls.map(pathAndQuery));
const sitemapMissing = [...sourcePaths].filter(
  (path) => !targetPaths.has(path)
);
const sitemapExtra = [...targetPaths].filter((path) => !sourcePaths.has(path));
const paths = sourceUrls.map(pathAndQuery);
const results = await mapWithConcurrency(paths, async (path) => {
  try {
    return await checkUrl(path);
  } catch (error) {
    return { path, status: 0, location: null, error: String(error) };
  }
});

const statusCounts = Object.fromEntries(
  [...new Set(results.map((result) => result.status))]
    .sort((a, b) => a - b)
    .map((status) => [
      String(status),
      results.filter((result) => result.status === status).length,
    ])
);
const missing = results.filter(
  (result) => result.status === 404 || result.status === 0
);
const redirects = results.filter(
  (result) => result.status >= 300 && result.status < 400
);
const ok = results.filter(
  (result) => result.status >= 200 && result.status < 300
);

console.log(
  JSON.stringify(
    {
      sourceSitemapUrl,
      targetSitemapUrl,
      targetOrigin,
      sourceUrlCount: sourceUrls.length,
      targetUrlCount: targetUrls.length,
      sitemapMissingCount: sitemapMissing.length,
      sitemapExtraCount: sitemapExtra.length,
      sitemapMissing: sitemapMissing.slice(0, 100),
      sitemapExtra: sitemapExtra.slice(0, 100),
      statusCounts,
      okCount: ok.length,
      redirectCount: redirects.length,
      missingCount: missing.length,
      missing: missing.slice(0, 100),
      redirects: redirects.slice(0, 100),
    },
    null,
    2
  )
);

if (
  missing.length > 0 ||
  sitemapMissing.length > 0 ||
  sitemapExtra.length > 0
) {
  process.exitCode = 2;
}
