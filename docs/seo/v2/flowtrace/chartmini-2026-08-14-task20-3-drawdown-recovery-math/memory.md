# Task 20.3 — Drawdown Recovery Math

Date: 2026-08-14
Project: ChartMini v2
Target: `/blog/the-recovery-equation-why-a-50-loss-needs-a-100-gain-to-break-even-and-how-to-survive-drawdowns-2026`
Source: `content/blog/2026011502.md`

## Goal

Re-verify and optimize the current v2 owner for drawdown recovery mathematics without inheriting old-project GSC/Bing/SERP/owner state. Preserve the established URL if current production, SERP and internal-cluster evidence support it.

## Preflight

- Current production target returned HTTP 200.
- Production canonical matched the target URL.
- Target was present in the current production sitemap.
- Numeric legacy URL `/blog/2026011502` already maps permanently to the target through the v2 legacy redirect table.
- Current v2 GSC access: `unknown_not_reverified`; `claude-seo` unavailable in the shell.
- Current v2 Bing access: `unknown_not_reverified`; `BING_WEBMASTER_API_KEY` and `INDEXNOW_KEY` absent.
- No legacy GSC/Bing numbers were imported.

## Fresh SERP evidence

Fresh web research on 2026-08-14 for queries around `50% loss 100% gain`, `drawdown recovery formula`, `drawdown recovery calculator`, and `how to recover from trading losses` showed two distinct intent families:

1. Recovery-math/tool intent: formula, break-even gain tables, and recovery-time calculators. The current ChartMini target itself surfaced for this intent, alongside other drawdown-recovery math/tool pages.
2. Behavioral recovery intent: psychological reset, loss review, revenge-trading control and step-by-step recovery workflows. Charles Schwab's current educational page on recovering from major trading losses is representative of this intent.

Observed supporting sources included:

- Current ChartMini production target.
- StockTiming drawdown/recovery calculator explaining the fixed identity `gain = loss / (1 - loss)` and separating fixed recovery math from assumed recovery-return timing.
- TradeZella 2026 drawdown recovery article combining recovery math with diagnostic workflow.
- Charles Schwab 2026 educational material focused on trading psychology after major losses.
- Goldberg & Mahmoud, `Drawdown: From Practice to Theory and Back Again`, for drawdown as a path-dependent risk concept.

SERP evidence is directional web-search evidence, not a claim of reproducible Google rank position.

## Current v2 cluster review

Strong existing inbound ownership signals already point recovery mathematics at the target:

- `content/blog/2026031201.md` explicitly says the drawdown recovery guide owns recovery mathematics.
- `content/blog/2026010601.md` explicitly defers the detailed recovery equation to the target.
- `content/blog/2026012902.md` links to the target as `Drawdown Recovery Math`.

Nearby content:

- `/blog/risk-management-position-sizing-guide` owns broad risk management: sizing, stops, exposure and drawdown controls.
- `/blog/the-1-rule-why-most-traders-get-position-sizing-wrong-2026` owns the 1% rule and per-trade risk/losing-streak math.
- `/blog/how-to-recover-from-trading-loss` is best suited to behavioral/psychological recovery workflow.
- `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026` remains a broader recovery article and should be reviewed separately before any consolidation because current GSC/Bing data is unavailable.
- `/blog/the-art-of-position-sizing-how-much-to-trade-2026` includes a compact loss-recovery table but remains a position-sizing owner.

## Owner Gate

Decision: `retain_narrow + rebuild`.

Confirmed owner boundary:

- drawdown definition and peak-to-trough measurement;
- recovery-gain formula;
- 50% loss -> 100% gain explanation;
- drawdown-to-break-even table;
- constant-compounding recovery-time arithmetic with explicit assumptions;
- implications of nonlinear recovery math for risk design;
- distinction between drawdown depth and broader strategy risk metrics.

Explicitly not owned by this target:

- full trading-psychology recovery protocol;
- revenge-trading treatment;
- generic position sizing;
- universal risk limits or a universal safe maximum drawdown;
- claims about how quickly a real trader will recover.

## Problems found in the previous target

- Manual `Article` schema duplicated the v2 route-generated BlogPosting schema.
- FAQPage markup was legacy and unnecessary for Google rich-result strategy.
- Statements such as `the first 20% is the danger zone` and a universal 20% professional ceiling were presented as facts without a universal basis.
- Claims that professional traders uniformly reduce risk in a specific way were overgeneralized.
- `3-6 month` recovery claims were framed too deterministically.
- Recovery-time examples mixed constant-return arithmetic with language that could be read as a performance expectation.
- The previous 50% drawdown recovery-time example at a constant 5% per period was materially understated; exact compounding requires about 14.21 periods, therefore 15 whole periods if rounded up.
- A raw legacy interactive calculator block was embedded in Markdown even though v2 has no dedicated article component for that calculator.
- The article overlapped heavily with `/blog/how-to-recover-from-trading-loss` on psychology and staged recovery.

## Changes made

### `content/blog/2026011502.md`

- Preserved slug and publication date.
- Set `dateModified: 2026-08-14`.
- Kept the strong math-led H1: `Drawdown Recovery Math: Why a 50% Loss Needs a 100% Gain`.
- Added meta title: `Drawdown Recovery Math: Formula, Table & Break-Even Gain`.
- Rewrote the description for formula/recovery-time intent.
- Removed all manual JSON-LD from Markdown.
- Rebuilt the article around exact recovery arithmetic and explicit assumptions.
- Added a verified peak-to-trough drawdown example.
- Added the exact formulas `G = D / (1 - D)` and `n = ln(1/(1-D)) / ln(1+r)`.
- Added corrected drawdown-to-recovery table.
- Added constant-return period table using 2% and 5% per-period assumptions, explicitly labeled as illustrations rather than forecasts.
- Removed fixed `safe` drawdown thresholds and deterministic recovery timelines.
- Added sections on drawdown measurement, loss/gain asymmetry, risk dimensions, common math mistakes, FAQ, practical next step and source notes.
- Added seven valid internal destinations, including risk management, 1% rule, position sizing, performance metrics, psychology, behavioral recovery and Market Replay.

### `content/blog/2026033102.md`

- Narrowed description to behavioral recovery.
- Removed its duplicated recovery-math table and `Brutal Math` section.
- Added a direct boundary link to the Task 20.3 math owner.
- Left its behavioral recovery protocol intact for a separate future audit.

### `content/blog/2026010501.md`

- Corrected `grows exponentially` to `grows nonlinearly` for the compact recovery table.
- Added a direct boundary link assigning full recovery formula/table/time arithmetic to Task 20.3.

## Internal-link validation

Two initially drafted v2 links were found to use nonexistent migrated slugs and were corrected before build:

- `position-sizing-calculator-risk-management` -> `/blog/the-art-of-position-sizing-how-much-to-trade-2026`
- `trading-performance-metrics-that-matter-2026` -> `/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`

All Task 20.3 internal destinations were then confirmed against current v2 Markdown slugs.

## Validation

- `pnpm build` — PASS.
- `pnpm check` — PASS.
- Vitest — 3/3 PASS.
- `git diff --check` — PASS.
- `pnpm seo:v2:workflow:check` — PASS.
- Generated manifest contains exactly one target slug.
- Generated target metadata includes the new title, metaTitle, description and `dateModified: 2026-08-14`.
- No manual `Article` or FAQPage schema remains in the target Markdown.

## Deployment / indexing status

Not performed:

- no commit;
- no push;
- no deployment;
- no R2 sync;
- no GSC submission;
- no Bing/IndexNow submission.

The current production page therefore remains the pre-Task20.3 version until deployment.

## Observation state

Status: `protected_pending_deploy`.

After an actual deployment event:

1. verify production title, description, body, canonical and sitemap;
2. verify `/blog/2026011502` redirect remains correct;
3. confirm the behavioral recovery article still links to the math owner;
4. establish real 7-day and 14-day observation dates from the deployment/indexing event;
5. obtain fresh GSC/Bing data before making performance or cannibalization claims.
