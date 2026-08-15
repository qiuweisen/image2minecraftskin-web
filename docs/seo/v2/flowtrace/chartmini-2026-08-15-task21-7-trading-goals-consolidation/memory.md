# Task 21.7 — Trading Goals 2026 consolidation and owner rebuild

Date: 2026-08-15
Baseline: ChartMini v2
Requested URL: `/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026`
Requested source: `content/blog/2026010701.md`
Selected owner: `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`
Owner source: `content/blog/2026010301.md`
Decision: `consolidate_to_blueprint_owner + rebuild_owner`
Status: `protected_pending_deploy`

## 1. Authorization

The user explicitly requested Task 21.7 for `/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026` on 2026-08-15. The task was authorized for local v2 SEO/GEO editing and validation only. No push, deploy, R2 sync, GSC, Bing, or IndexNow action was authorized.

## 2. Fresh production preflight

Before Task21.7 deployment, production returned HTTP 200/self-canonical for all three overlapping goal-setting pages:

1. `/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026`
2. `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`
3. `/blog/trading-resolutions-for-2026-goals-that-actually-work-2026`

All three were present in the production sitemap.

Numeric production behavior before this task:

- `/blog/2026010701` -> 301 -> requested Task21.7 URL.
- `/blog/2026010102` -> 301 -> Trading Resolutions URL.
- `/blog/2026010301` -> 301 -> Trading Blueprint URL.

This meant production had three live/self-canonical/sitemap-visible pages covering the same broad beginner trading-goal intent.

## 3. Current-v2 data gate

Current data access probe on 2026-08-15:

- `claude-seo`: unavailable.
- `BING_WEBMASTER_API_KEY`: absent.
- `INDEXNOW_KEY`: absent.
- GSC: `unknown_not_reverified`.
- Bing: `unknown_not_reverified`.

No historical GSC/Bing metrics were imported from migrated SEO files or the old project.

## 4. Fresh SERP / source evidence

Fresh web research was run for trading-goal and beginner trading-plan intent.

### Search-intent direction

The fresh SERP for `how to set trading goals 2026 beginner` strongly emphasized:

- process goals vs outcome/profit goals;
- identifying a specific weakness;
- measurable/SMART goals;
- risk/process/journal habits;
- periodic review and adjustment.

A current BabyPips result used essentially the exact requested Task21.7 title, `How to Set Trading Goals for 2026: A Beginner's Guide`, and covered the same process-vs-outcome/quarterly-goal framework. The old ChartMini target also explicitly referenced BabyPips in the body. Keeping a separate near-identical ChartMini page would add little unique owner value.

Fresh ChartMini web search surfaced the existing `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026` page, while comparable searches did not surface the requested target or Trading Resolutions page. This is search-visible evidence in favor of the Blueprint URL, not a substitute for unavailable GSC metrics.

### Primary-source evidence

CME Group — `Your Trade Plan Objective`:
`https://www.cmegroup.com/education/courses/building-a-trade-plan/your-trade-plan-objective`

Useful current/stable points:

- define what the trader wants to accomplish;
- assess strengths, weaknesses, time and risk attitude;
- make goals specific and measurable;
- attach a timeframe;
- SMART is a useful planning framework.

Fidelity — `What is a trading plan?`, updated 2025-10-29:
`https://www.fidelity.com/learning-center/smart-money/trading-plan`

Useful points:

- trading objectives belong inside a broader trading plan;
- risk tolerance/liquidity/entry/exit planning remain separate operating components;
- plans should not be changed as knee-jerk reactions to temporary market moves.

Fidelity beginner trading education also currently centers goal-oriented trading around creating/managing a trading plan rather than profit promises.

## 5. Cannibalization / site-graph review

Three live pages competed for the same broad intent:

### A. Requested target

`/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026`

Source: `content/blog/2026010701.md`

Pre-edit issues:

- no current canonical body inlinks from other routable pages;
- one numeric body reference from the Trading Resolutions duplicate;
- manual Article JSON-LD;
- generated/generic description;
- direct overlap with the BabyPips exact-title SERP result;
- universal `1%`, `3%`, max-three-trades, fixed 15/30/60-minute cooling periods, fixed learning hours, fixed 90-day program, fixed demo/profit-duration requirements and automatic scale-up rules;
- unsupported deterministic claims such as profits following from process goals.

### B. Trading Resolutions duplicate

`/blog/trading-resolutions-for-2026-goals-that-actually-work-2026`

Source: `content/blog/2026010102.md`

Pre-edit issues:

- no current canonical body inlinks;
- one numeric inbound reference;
- substantial overlap with process-vs-outcome goals, SMART goals, risk goals, journaling and annual review;
- universal risk/drawdown/cooling-period/sample-size prescriptions;
- broad overlap with the trading-plan owner.

### C. Trading Blueprint

`/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`

Source: `content/blog/2026010301.md`

Pre-edit signals:

- current search visibility in fresh ChartMini web search;
- two numeric body inlinks before canonicalization;
- already carried updated author/date presentation in current search result;
- cleaner position for a single broad owner that can absorb beginner goal setting, process/outcome distinction and review-system intent.

Pre-edit weaknesses still required a rebuild: universal compliance percentages, fixed review times, fixed position-risk percentages, fixed profitable-month scaling rules, arbitrary trade-sample counts and blurred boundaries with trading-plan/journal/year-end review owners.

## 6. Owner Gate

Decision: `consolidate_to_blueprint_owner + rebuild_owner`.

Selected owner:

`/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`

Intent key:

`trading_goals_beginner_process_review`

Owner boundary:

- how beginners define trading goals;
- process vs outcome goals;
- SMART/measurable goal construction;
- selecting goals from observable weaknesses;
- defining evidence and review points;
- setting a review cadence appropriate to the question;
- missed-goal diagnosis;
- mid-year/2026 reset workflow;
- connecting goals to journal/replay evidence.

Neighbor boundaries:

- `/blog/how-to-build-trading-plan` owns the full trading operating plan: markets, setup rules, entries/exits, sizing, risk and management.
- `/blog/how-to-keep-trading-journal` owns sustainable journal logging/maintenance.
- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026` owns broad journal fields/metrics/replay.
- `/blog/trading-journal-review-system-2026` owns periodic aggregate journal review.
- `/blog/year-end-trading-review-how-to-analyze-and-improve-your-trading-performance-2026` owns annual performance review; it now hands next-year goal setting to this owner.
- `/blog/risk-management-position-sizing-guide` owns risk architecture and position-size rules.

## 7. Changes made

### Owner rebuild

Rebuilt `content/blog/2026010301.md`.

New title:

`How to Set Trading Goals for 2026: A Beginner Trading Blueprint`

New meta title:

`Trading Goals 2026: Beginner Process & Review Blueprint`

`dateModified: 2026-08-15`

Final body: approximately 3,234 words.

Major changes:

- direct answer within first 150 words;
- explicit process-vs-outcome distinction without claiming outcome goals are inherently invalid;
- SMART framing attributed to CME;
- clear trading-goal vs trading-plan vs journal vs performance-review table;
- behavior + evidence + review point + decision rule framework;
- no universal risk percentage, compliance percentage, fixed number of trades, fixed cooling-off period or scale-up rule;
- mid-year 2026 reset section rather than assuming work starts January 1;
- ChartMini framed only as historical decision/replay practice, not a financial-goal/risk advisor;
- FAQ and source/verification notes;
- no manual Article/BlogPosting/FAQ JSON-LD.

### Requested target consolidation

`content/blog/2026010701.md` now contains:

`redirectTo: /blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`

### Additional resolutions duplicate consolidation

`content/blog/2026010102.md` now contains the same `redirectTo` owner.

### Redirect config

Direct permanent redirects now point to the selected owner:

- `/blog/2026010701`
- `/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026`
- `/blog/2026010102`
- `/blog/trading-resolutions-for-2026-goals-that-actually-work-2026`
- `/blog/2026010301`

No redirect chain is required.

### Internal linking

Established three body-level canonical inlinks from routable pages:

1. `content/blog/2026010302.md` — Execution Gap related reading; numeric Blueprint link converted to canonical.
2. `content/blog/2026031302.md` — Trading Plan related guide.
3. `content/blog/2025122301.md` — Year-End Review Step 8 hands next-year goal setting to the Goal Blueprint owner.

No routable page retains a body link to either duplicate long slug or their numeric paths.

Owner internal destinations validated as routable:

- `/blog/how-to-build-trading-plan`
- `/blog/how-to-keep-trading-journal`
- `/blog/pre-trade-checklist`
- `/blog/risk-management-position-sizing-guide`
- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
- `/blog/trading-journal-review-system-2026`
- `/blog/year-end-trading-review-how-to-analyze-and-improve-your-trading-performance-2026`

## 8. Generated-manifest / redirect validation

After build:

- requested target manifest entry carries `redirectTo` to Blueprint owner;
- Trading Resolutions manifest entry carries `redirectTo` to Blueprint owner;
- Blueprint owner is routable and has no `redirectTo`;
- routable owner count for the selected slug: 1;
- all seven owner body links are valid/routable;
- global duplicate redirect-source count: 0;
- all new long/numeric redirects are unique and direct.

## 9. Validation

- `pnpm build` — PASS.
- `pnpm check` — PASS.
- Biome — PASS.
- Vitest — 5 test files / 13 tests PASS.
- `pnpm seo:v2:workflow:check` — PASS.
- `git diff --check` — PASS.
- Manifest blog sources — 402.

## 10. Deployment / indexing state

Not performed:

- commit;
- push;
- deployment;
- R2 sync;
- GSC submission;
- Bing/IndexNow submission.

Post-deploy verification should confirm:

1. Blueprint owner returns 200 with new H1/meta/body/dateModified and self-canonical.
2. Blueprint owner is in sitemap.
3. Requested Task21.7 long slug returns direct 301 to Blueprint owner.
4. `/blog/2026010701` returns direct 301 to Blueprint owner.
5. Trading Resolutions long slug returns direct 301 to Blueprint owner.
6. `/blog/2026010102` returns direct 301 to Blueprint owner.
7. `/blog/2026010301` remains direct 301 to Blueprint owner.
8. Both duplicate long slugs are absent from sitemap.
9. Only the Blueprint owner should be considered for GSC Request Indexing; redirect sources should not be submitted.

Final local status: `protected_pending_deploy`.
