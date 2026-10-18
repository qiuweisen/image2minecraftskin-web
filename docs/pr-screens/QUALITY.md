# Skin quality v2 notes

Run `pnpm exec tsx scripts/skin-quality-bench.ts` for the deterministic synthetic-input mapping timing check. It exercises the real `mapImageToSkin` implementation without uploading or fetching images.

Local MediaPipe assets currently total **17,297,261 bytes** (about **16.5 MiB**): WASM 11,756,954 bytes, JS glue 323,377 bytes, and the five model files 5,216,930 bytes. This is a first-use download cost; browser caching applies afterward.

The checked-in benchmark now reads every CC0 fixture in `fixtures/`, writes original/v1/v2/v2-pixel nearest-neighbour contact sheets, and emits per-skin PNGs. On the local Node 22 runner (Java classic, photo + pixel), the six fixtures completed in 2–31 ms each: portrait 22 ms, full-body 31 ms, transparent logo 8 ms, pixel sprite 2 ms, anime character 6 ms, and pet 5 ms. These are mapping timings only; MediaPipe model load is browser/device dependent and is reported by the `skin_models_load` event.

The checked-in MediaPipe assets currently total **17,297,261 bytes** (about **16.5 MiB**): WASM 11,756,954 bytes, JS glue 323,377 bytes, and five model files 5,216,930 bytes. `deeplab_v3.tflite` is loaded only when no face is detected. The benchmark is deterministic and not a perceptual-quality proof.

## UI screenshots

Captured from local Vite against the homepage generator (`#generator`):

- `ui-result-page.png` — full page with front/back 3D preview
- `ui-generator-workspace.png` — workspace crop
- `ui-ai-modal.png` — AI HD waitlist fake door
- `ui-import-guide.png` — Import into Minecraft guide after download
