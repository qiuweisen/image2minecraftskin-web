# ChartMini v2 SEO/GEO

This directory contains both migrated historical SEO evidence and the active ChartMini v2 SEO workflow.

## Active source of truth

The only active SEO/GEO workflow for the current application is:

`docs/seo/v2/_workflow/`

Task-specific v2 evidence belongs under:

`docs/seo/v2/flowtrace/`

## Legacy boundary

Files that already existed under `docs/seo/` before the v2 workflow initialization on 2026-08-14 are migration/history references unless they are explicitly re-verified and copied into the v2 workflow with a fresh observation date.

In particular, do **not** treat these legacy materials as current v2 state:

- `docs/seo/flowtrace/_workflow/`
- historical `gsc-*` exports
- historical `bing-*` exports
- historical SERP notes
- historical protected-page windows
- historical GSC submission logs
- historical owner/task decisions

The previous project at `/Users/iven/Desktop/Work/Chartmini/TradeGame-cloudflare-migration-test` is read-only history. Never modify it from v2 work.

## v2 blog architecture

The v2 blog does not use the old build/index pipeline.

- Article source: `content/blog/*.md`
- Manifest builder: `scripts/build-blog-manifest.mjs`
- Generated manifest: `src/generated/blog-manifest.json`
- Article bodies: uploaded/rendered through the v2 R2 content pipeline
- Route renderer: `src/routes/blog/$slug.tsx`
- Route-generated structured data: `BlogPosting`, `BreadcrumbList`, author `Person`, and site-level schema
- Legacy JSON-LD embedded in Markdown is filtered by the route; only selected visible-content schemas are eligible to render. Do not add a duplicate `Article`/`BlogPosting` schema when editing an article.

## Operating rule

Every v2 SEO task must perform a fresh v2 Preflight and Owner Gate before editing. GSC, Bing, SERP, protection, and owner facts must be observed for the current v2 deployment or explicitly marked unknown. Never fill an unknown field from legacy data.
