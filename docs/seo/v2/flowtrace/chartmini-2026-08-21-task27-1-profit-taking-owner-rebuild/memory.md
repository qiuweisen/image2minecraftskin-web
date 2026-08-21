# Task27.1 — Profit-Taking owner rebuild

Date: 2026-08-21

## Target

Canonical URL:
`/blog/profit-taking-mastery-when-and-how-to-exit-winners-for-maximum-gains-in-2026-2026`

Source:
`content/blog/2026011003.md`

Numeric source:
`/blog/2026011003`

## Fresh production preflight

Observed 2026-08-21 before the local rewrite:

- target long URL: HTTP 200;
- exact self-canonical;
- present in production sitemap;
- route-generated BlogPosting present in production;
- production `dateModified`: 2026-01-10;
- numeric `/blog/2026011003`: direct HTTP 301 to the long canonical;
- no long-slug redirect exists;
- current GSC state: `unknown_not_reverified`;
- current Bing/IndexNow state: `unknown_not_reverified`.

## Fresh SERP evidence

Fresh 2026-08-21 queries included:

- `profit taking strategy when to take profits trading exit winners 2026`;
- `when to take profits trading partial profits trailing stops exit winners`;
- `trading exit strategy take profit winners scale out trailing stop 2026`;
- ChartMini site-restricted profit-taking / exit searches.

Current search results continue to support a narrow `take profit / profit-taking strategy` task rather than forcing all winning-trade exits into one generic Trade Management page. Representative current results included:

- Fidelity — `What you need to know about exit strategies`;
- Fidelity — `Managing positions: When to cut and run, when to take profits`;
- Fidelity — `Trailing stop orders`;
- Bullynx — `Take-Profit Strategies: How to Lock In Gains` (2026-07-02);
- BiFu — `Take-Profit Strategy: Setting Targets and Trailing Stops` (2026-07-14);
- Algo Lab — `Exit Strategy Complete Guide: When to Exit, How to Exit, Maximize Profits 2026` (2026-05-13).

The recurring search task is choosing among fixed targets, structure targets, partial exits, runners, trailing exits, time/event exits and predeclared exit rules for trades that have moved favorably.

Primary/current execution references used in the rebuild:

- Fidelity exit-strategy education: target, technical, time and order-based exits;
- FINRA `Stop Orders: Factors to Consider During Volatile Markets` (2025-03-26): stop price is a trigger, not guaranteed execution price;
- Investor.gov `Stop, Stop-Limit, and Trailing Stop Orders`: trailing-stop and stop-limit mechanics/risks;
- Investor.gov `Understanding Order Types`: limit orders are not guaranteed to execute.

## Current-site cannibalization / graph preflight

Before Task27.1:

- target body-support files: 0;
- `/blog/trade-management-what-to-do-after-you-enter-2026`: 5 body-support files;
- `/blog/how-to-set-stop-loss-and-take-profit-orders-a-guide-to-protecting-your-capital-2026`: 8 body-support files;
- `/blog/trailing-stop-order-explained`: 3 body-support files;
- `/blog/risk-reward-ratio-explained`: 11 body-support files.

The target was therefore weakly integrated, but its search task is still separable from the stronger neighbors.

## Owner Gate

Decision:
`retain_narrow + rebuild`

Intent key:
`profit_taking_winning_trade_exit_rule_testing`

Owner boundary:

- fixed profit targets;
- structure-based profit exits;
- partial profit taking;
- runner design;
- full-position trailing exits;
- time/event/thesis exits for favorable trades;
- weighted realized R for staged exits;
- MFE as an after-the-fact diagnostic, not a live hindsight input;
- comparing exit versions on the same entries/data/costs;
- execution limitations for limit/stop/trailing orders;
- no-hindsight replay of winning-trade exit decisions.

Neighbor boundaries preserved:

- `/blog/trade-management-what-to-do-after-you-enter-2026` owns the complete post-entry state machine: stop changes, additions, partial fills, early exits, open-position management and execution state;
- `/blog/how-to-set-stop-loss-and-take-profit-orders-a-guide-to-protecting-your-capital-2026` owns the pre-entry combination of invalidation, target, position size, OCO/bracket and order planning;
- `/blog/trailing-stop-order-explained` owns broker trailing-order mechanics;
- `/blog/risk-reward-ratio-explained` owns reward-to-risk mathematics;
- Post-Trade Review owns closed-trade diagnosis.

## Problems in the old body

The pre-task article contained multiple deterministic or unsupported prescriptions, including:

- fabricated Trader A/B/C win-rate/account-growth examples;
- `5 Profit Taking Strategies That Work` framing;
- universal 1:1 / 2:1 / 3:1 quality labels;
- universal staged schedules such as 50/30/20 and 30/30/40;
- claims that scale-outs automatically reduce stress and improve outcomes;
- claim that scaling out `captured more profit` despite the article's own full-position example producing more profit;
- fixed 3:55 PM exit as a general day-trading rule;
- fixed 1–2 week swing holding limit;
- fixed 80% pre-news reduction / 20% speculative remainder;
- fixed 50% reduction after a 50% winner;
- `RSI > 70` / upper Bollinger Band / MACD divergence as generic profit-taking commands;
- deterministic statements that markets reverse at support/resistance;
- `professionals` / `amateurs` claims without evidence;
- false ChartMini claim that the product automatically calculates optimal profit targets, tracks partial-profit opportunities and alerts users when to scale out;
- duplicate manual Article JSON-LD in Markdown.

## Implementation

Rebuilt `content/blog/2026011003.md`.

New frontmatter:

- title: `Profit-Taking Strategies: How to Exit Winning Trades Without Guessing`;
- metaTitle: `Profit-Taking Strategies: Targets, Partials & Trailing Exits`;
- `dateModified: 2026-08-21`;
- author: `Iven W.`;
- updated categories/tags/description;
- no manual Article/BlogPosting schema.

New content includes:

- direct answer within the opening 150 words;
- updated date and Key Takeaways;
- explicit owner/neighbor boundary;
- fixed-target, structure-target, partial/runner, trailing, time/event and thesis-exit methods;
- fixed-R formulas as definitions, not recommendations;
- weighted realized R for staged exits;
- exit-version comparison matrix;
- MFE diagnostic with explicit hindsight warning;
- order-execution distinction and FINRA/Investor.gov risk controls;
- anti-overfitting / same-entry comparison guidance;
- replay workflow and accurate ChartMini capability limitations;
- visible FAQ;
- practical next step;
- current source links.

## Internal-link changes

Added three direct canonical body links to the target from:

1. `content/blog/2026011602.md` — Trade Management partial-profit section;
2. `content/blog/2025122502.md` — Stop-Loss/Take-Profit target-rule section;
3. `content/blog/2026011001.md` — Trend Following exit/trailing discussion.

Post-task target support: 3 direct body-source files.

Target has 7 unique Blog outlinks and all resolve directly to final non-redirecting owners under the current redirect config.

## Validation

PASS:

- `pnpm build`
  - 402 Blog posts;
  - 160 marketing locale assets;
- `pnpm check`
  - Biome 415 files;
  - Vitest 6/6 files;
  - 17/17 tests;
- `pnpm seo:v2:workflow:check` PASS;
- `git diff --check` PASS;
- generated manifest contains one target entry;
- manifest title/meta/description/dateModified reflect Task27.1;
- target direct body-support files: 3;
- manual Article/BlogPosting schema: 0;
- target Blog outlinks through redirect config: 0;
- numeric redirect architecture unchanged.

## Deployment / indexing boundary

Not performed:

- commit;
- push;
- deployment;
- R2 sync;
- GSC Request Indexing;
- Bing / IndexNow submission.

The production site therefore remains on the pre-Task27.1 body until deployment.

After deployment, verify the long canonical as 200/self-canonical/new metadata/dateModified/in sitemap and keep `/blog/2026011003` as the direct 301 source. Only the canonical should ever be considered for GSC submission.

## Final status

`RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
