# Skin quality v2 notes

## Local MediaPipe assets
Total **21,899,976 bytes** (about **20.9 MiB**):
- WASM + JS glue: 12,080,331 bytes
- Models (pose / face / selfie / hair / deeplab): 9,818,823 bytes

`deeplab_v3.tflite` loads only when no face is detected. First use pays the download cost; browser cache applies afterward. Images never leave the device.

## Mapping benchmark
Run `pnpm exec tsx scripts/skin-quality-bench.ts`.

It reads every CC0 fixture in `fixtures/`, writes original | v1 | v2 | v2-pixel contact sheets (`contact-*.png`) and per-skin PNGs. On this box (Node 22, Java classic):
- portrait-selfie: ~20 ms
- fullbody-busy: ~29 ms
- logo-transparent: ~8 ms
- pixel-sprite: ~2 ms
- anime-character: ~5 ms
- pet-cat: ~4 ms

These are pure `mapImageToSkin` timings. Browser MediaPipe load time is reported by the `skin_models_load` analytics event.

## UI screenshots
Captured from local Vite against the homepage workspace:
- `ui-result-page.png` — full page with front/back 3D preview
- `ui-generator-workspace.png` — workspace with generated result
- `ui-ai-modal.png` — AI HD waitlist fake door ($2.99)
- `ui-import-guide.png` — Import into Minecraft guide after download

## Fixture licenses
See `fixtures/LICENSES.md` (synthetic CC0 geometry fixtures).
