# Task 26.9 — Final Validation / Flowtrace / Workflow Closeout

Date: 2026-08-20
Baseline HEAD: `aa7378e067f3d7d39529c43e16512157f17df5cf`

## Scope

Final local validation for Task26.1–26.8 after the Task26.8 cluster audit and support correction. No deployment or indexing action is part of this task.

## Full validation

PASS:

- `pnpm build`
  - 402 Blog posts
  - 160 marketing locale assets
- `pnpm check`
  - Biome: 415 files
  - Vitest: 6/6 test files
  - 17/17 tests
- `git diff --check`
- `pnpm seo:v2:workflow:check`
  - 13 required Workflow files
  - 402 Blog Markdown files

## Task26 owner integrity

Final effective non-redirecting body support:

- ChartMini vs CandleDojo: 3
- FOMO owner: 8
- News Trading owner: 13
- Swing viability owner: 4
- Broad Market Structure: 26
- BOS/CHoCH verification owner: 11
- Broad Market Volatility: 4
- Pre-Trade Checklist: 10

For every checked owner:

- generated manifest entry count: 1;
- effective body support: >=3;
- manual Article/BlogPosting schema in Markdown: 0;
- owner outbound Blog links resolving through redirect config: 0.

Custom audit result: `OWNER_BAD 0`.

## Flowtrace completeness

Exactly one Task26 Flowtrace exists for each completed task 26.1 through 26.8 before this closeout. This file completes Task26.9.

## Redirect integrity

All expected Task26 redirects resolve locally directly to their final owners.

Key consolidations include:

- News Trading duplicates -> `/blog/how-to-trade-the-news`;
- Market Structure `true direction` + numeric -> `/blog/market-structure-trading-guide`;
- Market Volatility Survival Guide + numeric -> `/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`;
- FOMO `like a pro` remains direct to the FOMO owner;
- numeric Swing viability remains direct to the viability owner;
- numeric Pre-Trade Checklist remains direct to `/blog/pre-trade-checklist`.

Final redirect audit:

- expected Task26 redirect mismatches: 0;
- duplicate redirect-source definitions: 0;
- redirect chains: 0;
- routable/indexable body links to Task26 redirect sources: 0.

## Task26.8 correction carried into closeout

The cluster audit found that `content/blog/2026011303.md` is itself a redirect source and therefore could not count as effective support for Broad Market Volatility. A direct canonical link from Pre-Trade Checklist was added. Broad Volatility now has 6 file-level source files, 2 redirect-source files and 4 effective non-redirecting sources.

Pre-Trade Checklist has 11 file-level source files and 10 effective non-redirecting sources.

## Production state

Production is still pre-deployment for the Task26 content/redirect changes. The pending Task26 URLs checked in production still return their old 200 state where expected.

Task26.2 FOMO redirect revalidation and Task26.4 Swing viability revalidation were already live and do not require a new deployment-specific content change from those subtasks.

Do not start new Task26 observation windows until the pending Task26 deployment is completed and production is reverified.

## Post-deploy production verification required

After the user deploys, verify at minimum:

1. `/blog/chartmini-vs-candledojo-comparison` — 200, self-canonical, new body/dateModified, sitemap.
2. `/blog/how-to-trade-the-news` — 200, self-canonical, new body/dateModified, sitemap.
3. News duplicate long/numeric sources — direct 301 to `/blog/how-to-trade-the-news`.
4. `/blog/market-structure-trading-guide` — 200, self-canonical, rebuilt body/dateModified, sitemap.
5. Market Structure `true direction` long + `/blog/2026011105` — direct 301 to broad owner.
6. Broad Market Volatility owner — 200, self-canonical, rebuilt body/dateModified, sitemap.
7. Survival Guide long + `/blog/2026010303` — direct 301 to Broad Market Volatility.
8. `/blog/pre-trade-checklist` — 200, self-canonical, rebuilt body/dateModified, sitemap.
9. `/blog/2026032502` — direct 301 to Pre-Trade Checklist.
10. Task26 redirect-source long URLs absent from sitemap.

## GSC recommendation after deployment

Only canonical owners with deploy-time changes should be considered for manual Request Indexing:

- `https://chartmini.com/blog/chartmini-vs-candledojo-comparison`
- `https://chartmini.com/blog/how-to-trade-the-news`
- `https://chartmini.com/blog/market-structure-trading-guide`
- `https://chartmini.com/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`
- `https://chartmini.com/blog/pre-trade-checklist`

Do not submit redirect/numeric sources.

Do not resubmit the Swing viability owner solely because of Task26.4; the user already confirmed Request Indexing on 2026-08-17 and its observation schedule remains unchanged.

Task26.2 did not create a new owner-body deployment change and does not require a Task26-specific GSC submission.

## Worktree / staging boundary

Unrelated pre-existing modification remains outside Task26:

- `content/blog/2026030502.md`

Legacy untracked `docs/seo/*` exports and unrelated `docs/2026-05-19-server-crash-investigation.md` / `docs/plans/` also remain outside Task26 scope.

If Task26 is later committed, stage exact Task26 files only and push only `chartminiv2/main`; never push the template `origin` remote.

## Final status

`TASK26_1_TO_26_9_COMPLETE_LOCAL_VALIDATION_PASS_PENDING_DEPLOY`

No commit, push, deployment, R2, GSC, Bing/IndexNow action performed.
