# ChartMini SEO v2 Flowtrace — Task28.1 Market Makers Owner Rebuild

Date: 2026-08-22
Task: 28.1
Target URL: `/blog/what-are-market-makers`
Source file: `content/blog/2026040701.md`
Canonical owner decision: `retain_narrow + rebuild`
Local status: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`

## 1. Fresh Production Preflight

Observed against `https://chartmini.com` on 2026-08-22 before editing.

- Canonical URL: `https://chartmini.com/blog/what-are-market-makers`
- HTTP: `200`
- Canonical: exact self-canonical
- Sitemap: present in `https://chartmini.com/sitemap.xml`
- Production title: `What market makers actually do (and why you should care) | ChartMini Blog`
- Production H1: `What market makers actually do (and why you should care)`
- Production `dateModified`: `2026-04-07T00:00:00.000Z`
- Numeric URL `/blog/2026040701`: direct `301` to final canonical, then `200`; no chain
- Tested guessed descriptive legacy path `/blog/what-market-makers-actually-do-and-why-you-should-care`: `404`; no evidence it is a known canonical/legacy source, so no redirect was added
- Current source already matched the production body and had not been rebuilt under v2
- Current Markdown contained a manual `Article` JSON-LD block even though v2 route already generates `BlogPosting`

## 2. Current GSC / Bing State

- GSC: `unknown_not_reverified`
- Bing: `unknown_not_reverified`
- No legacy GSC/Bing exports were imported into this task.

## 3. Fresh SERP

Fresh web/SERP research on 2026-08-22 showed the target query family is an evergreen explainer intent, not a product-comparison or trading-strategy intent.

The current ChartMini URL itself surfaced for `what are market makers` with the old title/body. Other current results and primary sources consistently emphasize:

- definition of a market maker / dealer;
- standing ready to buy and sell;
- bid and ask quotes;
- liquidity and immediacy;
- bid-ask spread;
- inventory/adverse-selection risk;
- broker routing and wholesale market makers;
- payment for order flow and best execution;
- distinctions among exchange market makers, NYSE DMMs, and other liquidity providers.

Primary/current sources used:

- Investor.gov — Market Makers: https://www.investor.gov/introduction-investing/investing-basics/glossary/market-makers
- Investor.gov — Executing an Order: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order
- Investor.gov — Stop, Stop-Limit, and Trailing Stop Orders: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15
- FINRA — Stop Orders: Factors to Consider During Volatile Markets: https://www.finra.org/investors/insights/stop-orders-factors-consider-during-volatile-markets
- FINRA Regulatory Notice 06-53 / Exchange Act market-maker definition context: https://www.finra.org/rules-guidance/notices/06-53
- SEC — Trade Execution: https://www.sec.gov/about/reports-publications/investorpubstradexec
- SEC — Rule 606 Regulation NMS FAQs: https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/faq-rule-606-regulation
- NYSE — Market Making and the NYSE DMM Difference: https://www.nyse.com/data-insights/market-making-and-the-nyse-dmm-difference
- NYSE — Equities Market Participants: https://www.nyse.com/trade/equities
- Nasdaq — Market Maker Definition: https://www.nasdaq.com/glossary/m/market-maker

## 4. Site Graph / Cannibalization

Fresh v2 source scan found one direct competing title/slug for the market-maker explainer intent:

- `/blog/what-are-market-makers` — requested target and only dedicated broad market-maker explainer.

No second ChartMini blog page was found with a title/slug that should own the same broad intent.

Pre-task body support to the canonical:

- `content/blog/2026041101.md` — `/blog/pre-market-after-hours-trading` — 2 links
- `content/blog/2026041302.md` — `/blog/etf-trading-for-beginners` — 1 link
- `content/blog/2026041102.md` — `/blog/how-to-build-stock-watchlist` — 2 links

Result:

- file-level source pages: 3
- file-level body links: 5
- effective non-redirecting canonical body-source pages: 3
- all three source pages are current 200-style canonical sources in the local graph, not redirect sources

Pre-task target outbound internal links were checked against the current manifest and redirect map. No target outbound blog link pointed through a redirect.

## 5. Owner Gate

Decision: `retain_narrow + rebuild`.

Reasons to retain:

1. Clean evergreen canonical slug exactly matches the durable query.
2. Production URL is 200, self-canonical, in sitemap, and already surfaces in fresh search.
3. It has the minimum desired 3 effective direct canonical body-support sources.
4. No stronger current ChartMini owner or duplicate broad market-maker page exists.

Reasons to rebuild:

The old body contained material factual/YMYL problems or overconfident assertions, including:

- implying market makers generally can see aggregate stop-order clusters;
- describing stop hunting as partially true without venue/order-data evidence;
- recommending wider stops to avoid market makers;
- stating the SEC requires wholesale market makers to provide price improvement as a universal rule;
- using a fixed `~$0.002/share` exchange-rebate figure as if universal;
- using a fixed `$0.005/share` PFOF execution-difference example as a general conclusion;
- claiming specific firms manipulate via spoofing without task-level enforcement sourcing;
- broad claims about DMM informational advantages and market-maker visibility without distinguishing NYSE-specific aggregate information rules;
- duplicate manual `Article` schema under the v2 route architecture.

## 6. Confirmed Intent Boundary

This owner now covers:

- what a market maker is;
- bid/ask liquidity and immediacy;
- spread economics and inventory/adverse-selection risk;
- exchange fees/incentives at a non-universal level;
- wholesale market makers and PFOF/best-execution context;
- market maker vs broker vs exchange;
- NYSE DMM role and limits of information-access generalizations;
- stop-order mechanics vs unsupported stop-hunting narratives;
- stocks/ETFs, options, FX liquidity-provider, centralized-crypto and AMM distinctions;
- practical retail execution checks: spread, depth, order type, time/event risk, broker fill quality.

Neighbor boundaries remain separate:

- `/blog/order-types-explained` — order-type taxonomy and execution controls
- `/blog/how-to-read-level-2-order-book` — displayed order-book/Level 2 interpretation
- `/blog/how-to-choose-trading-broker` — broker selection and execution-quality evaluation
- `/blog/pre-market-after-hours-trading` — extended-hours trading and liquidity conditions

## 7. Actual Modifications

Rebuilt `content/blog/2026040701.md`.

Frontmatter:

- new H1/title: `What Are Market Makers? How They Provide Liquidity and Make Money`
- added `metaTitle: What Are Market Makers? Role, Spreads & Liquidity`
- added `dateModified: 2026-08-22`
- tightened description and tags

Content/GEO:

- direct definition in opening paragraph
- 5 Key Takeaways
- comparison/function tables
- primary-source-supported explanations
- market maker/broker/exchange/DMM distinctions
- corrected PFOF/best-execution framing
- removed fixed rebate/execution-quality numbers
- replaced stop-hunting assertions with observable order/execution mechanics
- added market-specific distinctions for stocks/options/FX/crypto
- added execution observation checklist
- added explicit ChartMini limitation: historical candle replay does not reconstruct Level 2 or identify market-maker intent
- added Sources and Further Reading
- added educational-risk disclaimer

Schema:

- removed manual `Article` JSON-LD
- no new `Article`, `BlogPosting`, `HowTo`, or FAQ schema added
- route-generated BlogPosting/BreadcrumbList remains authoritative

## 8. Internal Links

Post-rebuild target has 4 unique internal Blog destinations:

- `/blog/order-types-explained`
- `/blog/how-to-choose-trading-broker`
- `/blog/how-to-read-level-2-order-book`
- `/blog/pre-market-after-hours-trading`

Validation against current generated manifest/redirect config:

- missing internal destinations: 0
- target internal links through redirect sources: 0
- pre-existing effective inbound source count remains 3

No additional inbound link was added because the owner already met the >=3 effective support gate and no semantic cleanup was required.

## 9. Redirect Decision

- Preserve `/blog/2026040701` -> `/blog/what-are-market-makers` direct permanent redirect.
- No new redirect/consolidation required.
- No evidence supports inventing a redirect for the guessed 404 title-derived slug.
- Redirect chain found for numeric source: 0.

## 10. Validation

After the rebuild:

- `pnpm build`: PASS
  - Blog manifest: 402 posts
  - Marketing content: 160 locale assets
  - client build: PASS
  - SSR build: PASS
- `pnpm check`: PASS
  - Biome: 415 files
  - Vitest: 6/6 test files, 17/17 tests
- `pnpm seo:v2:workflow:check`: PASS
  - required workflow files: 13
  - blog markdown files: 402
- `git diff --check`: PASS
- target manifest count: 1
- manual Article/BlogPosting in target Markdown: 0
- target outbound Blog redirects: 0

## 11. Deploy / GSC / Observation Rule

- Commit: not performed
- Push: not performed
- Deploy: not performed
- GSC submission: not performed
- Bing/IndexNow submission: not performed

After user deploys, fresh production verification must confirm:

- canonical URL returns 200
- exact self-canonical
- sitemap membership
- new title/H1
- `dateModified: 2026-08-22`
- `/blog/2026040701` remains direct 301 to final canonical

GSC rule after verified deployment:

- eligible changed canonical: `https://chartmini.com/blog/what-are-market-makers`
- do not submit `/blog/2026040701`
- do not submit redirect or guessed 404 paths

Observation:

- no observation window is created or reset pre-deployment
- if deployment is verified, create 7-day and 14-day observation dates from the real deployment/indexing event

## 12. Final Task State

`RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
