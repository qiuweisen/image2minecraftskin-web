# Task 22.8 — Cluster Intent, Internal Links, and Cannibalization Review

Date: 2026-08-17
Status: `PASS_WITH_TEN_ADDITIONAL_CONSOLIDATIONS_PENDING_DEPLOY`
Scope: Task22.1–22.7 owners, redirect sources, adjacent intent owners, internal-link graph, and remaining live broad duplicates.

## Goal

Revalidate the Task22 cluster as one system rather than as isolated articles. The review must confirm:

- one durable owner for each broad intent;
- specialist pages retain clearly narrower intent boundaries;
- body links point directly to final canonical owners rather than redirect sources;
- redirect sources are unique and direct, with no redirect chains;
- broad duplicate pages are consolidated when they have no durable residual intent;
- protected Task21/Task20 owners are not rewritten without a hard factual, technical, redirect, or boundary reason.

No current-v2 GSC or Bing performance data is available for this run, so performance fields remain `unknown_not_reverified`. No legacy metrics were imported.

## Fresh SERP / web evidence

Fresh search on 2026-08-17 included broad ChartMini queries for:

- day trading beginner roadmap;
- FOMO / trading psychology / revenge trading;
- market / limit / stop order types;
- multiple timeframe analysis;
- order blocks / supply and demand;
- prop firms / funded accounts;
- risk management / position sizing;
- broad position-sizing variants.

Important fresh-search observations:

1. `/blog/risk-management-position-sizing-guide` and the Task22.7 historical broad-risk target both surfaced for the same broad risk-management intent, supporting the Task22.7 consolidation.
2. Multiple old Position Sizing pages surfaced simultaneously, including:
   - `/blog/the-art-of-position-sizing-how-much-to-trade-2026`
   - `/blog/position-sizing-mastery-how-to-calculate-the-perfect-trade-size-every-time-in-2026-2026`
   - `/blog/position-sizing-mastery-the-secret-to-consistent-trading-profits-2026`
3. Multiple broad Trading Psychology pages surfaced for generic fear/greed/revenge/emotional-discipline queries even though Task22.2 had already established `/blog/trading-psychology-master-emotions` as the stronger broad owner.
4. Revenge-trading searches surfaced broad/emotional/recovery pages rather than the orphan `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`; the dedicated old revenge page had zero body inlinks.
5. Existing Task22 owners for day trading, order types, MTA, order blocks, prop-firm mechanics, FOMO, and broad risk remained consistent with their earlier Owner Gates.

Fresh search sources included ChartMini production results plus current official sources already used by Task22.1–22.7. Task22.8 did not introduce new financial-rule claims beyond those already verified in the owner tasks.

## Core owner boundaries retained

### Day trading beginner roadmap

Owner: `/blog/how-to-start-day-trading`

Retained boundary:
- beginner roadmap;
- account / market / settlement awareness;
- current U.S. intraday-margin transition context;
- execution basics;
- one-testable-setup planning;
- practice / journal / live-transition framework.

Simulator, practice-session, style-comparison, mistakes, risk, journal, and trading-plan pages remain separate.

Body-level owner inlink files after Task22.8: 38.

### FOMO specialist

Owner: `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026`

Retained boundary:
- fear of missing out;
- social/missed-move triggers;
- FOMO vs planned momentum;
- late-entry re-evaluation;
- anti-chasing decision process;
- missed-trade journaling and replay.

Body-level owner inlink files after Task22.8: 5.

### Broad trading psychology

Owner: `/blog/trading-psychology-master-emotions`

Retained boundary:
- fear;
- greed / overconfidence;
- revenge-trading context;
- anchoring / analysis paralysis;
- general emotional execution controls.

Task22.8 adds six broad-psychology consolidations because their content and search intent duplicate this owner. FOMO remains separate. Behavioral post-loss recovery remains separate.

Body-level owner inlink files after Task22.8: 20.

### Behavioral post-loss recovery

Owner: `/blog/how-to-recover-from-trading-loss`

Retained boundary:
- planned vs rule-breaking vs out-of-plan loss triage;
- loss chasing / revenge trading after a loss;
- pause/review/reduced-risk/simulation controls;
- evidence for returning to normal risk.

Task22.8 consolidates the orphan dedicated revenge-trading page here because its trigger and recovery workflow are the same prior-loss behavioral intent.

Body-level owner inlink files after Task22.8: 7.

### Broad order types

Owner: `/blog/order-types-explained`

Retained boundary:
- market / limit / stop / stop-limit;
- trailing stop;
- OCO/bracket;
- time-in-force;
- execution-priority vs price-control trade-offs.

Stop-vs-stop-limit, trailing-stop, pre-entry stop/target planning, and Level 2 remain separate.

Body-level owner inlink files: 23.

### Multiple timeframe analysis

Owner: `/blog/multiple-timeframe-analysis`

Retained boundary:
- context / decision / execution timeframe roles;
- top-down workflow;
- conflict handling;
- completed vs forming higher-timeframe bars;
- session/aggregation differences;
- MTF look-ahead controls.

Multi-timeframe replay remains separate.

Body-level owner inlink files after Task22.8: 26.

### Order block specialist

Owner: `/blog/order-block-trading-supply-demand-zones-2026`

Retained boundary:
- versioned order-block candle/base rules;
- zone boundaries;
- displacement;
- optional structure confirmation;
- retest/freshness;
- invalidation/expiry;
- no-hindsight testing and evidence limits.

Supply/Demand, broad SMC, market structure, Level 2 and Order Flow remain separate specialists.

Body-level owner inlink files: 4.

### Prop-firm / funded-account mechanics

Owner: `/blog/prop-trading-firms-funded-accounts`

Retained boundary:
- evaluation / challenge mechanics;
- simulated-vs-live funded-account models;
- drawdown / consistency / payout rules;
- due diligence;
- challenge preparation.

Task22.6 remains a live revalidation only; the historical long slug stays redirected. Observation dates remain 2026-08-22 and 2026-08-29.

Body-level owner inlink files after current local cleanup: 4.

### Broad trading risk architecture

Owner: `/blog/risk-management-position-sizing-guide`

Retained boundary:
- risk capital / account basis;
- position-size control;
- stop / adverse-fill / gap risk;
- leverage and margin;
- portfolio heat / concentration;
- risk-reward / expectancy interaction;
- circuit breakers / drawdown process;
- testing / review.

Task22.8 adds one more broad-risk duplicate consolidation.

Body-level owner inlink files after Task22.8: 62.

### Beginner Position Sizing

Owner: `/blog/position-sizing-dont-let-one-trade-ruin-your-portfolio-2026`

Owner boundary:
- beginner risk-per-trade formula;
- simple fixed-risk sizing;
- stop-distance relationship;
- introductory drawdown/recovery context;
- simulator/replay practice.

Body-level owner inlink files after cleanup: 12.

### Advanced Position Sizing Methods

Owner: `/blog/position-sizing-mastery-the-secret-to-consistent-trading-profits-2026`

Owner boundary:
- fixed-risk / fixed-fractional comparison;
- cross-market unit conversion;
- futures / forex / options sizing;
- volatility/ATR methods;
- Kelly-style methods;
- rounding / implementation controls;
- portfolio constraints and model testing.

Body-level owner inlink files after cleanup: 11.

### 1% Rule specialist

Owner: `/blog/the-1-rule-why-most-traders-get-position-sizing-wrong-2026`

Retained boundary:
- exact 1% convention;
- account-basis definition;
- 1% formula;
- compounded losing-streak math;
- planned-vs-realized loss;
- open-risk aggregation;
- why 1% is a convention rather than a law.

Body-level owner inlink files: 3.

## Additional Task22.8 consolidations

Task22.8 found ten additional live 200 pages with no durable independent owner value after the earlier Task22 tasks.

### 1. Broad Risk duplicate

Source file: `content/blog/2026011303.md`
Source long slug: `/blog/risk-management-mastery-protect-your-capital-and-survive-any-market-2026`
Numeric source: `/blog/2026011303`
Destination: `/blog/risk-management-position-sizing-guide`
Reason:
- generic risk-management intent duplicates the Task22.7 owner;
- zero body inlinks before consolidation;
- old page contains universal 1–2% risk, fixed portfolio-risk, drawdown and market-condition prescriptions that conflict with the current evidence-aware owner.

### 2. Position Sizing advanced duplicate

Source file: `content/blog/2026010501.md`
Source long slug: `/blog/the-art-of-position-sizing-how-much-to-trade-2026`
Numeric source: `/blog/2026010501`
Destination: `/blog/position-sizing-mastery-the-secret-to-consistent-trading-profits-2026`
Reason:
- ATR sizing, Kelly, portfolio heat, cross-market examples and sizing methods overlap the stronger updated advanced owner;
- fresh search exposed both URLs for position-sizing intent;
- direct body links were canonicalized to the advanced owner.

### 3. Position Sizing beginner duplicate

Source file: `content/blog/2026010902.md`
Source long slug: `/blog/position-sizing-mastery-how-to-calculate-the-perfect-trade-size-every-time-in-2026-2026`
Numeric source: `/blog/2026010902`
Destination: `/blog/position-sizing-dont-let-one-trade-ruin-your-portfolio-2026`
Reason:
- fixed-risk formula, 1%/2% explanation, simple volatility context and replay drill duplicate the beginner owner;
- fresh search exposed both basic position-sizing pages;
- live body links were moved directly to the beginner owner.

### 4–9. Broad Trading Psychology duplicates

All six sources now redirect directly to `/blog/trading-psychology-master-emotions`:

1. `content/blog/2025123002.md`
   - `/blog/mastering-trading-emotions-a-guide-to-psychological-discipline-2026`
   - `/blog/2025123002`
2. `content/blog/2026031001.md`
   - `/blog/trading-psychology-emotional-discipline-guide`
   - `/blog/2026031001`
3. `content/blog/2026011302.md`
   - `/blog/trading-psychology-mastery-how-to-conquer-fear-greed-and-revenge-trading-2026`
   - `/blog/2026011302`
4. `content/blog/2026010705.md`
   - `/blog/trading-psychology-in-2026-master-your-mind-or-watch-your-account-die-2026`
   - `/blog/2026010705`
5. `content/blog/2026010901.md`
   - `/blog/trading-psychology-mastery-how-to-control-your-emotions-and-trade-with-discipline-in-2026-2026`
   - `/blog/2026010901`
6. `content/blog/2026021702.md`
   - `/blog/the-future-of-trading-psychology-in-2026-market`
   - `/blog/2026021702`

Reason:
- all six are broad fear/greed/FOMO/revenge/discipline psychology pages rather than durable specialists;
- five had zero body inlinks and one had only two;
- fresh search surfaced multiple competing broad psychology URLs;
- the existing `/blog/trading-psychology-master-emotions` owner has the stronger site graph and was already selected by Task22.2;
- `2026`, `future`, `AI-driven`, `mastery`, and `discipline` framing did not justify separate broad owners.

Task22.8 also surgically updated `content/blog/2026041202.md`:
- `dateModified: 2026-08-17`;
- replaced a universal 15–30-minute revenge-trading break rule with a prewritten post-loss recovery rule;
- added a direct canonical link to `/blog/how-to-recover-from-trading-loss`.

### 10. Revenge Trading orphan

Source file: `content/blog/2026010403.md`
Source long slug: `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`
Numeric source: `/blog/2026010403`
Destination: `/blog/how-to-recover-from-trading-loss`
Reason:
- zero body inlinks;
- fresh revenge-trading search did not surface it as a preferred ChartMini result;
- the page's actual workflow is post-loss anger/loss-chasing/recovery, already owned by the protected Behavioral Recovery owner;
- old page contains universal cooldown, trade-limit and daily-loss prescriptions that should not be maintained as a second indexable owner.

No body rewrite of the redirect source is required after consolidation.

## Internal-link cleanup

All body links to the new Task22.8 redirect sources were converted directly to final canonical owners.

Important cleanup:
- old `/blog/the-art-of-position-sizing-how-much-to-trade-2026` links now point to the advanced Position Sizing owner;
- old `/blog/position-sizing-mastery-how-to-calculate-the-perfect-trade-size-every-time-in-2026-2026` links now point to the beginner Position Sizing owner;
- broad-psychology links now point to `/blog/trading-psychology-master-emotions`;
- broad Position Sizing owner boundary text no longer presents the two new redirect sources as independent owners;
- Broad Psychology now links revenge/loss-chasing recovery to `/blog/how-to-recover-from-trading-loss`.

Post-cleanup body links to all ten new redirect-source long slugs: 0.

## Redirect architecture

Each new consolidation has both:
- numeric source -> final owner;
- long slug -> final owner.

No new redirect source points to another redirect source.

Global duplicate redirect-source definitions after Task22.8: 0.

## Manifest / indexability check after `pnpm prebuild`

`pnpm prebuild` regenerated 402 blog posts.

All ten new sources carry `redirectTo` in `src/generated/blog-manifest.json`.

No live broad duplicate candidate remained in the targeted Task22.8 patterns for:
- generic Risk Management Mastery;
- the two deprecated Position Sizing middle pages;
- generic Trading Psychology Mastery / Trading Emotions / Future of Trading Psychology pages.

Task22.8 does not claim production 301s yet. Production is still pre-deployment for these new redirects.

## Current owner inlink snapshot after cleanup

- `/blog/how-to-start-day-trading`: 38
- FOMO owner: 5
- `/blog/order-types-explained`: 23
- `/blog/multiple-timeframe-analysis`: 26
- Order Block owner: 4
- Prop-firm owner: 4
- Broad Risk owner: 62
- Beginner Position Sizing owner: 12
- Advanced Position Sizing owner: 11
- 1% Rule owner: 3
- Broad Psychology owner: 20
- Behavioral Recovery owner: 7

Counts are Markdown body-link file counts and are used as site-graph evidence, not traffic metrics.

## Task22.8 conclusion

Result: `PASS_WITH_TEN_ADDITIONAL_CONSOLIDATIONS_PENDING_DEPLOY`

The Task22 cluster now has a clearer hierarchy:

- broad owner -> specialist owner -> product/practice owner;
- no canonical body links to Task22.8 redirect sources;
- no duplicate redirect-source definitions;
- no remaining live broad duplicate matching the Task22.8 risk / position-sizing / broad-psychology patterns in the local manifest.

Task22.9 must run the full repository validation and final Workflow sync before the Task22 batch is considered locally closed.

No commit, push, deploy, R2 sync, GSC Request Indexing, Bing, or IndexNow action was performed in Task22.8.
