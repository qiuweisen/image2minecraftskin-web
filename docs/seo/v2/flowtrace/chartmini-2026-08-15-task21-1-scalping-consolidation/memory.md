# Task 21.1 — Scalping Beginner Guide Consolidation / Owner Rebuild

Date: 2026-08-15
Authorized target: `/blog/beginners-guide-to-scalping-start-here`
Requested source: `content/blog/2026021501.md`
Selected owner: `/blog/scalping-strategies-guide`
Owner source: `content/blog/2026041502.md`
Additional duplicate: `/blog/scalping-small-price-moves-beginner-guide` (`content/blog/2026031602.md`)
Decision: `consolidate_redirect + rebuild_owner`
Status: `protected_pending_deploy`

## Authorization and execution boundary

The user explicitly authorized Task 21.1 for `/blog/beginners-guide-to-scalping-start-here`.

This task did not authorize and did not perform:

- git commit;
- push;
- Cloudflare deployment;
- R2 content sync;
- GSC Request Indexing;
- Bing submission;
- IndexNow submission.

Task20 observation-protected owners were not modified.

## Data gate

Current-v2 data access probe on 2026-08-15:

- `claude-seo`: unavailable;
- `BING_WEBMASTER_API_KEY`: absent;
- `INDEXNOW_KEY`: absent.

Therefore current GSC/Bing performance values remain `unknown_not_reverified`. No legacy metrics, protection state, submission state, or old owner assignment was imported.

## Production / search preflight

Fresh web search/open on 2026-08-15 surfaced all three ChartMini scalping URLs as live searchable pages:

1. `/blog/beginners-guide-to-scalping-start-here`
2. `/blog/scalping-small-price-moves-beginner-guide`
3. `/blog/scalping-strategies-guide`

The current search snapshots showed the first two pages targeting essentially the same beginner intent as the third: what scalping is, short holding periods, beginner suitability, setups/strategies, tools, risk, and trading costs.

Direct container `curl` production checks timed out during this task, so HTTP/canonical/sitemap headers were not independently re-read from the DevSpace network path. The current web search/open retrieval confirmed the live page URLs and current delivered bodies. Post-deploy verification must explicitly test HTTP status, canonical, sitemap membership, and redirect destinations.

## Fresh SERP / source evidence

Fresh 2026 search direction is consistent across current beginner scalping resources:

- CMC Markets: scalping is a seconds-to-minutes trading style focused on small moves; spread/cost, liquidity, slippage, leverage, and suitability matter; it is generally demanding for beginners.
- IG: scalping involves multiple short-duration trades; liquidity and cost are central considerations.
- BabyPips: current trading curriculum explicitly frames scalping as a style beginners should understand rather than blindly copy, emphasizing tiny targets, costs, and execution.
- FINRA: new intraday margin requirements became effective June 4, 2026, replacing the longstanding PDT framework, with a permitted brokerage-firm transition through October 20, 2027.
- SEC: approved SR-FINRA-2025-017 in April 2026.
- Investor.gov: rapid intraday trading, especially with leverage, can create very fast and substantial losses.

The resulting search intent is not “give me guaranteed scalping settings.” It is a beginner decision/education intent: definition, how it differs from other trading styles, whether it is appropriate, execution/cost constraints, common setup structures, risk, and how to practice/test.

## Site cluster / cannibalization evidence

Three source pages occupied the same broad intent:

### Requested target

`content/blog/2026021501.md`
slug: `beginners-guide-to-scalping-start-here`

Current body had no canonical Markdown inlinks from other blog sources; the only exact URL reference found in the source set was its own legacy manual schema.

### Second duplicate

`content/blog/2026031602.md`
slug: `scalping-small-price-moves-beginner-guide`

Likewise had no current canonical Markdown inlinks from other blog sources; its exact slug reference was its own manual schema.

### Strong existing owner

`content/blog/2026041502.md`
slug: `scalping-strategies-guide`

Had 12 current source files linking directly to `/blog/scalping-strategies-guide`, including trading-style, execution, ATR, broker/execution, journal, market replay, and related strategy pages.

The site graph therefore already treated `/blog/scalping-strategies-guide` as the practical scalping owner while the other two URLs remained orphan-like duplicates.

## Owner Gate

Decision: `consolidate_redirect + rebuild_owner`.

Selected owner:

`/blog/scalping-strategies-guide`

Owner intent:

`scalping_trading_beginner_strategy_costs_risks`

The selected owner should cover:

- plain-language scalping definition;
- scalping vs day/swing trading;
- why small target size makes spread/fees/slippage/execution important;
- liquidity, volatility, spread, and execution constraints;
- example setup structures for study, not “proven” signals;
- general risk-design questions without universal percentage rules;
- current 2026 U.S. intraday-margin transition nuance;
- market-structure differences across stocks/options, futures, forex, and crypto;
- beginner practice/testing workflow;
- ChartMini’s actual replay role and limitations;
- FAQ.

Neighbor ownership remains separate:

- support/resistance methodology -> dedicated S/R owner;
- VWAP methodology -> `/blog/vwap-trading-strategy`;
- volume methodology -> `/blog/how-to-read-trading-volume`;
- Level 2/order book -> `/blog/how-to-read-level-2-order-book`;
- broad risk management -> `/blog/risk-management-position-sizing-guide`;
- broad day trading -> `/blog/how-to-start-day-trading`;
- swing trading -> `/blog/swing-trading-strategies-guide`;
- backtesting -> `/blog/how-to-backtest-trading-strategy`;
- performance metrics -> `/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`.

No new scalping article should be created for the same broad intent while this owner exists.

## Problems found in the pre-edit scalping content

Across the cluster, the old content included multiple weak or risky patterns:

- three pages targeting essentially the same beginner scalping intent;
- duplicate manual Article schema in Markdown despite v2 route-generated BlogPosting schema;
- fabricated-looking first-person experience claims in the selected owner;
- fixed trade counts, profit targets, timeframes, stops, account minimums, and profitability timelines presented too universally;
- unsupported “most reliable” / “setups that work” language;
- simplistic claims that more frequent small profits compound into consistent income;
- stale universal statement that U.S. equity scalpers require $25,000 under the PDT rule;
- strong claims about execution platforms, fees, PFOF/fill quality, and latency without current scoped verification;
- ChartMini claims in the requested target that described real-time scalping signals, automatic position sizing, detailed scalping analytics, and market-condition alerts that the current v2 product does not provide.

## Actual changes

### 1. Rebuilt the canonical scalping owner

Rewrote `content/blog/2026041502.md`.

New frontmatter:

- title: `Scalping Trading for Beginners: How It Works, Costs, Risks, and Setups`
- metaTitle: `Scalping Trading Guide 2026: Costs, Risks & Setups`
- dateModified: `2026-08-15`
- description: beginner definition + costs/execution + setup structure + practice boundary.

Final body is about 3,354 words.

The rewrite:

- provides a direct answer in the opening;
- includes key takeaways and comparison tables;
- distinguishes scalping from ordinary day trading and HFT;
- explains net expectancy after friction;
- focuses on liquidity, spread, volatility, and execution before indicators;
- presents level rejection, breakout/retest, and VWAP as testable setup structures rather than guaranteed edges;
- avoids universal risk percentages and stop distances;
- updates the U.S. regulatory section for FINRA’s June 4, 2026 intraday-margin change and transition window through October 20, 2027;
- removes broker/platform shopping recommendations and unsupported execution claims;
- separates market-specific constraints for stocks/options, futures, forex, and crypto;
- gives a beginner historical-testing workflow;
- includes FAQ and current source notes;
- removes the manual Article JSON-LD.

### 2. Corrected ChartMini product scope

The article now reflects current v2 behavior:

- Intraday Replay uses historical 5-minute source data for forex and crypto;
- it can train chart reading, setup recognition, pre-reveal decision-making, and journaling;
- it does not reconstruct Level 2/DOM, queue position, tick-by-tick sequencing, live spread changes, real fees, slippage, latency, broker routing, or partial fills;
- it is not presented as a real-time scalping signal or execution simulator.

### 3. Consolidated the requested target

Added to `content/blog/2026021501.md`:

`redirectTo: /blog/scalping-strategies-guide`

Redirect config now sends both:

- `/blog/2026021501`
- `/blog/beginners-guide-to-scalping-start-here`

straight to `/blog/scalping-strategies-guide`.

### 4. Consolidated the second duplicate

Added to `content/blog/2026031602.md`:

`redirectTo: /blog/scalping-strategies-guide`

Redirect config now sends both:

- `/blog/2026031602`
- `/blog/scalping-small-price-moves-beginner-guide`

straight to `/blog/scalping-strategies-guide`.

Existing `/blog/2026041502` continues to redirect directly to the same owner.

No redirect chain is intended.

## Internal-link validation

The rebuilt owner contains current v2 links to dedicated owners for:

- backtesting;
- Level 2/order book;
- trading volume;
- day trading;
- risk management;
- support/resistance;
- swing trading;
- performance metrics;
- VWAP.

All nine internal blog slugs were verified to exist and none is a `redirectTo` source.

Existing canonical inbound links already point to `/blog/scalping-strategies-guide`; no neighboring Task20 observation-protected article required modification.

## Generated manifest / redirect result

After `pnpm build`:

- blog manifest source count: 402;
- `beginners-guide-to-scalping-start-here` -> `redirectTo: /blog/scalping-strategies-guide`;
- `scalping-small-price-moves-beginner-guide` -> `redirectTo: /blog/scalping-strategies-guide`;
- `scalping-strategies-guide` -> routable owner with new title/meta/dateModified;
- routable broad scalping owner count: 1;
- duplicate redirect sources in redirect config: 0.

Direct redirect destinations verified locally:

- `/blog/2026021501` -> `/blog/scalping-strategies-guide`;
- `/blog/beginners-guide-to-scalping-start-here` -> `/blog/scalping-strategies-guide`;
- `/blog/2026031602` -> `/blog/scalping-strategies-guide`;
- `/blog/scalping-small-price-moves-beginner-guide` -> `/blog/scalping-strategies-guide`;
- `/blog/2026041502` -> `/blog/scalping-strategies-guide`.

## Validation

- `pnpm build` — PASS.
- `pnpm check` — PASS.
- Biome — PASS; 412 files checked.
- Vitest — PASS; 4 test files / 9 tests.
- `pnpm seo:v2:workflow:check` — PASS; 13 required workflow files / 402 blog Markdown files.
- `git diff --check` — PASS.
- Owner internal blog-link validation — PASS.
- Generated broad scalping routable owner count — 1.
- Duplicate redirect-source count — 0.

## Post-deployment verification required

After deployment, verify:

1. `/blog/scalping-strategies-guide` returns 200 and exact self-canonical;
2. new title/meta/body/dateModified are live;
3. owner is in sitemap;
4. requested `/blog/beginners-guide-to-scalping-start-here` returns direct 301 to owner;
5. `/blog/2026021501` returns direct 301 to owner;
6. `/blog/scalping-small-price-moves-beginner-guide` returns direct 301 to owner;
7. `/blog/2026031602` returns direct 301 to owner;
8. redirect sources are absent from sitemap;
9. no duplicate Article schema is delivered from Markdown;
10. if manually submitting GSC, submit the owner URL only, not redirect sources.

Final Task21.1 state: `protected_pending_deploy`.
