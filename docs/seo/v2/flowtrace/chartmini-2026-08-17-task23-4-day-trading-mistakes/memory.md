# Task 23.4 — Day Trading Mistakes Owner Rebuild

Date: 2026-08-17
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Target URL: `/blog/the-5-deadly-day-trading-mistakes-that-will-blow-up-your-account-in-2026-2026`
Source: `content/blog/2026010703.md`

## Final result

`RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`

Owner Gate: `retain_narrow + rebuild`

The requested URL remains the dedicated Day Trading mistakes/process-failure owner. It was not consolidated into the broad beginner mistakes page because fresh search and the current ChartMini information architecture support a narrower intraday-error intent.

## Preflight

### Production state before edit

Fresh production verification on 2026-08-17:

- Target long slug: HTTP 200.
- Exact self-canonical present.
- Target present in sitemap.
- `/blog/2026010703`: direct HTTP 301 to the target long slug.
- Production still exposed the old title/dateModified before this local rebuild.

Nearby current production owners checked:

- `/blog/common-trading-mistakes-beginners` — 200, sitemap; broad cross-style beginner mistakes.
- `/blog/how-to-start-day-trading` — 200, sitemap; beginner roadmap.
- `/blog/risk-management-position-sizing-guide` — 200, sitemap; broad risk architecture.
- `/blog/trading-psychology-master-emotions` — 200, sitemap; broad emotional-execution framework.
- `/blog/how-to-recover-from-trading-loss` — 200, sitemap; post-loss / loss-chasing recovery.

### Current GSC / Bing data

- GSC performance/index state for this exact target: `unknown_not_reverified`.
- Bing performance/index state: `unknown_not_reverified`.
- No legacy GSC/Bing values were imported.

### Fresh SERP / intent evidence

Fresh search on 2026-08-17 for ChartMini day-trading-mistake queries surfaced the requested target for the dedicated `day trading mistakes` intent.

A separate current ChartMini page exists at `/blog/common-trading-mistakes-beginners`, but it is broader: strategy testing, generic sizing, stop-loss use, revenge trading, FOMO, strategy hopping, trend mistakes, moving stops, and simulation across trading styles. The requested target is narrower and can own errors caused by compressed intraday decision-making and execution.

Fresh non-ChartMini results also show that `day trading mistakes` is a durable list/problem-solution intent rather than merely a subsection of a beginner roadmap.

## Site graph / cannibalization review

Pre-edit body-inlink state:

- requested target: one external Markdown body-inlink file plus its own self-reference in the legacy manual schema;
- `/blog/common-trading-mistakes-beginners`: 6 body-inlink files;
- `/blog/how-to-start-day-trading`: 37 body-inlink files;
- broad Psychology owner: 27 body-inlink files;
- broad Risk owner: 65 body-inlink files;
- Behavioral Recovery owner: 9 body-inlink files.

Owner boundaries established:

### Task23.4 owner

`/blog/the-5-deadly-day-trading-mistakes-that-will-blow-up-your-account-in-2026-2026`

Owns:

- intraday risk expansion after entry;
- unplanned averaging/scale-in versus preplanned scaling;
- revenge/loss-chasing as a change in decision criteria;
- overtrading as declining setup quality / cost-adjusted decision quality, not a universal trade-count threshold;
- stop-order / adverse-fill misunderstanding;
- moving invalidation to avoid realizing a loss;
- rewriting exits while watching fast-moving P&L;
- an intraday mistake scorecard and replay diagnosis workflow.

### Neighbor boundaries

- `/blog/common-trading-mistakes-beginners`: broad cross-style beginner mistakes.
- `/blog/how-to-start-day-trading`: complete beginner roadmap and account/practice progression.
- `/blog/risk-management-position-sizing-guide`: full risk architecture, sizing, leverage, portfolio and drawdown controls.
- `/blog/trading-psychology-master-emotions`: broad fear/greed/overconfidence/emotional execution.
- `/blog/how-to-recover-from-trading-loss`: recovery after prior losses and loss-chasing spirals.
- `/blog/order-types-explained`: market/limit/stop/stop-limit mechanics.
- `/blog/how-to-keep-trading-journal`: ongoing journal structure and review metrics.
- `/blog/day-trading-practice-simulator-replay-session`: structured replay-session mechanics.

No consolidation is justified by current intent evidence.

## Why the old article needed a rebuild

The old article mixed useful concepts with unsupported or overly universal claims, including:

- “mistakes destroy 90% of day traders” without a defensible source;
- Reddit-based “trade smaller or die” framing;
- a universal claim that strategy quality is not the reason for losses;
- fixed 40–60% win-rate framing;
- “never add to losers / only add to winners” as a market law;
- the claim that pyramided positions become “zero risk”;
- unsourced cortisol/cognitive-function claims after each trading loss;
- invented anecdotal loss claims;
- universal 15-minute cooling-off rule;
- universal three-loss / three-trade daily limit;
- fabricated “professional traders take 1–3 trades” comparison;
- fixed commissions/slippage/spread examples presented as general costs;
- hard-stop/hard-target rules presented as universally superior;
- universal 1% maximum risk rule;
- exact-loss promises from stop-based position sizing;
- false ChartMini claim that the product automatically calculates optimal position size and enforces 1% risk;
- duplicate manual `Article` JSON-LD.

These statements created factual-risk, financial-guidance and E-E-A-T problems and overlapped specialist owners.

## Fresh authoritative evidence used

### FINRA — 2026 intraday-margin transition

FINRA's replacement intraday-margin requirements became effective on 2026-06-04. Member firms may transition through 2027-10-20. Therefore the page must not present the former `$25,000` PDT minimum or old fixed buying-power rules as a universal current rule at every broker.

Source:
`https://syndication.finra.org/content/understanding-new-intraday-margin-requirements`

### SEC — day-trading risk

SEC investor material continues to describe day trading as high risk and emphasizes capital, costs, leverage and execution risk rather than promising that specific behavioral rules create profitability.

Source:
`https://www.sec.gov/about/reports-publications/investorpubsdaytipshtm`

### SEC — margin risk

Margin can magnify losses; firms may liquidate securities under account requirements, and losses may exceed the amount initially invested.

Source:
`https://www.sec.gov/about/reports-publications/investorpubsmarginhtm`

### Investor.gov — stop-order execution

A stop order normally becomes a market order once triggered; execution can differ from the stop price. Stop-limit orders add price control but may remain unfilled.

Source:
`https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15`

### Investor.gov — fees and expenses

Fees and expenses reduce returns. The article therefore treats trading frequency as a cost-adjusted strategy/process question rather than imposing a universal maximum number of trades.

Source:
`https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated`

## Actual content changes

`content/blog/2026010703.md` was rebuilt to approximately 3,233 words.

New title:

`5 Day Trading Mistakes That Quietly Damage Your Account in 2026`

Meta title:

`5 Day Trading Mistakes to Avoid in 2026`

`dateModified: 2026-08-17`

The five new process-failure categories are:

1. Expanding risk after the trade is already wrong.
2. Revenge trading after a loss.
3. Overtrading without an opportunity or cost threshold.
4. Treating a stop price as a guaranteed loss limit.
5. Rewriting exit rules while watching P&L.

Each section now distinguishes a durable control from copied universal rules.

Important corrections:

- Planned scale-in is distinguished from reactive loss-avoidance averaging.
- No universal “never average down” rule.
- No universal 15-minute cooling-off timer.
- No universal 3-strike / maximum-3-trades rule.
- No universal 1% risk optimum.
- No exact-loss guarantee from stop orders.
- No claim that fixed targets or trailing stops are universally superior.
- No invented trader-performance anecdotes or unsourced success-rate figures.
- FINRA 2026 transition dates added with explicit broker-verification boundary.
- ChartMini is accurately limited to historical candle replay; it does not simulate live routing, queue priority, exact spreads, commissions, slippage, partial fills or margin liquidation.
- Manual `Article` / `BlogPosting` schema removed; the route remains authoritative.

## Internal-link changes

Existing external body support before Task23.4:

- `content/blog/2026060301.md`

Task23.4 added canonical support from:

- `content/blog/2026071202.md` — Day Trading Reddit review.
- `content/blog/2026071001.md` — structured Day Trading replay session.

Final body-inlink source-file count: 3.

The attempted optional link addition from `content/blog/2026031502.md` was not applied; no change was made to that file.

Target internal Blog links: 8 unique destinations, all validated as existing, routable, non-redirecting owners:

- `/blog/how-to-start-day-trading`
- `/blog/risk-management-position-sizing-guide`
- `/blog/how-to-recover-from-trading-loss`
- `/blog/trading-psychology-master-emotions`
- `/blog/common-trading-mistakes-beginners`
- `/blog/order-types-explained`
- `/blog/how-to-keep-trading-journal`
- `/blog/day-trading-practice-simulator-replay-session`

## Schema / canonical / route integrity

Local manifest after `pnpm build`:

- target `redirectTo`: undefined;
- title: new Task23.4 title;
- `dateModified: 2026-08-17`.

Source audit:

- manual `Article`: false;
- manual `BlogPosting`: false.

Production pre-deploy remains old content until user deployment:

- target self-canonical present;
- `/blog/2026010703` direct 301 to target;
- old production title/dateModified still visible before Task23.4 deployment.

## Validation

After the rebuild and support-link edits:

- `pnpm build` — PASS; 402 posts.
- `pnpm check` — PASS; Biome 414 files; Vitest 5/5 files, 13/13 tests.
- `pnpm seo:v2:workflow:check` — PASS; 13 required workflow files, 402 Blog Markdown sources.
- `git diff --check` — PASS.
- 8/8 target internal Blog destinations resolve to non-redirecting owners.
- manual Article / BlogPosting absent.
- numeric production path remains direct 301 to canonical target.

## Deployment / indexing state

No commit, push, deploy, R2 sync, GSC Request Indexing, Bing or IndexNow action was performed in Task23.4.

Status: `protected_pending_deploy`.

After deployment:

1. verify target returns 200;
2. verify exact self-canonical;
3. verify new title/body/dateModified;
4. verify route-generated BlogPosting and no duplicate manual Article/BlogPosting;
5. verify sitemap inclusion;
6. verify `/blog/2026010703` direct 301;
7. inspect GSC actual index state before deciding whether Request Indexing is needed;
8. establish new 7-day and 14-day observation dates from the actual deployment/indexing event.
