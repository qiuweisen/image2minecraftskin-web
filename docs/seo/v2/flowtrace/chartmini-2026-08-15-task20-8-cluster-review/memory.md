# Task 20.8 — Cluster Intent, Internal Links, and Cannibalization Review

Date: 2026-08-15
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Baseline generation: v2

## Scope

Cluster-wide review of Tasks 20.1–20.7 plus directly competing v2 pages. No old-project GSC/Bing/SERP state was inherited.

## Data gate

- Current v2 GSC: `unknown_not_reverified`; `claude-seo` unavailable.
- Current v2 Bing: `unknown_not_reverified`; `BING_WEBMASTER_API_KEY` absent.
- IndexNow: unavailable; `INDEXNOW_KEY` absent.
- Fresh web/SERP checks were run on 2026-08-15 for the seven intent families.

Fresh directional SERP evidence continued to separate the intent families:

1. Stocktwits queries surface current Stocktwits Help pages for ticker sentiment/feed usage rather than copy-trading execution.
2. Funded-account queries surface educational explainers centered on evaluation rules, simulated/funded account mechanics, drawdown and payouts.
3. Drawdown-recovery queries surface exact recovery arithmetic/formula pages.
4. Finviz heatmap queries surface Finviz Maps/Heatmap product pages and current Elite additions.
5. Post-trade-review queries surface single-trade debrief/checklist pages, distinct from weekly journal review.
6. Bull-vs-bear queries surface market-regime definition/identification content.
7. Beginner chart-reading queries surface chart type/OHLC/timeframe/basic reading workflows.

## Final Task20 owner map

| Intent | Canonical owner | Decision |
|---|---|---|
| Stocktwits platform/social sentiment workflow | `/blog/stocktwits-social-trading-platform-how-to-use-crowd-wisdom-to-improve-your-trading-decisions-2026` | retain |
| Prop-firm funded-account mechanics | `/blog/prop-trading-firms-funded-accounts` | retain; duplicate already consolidated |
| Drawdown recovery mathematics | `/blog/the-recovery-equation-why-a-50-loss-needs-a-100-gain-to-break-even-and-how-to-survive-drawdowns-2026` | retain |
| Finviz Heatmap/Maps | `/blog/finviz-elite-heatmap-market-visualization-made-simple-2026` | retain |
| Single closed-trade post-mortem | `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026` | retain |
| Bull/bear market regime | `/blog/bull-market-vs-bear-market` | retain; long duplicate already consolidated |
| Beginner trading-chart literacy | `/blog/a-beginners-guide-to-reading-trading-charts-2026` | retain |
| Behavioral recovery after trading losses | `/blog/how-to-recover-from-trading-loss` | confirmed neighboring owner |
| Broad trading-journal structure/metrics/replay | `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026` | confirmed neighboring owner |

## New cannibalization actions in Task 20.8

### 1. Journal duplicate consolidated

Duplicate:
`/blog/trading-journal-secrets-how-to-review-your-trades-for-maximum-improvement-2026`
Source: `content/blog/2026010503.md`

Decision: `consolidate_redirect` to:
`/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`

Evidence:
- duplicate had only 1 current canonical/numeric content inlink;
- broad Journal Guide owner had 11 canonical inlinks before consolidation and 12 after link cleanup;
- duplicate covered journal fields, daily/weekly/monthly review, metrics and setup options already owned by the broad Journal Guide/periodic review architecture.

Direct redirects configured:
- `/blog/2026010503` -> broad Journal Guide owner;
- duplicate long slug -> broad Journal Guide owner.

The remaining content inlink from `content/blog/2026011002.md` now points directly to the canonical owner.

### 2. Behavioral recovery duplicate consolidated

Duplicate:
`/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026`
Source: `content/blog/2026012901.md`

Decision: `consolidate_redirect` to:
`/blog/how-to-recover-from-trading-loss`

Evidence:
- behavioral owner had 6 direct inlinks;
- duplicate had only 2 inbound references and substantially repeated psychology, pause, diagnosis and comeback workflow;
- Task 20.3 already reserved exact percentage/recovery arithmetic for the recovery-math owner.

Direct redirects configured:
- `/blog/2026012901` -> behavioral recovery owner;
- duplicate long slug -> behavioral recovery owner.

The two remaining references from `content/blog/2026020502.md` and `content/blog/2025121101.md` now point directly to the behavioral owner.

## Behavioral recovery boundary cleanup

`content/blog/2026033102.md` was rebuilt because the previous neighboring page still contained universal recovery rules that conflicted with Task20.3 boundaries and YMYL safety:

Removed:
- mandatory 2–3 trading-day pause;
- generic 5–10% mandatory break threshold;
- universal 50% size cut for 20 trades;
- mandatory one-setup/two-week rule;
- generic 2% daily / 5% weekly / 10% monthly / 20% total circuit-breaker table;
- unsupported professional/prop-firm universal thresholds;
- deterministic recovery-time advice;
- manual Markdown Article schema.

Current behavioral owner now focuses on diagnosing planned losses vs rule violations vs model/environment questions, choosing controls that match the identified problem, simulation/reduced-risk options, and predefining evidence for returning to normal risk. Exact recovery arithmetic is explicitly handed to the Task20.3 math owner.

## Internal-link review

Task20 canonical owner inbound counts after cleanup:

- Stocktwits owner: 3
- Prop-funded owner: 5
- Drawdown-math owner: 5
- Finviz owner: 3
- Post-trade owner: 7
- Bull/bear owner: 19
- Beginner chart-reading owner: 3

New links added during cluster review:
- two FOMO/social-media pages -> Stocktwits owner;
- bar-replay beginner page -> chart-reading owner.

All seven Task20 owners therefore meet the current cluster minimum of 3 body-level inbound links.

## Remaining boundaries / non-actions

No additional consolidation was made for specialist candlestick, price-action, market-structure, support/resistance, volume, technical-analysis-framework, sector-rotation, copy-trading, or risk-management pages because their current primary intent remains distinguishable from the Task20 owners.

The broader site still contains older trading-journal content beyond the two pages consolidated here. No additional mass journal consolidation was performed without fresh GSC/Bing evidence because several of those URLs have materially larger inbound graphs and may have separate historical search value. They remain candidates for a dedicated journal-cluster audit rather than being changed opportunistically inside Task20.

## Result

Task 20.8 decision: `PASS_WITH_TWO_CONSOLIDATIONS_AND_BOUNDARY_CLEANUP`.

No push, deployment, R2 sync, GSC submission, Bing submission or IndexNow submission was performed.
