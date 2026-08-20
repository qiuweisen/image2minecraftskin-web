# Task 26.8 — Cluster Intent / Internal-Link / Cannibalization Review

Date: 2026-08-20
Baseline HEAD: `aa7378e067f3d7d39529c43e16512157f17df5cf`

## Scope

Fresh cluster-wide review after Task26.1–26.7. Checked these owners / neighbors:

- `/blog/chartmini-vs-candledojo-comparison`
- `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026`
- `/blog/how-to-trade-the-news`
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`
- `/blog/market-structure-trading-guide`
- `/blog/market-structure-trading-how-to-read-price-action-like-an-institutional-trader-2026`
- `/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`
- `/blog/pre-trade-checklist`

## Fresh intent review

Fresh 2026-08-20 SERP evidence preserves the Task26 boundaries:

- CandleDojo exposes a dedicated ChartMini comparison result, so the direct brand-comparison owner remains distinct from generic simulator evaluation.
- FOMO results remain centered on urgency, chasing, late entries, social/news triggers and anti-chasing controls; generic Pre-Trade Checklist remains a separate decision-stage owner.
- News Trading remains event/catalyst/release interpretation and fast-market execution; Market Volatility remains broader VIX/ATR/realized/implied-volatility/risk context.
- `is swing trading still effective` remains a distinct viability query. Stale search snippets are index-refresh lag; production already serves the corrected owner body.
- Market Structure SERPs still support broad HH/HL/LH/LL trend/range education plus a narrower BOS/CHoCH verification task.
- Pre-Trade Checklist results remain an immediate-before-entry workflow, distinct from full Trading Plan, Risk Management, Execution Gap and after-trade Journal/Review.

## Internal-link graph

Effective support excludes source files that are themselves redirect sources.

| Owner | File-level sources | Effective sources |
|---|---:|---:|
| ChartMini vs CandleDojo | 3 | 3 |
| FOMO | 9 | 8 |
| News Trading | 13 | 13 |
| Swing viability | 4 | 4 |
| Broad Market Structure | 26 | 26 |
| BOS/CHoCH verification | 11 | 11 |
| Broad Market Volatility | 6 | 4 |
| Pre-Trade Checklist | 11 | 10 |

Every checked important owner has at least 3 effective direct canonical body-source files.

## Issue found and fixed

Task26.6 previously counted `content/blog/2026011303.md` as effective support for Broad Market Volatility. Task26.8 rechecked source-page routing and found that file is itself a redirect source to the Broad Risk Management owner.

Before correction, Broad Volatility had 5 file-level links but only 3 effective non-redirecting sources.

Task26.8 added one direct canonical link from `content/blog/2026032502.md` (Pre-Trade Checklist) in the market-context section:

`market volatility` -> `/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`

Current Broad Volatility support is now 6 file-level sources, 2 redirect-source files, and 4 effective non-redirecting sources.

Task26.6 and Task26.7 evidence / Workflow support counts were corrected accordingly.

## Redirect and cannibalization audit

- Task26 owner outbound Blog links resolving through redirects: 0.
- Routable/indexable body links to Task26 redirect sources: 0.
- Global duplicate redirect-source definitions: 0.
- Global redirect chains: 0.

One legacy link to `/blog/2026011105` exists only inside `content/blog/2026011005.md`, which is itself a redirect source; it is not an indexable internal-link leak and does not justify cleanup-only rewriting.

No additional consolidation is required. Current owners remain:

- direct ChartMini vs CandleDojo comparison;
- FOMO anti-chasing process;
- single broad News Trading owner;
- Swing current-viability owner;
- broad Market Structure owner plus narrow BOS/CHoCH verification owner;
- single broad Market Volatility owner;
- Pre-Trade Checklist immediate pre-entry owner.

## Changes

- `content/blog/2026032502.md`: added one direct semantic link to Broad Market Volatility.
- corrected Task26.6/26.7 support accounting in Flowtrace/Workflow.
- no redirect, slug, canonical, schema or product-route change.

GSC/Bing not freshly connected: use `unknown_not_reverified` where not already user-confirmed. Redirect/numeric sources remain no-submit.

## Result

`PASS_AFTER_VOLATILITY_SUPPORT_ACCOUNTING_AND_PRETRADE_CANONICAL_LINK_CORRECTION_READY_FOR_TASK26_9`

No commit, push, deployment, GSC, Bing/IndexNow or R2 action performed.
