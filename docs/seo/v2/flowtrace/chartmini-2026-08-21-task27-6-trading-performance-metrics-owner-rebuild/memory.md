# ChartMini v2 Flowtrace — Task 27.6 Trading Performance Metrics Owner Rebuild

Date: 2026-08-21
Task: 27.6
Target: `/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`
Source: `content/blog/2026011106.md`
Numeric legacy path: `/blog/2026011106`
Final status: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`

## 1. Preflight / current production state

Fresh production verification on 2026-08-21 found:

- target returns HTTP 200;
- exact self-canonical points to `https://chartmini.com/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`;
- target is present in the production sitemap;
- production still serves the old title `Trading Performance Metrics: The Numbers That Actually Matter`;
- `/blog/2026011106` is a direct HTTP 301 to the canonical;
- exact current GSC state was not re-read and remains `unknown_not_reverified`;
- Bing/IndexNow remain `unknown_not_reverified`.

The current local site graph before rebuilding had five direct body-link source files to the canonical, all from non-redirecting sources:

- `content/blog/2026011102.md`
- `content/blog/2026011107.md`
- `content/blog/2026011502.md`
- `content/blog/2026033101.md`
- `content/blog/2026041502.md`

No support deficit exists; no link-count padding was required.

## 2. Fresh SERP / search-intent evidence

Fresh 2026-08-21 web/SERP research for `trading performance metrics`, `trading performance analytics`, and related `win rate / expectancy / profit factor / maximum drawdown / Sharpe` queries consistently resolves to a dedicated performance-analysis task rather than to a generic journal or backtesting page.

Current result patterns emphasize:

- win rate paired with average win/loss rather than interpreted alone;
- expectancy;
- profit factor;
- maximum drawdown;
- R-multiple or realized payoff analysis;
- Sharpe/Sortino or other risk-adjusted metrics;
- sample size and trade count;
- setup/session breakdowns;
- the distinction between account P&L and a diagnostic performance dashboard.

Relevant fresh examples included 2026 guides from TradersPost, Trade Planner, NexusFi, Tracker Fx, and other trading-analysis publishers. These sources differ on suggested numeric thresholds, which itself reinforces the decision not to publish unsupported universal `good` cutoffs.

Primary / higher-authority source checks used for definition quality:

- William F. Sharpe, Stanford — `The Sharpe Ratio`: ex ante/ex post distinction, differential-return construction, standard deviation, and limits of historical interpretation.
- CFA Institute — `The Sharpe Ratio and the Information Ratio`: mean/variance assumptions and limitations for asymmetric/non-normal return distributions.
- Charles Schwab — `Elements of a Smart Trade Plan`: trading-journal recording and periodic post-trade review context.

## 3. Owner Gate

Decision: `retain_narrow + rebuild`.

Canonical owner remains:

`/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`

Intent key:

`trading_performance_metrics_expectancy_profit_factor_drawdown_diagnostics`

Owner scope:

- net outcome and return context;
- win rate plus realized average win/loss;
- expectancy;
- profit factor;
- realized R-multiples;
- maximum drawdown and recovery-path context;
- streak/recovery-time diagnostics;
- Sharpe/Sortino with explicit assumptions;
- MAE/MFE and duration when intratrade data exists;
- rule compliance / error-rate metrics;
- setup/session/market segmentation controls;
- sample-size and strategy-version context;
- practical dashboard construction and interpretation.

Neighbor boundaries:

- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026` owns raw journal fields and broad journal structure.
- `/blog/trading-journal-review-system-2026` owns weekly/monthly/periodic review cadence and decision workflow.
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026` owns the single-trade post-mortem.
- `/blog/how-to-backtest-trading-strategy` owns historical test construction, look-ahead bias, sample generation, and strategy validation workflow.
- `/blog/risk-reward-ratio-explained` owns planned per-trade R:R and break-even mathematics.
- `/blog/risk-management-position-sizing-guide` owns risk budgeting, sizing, leverage, execution risk, and portfolio controls.

No consolidation or redirect change was justified.

## 4. Material defects in the old owner

The old body contained multiple factual/quality problems that justified a protected-owner rebuild:

- universal win-rate bands by style (for example scalping 50-60%, day trading 45-55%);
- universal R:R labels such as 2:1-3:1 = good and below 1:1 = poor;
- universal profit-factor labels (`1.5-2.0 good`, `2.0-3.0 excellent`);
- universal drawdown thresholds (`<5% excellent`, `<10% good`, `20%+ dangerous`);
- universal monthly-return targets (`2-4%`, `3-5%`, `5%+`);
- universal Sharpe labels and `Sharpe >1` target;
- mathematically weak/simple annualization from arithmetic average monthly return;
- deterministic conclusion that positive historical expectancy means the trader `will make money long term`;
- claims that winner/loser duration directly diagnoses behavior;
- hindsight metric `% of max profit captured` presented as a direct action command;
- invented `industry benchmarks` for retail trading performance;
- fabricated `real trader` examples presented as evidence;
- fixed remediation prescriptions such as reduce size by 25%, use 0.75% risk, force 2:1 setups;
- unsupported professional-vs-gambler framing;
- manual Article schema duplicating route-generated BlogPosting/author/site schema;
- false ChartMini claim that the product automatically tracks all 12 metrics in real time, calculates expectancy/profit factor, analyzes performance by market condition, and sends weekly reports.

## 5. Rebuild implemented

Rewrote `content/blog/2026011106.md`.

New frontmatter:

- title: `Trading Performance Metrics: Expectancy, Profit Factor, Drawdown, and More`
- metaTitle: `Trading Performance Metrics: Expectancy, PF & Drawdown`
- dateModified: `2026-08-21`
- expanded categories/tags for metrics/analytics intent;
- search-focused description;
- no manual Article/BlogPosting schema.

The rebuilt body now:

1. answers the search task directly in the opening paragraph;
2. defines an Owner boundary before metric detail;
3. requires data-quality checks before calculation;
4. separates gross vs net results and external cash flows;
5. organizes metrics by outcome, payoff/frequency, edge, path risk, risk-adjusted return, diagnostics, and evidence quality;
6. distinguishes planned R:R from realized payoff;
7. defines expectancy as an observed sample estimate rather than a promise;
8. defines profit factor without unsupported quality bands;
9. requires a frozen initial-risk denominator for R-multiples;
10. explains maximum drawdown as historical path evidence, not a future-risk ceiling;
11. treats streaks and recovery time as descriptive rather than direct psychological diagnoses;
12. explains Sharpe from the original-author/CFA framing, including return-frequency, benchmark/risk-free, standard-deviation, skew/tail and historical-estimate limits;
13. notes Sortino convention differences;
14. explains MAE/MFE data requirements and hindsight limitations;
15. treats duration as strategy-relative rather than universally diagnostic;
16. separates rule-compliance metrics from trade outcome;
17. warns against subgroup/data-mining bias;
18. places sample size, date range, strategy version, market coverage and cost model beside performance metrics;
19. proposes a minimal dashboard rather than arbitrary 12-number overload;
20. uses a hypothetical worked comparison while explicitly refusing to treat it as proof of live viability;
21. accurately narrows ChartMini to historical chart/decision replay with simplified simulated records, not broker-grade live analytics or automatic optimal-metric calculation;
22. adds plain-language FAQ and source-verification notes.

## 6. Internal-link / cannibalization audit

Post-rebuild target body outlinks:

- `/blog/how-to-backtest-trading-strategy`
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026`
- `/blog/risk-management-position-sizing-guide`
- `/blog/risk-reward-ratio-explained`
- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
- `/blog/trading-journal-review-system-2026`

All six resolve directly to current non-redirecting canonical sources locally. Redirecting Blog destinations: 0.

Target body support remains five direct source files; all five are non-redirecting. No new internal link was required because the owner already exceeds the >=3 effective-source requirement.

No new duplicate owner, redirect, slug, route, sitemap rule, or schema layer was introduced.

## 7. Validation

Post-rebuild validation PASS:

- `pnpm build`
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check`
  - Biome: 415 files
  - Vitest: 6/6 files passed
  - 17/17 tests passed
- `pnpm seo:v2:workflow:check`
  - 13 required v2 workflow files
  - 402 Blog Markdown files
- `git diff --check` PASS

Custom integrity checks:

- manifest owner count: 1;
- effective direct body-support source files: 5;
- manual Article/BlogPosting schema in target Markdown: 0;
- target Blog outlinks through redirect sources: 0;
- stale universal threshold / false ChartMini-automation claim scan: clean.

## 8. Deployment / indexing state

This task does not deploy or submit indexing.

Current production remains the pre-Task27.6 body until the user manually deploys.

After deployment:

- verify canonical remains 200/self-canonical/in sitemap;
- verify `dateModified: 2026-08-21` and new title/body are live;
- verify `/blog/2026011106` remains direct 301;
- inspect canonical GSC state only if needed;
- never submit `/blog/2026011106`;
- establish observation dates from the actual deployment/indexing event, not from local completion.

GSC: `unknown_not_reverified`.
Bing/IndexNow: `unknown_not_reverified`.

No commit, push, deploy, GSC, Bing, IndexNow, or R2 action performed in Task27.6.
