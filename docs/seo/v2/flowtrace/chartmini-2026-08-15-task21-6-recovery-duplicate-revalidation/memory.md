# Task 21.6 — Recovery duplicate revalidation

Date: 2026-08-15
Requested URL: `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026`
Source: `content/blog/2026012901.md`
Final owner: `/blog/how-to-recover-from-trading-loss`
Decision: `preserve_consolidation_redirect`
Status: `redirect_protected_owner_pending_redeploy`

## 1. Why this task required an Owner Gate

The requested URL is not currently an independent v2 content owner. Task20.8 already consolidated it into `/blog/how-to-recover-from-trading-loss`, and Task21.5 subsequently refreshed that behavioral-recovery owner. Reopening the duplicate as a 200 page would recreate the same cannibalization that Task20.8 removed.

## 2. Current production evidence

Production verification on 2026-08-15:

- `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026` returns direct HTTP 301 to `/blog/how-to-recover-from-trading-loss`.
- `/blog/2026012901` returns direct HTTP 301 to the same owner.
- `/blog/how-to-recover-from-trading-loss` returns HTTP 200.
- Production sitemap contains the canonical owner and does not contain the duplicate long slug.
- No redirect chain was observed.

## 3. Search evidence

Fresh web search still surfaces a historical search snapshot for the old duplicate URL. The cached snippet/body contains the retired version with universal recovery prescriptions such as fixed percentage reductions, fixed pause periods, and fixed recovery-trade counts. A separate result surfaces the current owner but also reflects an older cached version rather than the latest Task21.5 local refresh.

Interpretation: search engines have historical content associated with the duplicate, but this is not evidence that the duplicate should become an independent owner. It is evidence that the direct 301 should remain stable so accumulated signals can consolidate to the canonical behavioral-recovery owner.

## 4. Source / manifest state

`content/blog/2026012901.md` already contains:

`redirectTo: /blog/how-to-recover-from-trading-loss`

Generated manifest keeps the source as a redirect entry rather than a routable/indexable blog owner.

Redirect config contains direct permanent mappings:

- `/blog/how-to-recover-from-trading-losses-a-step-by-step-guide-2026` -> `/blog/how-to-recover-from-trading-loss`
- `/blog/2026012901` -> `/blog/how-to-recover-from-trading-loss`

No current blog body links to either duplicate URL. The only textual occurrence inside the old source is its historical self-schema/body, which is not routed because the source is a redirect entry.

## 5. Cannibalization / intent boundary

Canonical owner `/blog/how-to-recover-from-trading-loss` owns behavioral recovery after losses:

- immediate loss-event triage;
- planned loss vs rule violation vs model/environment problem;
- revenge/overtrading prevention;
- excessive post-loss caution/freeze risk;
- pause/reduced-risk/simulation decisions without universal thresholds;
- evidence for returning to normal risk.

Neighbor boundaries remain:

- exact drawdown recovery arithmetic -> `/blog/the-recovery-equation-why-a-50-loss-needs-a-100-gain-to-break-even-and-how-to-survive-drawdowns-2026`;
- broad risk architecture -> `/blog/risk-management-position-sizing-guide`;
- revenge-trading deep dive -> `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`.

Task21.6 has no unique residual intent that justifies a second indexable page.

## 6. Owner Gate

Decision: `preserve_consolidation_redirect`.

Do not rebuild or restore the requested URL as a 200 page. Preserve the direct 301 and keep all new recovery content on `/blog/how-to-recover-from-trading-loss`.

## 7. GSC / Bing state

Current-v2 GSC performance access: `unknown_not_reverified`.

Environment probes:

- `claude-seo`: unavailable
- `BING_WEBMASTER_API_KEY`: absent
- `INDEXNOW_KEY`: absent

No legacy metrics were imported.

After Task21.5 is deployed, request recrawl/indexing only for the canonical owner if needed. Do not Request Indexing for this Task21.6 redirect source.

## 8. Task21.6 changes

No article body, slug, redirect target, or canonical content was changed for Task21.6. The existing consolidation is already correct.

Task21.6 only records fresh evidence and protects the duplicate as a redirect source.

## 9. Validation result

Final validation passed:

- `pnpm check` — PASS; Vitest 13/13 across 5 files.
- `pnpm seo:v2:workflow:check` — PASS; 13 workflow files and 402 blog Markdown sources.
- `git diff --check` — PASS.
- duplicate manifest entry keeps `redirectTo: /blog/how-to-recover-from-trading-loss`.
- routable behavioral-recovery owner count — 1.
- long duplicate redirect-config source count — 1, direct to owner.
- `/blog/2026012901` redirect-config source count — 1, direct to owner.
- duplicate redirect sources across redirect config — 0.
- live body inlinks to duplicate/numeric path — 0.
- production sitemap exposes owner, not duplicate.

A full build had already passed immediately before this task on the same code/content tree during Task21.5. Task21.6 made governance/evidence changes only and did not alter code, blog content, manifest inputs, or redirects.

## 10. Deployment boundary

Task21.6 itself does not require an additional redirect/code deployment because the redirect is already live in production. Task21.5 still has a local owner refresh pending redeploy. When the Task21 batch is deployed, verify that the redirect remains unchanged and the refreshed owner body is live.
