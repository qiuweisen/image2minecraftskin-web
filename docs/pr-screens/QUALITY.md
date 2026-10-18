# Skin quality v2 notes

Run `pnpm exec tsx scripts/skin-quality-bench.ts` for the deterministic synthetic-input mapping timing check. It exercises the real `mapImageToSkin` implementation without uploading or fetching images.

Local MediaPipe assets currently total **17,297,261 bytes** (about **16.5 MiB**): WASM 11,756,954 bytes, JS glue 323,377 bytes, and the five model files 5,216,930 bytes. This is a first-use download cost; browser caching applies afterward.

The checked-in benchmark is synthetic and is not a perceptual-quality comparison or proof of model accuracy. Comparative licensed-image contact sheets and browser screenshots remain to be captured before release review.
