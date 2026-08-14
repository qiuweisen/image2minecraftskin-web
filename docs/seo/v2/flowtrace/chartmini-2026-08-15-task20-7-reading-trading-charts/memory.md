# Task 20.7 — Beginner Trading Chart Reading

Date: 2026-08-15
Baseline generation: v2
Target URL: `/blog/a-beginners-guide-to-reading-trading-charts-2026`
Source: `content/blog/2025102201.md`
Decision: `retain_narrow + rebuild`
Status: `protected_pending_deploy`

## Goal

Recover and sharpen the broad beginner intent for "how to read trading charts" without cannibalizing the stronger v2 owners for candlestick mechanics, candlestick patterns, market structure, price action, support/resistance, volume, or the broader technical-analysis system.

## Production preflight

Verified before modification:

- target HTTP 200;
- self-canonical to the requested URL;
- target present in current production sitemap;
- `/blog/2025102201` returns direct permanent 301 to target;
- production still served the pre-Task20.7 article;
- target source was `content/blog/2025102201.md`.

Current-v2 GSC/Bing data was not available:

- `claude-seo`: unavailable;
- `BING_WEBMASTER_API_KEY`: absent;
- `INDEXNOW_KEY`: absent.

Status therefore remains `unknown_not_reverified`. No old-project GSC/Bing values were imported.

## Fresh SERP / primary-source evidence

Fresh web search on 2026-08-15 for variants of "how to read trading charts" showed the broad beginner intent repeatedly covering:

1. what a trading chart is;
2. chart types;
3. OHLC/candlestick anatomy;
4. timeframe selection;
5. trend or market structure;
6. support/resistance;
7. volume or other context;
8. a beginner practice workflow.

Primary/current references used:

- Fidelity, `3 tips for setting up your charts` (2025-12-18): emphasizes time frame, chart type, and benchmark before interpretation.
- Fidelity, `What is technical analysis?` (2026-06-10): frames technical analysis around charts, patterns, overlays, oscillators, price, volume, volatility and momentum.
- Nasdaq candlestick glossary: defines a candlestick as displaying open, close, high and low for the period.
- Charles Schwab, `Use Support and Resistance to Read Stock Charts`: beginner support/resistance education.

## Cannibalization / Owner Gate

The current v2 cluster contains stronger specialist owners:

- `content/blog/2025101401.md` — single-candlestick/OHLC beginner owner;
- `content/blog/2025121601.md` — complete candlestick-reading workflow;
- `content/blog/2026031002.md` — named candlestick-pattern owner;
- `content/blog/2026041001.md` — general market-structure owner;
- `content/blog/2026011601.md` — no-indicator price-action workflow;
- `content/blog/2026032501.md` — broader price-action strategy owner;
- `content/blog/2026010704.md` — broader technical-analysis framework.

Current direct canonical inlink counts before Task20.7 showed these specialist pages were much stronger than the requested page. The target itself had only one old numeric inbound reference and no second title-level page matching the exact broad "reading trading charts" wording.

Fresh SERP also supports a broad chart-literacy page distinct from those specialist topics.

Owner Gate result: `retain_narrow + rebuild`.

### Task20.7 owner boundary

This URL owns the **first-read workflow for a beginner opening a generic trading chart**:

- identify instrument and data source;
- identify timeframe/bar interval;
- identify chart type;
- read axes/scale;
- understand one OHLC bar/candle at a high level;
- classify uptrend/downtrend/range/transition at a high level;
- mark basic support/resistance areas;
- interpret volume only after identifying what the field measures;
- add indicators only after basic chart literacy;
- practice the same sequence without hindsight.

It does **not** own deep candlestick geometry, named patterns, BOS/CHoCH, price-action strategy, support/resistance construction rules, volume methodology, or indicator-system design.

## Before-state problems

The old article was approximately 800 words and had several weaknesses:

- generic/low-quality description text (`A Beginner Expert guide...`);
- manual legacy `Article` schema inside Markdown;
- overbroad but shallow chart-type descriptions;
- timeframe-to-trading-style mappings presented too rigidly;
- "volume confirms price move" wording without market/data-source caveats;
- no discussion of instrument/data source/session/adjustment context;
- no discussion of chart scale;
- insufficient distinction between an observation and a forecast;
- no strong intent boundary versus current specialist v2 pages;
- only weak/internal numeric-link support.

## Modifications

### Main target

Rebuilt `content/blog/2025102201.md`.

New metadata:

- H1: `How to Read Trading Charts: A Beginner's Step-by-Step Guide`
- Meta title: `How to Read Trading Charts: Beginner Guide 2026`
- `dateModified: 2026-08-15`
- new descriptive meta description focused on the broad chart-reading sequence;
- categories/tags aligned with beginner chart reading and technical analysis.

The rebuilt article is approximately 3,160 words and includes:

- direct answer and key takeaways;
- line vs OHLC vs candlestick chart types;
- instrument/price-source/session context;
- timeframe and bar-interval interpretation;
- linear vs logarithmic scale awareness;
- OHLC/candle basics without replacing the specialist candle owners;
- basic market-structure classification;
- support/resistance as observation areas, not guaranteed reversal levels;
- volume-source caveats for stocks/futures vs decentralized forex vs venue-specific crypto;
- indicator-use boundary;
- 8-step beginner chart-reading workflow;
- explicit internal-content learning map;
- hindsight-resistant historical replay practice;
- common beginner mistakes;
- FAQ;
- current source/verification notes.

Removed the old manual `Article` JSON-LD because the v2 route generates BlogPosting/BreadcrumbList/Person/site schema.

### Internal links

Validated every internal blog slug in the rebuilt target against the generated v2 manifest.

Added two scoped canonical inbound links:

1. `content/blog/2025101401.md` — candlestick beginner related-reading block now links to the broader chart-reading owner.
2. `content/blog/2026010704.md` — technical-analysis framework related-reading block now links to the broader chart-reading owner.

One migrated/nonexistent internal slug used during drafting was detected before build and replaced with the current canonical technical-analysis slug.

The existing numeric reference in `content/blog/2025110701.md` is inside a source that already redirects elsewhere and is not an active routable content owner; it was not treated as a live inlink signal.

## Validation

Passed after the final source edits:

- `pnpm build` — PASS;
- blog manifest generated 402 posts;
- `pnpm check` — PASS;
- Vitest — 3/3 PASS;
- `git diff --check` — PASS;
- `pnpm seo:v2:workflow:check` — PASS;
- target manifest count — 1;
- all target internal blog links — valid current v2 slugs;
- manual Article/FAQ schema in target — none.

Final target manifest metadata:

- title: `How to Read Trading Charts: A Beginner's Step-by-Step Guide`
- metaTitle: `How to Read Trading Charts: Beginner Guide 2026`
- date: `2025-10-22`
- dateModified: `2026-08-15`
- canonical slug unchanged.

## Deployment / indexation state

Not performed:

- commit;
- push;
- deployment;
- R2 content sync;
- GSC Request Indexing;
- Bing / IndexNow submission.

After actual deployment, verify the new target metadata/body/canonical/sitemap state and `/blog/2025102201` redirect, then establish real 7-day and 14-day observation dates from the deployment/indexing event.
