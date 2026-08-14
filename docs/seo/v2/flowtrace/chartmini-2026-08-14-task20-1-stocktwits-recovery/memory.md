# Task 20.1 — Stocktwits Platform / Social-Sentiment Recovery

Date: 2026-08-14
Project: ChartMini v2
Target URL: `https://chartmini.com/blog/stocktwits-social-trading-platform-how-to-use-crowd-wisdom-to-improve-your-trading-decisions-2026`
Source: `content/blog/2026012001.md`
Decision: `retain_narrow + rebuild`
Status: completed locally, pending deploy

## 1. Scope and v2 boundary

This task used only the active v2 workflow under `docs/seo/v2/_workflow/` as current state. Migrated old-project GSC/Bing/SERP/protection/owner records were not used as current facts.

No slug, canonical route, deployment config, product route, or staging indexability rule was changed.

## 2. Fresh production preflight

Observed 2026-08-14 before deployment of the new article version:

- Canonical target: browser HTTP 200.
- Googlebot-UA request: HTTP 200.
- Production canonical link: exact target URL.
- Target present in `https://chartmini.com/sitemap.xml`.
- Production H1/title still showed the pre-Task20.1 wording, as expected before deployment.
- Numeric legacy `/blog/2026012001` returns a direct permanent HTTP 301 to the canonical target.
- No production hard block was observed that would justify changing the slug/canonical.

## 3. GSC / Bing data gate

Fresh v2 GSC performance / URL Inspection data: `unknown_not_reverified`.

Fresh v2 Bing Webmaster data: `unknown_not_reverified`.

Reason: the v2 baseline does not currently have an independently verified GSC/Bing data access path. No legacy values were imported or estimated.

Task proceeded under explicit user authorization using fresh production, SERP, site-cluster, and primary-source evidence.

## 4. Fresh SERP / source evidence

Fresh searches on 2026-08-14 covered:

- `Stocktwits how to use Stocktwits sentiment social trading platform`
- `Stocktwits review social sentiment trading ideas`
- `Stocktwits sentiment guide`
- `how to use Stocktwits investors`
- Stocktwits official help / product feature pages

Observed intent shape:

1. Current Stocktwits-owned documentation strongly serves the how-to intent with feature-specific pages for Sentiment, Home Feed, Watchlist, Trending, filters, and redesigned Symbol Pages.
2. Stocktwits currently describes ticker sentiment as aggregate user Bullish/Bearish declarations, not a verified forecast of future price.
3. Trending / watcher surfaces are attention/discussion surfaces and must not be described as institutional positioning or guaranteed directional signals.
4. Investor.gov's 2026 social-media stock-tip alert explicitly warns against making investment decisions solely from social-media platforms/apps.
5. FINRA guidance likewise advises evaluating source quality and cautions that social-media or aggregated sentiment can be inaccurate, misleading, conflicted, or unsuitable for a user's circumstances.

Primary/current sources used in the rewrite:

- Stocktwits Help — Sentiment: `https://help.stocktwits.com/c/key-features/features/sentiment`
- Stocktwits Help — Home Feed: `https://help.stocktwits.com/c/navigating/articles/home-feed`
- Stocktwits Help — Watchlist: `https://help.stocktwits.com/c/getting-started/articles/build-watchlist`
- Stocktwits Help — Trending Bar: `https://help.stocktwits.com/c/navigating/articles/trending-bar`
- Investor.gov — Social Media and Stock Tip Scams (2026): `https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/social-media-stock-scams`
- Investor.gov — Social Sentiment Investing Tools: `https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-18`
- FINRA — Following the Crowd: Investing and Social Media: `https://www.finra.org/investors/insights/following-crowd-investing-and-social-media`

## 5. v2 site-cluster / cannibalization gate

Repository-wide phrase discovery found several articles that mention sentiment/social trading, but no second page with the same Stocktwits platform-use / ticker-sentiment owner intent.

Key boundaries:

- `content/blog/2026020602.md` (`/blog/copy-trading-2026-best-platforms-for-social-trading-success-2026`) owns copy/mirror trading and platform replication intent. It should not absorb Stocktwits discussion/sentiment usage.
- `/blog/simply-wall-st-free-stock-analysis-and-valuation-tool-2026` is a company-research/product-review owner, not social sentiment.
- `/blog/how-to-analyze-a-stock-fundamental-analysis` owns company due-diligence/fundamental analysis.
- `/blog/how-to-build-stock-watchlist` owns stock-universe/watchlist construction rather than Stocktwits platform usage.
- `/blog/news-based-trading-practical-guide` owns news/event verification and trading workflow.

Pre-edit direct Markdown inbound links to the Stocktwits target: **0**.

Owner Gate therefore supports retaining the canonical URL and narrowing it to:

**Stocktwits platform usage + ticker streams + Watchlist/Trending attention + Bullish/Bearish sentiment interpretation + verification workflow.**

Decision: `retain_narrow + rebuild`.

## 6. Problems found in the old article

The old article had material quality/safety/currentness problems:

- title/description promised that crowd wisdom could improve trading decisions;
- contained mixed-language corruption (`aggregate分散...`, `市场情绪`, `辅助工具`, `预示`);
- described sentiment in a way that did not match current Stocktwits user-declared Bullish/Bearish documentation;
- used fixed 80% / 90% sentiment thresholds as possible contrarian reversal triggers;
- implied a user rating/reputation mechanism could identify reliable traders and track records without current evidence;
- prescribed arbitrary fixed follow counts;
- treated Trending/Hot activity as a source of trading opportunities rather than attention;
- used a fabricated AMD example with arbitrary sentiment/support values;
- overclaimed that crowd intelligence can materially improve decision quality;
- contained a legacy manual `Article` JSON-LD block that is unnecessary under the v2 route-generated `BlogPosting` architecture;
- had only numeric legacy Related Posts and no direct canonical inbound discovery from another article.

## 7. Actual content changes

Rebuilt `content/blog/2026012001.md` while preserving the slug and original publication date.

Frontmatter:

- new H1/title: `Stocktwits Guide: How to Read Sentiment, Watchlists, and Trending Without Following the Crowd`
- new `metaTitle`: `Stocktwits Guide 2026: Sentiment, Watchlists & Trending`
- new intent-specific description
- `dateModified: 2026-08-14`
- expanded Stocktwits/social-sentiment tags

Body:

- answer-first opening within the first paragraph;
- Key Takeaways;
- feature/meaning/limitation comparison table;
- explanation of ticker-level Bullish/Bearish sentiment;
- clear separation of sentiment vs Trending/attention vs actual positioning;
- current Stocktwits Sentiment Index boundary without converting its labels into a trade rule;
- seven-step verification workflow;
- source-quality checklist;
- explicit Stocktwits-vs-copy-trading distinction;
- practical research-decision matrix;
- common mistakes and social-media fraud warnings;
- scoped ChartMini role/limitations;
- six visible FAQ questions;
- primary-source further-reading section.

Removed the legacy manual `Article` schema. v2 route-generated BlogPosting/BreadcrumbList/Person/site schema remains the structured-data source.

## 8. Internal linking changes

Target now links directly to six relevant v2 destinations:

- `/blog/how-to-build-stock-watchlist`
- `/blog/news-based-trading-practical-guide`
- `/blog/how-to-analyze-a-stock-fundamental-analysis`
- `/blog/penny-stock-trading-guide`
- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
- `/market-replay`

One scoped inbound link was added to `content/blog/2026020602.md` inside its existing `Copy Trading vs. Social Trading vs. Mirror Trading` section. The anchor explicitly defines Stocktwits as the discussion/sentiment side of social trading, not automated replication.

Post-edit direct Markdown inbound discovery: **1 source / 1 occurrence**.

No other adjacent article body was changed.

## 9. Validation

Source checks:

- target source word count: 2,551 words including frontmatter/source list;
- no mixed Chinese corruption remains;
- no manual `Article`/`BlogPosting` schema remains in target Markdown;
- target title and metaTitle are unique across `content/blog`;
- all six internal destination slugs exist in current v2 source/routes;
- generated manifest contains exactly one target record and `dateModified: 2026-08-14`.

Build/test checks:

- `pnpm build` — PASS.
  - prebuild regenerated 402 blog manifest records and formatted the manifest;
  - client and SSR production builds completed successfully;
  - existing bundle-size warnings only; no Task20.1 build error.
- `pnpm check` — PASS.
  - Biome PASS;
  - Vitest 1 file / 3 tests PASS.
- `git diff --check` — PASS.
- `pnpm seo:v2:workflow:check` — PASS; 13 required workflow files / 402 blog Markdown files.

Validation-order note: running `node scripts/build-blog-manifest.mjs` immediately followed by `pnpm check` initially exposed a workflow-documentation issue because the manifest builder writes raw JSON and the build prehook formats it. Running the real `pnpm build` chain formats the manifest; the subsequent `pnpm check` passes. The v2 workflow validation instructions are updated to use the real build chain before the final format/lint check.

## 10. Deployment / indexing state

Not performed in Task 20.1:

- no commit;
- no push;
- no deployment;
- no R2 content sync;
- no GSC Request Indexing;
- no Bing/IndexNow submission.

The target enters a **pending-deploy content freeze**. Do not rewrite it again before deployment unless a hard technical or material factual defect is found.

After deployment:

1. verify browser + Googlebot HTTP 200;
2. verify new title/meta/dateModified/body are live;
3. verify exact self-canonical and sitemap membership;
4. verify numeric legacy still redirects directly to canonical;
5. obtain fresh v2 GSC URL Inspection/performance if available;
6. decide whether one manual Request Indexing is warranted from the real post-deploy index state;
7. start 7-day / 14-day observation dates from the actual deployment/submission event, not from legacy records.
