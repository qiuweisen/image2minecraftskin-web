# Task 20.4 — Finviz Heatmap / Maps Owner Recovery

Date: 2026-08-14
Project: ChartMini v2
Target: `/blog/finviz-elite-heatmap-market-visualization-made-simple-2026`
Source: `content/blog/2026012301.md`
Decision: `retain_narrow + rebuild`
Status: `protected_pending_deploy`

## 1. Preflight

Production target was rechecked against the current v2 deployment before editing.

- `https://chartmini.com/blog/finviz-elite-heatmap-market-visualization-made-simple-2026` returned HTTP 200.
- Production self-canonical matched the target URL.
- Target was present in `https://chartmini.com/sitemap.xml`.
- Legacy numeric `/blog/2026012301` returned a direct HTTP 301 to the canonical target.
- Current production title/H1 was `Finviz Elite Heatmap: Market Visualization Made Simple`.

Current-v2 data access remained unavailable:

- `claude-seo`: unavailable.
- `BING_WEBMASTER_API_KEY`: absent.
- `INDEXNOW_KEY`: absent.

Therefore GSC/Bing metrics remain `unknown_not_reverified`. No legacy metrics or submission state were imported.

## 2. Fresh SERP / primary-source evidence

Fresh web/SERP research on 2026-08-14 was run around:

- `finviz heatmap guide`
- `finviz heatmap how to use`
- `finviz elite review heatmap`
- `finviz map sectors heatmap`

Primary Finviz evidence used:

- `https://finviz.com/map`
- `https://finviz.com/help/faq`
- `https://finviz.com/help/elite.ashx`
- `https://finviz.com/blog/evolving-the-heatmap-dow-jones-nasdaq-100-russell-2000-and-more/`
- `https://finviz.com/blog/new-stock-market-maps-for-market-cap-52-week-highs-lows-themes-and-insider-trading/`
- `https://finviz.com/blog/new-finviz-homepage-features-for-elite-members/`

Current evidence establishes:

1. Finviz Heatmaps/Maps are not Elite-only. Finviz explicitly stated that its Heatmaps remain free.
2. Elite adds real-time Maps data and intraday Map timeframes.
3. Current Maps include S&P 500, Dow 30, Nasdaq 100, Russell 2000, All Stocks, Market Cap, World, ETFs, Crypto, Futures, and Themes.
4. The S&P 500 Map states that size represents market capitalization.
5. 2026 additions include market-cap, 52-week high/low, Themes, insider-trading and Groups heatmap views.
6. June 2026 Elite homepage changes include session/filter/auto-refresh/after-hours controls and the ability to display two Maps at the same time.
7. Current Finviz FAQ listed Monthly $39.50, Annual $299.50, and a 7-day Elite trial as of the verification date. Pricing/trial terms were treated as dated and changeable.

## 3. Owner Gate / cannibalization

### Owner decision

Retain the target URL and rebuild it as the single v2 owner for:

- how to read Finviz Heatmaps / Maps;
- tile size, color, sector and industry grouping;
- breadth vs mega-cap concentration;
- current Map universes and 2025–2026 Map changes;
- free Heatmaps vs Finviz Elite Maps capabilities;
- safe use of a heatmap as a discovery layer rather than a trade signal.

### Neighbor boundaries

- `/blog/how-to-find-stocks-to-trade` owns the general screener-to-watchlist stock-discovery workflow.
- `/blog/how-to-build-stock-watchlist` owns ongoing watchlist construction and maintenance.
- `/blog/tradingview-screener-finding-winning-stocks-in-minutes-2026` owns TradingView Screener usage.
- `/blog/sector-rotation-strategy` owns sector-rotation strategy and longer-horizon relative-strength analysis.
- Task 20.4 does not claim to own generic sector rotation, generic stock screening, or portfolio allocation.

No second routable Finviz-specific Heatmap article was found in current v2 content.

## 4. Problems found in the pre-Task20.4 article

The old article had multiple factual/quality problems:

- framed the Heatmap as effectively an Elite product even though Finviz says Heatmaps remain free;
- asserted broad customizable heatmap metrics/features without current verification;
- used unsupported deterministic statements about sector rotation, momentum, mean reversion and trading edge;
- treated visual performance as evidence of capital flow;
- stated that the Elite subscription would pay for itself for most active traders;
- described stale/unsupported historical heatmap and intraday behavior as universal current capabilities;
- contained manual Article JSON-LD that is unnecessary under the v2 route-generated BlogPosting schema;
- ended with a false ChartMini integration claim saying ChartMini automatically imports Finviz heatmap data and sends sector-rotation alerts.

## 5. Changes made

### Target rebuild

`content/blog/2026012301.md` was rebuilt around current verified Maps behavior.

New title:
`Finviz Heatmap Guide: How to Read Market Maps and What Elite Adds`

New meta title:
`Finviz Heatmap Guide 2026: Free Maps vs Elite`

Added `dateModified: 2026-08-14`.

The rebuilt article now includes:

- answer-first distinction that Heatmaps are free and Elite adds real-time/intraday capabilities;
- tile-size/color/grouping interpretation table;
- step-by-step Map reading workflow;
- breadth vs concentration analysis;
- current Map-universe list;
- Free vs Elite capability table;
- dated current pricing/trial snapshot with change warning;
- 2025–2026 Maps product changes;
- non-predictive reading patterns;
- clear boundary between performance heatmaps and actual fund-flow data;
- guidance on using Maps as discovery, then verifying with screener/watchlist/chart/catalyst/risk work;
- FAQ and official source notes;
- explicit correction that ChartMini does not import/synchronize Finviz Elite data or alerts.

Manual Article JSON-LD was removed so v2 route schema remains the primary structured-data source.

### Internal links / cluster boundary

The target now links to current v2 owners for:

- stock discovery;
- stock watchlists;
- sector rotation;
- TradingView Screener;
- Market Replay tutorial and product route.

Three direct Markdown inlinks now point to the canonical Task20.4 URL:

1. `content/blog/2026012201.md` — TrendSpider related-post link updated from numeric `/blog/2026012301` to canonical slug.
2. `content/blog/2026012401.md` — OptionStrat related-post link updated from numeric URL to canonical slug.
3. `content/blog/2026040502.md` — Sector Rotation heatmap section now links to Task20.4 and explicitly distinguishes performance visualization from fund-flow data.

No remaining Markdown inlinks use `/blog/2026012301`.

## 6. Validation

Validation completed successfully after the rebuild:

- `pnpm build` — PASS.
- `pnpm check` — PASS.
- Vitest — 3/3 PASS.
- `git diff --check` — PASS.
- `pnpm seo:v2:workflow:check` — PASS.
- Generated blog manifest still contains 402 Markdown posts.
- Target manifest count: 1.
- Generated target metadata contains the new title/meta title/description/dateModified.
- All target internal blog slugs checked during Task20.4 exist in current v2 content.

## 7. Production / indexing state

No deployment, R2 content sync, commit, push, GSC Request Indexing, Bing submission, or IndexNow submission was performed.

Production therefore still serves the pre-Task20.4 article until the user deploys/syncs the new v2 content.

After actual deployment:

1. verify HTTP 200 and self-canonical;
2. verify new title/meta/body/dateModified;
3. verify sitemap membership;
4. verify `/blog/2026012301` still redirects directly to the canonical URL;
5. verify the three canonical inbound links in production;
6. obtain fresh GSC/Bing evidence if access becomes available;
7. establish actual 7-day and 14-day observation dates from the real deployment/indexing event.
