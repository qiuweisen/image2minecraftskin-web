# Minecraft Skin Landing Visual Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the homepage as one cohesive dark Minecraft Skin Workshop landing page based on the approved full-page design direction.

**Architecture:** Keep TanStarter layout and UI primitives, keep all page copy and repeated content in configuration, and limit new code to the skin tool's real business surfaces. Replace mixed light/dark section styling with shared dark tokens and a single editorial border system.

**Tech Stack:** TanStack Start, React 19, Tailwind CSS v4, existing TanStarter UI primitives, existing 2D/3D skin components, Playwright, Biome.

---

### Task 1: Align the shared visual tokens

**Files:**
- Modify: `src/styles.css`
- Reference: `DESIGN.md`

1. Map the approved charcoal, cyan, lime, muted text, border, spacing, and radius tokens into the existing theme without changing unrelated template themes.
2. Remove page-specific light section assumptions from homepage-scoped styles.
3. Preserve dark-mode behavior and reduced-motion/focus rules.
4. Run `pnpm check` and confirm no lint or type regressions.

### Task 2: Recompose the homepage shell

**Files:**
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/config/homepage-config.ts`

1. Keep the configured Hero, features, steps, formats, trust, FAQ, navbar, and footer data model.
2. Make every homepage section use the same dark canvas, separators, compact monospace metadata, and 4-8px control language.
3. Replace generic light cards with numbered editorial grids and connected process rows.
4. Ensure the first viewport contains the transformation proof and a clear generator action.
5. Remove hard-coded copy that duplicates configuration.

### Task 3: Make the hero conversion proof product-specific

**Files:**
- Modify: `src/components/blocks/homepage.tsx`
- Add or reference: `output/imagegen/minecraft-skin-product-example-v1.png` after asset selection

1. Use the approved portrait -> character -> texture visual as the hero proof.
2. Add compact format/status labels without inventing statistics or AI claims.
3. Keep the primary CTA linked to the generator and the secondary action linked to the workflow explanation.
4. Validate image sizing, alt text, loading priority, and mobile crop.

### Task 4: Complete the example-ready generator state

**Files:**
- Modify: `src/components/skin/skin-workspace.tsx`
- Modify: `src/components/skin/skin-preview-3d.tsx`

1. Make the default example state visually complete rather than leaving both preview regions empty.
2. Preserve upload, format, arm-model, reset, preview, and download behavior.
3. Use shared status labels for waiting, processing, ready, and error states.
4. Keep texture and 3D preview dimensions stable across state changes.
5. Verify keyboard focus and mobile stacking.

### Task 5: Verify the landing-page visual system

**Files:**
- Modify: `tests/e2e/TEST-CATALOG.md` if acceptance coverage is missing
- Add/modify: `tests/e2e/specs/homepage.spec.ts` if needed

1. Run the dev server on a free port and inspect desktop and 390px mobile layouts.
2. Verify navigation, generator CTA, example state, format controls, FAQ, and footer links.
3. Run `pnpm check`, `pnpm build`, and the focused Playwright spec.
4. Review screenshots for mixed palettes, overlap, unstable dimensions, unreadable text, and empty product regions.
