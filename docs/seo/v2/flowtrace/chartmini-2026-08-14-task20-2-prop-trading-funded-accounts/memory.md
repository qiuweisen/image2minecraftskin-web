# Task 20.2 — Prop Trading Firms / Funded Accounts

Date: 2026-08-14
Project: ChartMini v2
Target: `https://chartmini.com/blog/prop-trading-firms-funded-accounts`
Source: `content/blog/2026031202.md`
Authorized by user: yes

## Goal

Recover and clarify the search intent around modern retail prop trading firms, funded accounts, evaluations, drawdown rules, payouts, and challenge preparation while preventing cannibalization inside the current v2 site.

## v2 Preflight

### Production target

Fresh production check on 2026-08-14:

- HTTP: 200
- Canonical: `https://chartmini.com/blog/prop-trading-firms-funded-accounts`
- Sitemap: present
- Existing title before Task20.2: `Prop Trading Firms Explained: How Funded Accounts Work & How to Pass the Challenge`
- Existing page was still the pre-Task20.2 production version at local completion time.

### Data access

Fresh task probe:

- `claude-seo`: unavailable in current DevSpace shell
- current-v2 GSC values: `unknown_not_reverified`
- `BING_WEBMASTER_API_KEY`: absent
- `INDEXNOW_KEY`: absent
- current-v2 Bing values: `unknown_not_reverified`

No legacy GSC/Bing metrics were imported.

## Fresh SERP / primary-source evidence

The current SERP for prop-trading/funded-account intent is dominated by educational guides explaining how evaluations and funded accounts work, what risk rules mean, and how traders should interpret the funded-account model. The target page itself is already surfaced for the intent.

Primary-source facts reverified on 2026-08-14:

1. FTMO currently describes its Challenge, Verification, and FTMO Account as a demo/simulated trading environment; its funded-stage capital is simulated and eligible traders can receive rewards based on simulated profits.
2. FTMO's current program includes a 1-Step evaluation option, making the old article's fixed two-phase-only FTMO description stale.
3. Topstep currently describes a three-stage path: simulated Trading Combine -> simulated Express Funded Account -> Live Funded Account for traders who progress to live.
4. Topstep's current Trading Combine uses a Profit Target, Maximum Loss Limit, and consistency objective.
5. Topstep's current Express Funded Account is explicitly described as simulated and has separate payout paths/conditions.
6. CFTC customer education warns traders to investigate counterparties, fee structures, withdrawals, registration where applicable, promotional conflicts, and guaranteed-return claims. These are general trading/forex consumer-protection principles, not a claim that every retail prop firm is a regulated broker or a fraud.

Evidence reviewed:

- FTMO: `https://ftmo.com/en/challenge/`
- FTMO: `https://ftmo.com/en/how-it-works/`
- Topstep Program Overview: `https://help.topstep.com/en/articles/8284099-topstep-program-overview`
- Topstep Trading Combine Parameters: `https://help.topstep.com/en/articles/8284197-trading-combine-parameters`
- Topstep Express Funded Account Parameters: `https://help.topstep.com/en/articles/8284215-express-funded-account-parameters`
- Topstep Payout Policy: `https://help.topstep.com/en/articles/8284233-topstep-payout-policy`
- CFTC forex customer advisory: `https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html`
- CFTC Forex Frauds: `https://www.cftc.gov/LearnAndProtect/forexfrauds`

SERP evidence also included current beginner guides from TradeZella, SyncFutures, For Traders and other funded-account publishers. Search result ordering is directional evidence, not a reproducible Google rank report.

## Cannibalization review

A material duplicate owner was discovered:

- `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026`
- source: `content/blog/2026013102.md`

Fresh production check showed the duplicate was HTTP 200, self-canonical, and present in the sitemap. It covered the same core intent and contained stale firm rankings, fees, pass-rate estimates, program rules, and obsolete/shutdown references.

The Task20.2 target has the stronger ownership signals:

- more direct evergreen slug;
- six current Markdown articles link to `/blog/prop-trading-firms-funded-accounts`;
- target already appears in current search results for the intent;
- duplicate had no current Markdown inbound links to its long slug.

## Owner Gate

Decision:

- `/blog/prop-trading-firms-funded-accounts`: `rebuild` and confirm as the single v2 owner for prop-firm/funded-account mechanics, evaluations, risk rules, payout logic, due diligence, and challenge preparation.
- `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026`: `consolidate_redirect` into the target.

This is not a "best prop firms" commercial ranking owner. The page intentionally avoids a static ranked list because program terms change rapidly.

## Changes made

### Main target — `content/blog/2026031202.md`

- Preserved canonical slug and original publication date.
- Added `dateModified: 2026-08-14`.
- Added concise `metaTitle`.
- Rebuilt title/description around funded-account mechanics and evaluations.
- Removed manual legacy `Article` JSON-LD; v2 route remains responsible for BlogPosting/BreadcrumbList/author schema.
- Replaced the oversimplified "firm gives you real capital" framing with a verified simulated-vs-live explanation.
- Removed static "reputable firms" ranking and volatile pricing tables.
- Removed unsupported pass-rate estimates and repeated claims that traders usually fail a fixed number of attempts.
- Removed outdated FTMO two-phase-only framing and old firm/program details.
- Added clear explanation of nominal account size vs real loss budget.
- Added static-vs-trailing drawdown explanation.
- Added consistency-rule explanation.
- Added a five-step challenge-preparation workflow focused on reproducing the exact rule set in simulation.
- Added due-diligence comparison table.
- Added prop-firm-vs-own-account comparison.
- Added FAQ and current primary-source verification notes.
- Added seven scoped internal links to risk management, journaling, paper-vs-live trading, day-trading education, futures education, trading psychology and Market Replay.

### Duplicate — `content/blog/2026013102.md`

Added:

`redirectTo: /blog/prop-trading-firms-funded-accounts`

This removes the duplicate from the routable/indexable blog owner set generated by the v2 manifest.

### Permanent redirects — `src/config/chartmini-blog-redirects.json`

- `/blog/2026013102` now redirects directly to `/blog/prop-trading-firms-funded-accounts`.
- `/blog/prop-firm-trading-2026-get-funded-and-trade-capital-risk-free-2026` redirects directly to `/blog/prop-trading-firms-funded-accounts`.
- No redirect chain is introduced.

## Internal-link status

Before Task20.2, six current Markdown articles already linked to the target owner. No current Markdown article linked to the duplicate long slug. Existing links therefore already favor the chosen owner and did not require broad cluster rewrites.

## Validation

Passed after changes:

- `pnpm build`
- `pnpm check`
  - Biome PASS
  - Vitest 3/3 PASS
- `pnpm seo:v2:workflow:check`
- `git diff --check`

Generated manifest validation:

- 402 Markdown source records retained.
- target manifest record includes the new title, metaTitle, description and `dateModified: 2026-08-14`.
- duplicate manifest record contains `redirectTo: /blog/prop-trading-firms-funded-accounts`.
- only one routable prop/funded-account owner remains for this duplicate cluster.
- redirect config contains no duplicate source paths.
- numeric legacy URL and duplicate long slug both point directly to the target owner.

## Deployment / indexing status

Not performed in Task20.2:

- no commit
- no push
- no deployment
- no R2 content sync
- no GSC Request Indexing
- no Bing/IndexNow submission

Local status: `protected_pending_deploy`.

After actual deployment, verify:

1. target HTTP 200;
2. target title/description/H1/dateModified/body;
3. exact canonical;
4. target remains in sitemap;
5. duplicate long slug returns direct permanent redirect to target;
6. `/blog/2026013102` returns direct permanent redirect to target;
7. duplicate is absent from sitemap;
8. Googlebot receives the same canonical/redirect behavior;
9. only then establish real 7-day and 14-day observation dates and obtain fresh GSC/Bing evidence when access is available.
