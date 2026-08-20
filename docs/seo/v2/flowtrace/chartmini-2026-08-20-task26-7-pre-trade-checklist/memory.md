# Task 26.7 — `/blog/pre-trade-checklist`

Date: 2026-08-20
Agent: ChatGPT / DevSpace
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Branch: `main`
Baseline HEAD observed during task: `aa7378e067f3d7d39529c43e16512157f17df5cf`

## Requested target

- Canonical candidate: `/blog/pre-trade-checklist`
- Source: `content/blog/2026032502.md`
- Numeric source: `/blog/2026032502`

## Fresh production preflight

Checked 2026-08-20 before editing:

- `/blog/pre-trade-checklist` -> HTTP 200.
- Production title: `The Ultimate Pre-Trade Checklist: 10 Questions to Ask Before Every Trade | ChartMini Blog`.
- Exact self-canonical points to `https://chartmini.com/blog/pre-trade-checklist`.
- Route-generated `BlogPosting` is present.
- Production `dateModified` was 2026-03-25.
- Canonical is present in production sitemap.
- `/blog/2026032502` -> direct HTTP 301 to `/blog/pre-trade-checklist`.
- Exact GSC state: `unknown_not_reverified`.
- Bing / IndexNow state: `unknown_not_reverified`.

## Fresh SERP review

Queries included:

- `"pre trade checklist" trading 2026`
- `"pre-trade checklist" trading plan risk management`
- `site:chartmini.com/blog "pre-trade checklist"`
- `pre trade checklist before entering a trade trading plan risk 2026`

Fresh 2026 results continue to show a durable standalone pre-trade-checklist task: a compact entry gate covering setup validity, entry trigger, invalidation/risk, position size, order/execution conditions, event exposure and impulse control. Current examples include dedicated 2026 checklist pages from For Traders and BloFin rather than only generic trading-plan pages.

Fresh official-source verification used for the rebuild:

- CME Group — `Risk Management and Your Trade Plan`: risk rules belong in the plan and should be quantified before trading.
- FINRA — `Stop Orders: Factors to Consider During Volatile Markets`: stop price is not guaranteed execution price; fast markets can produce materially different fills.
- FINRA — `Order Types`: order availability/handling varies and execution characteristics matter, especially in volatility.
- Investor.gov — `Understanding Order Types`: market, limit, stop and stop-limit orders have different execution/price trade-offs.
- Investor.gov — `Extended-Hours Trading`: lower liquidity, wider spreads, higher volatility, uncertain prices and different order handling can materially change execution.

## Current site graph / cannibalization review

Current body-link sources to `/blog/pre-trade-checklist`: 11 files.

Representative supporting contexts include:

- execution-gap / rule compliance;
- trading goals and process goals;
- revenge/FOMO controls;
- post-trade review;
- beginner journal boundary;
- part-time swing operating workflow;
- trading recovery process.

Neighbor ownership is distinct:

- `/blog/how-to-build-trading-plan` — full written operating plan / strategy rules.
- `/blog/risk-management-position-sizing-guide` — broad risk architecture and position sizing.
- `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026` — failure to follow already-defined rules.
- `/blog/how-to-keep-trading-journal` — record of actual decisions/results.
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026` — after-trade diagnosis/review.

No stronger existing page owns the immediate `before I place this order, what must I verify?` task.

## Owner Gate

Decision: `retain_narrow + rebuild`.

Intent key:

`pre_trade_checklist_entry_risk_execution_gate`

Reason:

- fresh SERP supports a dedicated pre-entry checklist task;
- target already has strong body support: 11 file-level source files, 10 of them non-redirecting/effective;
- production URL is clean, self-canonical, sitemap-listed and has a direct numeric redirect;
- neighboring Trading Plan, Risk Management, Execution Gap, Journal and Post-Trade Review intents are separable by workflow stage;
- therefore consolidation would blur a useful decision-stage boundary.

## Problems in the old body

The pre-task article had useful structure but mixed it with unsupported universal prescriptions and deterministic claims, including:

- mandatory higher-timeframe alignment for every strategy;
- claim that counter-trend trading is the `#1 cause of trading losses`;
- fixed 1.5:1 / 2:1 reward-to-risk requirements;
- fixed 1% risk as a universal rule;
- universal 1.5x volume confirmation rule;
- fixed FOMC `30 minutes before and after` avoidance;
- treating Friday afternoon / Monday morning as universal lower-liquidity minefields;
- automatically halving position size for any new setup;
- claims that passing all filters creates `genuinely high-probability` trades;
- fabricated `30–50% reduction` and win-rate/drawdown improvement claims;
- fixed `1–2 minutes`, `4–6 weeks` habit timing;
- claims that losing checklist-compliant trades are normally 40–50% of trades;
- manual Article JSON-LD duplicating route-generated BlogPosting.

These claims were removed rather than softened into new unverified thresholds.

## Implementation

Rewrote `content/blog/2026032502.md`.

New frontmatter:

- title: `Pre-Trade Checklist: 10 Questions to Ask Before You Enter`
- metaTitle: `Pre-Trade Checklist: 10 Questions Before Every Trade`
- dateModified: `2026-08-20`
- description focuses on setup rules, entry, invalidation, size, execution, event risk and decision quality.

New body structure:

1. direct definition / quick answer;
2. checklist vs trading plan vs journal boundary table;
3. 10 strategy-neutral gates:
   - defined setup;
   - required market context;
   - exact entry trigger/order type;
   - invalidation;
   - maximum planned loss;
   - position size;
   - exit logic;
   - liquidity/spread/session/order conditions;
   - scheduled-event policy;
   - P&L/emotion-driven rule override check;
4. copyable checklist template;
5. hard gates vs context vs observation fields;
6. common checklist mistakes;
7. how to test whether the checklist adds value;
8. ChartMini replay practice and product limitations;
9. FAQ;
10. official source notes.

Key editorial boundaries:

- checklist = immediate pre-entry compliance gate;
- plan = strategy/operating document;
- risk owner = architecture/position sizing;
- execution-gap owner = failure to follow rules;
- journal/review owners = after-the-fact evidence and diagnosis.

Removed manual Article/BlogPosting schema. Blog route remains the structured-data owner.

No redirect-config change was required.

No new internal links to the target were required because it already has 11 body-link source files.

## Local validation

PASS after rebuild:

- `pnpm build`
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check`
  - Biome 415 files
  - Vitest 6/6 files
  - 17/17 tests
- `pnpm seo:v2:workflow:check`
- `git diff --check`
- generated manifest target count: 1
- target manifest shows new title/meta/description and `dateModified: 2026-08-20`
- target body-inlink source files: 11 file-level / 10 effective non-redirecting
- target manual Article/BlogPosting schema: 0
- target outbound Blog links resolving through redirect config: 0
- Task26.8 added one direct semantic link from the checklist's market-context section to the Broad Market Volatility owner; this does not change the checklist's own inbound-support count.
- numeric `/blog/2026032502` redirect remains unchanged and direct.

## Deployment / indexing boundary

Not performed:

- commit;
- push;
- deployment;
- R2 sync;
- GSC Request Indexing;
- Bing / IndexNow submission.

Production remains the pre-Task26.7 body until the user deploys.

After deployment verify:

1. `/blog/pre-trade-checklist` -> HTTP 200.
2. exact self-canonical.
3. new title/meta description/body/dateModified are live.
4. one route-generated BlogPosting, no duplicate source Article/BlogPosting.
5. canonical remains in sitemap.
6. `/blog/2026032502` remains direct 301 to canonical.
7. only the canonical is eligible for GSC inspection/submission if needed; never submit the numeric redirect.

## Final status

`RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
