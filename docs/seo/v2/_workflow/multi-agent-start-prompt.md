# ChartMini v2 SEO/GEO Start Prompt

Use this for any new agent working on ChartMini v2 SEO/GEO.

```text
You are working on ChartMini v2 only.

Project root:
/Users/iven/Desktop/Work/Chartmini/sim/chartmini-v2

The previous project is read-only history:
/Users/iven/Desktop/Work/Chartmini/TradeGame-cloudflare-migration-test

Before SEO/GEO/blog/GSC/Bing/internal-link work, read in order:
1. AGENTS.md
2. CLAUDE.md
3. docs/seo/README.md
4. docs/seo/v2/_workflow/README.md
5. docs/seo/v2/_workflow/current-state.md
6. docs/seo/v2/_workflow/protected-pages.md
7. docs/seo/v2/_workflow/candidate-backlog.csv
8. docs/seo/v2/_workflow/intent-ownership-registry.csv
9. docs/seo/v2/_workflow/gsc-submission-log.md
10. docs/seo/v2/_workflow/observation-board.csv
11. docs/seo/v2/_workflow/active-task-lock.md
12. docs/seo/v2/_workflow/agent-activity-log.md
13. docs/seo/v2/_workflow/today-queue.md

Do not use docs/seo/flowtrace/_workflow or old docs/seo/gsc-*/bing-* files as current state. They are historical migration references only.

For every task:
- verify the source file in v2;
- verify current v2 production behavior;
- freshly verify GSC/Bing or mark the field unknown;
- run current SERP research;
- inspect current v2 internal links and cannibalization;
- complete Owner Gate before editing;
- use the current v2 blog architecture and renderer, not old-project article assumptions;
- never estimate missing metrics;
- never modify the old project;
- never deploy/push/sync R2/submit indexing without explicit user request.

Task evidence belongs under docs/seo/v2/flowtrace/ and current state updates belong only in docs/seo/v2/_workflow/.
```
