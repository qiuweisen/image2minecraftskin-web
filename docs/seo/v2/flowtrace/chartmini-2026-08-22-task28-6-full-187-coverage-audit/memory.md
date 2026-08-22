# ChartMini Task 28.6 — Full 187-Article Coverage Audit and Gap Repair

Date: 2026-08-22
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Task status: `FULL_187_COVERAGE_VERIFIED_GAPS_REPAIRED_PENDING_DEPLOY`

## 1. Goal

Verify the complete 187-article governance set, identify omissions that were not caught by page-by-page Tasks 20–28, repair only confirmed structural/technical gaps, and leave a reproducible v2 closeout record.

This task is a coverage/infrastructure audit. It is not a blanket authorization to rewrite 187 articles.

## 2. Reconstructing the 187-article denominator

The active v2 workflow did not contain a literal 187-row master list, so the denominator was reconstructed from the legacy workflow only as historical list evidence. No legacy GSC/Bing metrics, protection windows, submission facts, SERP conclusions, or owner state were imported.

Historical source checked read-only:

`/Users/iven/Desktop/Work/Chartmini/TradeGame-cloudflare-migration-test/docs/seo/flowtrace/_workflow/candidate-backlog.csv`

Evidence:

- before Task19 the historical candidate backlog had 180 rows;
- after Task19 it had 188 rows;
- Task19.1–19.7 contributed seven primary task targets;
- Task19.2 also registered `/blog/how-to-analyze-a-stock-fundamental-analysis` (`content/blog/2026032602.md`) as the final owner counterpart while processing the duplicate `/blog/how-to-analyze-a-company-a-beginners-guide-to-stock-research-2026`;
- that counterpart is an owner dependency, not one of the seven Task19 primary targets.

Therefore the Task28.6 primary coverage denominator is:

`188 historical rows - 1 Task19.2 owner counterpart = 187 primary source articles`

The excluded counterpart was still validated as a redirect destination and current manifest owner; it is excluded only from the 187 denominator.

## 3. Current local coverage state before repairs

All 187 source files still exist in v2 and expose a current slug.

Current role split:

- 180 active owners;
- 7 redirect sources;
- 181 unique final owner paths after consolidation;
- 0 `noindex: true` among the 187 source files;
- every current source slug appears exactly once in `src/generated/blog-manifest.json`.

The seven current redirect sources are:

1. `/blog/penny-stocks-trading-2026-high-risk-strategies-for-small-caps-2026` -> `/blog/penny-stock-trading-guide`
2. `/blog/how-to-analyze-a-company-a-beginners-guide-to-stock-research-2026` -> `/blog/how-to-analyze-a-stock-fundamental-analysis`
3. `/blog/best-settings-for-airdrops-to-maximize-profits` -> `/blog/crypto-airdrops-2026-definitive-guide-to-free-tokens-2026`
4. `/blog/iron-condor-strategy-guide-maximizing-profits-in-neutral-markets-2026` -> `/blog/iron-condor-explained-a-complete-guide-to-neutral-market-options-trading-2026`
5. `/blog/how-to-trade-options-beginners` -> `/blog/options-trading-for-beginners`
6. `/blog/calls-puts-basic-options-strategies` -> `/blog/options-trading-for-beginners`
7. `/blog/stop-loss-mastery-how-to-set-the-perfect-stop-loss-on-every-trade-in-2026-2026` -> `/blog/the-art-of-stop-loss-how-to-set-protective-stops-like-a-pro-2026`

## 4. Fresh production coverage checks

Production sitemap check on 2026-08-22:

- all 180 active owner URLs are present in the production sitemap;
- 0 active owner URLs are missing from the sitemap;
- all 7 redirect source URLs are absent from the sitemap.

A batch HTTP check was then run across the 187 long URLs and their numeric legacy paths.

Some concurrent requests temporarily returned Cloudflare HTTP 503. Sequential retries showed these were transient request-rate/runtime responses rather than a reproducible page-specific canonical defect. Examples such as the TradingView Built-in Indicators Learning Map, Replay Speed and Futures Demo owner returned 200 on subsequent checks.

One persistent omission was confirmed: 24 newer numeric legacy paths returned HTTP 404 and had no explicit entry in `src/config/chartmini-blog-redirects.json`.

## 5. Gap 1 — 24 missing numeric legacy redirects

Confirmed missing numeric redirects before repair:

1. `/blog/2026060502` -> `/blog/simple-moving-average-sma-tradingview-indicator-tutorial`
2. `/blog/2026060601` -> `/blog/paper-trading-simulator-without-login`
3. `/blog/2026060701` -> `/blog/bar-replay-explained-candle-by-candle-chart-reading-practice-2026`
4. `/blog/2026060801` -> `/blog/how-to-start-learning-trading-without-risking-real-money`
5. `/blog/2026060802` -> `/blog/vwma-tradingview-volume-weighted-moving-average-tutorial`
6. `/blog/2026060902` -> `/blog/stock-market-simulator-free-practice-before-buying`
7. `/blog/2026061001` -> `/blog/forex-simulator-free-replay-eurusd-gbpusd-usdjpy-charts`
8. `/blog/2026061102` -> `/blog/kaufman-adaptive-moving-average-kama-tradingview-tutorial`
9. `/blog/2026061201` -> `/blog/chart-replay-tool-train-pattern-recognition`
10. `/blog/2026061203` -> `/blog/double-exponential-moving-average-dema-tradingview-tutorial`
11. `/blog/2026061301` -> `/blog/demo-account-vs-paper-trading-vs-chart-replay`
12. `/blog/2026061401` -> `/blog/10-bar-replay-drill-better-entries`
13. `/blog/2026063001` -> `/blog/heikin-ashi-vs-candlestick-charts`
14. `/blog/2026070101` -> `/blog/adx-indicator-explained`
15. `/blog/2026070201` -> `/blog/stop-loss-vs-stop-limit-order`
16. `/blog/2026070301` -> `/blog/breakout-trading-practice-simulator`
17. `/blog/2026070401` -> `/blog/trailing-stop-order-explained`
18. `/blog/2026070501` -> `/blog/volume-profile-strategy-backtest-chart-replay`
19. `/blog/2026070701` -> `/blog/best-free-paper-trading-apps`
20. `/blog/2026070801` -> `/blog/how-many-trading-days-in-a-year-2026`
21. `/blog/2026070901` -> `/blog/support-and-resistance-practice-draw-levels-candle-by-candle`
22. `/blog/2026071301` -> `/blog/does-robinhood-have-paper-trading`
23. `/blog/2026071801` -> `/blog/chartmini-free-5-minute-day-trading-simulator-launch`
24. `/blog/2026072401` -> `/blog/does-tastytrade-have-paper-trading`

All 24 were added to `src/config/chartmini-blog-redirects.json` as permanent direct-to-final redirects.

No slug or canonical owner was changed.

## 6. Gap 2 — indexable body links pointing through redirects

A sitewide body-link audit across all 402 Markdown articles found 60 effective links from non-redirecting/indexable source articles to configured redirect URLs. Most were old numeric `/blog/YYYYMMDDNN` links.

This violated the current v2 graph rule:

`indexable source -> final canonical owner`

not:

`indexable source -> redirect URL -> owner`

The 60 links occurred across 30 source files. Only link destinations were changed; article meaning, title, slug, canonical, frontmatter date and owner intent were not rewritten.

Files canonicalized:

- `content/blog/2025101401.md`
- `content/blog/2025101601.md`
- `content/blog/2025102001.md`
- `content/blog/2025102801.md`
- `content/blog/2025103001.md`
- `content/blog/2025110901.md`
- `content/blog/2025111101.md`
- `content/blog/2025111701.md`
- `content/blog/2025111901.md`
- `content/blog/2025112501.md`
- `content/blog/2025120101.md`
- `content/blog/2025121701.md`
- `content/blog/2025122902.md`
- `content/blog/2026010401.md`
- `content/blog/2026010402.md`
- `content/blog/2026010903.md`
- `content/blog/2026011001.md`
- `content/blog/2026011002.md`
- `content/blog/2026011004.md`
- `content/blog/2026011103.md`
- `content/blog/2026011402.md`
- `content/blog/2026011801.md`
- `content/blog/2026011802.md`
- `content/blog/2026012201.md`
- `content/blog/2026012401.md`
- `content/blog/2026012502.md`
- `content/blog/2026012602.md`
- `content/blog/2026012801.md`
- `content/blog/2026020302.md`
- `content/blog/2026060702.md`

Post-repair sitewide result:

`effective indexable body links to configured redirect sources = 0`

The seven redirect-source Markdown files still contain old self-referential URLs inside dormant legacy JSON-LD/body source text. Because those files themselves redirect and are not effective indexable sources, they were not rewritten solely for dead-source cleanup.

## 7. Final 187 integrity audit

Post-repair final local audit:

- primary target count: 187;
- active owners: 180;
- redirect sources: 7;
- unique final owner paths: 181;
- target manifest-count issues: 0;
- target numeric redirect mismatches: 0;
- target long redirect mismatches: 0;
- target final-owner manifest issues: 0;
- target redirect-chain issues: 0;
- global duplicate redirect sources: 0;
- global redirect chains: 0;
- effective body links from indexable pages to any configured redirect source: 0;
- total current redirect config entries after repair: 433.

Thus all 187 primary source articles now have an explicit current local disposition and valid final route mapping.

## 8. Scope / non-actions

Task28.6 did not perform blanket SERP re-research or body rewrites for 187 pages. Prior page-level Owner Gates remain authoritative where already freshly established in v2; this task only verifies the full coverage graph and repairs confirmed canonical/redirect/link omissions.

No observation clock is created or reset by link-target canonicalization or numeric redirect repair.

No GSC/Bing metrics were imported from the legacy project. Current GSC/Bing state for this aggregate audit remains `unknown_not_reverified`.

No GSC/IndexNow submission is appropriate for numeric redirect sources.

No commit, push, deployment, R2 sync, GSC submission, Bing submission, or IndexNow submission was performed.

`content/blog/2026030502.md` is part of the 187 universe and was structurally checked, but it had a pre-existing unrelated tracked modification and was intentionally not edited by Task28.6.

## 9. Validation

After redirect and link repairs:

- `pnpm build` PASS
  - 402 blog posts
  - 160 locale marketing assets
  - client build PASS
  - SSR build PASS
- `pnpm check` PASS
  - Biome: 415 files
  - Vitest: 6/6 files, 17/17 tests
- `pnpm seo:v2:workflow:check` PASS
  - 13 required workflow files
  - 402 blog Markdown files
- `git diff --check` PASS
- final custom 187 audit PASS
- global redirect duplicate-source audit PASS: 0
- global redirect-chain audit PASS: 0
- indexable-body-to-redirect audit PASS: 0

## 10. Deployment verification required

After manual deployment, verify the 24 newly added numeric paths return a permanent direct redirect to their final canonical owners. It is not necessary to submit those numeric paths to GSC.

Task28.6 should not reset content-observation windows. Any GSC submission decision for changed canonical content pages remains governed by their originating page-level tasks (for example Task28.1, 28.3, 28.4 and 28.5), not by this aggregate redirect/link cleanup.

Final local status:

`FULL_187_COVERAGE_VERIFIED_GAPS_REPAIRED_PENDING_DEPLOY`
