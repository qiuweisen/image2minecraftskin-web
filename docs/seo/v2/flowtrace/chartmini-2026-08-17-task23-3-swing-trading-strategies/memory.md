# Task 23.3 — Swing Trading Strategies Guide

Date: 2026-08-17
Target: `/blog/swing-trading-strategies-guide`
Source: `content/blog/2026032401.md`
Final status: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
Owner Gate: `retain_narrow + rebuild`

## Goal

Re-evaluate the existing Swing Trading strategy page against the current ChartMini v2 Swing Trading cluster, fresh production behavior, fresh SERP evidence, current risk/execution rules, and the v2 article architecture. Preserve the URL only if it remains the strongest owner for concrete swing-strategy/setup intent.

## Preflight

### Production status before edit

Fresh production checks on 2026-08-17:

- `/blog/swing-trading-strategies-guide` -> HTTP 200.
- `/blog/2026032401` -> direct HTTP 301 to `/blog/swing-trading-strategies-guide`.
- Production target is self-canonical.
- Production target is present in sitemap.
- Production still shows the pre-Task23.3 title `Swing Trading Strategies: A Complete Guide for Beginners (2026)` and `dateModified: 2026-03-24`, confirming this task is not deployed yet.

Neighbor production pages are also HTTP 200 and sitemap-listed:

- `/blog/swing-trading-explained-the-ultimate-guide-for-2026`
- `/blog/swing-trading-for-part-time-traders`
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`
- `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`

### Current site graph

Pre-edit body-link counts from current Markdown:

- `/blog/swing-trading-strategies-guide`: 24 external body-inlink files.
- `/blog/swing-trading-explained-the-ultimate-guide-for-2026`: 3 after Task23.2 scoped support.
- `/blog/swing-trading-for-part-time-traders`: 0.
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`: 0.

The target is therefore the strongest established internal owner for generic Swing Trading strategy/setup intent.

### GSC / Bing

- Current exact target GSC metrics/status: `unknown_not_reverified`.
- Current exact target Bing metrics/status: `unknown_not_reverified`.
- No old-project GSC/Bing values were imported.

## Fresh SERP / intent evidence

Fresh web searches on 2026-08-17 included:

- `swing trading strategies guide beginners pullback breakout support resistance 2026`
- `site:chartmini.com/blog swing trading strategies ChartMini`
- `part time swing trading strategies full time job`
- `site:chartmini.com/blog "part-time" "swing trading"`
- `is swing trading still effective 2026`
- `site:chartmini.com/blog "is swing trading still effective"`

Observed ChartMini search behavior:

- `/blog/swing-trading-strategies-guide` surfaces for generic Swing Trading strategy intent.
- `/blog/swing-trading-for-part-time-traders` surfaces for the explicit part-time use-case intent.
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis` surfaces for the explicit current-viability question.
- Task23.2 had already established `/blog/swing-trading-explained-the-ultimate-guide-for-2026` as the `what is / explained / mechanics` owner.

Decision: the target should remain the concrete strategy/setup owner. The two zero-inlink neighbors are weak internally, but fresh exact-intent search still demonstrates potentially separate use-case/question intent, so Task23.3 does not force a consolidation.

## Owner Gate

Decision: `retain_narrow + rebuild`.

### Target owns

- how to turn a Swing Trading idea into a testable ruleset;
- trend-pullback setup family;
- support/resistance-reaction setup family;
- breakout-and-retest setup family;
- trend-transition setup family;
- context/setup/trigger/invalidation/exit definitions;
- strategy versioning and replay-test design;
- look-ahead avoidance;
- OHLC/order-fill limitations;
- strategy-specific research mistakes and FAQ.

### Neighbor boundaries

- `/blog/swing-trading-explained-the-ultimate-guide-for-2026`: definition, multi-session mechanics, overnight/event/gap risk, market/account/timeframe background and replay-practice context.
- `/blog/swing-trading-for-part-time-traders`: part-time schedule/use-case intent, retained pending later independent review.
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`: current-viability question, retained pending later independent review.
- `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`: style-selection comparison.
- indicator/price-action specialist owners retain their detailed tool definitions.
- broad Risk Management owner retains sizing, leverage, portfolio heat and drawdown architecture.
- Order Types owner retains market/limit/stop order mechanics.

## Problems in the old target

The pre-edit article mixed beginner definition, generic lifestyle claims, strategy ownership, risk rules and account rules in one page. It also contained unsupported or over-general claims such as:

- Swing Trading always means `2 days to 2 weeks`.
- fixed trades-per-week and screen-time ranges;
- fixed `Daily + 4H` chart mapping;
- fixed `$5,000-$10,000` capital recommendation;
- outdated universal `$25,000 PDT` framing;
- Swing Trading being ideal for beginners;
- daily chart setups being more reliable than intraday setups;
- fixed 21 EMA / 50 SMA pullback formula as if generally validated;
- claim that institutional buyers programmatically re-enter at the 21 EMA;
- falling pullback volume proving sellers are not in control;
- fixed RSI/Fibonacci/volume thresholds as universal confirmation;
- `1-2%` stop buffer below support;
- breakout volume `1.5x+` as universal rule;
- fixed `1-5 days` retest timing;
- retest entry being categorically superior;
- mandatory `1%` risk rule;
- universal skip/exit-before-earnings rule;
- universal `3-5` maximum open positions;
- fixed weekly routine and time commitment;
- one indicator combination described as the most effective;
- manual Article JSON-LD duplicating the route-generated BlogPosting architecture.

## Fresh primary-source boundary

Current sources used to constrain factual/risk claims:

1. FINRA — Understanding the New Intraday Margin Requirements
   - replacement intraday margin framework effective 2026-06-04;
   - brokerage transition permitted through 2027-10-20;
   - no assumption that the historical PDT framework applies identically at every firm during transition.
   - `https://syndication.finra.org/content/understanding-new-intraday-margin-requirements`

2. Investor.gov — Stop, Stop-Limit, and Trailing Stop Orders
   - stop price is a trigger, not a guaranteed execution price;
   - actual fill may differ significantly in fast markets.
   - `https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15`

3. SEC — Margin: Borrowing Money to Pay for Stocks
   - margin can magnify losses;
   - broker may liquidate securities when requirements are not met.
   - `https://www.sec.gov/about/reports-publications/investorpubsmarginhtm`

4. TradingView — Strategy Produces Unrealistically Good Results by Peeking Into the Future
   - look-ahead bias can make historical strategy results unrealistically favorable.
   - `https://www.tradingview.com/support/solutions/43000614705-strategy-produces-unrealistically-good-results-by-peeking-into-the-future/`

5. TradingView — Broker Emulator
   - strategy results depend on fill model, execution delay, slippage, fees and price-path assumptions.
   - `https://www.tradingview.com/support/solutions/43000786181-broker-emulator/`

These sources are used for execution/research boundaries, not as evidence that any Swing Trading setup is profitable.

## Actual changes

### Rebuilt target

`content/blog/2026032401.md`

New title/meta title:

`Swing Trading Strategies: 4 Testable Setups for 2026`

New `dateModified`:

`2026-08-17`

Approximate final article size:

~3,634 words.

### New content architecture

The target is now organized around strategy research rather than generic promises:

1. Direct answer + key takeaways.
2. What makes a strategy testable.
3. Trend Pullback.
4. Support/Resistance Reaction.
5. Breakout and Retest.
6. Trend Transition.
7. Setup-selection decision table.
8. Risk-management boundary.
9. Look-ahead-free backtesting workflow.
10. OHLC/fill limitations.
11. Test sheet.
12. ChartMini capability boundary.
13. Common research errors.
14. FAQ.
15. Practical next step.
16. Primary-source reading list.

Each strategy family now separates:

- context;
- setup;
- trigger;
- invalidation;
- exit;
- failure mode;
- variables to test.

Exact EMA, RSI, Fibonacci, volume, stop, target and timing parameters are framed as hypotheses to test, not universal trading laws.

### ChartMini capability boundary

The rebuilt article accurately limits ChartMini to historical candle replay/chart-reading practice. It explicitly does not claim:

- broker routing;
- queue priority;
- exact market/limit/stop fills;
- full slippage/liquidity modeling;
- borrow availability;
- financing/house-margin behavior;
- portfolio-correlation enforcement;
- live emotional/operational conditions.

### Schema

- manual `Article`: removed.
- manual `BlogPosting`: absent.
- v2 route remains authoritative for BlogPosting/Breadcrumb/author schema.

## Internal-link validation

Final target contains 12 unique internal Blog links. All resolve to current non-redirecting owners:

- `/blog/swing-trading-explained-the-ultimate-guide-for-2026`
- `/blog/market-structure-trading-guide`
- `/blog/moving-averages-sma-ema-guide`
- `/blog/support-and-resistance-guide`
- `/blog/rsi-indicator-explained`
- `/blog/how-to-read-trading-volume`
- `/blog/multiple-timeframe-analysis`
- `/blog/risk-management-position-sizing-guide`
- `/blog/how-to-backtest-trading-strategy`
- `/blog/how-to-keep-trading-journal`
- `/blog/average-true-range-atr-measuring-volatility-for-smarter-trading-2026`
- `/blog/order-types-explained`

Target remains supported by 24 external body-inlink files, so no additional supporting-link edits were necessary.

## Manifest / routing validation

After `pnpm build`:

- manifest contains target as an owner;
- target title: `Swing Trading Strategies: 4 Testable Setups for 2026`;
- target `dateModified: 2026-08-17`;
- target `redirectTo: undefined`;
- 12/12 target internal Blog links route to non-redirect owners;
- manual Article: false;
- manual BlogPosting: false.

Current production remains pre-deploy for Task23.3:

- long target is 200/self-canonical;
- numeric `/blog/2026032401` is direct 301 to long target;
- production still shows old title/dateModified until user deploys.

## Validation

Final local validation:

- `pnpm build` — PASS; 402 Blog posts; client and SSR builds completed.
- `pnpm check` — PASS; Biome 414 files; Vitest 5/5 files, 13/13 tests.
- `pnpm seo:v2:workflow:check` — PASS; 13 required Workflow files, 402 Blog Markdown files.
- `git diff --check` — PASS.
- custom owner/link/schema audit — PASS; target is owner, 12/12 internal Blog links are non-redirecting, no manual Article/BlogPosting.

Existing chunk-size warnings are unchanged build warnings and not a Task23.3 failure.

## Deployment / indexing

Not performed in Task23.3:

- no commit;
- no push;
- no deployment;
- no R2 sync;
- no GSC Request Indexing;
- no Bing/IndexNow submission.

After the user deploys, verify:

1. target returns 200;
2. exact self-canonical;
3. sitemap contains target;
4. production title is `Swing Trading Strategies: 4 Testable Setups for 2026`;
5. production `dateModified` is 2026-08-17;
6. route BlogPosting remains the primary article schema;
7. `/blog/2026032401` remains direct 301;
8. no accidental redirect or canonical changes to the concept/part-time/current-viability neighbors.

Then evaluate GSC indexing for the canonical target only. Do not submit numeric redirect sources.

## Final decision

`RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`

The target remains the strongest generic Swing Trading strategy/setup owner. It has been rebuilt from prescriptive, overconfident formulas into a testable strategy-research guide while preserving distinct concept, part-time, current-viability, and style-comparison intents.