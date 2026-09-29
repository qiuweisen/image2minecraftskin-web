# Conversion UX Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve generator verification, recovery, cases, and measurement without changing the existing UV mapper.

**Architecture:** Add a pure source-transform helper in front of `mapImageToSkin`, expose it through an optional adjustment panel in the existing workspace, and keep the unadjusted upload path as the default. Extend the existing privacy-safe analytics allowlist and present one verified case using real exported artifacts.

**Tech Stack:** React 19, TypeScript, TanStack Start, Tailwind CSS, Vitest, Playwright.

---

### Task 1: Source transform model

**Files:**
- Create: `src/lib/skin/source-transform.ts`
- Test: `tests/unit/source-transform.test.ts`

1. Write failing tests for normalized pan/zoom bounds, identity reset, and transformed pixel placement.
2. Run `pnpm vitest run tests/unit/source-transform.test.ts` and verify failure.
3. Implement pure transform normalization and canvas-independent pixel resampling.
4. Run the unit test and verify it passes.

### Task 2: Privacy-safe funnel events

**Files:**
- Modify: `src/lib/analytics-events.ts`
- Modify: `tests/unit/analytics-events.test.ts`

1. Add failing tests proving adjustment and retry events allow only approved fields.
2. Run the focused test and verify failure.
3. Add event names and field allowlists.
4. Run the focused test and verify it passes.

### Task 3: Optional adjustment and verification UI

**Files:**
- Modify: `src/components/skin/skin-workspace.tsx`
- Modify: `src/config/skin-tool-config.ts`
- Modify: `tests/e2e/TEST-CATALOG.md`
- Modify: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`

1. Specify the optional adjustment, reset, inspection, retry, and unchanged fast path in E2E.
2. Run the relevant spec and verify the new journey fails.
3. Add a collapsed adjustment panel with zoom, horizontal/vertical framing, reset, and immediate preview regeneration.
4. Add a compact pre-download inspection prompt and retry action.
5. Track adjustment, inspection, retry, and download events without image data.
6. Run the spec and verify it passes on desktop and mobile.

### Task 4: Verified case presentation

**Files:**
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/config/homepage-config.ts`
- Create: `public/examples/image-to-skin/aligned-pixel-source.png`
- Create: `public/examples/image-to-skin/aligned-pixel-java-64.png`
- Modify: `tests/e2e/specs/image2minecraftskin-homepage.spec.ts`

1. Add a failing assertion for a source-to-output case with accessible labels.
2. Export the existing built-in source and its real mapped output as static assets.
3. Add a restrained, unframed case band showing source, 3D/texture result, and format metadata.
4. Run the E2E spec and verify it passes.

### Task 5: Release verification

1. Run `pnpm check`.
2. Run `PLAYWRIGHT_CHANNEL=chrome pnpm e2e:public`.
3. Run `pnpm build`.
4. Inspect desktop and mobile screenshots, console errors, overflow, and downloaded PNG dimensions.
5. Confirm `src/lib/skin/normalize.ts` is unchanged.
