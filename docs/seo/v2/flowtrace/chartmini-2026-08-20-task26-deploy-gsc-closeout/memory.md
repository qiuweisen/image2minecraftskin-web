# Task26 Deployment / GSC Closeout

Date: 2026-08-20

## Scope

Close out the deployed Task26.1–26.9 changes after fresh production verification and the user's confirmation that the unindexed pages from the recommended Task26 canonical set were successfully submitted through Google Search Console URL Inspection / Request Indexing.

## Production verification

Fresh production verification confirms these five Task26 canonical owners are live as HTTP 200 pages with exact self-canonical URLs, sitemap inclusion, and `dateModified: 2026-08-20`:

1. `/blog/chartmini-vs-candledojo-comparison`
2. `/blog/how-to-trade-the-news`
3. `/blog/market-structure-trading-guide`
4. `/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`
5. `/blog/pre-trade-checklist`

Fresh redirect verification confirms direct 301 routing for the checked Task26 consolidation sources:

- `/blog/how-to-trade-news-trading-like-a-pro-in-2026` -> `/blog/how-to-trade-the-news`
- `/blog/news-based-trading-practical-guide` -> `/blog/how-to-trade-the-news`
- `/blog/2026021502` -> `/blog/how-to-trade-the-news`
- `/blog/2026032801` -> `/blog/how-to-trade-the-news`
- `/blog/market-structure-analysis-how-to-read-the-markets-true-direction-2026` -> `/blog/market-structure-trading-guide`
- `/blog/2026011105` -> `/blog/market-structure-trading-guide`
- `/blog/mastering-market-volatility-the-adaptive-traders-survival-guide-2026` -> `/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`
- `/blog/2026010303` -> `/blog/volatility-trading-mastery-how-to-profit-from-market-chaos-and-uncertainty-in-2026-2026`

The five canonical owners are present in the production sitemap. Redirect sources remain no-submit URLs.

## GSC action

The user confirmed on 2026-08-20 that the unindexed pages were submitted successfully in GSC.

The exact submitted-vs-already-indexed subset of the five recommended Task26 canonical URLs was not enumerated. Therefore this closeout records a successful selective GSC action for the five-URL inspection set without fabricating per-URL Request Indexing state.

No GSC submission is recorded for numeric URLs or redirect-source long slugs.

Task26.4 Swing viability already had user-confirmed Request Indexing on 2026-08-17 and was not resubmitted. Task26.2 FOMO keeps its earlier observation window and redirect-owner state.

## Observation window

The five newly deployed/rebuilt Task26 canonical owners enter read-only observation:

- 7-day review: 2026-08-27
- 14-day review: 2026-09-03
- freeze through: 2026-09-03

Allowed exceptions: hard technical defect, material factual/regulatory/risk error, broken owner boundary, canonical/redirect defect, or explicit user override.

Existing observation clocks are preserved for:

- Task26.2 FOMO owner: 2026-08-24 / 2026-08-31
- Task26.4 Swing viability owner: 2026-08-24 / 2026-08-31

## Repository state

Task26 content/code/workflow commit already pushed before deployment:

- commit: `4e130b05f0e21546051ff927b5ef7569caed3e3d`
- branch: `main`
- remote: `chartminiv2`

The unrelated tracked modification `content/blog/2026030502.md` remains outside Task26 scope and must remain excluded from closeout staging.

## Final result

`DEPLOY_VERIFIED_SELECTIVE_GSC_RECORDED_OBSERVATION_ACTIVE`

Bing/IndexNow remain `unknown_not_reverified` unless separately verified later.
