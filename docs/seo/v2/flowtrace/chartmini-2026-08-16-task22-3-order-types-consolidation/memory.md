# Task 22.3 — Market, Limit, and Stop Order Types Consolidation

Date: 2026-08-16
Requested target: `/blog/market-orders-limit-orders-and-stop-orders-explained-2026`
Requested source: `content/blog/2025102401.md`
Selected owner: `/blog/order-types-explained`
Owner source: `content/blog/2026032101.md`
Decision: `consolidate_redirect + surgical_refresh_owner`
Status: `protected_pending_deploy`

## Authorization

User explicitly authorized Task 22.3 for the requested order-types URL. The task includes the current-v2 Owner Gate work required to resolve direct cannibalization with the stronger broad order-types owner. No commit, push, deployment, R2 sync, GSC submission, Bing submission, or IndexNow submission was authorized.

## Data gate

Current v2 GSC/Bing performance remains unavailable for independent re-verification in this task:

- GSC performance: `unknown_not_reverified`
- Bing performance: `unknown_not_reverified`
- no legacy GSC/Bing metrics imported

Owner selection therefore relies on fresh production behavior, current site graph, fresh web/SERP evidence, and current primary-source definitions.

## Production preflight

Fresh production checks on 2026-08-16 found both competing broad pages live and indexable:

Requested target:

- `/blog/market-orders-limit-orders-and-stop-orders-explained-2026`
- HTTP 200
- exact self-canonical
- present in production sitemap
- `/blog/2025102401`: direct 301 to the requested long slug

Stronger owner candidate:

- `/blog/order-types-explained`
- HTTP 200
- exact self-canonical
- present in production sitemap
- `/blog/2026032101`: direct 301 to the owner

Neighbor specialist pages remain live and distinct:

- `/blog/stop-loss-vs-stop-limit-order`
- `/blog/trailing-stop-order-explained`

Before Task22.3, the requested target had 1 body-level Markdown inlink while `/blog/order-types-explained` had 23. Both broad pages were therefore competing for substantially the same beginner order-type intent.

## Fresh SERP / current-source direction

Fresh web search on 2026-08-16 for market/limit/stop order explanations surfaced ChartMini's `/blog/order-types-explained` as the ChartMini result for the broad intent. The result title and snippet cover market, limit, stop, stop-limit, trailing stop, and bracket orders, matching the dominant broad educational intent more completely than the requested target.

Current primary sources reviewed:

- SEC / Investor.gov, `Types of Orders` — identifies market, limit, and stop-loss orders as core order types and explains that market orders prioritize immediate execution without a guaranteed execution price; limit orders impose a price boundary but do not guarantee execution; stop orders become market orders after the trigger.
- FINRA, `Order Types` — confirms that a limit order may never execute even when used for price control and that a triggered stop order becomes a market order subject to current market pricing.
- SEC / Investor.gov investor bulletin on stop, stop-limit, and trailing stop orders — emphasizes that stop price is a trigger rather than a guaranteed execution price and that stop-limit price protection creates non-execution risk.

These sources support an educational structure centered on execution priority versus price control, with explicit caveats for liquidity, gaps, partial fills, trigger standards, broker/venue rules, and time-in-force behavior.

## Owner Gate / cannibalization findings

### Requested target

`/blog/market-orders-limit-orders-and-stop-orders-explained-2026`

The requested page is an older ~824-word broad explainer covering:

- market orders;
- limit orders;
- stop orders;
- stop-limit orders;
- basic order-selection guidance.

It has only one external body-level inlink and no durable intent that is not already covered by the stronger owner.

### Selected owner

`/blog/order-types-explained`

Selected because it has:

- 23 body-level canonical inlink files before consolidation;
- stronger fresh SERP visibility for the broad order-types intent;
- a cleaner evergreen slug;
- broader and more complete coverage: market, limit, stop, stop-limit, trailing stop, OCO, bracket orders, time-in-force, selection trade-offs, mistakes, FAQ, and practice boundaries;
- current dedicated specialist handoffs for stop-vs-stop-limit and trailing-stop sub-intents.

Owner boundary after Task22.3:

- `/blog/order-types-explained` owns the broad beginner order-types taxonomy and execution-vs-price-control decision framework.
- `/blog/stop-loss-vs-stop-limit-order` owns the narrow stop-loss versus stop-limit comparison, trigger behavior, gap examples, and execution/non-execution trade-off.
- `/blog/trailing-stop-order-explained` owns dynamic trailing-trigger mechanics and trailing-distance risks.
- `/blog/how-to-set-stop-loss-and-take-profit-orders-a-guide-to-protecting-your-capital-2026` owns pre-entry invalidation/target/risk planning rather than generic order taxonomy.
- `/blog/how-to-read-level-2-order-book` owns Level 2/order-book interpretation rather than retail order-type definitions.

Owner Gate: `consolidate_redirect + surgical_refresh_owner`.

## Consolidation

`content/blog/2025102401.md` now carries:

`redirectTo: /blog/order-types-explained`

Redirect config now sends both source forms directly to the owner:

- `/blog/2025102401` -> `/blog/order-types-explained`
- `/blog/market-orders-limit-orders-and-stop-orders-explained-2026` -> `/blog/order-types-explained`

No redirect chain is introduced.

The sole remaining live body link to the requested target in `content/blog/2026011901.md` was removed because that same Related Posts block already links directly to `/blog/order-types-explained`.

Post-edit residual live body links to the requested long slug: 0.

## Surgical owner refresh

The selected owner was already comparatively strong and visible in fresh search, so Task22.3 did not perform a broad rewrite. It made only material factual/structural corrections.

Changes to `content/blog/2026032101.md`:

- `dateModified` -> `2026-08-16`;
- removed manual `BlogPosting` JSON-LD because the v2 blog route already generates BlogPosting/BreadcrumbList schema;
- retained FAQPage-only manual schema;
- reframed the core concept from absolute “certainty of execution vs certainty of price” to `execution priority vs price control`;
- changed the comparison table from universal “Best For” wording to `Typical Purpose`;
- corrected the limit-order example so touching/reaching the limit price is not described as guaranteed execution;
- added queue priority, available liquidity, routing, size, and broker/venue rules as possible reasons for partial/no fill;
- softened OCO and bracket behavior so activation/cancellation/partial-fill handling is explicitly broker/platform dependent;
- corrected time-in-force language: Day/GTC/IOC/FOK availability, defaults, expiration, extended-hours eligibility, and partial-fill behavior are provider/product dependent rather than universal;
- corrected the ChartMini replay drill so an OHLC candle touching a limit level is not treated as proof of a live fill;
- updated the SEC/Investor.gov and FINRA source links to their current order-type pages.

## Schema boundary

Before Task22.3, the owner source contained a manual BlogPosting block even though v2 route logic already generates BlogPosting. The manual BlogPosting block was removed.

FAQPage schema remains because the article contains a matching FAQ and the route does not use that manual block as the article owner schema.

## Product-capability boundary

ChartMini remains described only as a historical chart-replay environment for practicing order-decision logic.

The owner explicitly does not claim that ChartMini reproduces:

- live broker routing;
- queue priority;
- precise slippage;
- real partial fills;
- venue-specific trigger logic;
- broker-specific OCO/bracket behavior.

The replay drill now says a historical OHLC touch/cross can be observed, but cannot establish that a live limit order would have filled.

## Internal-link state

After consolidation:

- `/blog/order-types-explained`: 23 direct body-level inlink files;
- requested duplicate long slug: 0 body-level inlinks;
- requested duplicate numeric path: no body links;
- stop-loss-vs-stop-limit and trailing-stop specialist links remain intact;
- global duplicate redirect-source definitions: 0.

## Validation

- `pnpm build`: PASS; 402 blog posts generated.
- requested target manifest entry: `redirectTo: /blog/order-types-explained`.
- selected owner manifest entry: routable, no `redirectTo`, `dateModified: 2026-08-16`.
- `pnpm check`: PASS.
- Biome: PASS.
- Vitest: 5 test files / 13 tests PASS.
- `pnpm seo:v2:workflow:check`: PASS; 13 required workflow files and 402 Markdown sources detected.
- `git diff --check`: PASS.
- residual body links to requested duplicate: 0.
- global duplicate redirect source definitions: 0.

## Deployment boundary / next action

Task22.3 is locally complete and `protected_pending_deploy`.

Production remains pre-Task22.3 until the user deploys. After deployment:

1. verify `/blog/order-types-explained` remains HTTP 200 and self-canonical;
2. verify `dateModified: 2026-08-16` and the surgical wording/source changes;
3. verify one route-generated BlogPosting owner schema and the intended FAQPage schema;
4. verify `/blog/market-orders-limit-orders-and-stop-orders-explained-2026` returns a direct 301 to `/blog/order-types-explained`;
5. verify `/blog/2025102401` also returns a direct 301 to `/blog/order-types-explained` with no chain;
6. verify both redirect sources are absent from the sitemap;
7. if GSC submission is later requested, submit/recheck `/blog/order-types-explained` only, not the redirect sources;
8. establish fresh 7-day and 14-day observation dates from the actual deployment/indexing event.

No current GSC/Bing performance claim is made.
