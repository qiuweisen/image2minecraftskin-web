# Task 23.7 — Trading Discipline / Execution Gap Consolidation

Date: 2026-08-17
Status: `CONSOLIDATE_REDIRECT_REBUILD_OWNER_COMPLETE_PENDING_DEPLOY`

## Requested URL

- URL: `/blog/the-truth-about-discipline-no-one-tells-you`
- Source: `content/blog/2026022703.md`
- Pre-task local state: live owner source, no `redirectTo`
- Pre-task production state: HTTP 200; included in production sitemap
- Legacy numeric path: `/blog/2026022703` -> direct production 301 to requested long slug

## Selected canonical owner

- URL: `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`
- Source: `content/blog/2026010302.md`
- Pre-task production state: HTTP 200; sitemap-listed
- Legacy numeric path: `/blog/2026010302` -> direct redirect to canonical owner
- Pre-task body-level inlink files: 3 owner/source files plus one redirected FOMO source; after Task23.7 support work, 3 current non-redirecting source pages support the owner plus the existing redirected source.

## Data Gate

- Current v2 GSC metrics: `unknown_not_reverified`
- Current v2 Bing metrics: `unknown_not_reverified`
- No historical GSC/Bing values were imported.
- Task proceeded using fresh production, fresh SERP, current site graph, current source, and current primary research evidence.

## Fresh production preflight

Observed on 2026-08-17 before Task23.7 deployment:

- `/blog/the-truth-about-discipline-no-one-tells-you` -> 200
- `/blog/2026022703` -> 301 to `/blog/the-truth-about-discipline-no-one-tells-you`
- `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026` -> 200
- both long-form pages were indexable/sitemap-visible before consolidation
- target had 0 Markdown body inlinks
- Execution Gap owner had materially stronger site support

Production will remain in this pre-task state until the user deploys Task23.7.

## Fresh SERP evidence

Fresh web searches included:

- `site:chartmini.com/blog "the truth about discipline no one tells you"`
- `site:chartmini.com/blog trading discipline follow trading rules ChartMini`
- `trading discipline psychology follow rules execution gap 2026`
- `trading discipline trading psychology how to follow rules`
- exact-title and discipline/follow-rules follow-up searches

Observed intent pattern:

- ChartMini's `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026` surfaced directly for the generic trading-discipline / follow-your-rules intent.
- The requested `The Truth About Discipline No One Tells You` page did not establish a stronger distinct SERP role.
- Current external results for trading discipline similarly frame the problem as converting rules into checklists, review, constraints, and repeatable execution rather than a separate durable “truth about discipline” intent.

Conclusion: the requested page is a same-intent editorial variant, not a defensible independent owner.

## Cannibalization / Owner Gate

### Requested page

The requested article and Execution Gap page both address:

- knowing the rules but failing to follow them;
- willpower versus process/system design;
- stop/exit rule violations;
- overtrading/FOMO/revenge behavior;
- position-size effects on execution;
- environmental friction;
- replay practice for rule following.

The requested page had zero body-level internal support and did not own a narrower durable query family.

### Neighbor boundaries retained

- Broad fear/greed/anchoring/emotional execution -> `/blog/trading-psychology-master-emotions`
- Revenge/loss-chasing after a recent loss -> `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`
- Broader loss-event recovery / return to risk -> `/blog/how-to-recover-from-trading-loss`
- Trading plan architecture -> `/blog/how-to-build-trading-plan`
- Pre-entry checklist -> `/blog/pre-trade-checklist`
- Journaling habit -> `/blog/how-to-keep-trading-journal`
- Weekly/monthly/quarterly journal review -> `/blog/trading-journal-review-system-2026`

### Owner Gate result

`consolidate_redirect + rebuild_owner`

The requested URL should not remain an independent 200 page.

## Primary-source evidence correction

The old requested article and old Execution Gap owner both treated the “willpower battery / ego depletion” model as settled neuroscience and used deterministic amygdala/prefrontal-cortex language.

Fresh evidence check found this framing too strong:

1. Hagger et al., *A Multilab Preregistered Replication of the Ego-Depletion Effect* (2016), 23 labs / N=2,141: estimated effect d=0.04 with 95% CI spanning zero.
   - https://pubmed.ncbi.nlm.nih.gov/27474142/
2. Vohs et al., *A Multisite Preregistered Paradigmatic Test of the Ego-Depletion Effect* (2021), 36 labs / N=3,531: confirmatory analyses did not find the predicted depletion effect.
   - https://pubmed.ncbi.nlm.nih.gov/34520296/
3. Wang et al., meta-analysis of mental contrasting with implementation intentions: small-to-medium goal-attainment effect, with publication-bias/evidence limitations explicitly noted.
   - https://pmc.ncbi.nlm.nih.gov/articles/PMC8149892/

Task23.7 therefore uses implementation-intention style if-then rules cautiously and explicitly rejects a universal physiological “willpower battery” claim.

## Changes made

### 1. Consolidated requested page

`content/blog/2026022703.md` now contains:

`redirectTo: /blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`

### 2. Direct redirect routing

`src/config/chartmini-blog-redirects.json` now routes both sources directly to the final owner:

- `/blog/2026022703` -> `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`
- `/blog/the-truth-about-discipline-no-one-tells-you` -> `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`

No redirect chain is introduced.

### 3. Rebuilt the stronger owner

`content/blog/2026010302.md` was substantially rebuilt.

New title:

`Trading Discipline in 2026: How to Close the Execution Gap`

New meta title:

`Trading Discipline: How to Follow Your Rules in 2026`

`dateModified: 2026-08-17`

Approximate length: 3,422 words.

Owner now covers:

- definition of trading discipline and execution gap;
- strategy quality versus execution quality;
- observable rules rather than motivational slogans;
- execution map by decision point;
- descriptive rule-compliance measurement without universal thresholds;
- trigger-specific controls;
- environment/friction design with broker-feature caveats;
- cautious if-then implementation intentions;
- process versus P&L feedback;
- position-size behavior without universal percentages;
- rejection of universal cooldown timers;
- repeatable rule-compliance training loop;
- bounded ChartMini replay use;
- FAQ and primary evidence notes.

Removed/reframed from the old owner:

- “self-discipline is a muscle” as settled evidence;
- willpower as a literal battery;
- deterministic “amygdala activates / prefrontal cortex shuts down” language;
- fixed 90% compliance requirement;
- fixed emotional-state score requirements;
- fixed 5–10 minute cooldowns / two-loss stop rules;
- fixed 1%, 0.5%, 0.25% sizing prescriptions;
- universal 30-day discipline program;
- universal hard-stop / walk-away / exact-target rules;
- outcome examples presented as expected profitability effects;
- false ChartMini automated checklists, rule tracking, discipline analytics or live-risk enforcement.

Manual Article/BlogPosting schema is absent from the owner; route-generated schema remains authoritative.

### 4. Internal support

Added a direct canonical support link from:

- `content/blog/2026032901.md` (`/blog/best-trading-books`)

Current body-link sources pointing at the owner include:

- `content/blog/2026010802.md` — current owner/source
- `content/blog/2026010704.md` — current owner/source
- `content/blog/2026032901.md` — current owner/source added by Task23.7
- `content/blog/2026010603.md` — historical body source but itself redirects to the FOMO owner and is not counted toward the 3 current-owner minimum

Requested old long slug has zero body links.

## Internal-link / owner audit

Owner has 10 unique internal Blog destinations. All 10 resolve in the generated manifest to current non-redirecting owners:

- `/blog/trading-psychology-master-emotions`
- `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`
- `/blog/how-to-build-trading-plan`
- `/blog/pre-trade-checklist`
- `/blog/trading-journal-review-system-2026`
- `/blog/how-to-keep-trading-journal`
- `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026`
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026`
- `/blog/risk-management-position-sizing-guide`
- `/blog/how-to-recover-from-trading-loss`

Global duplicate redirect-source definitions after the change: 0.

## Validation

After the content/routing changes:

- `pnpm build` — PASS; manifest generated with 402 posts.
- `pnpm check` — PASS; Biome 414 files; Vitest 5/5 files, 13/13 tests.
- `pnpm seo:v2:workflow:check` — PASS before final governance sync.
- `git diff --check` — PASS before final governance sync.
- target manifest record carries redirectTo to final owner.
- final owner manifest record has no redirectTo and `dateModified: 2026-08-17`.
- 10/10 owner internal Blog links resolve to non-redirecting owners.
- redirect-source duplicate definitions: 0.

## Deployment / indexing state

- Commit: not performed.
- Push: not performed.
- Deployment: not performed.
- GSC Request Indexing: not performed.
- Bing/IndexNow: not performed.
- Production continues to show the requested long slug as HTTP 200 and `/blog/2026022703` -> requested long slug until deployment.

After deployment, verify:

1. requested long slug -> direct 301 final owner;
2. `/blog/2026022703` -> direct 301 final owner;
3. final owner -> 200, exact self-canonical, new title/body/dateModified;
4. final owner remains in sitemap;
5. redirect sources are absent from sitemap;
6. only the final canonical owner is considered for GSC Request Indexing if URL Inspection shows it needs submission.

## Final Task23.7 status

`CONSOLIDATE_REDIRECT_REBUILD_OWNER_COMPLETE_PENDING_DEPLOY`
