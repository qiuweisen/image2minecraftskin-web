import type { ImageSource } from './types';

export type VisionAnalysis = {
  kind: 'portrait' | 'full-body' | 'character' | 'animal' | 'logo';
  faceFound: boolean;
  face?: { x: number; y: number; width: number; height: number };
  poseCrops?: undefined;
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

async function loadVision() {
  const { FilesetResolver, ImageSegmenter, FaceDetector } = await import(
    '@mediapipe/tasks-vision'
  );
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
  return Promise.all([segmenterPromise, detectorPromise]);
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
  const [segmenter, detector] = await loadVision();
  onProgress?.(70);
  const segmentation = segmenter.segment(canvas);
  const detection = detector.detect(canvas);
  const category = segmentation.categoryMask?.getAsUint8Array();
  const face = detection.detections[0]?.boundingBox;
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
    ...(category ? { mask: category } : {}),
    loadMs: Math.round(performance.now() - started),
  };
}
