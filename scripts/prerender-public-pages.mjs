#!/usr/bin/env node

/**
 * Materialize the public, indexable locale pages into the Cloudflare Assets
 * directory after the SSR build. Cloudflare serves these files before the
 * Worker runs, so crawler traffic does not spend CPU on React SSR.
 *
 * The URL contract intentionally mirrors the sitemap: locale-prefixed pages
 * remain independent documents, while English-only pages stay unprefixed.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const clientDirectory = path.join(root, 'dist', 'client');
const serverConfig = path.join(root, 'dist', 'server', 'wrangler.json');
const wrangler = path.join(root, 'node_modules', '.bin', 'wrangler');
const port = Number(process.env.PRERENDER_PORT ?? 8791);
const concurrency = Math.max(
  1,
  Math.min(3, Number(process.env.PRERENDER_CONCURRENCY ?? 3))
);

if (process.env.PRERENDER_STATIC_PAGES === 'false') {
  console.log('[prerender] skipped (PRERENDER_STATIC_PAGES=false)');
  process.exit(0);
}

if (!fs.existsSync(clientDirectory) || !fs.existsSync(serverConfig)) {
  throw new Error(
    '[prerender] expected dist/client and dist/server/wrangler.json; run the production build first'
  );
}

const { locales } = JSON.parse(
  fs.readFileSync(path.join(root, 'project.inlang', 'settings.json'), 'utf8')
);

// `/zh` is a migration-only alias. The Worker must see it so the existing
// 301 redirect to `/zh-hans` runs before Assets can serve a document.
const prerenderLocales = locales.filter((locale) => locale !== 'zh');

const localizedRoutes = [
  '/',
  '/play',
  '/day-trading-simulator',
  '/crypto-trading-simulator',
  '/forex-trading-simulator',
  '/intraday-trading-practice',
  '/market-replay',
  '/resources',
];

const baseLocaleOnlyRoutes = [
  '/about',
  '/contact',
  '/privacy-policy',
  '/user-agreement',
];

function localizeRoute(route, locale) {
  if (locale === 'en') return route;
  return route === '/' ? `/${locale}` : `/${locale}${route}`;
}

function outputFileForPathname(pathname) {
  if (pathname === '/') return path.join(clientDirectory, 'index.html');
  const relativePath = pathname.replace(/^\/+/, '');
  if (!relativePath || relativePath.includes('..')) {
    throw new Error(`[prerender] unsafe pathname: ${pathname}`);
  }
  return path.join(clientDirectory, `${relativePath}.html`);
}

const pages = [
  ...prerenderLocales.flatMap((locale) =>
    localizedRoutes.map((route) => localizeRoute(route, locale))
  ),
  ...baseLocaleOnlyRoutes,
].filter((pathname, index, all) => all.indexOf(pathname) === index);

const cleanupPages = [
  ...locales.flatMap((locale) =>
    localizedRoutes.map((route) => localizeRoute(route, locale))
  ),
  ...baseLocaleOnlyRoutes,
].filter((pathname, index, all) => all.indexOf(pathname) === index);

// A postbuild rerun must not read an older static document as its own source.
// Clean every known locale target, including aliases that are no longer
// pre-rendered, so a former `/zh` asset cannot bypass the Worker redirect.
for (const pathname of cleanupPages) {
  fs.rmSync(outputFileForPathname(pathname), { force: true });
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer(origin) {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${origin}/`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.status < 500) return;
      lastError = new Error(`health check returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(500);
  }
  throw new Error(`[prerender] local Worker did not start: ${lastError}`);
}

const child = spawn(
  wrangler,
  ['dev', '--local', '--config', serverConfig, '--port', String(port)],
  {
    cwd: root,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
    stdio: ['ignore', 'ignore', 'pipe'],
  }
);

let childError = '';
child.stderr.on('data', (chunk) => {
  childError += chunk.toString();
  if (childError.length > 4000) childError = childError.slice(-4000);
});

const origin = `http://127.0.0.1:${port}`;
const failures = [];
let nextPage = 0;

async function renderNextPage() {
  while (nextPage < pages.length) {
    const pageIndex = nextPage;
    nextPage += 1;
    const pathname = pages[pageIndex];
    try {
      let html;
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await fetch(`${origin}${pathname}`, {
            headers: {
              Accept: 'text/html',
              'X-ChartMini-Prerender': '1',
            },
            signal: AbortSignal.timeout(30000),
          });
          const contentType = response.headers.get('content-type') ?? '';
          if (response.status !== 200 || !contentType.includes('text/html')) {
            const body = (await response.text()).slice(0, 240);
            throw new Error(
              `${response.status} ${contentType} ${body.replace(/\s+/g, ' ')}`
            );
          }
          html = await response.text();
          const canonicalMatch = html.match(
            /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
          );
          const expectedPath = pathname.replace(/\/$/, '') || '/';
          const canonicalPath = canonicalMatch
            ? new URL(canonicalMatch[1], 'https://chartmini.com').pathname
            : null;
          const normalizedCanonicalPath =
            canonicalPath?.replace(/\/$/, '') || '/';
          if (
            html.length < 2048 ||
            !/<html[\s>]/i.test(html) ||
            !canonicalMatch ||
            normalizedCanonicalPath !== expectedPath
          ) {
            throw new Error(
              `invalid HTML document (bytes=${html.length}, canonical=${canonicalPath ?? 'missing'}, expected=${pathname})`
            );
          }
          break;
        } catch (error) {
          lastError = error;
          if (attempt < 3) await sleep(attempt * 250);
        }
      }
      if (typeof html !== 'string') {
        throw lastError ?? new Error('no HTML response');
      }
      fs.mkdirSync(path.dirname(outputFileForPathname(pathname)), {
        recursive: true,
      });
      fs.writeFileSync(outputFileForPathname(pathname), html);

      if ((pageIndex + 1) % 20 === 0 || pageIndex === pages.length - 1) {
        console.log(`[prerender] ${pageIndex + 1}/${pages.length}`);
      }
    } catch (error) {
      failures.push({ pathname, error: String(error) });
    }
  }
}

try {
  await waitForServer(origin);
  await Promise.all(
    Array.from({ length: Math.min(concurrency, pages.length) }, () =>
      renderNextPage()
    )
  );

  if (failures.length > 0) {
    throw new Error(
      `[prerender] ${failures.length} pages failed:\n${failures
        .slice(0, 20)
        .map(({ pathname, error }) => `- ${pathname}: ${error}`)
        .join('\n')}`
    );
  }

  console.log(
    `[prerender] wrote ${pages.length} static SEO documents to dist/client`
  );
} catch (error) {
  if (childError) console.error(childError);
  throw error;
} finally {
  child.kill('SIGTERM');
}
