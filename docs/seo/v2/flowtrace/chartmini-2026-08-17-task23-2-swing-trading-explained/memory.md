# Task 23.2 — Swing Trading Explained

Date: 2026-08-17
Target: `/blog/swing-trading-explained-the-ultimate-guide-for-2026`
Source: `content/blog/2026021402.md`
Final status: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
Owner Gate: `retain_narrow + rebuild`

## Goal

Revalidate whether the February 2026 `Swing Trading Explained` URL should remain an independent owner or be consolidated into another Swing Trading page, then correct intent overlap, unsupported fixed trading rules, factual/regulatory boundaries, internal links, schema, and ChartMini capability claims.

## Fresh production preflight

Observed on 2026-08-17 before Task23.2 edits:

- Target long slug: HTTP 200.
- Numeric `/blog/2026021402`: direct HTTP 301 to the target long slug.
- Target present in production sitemap.
- Nearby live 200/sitemap pages:
  - `/blog/swing-trading-strategies-guide`
  - `/blog/swing-trading-for-part-time-traders`
  - `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`
  - `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`
- Pre-edit body-level source-file inlinks:
  - target concept page: 1
  - `/blog/swing-trading-strategies-guide`: 23
  - part-time swing page: 0
  - still-effective page: 0
  - day/swing/investing comparison: 2
- Current v2 GSC performance: `unknown_not_reverified`.
- Current v2 Bing performance: `unknown_not_reverified`.
- No legacy metrics were imported.

## Fresh SERP / intent evidence

Fresh web searches on 2026-08-17 included:

- `site:chartmini.com/blog swing trading ChartMini`
- `site:chartmini.com/blog "what is swing trading" ChartMini`
- `site:chartmini.com/blog "swing trading strategies" ChartMini`
- `site:chartmini.com/blog "swing trading explained" ChartMini`
- `site:chartmini.com/blog "part-time swing trading" ChartMini`

Fresh search repeatedly surfaced both the requested target and `/blog/swing-trading-strategies-guide`, but with a useful intent split:

- `what is / explained` intent surfaced the requested target.
- `swing trading strategies` surfaced `/blog/swing-trading-strategies-guide`.
- part-time wording surfaced `/blog/swing-trading-for-part-time-traders`.
- current-viability wording surfaced `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`.

Therefore the target should not be redirected merely because another Swing Trading page has more inlinks. A narrower concept/mechanics owner remains defensible if strategy content is removed from the target.

## Owner Gate

Decision: `retain_narrow + rebuild`.

Target owner boundary:

- what swing trading is;
- multi-session holding mechanics;
- swing vs day trading vs longer-horizon investing/position trading;
- setup -> invalidation -> sizing -> order -> monitoring -> exit workflow;
- overnight/weekend/event risk;
- stop-order execution limits;
- margin/settlement/account-rule boundaries;
- timeframe-role selection without universal timeframe rules;
- instrument-specific holding risks;
- historical replay practice and its limitations;
- beginner FAQ.

Neighbor boundaries preserved:

- `/blog/swing-trading-strategies-guide`: concrete strategy/setup families and rules.
- `/blog/swing-trading-for-part-time-traders`: part-time schedule/use-case intent; no merge performed in Task23.2.
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`: current viability/market-change question; no merge performed in Task23.2.
- `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`: style-selection comparison.
- `/blog/risk-management-position-sizing-guide`: broad trading-risk architecture.
- `/blog/order-types-explained`: order mechanics.
- `/blog/multiple-timeframe-analysis`: general MTF framework.

The zero-inlink part-time and still-effective pages remain future cluster-review candidates; Task23.2 does not silently modify or consolidate them.

## Current primary-source checks

Fresh/current sources checked on 2026-08-17:

1. FINRA — Understanding the New Intraday Margin Requirements
   - replacement framework effective 2026-06-04;
   - permitted broker transition through 2027-10-20;
   - firms can still be on different transition states.
   - https://syndication.finra.org/content/understanding-new-intraday-margin-requirements

2. FINRA — Brokerage Accounts
   - cash vs margin account distinction;
   - margin can involve losses beyond deposited funds.
   - https://www.finra.org/investors/investing/investment-accounts/brokerage-accounts

3. SEC — Margin: Borrowing Money to Pay for Stocks
   - margin can magnify losses;
   - firms may liquidate positions under account agreements/rules;
   - house requirements can exceed regulatory minimums.
   - https://www.sec.gov/about/reports-publications/investorpubsmarginhtm

4. Investor.gov — Understanding Order Types / Stop Orders
   - stop price is a trigger, not a guaranteed execution price;
   - stop-limit adds price control but can fail to execute;
   - firm/venue behavior can differ.
   - https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14
   - https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15

5. Investor.gov — T+1 Settlement / Cash Account
   - standard settlement for many U.S. securities is T+1;
   - cash-account payment/freeriding rules remain relevant.
   - https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/new-t1-settlement-cycle-what-investors-need-know-investor-bulletin
   - https://www.investor.gov/introduction-investing/investing-basics/glossary/cash-account

## Problems in the old target

The old ~5,555-word page mixed concept, comparison, strategy, risk, market selection, system design, performance promises, and product promotion into one owner.

Material issues removed or corrected include:

- fixed “2–10 days average” and rigid 4H/daily/weekly holding mappings;
- fixed trade-count ranges;
- fixed stock/forex stop distances;
- universal 1%/1.5%/2% risk prescriptions;
- hard reward-risk and win-rate profitability claims;
- `$5,000–$10,000` universal capital requirement;
- outdated universal `$25,000 PDT` framing;
- claims that higher timeframe alignment is mandatory;
- unsupported “higher quality” timeframe claims;
- invented example outcomes presented as if evidentiary;
- broad strategy sections that competed with the Strategies owner;
- unsupported claims that swing trading is less stressful/more profitable for most traders;
- false ChartMini claims that the product automatically identifies swing setups, tracks MTF alignment, calculates pre-entry reward-risk, or sends live target/reversal alerts;
- manual Article JSON-LD duplicating the route-generated BlogPosting architecture.

## Rebuild

Final title:

`Swing Trading Explained: How It Works, Risks, and Practice in 2026`

Meta title:

`Swing Trading Explained: How It Works in 2026`

`dateModified: 2026-08-17`

Final length: ~3,012 words.

The rebuilt page now:

- answers the definition directly in the first 150 words;
- states that there is no universal duration/timeframe/stop/win-rate/risk percentage defining a swing trade;
- separates trading-style mechanics from strategy-specific setups;
- explains overnight gaps, earnings/event exposure, weekend risk, margin risk and stop execution limitations;
- covers U.S. 2026 intraday-margin transition without assuming all brokers use the same framework;
- covers T+1/cash-account boundaries without turning the page into a settlement guide;
- treats daily/multi-hour timeframes as common tools rather than rules;
- provides market-specific risk distinctions for stocks/ETFs, forex, futures, crypto and options;
- uses no universal minimum account size or risk percentage;
- routes strategy intent to `/blog/swing-trading-strategies-guide`;
- accurately describes ChartMini as historical candle replay, not live execution/alert/risk automation;
- contains no manual Article or BlogPosting schema.

## Internal links

Final target internal Blog destinations: 7 unique slugs.

All 7 are present in the generated manifest and are non-redirecting owners:

- `/blog/swing-trading-strategies-guide`
- `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`
- `/blog/risk-management-position-sizing-guide`
- `/blog/order-types-explained`
- `/blog/how-to-keep-trading-journal`
- `/blog/multiple-timeframe-analysis`
- `/blog/how-to-build-trading-plan`

Supporting canonical inlinks added from:

- `content/blog/2026032401.md` — Swing Trading Strategies owner.
- `content/blog/2025120301.md` — Day vs Swing vs Investing comparison.

Together with the existing `content/blog/2026060301.md` link, the concept owner now has 3 distinct body-level source files linking directly to it.

## Validation

Final local checks:

- `pnpm build` — PASS; 402 posts; client and SSR builds PASS.
- `pnpm check` — PASS; Biome clean; Vitest 5/5 files and 13/13 tests PASS.
- `pnpm seo:v2:workflow:check` — PASS; 13 required Workflow files / 402 Blog Markdown files.
- `git diff --check` — PASS.
- Manifest target is a routable owner with `dateModified: 2026-08-17` and no `redirectTo`.
- 7/7 target internal Blog destinations are routable non-redirecting owners.
- Manual `Article`: absent.
- Manual `BlogPosting`: absent.

## Deployment / indexing state

Task23.2 changes are local only.

No commit, push, deployment, R2 sync, GSC Request Indexing, Bing, or IndexNow action was performed.

After deployment:

1. verify target returns 200;
2. verify exact self-canonical;
3. verify new title/H1/body/dateModified;
4. verify route BlogPosting and absence of duplicate manual Article/BlogPosting;
5. verify sitemap membership;
6. verify `/blog/2026021402` remains a direct 301 to the canonical long slug;
7. if GSC URL Inspection shows the canonical owner is not indexed, Request Indexing may be appropriate; do not submit the numeric redirect source;
8. establish 7-day and 14-day observation dates from the actual deployment/indexing event.
