import type { ImageSource } from './types';
import type { PartBounds, PartCrops } from './normalize';
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

type Landmark = { x: number; y: number; visibility?: number };

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

const MIN_VISIBILITY = 0.35;

// MediaPipe pose indices. "Right" is the subject's right, which appears on
// the image's left for a front-facing photo, matching the default crops.
const NOSE = 0;
const L_SHOULDER = 11;
const R_SHOULDER = 12;
const L_ELBOW = 13;
const R_ELBOW = 14;
const L_WRIST = 15;
const R_WRIST = 16;
const L_HIP = 23;
const R_HIP = 24;
const L_KNEE = 25;
const R_KNEE = 26;
const L_ANKLE = 27;
const R_ANKLE = 28;

type Point = { x: number; y: number };

/** Pixel-space box → normalized crop, clamped to the image. */
function toBounds(
  cx: number,
  top: number,
  halfWidth: number,
  bottom: number,
  width: number,
  height: number
): PartBounds | undefined {
  const x0 = Math.max(0, cx - halfWidth);
  const x1 = Math.min(width, cx + halfWidth);
  const y0 = Math.max(0, top);
  const y1 = Math.min(height, bottom);
  if (x1 - x0 < 1 || y1 - y0 < 1) return undefined;
  return {
    x: x0 / width,
    y: y0 / height,
    width: (x1 - x0) / width,
    height: (y1 - y0) / height,
  };
}

/**
 * Builds per-part crops from pose landmarks. Raw landmark bounding boxes are
 * unusable on their own (face landmarks only span eyes-to-mouth, a hanging
 * arm's joints are almost collinear), so each part is sized from shoulder
 * and hip width. Returns undefined when both shoulders are not visible.
 */
export function derivePartCrops(
  pose: Landmark[],
  width: number,
  height: number
): PartCrops | undefined {
  const point = (index: number): Point | undefined => {
    const landmark = pose[index];
    if (!landmark || (landmark.visibility ?? 1) < MIN_VISIBILITY) return;
    return { x: landmark.x * width, y: landmark.y * height };
  };
  const ls = point(L_SHOULDER);
  const rs = point(R_SHOULDER);
  if (!ls || !rs) return undefined;

  const shoulderWidth = Math.abs(ls.x - rs.x);
  if (shoulderWidth < 4) return undefined;
  const shoulderY = (ls.y + rs.y) / 2;
  const shoulderMidX = (ls.x + rs.x) / 2;

  const lh = point(L_HIP);
  const rh = point(R_HIP);
  const hasHips = Boolean(lh && rh);
  const hipY = hasHips
    ? ((lh as Point).y + (rh as Point).y) / 2
    : shoulderY + shoulderWidth * 1.3;
  const hipWidth = hasHips
    ? Math.max(shoulderWidth * 0.6, Math.abs((lh as Point).x - (rh as Point).x))
    : shoulderWidth * 0.8;
  const hipMidX = hasHips
    ? ((lh as Point).x + (rh as Point).x) / 2
    : shoulderMidX;

  const crops: PartCrops = {};

  // Head: square, sized from shoulders, centered on the nose when visible.
  const headSide = shoulderWidth * 0.62;
  const nose = point(NOSE);
  const headCx = nose?.x ?? shoulderMidX;
  const headBottom = nose
    ? Math.min(shoulderY, nose.y + headSide * 0.45)
    : shoulderY;
  crops.head = toBounds(
    headCx,
    headBottom - headSide,
    headSide / 2,
    headBottom,
    width,
    height
  );

  crops.torso = toBounds(
    shoulderMidX,
    shoulderY,
    shoulderWidth / 2,
    hipY,
    width,
    height
  );

  const armHalf = shoulderWidth * 0.14;
  const arm = (shoulder: Point, elbow?: Point, wrist?: Point) => {
    const joints = [shoulder, elbow, wrist].filter(Boolean) as Point[];
    const end = wrist ?? elbow;
    const bottom = end ? Math.max(end.y, shoulderY + 1) : hipY;
    // Center on the limb, but keep the crop outside the torso edge.
    const cx = joints.reduce((sum, joint) => sum + joint.x, 0) / joints.length;
    return toBounds(cx, shoulderY, armHalf, bottom, width, height);
  };
  crops['right-arm'] = arm(rs, point(R_ELBOW), point(R_WRIST));
  crops['left-arm'] = arm(ls, point(L_ELBOW), point(L_WRIST));

  if (hasHips) {
    const legHalf = hipWidth / 4;
    const leg = (hip: Point, knee?: Point, ankle?: Point) => {
      const end = ankle ?? knee;
      const bottom = end ? end.y : height;
      const joints = [hip, knee, ankle].filter(Boolean) as Point[];
      const cx =
        joints.reduce((sum, joint) => sum + joint.x, 0) / joints.length;
      return toBounds(cx, hipY, legHalf, bottom, width, height);
    };
    crops['right-leg'] = leg(rh as Point, point(R_KNEE), point(R_ANKLE));
    crops['left-leg'] = leg(lh as Point, point(L_KNEE), point(L_ANKLE));
  } else {
    // Waist-up photo: split the space below the torso so legs stay consistent.
    const legHalf = hipWidth / 4;
    crops['right-leg'] = toBounds(
      hipMidX - legHalf,
      hipY,
      legHalf,
      height,
      width,
      height
    );
    crops['left-leg'] = toBounds(
      hipMidX + legHalf,
      hipY,
      legHalf,
      height,
      width,
      height
    );
  }

  return crops;
}

/**
 * Runs pose detection and returns per-part crops, or undefined if no person
 * was found. Loads MediaPipe lazily from a CDN on first use.
 */
export async function detectPartCrops(
  source: ImageSource
): Promise<PartCrops | undefined> {
  const bitmap = await sourceToBitmap(source);
  try {
    const pose = (await getLandmarker()).detect(bitmap).landmarks?.[0];
    return pose
      ? derivePartCrops(pose, source.width, source.height)
      : undefined;
  } finally {
    bitmap.close();
  }
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
