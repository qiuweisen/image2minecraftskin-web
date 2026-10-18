# Skin quality v2 notes

## Local MediaPipe assets
Total **21,899,976 bytes** (about **20.9 MiB**):
- WASM + JS glue: 12,080,331 bytes
- Models (pose / face / selfie / hair / deeplab): 9,818,823 bytes

Images never leave the device.

## Real acceptance (2026-10-18, Asia/Shanghai) — fidelity pass

Fixtures: `fixtures/real/` + `fixtures/LICENSES.md` (Commons CC0/CC-BY/CC-BY-SA/PD).

Method: Playwright UI on local Vite (`:3015`) with self-hosted models, same flow on production, skinview3d front/back, contact sheets `contact-real-*.png`.

Automatic clothing check: `node scripts/clothing-fidelity-check.mjs` (photo mid-body dominant vs skin torso front, CIE76 ΔE). People fixtures must not be worse than prod; results in `clothing-fidelity.json`.

### Per-fixture verdict (human glance + ΔE)

| Fixture | Verdict | Notes |
|---------|---------|--------|
| portrait-selfie | **prefer new** | Blue dress restored (was cream/gray). Head top cleaner than prod (less sky leak). ΔE tie with prod on torso blue. |
| half-body | **prefer new** | Less green foliage wash than prod; subject browns kept. ΔE new better. |
| full-body | **prefer prod** | Statue niche still hard; new flattens limbs more. Metric noisy (stone/teal). |
| busy-background | **tie** | Both weak on crowds; no sky leak advantage clear. |
| anime-character | **tie** (lean prod detail) | Gated to cutout/lite path; clothing ΔE matches prod. Prod keeps slightly more face/hair texture. |
| pet | **prefer prod** | Fur mapping still weaker on new. |
| logo-transparent | **prefer new** | Cutout lite path; logo blue ΔE better than prod. |
| pixel-sprite | **tie** | Both preserve white/sprite blocks. |

### What changed after the fidelity regression
- Stopped treating blue clothing as sky; masked dominant colors trusted.
- Removed final color scrub that wiped dresses into cream.
- Structural `paintTemplate` no longer overwrites photo-sampled people torsos.
- Back faces mirror front colors (not flat gray).
- **Gates:** transparent cutouts (anime/logo/pixel) and faceless non-photo `character` use a lite/prod-like path (opacity fill only). Selfie masks only when face or strong selfie portrait coverage.

### Still weak
- Full-body statues / busy crowds / pets: recognition limited.
- Faceless landscape selfies: blaze-face often misses; rely on selfie mask heuristics.
- Hair top can still be flat cream when hair segmenter is empty.
- Synthetic `contact-*.png` (no `-real-`) are mapping benchmarks only — not acceptance.

### Scripts
- `scripts/real-skin-acceptance.mjs` — Playwright local/prod
- `scripts/render-skin-3d.mjs` — 3D front/back
- `scripts/clothing-fidelity-check.mjs` — ΔE clothing harness
