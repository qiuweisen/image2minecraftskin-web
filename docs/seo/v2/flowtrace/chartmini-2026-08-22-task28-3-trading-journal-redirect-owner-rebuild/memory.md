# Task 28.3 — Trading Journal redirect revalidation + Broad Journal owner repair

Date: 2026-08-22

## Target

- Requested URL: `/blog/trading-journal-guide-track-and-improve-your-trading-performance-2026`
- Requested source: `content/blog/2025122101.md`
- Existing redirect destination / selected owner: `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
- Owner source: `content/blog/2026010904.md`

## Production preflight

Fresh production checks on 2026-08-22:

- Requested long URL: HTTP 301 directly to the Broad Journal owner.
- Numeric `/blog/2025122101`: HTTP 301 directly to the Broad Journal owner.
- Owner: HTTP 200.
- Owner canonical: exact self-canonical.
- Owner H1 before local change: `Trading Journal Guide: Metrics, Review, and Replay`.
- Owner production `dateModified`: `2026-07-06`.
- Owner present in sitemap: yes.
- Requested redirect source present in sitemap: no.
- No chain exists for the requested long/numeric source.

Additional live journal-cluster routing checked:

- `/blog/the-trading-journal-why-elite-traders-never-skip-it-2026` -> direct 301 to Broad Journal.
- `/blog/trading-journal-mastery-how-to-track-analyze-and-improve-your-trading-performance-2026` -> direct 301 to `/blog/trading-journal-review-system-2026`.
- `/blog/top-5-trading-journal-strategies-beginners` -> 200; this is the restored Beginner Journal owner.
- `/blog/trading-journal-review-system-2026` -> 200.
- `/blog/how-to-keep-trading-journal` -> 200.

## GSC / Bing

- Broad Journal was previously user-confirmed indexed during Task20 closeout and was not redundantly submitted.
- No fresh Task28.3 GSC metrics were available: `unknown_not_reverified`.
- Bing current-v2 metrics: `unknown_not_reverified`.
- No legacy metrics were imported.

## Fresh SERP

Fresh 2026-08-22 web search for `trading journal guide`, `track improve trading performance`, and `how to keep a trading journal` shows the dominant intent is still:

- what a trading journal is;
- what fields to record;
- plan vs actual execution;
- process vs outcome;
- screenshots / context / setup labels;
- how to review records;
- simple template / method selection;
- using the journal to identify questions and recurring mistakes.

The current ChartMini Broad Journal owner itself surfaced for this query family. A stale search result also surfaced the old `trading-journal-mastery-how-to-track-analyze-and-improve-your-trading-performance-2026` duplicate, even though production now redirects it to Review System. This is treated as search-index/cache migration lag, not evidence for restoring another 200 owner.

Current search results do not support a durable separate intent for the requested `track-and-improve-your-trading-performance` URL.

## Primary/current sources

Current source review used:

1. CME Group — `Step 5. Keep a Trade Log`
   - Supports recording entry/exit, targets, time, market observations and reasons for a trade.
   - Supports reviewing both successful and unsuccessful trades and using the log to identify patterns/mistakes.
2. Charles Schwab — `Elements of a Smart Trade Plan`
   - Supports comparing completed trades with the original plan and asking what worked, what did not, and what to change.
   - Does not impose a universal journal frequency or performance threshold.
3. CME Group — `Building a Trade Plan`
   - Treats the trader log as one component of the broader trading plan.

No primary source reviewed supports a universal `80% compliance` threshold, a required `30 simulated trades`, a fixed weekly review duration, or a universal number of trades needed to validate a strategy.

## Site graph / cannibalization

### Requested redirect source

- File-level body inlink sources: 0.
- Effective non-redirecting body inlink sources: 0.
- Local source already has `redirectTo` to the Broad Journal owner.

### Broad Journal owner

Pre/post Task28.3 site graph:

- File-level source pages linking to owner: 25.
- Effective non-redirecting source pages: 23.
- Direct body links: 34.
- Owner manifest count after rebuild: 1.

Neighbor owner support observed:

- Trading Performance Metrics: 5 effective sources.
- Trading Journal Review System: 9 effective sources.
- How to Keep a Trading Journal: 29 effective sources.

## Owner-boundary defect found during 7-day review

The Broad Journal owner was in observation from the Task21.8 consolidation, with read-only reviews scheduled for 2026-08-22 and 2026-08-29.

Task28.3 falls on the first scheduled review date. Fresh revalidation found two material defects that meet the workflow exception rule for editing a protected owner:

1. **YMYL / unsupported hard thresholds** in the current owner body:
   - `If your compliance is below 80%...`;
   - `Log 30 simulated trades...`;
   - fixed weekly review duration / cadence language;
   - fixed post-loss action examples presented too broadly.
2. **Intent ownership conflict introduced by later work**:
   - Task27.6 established `/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026` as the dedicated aggregate performance-metrics owner for expectancy, profit factor, realized R, drawdown, Sharpe/Sortino, MAE/MFE, segmentation and sample quality.
   - The old Broad Journal registry/body still claimed detailed expectancy/drawdown/metrics as part of its principal scope.

This is not a freshness rewrite. It is a material factual/YMYL and intent-ownership repair during an already scheduled review.

## Owner Gate

Decision:

`preserve_consolidation_redirect + retain_narrow + rebuild_owner_under_observation_exception`

Rationale:

- Requested source is a zero-inlink generic duplicate and already redirects correctly.
- Broad Journal is the established, indexed, strongly linked owner for the generic journal query family.
- The owner URL should be preserved because it has 23 effective source pages and current SERP recognition.
- The owner body must be narrowed to journal structure, recordkeeping, plan-vs-actual evidence, process-vs-outcome, review workflow, simple templates, and replay-journaling limitations.
- Deep aggregate-statistics interpretation is handed to Trading Performance Metrics.
- Periodic grouped review remains Trading Journal Review System.
- Habit/maintenance remains How to Keep a Trading Journal.
- Beginner first-journal setup remains the Beginner Journal owner.
- Single closed-trade post-mortem remains Post-Trade Review.
- Replay-specific logging remains Simulated Trade Log.

## Actual modifications

### Requested redirect source

No change to `content/blog/2025122101.md`.

Preserved:

`/blog/trading-journal-guide-track-and-improve-your-trading-performance-2026`
-> `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`

Numeric `/blog/2025122101` remains direct to the same final owner.

### Broad Journal owner

Rebuilt `content/blog/2026010904.md`.

New title:

`Trading Journal Guide: What to Record and How to Review It`

New `dateModified`:

`2026-08-22`

Main changes:

- removed manual Article JSON-LD;
- removed FAQ JSON-LD as a rich-result tactic; kept useful visible question-based content only;
- added direct answer and five key takeaways;
- centered the page on journal fields, plan vs actual execution, process vs P&L, data completeness, consistent tagging, review questions, and minimum template design;
- removed universal compliance/trade-count/review-frequency thresholds;
- removed fixed `30 simulated trades` readiness framing;
- removed detailed expectancy/drawdown metric ownership and linked to the dedicated Performance Metrics owner;
- explicitly separated Journal vs Broker Statement vs Trade Log vs Backtest Record;
- added current CME/Schwab sources and limitations;
- preserved ChartMini only as a replay-practice tool and stated live-execution limitations;
- kept neighboring journal intents explicit rather than merging them.

## Internal links after rebuild

Owner body has 11 direct Blog links to valid current manifest owners, including:

- Trading Performance Metrics;
- Beginner Trading Journal;
- How to Keep a Trading Journal;
- Trading Journal Review System;
- Post-Trade Review;
- FOMO;
- Execution Gap;
- Simulated Trade Log.

Validation found:

- missing internal targets: 0;
- outbound links through redirect sources: 0.

No new inbound link was required because Broad Journal already has 23 effective non-redirecting source pages.

## Schema decision

- Manual `Article` / `BlogPosting` in Markdown: 0 after Task28.3.
- No HowTo schema added.
- No FAQ rich-result strategy added.
- v2 route remains the BlogPosting/Breadcrumb structured-data source.

## Validation

Full content-change validation passed:

- `pnpm build` — PASS.
  - Blog manifest: 402 posts.
  - Marketing locale assets: 160.
- `pnpm check` — PASS.
  - Biome: 415 files.
  - Vitest: 6/6 files; 17/17 tests.
- `pnpm seo:v2:workflow:check` — PASS.
- `git diff --check` — PASS.

Post-build integrity:

- Broad Journal manifest count: 1.
- Requested source redirect preserved.
- Numeric redirect preserved.
- Broad Journal effective body support: 23 source pages.
- Owner outbound redirect links: 0.
- Manual Article/BlogPosting schema: 0.

## Deployment / indexing state

- No commit.
- No push.
- No deployment.
- No GSC Request Indexing.
- No Bing / IndexNow submission.

Local result:

`PRESERVE_REDIRECT_REBUILD_BROAD_JOURNAL_OWNER_MATERIAL_DEFECT_EXCEPTION_PENDING_DEPLOY`

Because this is now a genuine owner rebuild rather than a read-only revalidation, after verified deployment create a new 7-day / 14-day observation window from the actual deployment/indexing event. Do not submit the requested redirect source or numeric source.
