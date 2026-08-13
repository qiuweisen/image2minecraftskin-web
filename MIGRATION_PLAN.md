# ChartMini → TanStarter v2 Migration Plan

## Goal

Rebuild ChartMini on TanStack Start/TanStarter while preserving the existing public URL contract, page copy, article slugs, redirects, localized paths, SEO metadata, and user data. Production DNS and production data remain untouched until the final cutover gate passes.

## Baseline (captured 2026-08-11)

- Production sitemap: 523 `<loc>` entries.
- Current blog index: 397 indexable posts from 402 Markdown files.
- Existing legacy blog redirects: 373 mappings in `blog-redirects.json`.
- Existing localized URL prefixes: 39 language prefixes.
- v2 now contains the path-compatible `/play` and `/day-trading-simulator` simulator clients, the reused TradingView library, and read-only proxies to the existing ChartMini R2 market-data paths. It remains a staging build, not production parity.
- v2 is protected with `X-Robots-Tag: noindex` and `robots.txt: Disallow: /`.

## Architecture decision

TanStarter remains the application shell: root document, Cloudflare entry, auth boundary, storage bindings, UI primitives, content collections, and SEO helpers stay in place. ChartMini routes are added as path-compatible route files and pathless route groups. The public URL is the contract; the TanStack file location is an implementation detail.

The migration must not rely on TanStarter's default two-locale URL scheme (`/` and `/zh`) until the existing ChartMini locale prefixes have been mapped. The existing ChartMini locale map remains the source of truth for legacy URLs.

## Current implementation checkpoint (2026-08-11)

- The old simulator UI, Zustand session stores, TradingView adapter, chart persistence client, and daily/intraday loaders are reused under TanStack Start-compatible client boundaries.
- `/api/play-data/*` continues to read `https://r2.chartmini.com/ohlcv/bundled`; `/api/day-trading-data/*` continues to read the existing crypto and FX R2 releases. No market-data objects were copied into the v2 R2 bucket or transformed.
- The old TradingView static library is served at `/TradingView/charting_library/`, preserving the component's `library_path` contract.
- `/api/chart-settings` currently returns a guest no-op compatibility payload. Guest chart settings remain in localStorage; the authenticated D1 chart-settings table is intentionally deferred to the auth/database phase.
- Local and deployed browser smoke tests passed for both simulator pages: Start → manifest → historical candles → TradingView iframe, with no 404s or console errors.

## Phases

### 0. URL contract and safety baseline

- Capture production sitemap URLs, static routes, localized route families, query variants, affiliate `/go/*` links, and API contracts.
- Run the URL parity checker against `https://v2.chartmini.com`.
- Produce a reviewed manifest of every source URL with its expected status: `200`, `301/308`, or intentional `404`.
- Do not change DNS, production Worker routes, or production databases.

### 1. Route compatibility layer

- Add the current ChartMini public pages with their exact paths, including:
  `/play`, `/day-trading-simulator`, `/crypto-trading-simulator`,
  `/forex-trading-simulator`, `/intraday-trading-practice`, `/market-replay`,
  `/resources`, `/languages`, `/privacy-policy`, and `/user-agreement`.
- Add `/blog/p/$page` and preserve the existing pagination behavior.
- Port the 373 permanent blog redirects and preserve `/go/$slug` behavior.
- Keep TanStarter's auth, dashboard, settings, admin, and API routes isolated from the public ChartMini route group.

### 2. Content and internal-link migration

- Import the current 397 indexable articles and their Markdown content.
- Preserve frontmatter `slug`; TanStarter must not derive the public slug only from date-based filenames.
- Extend the content schema for ChartMini fields such as `dateModified`, `categories`, `tags`, `schema`, `indexable`, `noindex`, `redirectTo`, and optional images.
- Rewrite/validate internal links so every current public destination remains valid.
- Remove or noindex TanStarter sample content before production parity testing.

### 3. SEO and locale parity

- Preserve titles, descriptions, canonical URLs, hreflang, Open Graph, JSON-LD, robots rules, and sitemap coverage.
- Support all existing ChartMini locale prefixes, including `/es-419`, `/zh-hans`, and `/zh-hant`, before removing any old route.
- Keep `/en/*` compatibility redirects exactly as they work today.
- Require sitemap URL parity and zero accidental 404s before cutover.

### 4. Application, database, and authentication

- Port the simulator pages and API contracts without changing browser-facing paths or query parameters such as `?market=forex` and `?market=crypto`.
- Decide database strategy before data migration: retain PostgreSQL/Hyperdrive for lowest cutover risk, or explicitly migrate the current PostgreSQL schema/data to D1.
- Map existing NextAuth users/accounts/passwords to the Better Auth schema only after a backup and a test restore.
- Configure staging-only Google OAuth callbacks, email provider, verification, reset-password, and session-cookie behavior.
- Add points/credits as a separate ledger/domain model after the identity model is stable.

### 5. Staging validation

- Run build, typecheck, unit tests, route checks, auth checks, simulator checks, and URL parity checks.
- Compare old and v2 for HTTP status, final redirect, canonical, title, description, H1, hreflang, JSON-LD, and important internal links.
- Test desktop/mobile rendering and Core Web Vitals on representative marketing, article, and simulator pages.
- Keep staging `noindex` until the final cutover is approved.

### 6. Production cutover and rollback

- Freeze writes and take a production database backup.
- Apply the tested schema/data migration and verify row counts, users, accounts, sessions, settings, and premium/points state.
- Deploy the exact tested Worker version to the production route/custom domain.
- Switch only the required DNS/Worker route, keep the old deployment available for rollback, and monitor 4xx/5xx, auth, traffic, and Search Console.
- Remove staging `noindex` only on the production hostname; never expose the staging hostname as canonical.

## Cutover gates

The migration is not ready for DNS/route switching until all of these are true:

1. Every current sitemap URL is `200` or has the same intentional redirect target/status.
2. All 373 legacy blog redirects are present and tested.
3. All current locale prefixes and `/en/*` behavior are covered.
4. Current public page paths and query contracts have no accidental 404s.
5. v2 canonical, hreflang, sitemap, and robots output match the production URL contract.
6. Database backup/restore and authentication migration have been rehearsed.
7. Rollback to the previous Worker and database snapshot is documented and tested.
