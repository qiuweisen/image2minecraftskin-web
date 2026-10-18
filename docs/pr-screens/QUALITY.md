# Skin quality v2 notes

## Local MediaPipe assets
Total **21,899,976 bytes** (about **20.9 MiB**):
- WASM + JS glue: 12,080,331 bytes
- Models (pose / face / selfie / hair / deeplab): 9,818,823 bytes

`deeplab_v3.tflite` loads only when no face is detected. First use pays the download cost; browser cache applies afterward. Images never leave the device.

## Real acceptance (2026-10-18, Asia/Shanghai)

Fixtures: eight Wikimedia Commons photos under `fixtures/real/` (licenses in `fixtures/LICENSES.md`).

Method:
1. Local Vite (`127.0.0.1:3015`) with self-hosted `/mediapipe` models loaded in headless Chromium.
2. Same Playwright upload → wait for “Skin ready” → download PNG flow against production `https://image2minecraftskin.com`.
3. Front/back 3D rendered from each skin PNG via skinview3d (WebGL).
4. Contact sheets: `contact-real-*.png` = original | prod skin | new skin | prod/new front | prod/new back.

### Background leak (primary goal)
| Fixture | Prod sky/foliage in torso/arms | New after fixes |
|---------|--------------------------------|-----------------|
| portrait-selfie (bridge, light-blue dress/sky) | Yes — torso/arms ~sky blue | **No** — scrubbed; head front keeps skin tone |
| half-body (leafy green backdrop) | Yes — green wash on body | **No** green/sky cells in base regions |
| busy-background | Head top sky-blue on prod | New avoids sky; coverage weak (flat fills) |

Fixes that landed on this branch:
- Copy MediaPipe category masks immediately (buffer reuse bug).
- Hole-fill no longer samples DEFAULT_CROPS edges; head top/back use hair tone.
- Face miss on landscape selfies → mid-coverage person mask treated as portrait; face retry on centered square; character limbs use portrait templates.
- Final `isBackgroundLike` scrub (sky + foliage + bright outdoor wash).

### What is still weak (honest)
- **Face detector** still misses some landscape selfies; we compensate with mask-coverage heuristics and scrubbing, not a perfect face box.
- **Head top** often falls back to flat gray (`0x888`) when hair segmenter yields empty bins — no sky, but not photoreal hair either.
- **Back/side faces** remain low-detail (edge strips / solid fills). Side-profile sources (bridge selfie) leave large flat gray areas on the back.
- **Busy crowd / full-body / pet / logo / pixel**: subject cutout and part crops are uneven; results are opaque and non-leaking but often posterized or template-heavy rather than recognizable.
- **Anime**: better than prod holes, still not a faithful character map.
- Synthetic geometry contact sheets (`contact-*.png` without `-real-`) are **not** valid acceptance; keep them only as mapping benchmarks.

### UI screenshots
Captured earlier from local Vite:
- `ui-result-page.png`, `ui-generator-workspace.png`, `ui-ai-modal.png`, `ui-import-guide.png`

### Mapping benchmark (synthetic, Node only)
Run `pnpm exec tsx scripts/skin-quality-bench.ts` for pure `mapImageToSkin` timings (no MediaPipe).

### Scripts
- `scripts/real-skin-acceptance.mjs` — Playwright real UI vs local/prod
- `scripts/render-skin-3d.mjs` — skinview3d front/back from skin PNGs
