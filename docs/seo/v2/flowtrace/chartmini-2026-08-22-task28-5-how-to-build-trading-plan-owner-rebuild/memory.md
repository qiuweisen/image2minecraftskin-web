# Task 28.5 — How to Build a Trading Plan

Date: 2026-08-22
Target: `https://chartmini.com/blog/how-to-build-trading-plan`
Source: `content/blog/2026031302.md`
Final local status: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`

## 1. Fresh Production Preflight

Pre-edit production checks on 2026-08-22:

- `/blog/how-to-build-trading-plan` -> HTTP 200.
- Exact canonical -> `https://chartmini.com/blog/how-to-build-trading-plan`.
- Sitemap -> canonical present.
- Production title/H1 -> `How to Build a Trading Plan: Your Step-by-Step Blueprint for Consistent Profits`.
- Production `dateModified` -> `2026-03-13T00:00:00.000Z`.
- Numeric legacy URL `/blog/2026031302` -> direct permanent 301 to the canonical owner, then 200.
- Numeric URL absent from sitemap.
- No redirect chain was observed.

Current v2 GSC exact URL state: `unknown_not_reverified`.
Current v2 Bing/IndexNow state: `unknown_not_reverified`.
No legacy metrics were imported.

## 2. Fresh SERP Review

Fresh 2026-08-22 queries included:

- `how to build a trading plan`
- `trading plan template what to include`
- current primary-source queries around trading-plan construction, risk, entry/exit and review.

Current SERP intent is a broad how-to/template task. Recurring components include:

- markets/instruments and time horizon;
- strategy/setup definition;
- entry and exit rules;
- risk/position sizing;
- no-trade or operating limits;
- daily/operating routine;
- review/change process;
- copyable or fillable plan template.

Fresh high-trust source review:

1. CME Group — `Building a Trade Plan`
   - treats the plan as a working document covering objective, methodology, risk management, trading strategies and trader log;
   - useful for plan structure, but its numeric examples are examples rather than universal ChartMini rules.
2. CME Group — `Trading Strategies in Your Trade Plan`
   - separates setup, trigger, entry, management and exit logic;
   - supports making conditions explicit before the live decision.
3. Charles Schwab — `5 Elements of a Smart Trade Plan`
   - covers objective, entry, position sizing/risk and exit planning;
   - includes example percentages that must not be converted into universal recommendations.
4. Fidelity — `Trading: A Step-by-Step Guide` (2026)
   - reinforces objectives, risk tolerance, time horizon, planning and monitoring context.

The fresh SERP does not justify splitting a second broad Trading Plan page. The target remains the best exact owner.

## 3. Site Graph / Cannibalization

Direct body-link graph before the rebuild:

- 27 source files linked to `/blog/how-to-build-trading-plan`.
- 26 were effective non-redirecting source pages.
- 41 direct body links in total.
- one source file was not counted as effective because it redirects.

Representative effective sources include:

- `/blog/risk-management-position-sizing-guide`
- `/blog/pre-trade-checklist`
- `/blog/how-to-backtest-trading-strategy`
- `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`
- `/blog/trading-for-a-living`
- `/blog/how-to-start-day-trading`
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026`
- `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026`
- `/blog/trading-patience-how-to-wait-for-high-probability-setups-2026`
- `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`

No second Markdown source with a competing broad `trading plan` title/slug was found.

Neighbor ownership boundary:

- Trading Plan -> full strategy/operating document and change control.
- Pre-Trade Checklist -> immediate pre-entry yes/no gate.
- Risk Management -> risk architecture and position-sizing methodology.
- Trading Journal -> what was actually recorded and plan-vs-actual evidence.
- Post-Trade Review -> one completed trade.
- Performance Metrics -> aggregate statistical diagnostics.
- Execution Gap -> failure to follow already-defined rules.
- Trading Goals -> improvement objectives, not execution authorization.
- Backtesting -> test methodology, not the plan document itself.

## 4. Owner Gate

Decision: `retain_narrow + rebuild`.

Reasons:

1. Exact clean URL and single broad owner.
2. Production 200/self-canonical/in sitemap.
3. Numeric legacy source is already a clean direct 301.
4. Strong support graph: 26 effective non-redirecting body-source pages.
5. Fresh SERP matches the URL's broad plan/template task.
6. Old body contained material YMYL/editorial defects that justified a rebuild:
   - universal `1%` risk prescription;
   - fixed daily/weekly/monthly loss limits (`-2%/-5%/-8%`);
   - fixed `1:2` R:R minimum;
   - fixed partial-profit/breakeven management;
   - fixed `50-100` / `100 trade` evidence thresholds;
   - fixed monthly review cadence;
   - deterministic `negative expectancy for 2 months` response;
   - unsupported claims that written plans eliminate emotion or create consistent/profitable outcomes;
   - unsupported claim that specialization in 1-2 instruments is inherently superior;
   - duplicate manual Article schema even though v2 renderer owns BlogPosting.

## 5. Rebuild

`content/blog/2026031302.md` was rebuilt while preserving the canonical slug.

New metadata:

- title: `How to Build a Trading Plan: Rules, Risk, and Review`
- metaTitle: `How to Build a Trading Plan: Template & Checklist`
- dateModified: `2026-08-22`
- revised description.

New body scope:

- direct definition in opening;
- 5 key takeaways;
- Trading Plan vs Strategy vs Checklist vs Journal table;
- market/account mandate;
- market context;
- setup vs trigger;
- entry/order assumptions;
- invalidation before size;
- planned loss and position size without universal percentages;
- management/exit rules without universal R:R or breakeven prescriptions;
- no-trade and stop-trading rules;
- versioning and change control;
- copyable plan template;
- testing without a magic sample-size rule;
- ChartMini replay use and limitations;
- common plan mistakes;
- FAQ;
- current CME/Schwab/Fidelity source notes;
- educational disclaimer.

Removed:

- manual Article schema;
- fixed `1%`, `-2%`, `-5%`, `-8%` risk/loss prescriptions;
- fixed `1:2` R:R rule;
- fixed 50% partial / breakeven rule;
- fixed 50-100 / 100-trade validation thresholds;
- fixed monthly review rule;
- universal profitability/discipline claims.

## 6. Internal-Link Validation

Post-rebuild target contains:

- 10 Blog links;
- 10 unique Blog destinations;
- 0 outbound links through configured redirects;
- 0 missing manifest destinations.

The page now hands off to the relevant specialist owners rather than absorbing their intent:

- Pre-Trade Checklist;
- Trading Journal Guide;
- Order Types;
- Risk Management / Position Sizing;
- Trading Performance Metrics;
- Trading Journal Review System;
- Post-Trade Review;
- Backtesting;
- Trading Goals;
- Execution Gap.

## 7. Technical Validation

Full validation after rebuild:

- `pnpm build` -> PASS.
  - Blog manifest: 402 posts.
  - Marketing locale assets: 160.
  - Client build: PASS.
  - SSR build: PASS.
- `pnpm check` -> PASS.
  - Biome: 415 files.
  - Vitest: 6/6 files, 17/17 tests.
- `pnpm seo:v2:workflow:check` -> PASS.
  - 13 required workflow files.
  - 402 current Blog Markdown files.
- `git diff --check` -> PASS.

Post-build integrity:

- target manifest count: 1;
- target `dateModified`: `2026-08-22`;
- manual Article/BlogPosting in Markdown: 0;
- numeric redirect remains `/blog/2026031302` -> `/blog/how-to-build-trading-plan`;
- owner outbound redirect links: 0.

## 8. Deployment / Indexing State

No commit, push, deployment, R2 sync, GSC request, Bing request, or IndexNow action was performed.

After a user-confirmed deployment, verify:

- canonical owner HTTP 200;
- exact self-canonical;
- sitemap membership;
- new title/H1;
- `dateModified: 2026-08-22`;
- `/blog/2026031302` remains a direct 301;
- no redirect chain.

GSC candidate after verified deployment: only the changed canonical owner:

`https://chartmini.com/blog/how-to-build-trading-plan`

Do not submit `/blog/2026031302`.

Observation dates must be created from the real deployment/indexing event, not local completion.
