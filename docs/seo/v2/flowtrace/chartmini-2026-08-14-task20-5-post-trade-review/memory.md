# Task 20.5 Flowtrace — Post-Trade Review

Date: 2026-08-14
Project: ChartMini v2
Task: 20.5
Target URL: `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026`
Source: `content/blog/2026011107.md`
Decision: `retain_narrow + rebuild`
Status: `protected_pending_deploy`

## Objective

Rebuild the migrated post-trade-review article around a single defensible search-intent owner: reviewing one closed trade by comparing the pre-trade plan with actual execution, separating process quality from P&L, and producing one testable lesson. Prevent the page from competing with broader trading-journal recording, weekly/monthly journal review, performance-metrics, and post-entry trade-management owners.

## v2 Preflight

Fresh production check on 2026-08-14:

- Target URL: HTTP 200.
- Production title before Task20.5: `Post-Trade Review Mastery: How to Learn from Every Trade | ChartMini Blog`.
- Self canonical: exact target URL.
- Target is present in the current production sitemap.
- Legacy numeric `/blog/2026011107` returns a direct HTTP 301 to the canonical target.
- Current-v2 GSC access: unavailable (`claude-seo` unavailable).
- Current-v2 Bing/IndexNow API access: unavailable (environment keys absent).
- Therefore GSC/Bing metrics remain `unknown_not_reverified`; no legacy project values were imported.

## Fresh SERP / source evidence

Fresh search evidence was collected for post-trade review, trade-log review, and trading-journal review intent.

Observed intent pattern:

- authoritative educational pages emphasize keeping a trade log, preserving entry/exit/target/context details, and reviewing the reasons behind outcomes;
- broader journal pages tend to combine record keeping with periodic metrics and pattern analysis;
- the clearest differentiator available to ChartMini is the closed-position post-mortem: plan vs actual execution, process vs result, one lesson per trade.

Primary supporting sources reviewed:

- CME Group — `Keep a Trade Log`: recommends preserving trade details and daily post-mortem conclusions, with P/L secondary to understanding the why/how of performance.
- Charles Schwab — `5 Elements of a Smart Trade Plan`: recommends using a trade journal and reviewing entries, stops, exits, and assumptions after trades; also provides a worksheet intended for before/after trade analysis.
- Charles Schwab — `Practice Trading Risk-Free with paperMoney`: documents retrieving execution details and P/L history for later review.

No external source was used to justify fixed profitability improvements, mandatory review durations, universal compliance thresholds, or guaranteed future-loss prevention.

## Cannibalization review

The v2 journal/review cluster is crowded. Relevant current pages include:

- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026` — broad journal structure, fields, metrics and replay workflow.
- `/blog/trading-journal-review-system-2026` — weekly/monthly/quarterly aggregation and pattern review.
- `/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026` — metric definitions and formulas.
- `/blog/trade-management-what-to-do-after-you-enter-2026` — decisions while the trade is open.
- `/blog/trading-journal-secrets-how-to-review-your-trades-for-maximum-improvement-2026` — live 200/self-canonical broad review article that overlaps several journal owners and remains a future consolidation candidate.

Target already had strong owner-support signals from current v2 content:

- `/blog/trade-management-what-to-do-after-you-enter-2026` explicitly routes closed-position review to Task20.5.
- multiple journal/stop-loss pages link to the target.
- legacy numeric URL redirects directly to the target.

Owner Gate did **not** redirect the `trading-journal-secrets` page in this task because fresh GSC/Bing query/page data are unavailable. Its overlap is recorded for a later cluster-wide consolidation gate rather than guessed from content similarity alone.

## Owner Gate decision

Decision: `retain_narrow + rebuild`.

Task20.5 owner boundary:

- post-trade review definition;
- preservation of original pre-trade plan;
- single closed-trade checklist;
- plan-vs-actual entry, sizing, management and exit review;
- process-quality vs outcome matrix;
- one-trade lesson and next action;
- examples of good-process/bad-outcome and bad-process/good-outcome;
- warning against rewriting a strategy from one trade;
- accurate use of ChartMini replay/session history as review evidence.

Explicitly excluded from this owner:

- full journal-field/template ownership;
- weekly/monthly/quarterly aggregate review ownership;
- performance-metric formula ownership;
- open-position trade-management rules;
- broad trading-psychology ownership.

## Problems in migrated target

The pre-Task20.5 article contained several quality and trust problems:

1. Manual legacy Article JSON-LD in Markdown even though v2 route generates primary article schema.
2. Fabricated trader examples with precise profits and claims such as review causing a trader to turn a break-even week into +$800 or double monthly return.
3. Unsupported deterministic claims such as "15 minutes saves thousands" and "one lesson prevents 10 future losses."
4. Universal mandates such as `No review = no trading next day` presented as if objectively required.
5. Fixed compliance targets such as `Aim for 90%+` without an evidence basis.
6. Mixed single-trade, weekly, monthly, and quarterly review scopes, competing with dedicated journal-review pages.
7. Product overclaim: stated that ChartMini automatically logs every detail, prompts guided post-exit questions, identifies weekly mistakes, and tracks improvement as an automated coaching system.
8. Outcome-heavy framing that risked treating winners as validation and losses as proof of a bad setup.

## Product-capability verification

Current v2 implementation was checked at `src/lib/training-records.ts`.

Verified current behavior:

- completed training can sync a compact summary including symbol, interval, bars, trade count, P&L percentage and duration for authenticated users;
- comments state that the full chart/trade list remains in existing local history;
- guests continue using local history if authenticated sync is rejected.

Not verified / not claimed after Task20.5:

- automatic post-trade coaching questions;
- automatic trade-validity judgment;
- AI weekly pattern diagnosis from review notes;
- personalized weekly improvement-report generation.

## Changes made

### Main target

Rebuilt `content/blog/2026011107.md`.

Metadata now:

- Title: `Post-Trade Review: A Practical Checklist to Learn From Every Trade`
- Meta title: `Post-Trade Review Checklist: Learn From Every Trade`
- `dateModified: 2026-08-14`
- clearer description, categories and tags aligned with the narrow owner.

Main content now includes:

- direct definition in first 150 words;
- 5 key takeaways;
- distinction between single-trade review, daily review, periodic journal review and performance analysis;
- pre-outcome plan-freezing / hindsight-control section;
- 10-question single-trade checklist;
- compact review template;
- process-vs-outcome matrix;
- good-process/loss and bad-process/win examples without fabricated personal track records;
- anti-overfitting section explaining why one trade should not trigger a full strategy rewrite;
- realistic review cadence guidance rather than mandatory fixed minutes;
- current ChartMini capability/limitation section;
- FAQ, practical next step, primary sources and related guides.

Removed:

- manual Article schema;
- fabricated trader performance stories;
- guaranteed or deterministic improvement claims;
- universal fixed review-time/compliance mandates;
- false ChartMini automated-review/AI-report claims.

### Scoped boundary edits

`content/blog/2026010904.md`

- changed its detailed closed-trade workflow section into a boundary section;
- explicitly states that this page owns broader journal structure/metrics/replay while Task20.5 owns the closed-position post-mortem;
- adds canonical link to Task20.5.

`content/blog/2026010905.md`

- replaced the old numeric `/blog/2026011107` related-post link with the canonical Task20.5 slug.

`content/blog/2026010202.md`

- replaced the old numeric `/blog/2026011107` related-post link with the canonical Task20.5 slug.

After edits, no Markdown link to `/blog/2026011107` remains.

## Internal-link state

Target currently links to scoped current v2 owners for:

- trading plan;
- position sizing;
- trade management after entry;
- broad trading journal;
- periodic journal review;
- performance metrics;
- pre-trade checklist;
- Market Replay.

Current canonical inbound links include the broad journal guide, stop-loss article, trading-journal habit article, trade-management owner, and other existing supporting pages.

## Validation

Passed after rebuild:

- `pnpm build` — PASS; 402 blog posts written to manifest.
- `pnpm check` — PASS.
- Vitest — 3/3 PASS.
- `git diff --check` — PASS.
- `pnpm seo:v2:workflow:check` — PASS.
- Generated manifest target count — exactly 1.
- Target internal-link slug check — all checked links exist in v2.
- Legacy numeric target inlinks remaining in Markdown — 0.

## Observation / deployment state

Status: `protected_pending_deploy`.

No commit, push, deployment, R2 content sync, GSC request indexing, Bing submission, or IndexNow submission was performed.

After actual deployment:

1. verify new title/description/H1/body/canonical in production;
2. verify sitemap membership;
3. verify `/blog/2026011107` still directly 301s to canonical;
4. verify current v2 article body is actually available through the R2 content path;
5. if fresh GSC access becomes available, inspect query/page data before making any consolidation decision on the remaining broad journal-review duplicates;
6. establish real 7-day/14-day observation dates from the deployment/indexing event, not from the local edit date.
