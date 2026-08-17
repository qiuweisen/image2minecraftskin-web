# Task 23.8 — Cluster Intent, Internal Link, and Cannibalization Review

Date: 2026-08-17
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Branch: `main`

## Scope

Fresh cluster-level revalidation after Task23.2–23.7 covering:

- Swing Trading concept / strategy / part-time / current-viability / style-comparison pages
- Day Trading mistakes vs broad beginner mistakes
- Broad Trading Psychology vs AI Psychology vs Revenge Trading vs Behavioral Recovery vs FOMO vs Trading Discipline
- body-level internal links
- local owner support / orphan risk
- redirect chains and duplicate redirect sources
- fresh production and SERP signals

Current GSC/Bing performance remains `unknown_not_reverified`; no current performance metrics were invented.

## Production snapshot before Task23 deployment

Fresh production checks on 2026-08-17 show the expected pre-deployment mixed state:

- `/blog/swing-trading-explained-the-ultimate-guide-for-2026` — 200
- `/blog/swing-trading-strategies-guide` — 200
- `/blog/swing-trading-for-part-time-traders` — 200
- `/blog/is-swing-trading-still-effective-in-2026-complete-analysis` — 200
- `/blog/the-5-deadly-day-trading-mistakes-that-will-blow-up-your-account-in-2026-2026` — 200
- `/blog/the-future-of-trading-psychology-in-2026-market` — still production 301 to Broad Psychology until Task23.5 deploys
- `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026` — still production 301 to Behavioral Recovery until Task23.6 deploys
- `/blog/the-truth-about-discipline-no-one-tells-you` — still production 200 until Task23.7 deploys
- `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026` — 200
- `/blog/trading-psychology-master-emotions` — 200
- `/blog/how-to-recover-from-trading-loss` — 200

These production differences are deployment lag, not evidence against the local Task23 Owner Gates.

## Fresh SERP conclusions

Fresh ChartMini-focused exact-intent searches support the following split:

- generic Swing Trading strategy intent -> `/blog/swing-trading-strategies-guide`
- Swing Trading `what is / explained` -> `/blog/swing-trading-explained-the-ultimate-guide-for-2026`
- exact part-time Swing Trading -> `/blog/swing-trading-for-part-time-traders`
- exact `is swing trading still effective` -> `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`
- Day Trading mistakes -> Task23.4 owner
- generic Trading Discipline / follow-rules intent -> Execution Gap owner
- Revenge Trading remains a distinct trigger/interruption query from broader trading-loss recovery

The fresh exact-intent evidence supports retaining Part-Time Swing and Swing Viability, but their old bodies materially overlapped generic strategy intent or contained unsupported universal performance claims. Task23.8 therefore rebuilds them rather than consolidating them.

A separate historical page, `/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026`, had only one body inlink, a generic broad-psychology body, and an unsupported `90%` headline/statistic. Its content is not sufficiently distinct from the established Broad Psychology owner to justify another indexable broad psychology page. Task23.8 consolidates it.

## Swing Trading final intent architecture

### 1. Concept / mechanics

Owner:
`/blog/swing-trading-explained-the-ultimate-guide-for-2026`

Boundary:
- definition
- multi-session holding mechanics
- overnight/weekend/event risk
- account/rule boundaries
- timeframe roles
- market-specific holding risk
- replay-practice limitations

Task23.2 remains intact.

### 2. Strategy / setup families

Owner:
`/blog/swing-trading-strategies-guide`

Boundary:
- concrete testable setup families
- context/setup/trigger/invalidation/exit
- strategy versioning/testing
- look-ahead and fill limitations

Task23.3 remains intact.

### 3. Part-time schedule / operating workflow

Owner:
`/blog/swing-trading-for-part-time-traders`

Source:
`content/blog/2026030302.md`

Owner Gate:
`retain_narrow + rebuild`

Reason:
Fresh exact-intent search supports a genuine part-time use-case, but the old body primarily presented five `proven` generic swing strategies with fixed timeframes, trade frequencies, capital requirements and risk prescriptions. That cannibalized the generic Strategies owner.

Rebuilt title:
`Swing Trading for Part-Time Traders: A Practical Workflow for 2026`

Rebuilt scope:
- real decision windows around work/family/timezone constraints
- research -> setup -> trigger -> invalidation -> exit operating stack
- event calendar / earnings / macro risk
- alerts vs broker orders
- unattended order and stop-fill risk
- position sizing without universal risk percentages
- margin, T+1 and 2026 FINRA intraday-margin transition boundaries
- journaling whether the strategy is actually manageable with limited monitoring
- replay practice with limited decision windows

Removed/reframed:
- five `proven` strategy framing
- fixed daily/4H chart prescription
- fixed screen-time/trade-frequency tables
- fixed $2k-$5k minimum capital
- universal 1-2% risk rule
- generic `best for part-time traders` claims

Article length after rebuild: ~2,680 words.
Manual Article/BlogPosting: absent.
Internal Blog links: 9; all point to current non-redirecting owners in the post-edit audit.

### 4. Current viability / effectiveness

Owner:
`/blog/is-swing-trading-still-effective-in-2026-complete-analysis`

Source:
`content/blog/2026021002.md`

Owner Gate:
`retain_narrow + rebuild`

Reason:
Fresh exact-intent search supports a distinct `does swing trading still work / is it still effective` question. The old article, however, invented or generalized universal 73% participation, 45-58% win rates, fixed holding periods, 3-8% monthly-return targets, transaction-cost retention percentages, capital minimums and categorical superiority over Day Trading.

Rebuilt title:
`Is Swing Trading Still Effective in 2026? What Actually Determines Viability`

Rebuilt scope:
- Swing Trading as a holding style rather than one universal edge
- why no universal current win rate/monthly return can be assigned to the category
- modern execution assumptions and costs
- overnight/gap/stop-fill risk
- current T+1 and 2026 FINRA transition boundaries
- freeze a strategy definition before testing
- out-of-sample evaluation
- look-ahead avoidance
- realistic commission/slippage/fill assumptions
- regime segmentation
- result-distribution review rather than win rate alone
- forward testing and criteria for retiring a specific strategy
- bounded ChartMini replay capability

Removed/reframed:
- 73% retail participation statistic
- 45-58% universal swing-trading win-rate ranges
- fixed 3-8 day / 3-5 day holding claims
- 20-40% vs 85-95% transaction-cost claims
- 3-8% monthly-return target
- fixed $2k-$25k capital recommendations
- universal 1-2% risk rule
- stale universal PDT framing
- `swing trading offers superior risk-adjusted returns` claim
- `potentially more profitable than ever` claim

Article length after rebuild: ~2,597 words.
Manual Article/BlogPosting: absent.
Internal Blog links: 5; all point to current non-redirecting owners in the post-edit audit.

### 5. Style comparison

Owner:
`/blog/day-trading-vs-swing-trading-vs-long-term-investing-find-your-style-2026`

Boundary remains style comparison/selection, not definition, strategy rules, part-time workflow or current viability.

## Trading Psychology / behavioral architecture

Final local owner graph:

- `/blog/trading-psychology-master-emotions` — broad fear, greed, anchoring, overconfidence, analysis paralysis, emotional execution
- `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026` — FOMO / anti-chasing
- `/blog/the-future-of-trading-psychology-in-2026-market` — AI/GenAI, automation reliance, human override, AI/social-media decision effects
- `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026` — immediate post-loss loss-chasing / next-trade interruption
- `/blog/how-to-recover-from-trading-loss` — broader loss-event classification, losing-sequence recovery and return-to-risk
- `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026` — Trading Discipline / Execution Gap / Rule Compliance

Task23.5 and Task23.6 restorations remain narrow and do not recreate the generic psychology duplicates removed in Task22.8.

## Additional Broad Psychology consolidation

Redirect source:
`/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026`

Source:
`content/blog/2025102601.md`

Numeric source:
`/blog/2025102601`

Destination:
`/blog/trading-psychology-master-emotions`

Owner Gate:
`consolidate_redirect`

Reason:
- only 1 pre-cleanup body inlink
- generic overconfidence/loss aversion/revenge/FOMO/confirmation-bias/analysis-paralysis content overlaps Broad Psychology
- unsupported `90%` headline/statistic
- no durable specialist workflow distinct from Broad Psychology

Changes:
- added `redirectTo` to the Markdown source
- long slug and numeric source route directly to Broad Psychology
- the single body link from `content/blog/2025122301.md` now points directly to Broad Psychology
- residual body links to the redirect source: 0 in the post-edit audit

Do not submit either redirect source to GSC.

## Day Trading mistakes boundary

`/blog/the-5-deadly-day-trading-mistakes-that-will-blow-up-your-account-in-2026-2026` remains the intraday process-failure owner.

`/blog/common-trading-mistakes-beginners` remains the broader cross-style beginner mistakes owner.

No consolidation is justified between those two.

## Internal-link and redirect integrity after Task23.8 edits

Pre-final-build local graph audit found:

- body links pointing to redirect-source Blog URLs: **0**
- duplicate redirect-source definitions: **0**
- all Part-Time Swing internal Blog links: direct current owners
- all Swing Viability internal Blog links: direct current owners
- Truth About Discipline remains a zero-inlink redirect source to Execution Gap
- Why-90% page is now a zero-inlink redirect source to Broad Psychology

The exact owner support counts will be regenerated and recorded again in Task23.9 after `pnpm build`.

## Task23.8 result

`PASS_WITH_TWO_NARROW_REBUILDS_AND_ONE_ADDITIONAL_PSYCHOLOGY_CONSOLIDATION`

Changes made:

1. retain + rebuild `/blog/swing-trading-for-part-time-traders`
2. retain + rebuild `/blog/is-swing-trading-still-effective-in-2026-complete-analysis`
3. consolidate `/blog/why-90-of-retail-traders-lose-money-common-psychological-traps-2026` + `/blog/2025102601` -> `/blog/trading-psychology-master-emotions`
4. replace the only body link to the Why-90% redirect source with a direct Broad Psychology link

No product-route change was made.

## GSC / Bing

No GSC Request Indexing, Bing, or IndexNow action performed.

Current Task23 canonical submission decisions must wait for user deployment and fresh production verification. Redirect-source URLs must not be submitted. If a canonical owner is already indexed, do not spend Request Indexing quota solely because Task23 changed it.
