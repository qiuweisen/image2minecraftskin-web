import type { ImageSource } from './types';
import type { PartCrops } from './normalize';

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
  const segmentation = segmenter.segment(canvas);
  const detection = detector.detect(canvas);
  const poseResult = poseLandmarker.detect(canvas);
  const hairResult = hairSegmenter.segment(canvas);
  const category = segmentation.categoryMask?.getAsUint8Array();
  const face = detection.detections[0]?.boundingBox;
  const pose = poseResult.landmarks?.[0];
  const poseCrops = pose
    ? (await import('./ai-improve')).derivePartCrops(
        pose,
        source.width,
        source.height
      )
    : undefined;
  const hair = hairResult.categoryMask?.getAsUint8Array();
  let finalMask = category;
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
      finalMask =
        (await deeplabPromise)
          .segment(canvas)
          .categoryMask?.getAsUint8Array() ?? category;
    } catch {
      finalMask = category;
    }
  }
  onProgress?.(100);
  return {
    kind: face
      ? source.height > source.width * 1.35
        ? 'full-body'
        : 'portrait'
      : 'character',
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
    ...(hair ? { hairMask: hair } : {}),
    ...(poseCrops ? { poseCrops } : {}),
    loadMs: Math.round(performance.now() - started),
  };
}
