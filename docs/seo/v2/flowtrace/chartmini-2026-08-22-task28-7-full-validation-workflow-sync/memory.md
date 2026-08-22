# ChartMini Task 28.7 — Full Validation, Flowtrace and Workflow Sync

Date: 2026-08-22
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Branch: `main`
Remote target for any future authorized push: `chartminiv2/main`
Task status: `TASK28_FULL_LOCAL_VALIDATION_PASS_WORKFLOW_SYNCED_PENDING_GIT_SYNC_DEPLOY`

## 1. Goal

Perform the final local closeout for Task28.1–Task28.6, repair any remaining structural validation defect, synchronize v2 Flowtrace/Workflow state, and leave the repository ready for a later explicit commit/push and manual deployment.

Task28.7 is a validation/closeout task. It does not authorize deployment, R2 sync, GSC submission, Bing submission, IndexNow submission, or automatic observation-window reset.

## 2. Starting Git boundary

At Task28.7 start:

- `HEAD`: `fb8b393 seo: close task27 deployment observation`
- branch: `main`
- `main` vs `chartminiv2/main`: `0 ahead / 0 behind`
- `origin` remains the mkfast template remote and must not receive ChartMini pushes.
- Task28.1–Task28.6 changes remain local/uncommitted.
- historical untracked `docs/seo/*` migration evidence remains outside the active v2 workflow and outside any future Task28 staging set.
- `content/blog/2026030502.md` contains a pre-existing unrelated tracked one-line modification. It is not a Task28 edit and remains explicitly excluded from future Task28 staging unless the user separately authorizes it.

## 3. Task28.1–Task28.5 owner/redirect validation

Rebuilt canonical owners rechecked locally against source + generated manifest:

### Task28.1

- source: `content/blog/2026040701.md`
- canonical slug: `/blog/what-are-market-makers`
- `dateModified: 2026-08-22`
- manifest count: 1
- manual Article/BlogPosting schema: 0
- status remains `pending_deploy`.

### Task28.2

Requested duplicate remains unchanged:

- `content/blog/2026021202.md`
- slug: `/blog/why-patience-is-essential-for-every-trader-in-2026`
- `redirectTo: /blog/trading-patience-how-to-wait-for-high-probability-setups-2026`

Owner remains:

- `content/blog/2025121901.md`
- `/blog/trading-patience-how-to-wait-for-high-probability-setups-2026`
- `dateModified: 2026-08-19`

Task28.2 does not reset its observation dates: 2026-08-26 and 2026-09-02; freeze through 2026-09-02.

### Task28.3

- rebuilt owner source: `content/blog/2026010904.md`
- canonical slug: `/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
- `dateModified: 2026-08-22`
- manifest count: 1
- manual Article/BlogPosting schema: 0
- requested duplicate remains a redirect source and no-submit.
- status remains `pending_deploy` for the rebuilt owner.

### Task28.4

- source: `content/blog/2026032001.md`
- canonical slug: `/blog/how-much-money-to-start-trading`
- `dateModified: 2026-08-22`
- manifest count: 1
- manual Article/BlogPosting schema: 0
- status remains `pending_deploy`.

### Task28.5

- source: `content/blog/2026031302.md`
- canonical slug: `/blog/how-to-build-trading-plan`
- `dateModified: 2026-08-22`
- manifest count: 1
- manual Article/BlogPosting schema: 0
- status remains `pending_deploy`.

## 4. Task28.6 full 187-article revalidation

The Task28.6 custom full-set audit was rerun from current source/config/manifest state.

Results:

- primary targets: 187
- current active owners: 180
- current redirect sources: 7
- unique final owners: 181
- target manifest/mapping issues: 0
- global duplicate redirect sources: 0
- global redirect chains: 0
- indexable body links to configured redirect sources: 0
- redirect config entries: 433

The 24 numeric legacy redirects added in Task28.6 were then executed through the actual runtime helper `getChartMiniLegacyRedirect()` using `tsx`.

Result:

- tested pairs: 24
- incorrect status/destination: 0
- all 24 return HTTP 301 directly to the intended final canonical path.

This is a stronger check than JSON configuration presence alone because it exercises the current redirect helper used before the application router.

## 5. Additional full-site link audit and one final repair

Task28.7 extended the Task28.6 graph check from "links to redirect URLs" to all `/blog/...` body links from non-redirecting Markdown sources.

Initial result across current indexable sources:

- Blog body links checked: 3,500
- links pointing through configured redirects: 0
- missing/unmapped Blog links: 1

The single remaining broken internal link was:

- source: `content/blog/2025120501.md`
- old target: `/blog/best-day-trading-simulators-2026`
- current valid canonical: `/blog/best-day-trading-simulators-2026-honest-comparison`

The link destination was corrected without changing the source article's title, slug, frontmatter date, intent, schema, or owner role.

Post-repair full-site result:

- Blog body links checked: 3,500
- links to configured redirect sources: 0
- missing/unmapped Blog links: 0

Therefore the current Blog graph is locally closed for both redirect-through and missing-target defects.

## 6. Workflow consistency audit

Task28 references were rechecked across:

- `candidate-backlog.csv`
- `intent-ownership-registry.csv`
- `observation-board.csv`
- `current-state.md`
- `protected-pages.md`
- `today-queue.md`
- `agent-activity-log.md`
- `active-task-lock.md`
- `gsc-submission-log.md`

Result:

- Task28.1: `completed_pending_deploy`
- Task28.2: live redirect revalidated; observation preserved
- Task28.3: redirect remains live; rebuilt Broad Journal owner remains pending deployment
- Task28.4: `completed_pending_deploy`
- Task28.5: `completed_pending_deploy`
- Task28.6: infrastructure/link closeout pending deployment
- no Task28 deployment is recorded
- no new Task28 GSC submission is recorded
- no new observation dates were fabricated
- Task28.2 old observation dates remain unchanged
- Task28.3 explicitly requires a new observation window only after real deployment/indexing because its owner was materially rebuilt
- Task28.1/28.4/28.5 likewise receive observation dates only after a real deployment/indexing event.

No candidate-backlog, intent-registry, observation-board or GSC-log row is required for Task28.7 itself because it creates no new page owner, consolidation, deployment, submission, or observation event.

## 7. Full validation commands

After the final broken-link repair, the complete v2 validation suite was rerun from scratch.

### Build

`pnpm build` — PASS

- Blog manifest: 402 posts
- marketing content: 160 locale assets
- client build: PASS
- SSR build: PASS

The existing Vite chunk-size warning remains informational and unrelated to Task28 SEO correctness.

### Code/test validation

`pnpm check` — PASS

- Biome: 415 files checked
- Vitest: 6/6 test files passed
- tests: 17/17 passed

### Workflow validation

`pnpm seo:v2:workflow:check` — PASS

- required workflow files: 13
- current Blog Markdown files: 402
- legacy SEO files remain excluded from active v2 state.

### Diff validation

`git diff --check` — PASS

### Custom Task28 validations

- Task28 rebuilt-owner metadata/manifest/schema checks: PASS
- Task28.2 redirect/owner source-state check: PASS
- 187-article mapping audit: PASS
- global redirect duplicate-source audit: PASS (0)
- global redirect-chain audit: PASS (0)
- 24 new numeric redirect runtime-helper tests: PASS (24/24)
- full indexable Blog body-link audit: PASS (3,500 checked; 0 redirect-through; 0 missing/unmapped)

## 8. Current Git/staging boundary

After Task28.7 validation:

- Task28 remains local/uncommitted.
- 36 tracked `content/blog/*.md` files currently differ from `HEAD`.
- 35 belong to Task28 work: four rebuilt owners, thirty Task28.6 canonicalized internal-link source files, plus the Task28.7 one-link repair in `content/blog/2025120501.md`.
- `content/blog/2026030502.md` is the one unrelated pre-existing tracked modification and must remain excluded from any Task28 commit.
- workflow files and `src/config/chartmini-blog-redirects.json` contain intended Task28 state.
- `src/generated/blog-manifest.json` is regenerated by the successful final build and must accompany the changed owner metadata when Task28 is eventually staged.
- Task28.1–Task28.7 Flowtrace directories are current Task28 evidence; historical untracked migration docs remain excluded.

No `git add`, commit, push, deployment, R2 sync, GSC, Bing or IndexNow action was performed in Task28.7.

## 9. Post-deployment verification / GSC policy

After the user later authorizes Git sync and manually deploys, perform fresh production verification.

Changed canonical owners that may be considered for GSC Request Indexing after verified deployment:

1. `https://chartmini.com/blog/what-are-market-makers`
2. `https://chartmini.com/blog/trading-journal-mastery-how-to-review-analyze-and-improve-your-trading-in-2026-2026`
3. `https://chartmini.com/blog/how-much-money-to-start-trading`
4. `https://chartmini.com/blog/how-to-build-trading-plan`

Do not submit:

- Task28.2 redirect source or its numeric path;
- Task28.3 requested redirect source or its numeric path;
- any of the 24 numeric legacy paths added by Task28.6;
- redirect sources generally;
- link-only source pages from Task28.6/28.7 solely because an internal destination was canonicalized.

After verified deployment:

- create a new 7-day/14-day observation window for the genuinely rebuilt Task28.1, Task28.3, Task28.4 and Task28.5 canonical owners based on the real deployment/indexing event;
- preserve Task28.2's existing observation schedule;
- do not create an observation window for numeric redirects or link-only cleanup.

## 10. Final status

Task28 local implementation and validation are complete through Task28.7.

Final local status:

`TASK28_FULL_LOCAL_VALIDATION_PASS_WORKFLOW_SYNCED_PENDING_GIT_SYNC_DEPLOY`
