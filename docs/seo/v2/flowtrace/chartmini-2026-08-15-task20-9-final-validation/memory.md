# Task 20.9 — Final Validation, Flowtrace, and Workflow Sync

Date: 2026-08-15
Repository: `/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2`
Baseline generation: v2

## Scope

Final validation for Tasks 20.1–20.8. This is a local pre-deployment verification only.

## Production pre-deploy baseline

Fresh production checks on 2026-08-15 showed HTTP 200 for all seven Task20 canonical owners and for the two newly identified duplicate URLs that Task20.8 now consolidates locally. This is expected because no deployment has occurred yet.

New local redirect behavior therefore must be verified again after the user deploys.

## Data access

- `claude-seo`: unavailable.
- `BING_WEBMASTER_API_KEY`: absent.
- `INDEXNOW_KEY`: absent.
- GSC/Bing metrics remain `unknown_not_reverified`.
- No old-project exports or submission state were imported.

## Build and code validation

Executed after Task20.8 cleanup:

- `pnpm build` — PASS.
  - Blog manifest generated successfully.
  - 402 Markdown sources detected.
  - client build PASS.
  - SSR build PASS.
- `pnpm check` — PASS.
  - Biome: 407 files checked, no fixes required.
  - Vitest: 1 file passed, 3 tests passed.
- `pnpm seo:v2:workflow:check` — PASS.
  - 13 required workflow files present.
  - 402 blog Markdown files detected.
- `git diff --check` — PASS.

## Manifest validation

Confirmed as routable canonical owners:

- Stocktwits owner;
- Prop-funded account owner;
- Drawdown-recovery math owner;
- Finviz Heatmap/Maps owner;
- Post-trade review owner;
- Bull/bear market owner;
- Beginner chart-reading owner;
- behavioral trading-loss recovery owner;
- broad trading-journal owner.

Confirmed manifest `redirectTo` entries:

- `trading-journal-secrets-how-to-review-your-trades-for-maximum-improvement-2026` -> broad journal owner;
- `how-to-recover-from-trading-losses-a-step-by-step-guide-2026` -> behavioral recovery owner;
- `prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026` -> prop-funded owner;
- `bull-market-vs-bear-market-trading-strategies-for-different-market-conditions-2026` -> short bull/bear owner.

Because `src/lib/blog.ts` excludes posts with `redirectTo` from `isRoutablePost` and `isIndexablePost`, these redirect sources are excluded from normal blog listings and the sitemap after deployment/build.

## Redirect validation

Task20 direct redirect sources validated in `src/config/chartmini-blog-redirects.json`:

- `/blog/2026010503` -> broad journal owner;
- journal duplicate long slug -> broad journal owner;
- `/blog/2026012901` -> behavioral recovery owner;
- recovery duplicate long slug -> behavioral recovery owner;
- `/blog/2026013102` -> prop-funded owner;
- prop duplicate long slug -> prop-funded owner;
- `/blog/2025122201` -> short bull/bear owner;
- bull/bear duplicate long slug -> short bull/bear owner;
- `/blog/2026032701` -> short bull/bear owner.

Redirect-config validation found:
- duplicate redirect source count: 0;
- no Task20 redirect chain among the validated sources.

## Internal-link validation

A Task20-specific validator compared every `/blog/...` link in the principal Task20 owner files against the generated manifest.

Result: `TASK_LINK_ISSUES []`.

No principal Task20 owner links to:
- a missing blog slug;
- a `redirectTo` blog source.

The two new duplicate clusters also have zero remaining body-level links to their old numeric or long duplicate URLs, excluding legacy schema text inside redirect-only Markdown bodies that is never served as an article after redirect.

## Final cluster status

- Task 20.1: complete, protected pending deploy.
- Task 20.2: complete, protected pending deploy; prop duplicate consolidated.
- Task 20.3: complete, protected pending deploy; recovery math separated from behavioral recovery.
- Task 20.4: complete, protected pending deploy.
- Task 20.5: complete, protected pending deploy; single-trade review separated from broad/periodic journal review.
- Task 20.6: complete, protected pending deploy; long bull/bear URL consolidated to short owner.
- Task 20.7: complete, protected pending deploy; beginner chart-reading owner separated from specialist chart-reading pages.
- Task 20.8: complete; journal duplicate and behavioral-recovery duplicate consolidated, link density and boundaries repaired.
- Task 20.9: validation PASS and workflow synchronized.

## Deployment boundary

Not performed:
- commit;
- push;
- R2 sync;
- Cloudflare deployment;
- GSC Request Indexing;
- Bing submission;
- IndexNow submission.

After the user deploys, required production verification is:

1. verify all Task20 canonical owners return 200 and self-canonical;
2. verify four consolidated long duplicate URLs return direct permanent redirects to their owners;
3. verify numeric legacy sources return direct permanent redirects;
4. verify redirect sources are absent from the production sitemap;
5. verify updated titles/descriptions/dateModified/body text on canonical owners;
6. establish real 7-day and 14-day observation dates from deployment/indexing time;
7. obtain fresh v2 GSC/Bing data if access becomes available before drawing performance conclusions.

Result: `PASS_PENDING_DEPLOYMENT_VERIFICATION`.
