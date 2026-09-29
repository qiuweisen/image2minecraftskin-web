# Focused Tool Pages AI SEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve ChatGPT and Google discovery by making the generator and viewer independently focused, machine-readable tool pages connected by contextual workflow links.

**Architecture:** Keep page content in the existing page configuration modules so visible copy and JSON-LD share one source. Replace the inherited analytics contract with a typed, privacy-safe skin event contract and call it directly from each workspace. Treat `llms.txt`, sitemap, metadata, and server-rendered internal links as discovery infrastructure, while keeping each tool's primary interaction unchanged.

**Tech Stack:** TanStack Start, React 19, TypeScript, Vitest, Playwright, JSON-LD, Umami/GA/Plausible adapters.

---

### Task 1: Replace the inherited analytics contract

**Files:**
- Modify: `tests/unit/analytics-events.test.ts`
- Modify: `src/lib/analytics-events.ts`

**Step 1: Write the failing tests**

Replace ASCII event fixtures with generator and viewer fixtures. Assert that:

- `skin_generation_completed` forwards only `format`, `model`, `sourceWidth`, and `sourceHeight`.
- private fields such as `fileName` and `imageData` are discarded.
- `gtag` does not also push to `dataLayer`.
- Umami receives the same sanitized payload.
- analytics absence remains a no-op.

**Step 2: Run the focused test and verify RED**

Run: `pnpm test tests/unit/analytics-events.test.ts`

Expected: FAIL because `SkinAnalyticsEvent` and `trackSkinEvent` do not exist.

**Step 3: Implement the minimal typed contract**

Define page-specific event names and property allowlists in
`src/lib/analytics-events.ts`. Rename the exported type and function to
`SkinAnalyticsEvent` and `trackSkinEvent`. Preserve the existing adapters and
SSR no-op behavior.

**Step 4: Run the focused test and verify GREEN**

Run: `pnpm test tests/unit/analytics-events.test.ts`

Expected: PASS.

### Task 2: Instrument the two independent tool workflows

**Files:**
- Modify: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`
- Modify: `tests/e2e/specs/minecraft-skin-viewer.spec.ts`
- Modify: `src/components/skin/skin-workspace.tsx`
- Modify: `src/components/skin/skin-viewer-workspace.tsx`

**Step 1: Extend E2E acceptance around tool-specific events**

Capture calls to `window.umami.track` before hydration and assert generator
actions use `skin_*` generator events while viewer actions use
`skin_viewer_*` events. Assert no event property contains a filename or image
payload.

**Step 2: Run both specs and verify RED**

Run: `pnpm exec playwright test tests/e2e/specs/image2minecraftskin-homepage.spec.ts tests/e2e/specs/minecraft-skin-viewer.spec.ts --project=chromium`

Expected: FAIL because the workspaces do not dispatch skin events.

**Step 3: Add minimal event calls**

Instrument upload validation, successful generation/viewer readiness, failure,
format/model selection, and download. Keep analytics fire-and-forget and avoid
filenames or image contents.

**Step 4: Re-run both specs and verify GREEN**

Run the same Playwright command.

Expected: PASS.

### Task 3: Make the generator page independently extractable

**Files:**
- Modify: `src/config/homepage-config.ts`
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`
- Modify: `tests/e2e/TEST-CATALOG.md`

**Step 1: Add failing acceptance assertions**

Assert that the server-rendered generator page includes:

- a concise converter definition
- accepted source formats and the 10 MB limit
- Java 64x64 and Bedrock 128x128 output language
- a contextual `Inspect a skin in the 3D viewer` link
- generator-specific FAQ/HowTo JSON-LD

Assert that viewer upload/validation controls are not duplicated on the page.

**Step 2: Run the homepage spec and verify RED**

Run: `pnpm exec playwright test tests/e2e/specs/image2minecraftskin-homepage.spec.ts --project=chromium`

Expected: FAIL on the new content/link/schema assertions.

**Step 3: Implement focused content and schema**

Add short self-contained generator answer blocks to the existing editorial
sections, add a visually secondary contextual link to the viewer, and add a
`HowTo` object generated from the visible `howToUse.steps`. Keep existing
`WebApplication` and FAQ data synchronized with visible configuration.

**Step 4: Re-run the homepage spec and verify GREEN**

Run the same Playwright command.

Expected: PASS.

### Task 4: Make the viewer page independently extractable

**Files:**
- Modify: `src/config/skin-viewer-config.ts`
- Modify: `src/components/blocks/skin-viewer-page.tsx`
- Modify: `src/routes/minecraft-skin-viewer.tsx`
- Modify: `tests/e2e/specs/minecraft-skin-viewer.spec.ts`
- Modify: `tests/e2e/TEST-CATALOG.md`

**Step 1: Add failing viewer assertions**

Assert that the rendered viewer includes:

- a direct definition of a Minecraft skin viewer
- exact supported PNG dimensions
- Classic/Slim explanation
- a contextual `Create a skin from an image` link
- viewer-specific FAQ and HowTo JSON-LD

Assert that ordinary photo conversion controls are not duplicated.

**Step 2: Run the viewer spec and verify RED**

Run: `pnpm exec playwright test tests/e2e/specs/minecraft-skin-viewer.spec.ts --project=chromium`

Expected: FAIL on the new schema and focused-copy assertions.

**Step 3: Implement viewer-only content and schema**

Refine configuration copy without expanding the viewer's feature set. Track the
generator handoff link and generate FAQ/HowTo JSON-LD from the visible viewer
configuration while preserving the existing WebApplication and breadcrumbs.

**Step 4: Re-run the viewer spec and verify GREEN**

Run the same Playwright command.

Expected: PASS.

### Task 5: Correct machine-readable discovery files

**Files:**
- Modify: `public/llms.txt`
- Modify: `src/routes/sitemap[.]xml.ts`
- Modify: `tests/e2e/specs/public-pages.spec.ts`

**Step 1: Replace stale route assertions with product assertions**

Add tests that `/llms.txt` returns `200`, identifies
`image2minecraftskin.com`, links only current public product/policy routes, and
contains no ChartMini/trading copy. Assert sitemap includes generator and
viewer entries with explicit `lastmod` values and no disabled ASCII routes.

**Step 2: Run the public route spec and verify RED**

Run: `pnpm exec playwright test tests/e2e/specs/public-pages.spec.ts --project=chromium`

Expected: FAIL because `llms.txt` is stale and sitemap has no `lastmod`.

**Step 3: Implement accurate discovery files**

Rewrite `public/llms.txt` with a concise product definition, capability limits,
canonical tool links, privacy/terms links, and sitemap. Update sitemap XML with
explicit content update dates for the two tools and policy pages.

**Step 4: Re-run the public route spec and verify GREEN**

Run the same Playwright command.

Expected: PASS.

### Task 6: Full verification

**Files:**
- Verify all modified files

**Step 1: Run unit and static checks**

Run: `pnpm check`

Expected: Biome and Vitest exit `0`.

**Step 2: Run the public product E2E suite**

Run: `pnpm e2e:public`

Expected: all desktop and mobile generator/viewer journeys pass.

**Step 3: Run the production build**

Run: `pnpm build`

Expected: exit `0`; build output contains `llms.txt`.

**Step 4: Verify the real UI**

Start `pnpm dev` on an available port. Use Playwright at desktop and Pixel 5
sizes to inspect both pages, rendered JSON-LD, cross-tool links, responsive
layout, and console errors.

**Step 5: Review the diff**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors and no unrelated files modified.
