# Task 21.2 — Correlation Analysis

Date: 2026-08-15
Target: `/blog/correlation-analysis-mastery-how-to-use-market-relationships-to-reduce-risk-2026`
Source: `content/blog/2026011102.md`
Decision: `retain_narrow + rebuild`
Status: `protected_pending_deploy`

## Authorization

User explicitly authorized Task 21.2 for the target URL. No commit, push, deployment, R2 sync, GSC submission, Bing submission, or IndexNow submission was authorized.

## Data gate

Current v2 search-console access remains unavailable:

- `claude-seo`: unavailable
- `BING_WEBMASTER_API_KEY`: absent
- `INDEXNOW_KEY`: absent

GSC/Bing metrics therefore remain `unknown_not_reverified`. No legacy project metrics were imported.

## Production preflight

Fresh production verification on 2026-08-15:

- target: HTTP 200
- target canonical: exact self-canonical
- target: present in production sitemap
- numeric legacy `/blog/2026011102`: direct 301 to target
- neighboring `/blog/portfolio-correlation-why-your-diversification-might-be-failing-2026`: HTTP 200, self-canonical, present in sitemap

## Fresh source / SERP direction

Current primary-source review supports treating correlation as a statistical relationship measure rather than a deterministic trading rule:

- NIST: Pearson correlation measures linear association and requires careful statistical interpretation.
- CFA Institute 2026 Portfolio Mathematics / Risk and Return material: covariance and correlation are inputs to portfolio risk, not standalone allocation rules.
- CME Group intermarket-spread education: related contracts can be used for relative-value trades, but spread trades retain risk and require economic/contract context.
- FINRA and Investor.gov: diversification can reduce concentration risk but does not guarantee protection or eliminate market risk.

Fresh search intent is mixed across correlation definition/calculation, rolling relationships, diversification, pair trading, and intermarket analysis. The v2 site already contains a strong portfolio-specific correlation owner, so Task21.2 should not duplicate the portfolio audit.

## Cluster / cannibalization findings

Key neighbor:

`/blog/portfolio-correlation-why-your-diversification-might-be-failing-2026`

That page explicitly states that it owns the narrower portfolio-diversification audit: return-based matrix, weights, covariance, rolling/stress windows, holdings overlap, factor exposure and diversification diagnostics. It links to Task21.2 for general trading relationships, hedging concepts and pair analysis.

Forex-specific neighbor:

`/blog/combining-gbpusd-and-audusd-for-better-results`

That page owns the specific shared-USD/synthetic-cross/two-leg-risk problem and links back to the general correlation guide.

Owner boundary selected:

- Task21.2 owns: Pearson correlation for trading relationships, aligned-return calculation, rolling correlation, correlation vs beta, correlation vs cointegration, hedge interpretation, intermarket/relative-value use, pair-screening limitations, reproducible two-series workflow.
- Portfolio Correlation owner owns: weighted portfolio correlation/covariance matrices, diversification diagnosis, holdings overlap, factor exposure and stress-testing.
- GBP/USD + AUD/USD page owns: that specific FX pair-combination exposure.
- Position sizing / portfolio heat pages own actual trade-size and total-open-risk rules.

Owner Gate: `retain_narrow + rebuild`.

## Old-content defects

The pre-edit target contained several unsupported or misleading universal rules:

- interpreted `+0.7` as if Asset B rises 0.7% when Asset A rises 1%;
- fixed labels implying `+0.7+` means the same position and `<+0.3` means true diversification;
- asserted specific current/historical correlations for AAPL/MSFT, SPY/TLT, SPY/VIX, gold/stocks without frozen source/window metadata;
- treated negative historical correlation as an automatic hedge;
- stated crisis correlations tend to `+1` as a universal rule;
- presented correlation alone as evidence of pair-trade mean reversion;
- prescribed a universal correlation-based position-size formula `Size = Normal size × (1 - correlation)`;
- prescribed fixed 20/50/100-day windows, monthly reviews and quarterly rebalancing as universal rules;
- contained manual Article JSON-LD even though the v2 route generates structured data;
- falsely claimed ChartMini automatically calculates live position correlations, alerts on shifts and suggests uncorrelated assets.

## Rebuild

Final target metadata:

- H1: `Correlation Trading Guide: How to Measure Market Relationships Without Fooling Yourself`
- metaTitle: `Correlation Trading Guide 2026: Pearson, Rolling & Pair Risk`
- dateModified: `2026-08-15`
- description rewritten for Pearson/rolling correlation, hedging/pair-trading limitations and non-causal interpretation.

Final article length: about 3,433 words.

Major sections:

- direct answer and key takeaways;
- Pearson correlation definition;
- aligned returns vs raw price levels;
- timestamp/data-alignment controls;
- rolling correlation and regime shifts;
- correlation vs causation;
- correlation vs beta;
- correlation vs cointegration;
- legitimate trading uses: duplicated exposure, hedge review, intermarket analysis and pair screening;
- pair-trading research workflow beyond correlation;
- spreadsheet and Python calculation examples;
- correlation-matrix interpretation boundaries;
- common mistakes;
- diversification boundary to the portfolio owner;
- reproducible 10-step trading-correlation workflow;
- explicit ChartMini capability limits;
- FAQ, practical next step, authoritative sources and related guides.

Manual Article schema was removed.

ChartMini is now described accurately as historical chart replay / practice only. The article explicitly states that ChartMini does not calculate live/rolling correlation, build correlation matrices, optimize hedge ratios, test cointegration, generate pair signals, recommend uncorrelated assets, or monitor a live portfolio.

## Internal links

Target links were validated against the generated v2 manifest:

- `/blog/portfolio-correlation-why-your-diversification-might-be-failing-2026`
- `/blog/combining-gbpusd-and-audusd-for-better-results`
- `/blog/how-to-backtest-trading-strategy`
- `/blog/risk-management-position-sizing-guide`
- `/blog/portfolio-heat-management-the-hidden-risk-that-destroys-traders-2026`
- `/blog/trading-performance-metrics-the-numbers-that-actually-matter-2026`

All are current routable owners; none are redirect sources.

Two remaining numeric inlinks to `/blog/2026011102` were changed to the canonical target in:

- `content/blog/2026011105.md`
- `content/blog/2026011303.md`

Current direct canonical inlink files include those two plus `content/blog/2026012902.md` and `content/blog/2026022601.md`.

## Validation

- `pnpm build`: PASS; 402 blog posts generated.
- target manifest count: 1.
- target internal blog slugs: all valid and routable.
- `pnpm check`: PASS.
- Biome: PASS.
- Vitest: 4 files, 9/9 tests PASS.
- `pnpm seo:v2:workflow:check`: PASS.
- `git diff --check`: PASS.

## Deployment boundary / next action

Task21.2 is complete locally and `protected_pending_deploy`.

After eventual deployment:

1. verify target 200 and self-canonical;
2. verify new title/meta/body/dateModified;
3. verify target remains in sitemap;
4. verify `/blog/2026011102` remains a direct 301;
5. verify canonical inbound links;
6. if GSC submission is requested, submit the canonical target only;
7. establish a fresh observation window from the actual deployment/indexing event.

No current GSC/Bing performance claim is made.
