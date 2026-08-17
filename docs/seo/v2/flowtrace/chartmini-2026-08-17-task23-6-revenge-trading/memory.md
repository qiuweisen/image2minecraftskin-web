# Task 23.6 — Revenge Trading Specialist Owner

Date: 2026-08-17
Target: `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026`
Source: `content/blog/2026010403.md`

## Decision

Owner Gate: `retain_narrow + rebuild + reverse_recent_consolidation`

Final local status: `RETAIN_NARROW_REBUILD_RESTORE_OWNER_COMPLETE_PENDING_DEPLOY`

Task22.8 had consolidated this URL to `/blog/how-to-recover-from-trading-loss` because the old page had zero body inlinks and its content substantially overlapped post-loss recovery while relying on unsupported universal cooldown, trade-count, risk-percentage, neurobiology and ChartMini-automation claims.

Task23.6 re-ran production, fresh SERP, current-site graph, current owner boundaries, and source-quality review. Fresh 2026 search results now show a durable dedicated `revenge trading / how to stop revenge trading` intent distinct from the broader `recover from trading loss` intent. The correct response is therefore not to restore the old broad page unchanged, but to restore the URL as a narrowly defined specialist.

## Fresh production preflight

Before Task23.6 changes, production returned:

- `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026` -> direct HTTP 301 to `/blog/how-to-recover-from-trading-loss`
- `/blog/2026010403` -> direct HTTP 301 to `/blog/how-to-recover-from-trading-loss`
- `/blog/how-to-recover-from-trading-loss` -> 200
- `/blog/trading-psychology-master-emotions` -> 200
- production sitemap contained Recovery and Broad Psychology owners, not the Revenge source

Current GSC/Bing metrics for this specific target are `unknown_not_reverified`.

## Fresh SERP evidence

Fresh 2026 search for revenge-trading intent surfaced multiple dedicated pages whose primary intent is definition, recognition, and interruption of loss-chasing after a recent loss, including current 2026 pages from Monkeytrade, TradeZella, TradeDiary and other trading-psychology publishers.

Fresh ChartMini search for `how to recover from trading loss` still surfaces the separate Recovery owner with a broader drawdown/loss-event recovery process.

Interpretation: search intent has enough separation for two owners if their boundaries are enforced:

- **Revenge Trading specialist:** whether the next trade is contaminated by the desire to recover the previous loss; trigger recognition; fresh-trade test; post-loss decision gate; size/frequency drift; journaling the urge; interruption before escalation.
- **Behavioral Recovery owner:** classify planned vs rule-breaking vs out-of-plan/blowup events; decide whether a pause/reduced risk/simulation is needed; review the losing sequence; define evidence for returning to normal risk.
- **Broad Psychology owner:** fear, greed, FOMO, revenge context, anchoring, overconfidence, analysis paralysis and broad emotional execution.

## Evidence quality gate

The old Revenge article used unsupported deterministic statements such as:

- amygdala takes over and prefrontal cortex shuts down;
- fixed 15-minute cooldowns;
- fixed 2% daily loss limits;
- fixed maximum trade counts;
- universal 0.5–1% risk prescriptions;
- categorical claims about what causes most account blowups;
- fake ChartMini emotional-state detection and automatic lockout.

Task23.6 replaced those with bounded evidence:

1. Lerner & Keltner (2001), *Fear, Anger, and Risk*, PubMed PMID 11474720. The study supports the narrower claim that anger and fear can influence risk perception differently; it does not prove that every losing trade causes a deterministic neurological shutdown.
2. Liu et al. (2014), *Prospect Theory for Online Financial Trading*, analyzing more than 28.5 million trades from over 81,000 traders. It provides large-scale evidence consistent with loss aversion/reflection effects, but is not presented as direct proof of a universal revenge-trading mechanism.

No universal cooldown duration, daily trade count, or risk percentage is claimed.

## Site graph before and after

Preflight body inlinks:

- Revenge target: 0 external Markdown body inlinks
- Behavioral Recovery owner: 8
- Broad Psychology owner: 22

Task23.6 added direct canonical support from three relevant pages without editing the protected Recovery owner body:

- `content/blog/2026010302.md` — Trading Execution Gap
- `content/blog/2026010703.md` — Day Trading Mistakes
- `content/blog/2026041202.md` — Broad Trading Psychology

Final Revenge target body support: 3 source files.

## Content rebuild

New title:

`Revenge Trading: How to Stop the Loss-Chasing Spiral in 2026`

New meta title:

`How to Stop Revenge Trading: A Practical 2026 Guide`

Approximate length: 3,036 words.

The rebuilt article now owns:

- a behavioral definition of revenge trading;
- revenge trade vs valid immediate re-entry;
- fresh-trade test: would the trade still exist if the previous loss had never happened?;
- setup/risk/independence/limit checks;
- post-loss decision gate without universal timer;
- revenge trading vs averaging down;
- overtrading as a possible symptom rather than fixed trade-count definition;
- position-size escalation as a revenge signal;
- journaling both revenge trades and correctly skipped urges;
- escalation handoff to the Behavioral Recovery owner;
- replay practice limited to decision structure, not emotional replication;
- FAQ and source notes.

Removed:

- `redirectTo`
- manual Article/BlogPosting JSON-LD
- deterministic brain-language claims
- fabricated blowup prevalence claims
- universal fixed cooldowns
- universal fixed trade counts
- universal 1%/2% risk rules
- fake ChartMini emotional tracking / automatic lockout / live risk automation

## Redirect architecture

Local Task23.6 final state:

- `/blog/the-revenge-trading-trap-how-to-stop-the-spiral-2026` = restored canonical owner
- `/blog/2026010403` -> direct 301 to the restored long slug
- the long slug is removed from `src/config/chartmini-blog-redirects.json` as a redirect source
- global duplicate redirect-source definitions: 0

Production will continue to show the Task22.8 301 until the Task23 batch is deployed.

## Internal-link audit

Target has 8 unique internal Blog destinations:

- `/blog/how-to-recover-from-trading-loss`
- `/blog/trading-psychology-master-emotions`
- `/blog/how-to-build-trading-plan`
- `/blog/pre-trade-checklist`
- `/blog/the-5-deadly-day-trading-mistakes-that-will-blow-up-your-account-in-2026-2026`
- `/blog/risk-management-position-sizing-guide`
- `/blog/how-to-keep-trading-journal`
- `/blog/day-trading-practice-simulator-replay-session`

Post-build manifest audit: 8/8 are current non-redirecting owners.

## Schema / architecture

- manual `Article`: absent
- manual `BlogPosting`: absent
- route-generated BlogPosting/Breadcrumb remains authoritative
- target is an owner in generated manifest
- 402 total blog posts remain in manifest

## Validation

- `pnpm build` — PASS; 402 posts
- `pnpm check` — PASS; Biome 414 files; Vitest 5 files / 13 tests
- `pnpm seo:v2:workflow:check` — PASS
- `git diff --check` — PASS
- target manifest ownership — PASS
- 8/8 internal Blog links non-redirecting — PASS
- duplicate redirect source definitions — 0

## Deployment / indexing state

No commit, push, deployment, R2 sync, GSC Request Indexing, Bing, or IndexNow action was performed in Task23.6.

After deployment, verify:

1. long slug returns 200;
2. exact self-canonical;
3. new title/body/dateModified are live;
4. long slug appears in sitemap;
5. `/blog/2026010403` direct 301s to long slug;
6. route-generated BlogPosting only;
7. three body support links are live.

Only after actual deployment/indexing event should a fresh 7-day/14-day observation window be created.
