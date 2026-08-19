# Task 25.4 — Wyckoff Accumulation / Distribution Phases

Date: 2026-08-19
Target: `/blog/wyckoff-method-explained-accumulation-and-distribution-phases-2026`
Source: `content/blog/2026020601.md`
Numeric legacy path: `/blog/2026020601`
Neighbor broad owner: `/blog/wyckoff-method-guide` (`content/blog/2026040801.md`)

Final status: `RETAIN_NARROW_REBUILD_COMPLETE_PENDING_DEPLOY`
Owner Gate: `retain_narrow + rebuild`

## 1. Fresh production preflight

Production was checked on 2026-08-19 before editing.

Target:
- long target returns HTTP 200
- exact self-canonical: `https://chartmini.com/blog/wyckoff-method-explained-accumulation-and-distribution-phases-2026`
- current title: `Wyckoff Method Explained: Accumulation and Distribution Phases | ChartMini Blog`
- present in production sitemap

Numeric path:
- `/blog/2026020601` returns direct HTTP 301 to the target long URL
- no redirect chain

Broad neighbor:
- `/blog/wyckoff-method-guide` returns HTTP 200
- exact self-canonical
- present in production sitemap

Current GSC target state: `unknown_not_reverified`.
Current Bing target state: `unknown_not_reverified`.
No legacy GSC/Bing values were inherited.

## 2. Fresh SERP / intent evidence

Fresh searches included:
- `Wyckoff method accumulation distribution phases 2026`
- `Wyckoff accumulation distribution phases spring upthrust schematic`
- `site:chartmini.com wyckoff method accumulation distribution phases`
- current Wyckoff reference/source searches against StockCharts, Wyckoff Analytics and CMT Association

Observed SERP pattern:
- broad `Wyckoff Method` results cover the full methodology: origin, Composite Man/Operator heuristic, three laws, market-selection workflow, price cycle, trading ranges, buying/selling tests and P&F work
- narrower results exist specifically for `Wyckoff accumulation`, `distribution`, `schematics`, `Phases A-E`, spring and upthrust/UTAD interpretation
- the existing ChartMini target itself surfaced for the exact accumulation/distribution query, indicating the long URL has search relevance despite having zero body inlinks before Task25.4

Current examples reviewed:
- StockCharts ChartSchool `The Wyckoff Method: A Tutorial`
- Wyckoff Analytics `Wyckoff Method`
- CMT Association `Technically Speaking, June 2026` modern-Wyckoff discussion
- current SERP pages centered specifically on accumulation/distribution schematics and phases

Important reference corrections from current Wyckoff material:
- A-E are phases; PS/SC/AR/ST/Spring/SOS/LPS etc. are events, not the five phases themselves.
- A spring is not mandatory in every accumulation schematic.
- A UTAD is not mandatory in every distribution schematic.
- Wyckoff cause-and-effect is tied to Point-and-Figure counting methodology; elapsed time in a range is not a universal percentage-move formula.

## 3. Cannibalization / site graph

Before Task25.4, ChartMini had two live 200 pages with substantial overlap:

### Target
`/blog/wyckoff-method-explained-accumulation-and-distribution-phases-2026`

Old body covered:
- broad Wyckoff definition and three laws
- full market cycle
- detailed accumulation and distribution
- springs/upthrusts
- generic strategy combinations with VSA, MAs and RSI
- universal performance claims
- market/timeframe recommendations

Effective direct body inlinks before Task25.4: **0**.

### Broad guide
`/blog/wyckoff-method-guide`

Old body also covered:
- broad Wyckoff method
- Composite Operator
- full accumulation A-E tutorial
- distribution events
- springs/upthrusts
- entries
- comparisons with other technical frameworks

Effective source files linking to the broad guide before the boundary edit: **3**.

Keeping both pages unchanged would preserve overlapping ownership.

## 4. Owner Gate decision

Decision: `retain_narrow + rebuild`.

Do not consolidate the target into the broad guide because fresh SERP supports a durable narrower schematic/phase intent.

Final ownership boundary:

### Task25.4 target owns
Intent key: `wyckoff_accumulation_distribution_schematics_phase_events`

- accumulation schematic Phases A-E
- distribution schematic Phases A-E
- phase vs event distinction
- PS / SC / AR / ST
- Spring / shakeout and failure rules
- SOS / LPS
- PSY / BC / AR / ST
- UT / UTAD and failure rules
- SOW / LPSY
- spring vs genuine breakdown
- upthrust vs genuine breakout
- re-accumulation / redistribution distinction
- volume-data limitations within phase labeling
- replay-based no-hindsight phase-labeling workflow

### Broad Wyckoff guide owns
Intent key: `wyckoff_method_broad_methodology_composite_laws_workflow`

- broad Wyckoff Method introduction
- historical methodology context
- Composite Man / Composite Operator heuristic
- three Wyckoff laws
- overall market cycle
- high-level role of accumulation/distribution
- how Wyckoff relates to broader market-analysis workflow and neighboring frameworks

The broad guide may summarize accumulation/distribution, but detailed A-E/event interpretation hands off to Task25.4.

## 5. Old target quality problems

The old Task25.4 body contained material quality/evidence defects:

- unsupported `70-85% institutional trading volume` claim
- treating volume as direct proof of institutional intent
- deterministic `institutions buy fear / sell greed` narrative
- claim that market patterns are predictable because institutions must accumulate/distribute in a specific way
- fixed accumulation/distribution duration ranges
- claim that longer elapsed duration directly produces a larger percentage markup/markdown
- unsupported universal success rates such as 70-85%
- unsupported universal R:R claims such as 3:1 to 5:1
- universal `75% win rate / ~2R expectancy` calculation
- `RSI divergence confirms accumulation/distribution` claim
- fixed 50-day-MA confirmation rules
- unsupported market rankings such as crypto or specific markets being the most reliable for Wyckoff
- false product copy claiming ChartMini automatically detects Wyckoff phases/events and sends high-probability alerts
- manual Article JSON-LD in Markdown

These defects justified a full rebuild rather than a light refresh.

## 6. Target rebuild

Rebuilt `content/blog/2026020601.md`.

New title:
`Wyckoff Accumulation and Distribution: Phases A-E Explained`

New meta title:
`Wyckoff Accumulation & Distribution: Phases A-E`

New description:
`Learn the Wyckoff accumulation and distribution schematics phase by phase, including PS, SC, AR, ST, springs, UTAD, SOS, LPS, SOW, and failure rules.`

`dateModified: 2026-08-19`
Author: `Iven W.`
Approximate word count after rebuild: **3,565**.

New body includes:
- direct answer in the opening
- key takeaways
- phase-vs-event table
- accumulation A-E section
- distribution A-E section
- competing-hypothesis comparison table
- spring vs real breakdown rules
- upthrust vs real breakout rules
- explicit volume/participant-identity limitation
- re-accumulation/redistribution boundary
- hindsight/error section
- replay workflow
- dedicated intent handoff to the broad guide
- FAQ
- practical next step
- current source/reference notes

No manual Article/BlogPosting schema remains in the target Markdown.

## 7. Broad-guide cannibalization correction

`content/blog/2026040801.md` was not rebuilt as a second Task25.4 article. It received a scoped boundary correction required to make the two-owner architecture credible.

Changes:
- removed the long duplicate accumulation A-E tutorial
- removed the long duplicate distribution event tutorial
- replaced those sections with a concise broad-methodology summary
- added a direct contextual link to the Task25.4 schematic owner
- explicitly states that OHLCV does not directly prove participant identity
- `dateModified: 2026-08-19`

The broad guide remains a 200 Owner and keeps its methodology/composite/laws role.

## 8. Internal links

Task target effective direct body support before edit: **0**.

Task25.4 established three direct contextual source files:
- `content/blog/2026040801.md` — Broad Wyckoff Guide handoff
- `content/blog/2025112101.md` — Crypto Market Cycles accumulation/distribution boundary
- `content/blog/2026032301.md` — Volume Guide participant-identity boundary

Final effective target body-support source count: **3**.

Broad guide still has **4** effective source files after the boundary work, so the new support does not orphan or weaken the broad owner below the v2 body-link baseline.

Residual body links to `/blog/2026020601`: **0**.

Target internal Blog destinations after rebuild: **2**, both direct final owners:
- `/blog/wyckoff-method-guide`
- `/blog/how-to-read-trading-volume`

`/play` is also used as the direct practice product route.

Target outbound Blog links resolving through redirects: **0**.

## 9. Redirect / canonical architecture

No Task25.4 redirect-config change was required.

Local final architecture:
- long target remains Owner, no `redirectTo`
- `/blog/2026020601` -> direct permanent redirect -> long target
- `/blog/wyckoff-method-guide` remains independent Owner

Repository redirect audit after build:
- duplicate redirect sources: **0**
- redirect chains: **0**

## 10. Validation

Full validation after Task25.4 changes:

- `pnpm build` — PASS
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check` — PASS
  - Biome: 415 files
  - Vitest: 6/6 test files
  - Tests: 17/17
- `pnpm seo:v2:workflow:check` — PASS
  - 13 required workflow files
  - 402 Blog Markdown files
- `git diff --check` — PASS
- target manifest = Owner
- broad guide manifest = Owner
- target `dateModified` = `2026-08-19`
- broad guide `dateModified` = `2026-08-19`
- numeric redirect destination correct
- long target not a redirect source
- target body-support sources = 3
- broad-guide body-support sources = 4
- target Blog redirect outlinks = 0
- manual target Article/BlogPosting schema = absent

## 11. Deployment / indexing state

No commit, push, deploy, R2 sync, GSC submission, Bing submission or IndexNow action was performed in Task25.4.

Production remains on the old Task25.4 body until the user deploys the pending changes.

After deployment verify:
1. target long URL remains HTTP 200
2. exact self-canonical remains intact
3. new title/meta/body/dateModified are live
4. target remains sitemap-listed
5. `/blog/2026020601` remains a direct 301 to target
6. `/blog/wyckoff-method-guide` remains HTTP 200/self-canonical
7. broad guide reflects the new narrow handoff rather than the duplicate A-E tutorial
8. the three direct body-support links are live
9. route-generated BlogPosting remains the only article-type schema rendered for target

GSC rule after deployment:
- inspect the canonical target first
- Request Indexing only if current indexed state is stale/unindexed and quota use is justified
- do not submit `/blog/2026020601`
- because the broad guide body also changed to enforce the boundary, inspect it only if needed; do not automatically consume indexing quota if it is already current/indexed

Observation dates: pending actual deployment verification. Establish a fresh 7-day and 14-day observation window for the target after deployment; record the broad-guide boundary edit in the same Task25.4 observation context.
