# ChartMini Task27 Deployment / GSC Closeout

Date: 2026-08-21
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Branch: `main`
Task status: `DEPLOY_VERIFIED_GSC_RECORDED_OBSERVATION_ACTIVE`

## Scope

Close Task27 after the user manually deployed the previously pushed Task27 changes and manually completed Google Search Console URL Inspection / Request Indexing for the three changed canonical owners.

No article, redirect, schema, internal-link, product, route, or application-code edit is part of this closeout.

## Production verification

Fresh production verification on 2026-08-21 confirms all three changed Task27 canonical owners are live with the rebuilt bodies:

1. `https://chartmini.com/blog/profit-taking-mastery-when-and-how-to-exit-winners-for-maximum-gains-in-2026-2026`
   - HTTP 200
   - exact self-canonical
   - sitemap count 1
   - `dateModified: 2026-08-21`
   - production title: `Profit-Taking Strategies: Targets, Partials & Trailing Exits | ChartMini Blog`
   - `/blog/2026011003` direct HTTP 301 to the canonical

2. `https://chartmini.com/blog/trading-for-a-living`
   - HTTP 200
   - exact self-canonical
   - sitemap count 1
   - `dateModified: 2026-08-21`
   - production title: `Trading for a Living: Full-Time Trading Reality in 2026 | ChartMini Blog`
   - `/blog/2026033101` direct HTTP 301 to the canonical

3. `https://chartmini.com/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`
   - HTTP 200
   - exact self-canonical
   - sitemap count 1
   - `dateModified: 2026-08-21`
   - production title: `Trading Performance Metrics: Expectancy, PF & Drawdown | ChartMini Blog`
   - `/blog/2026011106` direct HTTP 301 to the canonical

No checked numeric redirect chain exists.

## GSC submission state

The user explicitly confirmed on 2026-08-21 that all three recommended Task27 canonical URLs were successfully submitted through manual GSC URL Inspection / Request Indexing:

1. `https://chartmini.com/blog/profit-taking-mastery-when-and-how-to-exit-winners-for-maximum-gains-in-2026-2026`
2. `https://chartmini.com/blog/trading-for-a-living`
3. `https://chartmini.com/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`

This is a per-URL user-confirmed submission set, not a selective or ambiguous batch. Therefore each of the three canonical owners may be recorded as `user_confirmed_gsc_submission_2026-08-21`.

Do not submit:
- `/blog/2026011003`
- `/blog/2026033101`
- `/blog/2026011106`
- Task27.3 Future-of-FOMO redirect sources
- Task27.7 mixed FOMO/emotional redirect sources

Task27.2 Scalping and Task27.5 Trading Patience were not rewritten in this batch and do not receive a new GSC event from this closeout.

Bing/IndexNow: `unknown_not_reverified`.

## Observation windows

Deployment event date for the three rebuilt owners: 2026-08-21.

New read-only observation windows:
- 7-day review: 2026-08-28
- 14-day review: 2026-09-04
- freeze through: 2026-09-04

These dates apply only to:
- Profit-Taking owner
- Trading for a Living owner
- Trading Performance Metrics owner

Existing observation clocks are preserved and not reset:
- Scalping: 2026-08-22 / 2026-08-29, freeze through 2026-08-29
- FOMO: 2026-08-24 / 2026-08-31, freeze through 2026-08-31
- Trading Patience: 2026-08-26 / 2026-09-02, freeze through 2026-09-02
- Broad Psychology: 2026-08-26 / 2026-09-02, freeze through 2026-09-02

## Task27 integrity carried into closeout

Task27.8/27.9 final local integrity remains the governing graph baseline:
- Profit-Taking effective body support: 3
- Scalping: 10
- FOMO: 8
- Trading for a Living: 4
- Trading Patience: 3
- Trading Performance Metrics: 5
- Broad Psychology: 19
- owner outbound Blog links through redirects: 0
- effective/indexable links to Task27 redirect sources: 0
- duplicate redirect sources: 0
- Task27 redirect chains: 0
- manual Article/BlogPosting in checked owners: 0

## Git boundary

Task27 implementation was previously pushed as commit:
`acf7cb0 seo: complete task27 cluster review`

This closeout updates only active v2 Workflow/Flowtrace evidence. `content/blog/2026030502.md` remains unrelated and must not be staged.

## Final state

`DEPLOY_VERIFIED_GSC_RECORDED_OBSERVATION_ACTIVE`
