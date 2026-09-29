# image2minecraftskin.com Design

**Status:** Approved for implementation planning

**Date:** 2026-08-25

**Domain:** `image2minecraftskin.com`

## Product Decision

Build an independent English-first tool site focused on the image-to-Minecraft-
skin intent cluster. The homepage owns `image to minecraft skin`; supporting
copy and real tool states cover `photo to skin`, `minecraft skin generator from
image`, Java/Bedrock output, and 64x64/128x128 export requirements.

This is not a generic `minecraft skins` download library. The primary journey
is upload an image, crop and position it, choose a Java or Bedrock output,
preview the 3D character and 2D unfolded texture, and download a usable PNG.

The first release is free and does not require an account. Browser-local
conversion is the primary mode. The architecture reserves an AI generation
adapter for a later phase without making AI claims about the local converter.

## Goals

1. Reach a usable result from the first viewport on desktop and mobile.
2. Support Java 64x64 and Bedrock 128x128 as real export modes in the MVP.
3. Make output quality inspectable through synchronized 3D and 2D previews.
4. Keep normal conversion local to the browser and explain the privacy boundary.
5. Reuse the proven TanStarter/TanStack Start infrastructure and the
   `ascii-image-web` editorial utility design language without mixing products.
6. Keep English as the launch locale while preserving locale-aware routing,
   message catalogs, metadata, sitemap alternates, and future translations.
7. Ship a small, focused SEO surface with distinct intent ownership rather than
   a large set of near-duplicate keyword pages.

## Non-Goals

- A public skin gallery, UGC community, skin search engine, or marketplace.
- Accounts, subscriptions, credits, or a payment wall in the MVP.
- A large pixel-by-pixel editor.
- AI generation as a launch dependency.
- Pages targeting `mc skins`, `minecraft skins`, or typo variants as separate
  doorway pages.
- Copying competitor assets, official Minecraft branding, Creeper imagery,
  official fonts, or implying Mojang/Microsoft affiliation.

## Design Principles

### Crafted Pixel Utility

The site is a precise browser instrument for turning an image into a usable
skin. It should feel crafted and controllable, not like a generic AI toy or a
game dashboard.

### Tool First

The uploader, output format choice, or a real before/after proof must appear in
the first viewport. Marketing copy stays short and supports the task.

### Human to Block Contrast

Use real source imagery, crop frames, pixel grids, 3D character output, and 2D
skin layouts as the primary visuals. Avoid abstract technology illustrations.

### Dark Work Surface, Light Editorial Shell

The page shell uses warm white and soft neutral surfaces. The converter uses a
deep graphite workspace with cyan structure lines, checkerboard transparency,
and restrained lime/coral states. This extends the `ascii-image-web` language
without reproducing its ASCII output.

### Honest State And Privacy

Local conversion is labeled as local conversion. A future AI mode is a separate
capability. Ready, processing, complete, and error states use text plus icons,
not color alone.

### Progressive Control

The first interaction exposes upload, Java/Bedrock, Steve/Alex, crop, preview,
and download. Advanced controls can appear after a valid image exists. No
complex editor is shown before the user has a result.

### Responsive Craft

The desktop workspace uses a control rail and an output stage. Below 920px it
becomes a single-column flow with stable preview ratios and a persistent export
action on mobile. No text, control, or preview may overlap at 390px, 768px,
1024px, or 1440px widths.

## Visual System

```css
--skin-bg: #f4f3ef;
--skin-surface: #ffffff;
--skin-ink: #182126;
--skin-workspace: #081013;
--skin-panel: #0d181c;
--skin-line: #28515a;
--skin-cyan: #72e5e0;
--skin-lime: #c7f36b;
--skin-coral: #ff756b;
--skin-muted: #769096;
--skin-text: #d9ebe5;
--skin-radius-control: 4px;
--skin-radius-panel: 8px;
```

Use Bricolage Grotesque or the existing brand display family for page headings,
and a system monospace stack for workspace metadata, dimensions, statuses, and
skin grid labels. Letter spacing remains zero. Transitions stay in the
120-160ms range and respect `prefers-reduced-motion`.

The primary mark direction is a compact square symbol made from two connected
pixel grids, representing source pixels and the output skin. The working brand
wordmark is `image2minecraftskin`; exact text should be rendered in code rather
than relying on generated bitmap text. Generated exploration assets live under
`tmp/design/` until final project assets are selected.

## Homepage Information Architecture

```text
/
├── Header: brand, Generator, Guides, language switcher
├── Hero: image-to-skin promise plus real photo/skin comparison
├── Generator workspace: upload, crop, format, model, 3D/2D preview, download
├── Examples: portrait, character art, pixel art, each loadable into the tool
├── Compatibility: Java 64x64, Bedrock 128x128, Steve/Alex, PNG import notes
├── How it works: Upload, Adjust, Preview, Download
├── FAQ: operational questions matching visible JSON-LD
└── Footer: legal, privacy, non-affiliation statement, language links
```

The homepage is the primary SEO owner. A future `/generator` route may provide
an expanded workspace, but it must not become an indexable duplicate without a
distinct intent. First-phase supporting pages are limited to real differentiated
configurations such as `/photo-to-minecraft-skin`, `/png-to-minecraft-skin`,
`/minecraft-skin-64x64`, `/minecraft-skin-128x128`, and Java/Bedrock pages only
when each has a meaningful default configuration and unique explanatory copy.

## SEO And Growth Boundary

The keyword plan follows the supplied SEO report while treating third-party
volume and difficulty as hypotheses until verified with Keyword Planner,
Trends, and live GSC data.

- P0 homepage: `image to minecraft skin`.
- P0 supporting language: `photo to skin`, `photo to minecraft skin`, and
  `minecraft skin generator from image`.
- P1 later: `ai minecraft skin generator`, only after the AI mode is real.
- Do not create typo pages for `miencaft` or doorway pages for broad download
  terms.

The first KPI is successful conversion/download completion and Search Console
impressions, not a forecasted traffic or revenue number. Product analytics must
measure upload, format selection, crop change, preview readiness, and download
without storing source images.

## Architecture

Create a clean independent site from the TanStarter/TanStack Start base. Reuse
infrastructure patterns from the current repository and the component and
design conventions from `ascii-image-web`, but do not reuse ChartMini routes,
trading content, or its SEO ownership registry.

The conversion engine is a pure browser-safe module with a normalized
intermediate Skin model. Exporters translate that model to Java 64x64 and
Bedrock 128x128 PNG layouts. A preview adapter consumes the same model for a
2D canvas and a lightweight 3D scene. An AI provider interface can later
produce the normalized model or texture without changing the download path.

Use Paraglide locale messages for every visible string, including tool labels,
errors, statuses, FAQ copy, alt text, metadata, and structured data. English is
the only launch locale, but routes and SEO helpers must preserve the extension
point for Simplified Chinese and additional locales.

Cloudflare Workers hosts the SSR app. Cloudflare bindings are initialized only
when needed. MVP conversion must not require R2, D1, auth, or payment. R2/D1
remain available for future AI jobs, user-approved saved work, analytics
aggregation, or content workflows. Use Wrangler/Cloudflare CLI for binding and
deployment setup; do not deploy or submit indexing until the implementation
passes browser verification and the user explicitly requests deployment.

## Acceptance Gates

Before implementation is considered complete:

1. A first-time anonymous user can upload or choose an example, select Java or
   Bedrock, see 3D and 2D output, and download a PNG on desktop and mobile.
2. Local conversion works with no network request containing the source image.
3. Empty, loading, invalid-file, oversized-file, conversion-error, and success
   states are keyboard accessible and visually distinct.
4. Homepage SSR includes one H1, localized metadata, WebApplication and FAQ
   structured data matching visible content, canonical, sitemap, and robots.
5. English UI copy has enough width for future translation expansion.
6. Playwright covers the primary upload-to-download journey and responsive
   snapshots; unit tests cover Skin normalization and both exporters.
7. Production build, type checks, lint, and focused E2E tests pass before any
   GitHub push or Cloudflare deployment.

