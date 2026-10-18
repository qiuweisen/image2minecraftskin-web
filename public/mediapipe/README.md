# Self-hosted MediaPipe assets

Served from `/mediapipe/` so the skin generator never loads models or wasm from a third-party CDN at runtime.

| Path | Source | Notes |
|------|--------|-------|
| `wasm/vision_wasm_internal.{js,wasm}` | `@mediapipe/tasks-vision@1.0.1` npm package | Primary SIMD build |
| `models/pose_landmarker_lite.task` | Google MediaPipe model zoo | Pose crops |
| `models/blaze_face_short_range.tflite` | Google MediaPipe model zoo | Face box |
| `models/selfie_segmenter.tflite` | Google MediaPipe model zoo | Person cutout |
| `models/hair_segmenter.tflite` | Google MediaPipe model zoo | Hair color for head top/back |
| `models/deeplab_v3.tflite` | Google MediaPipe model zoo | Fallback subject cutout when no person |

Images never leave the device. Models are lazy-loaded on first generation.
