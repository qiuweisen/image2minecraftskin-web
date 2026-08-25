# image2minecraftskin MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and ship `image2minecraftskin.com`, an English-only free tool site that converts user images into downloadable Java 64x64 and Bedrock 128x128 Minecraft Skin PNGs with 2D/3D previews, locale-ready architecture, and a polished editorial utility landing page.

**Architecture:** Start from the proven `ascii-image-web` TanStack Start/Cloudflare template patterns, while keeping the new repository independent from ChartMini trading routes and SEO content. A browser-safe normalized Skin model feeds Java/Bedrock exporters and shared 2D/3D previews. The homepage owns the core image-to-skin intent; only differentiated supporting pages are indexable.

**Tech Stack:** TanStack Start, React 19, TypeScript, Vite, Cloudflare Workers, Tailwind CSS v4, Paraglide, Vitest, Playwright, `skinview3d`/Three.js for the 3D preview, Wrangler, GitHub CLI.

---

## Task 1: Establish The Independent Site Baseline

**Files:**
- Source reference: `/Users/qiuweisen/CascadeProjects/ascii-image-web/`
- Modify: current repository tracked files as needed to remove ChartMini product code
- Preserve: `产品需求.md`, `tmp/design/`, and unrelated user files
- Create: `README.md` and clean site-level configuration for `image2minecraftskin.com`

**Step 1: Capture the current state**

Run:

```bash
git status --short --branch
git log -1 --oneline
```

Expected: only the known untracked product brief is outside the committed design
document. Do not delete or reset it.

**Step 2: Create an isolated implementation branch**

Run:

```bash
git switch -c feat/image2minecraftskin-mvp
```

Expected: branch is created without changing the existing remote.

**Step 3: Bring over only reusable template patterns**

Copy or recreate the ASCII project's locale setup, marketing layout patterns,
analytics conventions, CSS token conventions, test setup, and Cloudflare/Vite
configuration. Do not copy ASCII-specific routes or ChartMini routes into the
new information architecture.

**Step 4: Remove product-specific leftovers**

Delete or replace trading routes, trading stores, trading copy, payment/auth
navigation, stale ChartMini metadata, and unused domain-specific components.
Keep generic legal, locale, analytics, and Cloudflare infrastructure only when
it remains reachable and tested.

**Step 5: Verify the clean baseline**

Run:

```bash
pnpm check
pnpm build
```

Expected: the independent shell builds before the Minecraft feature is added.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: establish image2minecraftskin site baseline"
```

## Task 2: Add Brand Tokens, Assets, And Locale Foundation

**Files:**
- Modify: `src/config/website.ts`, `src/config/navbar-config.ts`,
  `src/config/footer-config.ts`, `src/styles.css`, `src/custom.css`
- Modify: locale project settings and message sources under `project.inlang/` and
  `src/locale/`
- Create: `public/brand/logo-mark.svg`, `public/brand/logo-lockup.svg`,
  `public/og-image2minecraftskin.png`, favicon and manifest assets
- Create: `src/config/skin-site.ts`

**Step 1: Write a config test**

Create a Vitest test that asserts the site name, domain, default locale, title,
description, and navigation route ownership are `image2minecraftskin.com`
values, not ChartMini or ASCII values.

**Step 2: Run the failing test**

```bash
pnpm vitest run tests/unit/site-config.test.ts
```

Expected: FAIL because the new config and assertions do not exist.

**Step 3: Implement semantic design tokens**

Add the Crafted Pixel Utility tokens from the design document. The marketing
shell should be warm and light; the converter workspace should be graphite with
cyan, lime, coral, and muted text states. Keep control radius at 4px and panel
radius at 8px. Preserve reduced-motion rules and keyboard focus treatment.

**Step 4: Add the approved brand direction**

Use the square pixel-grid mark as the source for a code-native SVG or carefully
traced asset. Do not use the generated wordmark bitmap as the production logo;
render `image2minecraftskin` as real text so it remains sharp and localizable.
Use the generated OG art only as a background layer with exact title text
overlaid by HTML/CSS or a deterministic image script.

**Step 5: Add English locale messages**

Create message keys for navigation, hero, upload states, format/model controls,
preview states, download errors, examples, compatibility, FAQ, legal copy,
metadata, alt text, and structured data. Keep all visible strings and metadata
out of components. Configure the locale switcher and URL strategy for future
Simplified Chinese without publishing empty translated pages.

**Step 6: Run checks and commit**

```bash
pnpm vitest run tests/unit/site-config.test.ts
pnpm check
git add src public project.inlang tests/unit/site-config.test.ts
git commit -m "feat: add skin site brand and locale foundation"
```

Expected: the config test passes and generated locale artifacts are consistent.

## Task 3: Define The Normalized Skin Model And Exporters (TDD)

**Files:**
- Create: `src/lib/skin/types.ts`, `src/lib/skin/layouts.ts`,
  `src/lib/skin/normalize.ts`, `src/lib/skin/export-java.ts`,
  `src/lib/skin/export-bedrock.ts`, `src/lib/skin/png.ts`
- Test: `tests/unit/skin-model.test.ts`, `tests/unit/skin-exporters.test.ts`

**Step 1: Write failing model tests**

Cover canonical dimensions, RGBA pixel storage, transparent pixels, invalid
dimensions, and deterministic normalization from a mapped intermediate texture.

**Step 2: Run the tests**

```bash
pnpm vitest run tests/unit/skin-model.test.ts tests/unit/skin-exporters.test.ts
```

Expected: FAIL because the model and exporters are not implemented.

**Step 3: Implement the normalized model**

Represent the generated skin as a typed set of named surfaces plus a canonical
pixel buffer. Keep Java and Bedrock layout differences in declarative layout
maps, not duplicated conversion code. Validate every surface before export.

**Step 4: Implement Java 64x64 export**

Write valid RGBA PNG bytes with the classic Java layout and explicit Steve/Alex
arm-width option. Ensure transparent overlay regions remain transparent.

**Step 5: Implement Bedrock 128x128 export**

Write the Bedrock-compatible 128x128 layout and preserve the selected model
metadata in the client state. Reject impossible layouts with a typed error that
the UI can explain.

**Step 6: Run tests and commit**

```bash
pnpm vitest run tests/unit/skin-model.test.ts tests/unit/skin-exporters.test.ts
git add src/lib/skin tests/unit/skin-*.test.ts
git commit -m "feat: add java and bedrock skin exporters"
```

## Task 4: Implement Browser Image Mapping And Crop State (TDD)

**Files:**
- Create: `src/lib/skin/image-source.ts`, `src/lib/skin/image-mapping.ts`,
  `src/lib/skin/crop.ts`
- Create: `src/hooks/use-skin-generator.ts`
- Test: `tests/unit/skin-mapping.test.ts`, `tests/unit/crop-state.test.ts`

**Step 1: Write failing mapping tests**

Cover subject crop normalization, aspect-ratio preservation, center/default crop,
manual offset and scale, nearest-neighbor pixel sampling, transparent
background handling, and deterministic output for the same source and settings.

**Step 2: Run the tests**

```bash
pnpm vitest run tests/unit/skin-mapping.test.ts tests/unit/crop-state.test.ts
```

Expected: FAIL because the mapping functions do not exist.

**Step 3: Implement image decoding and mapping**

Use browser APIs only (`File`, `createImageBitmap` or `Image`, `canvas`) and
never send source image bytes to a server. Keep mapping pure where possible so
tests do not require a DOM. Use a Web Worker only if profiling shows large image
processing blocks the main thread.

**Step 4: Implement the generator hook**

Expose source state, crop state, Java/Bedrock settings, Steve/Alex selection,
status, normalized Skin output, and download methods. Keep state transitions
explicit: `empty`, `loading`, `ready`, `processing`, `complete`, `error`.

**Step 5: Run tests and commit**

```bash
pnpm vitest run tests/unit/skin-mapping.test.ts tests/unit/crop-state.test.ts
git add src/lib/skin src/hooks/use-skin-generator.ts tests/unit/skin-*.test.ts tests/unit/crop-state.test.ts
git commit -m "feat: add local image to skin mapping"
```

## Task 5: Build The 2D And 3D Preview Workspace

**Files:**
- Create: `src/components/skin/skin-workspace.tsx`,
  `src/components/skin/skin-upload.tsx`, `src/components/skin/skin-controls.tsx`,
  `src/components/skin/skin-preview-2d.tsx`,
  `src/components/skin/skin-preview-3d.tsx`,
  `src/components/skin/skin-status.tsx`, `src/components/skin/example-images.ts`
- Modify: `package.json`, `pnpm-lock.yaml`
- Test: `tests/unit/skin-workspace-state.test.ts`

**Step 1: Add the preview dependency**

Add a maintained browser-safe Skin/Three.js preview dependency such as
`skinview3d` (and its required Three.js dependency) rather than hand-writing a
Minecraft mannequin renderer. Confirm the package is compatible with the
Cloudflare/Vite client bundle and does not import Node APIs.

**Step 2: Write failing workspace state tests**

Cover example selection, upload/reset, format switching, model switching,
loading/error/complete announcements, and download button enablement.

**Step 3: Implement upload and examples**

Support click, drag/drop, and example selection. Validate PNG/JPG/WEBP and the
10MB limit. Show a local-processing explanation beside the upload control.

**Step 4: Implement crop and format controls**

Use tabs or segmented controls for Java 64x64 and Bedrock 128x128; use a
Steve/Alex control; expose crop/scale/position only after a source exists.
Keep controls at least 44px tall and keyboard accessible.

**Step 5: Implement synchronized previews**

Render the 2D unfolded texture and a `skinview3d` canvas from the same Skin
model. Provide rotate/pose controls as icons with tooltips, stable aspect
ratios, and a clear output-size/model status.

**Step 6: Implement download and status announcements**

Download the selected PNG with a deterministic filename. Put status updates in
an `aria-live="polite"` region and pair state color with text/icon.

**Step 7: Run unit tests and commit**

```bash
pnpm vitest run tests/unit/skin-workspace-state.test.ts
pnpm check
git add src/components/skin package.json pnpm-lock.yaml tests/unit/skin-workspace-state.test.ts
git commit -m "feat: add skin preview workspace"
```

## Task 6: Compose The Premium Homepage

**Files:**
- Create or replace: `src/components/blocks/homepage.tsx`
- Create: `src/components/skin/skin-hero-proof.tsx`,
  `src/components/skin/skin-examples.tsx`,
  `src/components/skin/skin-compatibility.tsx`,
  `src/components/skin/skin-how-it-works.tsx`
- Modify: `src/routes/index.tsx`, `src/routes/__root.tsx`, `src/styles.css`
- Test: `tests/unit/homepage-content.test.tsx`

**Step 1: Write failing homepage assertions**

Assert exactly one H1, the core keyword cluster, upload workspace presence,
Java/Bedrock controls, local-processing copy, visible FAQ questions, and no
ChartMini/trading strings.

**Step 2: Run the test**

```bash
pnpm vitest run tests/unit/homepage-content.test.tsx
```

Expected: FAIL until the homepage is replaced.

**Step 3: Implement the first viewport**

Use the ASCII project's asymmetric editorial rhythm: compact header, real
photo-to-skin proof, and the working tool before long copy. Keep the main H1
compact enough that the workspace remains visible on a 1440px viewport.

**Step 4: Add proof and compatibility sections**

Use loadable real examples, Java/Bedrock comparison, import notes, and the
Upload/Adjust/Preview/Download sequence. Do not create empty feature cards or
generic AI claims.

**Step 5: Add FAQ and footer boundaries**

Use the existing semantic FAQ pattern and add the non-affiliation notice. Keep
legal, privacy, and cookie routes functional with localized messages.

**Step 6: Run checks and commit**

```bash
pnpm vitest run tests/unit/homepage-content.test.tsx
pnpm check
git add src/components src/routes/index.tsx src/routes/__root.tsx src/styles.css tests/unit/homepage-content.test.tsx
git commit -m "feat: build image2minecraftskin premium homepage"
```

## Task 7: Add SEO Metadata And Differentiated Supporting Pages

**Files:**
- Modify: `src/lib/seo.ts`, `src/lib/urls.ts`, `src/routes/index.tsx`,
  `src/routes/sitemap[.]xml.ts`, `src/routes/robots[.]txt.ts`
- Create: route/component files for only the approved differentiated pages
- Test: `tests/unit/seo-metadata.test.ts`, `tests/e2e/seo-homepage.spec.ts`

**Step 1: Write failing SEO tests**

Assert the homepage title, description, canonical URL, one H1, WebApplication
JSON-LD, FAQPage JSON-LD, robots, sitemap inclusion, and no typo doorway URLs.

**Step 2: Implement homepage metadata**

Use the domain and keyword cluster from the design document. Generate localized
title, description, Open Graph, Twitter, canonical, and future hreflang values
from the same message source as visible copy.

**Step 3: Add supporting pages only when behavior differs**

Start with `/photo-to-minecraft-skin`, `/png-to-minecraft-skin`,
`/minecraft-skin-64x64`, and `/minecraft-skin-128x128` only if each supplies a
real default configuration, unique copy, and distinct FAQ. Do not mass-generate
near-identical pages.

**Step 4: Verify structured data**

Make visible FAQ entries and JSON-LD derive from the same localized data. Keep
structured data honest about local conversion and supported formats.

**Step 5: Run tests and commit**

```bash
pnpm vitest run tests/unit/seo-metadata.test.ts
pnpm e2e tests/e2e/seo-homepage.spec.ts
git add src/lib src/routes tests/unit/seo-metadata.test.ts tests/e2e/seo-homepage.spec.ts
git commit -m "feat: add skin SEO metadata and intent pages"
```

## Task 8: Add Analytics Without Source Image Collection

**Files:**
- Modify: `src/lib/analytics-events.ts` or create the site equivalent
- Create: `src/lib/skin-analytics.ts`, `tests/unit/skin-analytics.test.ts`
- Modify: relevant workspace components

**Step 1: Write failing event tests**

Cover `skin_upload`, `skin_example_select`, `skin_format_select`,
`skin_model_select`, `skin_preview_ready`, `skin_download`, and typed error
events. Assert payloads contain dimensions/types, never image bytes or source URLs.

**Step 2: Implement event dispatch**

Reuse the template's existing analytics abstraction. Keep events anonymous and
disabled where the selected analytics provider requires consent. Do not add
server persistence or R2 uploads for MVP conversion.

**Step 3: Verify and commit**

```bash
pnpm vitest run tests/unit/skin-analytics.test.ts
git add src/lib src/components tests/unit/skin-analytics.test.ts
git commit -m "feat: instrument skin conversion events"
```

## Task 9: Add Playwright Journey And Responsive Verification

**Files:**
- Modify: `tests/e2e/TEST-CATALOG.md`
- Create: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`
- Create: `tests/e2e/fixtures/skin-fixtures.ts` if fixture images are needed

**Step 1: Write the acceptance journey**

Document anonymous upload, example fallback, Java/Bedrock switch, model switch,
preview readiness, download, invalid-file recovery, and mobile layout.

**Step 2: Implement the Playwright spec**

Use a deterministic fixture image. Assert the browser does not make a request
containing the source image, download filename/PNG signature, visible status,
keyboard access, and the four responsive widths 390, 768, 1024, and 1440.

**Step 3: Run the focused journey**

```bash
pnpm e2e tests/e2e/specs/image2minecraftskin-homepage.spec.ts
```

Expected: all upload-to-download and responsive assertions pass.

**Step 4: Inspect real screenshots and console output**

Run the local server, capture desktop/mobile screenshots, inspect the 3D canvas
for nonblank pixels, and fix any overlap, clipping, or console errors.

**Step 5: Commit**

```bash
git add tests/e2e
git commit -m "test: cover skin homepage journey and responsive states"
```

## Task 10: Cloudflare Wrangler And Production Configuration

**Files:**
- Modify: `wrangler.jsonc`, `vite.config.ts`, `src/env/server.ts`,
  `src/env/client.ts`, `src/routes/manifest[.]json.ts`
- Create: `docs/cloudflare.md`, `.env.example`

**Step 1: Validate the Worker configuration**

Run:

```bash
pnpm cf-typegen
wrangler whoami
```

Expected: the account is the authenticated user and generated bindings contain
only bindings actually used by the MVP.

**Step 2: Keep MVP bindings minimal**

Do not provision D1/R2/auth/payment until a feature needs them. Reserve named
binding sections and document future AI/storage migration without adding dead
runtime code.

**Step 3: Verify local Worker build**

```bash
pnpm build
wrangler deploy --dry-run
```

Expected: the Worker bundle builds and dry-run reports the intended site name.

**Step 4: Commit**

```bash
git add wrangler.jsonc vite.config.ts src/env docs/cloudflare.md .env.example
git commit -m "chore: configure cloudflare worker deployment"
```

## Task 11: Create The Independent GitHub Repository And Push

**Files:**
- Remote repository: `qiuweisen/image2minecraftskin-web` (confirm availability
  before creating)
- Modify: `origin` remote only after local verification

**Step 1: Verify repository availability and account**

```bash
gh auth status
gh repo view qiuweisen/image2minecraftskin-web
```

Expected: the new repository is absent or explicitly identified as an existing
target. Never overwrite an existing repository.

**Step 2: Create the repository**

```bash
gh repo create qiuweisen/image2minecraftskin-web --public --description "Image to Minecraft Skin generator"
```

If the user chooses a private repository, change `--public` before running.

**Step 3: Push the verified branch**

```bash
git remote add image2minecraft git@github.com:qiuweisen/image2minecraftskin-web.git
git push -u image2minecraft feat/image2minecraftskin-mvp
```

Expected: the new repository contains the implementation branch and no push is
made to the existing `origin` remote.

**Step 4: Add repository metadata**

Set the repository homepage URL, topics, and default branch only after checking
the created repository. Do not add secrets to the repository.

## Task 12: Production Deploy And Verification

**Files:**
- Modify: Cloudflare project settings only through Wrangler/Cloudflare CLI
- Create: deployment evidence under `docs/deploy/` if required by the repo

**Step 1: Run the full local verification suite**

```bash
pnpm check
pnpm build
pnpm e2e
```

Expected: all checks pass; record any environment-only test exclusions.

**Step 2: Deploy only after explicit release confirmation**

```bash
pnpm deploy
```

Use the Cloudflare CLI to attach the custom domain only after confirming the
zone and DNS ownership. Do not submit Google/Bing indexing automatically.

**Step 3: Verify production**

Use Playwright/Chrome DevTools against the production URL to check status 200,
canonical and hreflang metadata, upload/download behavior, nonblank 3D canvas,
mobile layout, console errors, CSP, and that source images remain local.

**Step 4: Document and commit release metadata**

Record the deployed URL, commit SHA, verification date, and known residual risks
in `docs/deploy/`. Keep indexing submission as a separate user-approved action.
