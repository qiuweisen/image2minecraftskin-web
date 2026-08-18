# ChartMini v2 Flowtrace — Task 24.7 Emotional Discipline Psychology redirect revalidation

Date: 2026-08-18
Target URL: `/blog/trading-psychology-mastery-how-to-control-your-emotions-and-trade-with-discipline-in-2026-2026`
Source: `content/blog/2026010901.md`
Numeric source: `/blog/2026010901`

## 1. Scope

Revalidate whether this page should remain consolidated to the Broad Trading Psychology owner, be restored as a separate 200 owner, or be retargeted to the Trading Discipline / Execution Gap owner after fresh 2026-08-18 SERP, production and current v2 cluster review.

No assumption was made that the requested URL must become indexable merely because it was selected as Task24.7.

## 2. Fresh production preflight

Verified 2026-08-18:

- requested long slug -> HTTP 301 -> `/blog/trading-psychology-master-emotions`;
- `/blog/2026010901` -> HTTP 301 -> `/blog/trading-psychology-master-emotions`;
- Broad Psychology owner is production HTTP 200;
- local source still has `redirectTo: /blog/trading-psychology-master-emotions`;
- local redirect config sends both long and numeric sources directly to Broad Psychology;
- two Markdown references to `/blog/2026010901` exist, but both occur inside other psychology pages that are themselves redirect sources, so effective routable/indexable body support is 0;
- current GSC state for this redirect source: `unknown_not_reverified`;
- current Bing state: `unknown_not_reverified`;
- redirect sources remain no-submit.

## 3. Historical source audit

The old article is not narrowly about rule-compliance mechanics. Its structure is primarily broad emotional trading psychology:

- why trading psychology matters;
- an unsupported `80/20` psychology-vs-strategy claim;
- fear;
- greed;
- revenge trading;
- hope;
- FOMO;
- a list of ten psychology rules;
- a 30-day psychology challenge;
- a broad `professional trader mindset` section;
- process-over-outcome and emotional-discipline framing.

The rule section includes hard prescriptions such as exactly 1% risk per trade, maximum three trades per day, 3% daily loss limit and a mandatory 15-minute cooling-off period. These are not sufficiently universal to justify restoring the old page.

The article also contains broad emotional framing, unsupported examples and generic professional-vs-amateur claims. Its dominant job is `control emotions / trading psychology`, not `measure why written rules are violated and repair execution compliance`.

## 4. Fresh SERP evidence

Fresh searches on 2026-08-18 included:

- `trading psychology control emotions trade with discipline fear greed 2026`;
- `trading discipline follow rules execution gap trading psychology`;
- `trading psychology emotional discipline fear greed FOMO revenge`;
- current ChartMini psychology/discipline SERP checks.

Observed pattern:

### Broad trading psychology / emotional discipline

Results around `control emotions`, `fear`, `greed`, `revenge`, `FOMO`, and `discipline` commonly combine these concepts in one broad psychology guide. This supports keeping a broad emotional-psychology owner rather than creating another near-duplicate page.

### Trading discipline / execution gap

A distinct narrower pattern exists for queries centered on `why traders break their own rules`, `follow your trading rules`, and the gap between a written plan and actual behavior under pressure. ChartMini already owns that task at `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`.

Current external evidence also supports the narrower rule-following distinction: a recent Investopedia result titled `Why Traders Break Their Own Rules (and How To Stop)` focuses on predefined systems, rule-breaking and execution consistency rather than a general fear/greed/FOMO taxonomy.

Therefore the word `discipline` in the requested title does not by itself justify retargeting the page to Execution Gap. The historical body is dominated by emotional-state taxonomy and broad psychology mindset content.

## 5. Current v2 Owner Gate

### Broad Psychology owner

`/blog/trading-psychology-master-emotions`

Task24.5 locally rebuilds this owner around:

- broad trading-psychology definition;
- fear / greed / loss-aversion context;
- overconfidence;
- anchoring;
- analysis paralysis;
- broad FOMO/revenge context;
- precommitment;
- process-vs-P&L separation;
- observable emotional-execution errors;
- bounded replay practice;
- handoff to narrower specialists.

### Execution Gap owner

`/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026`

Owns:

- written rule vs actual behavior;
- observable rule compliance;
- trigger diagnosis;
- measurable execution controls;
- if-then rules;
- process feedback vs P&L;
- rule-compliance training loops.

### Specialist neighbors

- FOMO -> `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026`;
- Revenge -> `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`;
- Behavioral Recovery -> `/blog/how-to-recover-from-trading-loss`;
- AI Psychology -> `/blog/the-future-of-trading-psychology-in-2026-market`.

Owner Gate:

`preserve_consolidation_redirect + revalidate_owner`

Decision:

- keep requested long slug as direct 301 to Broad Psychology;
- keep `/blog/2026010901` as direct 301 to Broad Psychology;
- do not restore requested page as 200;
- do not retarget it to Execution Gap because its dominant intent is broad emotional psychology, not rule-compliance diagnosis;
- do not submit redirect sources to GSC/Bing/IndexNow.

## 6. Google / SEO rationale

Current Google Search Central canonical documentation states that permanent redirects are a strong signal that the redirect target should be canonical and recommends redirects when removing duplicate pages. Current people-first guidance also asks whether a page provides substantial additional value compared with other search results and warns against search-first content without added value.

Restoring this page would create another broad psychology page with little durable incremental intent and weaker factual boundaries than the Task24.5 Broad Psychology owner.

## 7. Modification decision

Task24.7 is governance-only.

No modification is required to:

- `content/blog/2026010901.md`;
- `src/config/chartmini-blog-redirects.json`;
- `src/generated/blog-manifest.json` as a direct Task24.7 change;
- Broad Psychology body;
- Execution Gap body.

Task24.5 local Broad Psychology changes remain intact and pending deployment.

## 8. Validation plan

Because Task24.7 changes no article, route, redirect input or executable code:

- confirm target manifest remains a redirect to Broad Psychology;
- confirm Broad Psychology remains a manifest owner;
- confirm long and numeric sources route directly to Broad Psychology;
- confirm effective body inlinks to the target are 0;
- confirm duplicate redirect sources = 0;
- confirm redirect chains = 0;
- run `pnpm seo:v2:workflow:check`;
- run `git diff --check`;
- confirm Task24.7 created no diff in `content/blog/2026010901.md`.

A full application build is not required for this governance-only revalidation. Task24.5 already completed the full build/test cycle for the locally changed Broad Psychology owner.

## 9. Deployment / indexing state

Task24.7 itself requires no production routing change because the desired 301 relationship is already live.

Task24.5 remains pending deployment. After that deployment, this Task24.7 redirect source should continue to 301 directly to the newly rebuilt Broad Psychology owner.

GSC/Bing status remains `unknown_not_reverified`. Never Request Indexing for the redirect source or `/blog/2026010901`.

## 10. Final validation

Completed after Workflow synchronization:

- `pnpm seo:v2:workflow:check` — PASS; 13 required Workflow files / 402 Blog Markdown files.
- `git diff --check` — PASS.
- target manifest entry remains a redirect to `/blog/trading-psychology-master-emotions`.
- Broad Psychology remains a manifest owner with local `dateModified: 2026-08-18` from Task24.5.
- Execution Gap remains an independent manifest owner.
- `/blog/2026010901` -> Broad Psychology directly.
- requested long slug -> Broad Psychology directly.
- effective routable/indexable body inlinks to the redirect target source: 0.
- duplicate redirect-source definitions: 0.
- redirect chains: 0.
- Task24.7 content diff for `content/blog/2026010901.md`: 0 lines.
- full application build intentionally omitted because Task24.7 changed governance/evidence only; Task24.5 already passed the full build/check/test cycle for the locally modified Broad Psychology owner.

## 11. Final status

`PRESERVE_CONSOLIDATION_REDIRECT_REVALIDATED_LIVE`
