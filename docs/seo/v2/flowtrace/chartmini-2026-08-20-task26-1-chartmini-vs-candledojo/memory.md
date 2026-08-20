# Task 26.1 — ChartMini vs CandleDojo Comparison

Date: 2026-08-20
Target: `/blog/chartmini-vs-candledojo-comparison`
Source: `content/blog/2026031603.md`
Numeric: `/blog/2026031603`

## Requested task

Complete Task26.1 for the existing ChartMini vs CandleDojo comparison using the current v2 Workflow: fresh production, fresh SERP, current product evidence, cannibalization / Owner Gate, factual-risk review, rebuild, internal-link support, validation, Flowtrace and Workflow sync.

## Fresh preflight

Production was checked before editing.

- Canonical target: HTTP 200.
- Canonical tag: `https://chartmini.com/blog/chartmini-vs-candledojo-comparison`.
- Production sitemap: canonical target present.
- Numeric `/blog/2026031603`: direct HTTP 301 to the canonical target.
- Production route schema: one route-generated `BlogPosting` was detected.
- Pre-edit `dateModified`: 2026-03-16.
- Local source remained an indexable Owner and had no `redirectTo`.
- Current GSC performance / URL Inspection state: `unknown_not_reverified`.
- Current Bing / IndexNow state: `unknown_not_reverified`.
- Effective body-level canonical inlinks before Task26.1: 0.

No legacy GSC/Bing metric was imported.

## Fresh SERP / competitor evidence

Fresh 2026-08-20 search for `ChartMini vs CandleDojo`, `CandleDojo trading simulator`, and related comparison intent surfaced CandleDojo's dedicated `/vs/chartmini` page as the dominant direct comparison result. ChartMini's own comparison page did not surface in the fresh search set.

This confirms a real brand-comparison intent rather than a generic simulator intent. The target should therefore remain independent rather than merge into the broad simulator hub or generic simulator-ranking pages.

Current CandleDojo evidence reviewed from its official public pages:

- `https://candledojo.app/vs/chartmini`
- `https://candledojo.app/about`
- `https://candledojo.app/methodology`
- `https://candledojo.app/data`
- `https://candledojo.app/challenge`

Current official positioning / mechanics confirmed:

- CandleDojo is a chart-reading training product, not a broker, paper-trading platform, or full backtesting suite.
- The user sees a frozen historical chart, commits Long or Short, then receives replay and feedback.
- The scoring method uses a fixed 30-candle replay window.
- Scenario acceptance is tied to a higher-timeframe 10-period EMA trend framework.
- Flat / ambiguous periods are filtered from the practice set.
- Each scenario uses paired higher/lower timeframes.
- Current methodology lists 15m/1m, 4h/15m and Daily/4h pairs.
- Progress includes XP / belts; the methodology explicitly says belts are cumulative-XP based, not evidence of live performance.
- Current public product pages describe free guest practice and a free-account allowance; the current guest challenge does not require signup to try.
- Current official data pages describe a deliberately small practice set centered on BTC/USDT, EUR/USD, USD/JPY and XAU/USD.

Current ChartMini evidence reviewed from production, v2 source and current ChartMini workflow articles:

- `/play`
- `/blog/market-replay-how-to-practice-trading-with-historical-charts`
- `/blog/free-trading-simulator-no-signup`
- v2 simulator controls / session stores

Current ChartMini mechanics confirmed:

- core browser replay is available without signup;
- Daily Replay covers stocks, forex and crypto;
- Intraday Replay currently covers forex and crypto using five-minute source candles with broader displayed chart periods;
- replay hides later historical candles;
- controls support Buy, Sell, quantity and Next Bar;
- the simulator maintains simplified positions and virtual P&L / trade-session records;
- no native stop-loss or take-profit broker-order workflow exists in the core replay;
- ChartMini does not reproduce broker routing, Level 2, order-book queue, all fees/spreads/slippage/latency, or exact live fills.

## Cannibalization / Owner Gate

Relevant nearby ChartMini owners were reviewed:

- `/blog/evaluate-trading-simulator-features` — feature-selection framework, not a brand-vs-brand owner.
- `/blog/free-vs-paid-trading-simulator` — cost / access-model decision, not CandleDojo-specific.
- `/blog/free-trading-simulator-no-signup` — no-signup ChartMini access intent.
- `/blog/market-replay-vs-backtesting-vs-paper-trading` — practice-method selection.
- `/blog/what-is-a-trading-simulator` — simulator taxonomy.
- `/blog/best-day-trading-simulators-2026-honest-comparison` — broad multi-product ranking/comparison.

No second indexable ChartMini page was found that owns the exact `ChartMini vs CandleDojo` brand-comparison intent.

Owner Gate: `retain_narrow + rebuild`.

Confirmed intent key:

`chartmini_vs_candledojo_replay_vs_scored_chart_reading`

Owner boundary:

- direct ChartMini vs CandleDojo comparison;
- open-ended replay vs structured directional drill distinction;
- current account/access differences;
- current feedback/scoring differences;
- market/timeframe coverage differences;
- simulated-position/P&L vs no-virtual-position distinction;
- scenario curation vs random replay;
- which practice job each tool fits;
- explicit limitations and fair-use-both guidance.

Generic simulator evaluation, broad rankings and general paper/replay definitions remain with their existing owners.

## Problems in the previous body

The previous article was too adversarial and contained material factual / evidence problems:

- described CandleDojo primarily as a `candlestick pattern quiz app`, understating its two-timeframe and replay/scoring design;
- claimed CandleDojo required account creation to start, which conflicts with the current guest challenge;
- claimed CandleDojo had paid tiers without current evidence from the checked public pages;
- called CandleDojo app-based in a way that implied ChartMini had a browser-access advantage even though CandleDojo is also browser accessible;
- claimed ChartMini natively let users set stop losses and targets, which the current product does not;
- overstated ChartMini as training `all seven` trading skills and `full trade execution`;
- used unsupported absolutes such as directional prediction being the least important trading skill;
- used deterministic examples such as a trader with a specific win rate / R:R being profitable or unprofitable;
- treated curated scenarios as inherently cherry-picked or inferior instead of documenting their training trade-off;
- treated gamification as having zero correlation with live performance without evidence;
- implied a positive P&L over a fixed number of simulated trades meant live readiness;
- manually embedded `Article` JSON-LD even though the v2 route already generates BlogPosting.

These issues weakened trust, factual precision, GEO citability and legal/editorial defensibility.

## Implementation

Rebuilt `content/blog/2026031603.md` as a neutral, source-backed role comparison.

New title:

`ChartMini vs CandleDojo: Replay Simulator vs Chart-Reading Drills`

`dateModified: 2026-08-20`

New description focuses on practice style, feedback, markets, account requirements, replay controls, scoring and limitations.

New content structure:

- direct Quick Answer suitable for search and AI extraction;
- current side-by-side feature table;
- explicit updated-date disclosure;
- training-loop comparison;
- CandleDojo strengths;
- ChartMini strengths;
- feedback-system distinction;
- curated-scenario vs random-replay trade-off;
- beginner-fit guidance;
- complementary two-stage workflow;
- explicit neither-tool execution limitations;
- job-based final verdict table;
- visible FAQ;
- source / verification disclosure identifying ChartMini as the publisher and not an independent review.

Removed the manual Article/BlogPosting schema.

## Factual corrections made

- Replaced `CandleDojo requires an account` with current guest-first access wording.
- Removed unverified paid-tier language.
- Replaced `CandleDojo is just a quiz` framing with its documented 30-candle, EMA-aligned, two-timeframe scoring methodology.
- Replaced `ChartMini has native stop loss / target` with the correct current boundary: simplified Buy/Sell/quantity/replay controls; stop/target rules must be recorded separately.
- Replaced `ChartMini trains full execution` with simplified simulated decision / position / P&L language.
- Removed fixed simulated-trade readiness thresholds.
- Replaced winner-take-all claims with a practice-job decision framework.
- Added explicit disclosure that the page is published by ChartMini and is not an independent third-party review.

## Internal-link changes

The target had zero effective body-level canonical inlinks before Task26.1.

Added three direct contextual canonical support links from non-protected neighboring pages:

- `content/blog/2026042102.md` — `/blog/evaluate-trading-simulator-features`
- `content/blog/2026060201.md` — `/blog/free-trading-simulator-no-signup`
- `content/blog/2026042101.md` — `/blog/free-vs-paid-trading-simulator`

Effective body support after Task26.1: 3 source files.

The rebuilt target links to current final-owner ChartMini pages including:

- Market Replay tutorial
- No-Signup Simulator guide
- Simulator Evaluation checklist
- Market Replay vs Backtesting vs Paper Trading

It also links directly to CandleDojo official source pages for competitor-sensitive claims.

## Redirect / canonical architecture

No redirect change was required.

Local / production architecture remains:

- `/blog/chartmini-vs-candledojo-comparison` = canonical Owner.
- `/blog/2026031603` -> canonical Owner via direct permanent redirect.
- Long canonical is not a redirect source.

No consolidation was justified.

## Validation

Initial full validation after content and support-link changes: PASS.

- `pnpm build`
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check`
  - Biome 415 files
  - Vitest 6/6 test files
  - 17/17 tests
- `pnpm seo:v2:workflow:check` — PASS
- `git diff --check` — PASS

Final Workflow-synced validation is rerun after the Flowtrace / governance files are updated.

## Deployment / indexing state

Not performed:

- commit
- push
- deployment
- R2 sync
- GSC Request Indexing
- Bing / IndexNow submission

Current GSC / Bing state remains `unknown_not_reverified`.

After deployment, verify:

- canonical returns 200;
- self-canonical remains exact;
- new title / description / body / `dateModified` are live;
- production route renders one BlogPosting and no duplicate Article;
- sitemap still contains only the canonical owner;
- `/blog/2026031603` remains a direct 301;
- three supporting canonical inlinks are live.

Only the canonical should be considered for GSC inspection / Request Indexing after deployment. Never submit the numeric redirect URL.

## Final task status

`RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
