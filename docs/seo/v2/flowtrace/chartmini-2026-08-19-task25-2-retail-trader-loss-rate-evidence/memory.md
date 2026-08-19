# Task 25.2 — Retail trader loss-rate evidence owner restoration

Date: 2026-08-19
Baseline: ChartMini v2
Requested URL: `/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026`
Source: `content/blog/2025102601.md`
Numeric source: `/blog/2025102601`
Decision: `retain_narrow + rebuild + reverse_recent_consolidation`
Status: `RETAIN_NARROW_REBUILD_RESTORE_OWNER_COMPLETE_PENDING_DEPLOY`

## 1. Authorization

The user explicitly requested Task25.2 for `/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026` on 2026-08-19. This is an explicit override allowing re-evaluation of the Task23.8 consolidation during its observation period. The task authorizes local v2 SEO/GEO editing and validation. No commit, push, deployment, R2 sync, GSC, Bing, or IndexNow action was requested.

## 2. Fresh production preflight

Production before Task25.2 local changes:

- `/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026` -> HTTP 301 -> `/blog/trading-psychology-master-emotions`
- `/blog/2025102601` -> HTTP 301 -> `/blog/trading-psychology-master-emotions`
- `/blog/trading-psychology-master-emotions` -> HTTP 200

The long and numeric sources therefore still reflect the deployed Task23.8 consolidation.

Current-v2 GSC performance/indexation state for the requested target: `unknown_not_reverified`.
Current-v2 Bing state: `unknown_not_reverified`.
No legacy search-console metrics were imported.

## 3. Prior decision being re-evaluated

Task23.8 treated this URL as a weak generic Broad Psychology duplicate because the historical source was almost entirely a short list of psychological traps:

- overconfidence;
- loss aversion;
- revenge trading;
- FOMO;
- confirmation bias;
- gambler's fallacy;
- analysis paralysis.

It also made the unsupported universal claim that roughly 90% of retail traders lose money, stated that a $100 loss hurts twice as much as a $100 gain, and ended with generic psychology advice. Under that body, consolidation to Broad Psychology was reasonable.

Task25.2 does not restore that old page. It tests whether the URL can support a narrower, evidence-first intent that no existing ChartMini owner currently owns.

## 4. Fresh SERP intent

Fresh 2026-08-19 queries included variants of:

- `why 90% of traders lose money`
- `do 90 percent of retail traders lose money`
- `why most retail traders lose money data costs leverage psychology`
- `retail trader loss rate study day traders lose money`

The current result pattern is materially broader than generic Trading Psychology. Pages addressing the 90%/most-traders-lose query commonly do two things:

1. challenge or qualify the universal 90% statistic; and
2. explain a multi-cause failure stack including edge, transaction costs, leverage/sizing, overtrading, execution and behavioral errors.

This creates a distinct search task from `trading psychology`, which remains centered on fear, greed, loss aversion, overconfidence, FOMO/revenge context and emotional execution controls.

## 5. Primary / authoritative evidence

### ESMA — retail CFDs

ESMA's CFD intervention materials cite national-regulator analyses in which **74%–89% of retail CFD accounts typically lost money**. This is strong evidence for leveraged CFDs, but it is not a universal loss rate for all retail market participants.

Source:
`https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors`

### CFTC — OTC retail forex

The CFTC customer advisory says that, after credits, financing charges, fees and other expenses, about one-third of customers at registered OTC forex dealers made a profit while roughly two-thirds lost money over the period summarized.

Source:
`https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html`

### SEBI — Indian equity futures and options

SEBI reported that **93% of individual traders incurred losses in the equity futures and options segment between FY2022 and FY2024**.

Source:
`https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2024/updated-sebi-study-reveals-93-of-individual-traders-incurred-losses-in-equity-fando-between-fy22-and-fy24-aggregate-losses-exceed-1-8-lakh-crores-over-three-years_86906.html`

### FINRA / SEC — activity, costs and leverage risk

FINRA's day-trading disclosure warns about transaction costs, market/execution knowledge and margin-related losses. SEC investor education similarly warns that borrowing and rapid trading can produce severe losses.

Sources:
- `https://www.finra.org/rules-guidance/rulebooks/finra-rules/2270`
- `https://www.sec.gov/about/reports-publications/investorpubsdaytipshtm`

### Behavioral evidence

Investor.gov summarizes active trading, the disposition effect, fee neglect and other behavioral patterns that can undermine performance.

Source:
`https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-72`

### Academic day-trading / retail-trading evidence

Barber, Lee, Liu, Odean and co-authors provide large-sample Taiwan day-trading evidence showing poor aggregate outcomes and very limited persistent profitable skill net of fees. Barber and Odean brokerage-account research also documents weaker net results among the most active individual investors.

Sources:
- `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=529063`
- `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2535636`
- `https://faculty.haas.berkeley.edu/odean/papers/returns/returns.html`

## 6. Owner Gate

Decision:

`retain_narrow + rebuild + reverse_recent_consolidation`

New intent key:

`retail_trader_loss_rate_evidence_failure_mechanisms`

### Task25.2 owner boundary

The restored page owns:

- whether the “90% of traders lose” claim is literally universal;
- comparison of loss-rate evidence by product/population;
- differences among CFD, OTC forex, equity F&O and day-trading samples;
- why one percentage cannot be generalized across all retail traders;
- the failure-mechanism stack: edge -> friction/costs -> risk/leverage -> execution behavior -> feedback/review;
- why psychology is only one layer of the diagnosis;
- a data-first audit for classifying trading losses.

### Broad Psychology boundary

`/blog/trading-psychology-master-emotions` remains the broad emotional-execution owner for:

- fear and greed;
- loss-aversion/disposition context;
- overconfidence;
- anchoring;
- analysis paralysis;
- broad FOMO/revenge context;
- observable emotional-execution controls.

Task25.2 references behavioral mechanisms only to explain retail loss outcomes; it does not become the general psychology guide.

### Common Trading Mistakes boundary

`/blog/common-trading-mistakes-beginners` remains the beginner checklist owner for common mistakes and practical fixes. Task25.2 owns the evidence question and failure-mechanism model, not a generic top-10 mistakes list.

### Other specialist boundaries

- Risk architecture / position sizing -> `/blog/risk-management-position-sizing-guide`
- FOMO -> `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026`
- Revenge -> `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`
- Loss recovery -> `/blog/how-to-recover-from-trading-loss`
- Rule compliance -> `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`
- Journal aggregation -> `/blog/trading-journal-review-system-2026`

## 7. Article rebuild

Completely rebuilt `content/blog/2025102601.md`.

New title:
`Why Retail Traders Lose Money: What the 90% Claim Actually Shows`

New meta title:
`Why Retail Traders Lose Money: The 90% Claim Explained`

`dateModified: 2026-08-19`

Author:
`Iven W.`

Approximate final length:
~3,465 words.

Key changes:

- removed `redirectTo`;
- removed manual Article JSON-LD;
- removed the universal “90%” assertion;
- removed universal “losses hurt exactly twice as much” language;
- replaced psychology-only causation with a multi-layer evidence model;
- added ESMA/CFTC/SEBI regulator evidence with population boundaries;
- added FINRA/SEC risk and transaction-cost context;
- added Barber/Odean academic evidence with sample limitations;
- added direct answer and key takeaways;
- added comparative evidence table;
- added edge/friction/risk/execution/feedback diagnostic;
- added seven failure mechanisms;
- added four-trader diagnostic examples;
- added a four-layer personal audit;
- added bounded ChartMini replay limitations;
- added FAQ, practical next step, source notes and risk disclaimer.

## 8. Redirect architecture

Before Task25.2 local change:

- `/blog/2025102601` -> Broad Psychology
- long target -> Broad Psychology

After Task25.2 local change:

- `/blog/2025102601` -> `/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026`
- long target is an Owner and is no longer a redirect source

Integrity audit:

- duplicate redirect sources: 0
- redirect chains: 0
- numeric residual body links: 0

## 9. Internal-link work

Two historical body links used `/blog/2025102601` and were changed to the restored long canonical:

- `content/blog/2025121701.md`
- `content/blog/2026011402.md`

A third contextual support link was added from the beginning of:

- `content/blog/2026031502.md` (`/blog/common-trading-mistakes-beginners`)

That edit also replaced an overbroad statement that retail-trader loss data is consistent across all brokers, markets and periods with a qualified explanation that rates vary by product, market and study.

Final effective support:

- 3 current non-redirecting body-link source files
- 0 body links to `/blog/2025102601`

Target article:

- 8 unique internal Blog destinations
- 0 destinations that are redirect sources

## 10. Validation

Full validation after Task25.2 content/routing/link changes:

- `pnpm build` — PASS
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check` — PASS
  - Biome: 415 files
  - Vitest: 6/6 test files
  - Tests: 17/17
- `pnpm seo:v2:workflow:check` — PASS
- `git diff --check` — PASS

Custom owner integrity:

- target manifest state: Owner
- target `dateModified`: 2026-08-19
- numeric destination: restored long canonical
- long target redirect entry: absent
- effective body inlinks: 3
- target Blog outlinks: 8
- redirecting target outlinks: 0
- duplicate redirect sources: 0
- redirect chains: 0
- manual Article schema: absent
- residual numeric body links: 0

## 11. Deployment / observation / GSC rules

Production remains on the Task23.8 redirect state until the local changes are deployed.

After actual deployment verify:

1. long target returns HTTP 200;
2. exact self-canonical;
3. new title/meta/body/dateModified are live;
4. route-generated BlogPosting only;
5. target is included in sitemap;
6. `/blog/2025102601` is a direct 301 to the long target;
7. no redirect chain;
8. the three support links point directly to the canonical target;
9. Broad Psychology remains 200 and keeps its broad emotion/bias boundary;
10. Common Trading Mistakes remains 200 and keeps its beginner checklist boundary.

Establish a new 7-day / 14-day observation window from the actual Task25.2 deployment date.

GSC:

- inspect the restored long canonical after deployment;
- Request Indexing only if the current index state is stale/unindexed and quota use is justified;
- never submit `/blog/2025102601`;
- do not submit Broad Psychology merely because this source was restored.

Bing/IndexNow remain `unknown_not_reverified` unless separately verified.

## 12. Execution boundary

Task25.2 did not commit, push, deploy, submit GSC, call Bing/IndexNow, or sync R2.

The unrelated tracked `content/blog/2026030502.md` modification remains outside Task25.2 scope and was not touched.
