# ChartMini v2 SEO Current State

Baseline generation: v2
Initialized: 2026-08-14
Project root: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Branch: `main`
Baseline commit at initialization: `c09560b` (`perf: defer below-fold homepage work`)
ChartMini v2 remote: `chartminiv2/main`
Production domain: `https://chartmini.com`
Staging domain: `https://v2.chartmini.com`

## Current architecture baseline

- v2 contains 402 `content/blog/*.md` source files at initialization.
- Blog metadata is built by `scripts/build-blog-manifest.mjs` into `src/generated/blog-manifest.json`.
- Blog bodies are served through the R2 content pipeline rather than bundled through Content Collections.
- `src/routes/blog/$slug.tsx` generates the current BlogPosting, BreadcrumbList, author Person, canonical metadata, and site-level structured data.
- Existing legacy `Article` JSON-LD in Markdown is not a required v2 schema source and must not be copied forward when rebuilding articles.

## Production baseline

Fresh production verification on 2026-08-14 confirms the current v2-style homepage is live on `chartmini.com`, with the free trading simulator / daily and intraday historical replay positioning. Production is the only indexable deployment baseline. Staging is intentionally isolated by v2 code with `noindex, nofollow, noarchive` and `Disallow: /` behavior.

## Data status

- GSC current-v2 dataset: `unknown_not_reverified`.
- Bing current-v2 dataset: `unknown_not_reverified`; no Bing Webmaster API key was available during initialization.
- Current task SERP: must be collected fresh per task.
- Historical GSC/Bing/SERP exports already under `docs/seo/` are legacy references only.
- No old protection window or old GSC submission event is active in v2 merely because it exists in migrated documentation.

## Protection status

Task20 production deployment is verified. Active observation protections run from 2026-08-15 through the 7-day review on 2026-08-22 and 14-day review on 2026-08-29. Seven canonical URLs received user-confirmed manual GSC Request Indexing; `/blog/bull-market-vs-bear-market` and the broad Journal Guide were already indexed per user and were not redundantly resubmitted.

## Intent ownership baseline

Initial product-route owners are seeded from the current v2 code structure in `intent-ownership-registry.csv`. They are code-level ownership guards; each material SEO task still requires fresh SERP and cannibalization review.

## 2026-08-14 Task 20.1 — Stocktwits platform / social-sentiment recovery

Task 20.1 completed locally for `/blog/stocktwits-social-trading-platform-how-to-use-crowd-wisdom-to-improve-your-trading-decisions-2026` (`content/blog/2026012001.md`). Fresh production preflight found browser/Googlebot HTTP 200, exact canonical, sitemap membership and a direct permanent numeric legacy redirect. Fresh v2 GSC/Bing values remain `unknown_not_reverified`; no legacy metrics were imported.

Fresh SERP plus current Stocktwits Help, Investor.gov and FINRA evidence supports `retain_narrow + rebuild`. The page now owns Stocktwits platform usage, ticker streams, Watchlist/Trending retail attention, Bullish/Bearish sentiment interpretation and social-information verification. Copy Trading remains a separate automated-replication owner. The old crowd-wisdom/contrarian-threshold framing, mixed-language corruption, unsupported user-rating claims, fabricated examples and manual Article schema were removed.

Target now has 6 scoped internal destinations and 1 direct Markdown inbound from the Copy Trading article's social-trading definition. Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `git diff --check`, and `pnpm seo:v2:workflow:check`. Status: `protected_pending_deploy`; no push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-14-task20-1-stocktwits-recovery/memory.md`.

## 2026-08-14 Task 20.2 — Prop trading firms / funded accounts

Task 20.2 completed locally for `/blog/prop-trading-firms-funded-accounts` (`content/blog/2026031202.md`). Fresh production preflight found HTTP 200, exact self-canonical and sitemap membership. Fresh current-v2 GSC/Bing access remained unavailable (`claude-seo` unavailable; Bing/IndexNow keys absent), so metrics remain `unknown_not_reverified` and no legacy values were imported.

Fresh SERP and primary-source review supports a long-form educational owner explaining funded-account mechanics rather than a volatile "best prop firms" ranking. FTMO currently documents a simulated funded-account model, while Topstep currently documents a simulated Trading Combine and Express Funded Account followed by a possible Live Funded Account. The target was rebuilt around these account-model distinctions, evaluation/drawdown/consistency/payout rules, due diligence and simulation-first challenge preparation.

A live cannibalization conflict was found at `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026` (`content/blog/2026013102.md`): before Task20.2 it was HTTP 200, self-canonical and in the sitemap, covering the same intent. Owner Gate selected `/blog/prop-trading-firms-funded-accounts` as the single owner because it has the cleaner evergreen slug, six current Markdown inlinks and current search visibility. The duplicate now has `redirectTo` to the owner, and both its long slug and numeric `/blog/2026013102` path are configured for direct permanent redirects to the owner.

Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `pnpm seo:v2:workflow:check`, and `git diff --check`. Generated manifest shows only one routable prop/funded-account owner and no duplicate redirect sources. Status: `protected_pending_deploy`; no push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-14-task20-2-prop-trading-funded-accounts/memory.md`.

## 2026-08-14 Task 20.3 — Drawdown recovery math

Task 20.3 completed locally for `/blog/the-recovery-equation-why-a-50-loss-needs-a-100-gain-to-break-even-and-how-to-survive-drawdowns-2026` (`content/blog/2026011502.md`). Fresh production preflight found HTTP 200, exact canonical and sitemap membership. The current target itself surfaced in fresh web search for drawdown-recovery math. Current-v2 GSC/Bing access remains unavailable, so all related metrics stay `unknown_not_reverified` and no legacy values were imported.

Owner Gate selected `retain_narrow + rebuild`: this URL owns drawdown definition, recovery-gain formula, 50%-loss/100%-gain explanation, break-even tables and constant-compounding recovery-time arithmetic. `/blog/how-to-recover-from-trading-loss` was narrowed to behavioral/psychological recovery and now links back to the math owner. The position-sizing article also links to the math owner for the full formula.

The old target's manual Article/FAQ schema, deterministic 3-6 month recovery language, universal professional drawdown thresholds, unsupported professional-vs-retail generalizations and misleading recovery-time framing were removed. The rebuilt article uses exact arithmetic, explicit assumptions and valid v2 internal links. Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `git diff --check`, and `pnpm seo:v2:workflow:check`. Status: `protected_pending_deploy`; no push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-14-task20-3-drawdown-recovery-math/memory.md`.

## 2026-08-14 Task 20.4 — Finviz Heatmap / Maps

Task 20.4 completed locally for `/blog/finviz-elite-heatmap-market-visualization-made-simple-2026` (`content/blog/2026012301.md`). Fresh production preflight found HTTP 200, exact canonical, sitemap membership and a direct permanent `/blog/2026012301` legacy redirect. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh SERP plus current Finviz Map, FAQ, Elite and 2025–2026 product-update evidence supports `retain_narrow + rebuild`. The URL now owns Finviz Heatmap/Maps reading, tile size/color/grouping, breadth-vs-concentration interpretation, current Map universes, recent Maps changes, and Free-vs-Elite Map capabilities. Generic stock screening/watchlists and sector-rotation strategy remain separate owners.

The old article's Elite-only framing, unsupported edge/sector-flow/reversal claims, stale feature assumptions, manual Article schema and false ChartMini-Finviz automatic integration claim were removed. Three direct Markdown inlinks now use the canonical slug: TrendSpider related reading, OptionStrat related reading, and the Sector Rotation heatmap section. Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `git diff --check`, and `pnpm seo:v2:workflow:check`; target manifest count is 1. Status: `protected_pending_deploy`; no push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-14-task20-4-finviz-heatmap/memory.md`.

## 2026-08-14 Task 20.5 — Post-trade review

Task 20.5 completed locally for `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026` (`content/blog/2026011107.md`). Fresh production preflight found HTTP 200, exact self-canonical, sitemap membership and a direct permanent `/blog/2026011107` legacy redirect. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh SERP plus CME/Schwab trade-log and trade-plan education supports `retain_narrow + rebuild`. The target now owns only the closed-position single-trade post-mortem: preserve the original pre-trade plan, compare planned vs actual entry/size/management/exit, separate process quality from P&L, and produce one lesson/next action. The broad journal guide, periodic journal-review system, performance-metrics page and open-position trade-management page remain separate owners.

The old target's manual Article schema, fabricated trader-profit examples, deterministic improvement claims, universal review-time/compliance mandates, mixed weekly/monthly scope and false ChartMini automatic-coaching claims were removed. Current v2 training-record capability was verified before rewriting product language. Two legacy numeric inlinks were converted to the canonical target, and the broad journal guide now explicitly routes closed-position post-mortem intent to Task20.5. Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `git diff --check`, and `pnpm seo:v2:workflow:check`; target manifest count is 1. Status: `protected_pending_deploy`; no push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-14-task20-5-post-trade-review/memory.md`.

## 2026-08-15 Task 20.6 — Bull market vs bear market regime owner

Task 20.6 started from the requested `/blog/bull-market-vs-bear-market-trading-strategies-for-different-market-conditions-2026` (`content/blog/2025122201.md`). Fresh production preflight found that both this long URL and `/blog/bull-market-vs-bear-market` were HTTP 200, self-canonical and present in the sitemap, creating a live duplicate-intent conflict. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh SERP plus Investor.gov/Fidelity source review and the current v2 internal-link graph supported `consolidate_to_short_owner + rebuild`. The short URL already had 17 direct canonical Markdown inlinks and was explicitly referenced by multiple current articles as the generic bull/bear-market owner; the requested long URL had no canonical-slug inlinks and only two old numeric inlinks. `/blog/bull-market-vs-bear-market` was therefore rebuilt as the evergreen owner for bull/bear definitions, 20% convention nuance, bull/bear/range regime identification, strategy adaptation, trader-vs-investor separation, bearish-product risk boundaries and replay practice.

The requested long source now has `redirectTo` to the short owner. `/blog/2025122201`, the requested long slug and `/blog/2026032701` are all configured as direct permanent redirects to the short owner, with no redirect chain and no duplicate redirect sources. The two remaining `/blog/2025122201` Markdown inlinks were converted to the short canonical. Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `git diff --check`, and `pnpm seo:v2:workflow:check`; the generated manifest has one routable bull/bear owner. Status: `protected_pending_deploy`; no commit, push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task20-6-bull-bear-market/memory.md`.

## 2026-08-15 Task 20.7 — Beginner trading chart reading

Task 20.7 completed locally for `/blog/a-beginners-guide-to-reading-trading-charts-2026` (`content/blog/2025102201.md`). Fresh production preflight found HTTP 200, exact self-canonical, sitemap membership and a direct permanent `/blog/2025102201` legacy redirect. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh SERP plus current Fidelity/Nasdaq/Schwab charting education supports `retain_narrow + rebuild`. This URL now owns the broad beginner first-read sequence for a generic trading chart: instrument/data source, timeframe/bar interval, chart type, axes/scale, OHLC basics, high-level trend/range structure, support/resistance awareness, volume-source context, indicator boundary and hindsight-resistant replay practice. Specialist candlestick mechanics/patterns, market structure, price action, support/resistance methodology, volume methodology and technical-analysis system design remain separate owners.

The old target's manual Article schema, weak generated description, rigid timeframe mappings, overbroad volume-confirmation language and shallow treatment of chart settings/context were removed. The target now links only to current v2 specialist owners; all internal slugs were manifest-validated. Two scoped canonical inlinks were added from the single-candlestick beginner guide and the technical-analysis framework. Validation passed: `pnpm build`, `pnpm check` (Vitest 3/3), `git diff --check`, and `pnpm seo:v2:workflow:check`; target manifest count is 1. Status: `protected_pending_deploy`; no commit, push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task20-7-reading-trading-charts/memory.md`.

## 2026-08-15 Task 20.8 — Cluster intent, internal links, and cannibalization review

Task 20.8 revalidated the seven Task20 owner boundaries using fresh current SERP direction plus the v2 internal-link graph. All seven canonical owners remain distinct. Body-level inbound coverage is now at least three for every Task20 owner: Stocktwits 3, Prop Funded 5, Recovery Math 5, Finviz 3, Post-Trade Review 7, Bull/Bear 19, and Beginner Chart Reading 3.

Two live duplicate-intent pages were consolidated locally. `/blog/trading-journal-secrets-how-to-review-your-trades-for-maximum-improvement-2026` now redirects to the broad Journal Guide owner, and `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026` now redirects to `/blog/how-to-recover-from-trading-loss`. Their numeric legacy paths also point directly to the selected owner. Remaining body links to those duplicate URLs were removed.

The behavioral recovery owner (`content/blog/2026033102.md`) was rebuilt because it still contained universal recovery thresholds and fixed pause/position-size instructions. Those were removed so behavioral recovery is cleanly separated from Task20.3's exact recovery mathematics and from broader risk management. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task20-8-cluster-review/memory.md`.

## 2026-08-15 Task 20.9 — Final validation and Workflow sync

Final local pre-deployment validation passed after Task20.8 cleanup: `pnpm build` PASS, `pnpm check` PASS with Vitest 3/3, `pnpm seo:v2:workflow:check` PASS, and `git diff --check` PASS. The generated manifest has 402 posts, all selected Task20 owners are routable, all four consolidated long duplicates carry `redirectTo`, Task20 redirect sources are unique/direct, and principal Task20 owner files have no missing or redirecting `/blog/...` links.

The pre-deployment result was `PASS_PENDING_DEPLOYMENT_VERIFICATION`. Deployment was subsequently verified on production during Task20 closeout; all selected owners are live and the checked duplicate/numeric sources return direct 301 redirects. GSC submission state is now recorded separately in `gsc-submission-log.md`. Bing/IndexNow remain unavailable because the environment has no current keys. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task20-9-final-validation/memory.md`.

## 2026-08-15 Task20 deployment / GSC closeout

Production verification after deployment confirmed all nine final Task20 owners return HTTP 200 with self-canonical URLs and are present in the production sitemap. The four consolidated long-slug duplicates and their checked numeric legacy sources return direct 301 redirects to the selected owners; no redirect chain was observed.

The user confirmed successful manual GSC Request Indexing for seven canonical URLs: Stocktwits, Prop Trading/Funded Accounts, Drawdown Recovery Math, Finviz Heatmap, Post-Trade Review, Beginner Trading Charts, and Behavioral Trading-Loss Recovery. The user reported `/blog/bull-market-vs-bear-market` and `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026` were already indexed, so they were not resubmitted. Redirecting duplicates were not submitted.

Observation dates are fixed to 2026-08-22 (7 days) and 2026-08-29 (14 days). During this window, these owners should remain unchanged unless there is a hard technical defect, material factual error, or explicit user override. Bing/IndexNow remain `unknown_not_reverified` because current keys are unavailable.

## 2026-08-15 Task 21.1 — Scalping beginner-guide consolidation

Task 21.1 started from `/blog/beginners-guide-to-scalping-start-here` and found three live/search-visible broad scalping pages competing for the same beginner definition/strategy/risk intent. Current-v2 GSC/Bing performance data remains unavailable (`unknown_not_reverified`). Fresh SERP direction emphasizes what scalping is, costs, liquidity/execution, risk, beginner suitability, and testable setup structure rather than guaranteed settings or profit targets.

The v2 site graph strongly favored `/blog/scalping-strategies-guide`: 12 current body-level canonical inlinks already point to that URL, while the requested target and `/blog/scalping-small-price-moves-beginner-guide` had no external canonical body inlinks. Owner Gate decision: `consolidate_redirect + rebuild_owner`.

`content/blog/2026041502.md` was rebuilt as the single broad scalping owner, with current 2026 FINRA intraday-margin transition context, transaction-friction/expectancy math, setup-study workflow, market-specific limits, and accurate ChartMini replay boundaries. Both weaker duplicate sources now carry `redirectTo` to the owner; numeric and long-slug redirect config entries point directly to the owner. Generated manifest has one routable broad scalping owner. Validation passed: `pnpm build`, `pnpm check` (Vitest 9/9), `pnpm seo:v2:workflow:check`, and `git diff --check`. Status: `protected_pending_deploy`. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-1-scalping-consolidation/memory.md`.

## 2026-08-15 Task 21.2 — Correlation Analysis

Task 21.2 completed locally for `/blog/correlation-analysis-mastery-how-to-use-market-relationships-to-reduce-risk-2026` (`content/blog/2026011102.md`). Fresh production preflight found HTTP 200, exact self-canonical, sitemap membership, and a direct `/blog/2026011102` legacy redirect. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh primary-source/SERP review plus the current v2 content graph supports `retain_narrow + rebuild`. This URL now owns general trading correlation: Pearson correlation on aligned returns, data/timestamp controls, rolling/regime relationships, correlation vs causation/beta/cointegration, hedge interpretation, intermarket/relative-value context, and pair-screening limitations. `/blog/portfolio-correlation-why-your-diversification-might-be-failing-2026` remains the portfolio matrix/covariance/weights/stress-diversification owner; `/blog/combining-gbpusd-and-audusd-for-better-results` remains the specific shared-USD FX relationship owner.

The old target's manual Article schema, arbitrary correlation thresholds, unsupported historical/current pair coefficients, automatic hedge claims, universal crisis-correlation claims, pair-trade mean-reversion assumptions, fixed correlation position-size formula, and false ChartMini live-correlation capabilities were removed. Two numeric inbound links were converted to the canonical slug. Validation passed: `pnpm build`, `pnpm check` (Vitest 9/9), `git diff --check`, and `pnpm seo:v2:workflow:check`; target manifest count is 1 and all target internal blog links are valid/routable. Status: `protected_pending_deploy`; no commit, push, deploy, R2 sync, GSC or Bing submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-2-correlation-analysis/memory.md`.

## 2026-08-15 Task 21.3 — Holiday Trading / Santa Seasonality

Task 21.3 completed locally for `/blog/holiday-trading-market-patterns-and-strategies-for-the-christmas-season-2026` (`content/blog/2025122401.md`). Fresh production preflight found HTTP 200, exact self-canonical, sitemap membership, and a direct `/blog/2025122401` legacy redirect. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh current NYSE schedule/SERP/seasonality review supports `retain_narrow + rebuild`. This URL now owns Christmas/New Year U.S. equity holiday-trading conditions, the classic last-five-December-plus-first-two-January Santa Claus Rally definition, the exact 2026-2027 seven-session window, historical-seasonality limitations, execution/liquidity/event-risk context, and a reproducible testing workflow. Annual trading hours/holiday calendars, annual trading-day count, year-end trader review, portfolio rebalancing, and generic volume methodology remain separate owners.

The old target's manual Article schema, garbled description, fixed 50–70% holiday-volume claim, deterministic tax/window-dressing stories, failed-Santa forecasting implication, and weak strategy-testing boundary were removed. The target now includes official 2026 Christmas Eve/Christmas Day schedule facts, the recent failed 2025-2026 Santa period as a counterexample to deterministic seasonality, five validated specialist internal links, and four body-level canonical inlinks. Validation passed: `pnpm build`, `pnpm check` (Vitest 13/13 across 5 files), `git diff --check`, and `pnpm seo:v2:workflow:check`; target manifest count is 1. Status: `protected_pending_deploy`; no commit, push, deploy, R2 sync, GSC, Bing, or IndexNow submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-3-holiday-trading/memory.md`.

## 2026-08-15 Task 21.4 — How to Keep a Trading Journal

Task 21.4 completed locally for `/blog/how-to-keep-trading-journal` (`content/blog/2026031102.md`). Fresh production preflight found the target live and search-visible, with `/blog/2026031102` already redirecting directly to it. Current-v2 GSC/Bing access remains unavailable, so metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh SERP plus CME/Schwab record-keeping guidance supports `retain_narrow + consolidate_habit_duplicate`. Task21.4 now owns the sustainable journal-maintenance process: freeze the pre-trade plan, record actual execution, keep a minimum viable record, attach logging to trading events, preserve screenshots/data integrity, separate strategy versions and simulation/live records, recover from missed entries, and hand off aggregated analysis to the periodic-review owner. The Task20 broad Journal Guide remains the template/metrics/replay owner; Task20.5 remains single-trade post-mortem; `/blog/trading-journal-review-system-2026` remains weekly/monthly/quarterly review.

The weak duplicate `/blog/the-trading-journal-your-most-powerful-trading-tool-2026` (`content/blog/2026010202.md`) now carries `redirectTo` to Task21.4. Its long slug and `/blog/2026010202` are configured as direct permanent redirects to the canonical owner, with no redirect chain. Six residual body links to the duplicate/numeric URL were converted to Task21.4 canonical, raising canonical body-inlink files to 23. The old target's manual Article schema, deterministic sample-size thresholds, fabricated percentages/examples, identity-based winners/losers framing, fixed Friday/meditation actions and overbroad ChartMini claims were removed.

Validation passed: `pnpm build`, `pnpm check` (Vitest 13/13 across 5 files), `pnpm seo:v2:workflow:check`, and `git diff --check`; target manifest count is 1, target internal blog links are all routable, duplicate residual body inlinks are 0, and redirect sources are unique/direct. Status: `protected_pending_deploy`; no commit, push, deploy, R2 sync, GSC, Bing, or IndexNow submission. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-4-trading-journal-habit/memory.md`.

## 2026-08-15 Task 21.5 — Trading-loss behavioral recovery revalidation

Task 21.5 explicitly reopened `/blog/how-to-recover-from-trading-loss` during its Task20 observation window. Fresh production preflight confirmed the owner remains live 200/self-canonical/in sitemap, while `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026` and `/blog/2026012901` still redirect directly to it. Current-v2 GSC/Bing access remains unavailable, so performance metrics remain `unknown_not_reverified`.

Fresh 2026 Schwab recovery guidance plus FINRA excessive-trading guidance supported `retain_owner + surgical_refresh`, not another full rewrite. The page now adds an explicit first-triage distinction between planned losses, rule-breaking losses and materially out-of-plan/blowup events; it also covers both aggressive loss-chasing and excessive freezing/risk aversion after losses, plus overtrading friction. Task20.8's no-universal-threshold design, drawdown-math separation and ChartMini capability boundaries were preserved.

Validation passed: `pnpm build`, `pnpm check` (Vitest 13/13 across 5 files), `pnpm seo:v2:workflow:check`, and `git diff --check`; all six target internal blog links are routable and duplicate residual body links remain zero. Because the protected production page changed, the old Task20 observation window is interrupted; status is now `protected_pending_redeploy` and a new observation window must start from the actual redeployment/indexing event. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-5-trading-loss-recovery/memory.md`.

## 2026-08-15 Task 21.6 — Recovery duplicate redirect revalidation

Task 21.6 revalidated `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026` (`content/blog/2026012901.md`) after Task21.5 refreshed the canonical behavioral-recovery owner. The requested URL remains a duplicate and was not restored as an indexable page.

Production checks confirm the long duplicate and `/blog/2026012901` both return direct 301 redirects to `/blog/how-to-recover-from-trading-loss`; the owner returns 200, the production sitemap contains the owner but not the duplicate, and live Markdown body inlinks to the duplicate are zero. Fresh search still surfaces historical cached text for the old duplicate with retired fixed-threshold recovery rules, which strengthens the need for stable signal consolidation rather than a second 200 owner.

Owner Gate result: `preserve_consolidation_redirect`. No article body, slug, `redirectTo`, or redirect-config change was required for Task21.6 because the existing implementation is already correct. The duplicate is now explicitly protected as a redirect source; after the Task21.5 owner refresh is redeployed, only the canonical owner should be rechecked/submitted in GSC. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-6-recovery-duplicate-revalidation/memory.md`.

## 2026-08-15 Task 21.7 — Trading goals / annual blueprint consolidation

Task 21.7 started from `/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026` and found three live/self-canonical/sitemap-visible pages competing for the same broad beginner trading-goals/process-review intent: the requested target, `/blog/trading-resolutions-for-2026-goals-that-actually-work-2026`, and `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`. Current-v2 GSC/Bing access remains unavailable, so performance metrics stay `unknown_not_reverified` and no legacy values were imported.

Fresh SERP plus CME/Fidelity goal/trading-plan guidance supported `consolidate_to_blueprint_owner + rebuild_owner`. The Blueprint URL was the only one of the three surfaced in fresh ChartMini web search and is now the single owner for process-vs-outcome trading goals, SMART/measurable goal construction, evidence/review-point design, missed-goal diagnosis and mid-year/annual reset. Full trading-plan mechanics, risk architecture, journal maintenance/metrics and year-end performance review remain separate owners.

`content/blog/2026010301.md` was rebuilt to ~3,234 words without universal risk percentages, compliance thresholds, fixed sample sizes, fixed cooling periods or automatic scale-up rules. `content/blog/2026010701.md` and `content/blog/2026010102.md` now carry `redirectTo` to the Blueprint owner; their long and numeric redirect config entries point directly to the owner. Three routable body-level canonical inlinks now support the owner. Validation passed: `pnpm build`, `pnpm check` (Vitest 13/13 across 5 files), `pnpm seo:v2:workflow:check`, `git diff --check`, manifest owner count 1, seven owner internal links all routable, and global duplicate redirect-source count 0. Status: `protected_pending_deploy`. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-7-trading-goals-consolidation/memory.md`.

## 2026-08-15 Task 21.8 — Cluster intent, internal links, and cannibalization review

Task21.8 revalidated the Task21.1–21.7 intent families against fresh current web/SERP direction and the current v2 site graph. Scalping, Correlation, Holiday Trading, Journal Habit, Behavioral Recovery and Trading Goals retained their existing owner boundaries. Principal live body-inlink counts after cleanup are: Scalping 11, Correlation 4, Holiday Trading 4, Journal Habit 22, Behavioral Recovery 4, Trading Goals 3, and Broad Trading Journal 23. Task21-related redirect-source residual links from routable Markdown are zero.

The only material unresolved cannibalization was the generic Trading Journal cluster. Four live generic pages — `/blog/trading-journal-guide-track-and-improve-your-trading-performance-2026`, `/blog/the-trading-journal-why-elite-traders-never-skip-it-2026`, `/blog/trading-journal-mastery-how-to-track-analyze-and-improve-your-trading-performance-2026`, and `/blog/top-5-trading-journal-strategies-beginners` — now carry `redirectTo` to the established broad Journal owner `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`. Their numeric and long-slug redirects are configured direct to the owner, and live inbound links were canonicalized. Habit, periodic review, single-trade review, forex-specific journal template, and simulated-trade-log intents remain separate. Result: `PASS_WITH_FOUR_JOURNAL_CONSOLIDATIONS`. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task21-8-cluster-review/memory.md`.

## 2026-08-15 Task 21.9 — Final validation and Workflow sync

Task21.9 final local validation is complete. `pnpm build` PASS with 402 blog posts, `pnpm check` PASS with 5 test files / 13 tests, `pnpm seo:v2:workflow:check` PASS, and `git diff --check` PASS. Generated manifest/redirect validation shows the selected Task21 owners remain routable, all Task21 consolidation sources carry `redirectTo`, Task21-related routable-body links to redirect sources are zero, and global duplicate redirect-source definitions are zero. Redirected posts are excluded from sitemap generation because `isIndexablePost` requires `!post.redirectTo`.

Production is still pre-Task21 deployment: most Task21.1/21.4/21.7/21.8 duplicate pages still return 200 online, while the previously deployed recovery duplicate already returns 301. Final status is therefore `PASS_PENDING_DEPLOYMENT_VERIFICATION`; no Task21 redirect is claimed live until deployment and production recheck. Workflow files and Task21.8/21.9 Flowtrace are synchronized. No commit, push, deploy, R2 sync, GSC, Bing, or IndexNow action was performed.

## 2026-08-15 Task 21 deployment / GSC closeout

The Task21 article/code batch was committed and pushed to `chartminiv2/main` at `f3629380ada9a88720ebf0755f7296fb4430c52b` (`sync: publish blog and simulator updates`), and the user confirmed production deployment completed.

Fresh production verification after deployment confirmed all seven selected Task21 owners return HTTP 200 with self-canonical URLs and are present in the production sitemap. The rebuilt owners expose the expected current titles/H1/body content; the six Task21 owners whose body was modified report `dateModified: 2026-08-15`. Production also confirms every checked Task21 long-slug and numeric consolidation source returns a direct 301 to its selected owner, including both scalping duplicates, the Journal Habit duplicate, both Trading Goals duplicates, the recovery duplicate, and all four generic Journal duplicates added in Task21.8. No checked redirect chain remains, and the redirect sources are absent from the sitemap.

The user confirmed manual GSC Request Indexing on 2026-08-15 for three previously unindexed Task21 owners: Correlation Analysis, Holiday Trading, and How to Keep a Trading Journal. The user reported Scalping, Behavioral Recovery, Trading Goals Blueprint, and the Broad Journal owner were already indexed, so they were not redundantly resubmitted. Redirect sources were intentionally not submitted.

Task21 production observation dates are now 2026-08-22 (7 days) and 2026-08-29 (14 days). The Broad Journal owner keeps the same Task20 observation window because Task21.8 changed only redirects/internal links, not its article body. Bing/IndexNow remain `unknown_not_reverified`.

Task21 closeout status: `DEPLOY_VERIFIED_GSC_RECORDED_OBSERVATION_ACTIVE`.

## Validation baseline

Initialization validation on 2026-08-14:

- `pnpm seo:v2:workflow:check` — PASS; 13 required workflow files found and 402 blog Markdown sources detected.
- `pnpm check` — PASS after excluding migrated `docs/seo` evidence files from Biome code formatting/linting; Vitest 3/3 passed.
- `git diff --check` — PASS.
- `content/blog/` — no modified files.

The `docs/seo` Biome exclusion prevents historical JSON/MJS evidence from breaking v2 code checks. Active workflow integrity is checked separately by `pnpm seo:v2:workflow:check`.

## Execution boundary

Initialization does not change any article body, slug, canonical, product route, or site UI. It only establishes v2 governance files and validation rules.
