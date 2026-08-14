# ChartMini v2 SEO Workflow

Initialized: 2026-08-14
Baseline generation: v2

This workflow governs SEO/GEO work in `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2` only.

## Source-of-truth order

1. Fresh production observation of the current v2 deployment.
2. Fresh GSC/Bing/API data collected for v2.
3. Fresh SERP evidence collected for the task date.
4. `docs/seo/v2/_workflow/` current state files.
5. `docs/seo/v2/flowtrace/` task evidence.
6. Current v2 source code and article Markdown.
7. Legacy SEO files only as historical context.

If two current sources conflict, stop the edit and record the conflict. Do not choose a preferred number without evidence.

## Legacy isolation

The migrated files under `docs/seo/flowtrace/_workflow/`, old `docs/seo/gsc-*`, old `docs/seo/bing-*`, and the previous project are not current v2 state. They may explain old URLs or historical decisions, but they must not populate current GSC/Bing metrics, protection windows, submission facts, SERP conclusions, or intent ownership without fresh v2 verification.

## Preflight Gate

Before any article or SEO page edit:

1. Read `AGENTS.md` and `CLAUDE.md`.
2. Read this file and the v2 workflow state files.
3. Confirm the target source file in the v2 repository.
4. Confirm the current production URL and indexability/canonical behavior.
5. Collect or explicitly mark unavailable current GSC data.
6. Collect or explicitly mark unavailable current Bing data.
7. Run fresh SERP research for the target intent.
8. Inspect internal links and nearby v2 pages for cannibalization.
9. Complete the Owner Gate.
10. Do not edit until the task has user authorization.

## Owner Gate

Every target must receive one of these decisions before editing:

- `retain`: keep the URL and intent.
- `retain_narrow`: keep the URL but narrow its intent boundary.
- `rebuild`: keep the URL and substantially rebuild the content for the confirmed intent.
- `consolidate_redirect`: merge into a stronger owner; do not rebuild a duplicate.
- `hold`: evidence is insufficient or the page conflicts with an active owner/protection window.

An owner decision must be based on current v2 site structure plus fresh task evidence. Legacy owner records are context only.

## Data Gate

Never estimate missing GSC/Bing values. Use `unknown_not_reverified` when current v2 data is unavailable.

A task may still proceed with explicit user authorization when GSC/Bing access is unavailable, but the Flowtrace must record that limitation and the Owner Gate must rely on production, SERP, internal-site, and primary-source evidence instead of invented metrics.

## v2 article architecture

Article source files are `content/blog/*.md`. The v2 application builds a metadata manifest with `scripts/build-blog-manifest.mjs`, serves article bodies through R2, and renders the page through `src/routes/blog/$slug.tsx`.

The route generates `BlogPosting`, `BreadcrumbList`, author `Person`, and site-level structured data. Do not add a duplicate `Article` or `BlogPosting` schema to edited Markdown. Existing legacy schemas in source must be evaluated against the current renderer rather than assumed to work as they did in the old project.

Do not add new `HowTo` schema for Google SEO. FAQ markup is not a Google rich-result strategy; if retained, visible questions and structured data must remain consistent.

## Validation after article changes

Use v2-native checks rather than old-project commands:

```bash
pnpm build
pnpm check
git diff --check
pnpm seo:v2:workflow:check
```

`pnpm build` runs the v2 prebuild chain, which regenerates and formats `src/generated/blog-manifest.json`. Do not run the raw manifest builder immediately before `pnpm check` without formatting the generated manifest first.

If a command is not applicable or fails for a pre-existing unrelated reason, record the exact limitation in the task Flowtrace.

Do not deploy, push, sync R2, submit GSC, or submit IndexNow unless the user explicitly requests that action.

## Workflow files

- `current-state.md`: concise current v2 baseline and blockers.
- `protected-pages.md`: only v2 pages with freshly established protection/observation windows.
- `candidate-backlog.csv`: v2 candidates and current evidence status.
- `intent-ownership-registry.csv`: v2 intent ownership only.
- `gsc-submission-log.md`: only user-confirmed or API-confirmed v2 submissions after this baseline.
- `observation-board.csv`: observation windows created from v2 events.
- `active-task-lock.md`: single active owner.
- `agent-activity-log.md`: concise task index.
- `today-queue.md`: immediate execution queue.

Task evidence goes under `docs/seo/v2/flowtrace/<task>/memory.md`.
