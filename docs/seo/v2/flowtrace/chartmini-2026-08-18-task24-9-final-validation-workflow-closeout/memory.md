# ChartMini v2 Flowtrace — Task 24.9 Final Validation / Workflow Closeout

Date: 2026-08-18
Scope: Task24.1–24.8 local batch

## 1. Objective

Run the complete v2 validation sequence after Task24.8 cluster review, verify owner/redirect integrity for the Journal and Trading Psychology clusters, synchronize active Workflow state, and leave the batch ready for later remote sync/deployment. Do not push, deploy, sync R2, or submit indexing in this task.

## 2. Task24 final local architecture

### Journal

Owners:

- `/blog/top-5-trading-journal-strategies-beginners` — beginner first-journal/minimum-viable setup; restored/rebuilt in Task24.1.
- `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026` — broad fields/metrics/R-multiple/expectancy/drawdown/replay.
- `/blog/trading-journal-review-system-2026` — periodic grouped performance analysis/review.
- `/blog/how-to-keep-trading-journal` — sustainable maintenance/habit.
- `/blog/post-trade-review-mastery-how-to-learn-from-every-trade-2026` — one closed-trade post-mortem.
- `/blog/forex-trading-journal-template` — forex-specific template/fields.
- `/blog/simulated-trade-log-replay-journal` — simulated/replay logging.

Task24 redirect pairs:

- `/blog/trading-journal-mastery-how-to-track-analyze-and-improve-your-trading-performance-2026` + `/blog/2026011201` -> `/blog/trading-journal-review-system-2026`.
- `/blog/trading-journal-secrets-how-to-review-your-trades-for-maximum-improvement-2026` + `/blog/2026010503` -> `/blog/trading-journal-review-system-2026`.

Task24.8 added one contextual direct link from `/blog/forex-replay-practice-historical-data` to `/blog/forex-trading-journal-template`, raising effective forex-template body support from 2 to 3.

### Trading Psychology

Owners:

- `/blog/trading-psychology-master-emotions` — broad psychology; rebuilt in Task24.5.
- `/blog/how-to-stop-fomo-trading-the-psychology-of-missing-out-thats-killing-your-account-2026` — FOMO/anti-chasing.
- `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026` — immediate next-trade revenge/loss chasing.
- `/blog/how-to-recover-from-trading-loss` — broader loss-event/drawdown behavioral recovery.
- `/blog/the-execution-gap-why-traders-fail-to-follow-their-own-rules-2026` — rule compliance / execution gap.
- `/blog/the-future-of-trading-psychology-in-2026-market` — AI/GenAI/automation/social-media psychology.

Task24 redirect pairs retained to Broad Psychology:

- Task24.4 long + `/blog/2026010705`.
- Task24.6 long + `/blog/2026011302`.
- Task24.7 long + `/blog/2026010901`.

## 3. Complete build/check validation

Executed after Task24.8 link correction:

`pnpm build && pnpm check && pnpm seo:v2:workflow:check && git diff --check`

Result: PASS.

Build details:

- Blog manifest: 402 posts.
- Marketing content: 160 locale page assets.
- client build: PASS.
- SSR build: PASS.
- only the existing Vite large-chunk warning was emitted; it is not a Task24 correctness failure.

Check details:

- Biome: 414 files, PASS.
- Vitest: 5/5 test files, 13/13 tests PASS.
- Workflow check: 13 required workflow files / 402 current Blog Markdown files, PASS.
- `git diff --check`: PASS.

## 4. Task24 owner/redirect integrity audit

A custom repository-wide audit checked the final local manifest, direct redirect config/frontmatter, current indexable sources, and internal Blog links.

Final result: `TASK24_OWNER_INTEGRITY_BAD 0`.

Verified:

- all 10 Task24 long/numeric redirect sources point directly to their expected final owners;
- Task24 redirect sources form no redirect chain;
- global duplicate redirect-source definitions: 0;
- routable/indexable pages linking to Task24 redirect sources: 0;
- all checked core Owner outbound Blog links resolve directly to non-redirect owners;
- every checked core Owner has >=3 effective body inlinks.

Final effective body support:

- Beginner Journal: 3
- Broad Journal: 24
- Review System: 6
- Journal Habit: 30
- Post-Trade Review: 7
- Forex Journal Template: 3
- Simulated Trade Log / Replay: 13
- Broad Psychology: 21
- FOMO: 6
- Revenge: 3
- Behavioral Recovery: 9
- Execution Gap: 4
- AI Psychology: 3

## 5. Legacy Article schema evaluation

The custom source scan found historical Markdown `Article` JSON-LD blocks in:

- Broad Journal;
- Forex Journal Template;
- Simulated Trade Log / Replay Journal.

This is not a rendered duplicate-schema defect in v2. `src/routes/blog/$slug.tsx` explicitly filters legacy schemas and only allows selected visible-content schema types; route-generated `BlogPosting` and Breadcrumb schema remain authoritative.

Fresh production HTML verification for all three pages showed:

- rendered `Article`: 0
- rendered `BlogPosting`: 1

Therefore Task24.9 does not modify protected/neighbor owner bodies merely to remove filtered source residue. The final integrity result treats rendered schema behavior as the source of truth.

## 6. Production state versus local state

Production is intentionally not yet updated for the Task24 local batch.

Pending production changes after eventual deployment:

- Task24.1: Beginner Journal long URL becomes 200 owner; `/blog/2026022103` direct 301 to it.
- Task24.2: track/analyze/improve long + numeric retarget directly to Review System.
- Task24.3: review-secrets long + numeric retarget directly to Review System.
- Task24.5: rebuilt Broad Psychology body/title/dateModified becomes live.
- Task24.8: Forex Replay page gains the direct contextual Forex Journal link.

Task24.4, 24.6 and 24.7 already have the correct production redirect destination and require no routing change.

## 7. GSC / Bing / IndexNow

No new indexing action was performed.

- Task24 redirect sources remain no-submit.
- GSC/Bing states remain `unknown_not_reverified` unless a previous user-confirmed state is already in the v2 logs.
- After deployment, inspect the restored Beginner Journal canonical and rebuilt Broad Psychology canonical first; Request Indexing only if the live index state justifies quota use.
- Do not submit numeric or long redirect sources.

## 8. Observation handling

No new 7-day/14-day dates are invented before deployment.

After actual deployment:

- Task24.1 Beginner Journal: establish fresh 7-day and 14-day observation dates.
- Task24.5 Broad Psychology: the existing Task23 observation applies to the currently deployed pre-Task24.5 body only; establish a fresh observation window for the rebuilt body after deployment.
- Task24.2/24.3 are redirect-destination changes without owner-body rewrites; verify routing/indexability after deploy and retain existing owner observation context where applicable.
- Task24.8 Forex Journal link support change does not require a new owner-body observation window by itself.

## 9. Working-tree scope

Task24-related tracked changes include:

- Task24.1 article/support files;
- Task24.2/24.3 redirect-source frontmatter;
- Task24.5 Broad Psychology owner body;
- Task24.8 Forex Replay support link;
- redirect config;
- generated Blog manifest;
- exact v2 Workflow files.

Task24 Flowtraces 24.1–24.9 are task evidence and should be included in a later Task24 sync.

Unrelated tracked modification still present and explicitly excluded from Task24 scope:

- `content/blog/2026030502.md` — pre-existing Robinhood Options internal-link correction.

Many unrelated historical untracked files under `docs/seo/`, `docs/plans/`, etc. remain outside Task24 and must not be bulk staged.

## 10. Final status

`TASK24_1_TO_24_9_COMPLETE_LOCAL_VALIDATION_PASS_PENDING_DEPLOY`

No commit, push, deployment, GSC, Bing, IndexNow, or R2 sync performed.
