# Task 21.8 — Cluster intent, internal links, and cannibalization review

Date: 2026-08-15
Baseline: ChartMini v2
Scope: Task21.1–21.7 intent families plus directly adjacent live pages
Decision: `PASS_WITH_FOUR_JOURNAL_CONSOLIDATIONS`
Status: `protected_pending_deploy`

## 1. Authorization

The user explicitly requested Task21.8 to review cluster intent ownership, internal links, and cannibalization after Task21.1–21.7. Local content/config/workflow edits and validation were authorized. No commit, push, deploy, R2 sync, GSC, Bing, or IndexNow action was authorized.

## 2. Current-v2 data gate

Fresh access state remained:

- GSC: `unknown_not_reverified`.
- Bing: `unknown_not_reverified`.
- `claude-seo`: unavailable.
- `BING_WEBMASTER_API_KEY`: absent.
- `INDEXNOW_KEY`: absent.

No legacy GSC/Bing values were imported.

## 3. Fresh SERP / current-web review

Fresh web review was repeated for the Task21 families:

- scalping beginner/cost/risk/setup intent;
- trading correlation vs portfolio diversification/pair-trading intent;
- Christmas/New Year holiday trading and Santa Claus rally intent;
- how-to-keep-a-trading-journal vs periodic review/template intent;
- trading-loss behavioral recovery vs revenge-trading/drawdown math;
- beginner trading goals vs trading-plan intent.

The fresh results did not invalidate the owner boundaries established in Task21.1–21.7.

Key cluster observations:

- Scalping results still center on what scalping is, execution/cost/liquidity constraints, beginner suitability, setups, and risk rather than supporting multiple broad scalping owners.
- Holiday/Santa results still treat seasonality as a historical tendency rather than a guaranteed signal, supporting the Task21.3 evidence/testing boundary.
- `how to keep a trading journal` results remain centered on minimum viable logging, fixed logging triggers, daily routine and weekly review; this remains distinct from the broad template/metrics owner and periodic-review owner.
- Fresh ChartMini web results still expose the old recovery duplicate snapshot with fixed recovery thresholds, reinforcing stable 301 consolidation into `/blog/how-to-recover-from-trading-loss` rather than restoring the duplicate.
- Trading-goal results remain process/measurability/review oriented and continue to overlap heavily with the two pages consolidated in Task21.7.

## 4. Cluster owner revalidation

The following primary Task21 owner boundaries remain valid:

1. `/blog/scalping-strategies-guide`
   - owns broad beginner scalping definition, transaction friction/execution, testable setup structures, risk, market differences and replay/testing workflow.
   - Task21.1 beginner duplicates remain redirect sources.

2. `/blog/correlation-analysis-mastery-how-to-use-market-relationships-to-reduce-risk-2026`
   - owns general Pearson/rolling trading correlation, correlation-vs-beta/cointegration, hedge interpretation, intermarket context and pair-screening limitations.
   - portfolio matrix/covariance/weights/stress diversification remains separate.

3. `/blog/holiday-trading-market-patterns-and-strategies-for-the-christmas-season-2026`
   - owns Christmas/New Year holiday-trading conditions, Santa Claus Rally definition/window, seasonality limitations, execution/liquidity risk and testing workflow.
   - market-hours calendar, annual trading-day count, year-end review and portfolio rebalancing remain separate.

4. `/blog/how-to-keep-trading-journal`
   - owns sustainable journal-maintenance behavior: when to log, minimum viable record, logging triggers, data integrity and missed-entry recovery.

5. `/blog/how-to-recover-from-trading-loss`
   - owns behavioral recovery after losses: loss-event classification, loss-chasing controls, aggressive-vs-frozen reactions, process-matched recovery controls and evidence for resuming normal risk.
   - exact recovery arithmetic remains Task20.3; revenge trading remains a narrower behavior subtopic.

6. `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`
   - owns beginner trading-goal construction, process-vs-outcome distinction, measurable evidence, review points and goal adjustment.
   - trading-plan operating rules remain separate.

7. `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
   - remains the broad Trading Journal structure/fields/metrics/replay owner.

Journal specialist boundaries remain:

- `/blog/how-to-keep-trading-journal` — habit/maintenance process.
- `/blog/trading-journal-review-system-2026` — weekly/monthly/quarterly aggregate review.
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026` — one closed-trade post-mortem.
- `/blog/forex-trading-journal-template` — forex-specific template.
- `/blog/simulated-trade-log-replay-journal` — simulated/replay trade-log workflow.

## 5. New cannibalization finding — generic Trading Journal pages

A broader site-graph scan found four additional live generic Trading Journal pages that were not yet consolidated by Task20.8/Task21.4:

### A. `/blog/trading-journal-guide-track-and-improve-your-trading-performance-2026`

Source: `content/blog/2025122101.md`

Pre-Task21.8 state:

- production HTTP 200;
- generic journal definition, fields, performance tracking, review process and simulation journaling;
- one live body inlink;
- source already carried `noindex: true`, but remained a routable production URL and still surfaced in current web search history.

Decision: consolidate to the broad Journal owner.

### B. `/blog/the-trading-journal-why-elite-traders-never-skip-it-2026`

Source: `content/blog/2025123102.md`

Pre-Task21.8 state:

- production HTTP 200;
- fresh ChartMini search result visible;
- title/intent explicitly covers template, metrics, review process and examples;
- three live body inlinks;
- direct overlap with the protected broad Journal owner.

Decision: consolidate to the broad Journal owner.

### C. `/blog/trading-journal-mastery-how-to-track-analyze-and-improve-your-trading-performance-2026`

Source: `content/blog/2026011201.md`

Pre-Task21.8 state:

- production HTTP 200;
- fresh ChartMini search result visible;
- five live body inlinks;
- body covers generic journaling, metrics, weekly/monthly analysis, process-vs-outcome and plan adjustment;
- no defensible unique intent versus the broad Journal owner.

Decision: consolidate to the broad Journal owner.

### D. `/blog/top-5-trading-journal-strategies-beginners`

Source: `content/blog/2026022103.md`

Pre-Task21.8 state:

- production HTTP 200;
- one live body inlink;
- very long generic article covering templates, performance metrics, psychology, review, beginner workflow and journal improvement;
- contains unsupported/fabricated research-style percentages and universal performance thresholds;
- no distinct long-term owner intent beyond broad Trading Journal guidance.

Decision: consolidate to the broad Journal owner.

## 6. Changes made

All four sources now carry:

`redirectTo: /blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`

Direct permanent redirect config now points both numeric and long-slug paths straight to the selected owner:

- `/blog/2025122101`
- `/blog/trading-journal-guide-track-and-improve-your-trading-performance-2026`
- `/blog/2025123102`
- `/blog/the-trading-journal-why-elite-traders-never-skip-it-2026`
- `/blog/2026011201`
- `/blog/trading-journal-mastery-how-to-track-analyze-and-improve-your-trading-performance-2026`
- `/blog/2026022103`
- `/blog/top-5-trading-journal-strategies-beginners`

No redirect chain is required.

All live body links to these four sources/numeric paths were converted to the broad Journal canonical. Updated source pages include:

- Trading Emotions.
- Trading Performance Metrics.
- Trading Journal Review System.
- Momentum Trading.
- Volatility Trading.
- Simulated Trade Log.
- Soft4FX review.
- Market Replay drill guides.
- Hindsight Bias / replay guide.
- Futures margin guide.
- Prop Trading / Funded Accounts.

Redirect-source bodies themselves were not rewritten because they are non-routable after deployment.

## 7. Internal-link graph after cleanup

Body-level live canonical inlink files after build:

- Scalping owner: 11.
- Correlation owner: 4.
- Holiday Trading owner: 4.
- Journal Habit owner: 22.
- Behavioral Recovery owner: 4.
- Trading Goals owner: 3.
- Broad Trading Journal owner: 23.

Every principal Task21 owner is at or above the cluster minimum of three incoming body links.

Task21-related redirect-source links from routable Markdown pages: `0`.

Global duplicate redirect-source definitions: `0`.

## 8. Production pre-deploy baseline

Production remains pre-Task21 deployment.

Current production still returns HTTP 200 for most Task21 pages intended to become redirects, including:

- the two Task21.1 scalping duplicates;
- the Task21.4 Trading Journal Habit duplicate;
- the two Task21.7 Trading Goals duplicates;
- all four new Task21.8 generic Trading Journal duplicates.

The Task20/21.6 recovery duplicate is already live as a direct 301 because that consolidation was deployed earlier.

Therefore no Task21.1/21.4/21.7/21.8 redirect is claimed live yet.

## 9. Task21.8 result

Result: `PASS_WITH_FOUR_JOURNAL_CONSOLIDATIONS`.

No additional merge was justified for Scalping, Correlation, Holiday Trading, Behavioral Recovery or Trading Goals after the fresh cluster revalidation. The only material unresolved cannibalization was the generic Trading Journal cluster, and four weak generic pages were consolidated into the established broad Journal owner.

No commit, push, deployment, R2 sync, GSC, Bing, or IndexNow action was performed.
