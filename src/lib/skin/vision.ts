import type { ImageSource } from './types';
import type { PartCrops } from './normalize';


/** Ensure mask is width*height bytes; treat as person=nonzero. */
function normalizePersonMask(
  raw: Uint8Array | undefined,
  width: number,
  height: number,
  personCategories?: Set<number>
): Uint8Array | undefined {
  if (!raw || raw.length === 0) return undefined;
  const expected = width * height;
  let src = raw;
  if (raw.length !== expected) {
    // MediaPipe occasionally returns model-resolution masks; nearest upsample.
    const side = Math.round(Math.sqrt(raw.length));
    if (side * side !== raw.length) return undefined;
    const scaled = new Uint8Array(expected);
    for (let y = 0; y < height; y++) {
      const sy = Math.min(side - 1, Math.floor((y / height) * side));
      for (let x = 0; x < width; x++) {
        const sx = Math.min(side - 1, Math.floor((x / width) * side));
        scaled[y * width + x] = raw[sy * side + sx] ?? 0;
      }
    }
    src = scaled;
  }
  const out = new Uint8Array(expected);
  let subject = 0;
  for (let i = 0; i < expected; i++) {
    const v = src[i] ?? 0;
    const isPerson = personCategories
      ? personCategories.has(v)
      : v > 0;
    out[i] = isPerson ? 1 : 0;
    if (isPerson) subject += 1;
  }
  // Corner heuristic: if three of four corners look like "person", polarity
  // is likely inverted (seen on some selfie category dumps).
  const corners = [
    out[0],
    out[width - 1],
    out[(height - 1) * width],
    out[height * width - 1],
  ];
  const cornerSubject = corners.filter((c) => c > 0).length;
  if (cornerSubject >= 3 && subject > expected * 0.55) {
    for (let i = 0; i < expected; i++) out[i] = out[i] ? 0 : 1;
  }
  return out;
}

export type VisionAnalysis = {
  kind: 'portrait' | 'full-body' | 'character' | 'animal' | 'logo';
  faceFound: boolean;
  face?: { x: number; y: number; width: number; height: number };
  poseCrops?: PartCrops;
  mask?: Uint8Array;
  hairMask?: Uint8Array;
  loadMs: number;
};
let segmenterPromise:
  | Promise<import('@mediapipe/tasks-vision').ImageSegmenter>
  | undefined;
let detectorPromise:
  | Promise<import('@mediapipe/tasks-vision').FaceDetector>
  | undefined;
let posePromise:
  | Promise<import('@mediapipe/tasks-vision').PoseLandmarker>
  | undefined;
let hairPromise:
  | Promise<import('@mediapipe/tasks-vision').ImageSegmenter>
  | undefined;
let deeplabPromise:
  | Promise<import('@mediapipe/tasks-vision').ImageSegmenter>
  | undefined;

async function loadVision() {
  const { FilesetResolver, ImageSegmenter, FaceDetector, PoseLandmarker } =
    await import('@mediapipe/tasks-vision');
  const files = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
  segmenterPromise ??= ImageSegmenter.createFromOptions(files, {
    baseOptions: {
      modelAssetPath: '/mediapipe/models/selfie_segmenter.tflite',
    },
    runningMode: 'IMAGE',
    outputCategoryMask: true,
  });
  detectorPromise ??= FaceDetector.createFromOptions(files, {
    baseOptions: {
      modelAssetPath: '/mediapipe/models/blaze_face_short_range.tflite',
    },
    runningMode: 'IMAGE',
  });
  posePromise ??= PoseLandmarker.createFromOptions(files, {
    baseOptions: {
      modelAssetPath: '/mediapipe/models/pose_landmarker_lite.task',
    },
    runningMode: 'IMAGE',
    numPoses: 1,
  });
  hairPromise ??= ImageSegmenter.createFromOptions(files, {
    baseOptions: { modelAssetPath: '/mediapipe/models/hair_segmenter.tflite' },
    runningMode: 'IMAGE',
    outputCategoryMask: true,
  });
  return Promise.all([
    segmenterPromise,
    detectorPromise,
    posePromise,
    hairPromise,
  ]);
}

export async function analyzeSource(
  source: ImageSource,
  onProgress?: (percent: number) => void
): Promise<VisionAnalysis> {
  const started = performance.now();
  onProgress?.(10);
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas_unavailable');
  const image = context.createImageData(source.width, source.height);
  image.data.set(source.pixels);
  context.putImageData(image, 0, 0);
  const [segmenter, detector, poseLandmarker, hairSegmenter] =
    await loadVision();
  onProgress?.(70);
  // Copy mask bytes immediately — MediaPipe reuses backing buffers on the
  // next inference, so a deferred getAsUint8Array() can read garbage/zeros.
  const segmentation = segmenter.segment(canvas);
  const categoryRaw = segmentation.categoryMask
    ? Uint8Array.from(segmentation.categoryMask.getAsUint8Array())
    : undefined;
  segmentation.categoryMask?.close?.();
  let detection = detector.detect(canvas);
  // Short-range blaze face misses some landscape selfies at full res; retry
  // on a centered square downscale when the first pass finds nothing.
  if (!detection.detections[0]) {
    const side = Math.min(source.width, source.height);
    const sx = Math.floor((source.width - side) / 2);
    const sy = Math.floor((source.height - side) / 2);
    const small = document.createElement('canvas');
    small.width = 256;
    small.height = 256;
    const sctx = small.getContext('2d');
    if (sctx) {
      sctx.drawImage(canvas, sx, sy, side, side, 0, 0, 256, 256);
      const retry = detector.detect(small);
      if (retry.detections[0]?.boundingBox) {
        const box = retry.detections[0].boundingBox;
        detection = {
          ...retry,
          detections: [
            {
              ...retry.detections[0],
              boundingBox: {
                ...box,
                originX: sx + (box.originX / 256) * side,
                originY: sy + (box.originY / 256) * side,
                width: (box.width / 256) * side,
                height: (box.height / 256) * side,
              },
            },
            ...retry.detections.slice(1),
          ],
        };
      }
    }
  }
  const poseResult = poseLandmarker.detect(canvas);
  const hairResult = hairSegmenter.segment(canvas);
  const hairRaw = hairResult.categoryMask
    ? Uint8Array.from(hairResult.categoryMask.getAsUint8Array())
    : undefined;
  hairResult.categoryMask?.close?.();
  const face = detection.detections[0]?.boundingBox;
  const pose = poseResult.landmarks?.[0];
  const poseCrops = pose
    ? (await import('./ai-improve')).derivePartCrops(
        pose,
        source.width,
        source.height
      )
    : undefined;
  let finalMask = normalizePersonMask(categoryRaw, source.width, source.height);
  if (!face) {
    deeplabPromise ??= (async () => {
      const { FilesetResolver, ImageSegmenter } = await import(
        '@mediapipe/tasks-vision'
      );
      const files = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
      return ImageSegmenter.createFromOptions(files, {
        baseOptions: { modelAssetPath: '/mediapipe/models/deeplab_v3.tflite' },
        runningMode: 'IMAGE',
        outputCategoryMask: true,
      });
    })();
    try {
      const deeplabResult = (await deeplabPromise).segment(canvas);
      const deeplabRaw = deeplabResult.categoryMask
        ? Uint8Array.from(deeplabResult.categoryMask.getAsUint8Array())
        : undefined;
      deeplabResult.categoryMask?.close?.();
      // PASCAL VOC: 15 = person. Do not keep sky/ground as "subject".
      finalMask =
        normalizePersonMask(
          deeplabRaw,
          source.width,
          source.height,
          new Set([15])
        ) ?? finalMask;
    } catch {
      /* keep selfie mask */
    }
  }
  const hairMask = normalizePersonMask(hairRaw, source.width, source.height);
  onProgress?.(100);
  const maskCoverage = finalMask
    ? finalMask.reduce((n, v) => n + (v > 0 ? 1 : 0), 0) / finalMask.length
    : 0;
  // Selfie segmenter hit without a face box: still treat as portrait so limb
  // templates run (landscape bridge selfies often miss blaze-face).
  const kind = face
    ? source.height > source.width * 1.35
      ? 'full-body'
      : 'portrait'
    : maskCoverage > 0.04 && maskCoverage < 0.55
      ? 'portrait'
      : 'character';
  return {
    kind,
    faceFound: Boolean(face),
    ...(face
      ? {
          face: {
            x: face.originX / source.width,
            y: face.originY / source.height,
            width: face.width / source.width,
            height: face.height / source.height,
          },
        }
      : {}),
    ...(finalMask ? { mask: finalMask } : {}),
    ...(hairMask ? { hairMask } : {}),
    ...(poseCrops ? { poseCrops } : {}),
    loadMs: Math.round(performance.now() - started),
  };
}
