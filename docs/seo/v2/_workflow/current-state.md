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

Active local protections pending deployment now exist for Tasks 20.1 through 20.8, including the behavioral-recovery and broad-journal neighboring owners changed by the cluster review. Real 7-day/14-day observation dates must be created from the actual deployment/indexing event, not from the local edit date and not from legacy state.

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

Fresh production checks still return 200 for the newly consolidated duplicate URLs because no deployment has occurred. GSC remains `unknown_not_reverified`; `claude-seo` is unavailable. Bing/IndexNow remain unavailable because the environment has no current keys. No old-project data was substituted. Status: `PASS_PENDING_DEPLOYMENT_VERIFICATION`. Evidence: `docs/seo/v2/flowtrace/chartmini-2026-08-15-task20-9-final-validation/memory.md`.

## Validation baseline

Initialization validation on 2026-08-14:

- `pnpm seo:v2:workflow:check` — PASS; 13 required workflow files found and 402 blog Markdown sources detected.
- `pnpm check` — PASS after excluding migrated `docs/seo` evidence files from Biome code formatting/linting; Vitest 3/3 passed.
- `git diff --check` — PASS.
- `content/blog/` — no modified files.

The `docs/seo` Biome exclusion prevents historical JSON/MJS evidence from breaking v2 code checks. Active workflow integrity is checked separately by `pnpm seo:v2:workflow:check`.

## Execution boundary

Initialization does not change any article body, slug, canonical, product route, or site UI. It only establishes v2 governance files and validation rules.
