# Task 26.3 — News Trading cluster consolidation

Date: 2026-08-20
Requested target: `/blog/how-to-trade-news-trading-like-a-pro-in-2026`
Requested source: `content/blog/2026021502.md`
Selected final Owner: `/blog/how-to-trade-the-news`
Owner source: `content/blog/2026041501.md`
Second duplicate: `/blog/news-based-trading-practical-guide`
Second duplicate source: `content/blog/2026032801.md`

## Requested task

Revalidate and complete Task26.3 for the existing `how-to-trade-news-trading-like-a-pro-in-2026` URL using fresh production, fresh 2026-08-20 SERP evidence, current v2 site ownership, factual-risk review, GEO/SEO and internal-link/cannibalization evidence.

## Fresh production preflight

Production before this local task has three simultaneous indexable News Trading pages:

1. `/blog/how-to-trade-news-trading-like-a-pro-in-2026`
   - HTTP 200.
   - Self-canonical.
   - BlogPosting rendered by the v2 route.
   - Present in sitemap.
   - `/blog/2026021502` direct 301 to this URL.
2. `/blog/news-based-trading-practical-guide`
   - HTTP 200.
   - Self-canonical.
   - BlogPosting rendered by the v2 route.
   - Present in sitemap.
   - `/blog/2026032801` direct 301 to this URL.
3. `/blog/how-to-trade-the-news`
   - HTTP 200.
   - Self-canonical.
   - BlogPosting rendered by the v2 route.
   - Present in sitemap.
   - `/blog/2026041501` direct 301 to this URL.

Current v2 GSC: `unknown_not_reverified`.
Current v2 Bing: `unknown_not_reverified`.
No legacy GSC/Bing metrics were imported.

## Fresh SERP evidence

Fresh 2026-08-20 searches for `how to trade the news`, `news trading strategy`, economic-release trading and exact/near-exact versions of the requested query show one broad durable intent rather than three separate tasks.

The common SERP jobs are:

- define News Trading / trading the news;
- identify scheduled macro, earnings and breaking-news event types;
- compare actual releases with market expectations;
- prepare with an economic calendar;
- decide between staying flat, pre-event exposure and post-release reaction;
- account for volatility, spread, slippage and fast-market execution;
- discuss FOMC, CPI, NFP/Employment Situation and earnings examples;
- avoid treating the headline alone as a guaranteed directional signal;
- use a written pre-event and post-event process.

Fresh results include current 2026 guides from ChartMini plus third-party News Trading guides. The requested `like a pro` wording does not create a separate search task. The `/news-based-trading-practical-guide` wording also maps to the same broad intent.

ChartMini itself appears in search with all three overlapping pages, confirming live cannibalization rather than a theoretical overlap.

## Current primary-source controls reviewed

- Federal Reserve FOMC calendar: current page states that the FOMC holds eight regularly scheduled meetings per year and other meetings as needed; it publishes statements, minutes, projection materials where applicable and press-conference materials.
- BLS CPI release schedule: current 2026 schedule provides exact release dates and times; the current 2026 entries shown are at 8:30 a.m. ET.
- BLS Employment Situation release schedule: exact 2026 dates vary, so the article should not state a universal first-Friday rule.
- FINRA Order Types: market orders prioritize execution but may fill at a different price than the quote in a fast/volatile market; limit orders provide price control but may not fill.
- FINRA Stop Orders / volatile markets: a triggered stop becomes a market order; the stop price is not a guaranteed execution price and short-lived volatility can trigger undesirable executions.
- FINRA day-trading risk disclosure: volatile or news-driven conditions can make it difficult or impossible to liquidate quickly at a reasonable price, and halts can occur.

## Site graph / cannibalization evidence

Before Task26.3:

- requested target body inlink files: 0;
- `/blog/news-based-trading-practical-guide` body inlink files: 1;
- `/blog/how-to-trade-the-news` body inlink files: 10.

The current site repeatedly calls `/blog/how-to-trade-the-news` the dedicated news-trading/news-catalyst guide from watchlist, spread, gold, earnings, event-journal and other related pages.

This establishes a much stronger current internal ownership signal for the clean `/blog/how-to-trade-the-news` URL.

## Owner Gate

Decision:

`consolidate_redirect + rebuild_owner + duplicate_consolidation`

Selected intent key:

`news_trading_event_reaction_execution_risk_workflow`

Selected Owner:

`/blog/how-to-trade-the-news`

Owner boundary:

- News Trading definition and event taxonomy;
- expectation-vs-actual interpretation;
- primary-source calendar verification;
- stay-flat / post-release / pre-event decision modes;
- post-release workflow;
- FOMC/CPI/Employment Situation/earnings event handling at a framework level;
- breaking-news source verification;
- fast-market order/execution risk;
- first-move continuation/reversal uncertainty;
- replay and journaling workflow with explicit live-execution limitations.

Neighbor boundaries:

- `/blog/replaying-nfp-events-news-data` owns the detailed historical NFP replay/data workflow.
- `/blog/earnings-season-how-to-read-and-react-to-financial-reports-2026` owns reading/classifying company earnings information.
- `/blog/risk-management-position-sizing-guide` owns broad risk/position-sizing architecture.
- `/blog/gap-trading-strategies` owns generic gap setup mechanics.
- `/blog/pre-market-after-hours-trading` owns extended-hours mechanics.

The requested target and `/blog/news-based-trading-practical-guide` do not retain independent indexable ownership.

## Problems in the requested target

The historical requested body includes unsupported, over-specific or potentially misleading claims, including examples such as:

- `News trading represents one of the most profitable... opportunities`;
- fixed `Tier 1` event claims and fixed pip ranges;
- fixed 0-5 / 5-30 / 30+ minute reaction phases presented as general market mechanics;
- universal straddle placement distances;
- fixed news-trade risk percentages and daily loss limits;
- mandatory skip/one-week-break rules;
- broad `professional trader` / `institutional trader` claims;
- false ChartMini claims about real-time economic calendar integration, 30-minute alerts, optimal straddle calculations and event-specific performance tracking.

Because this source is being consolidated, its body is not promoted or rebuilt as a second Owner.

## Problems in the previous selected Owner body

The prior `/blog/how-to-trade-the-news` body contained additional overgeneralizations:

- title and description claimed the first move is usually/almost always wrong;
- asserted fixed 5-30 second algorithmic phase and 30-120 second `real assessment` phase;
- recommended waiting a universal 2-5 minutes for a higher-probability secondary move;
- fixed event-specific timing windows such as FOMC no-trade / assessment periods;
- simplistic `hot CPI -> equities down / USD up / bonds down` rules;
- implied buy-the-rumor/sell-the-news is one of the most reliable patterns;
- prescribed personal pre-earnings position sizing;
- prescribed immediate market exits on surprise negative news;
- claimed stable stale-news time thresholds;
- contained a manual Article schema duplicated by current v2 route architecture.

These defects justify rebuilding the stronger Owner instead of only adding redirects.

## Implementation

### Owner rebuild

Rebuilt `content/blog/2026041501.md` as:

`How to Trade the News: A Risk-Aware News Trading Framework`

Meta title:

`How to Trade the News: News Trading Guide for 2026`

`dateModified: 2026-08-20`.

The new article includes:

- direct answer within the opening passage;
- five GEO-ready takeaways;
- event taxonomy table;
- expectation-vs-actual explanation;
- primary-source FOMC/CPI/Employment Situation calendar table;
- three pre-event decision modes;
- seven-step post-release workflow;
- FOMC, CPI, Employment Situation and earnings sections without fixed directional rules;
- breaking-news source-verification workflow;
- explicit rejection of a universal `first move is wrong` rule;
- FINRA-backed market/limit/stop execution boundaries;
- chart/replay limitations around spread, slippage, intrabar sequence, halts and latency;
- accurate ChartMini capability boundary;
- news-trading checklist;
- visible FAQ;
- source notes and related reading.

Removed manual Article/BlogPosting schema from the Owner source.

### Duplicate consolidation

Added:

- `content/blog/2026021502.md`
  - `redirectTo: /blog/how-to-trade-the-news`
- `content/blog/2026032801.md`
  - `redirectTo: /blog/how-to-trade-the-news`

Updated Worker/static redirect config so all four duplicate paths go directly to the final Owner:

- `/blog/how-to-trade-news-trading-like-a-pro-in-2026` -> `/blog/how-to-trade-the-news`
- `/blog/2026021502` -> `/blog/how-to-trade-the-news`
- `/blog/news-based-trading-practical-guide` -> `/blog/how-to-trade-the-news`
- `/blog/2026032801` -> `/blog/how-to-trade-the-news`

No redirect chain is intentionally introduced.

### Internal-link correction

Changed the one body link that pointed to `/blog/news-based-trading-practical-guide` in `content/blog/2026012001.md` to point directly to `/blog/how-to-trade-the-news`.

After cleanup:

- routable body links to the two redirecting long sources: 0;
- final Owner body inlink files: 11.

## Final validation

PASS after Workflow synchronization:

- `pnpm build`
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check`
  - Biome 415 files
  - Vitest 6/6 test files
  - 17/17 tests
- `git diff --check`
- `pnpm seo:v2:workflow:check`
- requested target manifest has `redirectTo` final Owner;
- second duplicate manifest has `redirectTo` final Owner;
- final Owner remains an Owner with no `redirectTo`;
- final Owner has 11 body inlink source files;
- residual body links to duplicate long URLs: 0;
- manual Article/BlogPosting in final Owner source: 0;
- direct redirect config for both long and both numeric duplicate sources verified;
- global duplicate redirect sources: 0;
- redirect destinations that are also redirect sources: 0.

## Deployment / indexing state

Not performed:

- commit;
- push;
- deployment;
- R2 sync;
- GSC Request Indexing;
- Bing / IndexNow submission.

Production therefore remains pre-Task26.3 until the user deploys.

After deployment verify:

1. `/blog/how-to-trade-the-news` -> 200, exact self-canonical, updated title/meta/body/dateModified, sitemap included.
2. `/blog/how-to-trade-news-trading-like-a-pro-in-2026` -> direct 301 to final Owner.
3. `/blog/2026021502` -> direct 301 to final Owner.
4. `/blog/news-based-trading-practical-guide` -> direct 301 to final Owner.
5. `/blog/2026032801` -> direct 301 to final Owner.
6. Both duplicate long URLs are absent from sitemap.
7. Submit/check only the final Owner in GSC if needed; never submit redirect sources.

Current GSC/Bing status remains `unknown_not_reverified`.

## Final task status

`CONSOLIDATE_REDIRECT_REBUILD_OWNER_DUPLICATE_CONSOLIDATION_COMPLETE_PENDING_DEPLOY`
