# Task 22.5 — Order Block Trading

Date: 2026-08-16
Requested target: `/blog/order-block-trading-supply-demand-zones-2026`
Source: `content/blog/2026020901.md`
Decision: `retain_narrow + rebuild`
Status: `protected_pending_deploy`

## Authorization

The user explicitly authorized Task22.5 for the requested order-block target. No commit, push, deployment, R2 sync, GSC submission, Bing submission, or IndexNow submission was authorized.

## Data gate

Current v2 GSC/Bing performance is unavailable for independent re-verification in this task:

- GSC performance: `unknown_not_reverified`
- Bing performance: `unknown_not_reverified`
- no legacy GSC/Bing metrics imported

Owner selection therefore relies on fresh production behavior, fresh search/SERP evidence, current v2 site graph, current source content, and current market-structure/order-book primary sources.

## Production preflight

Fresh production checks on 2026-08-16 found:

Requested target `/blog/order-block-trading-supply-demand-zones-2026`:

- HTTP 200
- exact self-canonical
- present in production sitemap
- `/blog/2026020901`: direct 301 to the requested long canonical

Neighbor `/blog/supply-and-demand-zones-trading`:

- HTTP 200
- exact self-canonical
- present in production sitemap

There is no production `/blog/smart-money-concepts-trading` route; the current broad SMC owner is the long canonical `/blog/smart-money-concepts-how-institutional-traders-manipulate-liquidity-and-how-you-can-follow-their-money-2026`.

Production remains pre-Task22.5 until deployment.

## Fresh SERP / search direction

Fresh web search on 2026-08-16 covered:

- `order block trading supply demand zones 2026`
- ChartMini order-block pages
- `order blocks vs supply and demand zones trading`
- order blocks / institutional-order-flow evidence

The requested ChartMini target surfaced directly for the broad order-block trading intent. Search results outside ChartMini commonly describe order blocks as narrower SMC/ICT-style zones near the origin of displacement and distinguish them from broader supply/demand bases, although definitions vary materially across publishers.

That search behavior supports retaining a dedicated Order Block specialist rather than merging the URL into the broader Supply/Demand page.

## Primary / authoritative market-data evidence

The task does not treat exchange/regulatory sources as proof that the SMC order-block method works. They are used only to establish the data boundary between an OHLC chart and actual order-flow evidence.

Sources reviewed:

- SEC MIDAS: `https://www.sec.gov/securities-topics/market-structure-analytics/midas-market-information-data-analytics-system`
  - reconstructs exchange order books using posted orders, cancellations/modifications, executions, proprietary exchange feeds and off-exchange trade information;
  - demonstrates that actual order-book reconstruction requires much richer data than OHLC candles.
- SEC Market Activity Report Methodology: `https://www.sec.gov/securities-topics/market-structure-analytics/market-activity-report-methodology`
  - documents undisplayed resting orders and trades against hidden orders;
  - demonstrates that even exchange-book feeds can contain hidden/undisplayed dimensions.
- SEC Hidden Volume visualizations / methodology
  - show that hidden trades and hidden volume exist in U.S. exchange activity.
- CME Group Iceberg Orders: `https://www.cmegroup.com/tools-information/webhelp/ebs-workstation-quick-guide/Content/IcebergOrders.html`
  - documents an order type that displays only part of total size while hidden size remains in the book.

Inference used in the article: because actual market activity can involve hidden and fragmented order information, an OHLC candle alone cannot identify institutional participant identity, inventory, parent-order size, hidden liquidity, motive, or whether a historical order remains active.

## Owner Gate

### Requested target retained

`/blog/order-block-trading-supply-demand-zones-2026`

Decision: `retain_narrow + rebuild`.

Reasons:

1. fresh search directly surfaced the requested target for order-block intent;
2. the existing broad SMC owner explicitly delegates detailed order-block zone selection/testing to this URL;
3. `/blog/supply-and-demand-zones-trading` has a durable broader supply/demand intent and should not absorb all SMC order-block terminology;
4. `/blog/order-flow-trading-mastery-how-to-read-market-activity-like-a-pro-2026` owns actual DOM, Time and Sales, footprint, Delta/CVD, absorption and feed limitations;
5. market-structure owners retain BOS/CHoCH/swing hierarchy rules;
6. no stronger competing dedicated Order Block owner was found.

## Final owner boundary

Task22.5 target owns:

- what an order block is in common SMC usage;
- definition variability and versioning;
- bullish/bearish candidate selection;
- candle/body/full-range/multi-candle zone boundaries;
- displacement qualification;
- optional structure qualification;
- retest definition;
- freshness/retest-count as a test variable rather than a hidden-order fact;
- invalidation and expiry;
- touch vs rejection vs structure-confirmation entry versions;
- order-block vs supply/demand comparison;
- FVG/liquidity/BOS confluence dependence and correlation;
- no-hindsight backtesting;
- comparison with simpler baselines;
- replay practice and ChartMini capability limits.

Neighbor boundaries:

- `/blog/supply-and-demand-zones-trading` -> broad supply/demand zone method;
- broad SMC long owner -> terminology/evidence crosswalk for liquidity sweeps, FVGs, BOS/CHoCH and order blocks;
- detailed market-structure verification owner -> swing/BOS/CHoCH rules;
- Order Flow owner -> actual order-flow/DOM/tape/footprint data;
- Level 2 owner -> displayed depth/order-book mechanics and limitations.

No consolidation is required.

## Defects in the old target

The old article contained extensive unsupported or overbroad claims, including:

- order blocks are candles that definitively contained massive institutional orders;
- institutional order flow leaves permanent footprints visible to retail candle readers;
- institutional order flow drives 70-80% of significant market movements;
- future reactions occur because the same institutional orders remain active;
- order blocks identify *why* price turned rather than only where a pattern occurred;
- “limit order block” presented as a standardized third order-block type;
- consolidation interpreted as institutional accumulation/distribution without direct evidence;
- strong displacement treated as proof of institutional execution;
- higher-timeframe order blocks presented as automatically more reliable and representative of larger institutional positions;
- fixed “two-thirds” quality rule;
- claims that professionals focus on the top 10-20% / 3-5 blocks;
- universal 1-2% risk rule;
- universal 2:1 / 3:1 minimum reward-risk targets;
- fixed pip/dollar stop buffers justified as protection from stop hunting;
- claims that institutions target retail stops at obvious levels;
- FVG + order-block “confluence” presented as significantly higher probability;
- counter-trend blocks presented as having significantly lower win rates without a defined dataset;
- confirmation entries presented as significantly higher win rate;
- first/second/third retest probability hierarchy explained as institutions progressively filling remaining orders;
- fixed 50+ sample requirement as “statistical significance”;
- fixed 2-4 month proficiency and 6-12 month mastery timeline;
- universal cross-market effectiveness claims;
- product claim that ChartMini automatically identifies institutional order blocks across timeframes and sends high-probability alerts;
- manual Article JSON-LD despite route-generated BlogPosting.

## Rebuild

Final metadata:

- title: `Order Block Trading in 2026: How to Define, Test, and Trade the Setup`
- metaTitle: `Order Block Trading: Definition, Rules, Retests & Testing (2026)`
- dateModified: `2026-08-16`
- slug unchanged
- description rewritten around definitions, zone rules, retests, invalidation, testing and evidence limits.

Final length: about 4,458 words by `wc -w` including frontmatter/schema text.

Major sections:

- direct definition and evidence boundary;
- key takeaways;
- definition variability / versioning;
- OHLC vs actual order-book data;
- order blocks vs supply/demand zones;
- five observable setup components;
- bullish and bearish versions;
- full-range/body/base zone definitions;
- freshness as a test variable;
- timeframe aggregation and MTA boundary;
- FVG/liquidity/BOS confluence overlap;
- touch/rejection/structure-confirmation entry variants;
- separate invalidation and account-risk design;
- no-hindsight backtesting sequence;
- simpler-baseline comparison;
- discovery vs validation split;
- journal fields;
- ChartMini replay drill and capability limits;
- common mistakes;
- FAQ;
- primary-source evidence boundaries;
- related owner links.

Manual Article/BlogPosting schema is absent. FAQPage schema remains as a specific secondary schema.

## Supporting internal-link edits

To strengthen the selected specialist Owner and clarify boundaries, direct canonical body links were added/updated from:

1. `content/blog/2026011501.md` — existing broad SMC owner already links to Task22.5 multiple times and explicitly delegates detailed order-block testing to it;
2. `content/blog/2026040802.md` — Supply/Demand FAQ now distinguishes overlapping but non-identical rule sets and links to the Order Block specialist;
3. `content/blog/2026041001.md` — broad market-structure/SMC comparison now links directly to Order Block rules;
4. `content/blog/2026040202.md` — Level 2 evidence-boundary section now links to Order Block guide and states that OHLC zones cannot identify hidden institutional inventory.

Post-edit body-level source-file count linking to the target: 4.

## Product-capability boundary

The rebuilt article describes ChartMini only as a historical candle-replay practice tool.

Current product boundary used:

- daily historical replay: stocks, forex, crypto;
- intraday simulator: historical 5-minute forex and crypto source data;
- no historical DOM / Level 2 reconstruction;
- no participant identities;
- no hidden/iceberg order inventory;
- no Time and Sales;
- no queue position;
- no partial-fill or venue-routing simulation;
- no real spread/slippage reproduction;
- no claim that an institution caused a candle pattern.

The replay drill is for testing chart rules while future candles are hidden, not for proving institutional order flow.

## Internal links

Final target has eight unique internal Blog destinations:

1. broad SMC owner;
2. Order Flow owner;
3. Supply/Demand owner;
4. detailed Market Structure verification owner;
5. Multiple Timeframe Analysis owner;
6. Risk Management / Position Sizing owner;
7. Support and Resistance owner;
8. Trading Journal habit owner.

Post-build manifest validation: 8/8 routable and non-redirecting.

## Validation

- `pnpm build`: PASS; 402 blog posts generated.
- `pnpm check`: PASS.
- Biome: PASS; 414 files checked.
- Vitest: 5 test files / 13 tests PASS.
- `pnpm seo:v2:workflow:check`: PASS; 13 required workflow files and 402 current Blog Markdown sources detected.
- `git diff --check`: PASS.
- target manifest: routable; no `redirectTo`.
- target title: new title present.
- target dateModified: `2026-08-16`.
- target manual Article schema: absent.
- target manual BlogPosting schema: absent.
- target FAQPage schema: present.
- target internal Blog links: 8/8 valid/routable/non-redirecting.
- body-level source files linking to target: 4.
- Supply/Demand owner remains routable and independent.
- broad SMC owner remains routable and independent.
- Order Flow owner remains routable and independent.

## Deployment boundary / next action

Task22.5 is locally complete and `protected_pending_deploy`.

Production is still pre-Task22.5 and therefore still exposes the old unsupported institutional-footprint claims until the user deploys.

After eventual deployment:

1. verify target HTTP 200 and exact self-canonical;
2. verify new title/body/dateModified;
3. verify one route-generated BlogPosting and no duplicate manual Article/BlogPosting schema;
4. verify target remains in sitemap;
5. verify `/blog/2026020901` remains direct 301 to the canonical target;
6. verify supporting pages link directly to the target canonical;
7. if GSC submission is requested, submit/recheck the canonical owner only;
8. establish fresh 7-day and 14-day observation dates from actual deployment/indexing.

No current GSC/Bing performance claim is made.
