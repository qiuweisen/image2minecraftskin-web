# ChartMini v2 Flowtrace — Task 25.1 Trading Resolutions 2026

Date: 2026-08-19
Target URL: `/blog/trading-resolutions-for-2026-goals-that-actually-work-2026`
Source: `content/blog/2026010102.md`
Previous destination: `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`
Numeric source: `/blog/2026010102`

## 1. Authorization and scope

The user explicitly requested Task25.1 for the Trading Resolutions URL. This authorizes a fresh v2 preflight, SERP/Owner Gate, local content/routing/internal-link changes, validation and Workflow evidence. It does not authorize push, deployment, GSC, Bing, IndexNow or R2 actions.

Task25.1 explicitly re-evaluates a Task21.7 consolidation. The prior redirect is not preserved merely because it already exists; the URL is restored only if fresh evidence supports a distinct durable task.

## 2. Fresh production preflight — 2026-08-19

Before Task25.1 local changes:

- `/blog/trading-resolutions-for-2026-goals-that-actually-work-2026` -> HTTP 301 -> `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`.
- `/blog/2026010102` -> HTTP 301 -> the same Trading Goals owner.
- `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026` -> HTTP 200.
- Local source `content/blog/2026010102.md` carried `redirectTo` to the Trading Goals owner.
- Local redirect config sent both the long and numeric Resolutions paths directly to the Trading Goals owner.
- One source-text link to `/blog/2026010102` existed in `content/blog/2026010701.md`, but that page is itself a redirect source to the Trading Goals owner. Effective routable/indexable body support for the Resolutions URL was therefore 0.
- The existing Trading Goals owner had two source-text body links at preflight; its Task21 observation state remains separate and its body is not modified by Task25.1.
- GSC state for the Resolutions URL: `unknown_not_reverified`.
- Bing state for the Resolutions URL: `unknown_not_reverified`.

## 3. Prior Task21.7 rationale

Task21.7 correctly identified that three live pages were competing around beginner trading goals and rebuilt `/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026` as the stronger broad goal-setting owner.

At that time, the Resolutions page was broad and substantially duplicated:

- process vs outcome goals;
- SMART goals;
- risk rules;
- journaling;
- annual review;
- trading-plan mechanics.

Its old body also contained generic prescriptions such as fixed 1%/1–2% risk, 3% daily loss limits, mandatory cooldown durations, fixed trade-count/sample rules and unsupported deterministic claims. Consolidating that old body was reasonable.

Task25.1 does not restore the old generic body. It asks whether the **URL can own a narrower seasonal intent after a full rebuild**.

## 4. Fresh 2026-08-19 SERP evidence

### A. `trading resolutions / New Year trading resolutions` SERP

Fresh searches for:

- `trading resolutions trader new year resolutions`
- `New Year trading resolutions trader discipline journal risk`
- `trading resolutions for 2026`
- `trading resolutions 2026`

returned a clear seasonal/list-style result pattern, including:

- NetPicks — `Top 10 New Year's Trading Resolutions` (Jan 10, 2026): a list of concrete annual trading commitments.
- Zerodha / In The Money — `26 Trading Resolutions for 2026` (Dec 29, 2025): explicitly frames the content as a menu of resolutions spanning learning, risk, discipline, mental capital and long-term behavior.
- Vantage — `6 New Year Resolutions for Traders in 2026`: New Year resolution list organized around plan, stops, diversification, risk and learning.
- TradingView — `Trading Resolutions for the New Year (and How to Stick to Them)`: resolution-list / follow-through format.
- Options Boot Camp — `Trading Resolutions for the New Year`: strategy/risk/behavior commitments for 2026.

This is materially different from the pure `how to set trading goals` SERP.

### B. `trading goals 2026` SERP

Fresh goal-setting searches returned pages centered on:

- process goals vs outcome/profit goals;
- measurable/SMART construction;
- identifying weaknesses;
- annual-to-quarterly/monthly/daily decomposition;
- journal evidence;
- review cadence and adjustment.

Examples surfaced:

- BabyPips — `How to Set Trading Goals for 2026: A Beginner's Guide`.
- JournalPlus — `How to Set Realistic Trading Goals`.
- Edgeflo — `Trading Goals: The Annual-to-Daily System That Drives Consistency`.
- the existing ChartMini Trading Goals owner.

### C. Intent distinction

Fresh evidence now supports two separate tasks:

1. **Trading Resolutions / New Year Resolutions** — seasonal list/menu intent: what concrete commitments should a trader consider this year?
2. **Trading Goals** — framework intent: how do I define, measure, review and adapt a trading goal?

The prior Task21.7 consolidation is therefore too broad if the Resolutions URL is rebuilt around the first task instead of duplicating the second.

## 5. Current primary-source / quality evidence

Primary sources used to bound the rebuilt page:

- CME Group, `Your Trade Plan Objective`: objectives should be defined, measurable and time-bound; useful for the handoff from a resolution to a formal goal.
- FINRA, `Know Your Risk Tolerance`: risk tolerance is personal and depends on objectives, horizon, financial circumstances and willingness/ability to accept loss; supports removing universal risk percentages.
- Investor.gov, `Investor.gov Tips for 2026`: current 2026 investor-education context around risk and informed decisions.

Current Google Search Central guidance reviewed:

- permanent redirects are a strong canonical signal when duplicate/obsolete URLs should consolidate;
- people-first content should provide substantial additional value and should not exist merely to manufacture another search-targeted page.

Task25.1 restores the URL only because a distinct seasonal search task is now evidenced and the body is rebuilt to deliver that task.

## 6. Owner Gate

Decision:

`retain_narrow + rebuild + reverse_recent_consolidation`

Canonical restored owner:

`/blog/trading-resolutions-for-2026-goals-that-actually-work-2026`

New intent key:

`trading_resolutions_annual_behavior_commitments_2026`

### Resolutions owner owns

- 2026/New Year trading resolutions list/menu intent;
- choosing a small number of behavior commitments;
- execution, risk, journaling, psychology, review and deliberate-practice resolution ideas;
- translating vague annual intentions into observable commitments at a lightweight level;
- mid-year / late-year reset of annual resolutions;
- warning against universal profit/risk/trade-count/cooldown prescriptions.

### Trading Goals owner keeps

`/blog/your-2026-trading-blueprint-setting-goals-that-actually-work-2026`

Intent key:
`trading_goals_beginner_process_review`

It continues to own:

- process vs outcome goals;
- SMART/measurable goal design;
- observable weakness diagnosis;
- behavior + evidence + review point + decision rule;
- review cadence;
- missed-goal diagnosis;
- formal mid-year/annual goal-reset workflow.

### Other boundaries

- `/blog/how-to-build-trading-plan` -> full trading operating-plan mechanics.
- `/blog/risk-management-position-sizing-guide` -> risk architecture / sizing methods.
- `/blog/how-to-keep-trading-journal` -> sustainable logging habit.
- `/blog/trading-journal-review-system-2026` -> aggregated periodic journal review.
- `/blog/year-end-trading-review-how-to-analyze-and-improve-your-trading-performance-2026` -> annual performance review.
- FOMO / Revenge / Execution Gap / Broad Psychology remain their dedicated psychology owners.

`/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026` remains consolidated to the Trading Goals owner; Task25.1 reverses only the Trading Resolutions consolidation.

## 7. Content changes

Completely rebuilt `content/blog/2026010102.md`.

New title:
`Trading Resolutions for 2026: 12 Practical Commitments for Traders`

New meta title:
`Trading Resolutions 2026: 12 Practical Commitments`

`dateModified: 2026-08-19`

Author:
`Iven W.`

Approximate body length:
~2,753 words.

The article now includes:

- direct answer in the opening;
- 5 key takeaways;
- Resolutions vs Goals vs Trading Plan vs Journal distinction table;
- 12 concrete resolution ideas;
- resolution-selection table;
- guidance to choose only a small number of relevant commitments;
- light handoff from resolution to measurable goal without duplicating the full Goals Blueprint;
- mid-year August 2026 reset section;
- FAQ;
- practical next step;
- CME/FINRA/Investor.gov source notes;
- explicit educational/risk boundary.

Removed from the old body:

- manual Article JSON-LD;
- universal `1%` / `1-2%` risk prescriptions;
- universal `3%` daily-loss rule;
- fixed 30-minute cooldown rule;
- fixed daily trade counts;
- universal drawdown thresholds;
- fixed 100-trade and other sample-size prescriptions presented as requirements;
- deterministic claims that a particular process guarantees profitability;
- generic trading-plan sprawl that belongs to the trading-plan owner.

## 8. Redirect architecture

Local final routing:

- `/blog/trading-resolutions-for-2026-goals-that-actually-work-2026` -> restored 200 owner after deployment.
- `/blog/2026010102` -> direct permanent redirect to the restored long canonical.
- The long Resolutions URL is removed from `src/config/chartmini-blog-redirects.json` as a redirect source.
- `/blog/how-to-set-trading-goals-for-2026-a-beginners-guide-2026` remains a direct redirect to the Trading Goals owner.
- `/blog/2026010701` remains direct to the Trading Goals owner.
- `/blog/2026010301` remains direct to the Trading Goals owner.

No redirect chain is introduced.

## 9. Internal-link support

Three direct contextual links were added from current non-redirecting pages:

1. `content/blog/2025122301.md` — Year-End Trading Review: seasonal resolution menu handoff from next-year improvement planning.
2. `content/blog/2026031302.md` — Trading Plan: distinction between annual behavior commitments and the full operating plan.
3. `content/blog/2026031502.md` — Common Trading Mistakes: converting one repeated mistake into an annual behavior commitment.

Final effective body support for the restored Resolutions owner: **3**.

Target article Blog outlinks: 8 unique Blog destinations, all final non-redirecting owners.

## 10. Validation

Completed 2026-08-19:

- `pnpm build` — PASS.
  - Blog manifest: 402 posts.
  - Marketing locale assets: 160.
- `pnpm check` — PASS.
  - Biome: 415 files.
  - Vitest: 6/6 files, 17/17 tests.
- `pnpm seo:v2:workflow:check` — PASS.
  - 13 required Workflow files.
  - 402 Blog Markdown sources.
- `git diff --check` — PASS.
- Target manifest state: owner, no `redirectTo`.
- Target dateModified: `2026-08-19`.
- `/blog/2026010102` -> restored target directly.
- Long target is not a redirect source.
- Duplicate redirect sources: 0.
- Redirect chains: 0.
- Effective target body inlinks: 3.
- Target Blog outlinks to redirect sources: 0.
- Manual Article/BlogPosting schema in target source: absent.

## 11. Production / observation / GSC rules

Task25.1 is locally complete but requires deployment before the restored owner exists in production.

After deployment verify:

- long target returns HTTP 200;
- exact self-canonical;
- new title/meta/dateModified/body live;
- included in sitemap;
- `/blog/2026010102` direct 301 to the restored owner;
- the 3 support links point directly to the long canonical;
- Trading Goals owner remains 200/self-canonical/in sitemap;
- `how-to-set-trading-goals` remains consolidated to the Goals owner;
- no redirect chains.

Establish fresh 7-day and 14-day observation dates from the actual deployment date for the restored Resolutions owner.

GSC:
- restored canonical owner may be inspected and Request Indexing used if appropriate after deployment;
- never submit `/blog/2026010102`;
- no Task25.1 resubmission is required for the unchanged Trading Goals owner solely because this specialist was restored.

Bing/IndexNow: no action performed; state remains `unknown_not_reverified`.

## 12. Final status

`RETAIN_NARROW_REBUILD_RESTORE_OWNER_COMPLETE_PENDING_DEPLOY`
