import type { ImageSource } from './types';
import {
  normalizeSourceTransform,
  type SourceTransform,
} from './source-transform';

const WASM_ROOT =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

type PoseLandmarkerInstance = {
  detect: (image: ImageBitmap) => {
    landmarks?: Array<Array<{ x: number; y: number; visibility?: number }>>;
  };
  close?: () => void;
};

let landmarkerPromise: Promise<PoseLandmarkerInstance> | undefined;

async function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = import('@mediapipe/tasks-vision').then(
      async ({ FilesetResolver, PoseLandmarker }) => {
        const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
        return PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'IMAGE',
          numPoses: 1,
        });
      }
    );
  }
  return landmarkerPromise;
}

async function sourceToBitmap(source: ImageSource) {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  context.putImageData(
    new ImageData(source.pixels, source.width, source.height),
    0,
    0
  );
  return createImageBitmap(canvas);
}

export async function recommendAiSourceTransform(
  source: ImageSource
): Promise<SourceTransform> {
  const bitmap = await sourceToBitmap(source);
  try {
    const result = (await getLandmarker()).detect(bitmap);
    const pose = result.landmarks?.[0];
    if (!pose) throw new Error('No person detected');

    const points = [0, 11, 12, 23, 24, 25, 26, 27, 28]
      .map((index) => pose[index])
      .filter((point) => point && (point.visibility ?? 1) >= 0.35);
    if (points.length < 5) throw new Error('Insufficient pose landmarks');

    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    const subjectWidth = Math.max(0.01, maxX - minX);
    const subjectHeight = Math.max(0.01, maxY - minY);
    const zoom = Math.min(
      2.5,
      Math.max(
        1,
        Math.min(1 / (subjectWidth * 1.18), 1 / (subjectHeight * 1.12))
      )
    );
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const maxOffsetX = (1 - 1 / zoom) / 2;
    const maxOffsetY = (1 - 1 / zoom) / 2;

    return normalizeSourceTransform({
      x: maxOffsetX ? (centerX - 0.5) / maxOffsetX : 0,
      y: maxOffsetY ? (centerY - 0.5) / maxOffsetY : 0,
      zoom,
    });
  } finally {
    bitmap.close();
  }
}
