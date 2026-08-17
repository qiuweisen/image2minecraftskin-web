# Task 23.1 — Risk Management Mastery Redirect Revalidation

Date: 2026-08-17
Baseline: ChartMini v2
Requested URL: `/blog/risk-management-mastery-protect-your-capital-and-survive-any-market-2026`
Source: `content/blog/2026011303.md`
Selected owner: `/blog/risk-management-position-sizing-guide`
Owner source: `content/blog/2026031201.md`

## Result

`PRESERVE_CONSOLIDATION_REDIRECT_REVALIDATED_LIVE`

Owner Gate: `preserve_consolidation_redirect + revalidate_owner`

No article-body, slug, canonical-owner, redirect-destination, or schema change was justified in Task23.1.

## Why this is a revalidation instead of a rebuild

Task22.8 already consolidated the requested generic broad-risk page into the stronger broad trading-risk owner. Task23.1 did not inherit that decision blindly. It repeated production, SERP, current-source, local-manifest, internal-link, and cannibalization checks on 2026-08-17.

The fresh evidence supports preserving the consolidation. Restoring the requested URL as a second 200 owner would recreate broad trading-risk cannibalization and would re-expose the older page's unsupported universal prescriptions.

## Fresh production verification — 2026-08-17

Direct header checks:

- `https://chartmini.com/blog/risk-management-mastery-protect-your-capital-and-survive-any-market-2026`
  - HTTP 301
  - direct `Location: https://chartmini.com/blog/risk-management-position-sizing-guide`
- `https://chartmini.com/blog/2026011303`
  - HTTP 301
  - direct `Location: https://chartmini.com/blog/risk-management-position-sizing-guide`
- `https://chartmini.com/blog/risk-management-position-sizing-guide`
  - HTTP 200
  - exact self-canonical
  - H1: `Risk Management in Trading: Sizing, Stops, and Drawdown Controls`
  - route-generated `BlogPosting`
  - visible `FAQPage`
  - `dateModified: 2026-08-17`

Production sitemap check:

- canonical owner present
- requested redirect source absent
- numeric redirect source absent

This confirms the Task22.8 redirect architecture is actually deployed, not merely present in local source.

## Fresh SERP / search evidence

Fresh searches included:

- `site:chartmini.com/blog risk management trading position sizing ChartMini`
- `site:chartmini.com/blog "Risk Management Mastery" ChartMini`
- `trading risk management position sizing stop loss drawdown guide`

Search currently exposes both the canonical broad-risk owner and a stale cached result for the historical `Risk Management Mastery` URL. The historical search result still shows the pre-consolidation body with rigid prescriptions such as universal 1–2% risk rules and fixed drawdown/trade-count rules.

Because production now returns a direct 301 for that URL, the stale search result is treated as index-migration lag, not as evidence that two broad-risk 200 pages should exist.

## Fresh current-source revalidation

Current authoritative sources checked on 2026-08-17:

### CME — The 2% Rule / Controlling Risk

CME presents 1%/2% fixed-percent risk as educational risk-control structures and explicitly states that the 2% threshold is arbitrary. This supports the canonical owner's framing that a percentage is a policy input/example, not a universal law.

Sources:

- `https://www.cmegroup.com/education/courses/trade-and-risk-management/the-2-percent-rule`
- `https://www.cmegroup.com/education/courses/trade-and-risk-management/controlling-risk`

### Investor.gov — order / stop execution risk

Investor.gov states that a stop price is a trigger and does not guarantee the execution price; fast markets can produce fills materially away from the stop. This supports the canonical owner's separation of planned stop risk from realized adverse-fill/gap risk.

Sources:

- `https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14`
- `https://www.investor.gov/introduction-investing/investing-basics/glossary/stop-order`

### FINRA — current intraday margin transition

FINRA's current 2026 investor material states that the replacement intraday-margin requirements became effective June 4, 2026 and permits brokerage firms to transition through October 20, 2027. This matches the canonical owner's current-rule note and reinforces the need to avoid hard-coded legacy PDT assumptions.

Source:

- `https://syndication.finra.org/content/understanding-new-intraday-margin-requirements`

## Current v2 site graph

Local source / manifest check:

- requested source has `redirectTo: /blog/risk-management-position-sizing-guide`
- requested manifest entry has the same redirect destination
- canonical owner manifest entry has no `redirectTo`
- redirect config contains both the numeric and long source as direct redirects to the final owner
- no redirect chain exists for these two sources

Body-level internal-link check:

- canonical broad-risk owner: 64 external Markdown source files linking to `/blog/risk-management-position-sizing-guide`
- requested redirect source: 0 external Markdown body-link files
- the only remaining literal reference to the requested long URL is inside its own historical JSON-LD body, which is behind the redirect and is not an external canonical inlink

The site graph therefore strongly favors the existing owner.

## Cannibalization / boundary decision

Canonical broad-risk owner continues to own:

- risk-capital/account-basis policy
- position-size control as part of the broader risk system
- stop/adverse-fill/gap risk
- leverage and margin risk
- combined exposure / concentration / portfolio heat context
- risk-reward and expectancy interaction
- circuit breakers / drawdown process
- risk-plan testing and review

Separate specialist intents remain:

- beginner Position Sizing
- advanced cross-market Position Sizing methods
- exact 1% Rule
- Portfolio Heat
- Drawdown Recovery Math
- stop-loss / take-profit planning
- Order Types
- Margin mechanics
- Behavioral Loss Recovery

The requested `Risk Management Mastery` page has no durable narrower intent that is not already owned by one of these pages.

## Why the old body must not be restored

The historical requested body still contains broad universal or weakly supported prescriptions, including examples such as:

- `Never Risk More Than 1-2% Per Trade` as non-negotiable
- 1% normal / 2% maximum on high-conviction setups
- fixed maximum trades per day
- fixed daily-loss limits
- fixed drawdown thresholds
- fixed portfolio-risk totals
- fixed risk-reward minimums by trading style
- hard-stop-only language
- fixed crash/bear-market sizing rules
- blanket options allocation/stop rules
- claims implying one risk framework universally separates professional traders from failed traders

These conflict with the more carefully bounded canonical owner and with current primary-source evidence that educational percentage rules are examples rather than universal requirements.

## GSC / Bing data gate

Current v2 GSC performance metrics for this exact owner/redirect pair were not independently re-read in Task23.1: `unknown_not_reverified`.

The user previously confirmed the Task22 deployment succeeded and stated that only canonical pages found to be unindexed were manually submitted to GSC. The exact GSC submission/indexation state of `/blog/risk-management-position-sizing-guide` was not enumerated, so Task23.1 does not invent it.

The redirect source itself should not receive Request Indexing.

Current Bing / IndexNow state: `unknown_not_reverified`.

## Production observation

Task23.1 freshly verifies this particular Task22.8 consolidation as live on 2026-08-17.

Observation dates for this canonical owner / redirect pair:

- 7-day review: 2026-08-24
- 14-day review: 2026-08-31
- freeze through: 2026-08-31 unless a hard technical defect, material factual/regulatory/risk error, redirect failure, or explicit user override occurs

At review time, check whether the stale historical URL disappears from search visibility and whether Google consolidates signals to the canonical owner.

## Changes made in Task23.1

Article/code changes: none.

Workflow/evidence changes only:

- add this independent Task23.1 Flowtrace
- update the target and canonical owner from pending-deploy wording to verified-live observation state
- establish the 2026-08-24 / 2026-08-31 observation dates for this pair
- record that exact owner GSC submission/indexation state remains `unknown_not_reverified`

## Final decision

Do not restore `/blog/risk-management-mastery-protect-your-capital-and-survive-any-market-2026` as an indexable page.

Keep both:

- `/blog/risk-management-mastery-protect-your-capital-and-survive-any-market-2026`
- `/blog/2026011303`

as direct 301 sources to:

- `/blog/risk-management-position-sizing-guide`

Task23.1 status: `PRESERVE_CONSOLIDATION_REDIRECT_REVALIDATED_LIVE`.
