# Skin Quality V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve private, local image-to-skin mapping, UX, analytics, and add an AI HD waitlist fake door.

**Architecture:** Keep core pixel mapping pure and browser-independent; lazily run self-hosted MediaPipe analysis before mapping, with deterministic fallback. Wire options and local status into the existing workspace, persist waitlist emails through a validated server function and D1, then localize and document/benchmark the output.

**Tech Stack:** TypeScript, React/TanStack Start, MediaPipe Tasks Vision, Drizzle/D1, Paraglide, Vitest, Biome.

**Spec:** User request in the task prompt (feat/skin-quality-v2).

## Global Constraints

- Images never leave the device; no paid image APIs.
- All MediaPipe runtime assets load from `/mediapipe/...`; no CDN/model-host runtime requests.
- No remote D1 migrations, deployment, or merge.
- Never include email or image data in analytics/logging.
- Base-layer HEAD/TORSO/ARMS/LEGS cells must be opaque after mapping.
- Follow `DESIGN.md`; preserve local-only processing disclosure and accessibility.
- Push the branch after every commit; keep/update a draft PR.

## Review Focus

- Transparent images and logos: never produce base-layer holes; logo artwork remains chest-centered (pure mapper tests).
- Portrait/half-body inputs: avoid stretching background into arms/legs (template tests and fixture bench).
- Local model failure/offline: deterministic fallback still yields an opaque usable skin (vision fallback test).
- Slim and Bedrock formats: arms remain slim and target dimensions are 128×128 (mapping tests).
- Waitlist privacy: validate/normalize email and do not expose it in analytics or logs (server/analytics tests).

---

### Task 1: Pure mapper v2

**Files:** `src/lib/skin/{types,cutout,face,templates,style,normalize}.ts`, `tests/unit/skin-quality-v2.test.ts`.

**Interfaces:** `mapImageToSkin(source, format, model?, options?)`; `GenerationOptions` includes kind/style/faceDetails and optional analysis mask/crops. Preserve legacy crop-call compatibility if existing callers require it.

- [ ] Add focused tests for opacity, slim arms, Bedrock 128, face details, logo chest, and style differences.
- [ ] Implement deterministic alpha filling, face emphasis, kind templates, and pixel treatment.
- [ ] Run focused and existing skin unit tests.

### Task 2: Local vision analysis

**Files:** `src/lib/skin/vision.ts`, `src/lib/skin/ai-improve.ts`, `tests/unit/skin-vision.test.ts`.

**Interfaces:** lazy `analyzeSource(source, onProgress?)` returns kind, optional face/pose crops/masks, faceFound and loadMs; failures are caught by workspace and mapper fallback.

- [ ] Verify installed MediaPipe API types and write loader/path tests.
- [ ] Load WASM and models only from `/mediapipe/wasm` and `/mediapipe/models`.
- [ ] Ensure clean fallback and progress reporting.

### Task 3: Workspace UX and analytics

**Files:** `src/components/skin/skin-workspace.tsx`, `src/components/skin/skin-preview-3d.tsx`, `src/lib/analytics-events.ts`, tests.

- [ ] Add kind/style/face controls, model loading state, front/back 3D affordance, sticky format download, post-download Java/Bedrock guide, and local-only note.
- [ ] Fire the specified analytics events with sanitized fields.
- [ ] Check keyboard, responsive, empty/loading/error, and reduced-motion behavior.

### Task 4: Waitlist fake door and D1 migration

**Files:** `src/config/skin-tool-config.ts`, `src/api/ai-waitlist.ts`, `src/db/app.schema.ts`, generated migration and journal/snapshot, waitlist tests.

- [ ] Add unique email table and validated server function; do not log PII.
- [ ] Add price constant and honest email/honeypot modal.
- [ ] Generate migration with `pnpm db:generate`; do not apply remotely.

### Task 5: Localization

**Files:** all seven `project.inlang/messages/*.json`, generated `src/locale/paraglide/` output.

- [ ] Add accurate translations for all new workspace, import guide, and waitlist strings.
- [ ] Run `pnpm locale:sort` and `pnpm locale:compile`.

### Task 6: Quality bench and PR evidence

**Files:** `scripts/skin-quality-bench.ts`, `docs/pr-screens/fixtures/*`, `docs/pr-screens/LICENSES.md`, contact sheets/screenshots, `docs/pr-screens/QUALITY.md`.

- [ ] Run 6–9 freely licensed or synthetic fixtures through real v1 and v2 mapping.
- [ ] Save comparative 2D texture sheets and browser UI screenshots where feasible.
- [ ] Record mapping time and total local model/WASM size.

### Task 7: Verification and draft PR

- [ ] Run `pnpm check`, `pnpm exec tsc --noEmit`, and `pnpm build`.
- [ ] Fix failures, commit each coherent milestone, and push after every commit.
- [ ] Create/update draft PR titled `feat(skin): quality v2 — cutout, face, kinds, AI waitlist` with detailed Chinese body and post-deploy actions.
