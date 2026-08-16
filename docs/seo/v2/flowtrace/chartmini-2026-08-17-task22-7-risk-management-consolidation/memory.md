# Task 22.7 — Risk Management Consolidation

Date: 2026-08-17 (Asia/Shanghai)
Task: `/blog/risk-management-in-trading-the-hidden-skill-that-separates-winners-from-losers-2026`
Requested source: `content/blog/2026010702.md`
Selected owner: `/blog/risk-management-position-sizing-guide`
Owner source: `content/blog/2026031201.md`
Result: `CONSOLIDATE_REDIRECT_SURGICAL_REFRESH_OWNER_COMPLETE_PENDING_DEPLOY`

## 1. Preflight

This task used the active v2 workflow only. No legacy ChartMini project metrics, GSC/Bing state, historical SERP conclusions, or old-project protection windows were inherited.

Current v2 GSC/Bing performance for this task remains `unknown_not_reverified`.

The requested page was not assumed to be the owner merely because it was supplied by the user.

## 2. Fresh production verification before edit

Production checks were performed against `https://chartmini.com` before changing local code.

Requested target:
- `/blog/risk-management-in-trading-the-hidden-skill-that-separates-winners-from-losers-2026`
- HTTP 200
- exact self-canonical
- present in production sitemap
- numeric `/blog/2026010702` direct 301 to requested target

Competing broad owner:
- `/blog/risk-management-position-sizing-guide`
- HTTP 200
- exact self-canonical
- present in production sitemap

Relevant specialist pages also remained independently indexable, including:
- `/blog/position-sizing-dont-let-one-trade-ruin-your-portfolio-2026`
- `/blog/the-recovery-equation-why-a-50-loss-needs-a-100-gain-to-break-even-and-how-to-survive-drawdowns-2026`

Pre-edit site-graph counts:
- requested target: 1 routable external body-link file
- `/blog/risk-management-position-sizing-guide`: 62 body-link files
- position-sizing specialist: 5 body-link files

The requested target therefore had materially weaker internal ownership evidence than the existing broad risk owner.

## 3. Fresh SERP and current-source review

Fresh searches included:
- `trading risk management position sizing stop loss drawdown guide`
- `site:chartmini.com/blog "risk management" trading ChartMini`
- `site:cmegroup.com education "risk management" trading "position sizing"`
- `site:cmegroup.com education "stop loss" risk management futures`
- `site:finra.org investors "margin" leverage risk losses`
- `site:investor.gov leverage margin risk investor bulletin`

Fresh search surfaced both ChartMini broad risk pages:
- requested target
- `/blog/risk-management-position-sizing-guide`

That is direct evidence of overlapping broad intent rather than a clean separation.

Current primary/authoritative sources reviewed:

### CME Group — Controlling Risk / percentage-risk examples
`https://www.cmegroup.com/education/courses/trade-and-risk-management/controlling-risk`

Key boundary:
- 1% and 2% can be used as educational examples for fixed-fraction risk.
- The useful concept is loss-budget consistency and compounding behavior, not a universal mandatory percentage.

### Investor.gov — Leveraged Investing Strategies
`https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/leveraged-investing-strategies-know-risks-using-these-advanced-investment-tools`

Key boundary:
- leverage can magnify losses;
- margin users can lose more than their initial investment;
- brokers may require additional collateral or liquidate positions according to agreement/rules.

### Investor.gov — Understanding Margin Accounts
`https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-29`

Key boundary:
- buying power is not the same as an acceptable trader risk budget;
- brokers can impose higher house requirements and may liquidate positions according to margin terms.

### FINRA — Understanding the New Intraday Margin Requirements
`https://syndication.finra.org/content/understanding-new-intraday-margin-requirements`

Current 2026 boundary:
- FINRA's new intraday margin requirements became effective June 4, 2026;
- broker transition is permitted through October 20, 2027;
- firms may therefore still be operating under different transition-stage assumptions.

This means a broad 2026 risk-management guide should not hard-code the former `$25,000 PDT / four-times buying-power` framework as universally current.

## 4. Cannibalization / Owner Gate

### Requested target scope

The old requested article covered:
- broad definition of risk management;
- position sizing;
- stop placement;
- fixed 1% rule;
- portfolio/correlation risk;
- daily/weekly loss limits;
- drawdown limits;
- risk-reward;
- pyramiding/trailing/time exits;
- checklist/process rules.

This is not a narrow residual intent. It is a broad trading-risk architecture page.

### Existing owner scope

`/blog/risk-management-position-sizing-guide` already covers:
- eligible risk capital and account basis;
- position-size calculation framework;
- stop execution and adverse fills;
- leverage/margin and liquidation risk;
- portfolio heat/correlation/concentration;
- risk-reward and expectancy;
- session/strategy/drawdown circuit breakers;
- strategy-vs-process failure classification;
- risk-plan documentation;
- risk-policy backtesting;
- ChartMini capability boundaries;
- links into specialist position-sizing, 1% rule, portfolio heat, drawdown, stop/target, order-type, margin, short-selling, options, journal and backtesting owners.

It also has 62 body-level inlink files versus 1 for the requested target and surfaced independently in fresh search.

### Owner Gate result

**`consolidate_redirect + surgical_refresh_owner`**

Reasoning:
1. both pages own the same broad trading-risk intent;
2. the existing owner is far stronger in the site graph;
3. fresh search surfaces both, showing active competition;
4. the existing owner is materially more accurate and already removes universal 1%/2%/2:1/drawdown rules;
5. position sizing, 1% rule, portfolio heat, stop/target, drawdown recovery and other narrower intents already have separate specialist pages;
6. there is no durable unique residual intent that justifies preserving the requested URL as a second 200 owner.

## 5. Problems in the old requested page

The old target contained several deterministic or unsupported rules, including:
- “1% rule is non-negotiable”;
- fixed 3% daily loss stop;
- fixed 7% weekly loss stop;
- fixed 20% maximum drawdown stop;
- mandatory 2:1 risk-reward;
- claims that these rules are what separate winners from losers;
- “never use mental stops” as a universal order prescription;
- fixed ATR/trailing/time-exit settings;
- high-conviction sizing logic;
- deterministic demo-reset timing;
- unsupported claims that ChartMini automatically tracks ATR, volatility regime and live risk sizing.

Because the source is now a redirect source, rewriting its entire body would not improve indexable content. Consolidation is the correct treatment.

## 6. Changes implemented

### A. Requested source converted to redirect source

File:
`content/blog/2026010702.md`

Added:
`redirectTo: /blog/risk-management-position-sizing-guide`

No broad body rewrite was performed because the source becomes non-indexable under current v2 route logic.

### B. Direct redirect architecture

File:
`src/config/chartmini-blog-redirects.json`

Configured direct redirects:
- `/blog/2026010702` -> `/blog/risk-management-position-sizing-guide`
- `/blog/risk-management-in-trading-the-hidden-skill-that-separates-winners-from-losers-2026` -> `/blog/risk-management-position-sizing-guide`

No redirect chain.

Global duplicate redirect-source definitions after build: 0.

### C. Residual body-link cleanup

File:
`content/blog/2026060301.md`

Changed the only remaining canonical body link to the requested duplicate.

The sentence now sends:
- broad `risk management` -> `/blog/risk-management-position-sizing-guide`
- narrow `position sizing` -> `/blog/position-sizing-dont-let-one-trade-ruin-your-portfolio-2026`

Residual body links to requested duplicate after cleanup: 0.

### D. Surgical current-rule refresh of broad owner

File:
`content/blog/2026031201.md`

Changes:
- `dateModified: 2026-08-17`
- retained existing broad owner architecture and FAQ schema
- added current 2026 U.S. securities intraday-margin transition note
- explicitly warns against hard-coding old PDT `$25,000 / 4x buying power` assumptions without checking the broker's currently applied framework
- added FINRA's current intraday-margin requirements source

No broad rewrite was performed because the existing owner was already evidence-based and had 62 canonical inlink files.

## 7. Final owner boundaries

### Broad trading risk
`/blog/risk-management-position-sizing-guide`

Owns:
- broad risk architecture;
- risk capital/account basis;
- trade loss budget;
- stop execution/gap/adverse fill;
- leverage/margin;
- portfolio heat/concentration;
- risk-reward/expectancy interaction;
- circuit breakers/drawdown process;
- risk-plan testing and review.

### Position sizing specialist
`/blog/position-sizing-dont-let-one-trade-ruin-your-portfolio-2026`

Owns beginner risk-per-trade quantity calculation and simulator practice.

### Advanced/cross-market position sizing
`/blog/position-sizing-mastery-the-secret-to-consistent-trading-profits-2026`

Owns detailed fixed-risk, volatility, Kelly and cross-market sizing calculations.

### 1% rule
`/blog/the-1-rule-why-most-traders-get-position-sizing-wrong-2026`

Owns the percentage-convention discussion.

### Drawdown recovery math
`/blog/the-recovery-equation-why-a-50-loss-needs-a-100-gain-to-break-even-and-how-to-survive-drawdowns-2026`

Owns break-even recovery mathematics and drawdown recovery path.

### Stop/target planning
`/blog/how-to-set-stop-loss-and-take-profit-orders-a-guide-to-protecting-your-capital-2026`

Owns invalidation/target/order planning.

### Portfolio heat
`/blog/portfolio-heat-management-the-hidden-risk-that-destroys-traders-2026`

Owns detailed combined-position risk calculations.

## 8. Validation

`pnpm build`
- PASS
- 402 posts generated

`pnpm check`
- PASS
- Biome: 414 files
- Vitest: 5 test files / 13 tests PASS

`pnpm seo:v2:workflow:check`
- PASS
- 13 required workflow files
- 402 Blog Markdown sources

`git diff --check`
- PASS

Generated manifest:
- requested target `redirectTo: /blog/risk-management-position-sizing-guide`
- selected owner `redirectTo: undefined`
- selected owner `dateModified: 2026-08-17`
- position-sizing specialist remains independently routable

Link checks:
- residual requested-target body links: 0
- selected owner body-inlink file count: 62
- selected owner internal Blog destinations: 15/15 valid and non-redirecting
- selected owner manual Article schema: 0
- selected owner manual BlogPosting schema: 0
- FAQPage retained as the only manual secondary schema
- duplicate redirect source definitions: 0

## 9. Deployment / indexing status

No commit.
No push.
No production deployment.
No R2 sync.
No GSC Request Indexing.
No Bing/IndexNow submission.

Production remains pre-Task22.7 until the user deploys the accumulated Task22 batch.

After deployment verify:
1. `/blog/risk-management-position-sizing-guide` = 200 + self-canonical + sitemap + `dateModified: 2026-08-17`;
2. `/blog/2026010702` = direct 301 to owner;
3. old long target = direct 301 to owner;
4. redirect source absent from sitemap;
5. no chain;
6. only the canonical owner should be considered for GSC Request Indexing.

## 10. Final status

`CONSOLIDATE_REDIRECT_SURGICAL_REFRESH_OWNER_COMPLETE_PENDING_DEPLOY`
