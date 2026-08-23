# Task29.5 — Worker 1102 CPU remediation: locale static pages and HTML cache

Date: 2026-08-23
Owner: Codex
Status: local implementation and regression validation complete; production deployment pending explicit authorization

## Scope

Implement the urgent availability fix for the production-confirmed Cloudflare
Worker `exceededCpu` 503 without changing the public multilingual SEO URL
contract, canonical URLs, hreflang links, sitemap ownership, article content,
or Cloudflare production settings.

## Implementation

- Added `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2/scripts/prerender-public-pages.mjs`.
  The postbuild step starts the built Worker locally, renders the public sitemap
  locale routes, and writes independent HTML documents into `dist/client`.
- Added the package `postbuild` hook in
  `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2/package.json`.
- The build now materializes 316 static SEO documents: 39 non-alias locales ×
  8 localized public paths, plus 4 English-only pages. The migration-only
  `/zh` alias is deliberately excluded so the Worker can preserve the existing
  301 redirect to `/zh-hans`.
- Updated `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2/src/server.ts`:
  - shared HTML cache only for allowlisted public SEO paths;
  - cache key includes the full locale URL;
  - Cookie/Authorization/query-string requests bypass shared cache;
  - API, auth, dashboard, simulator state, and staging paths are excluded;
  - same-isolate in-flight renders are coalesced;
  - cache reads/writes have a 100 ms fail-open timeout;
  - HTML is buffered before cache cloning so cache writes cannot truncate the
    response body.
- The first Paraglide `experimentalMiddlewareLocaleSplitting` attempt was
  rejected during validation: version 2.20.0 expands all compiled message
  functions into a roughly 9 MB generated server file that Vite cannot parse.
  That option is not enabled in the final implementation.

## Local evidence

- `pnpm exec biome check src/server.ts scripts/prerender-public-pages.mjs package.json`: PASS
- `pnpm exec tsc --noEmit`: PASS
- `pnpm test`: PASS — 6 test files and 20 tests.
- `pnpm build`: Vite client and SSR builds PASS; final postbuild static generation PASS.
- Final postbuild output: `316 static SEO documents to dist/client`.
- Final artifact inventory: 323 HTML files total (including 7 existing
  TradingView documents), 316 SEO documents, 0 stale `/zh` HTML aliases, and
  `dist/client` size about 143 MiB.
- Local Wrangler static requests:
  - `/`, `/de`, `/de/day-trading-simulator`, `/about`: HTTP 200, complete HTML,
    `CF-Cache-Status: HIT`, no Worker page-cache header.
  - `/zh`, `/zh/day-trading-simulator`: HTTP 301 to `/zh-hans` equivalents.
  - `/zh-hans`: HTTP 200 static asset.
- SEO contract checks on generated HTML:
  - English root canonical: `https://chartmini.com/`;
  - German root canonical: `https://chartmini.com/de`;
  - German simulator canonical: `https://chartmini.com/de/day-trading-simulator`;
  - localized documents retain `hrefLang` alternate links.
- Dynamic `/blog` local cache check: first request HTTP 200 with
  `X-ChartMini-Page-Cache: MISS`, second request HTTP 200 with `HIT`; both
  response bodies were exactly 341,000 bytes.
- 40 locale homepage concurrency check: all 40 returned HTTP 200 complete HTML;
  minimum body size was 362,158 bytes; no 503/resource-limit marker.
- 12 concurrent `/blog` requests: all returned HTTP 200 complete HTML;
  minimum body size was 341,000 bytes.
- Cloudflare limits were checked against the current official documentation:
  the paid plan allows 100,000 static asset files per Worker version and each
  file may be up to 25 MiB; this build is below both limits.

## Production gate

No production deployment was performed in this task. The previously captured
production `exceededCpu` evidence remains the authoritative red baseline until
this build is explicitly deployed. After authorization, deploy the normal
`pnpm deploy` path, repeat the sanitized 12-request production probe, inspect
`wrangler tail` for `exceededCpu`, then only if the probe is clean request GSC
validation/reindexing.

## Result

`PASS_LOCAL_STATIC_ASSETS_HTML_CACHE_AND_LOCALE_REDIRECTS_PENDING_PRODUCTION_DEPLOYMENT`
