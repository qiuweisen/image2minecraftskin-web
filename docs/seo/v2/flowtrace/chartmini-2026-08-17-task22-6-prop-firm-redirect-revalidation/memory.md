# Task 22.6 — Prop Firm Trading Duplicate Revalidation

Date: 2026-08-17 local project date
Requested URL: `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026`
Requested source: `content/blog/2026013102.md`
Selected canonical owner: `/blog/prop-trading-firms-funded-accounts`
Owner source: `content/blog/2026031202.md`
Final Owner Gate: `preserve_consolidation_redirect + revalidate_owner`
Final status: `PRESERVE_CONSOLIDATION_REDIRECT_REVALIDATED_LIVE`

## 1. Preflight

Task22.6 was authorized for the long prop-firm URL. The v2 workflow requires a fresh production, SERP, current-source, and cannibalization check before any content edit.

The requested source already contains:

`redirectTo: /blog/prop-trading-firms-funded-accounts`

The redirect was created by the prior v2 prop-firm consolidation work. The canonical owner is already under observation from the Task20 deployment/indexing batch, so Task22.6 does not reopen or rewrite that owner unless a hard factual, technical, or redirect defect is found.

Current v2 GSC/Bing metrics were not queried through a connected source in this task. Do not import legacy metrics. Performance fields remain `unknown_not_reverified` except for the workflow's existing user-confirmed GSC indexing state.

## 2. Fresh production verification

Checked production on 2026-08-17:

- `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026` -> direct HTTP 301 to `/blog/prop-trading-firms-funded-accounts`
- `/blog/2026013102` -> direct HTTP 301 to `/blog/prop-trading-firms-funded-accounts`
- canonical owner `/blog/prop-trading-firms-funded-accounts` -> HTTP 200
- canonical owner has exact self-canonical
- canonical owner is present in the production sitemap
- requested redirect source is absent from the production sitemap
- no external routable Markdown body page links to the requested redirect source

The production redirect architecture is therefore already correct and live.

## 3. Fresh SERP / web verification

Fresh searches included:

- `prop firm trading funded account simulated funded live account 2026`
- exact requested ChartMini long slug
- `site:chartmini.com/blog prop firm funded accounts ChartMini`
- current FTMO simulated/funded-account documentation
- current Topstep Express Funded Account / Live Funded Account documentation

Fresh search surfaced both the historical requested ChartMini URL and the canonical `/blog/prop-trading-firms-funded-accounts` owner. Because production already redirects the historical URL, the old result should be treated as search-index lag, not as evidence to restore a competing 200 page.

## 4. Current primary-source verification

Current official sources checked:

### FTMO

- `https://ftmo.com/en/faq/how-does-an-ftmo-account-work-from-the-technical-side/`
- `https://ftmo.com/en/how-it-works/`
- `https://ftmo.com/en/challenge/`
- `https://ftmo.com/en/terms-and-conditions/`

Current FTMO documentation still states that its Challenge and FTMO Account are simulated/demo environments with fictitious capital. FTMO may separately use trader data for its own trading, but the client does not receive a live brokerage account merely by reaching the FTMO Account stage.

### Topstep

- `https://help.topstep.com/en/articles/8284099-topstep-program-overview`
- `https://help.topstep.com/en/articles/8284215-express-funded-account-parameters`
- `https://help.topstep.com/en/articles/10657969-live-funded-account-parameters`
- `https://help.topstep.com/en/articles/8284233-topstep-payout-policy`

Current Topstep documentation still describes:

1. Trading Combine — simulated evaluation;
2. Express Funded Account (XFA) — simulated funded-level account;
3. Live Funded Account (LFA) — real firm-backed capital for traders who are called up.

This directly supports the canonical owner's existing simulated-vs-live distinction.

## 5. Cannibalization / Owner Gate

### Requested URL

`/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026`

Problems if restored as a 200 owner:

- exact same broad funded-account / prop-firm intent as the established owner;
- misleading `risk-free` framing because fees, subscriptions, resets, lost payout eligibility, counterparty risk, and trading-rule risk still exist;
- old body contains stale fixed fee ranges, fixed pass-rate assumptions, static firm rankings, deterministic profitability examples, fixed learning timelines, and overbroad ChartMini product claims;
- production already consolidates it correctly;
- no routable external body inlinks currently support it as an independent owner.

### Canonical owner

`/blog/prop-trading-firms-funded-accounts`

Current owner already covers:

- traditional prop desk vs retail evaluation model;
- simulated funded vs live funded accounts;
- challenge/evaluation mechanics;
- drawdown and consistency rules;
- payout conditions;
- fee and counterparty/business risk;
- due diligence;
- challenge simulation before payment;
- FTMO and Topstep current-model examples;
- tax/PDT caveats without universal legal/tax claims;
- accurate ChartMini capability boundary.

The canonical owner also has stronger body-link support than the historical duplicate.

### Decision

`preserve_consolidation_redirect + revalidate_owner`

Do not restore the requested source as an indexable 200 page. Do not rewrite the protected canonical owner during its observation window because no hard factual defect was found.

## 6. Local implementation state

No article-body change was required for Task22.6.

Existing correct local state retained:

- `content/blog/2026013102.md`
  - `redirectTo: /blog/prop-trading-firms-funded-accounts`
- redirect config:
  - `/blog/2026013102` -> `/blog/prop-trading-firms-funded-accounts`
  - `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026` -> `/blog/prop-trading-firms-funded-accounts`
- generated manifest:
  - requested source carries `redirectTo`
  - canonical owner remains routable
- duplicate redirect-source definitions: 0
- external routable body links to requested redirect source: 0

Task22.6 only updates v2 workflow evidence/status to record the revalidation and the already-live production redirect.

## 7. Intent boundary

Canonical owner intent:

`prop_trading_funded_account_mechanics`

Owner:

`/blog/prop-trading-firms-funded-accounts`

Owns:

- modern retail prop-firm/funded-account mechanics;
- simulated-vs-live funded account distinction;
- evaluation/challenge rules;
- loss/drawdown/consistency constraints;
- payout and fee mechanics;
- due diligence and eligibility questions;
- challenge preparation.

Does not automatically own:

- traditional institutional prop-firm careers/interviews;
- a live, constantly maintained best-prop-firm ranking;
- broker-specific funded-account programs;
- general risk management;
- general paper trading;
- futures strategy education.

## 8. Protection / observation

The canonical owner was already deployed and user-confirmed submitted/indexed in the Task20/Task21 closeout batch.

Task22.6 does not restart the observation window because the owner body was not modified.

Observation reviews remain:

- 7-day: 2026-08-22
- 14-day: 2026-08-29

Requested redirect source remains protected as a redirect source. Do not restore it as a 200 owner or add canonical body links to it without a future fresh Owner Gate demonstrating a durable separate intent.

## 9. Validation result

Final validation after Workflow sync:

- `pnpm build` — PASS; 402 blog posts generated.
- `pnpm check` — PASS; Biome clean; Vitest 5 files / 13 tests PASS.
- `pnpm seo:v2:workflow:check` — PASS; 13 required workflow files and 402 Blog Markdown sources.
- `git diff --check` — PASS.
- generated manifest: requested historical slug carries `redirectTo: /blog/prop-trading-firms-funded-accounts`; canonical owner remains routable.
- external routable body links to redirect source — 0.
- duplicate redirect-source definitions — 0.

No commit, push, deploy, R2 sync, GSC Request Indexing, Bing, or IndexNow action is authorized or performed by Task22.6.
