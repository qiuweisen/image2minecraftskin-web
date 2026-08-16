# Task 22.1 — How to Start Day Trading

Date: 2026-08-16
Target: `/blog/how-to-start-day-trading`
Source: `content/blog/2026030902.md`
Decision: `retain_narrow + rebuild`
Status: `protected_pending_deploy`

## Authorization

User explicitly authorized Task 22.1 for `/blog/how-to-start-day-trading`.

No commit, push, deployment, R2 sync, GSC submission, Bing submission, or IndexNow submission was authorized.

## Data gate

Current v2 GSC/Bing performance data was not independently re-read for this task and remains:

- GSC: `unknown_not_reverified`
- Bing: `unknown_not_reverified`
- IndexNow: `unknown_not_reverified`

No historical old-project GSC/Bing numbers were imported or used to choose the owner.

Owner selection therefore relied on fresh production behavior, fresh web/SERP direction, the current v2 content graph, current primary-source regulatory evidence, and the existing canonical-link structure.

## Fresh production preflight

Fresh production verification on 2026-08-16 found:

- `https://chartmini.com/blog/how-to-start-day-trading`: HTTP 200
- canonical: exact self-canonical `https://chartmini.com/blog/how-to-start-day-trading`
- target present in production sitemap
- `/blog/2026030902`: direct HTTP 301 to the canonical target
- numeric URL absent from sitemap
- rendered page exposes one route-generated `BlogPosting`
- rendered page exposes zero standalone `Article` schema blocks

The production article was still the March version before Task22.1 deployment.

## Fresh SERP direction

Fresh searches on 2026-08-16 for:

- `how to start day trading`
- `day trading for beginners`
- `how to become a day trader`

showed a broad beginner-roadmap intent rather than a single strategy or simulator intent.

Representative current results included:

- Investopedia — beginner steps, plan, broker/platform, risk and simulation
- Finder — definition, risks, strategies and getting started
- Chart Academy — current 2026 beginner guide including the changed U.S. day-trading rule context
- TradingSim — beginner day-trading guides and strategy/risk education
- TradeZella — beginner roadmap, risk, review and mistakes
- Indeed — day-trader role and starting steps

The repeated SERP modules/sections across these results were:

1. what day trading is;
2. whether it suits a beginner;
3. market/account selection;
4. current capital/margin/account rules;
5. market mechanics and order execution;
6. risk management;
7. choosing/building a strategy;
8. simulator/paper-trading practice;
9. journaling/review;
10. live-transition considerations;
11. FAQ around capital, PDT, time-to-learn and equipment.

This supports a comprehensive beginner roadmap as the search-intent owner.

## Current 2026 regulatory evidence

The old target was materially stale on U.S. stock day-trading rules.

Fresh primary-source review found:

### SEC

`SR-FINRA-2025-017` was approved by the SEC on 2026-04-14, replacing FINRA's old day-trading margin provisions with intraday margin standards.

Source:
`https://www.sec.gov/rules-regulations/self-regulatory-organization-rulemaking/sr-finra-2025-017`

### FINRA — new intraday margin requirements

FINRA states:

- effective date: 2026-06-04;
- no $25,000 day-trading minimum after a firm transitions to the new framework;
- no Pattern Day Trader designation based on counting trades under the new framework;
- account risk is handled through intraday margin requirements/deficits;
- $2,000 remains the minimum equity needed to engage in leveraged margin trading, while firms may require more;
- broker-dealers can continue the old day-trading framework during a transition period through 2027-10-20.

Source:
`https://syndication.finra.org/content/understanding-new-intraday-margin-requirements`

### FINRA — cash-account settlement

FINRA's current guidance confirms most U.S. securities settle T+1 and warns frequent cash-account traders about settled-funds requirements, free-riding and good-faith violations.

Sources:

- `https://www.finra.org/investors/insights/understanding-settlement-cycles`
- `https://syndication.finra.org/content/frequent-intraday-trading-understanding-basics`

### Investor.gov

Investor.gov continues to describe day trading as extremely risky and capable of producing substantial losses quickly.

Source:
`https://www.investor.gov/introduction-investing/investing-basics/glossary/day-trading`

### CFTC

CFTC guidance was used to keep futures/forex discussion conservative:

- different markets have different structures and risks;
- leverage amplifies losses;
- U.S. retail forex is commonly an OTC dealer relationship and dealer registration/terms matter.

Sources:

- `https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html`
- `https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_SocialMedia_Metals.html`

## Cannibalization / Owner Gate

Fresh current-v2 site review found no stronger broad `how to start day trading` owner.

The target already has 38 current Markdown files linking directly to `/blog/how-to-start-day-trading`, which is far above the v2 minimum inbound requirement and is a strong existing owner signal.

Important neighbors remain distinct:

### `/blog/trading-simulator-for-beginners`

Owns simulator/practice-path selection only. It explicitly says it is not the broad day-trading beginner roadmap and directly hands that intent to `/blog/how-to-start-day-trading`.

### `/day-trading-simulator`

Product/tool owner. It owns historical intraday replay, not broker/account/market/risk/strategy education.

### `/intraday-trading-practice`

Product/practice-process owner. It owns structured preparation/practice/review, not the complete live-start roadmap.

### `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`

Owns style selection/comparison, not how to start day trading.

### `/blog/the-5-deadly-day-trading-mistakes-that-will-blow-up-your-account-in-2026-2026`

Owns mistakes/risk-behavior examples, not beginner setup and account onboarding.

### `/blog/minimalist-day-trading-desk-setup`

Owns equipment/workstation intent only.

### `/blog/day-trading-practice-simulator-replay-session`

Owns one structured replay-session workflow.

Owner Gate result: `retain_narrow + rebuild`.

Owner boundary after Task22.1:

- target owns: broad beginner day-trading roadmap, market choice, account/rule awareness, core execution mechanics, one-testable-setup plan, risk-before-entry, simulation/paper practice, journaling, live-transition evidence, current 2026 U.S. intraday-margin transition and beginner FAQ;
- simulator/tool pages own simulator selection and product use;
- trading-style page owns day vs swing vs investing comparison;
- dedicated risk/journal/trading-plan pages own their deeper specialist frameworks;
- mistakes article owns mistake-focused intent;
- desk article owns hardware/workstation intent.

No consolidation or redirect is warranted.

## Pre-edit defects

The old target had several material quality and factual problems:

- opened with unsupported `approximately 90% lose / 10% consistently profit` framing;
- claimed the profitable minority shares one preparation pattern without evidence;
- treated the old $25,000 PDT minimum as universally current in 2026;
- recommended forex or Micro E-mini futures to beginners mainly because of lower capital/PDT avoidance;
- gave hard minimum capital numbers for stocks, forex, futures and crypto without provider/product context;
- presented a universal 1–2% per-trade risk rule;
- presented a universal 2:1 reward/risk requirement;
- prescribed a fixed 100-trade test threshold as proof of readiness;
- prescribed a fixed 6–12 month profitability timeline;
- prescribed fixed live scaling by Month 1 / Month 2 / Month 3+;
- prescribed a fixed daily trade count and fixed trading-session schedule;
- described VWAP as tending to `snap back` in a way that could be read as a dependable rule;
- included manual `Article` JSON-LD even though the v2 route generates the primary BlogPosting schema;
- did not accurately explain ChartMini's current intraday product boundary.

## Rebuild

Final metadata:

- title/H1: `How to Start Day Trading in 2026: A Beginner's Step-by-Step Roadmap`
- dateModified: `2026-08-16`
- description rewritten around markets, account rules, risk, strategy testing, simulation, journaling and the current intraday-margin transition.

Final article length: about 3,169 words.

Major content changes:

- direct answer in the opening 150 words;
- beginner checklist;
- day-trading definition and market-style boundary;
- market-selection table without fake universal minimum deposits;
- dedicated 2026 U.S. intraday-margin transition section;
- clear broker-transition caveat through 2027-10-20;
- current cash-account/T+1 settlement explanation;
- execution mechanics before strategies;
- one-testable-setup trading-plan framework;
- risk-before-entry position-sizing example without universal risk percentage;
- simulation vs paper-trading role separation;
- accurate ChartMini product limitation;
- no universal simulated-trade count;
- journal fields and process/P&L separation;
- evidence-based transition-to-live criteria rather than calendar rules;
- flexible pre/during/post-session routine;
- common beginner mistakes;
- current FAQ covering capital, PDT transition, cash accounts, small accounts, practice duration, strategy, hardware and gambling framing;
- primary-source references with 2026-08-16 recheck note.

Manual Article schema was removed.

## ChartMini capability boundary

Current project copy was rechecked before rewriting the article.

ChartMini is described as:

- a historical replay/practice tool;
- intraday mode using historical 5-minute forex and crypto data;
- future candles hidden while users make simulated decisions;
- not a live broker execution simulator;
- not a source of real-time routing, actual fills, live spreads or slippage modeling.

The article does not claim intraday stock replay because the current product copy limits intraday historical replay to forex and crypto.

## Internal links

The rebuilt target contains nine body-level `/blog/...` internal links plus direct product links.

Manifest validation after rebuild confirmed all nine blog destinations are current routable canonical owners and none is a redirect source:

- `/blog/a-beginners-guide-to-reading-trading-charts-2026`
- `/blog/a-complete-guide-to-us-stock-market-trading-hours-2026`
- `/blog/day-trading-practice-simulator-replay-session`
- `/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`
- `/blog/how-to-build-trading-plan`
- `/blog/how-to-keep-trading-journal`
- `/blog/minimalist-day-trading-desk-setup`
- `/blog/risk-management-position-sizing-guide`
- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`

Direct product links include:

- `/day-trading-simulator`
- `/intraday-trading-practice`

Target inbound coverage before the rebuild was already 38 direct Markdown canonical-link files, so no artificial inbound-link additions were required.

## Validation

Completed so far:

- `pnpm build`: PASS; 402 blog posts generated.
- article internal blog-link validation: PASS; 9/9 blog links routable and non-redirecting.
- manual Article schema check: PASS; none remains in target source.
- rebuilt article length: about 3,169 words.
- `pnpm check`: PASS.
- Biome: PASS; 414 files checked, no fixes required.
- Vitest: PASS; 5 test files / 13 tests.

- `pnpm seo:v2:workflow:check`: PASS; 13 required workflow files and 402 blog Markdown sources detected.
- `git diff --check`: PASS.
- generated manifest target count: 1.
- target `redirectTo`: none.
- direct canonical Markdown inlink files: 38.

Final local result: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`.

## Deployment boundary / next action

Task22.1 is locally complete and should remain `protected_pending_deploy` until the user deploys it.

After deployment:

1. verify target returns 200;
2. verify exact self-canonical;
3. verify the new title, description, body and `dateModified: 2026-08-16` are live;
4. verify one BlogPosting and no duplicate Article schema;
5. verify target remains in sitemap;
6. verify `/blog/2026030902` remains a direct 301 to target;
7. if the user wants GSC action, check whether the canonical is already indexed and submit only the canonical owner if appropriate;
8. establish 7-day and 14-day observation dates from the actual deployment/indexing event.

Do not submit `/blog/2026030902` to GSC.

No current GSC/Bing performance claim is made.
