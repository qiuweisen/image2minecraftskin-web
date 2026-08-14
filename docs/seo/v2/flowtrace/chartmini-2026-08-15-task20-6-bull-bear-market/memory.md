# Task 20.6 — Bull Market vs Bear Market Owner Consolidation

Date: 2026-08-15
Project: ChartMini v2
Requested URL: `/blog/bull-market-vs-bear-market-trading-strategies-for-different-market-conditions-2026`
Requested source: `content/blog/2025122201.md`
Selected canonical owner: `/blog/bull-market-vs-bear-market`
Owner source: `content/blog/2026032701.md`
Decision: `consolidate_to_short_owner + rebuild`
Status: `protected_pending_deploy`

## 1. Preflight

Production checks performed before modification:

- Requested long URL returned HTTP 200.
- Requested long URL was self-canonical.
- Requested long URL appeared in the production sitemap.
- `/blog/bull-market-vs-bear-market` also returned HTTP 200.
- The short URL was also self-canonical and appeared in the production sitemap.
- `/blog/2025122201` was already configured as a permanent redirect to the requested long URL.
- `/blog/2026032701` was already configured as a permanent redirect to the short URL.

This meant v2 production had two simultaneously indexable URLs covering essentially the same general bull-market / bear-market definition and strategy intent.

## 2. Current-v2 data gate

Fresh GSC/Bing performance values were not available during Task 20.6:

- `claude-seo`: unavailable in current shell.
- `BING_WEBMASTER_API_KEY`: absent.
- `INDEXNOW_KEY`: absent.

Task 20.6 therefore does not import or rely on legacy GSC/Bing metrics. Current-v2 values remain `unknown_not_reverified`.

## 3. Fresh SERP / source review

Fresh web review was performed for:

- `bull market vs bear market trading strategies`
- `bull market vs bear market how to trade both`
- official Investor.gov bull-market and bear-market definitions
- Fidelity bull-vs-bear educational guidance
- Investor.gov short-selling and leveraged/inverse ETF risk material

Fresh search intent is mixed educational + practical:

1. define bull vs bear markets;
2. explain how to identify the environment;
3. explain how trader behavior / strategy selection can change;
4. distinguish broad market labels from exact trade-entry rules;
5. cover corrections / ranges / transitions;
6. address risk in bearish strategies rather than treating shorting as the default.

Primary-source facts used in the rebuild:

- Investor.gov describes bull markets as periods of rising prices / optimistic sentiment and bear markets as periods of falling prices / pessimistic sentiment, with 20% conventions commonly used for broad indexes.
- Fidelity notes that the bear-market 20% convention is more concrete than the bull-market definition, which is used less uniformly.
- Investor.gov notes that short selling can expose traders to theoretically unlimited losses as stock prices can keep rising.
- Investor.gov warns that many leveraged/inverse ETFs target daily results and can diverge materially from a simple inverse/leveraged benchmark return over longer holding periods.

## 4. Cannibalization / Owner Gate

Two live v2 pages covered the same core intent:

### Requested long URL

- URL: `/blog/bull-market-vs-bear-market-trading-strategies-for-different-market-conditions-2026`
- Source: `content/blog/2025122201.md`
- Production: 200, self-canonical, sitemap member before Task 20.6.
- Direct canonical-slug Markdown inlinks before Task 20.6: 0.
- Numeric `/blog/2025122201` Markdown inlinks before Task 20.6: 2.
- Fresh web search still surfaced the older ChartMini article through the numeric legacy URL, so redirect preservation matters.

### Short URL

- URL: `/blog/bull-market-vs-bear-market`
- Source: `content/blog/2026032701.md`
- Production: 200, self-canonical, sitemap member before Task 20.6.
- Direct canonical Markdown inlinks before Task 20.6: 17.
- Current v2 article text elsewhere repeatedly treats this short URL as the general cross-asset bull/bear-market owner.

### Owner decision

Selected `/blog/bull-market-vs-bear-market` as the single owner because:

- it is the cleaner evergreen URL;
- the current v2 internal-link graph already gives it substantially stronger ownership (17 direct Markdown inlinks versus 0 canonical inlinks to the long URL);
- multiple current v2 articles explicitly route generic bull/bear definitions and market-regime context to the short URL;
- consolidating the older URL with permanent redirects preserves the older crawl/search signals rather than discarding them;
- keeping both indexable would preserve unnecessary cannibalization.

Decision: `consolidate_to_short_owner + rebuild`.

## 5. Owner boundary

The rebuilt short URL owns:

- bull-market vs bear-market definitions;
- 20% convention and its limitations;
- bull / bear / range regime comparison;
- broad regime-identification workflow using benchmark, timeframe, market structure, participation and volatility;
- how strategy components may change across regimes;
- bull-market continuation setup study;
- bear-market capital-preservation / bearish-setup / no-trade considerations;
- short-selling and inverse-ETF risk boundaries;
- trader vs long-term-investor framework distinction;
- replay practice for regime recognition.

Neighbor boundaries remain:

- `/blog/market-structure-trading-guide` — detailed higher-high / lower-low / range structure.
- `/blog/sector-rotation-strategy` — sector-relative-strength and rotation strategy.
- `/blog/short-selling-guide` — short-selling mechanics and risks.
- `/blog/risk-management-position-sizing-guide` — position sizing, stops, leverage, exposure and drawdowns.
- `/blog/crypto-market-cycles-understanding-bull-and-bear-markets-2026` — crypto-specific cycle context.
- time-sensitive macro outlook pages — current-year scenario / macro outlook, not evergreen bull/bear definitions.

## 6. Content changes

### Rebuilt canonical owner

File: `content/blog/2026032701.md`

New title:

`Bull Market vs Bear Market: How Traders Adapt to Different Market Regimes`

New meta title:

`Bull vs Bear Market: Differences & Trading Strategies`

New `dateModified`:

`2026-08-15`

Rebuild scope:

- removed legacy manual Article JSON-LD;
- removed unsupported claim that market environment determines 50–80% of results;
- removed unsupported duration/frequency tables and overconfident historical generalizations;
- removed deterministic "buy the 21 EMA" / fixed-strategy prescriptions;
- removed unsupported claims about breakout success rates, sector return multiples, bear-rally duration, and exact regime probabilities;
- removed simplistic "short or inverse ETF" framing;
- added 20% convention nuance using official sources;
- added bull/bear/correction/range distinction;
- added benchmark + timeframe + structure + participation + volatility regime workflow;
- added explicit invalidation concept;
- separated strategy hypotheses from guaranteed setup behavior;
- added short-selling risk boundary;
- added leveraged/inverse ETF daily-reset / compounding risk boundary;
- separated trader and long-term-investor decision frameworks;
- clarified ChartMini does not automatically label regimes;
- added replay drill and FAQ;
- added current primary-source references.

Final owner length at validation: approximately 3,379 words.

### Consolidated requested URL

File: `content/blog/2025122201.md`

Added:

`redirectTo: /blog/bull-market-vs-bear-market`

No attempt was made to maintain the old body as a second indexable owner.

### Redirect configuration

`src/config/chartmini-blog-redirects.json` now sends all relevant legacy paths directly to the short owner:

- `/blog/2025122201` -> `/blog/bull-market-vs-bear-market`
- `/blog/bull-market-vs-bear-market-trading-strategies-for-different-market-conditions-2026` -> `/blog/bull-market-vs-bear-market`
- `/blog/2026032701` -> `/blog/bull-market-vs-bear-market`

All three are permanent redirects. No redirect chain is intended.

### Internal links

Converted the two remaining Markdown links that used `/blog/2025122201` to the short canonical owner:

- `content/blog/2025122401.md`
- `content/blog/2025110901.md`

After the edit, there are no Markdown inlinks to either the old numeric URL or the long duplicate slug.

## 7. Internal-link validation

All internal links added from the rebuilt owner resolve to current v2 Markdown slugs:

- `/blog/market-structure-trading-guide`
- `/blog/moving-averages-sma-ema-guide`
- `/blog/risk-management-position-sizing-guide`
- `/blog/short-selling-guide`
- `/blog/sector-rotation-strategy`
- `/blog/how-to-read-trading-volume`
- `/blog/market-replay-how-to-practice-trading-with-historical-charts`
- `/blog/pre-trade-checklist`

## 8. Build / manifest / redirect verification

Validation after modification:

- `pnpm build` — PASS.
- `pnpm check` — PASS.
- Vitest — 3/3 PASS.
- `git diff --check` — PASS.
- `pnpm seo:v2:workflow:check` — PASS.
- Blog Markdown source count — 402.
- Generated manifest contains both source records but only one routable bull/bear owner.
- Long source carries `redirectTo: /blog/bull-market-vs-bear-market`.
- Redirect config duplicate source count — 0.
- All three bull/bear legacy/duplicate redirect sources point directly to the canonical short owner.

## 9. Deployment / indexing state

Not performed in Task 20.6:

- no commit;
- no push;
- no deployment;
- no R2 content sync;
- no GSC Request Indexing;
- no Bing / IndexNow submission.

Production therefore still serves both pre-Task20.6 URLs as 200 until deployment.

After deployment, verify:

1. `/blog/bull-market-vs-bear-market` returns 200 with the new title/meta/body/canonical.
2. Requested long URL returns direct permanent redirect to the short owner.
3. `/blog/2025122201` returns direct permanent redirect to the short owner.
4. `/blog/2026032701` remains a direct permanent redirect to the short owner.
5. Requested long URL is removed from sitemap indexability.
6. Short owner remains in sitemap.
7. Googlebot/browser behavior matches.
8. Set actual 7-day and 14-day observation dates from the real deployment/indexing event.

## 10. Data limitations

GSC and Bing remain `unknown_not_reverified`. No claim is made about clicks, impressions, ranking gain, indexing transfer, or consolidation performance before a fresh post-deploy observation.
