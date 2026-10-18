# Skin quality v2 notes

## Local MediaPipe assets
Total **~20.9 MiB** under `public/mediapipe/` (wasm + pose/face/selfie/hair/deeplab).
Images never leave the device.

## Real acceptance (updated after void-fill, 2026-10-18 Asia/Shanghai)

Fixtures: `fixtures/real/` + `LICENSES.md`.

Method:
- Same mapping path as the UI (`analyzeSource` + `mapImageToSkin`) with self-hosted models
- Prod skins from production Playwright captures
- 3D via `scripts/render-skin-3d.mjs`
- Contact sheets: `contact-real-*.png`
- Harnesses: `scripts/base-layer-integrity.mjs` (no alpha&lt;255 / near-black in base body), `scripts/clothing-fidelity-check.mjs` (ΔE)

### Fixes in this pass
- **Near-black / transparent voids** in base body regions are filled with safe subject tones (intentional face-detail eyes `[31,42,49]` survive).
- **Faceless non-cutout** inputs (e.g. full-body statue, no face) stay on **prod-like lite path** (no hair/back post-process).
- Cutout art (anime/logo/pixel) remains gated to lite/unmasked sampling.

### Per-fixture verdict

| Fixture | Verdict | Notes |
|---------|---------|--------|
| portrait-selfie | prefer new / tie | Dress blue kept; head cleaner than prod |
| half-body | prefer new | No black holes (integrity PASS); less foliage wash than prod |
| full-body | lite / ≈prod | Faceless → lite path; not clearly worse than prod |
| busy-background | tie | Both weak on crowds |
| anime-character | tie | Cutout lite; clothing ΔE matches prod |
| pet | prefer new (human) / ΔE noisy | Cat colors kept vs prod gray sky |
| logo-transparent | prefer new | Cutout lite |
| pixel-sprite | tie | Both preserve sprite blocks |

### Scripts
- `scripts/gen-real-skins.mjs` — MediaPipe + map (fresh browser per fixture)
- `scripts/base-layer-integrity.mjs` — base-layer void check
- `scripts/clothing-fidelity-check.mjs` — clothing ΔE
- `scripts/render-skin-3d.mjs` — front/back 3D
- `scripts/real-skin-acceptance.mjs` — full Playwright UI flow

Synthetic `contact-*.png` (no `-real-`) are mapping benchmarks only.
