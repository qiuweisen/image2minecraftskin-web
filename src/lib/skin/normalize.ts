import {
  SKIN_DIMENSIONS,
  type ImageSource,
  type SkinFormat,
  type SkinModel,
  type SkinTexture,
  textureOffset,
} from './types';
import { getSkinRegions, type SkinPart, type SkinRegion } from './layouts';

/** Normalized (0-1) crop rectangle inside the source image. */
export type PartBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Optional per-part crops, e.g. from pose detection. */
export type PartCrops = Partial<Record<SkinPart, PartBounds>>;

// Max samples per axis for one target pixel. Bounds cost on large photos.
const MAX_SAMPLES_PER_AXIS = 6;
const ALPHA_CUTOFF = 16;

const DEFAULT_CROPS: Record<SkinPart, PartBounds> = {
  head: { x: 0.2, y: 0, width: 0.6, height: 0.34 },
  torso: { x: 0.24, y: 0.33, width: 0.52, height: 0.38 },
  'right-arm': { x: 0, y: 0.33, width: 0.28, height: 0.38 },
  'left-arm': { x: 0.72, y: 0.33, width: 0.28, height: 0.38 },
  'right-leg': { x: 0.24, y: 0.66, width: 0.28, height: 0.34 },
  'left-leg': { x: 0.48, y: 0.66, width: 0.28, height: 0.34 },
};

export function createBlankSkin(
  format: SkinFormat,
  model: SkinModel = 'classic'
): SkinTexture {
  const size = SKIN_DIMENSIONS[format];
  return {
    width: size,
    height: size,
    pixels: new Uint8ClampedArray(size * size * 4),
    format,
    model,
  };
}

/**
 * Averages the source rectangle [x0,x1) x [y0,y1) with a bounded stratified
 * grid. Colour is alpha-weighted so transparent background pixels do not
 * bleed dark/white fringes into the subject. Output is straight (non
 * premultiplied) RGBA, matching PNG.
 */
function sampleArea(
  source: ImageSource,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): [number, number, number, number] {
  const spanX = Math.max(1e-6, x1 - x0);
  const spanY = Math.max(1e-6, y1 - y0);
  const stepsX = Math.min(MAX_SAMPLES_PER_AXIS, Math.max(1, Math.ceil(spanX)));
  const stepsY = Math.min(MAX_SAMPLES_PER_AXIS, Math.max(1, Math.ceil(spanY)));
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (let j = 0; j < stepsY; j += 1) {
    const sy = Math.min(
      source.height - 1,
      Math.max(0, Math.floor(y0 + ((j + 0.5) / stepsY) * spanY))
    );
    for (let i = 0; i < stepsX; i += 1) {
      const sx = Math.min(
        source.width - 1,
        Math.max(0, Math.floor(x0 + ((i + 0.5) / stepsX) * spanX))
      );
      const offset = textureOffset(sx, sy, source.width);
      const alpha = source.pixels[offset + 3] ?? 255;
      r += (source.pixels[offset] ?? 0) * alpha;
      g += (source.pixels[offset + 1] ?? 0) * alpha;
      b += (source.pixels[offset + 2] ?? 0) * alpha;
      a += alpha;
    }
  }
  const count = stepsX * stepsY;
  const meanAlpha = a / count;
  if (meanAlpha < ALPHA_CUTOFF || a === 0) return [0, 0, 0, 0];
  return [
    Math.round(r / a),
    Math.round(g / a),
    Math.round(b / a),
    Math.round(meanAlpha),
  ];
}

type Rect = { x: number; y: number; width: number; height: number };

// Every part is laid out as six faces in this order (see layouts.ts).
type Face = 'top' | 'bottom' | 'right' | 'front' | 'left' | 'back';
const FACE_ORDER: Face[] = ['top', 'bottom', 'right', 'front', 'left', 'back'];

// Fraction of the front crop used for faces a single photo can't see.
const EDGE_STRIP = 0.2;

/**
 * A photo only shows the front. Instead of repeating the front crop on
 * every face (which put the face on the back and top of the head), each
 * hidden face samples the adjacent edge of the front crop: the top strip for
 * the top (hair on the head), the outer columns for the sides, and so on.
 */
function faceCrop(
  crop: Rect,
  face: Face,
  part: SkinPart
): { rect: Rect; mirror: boolean } {
  const stripW = crop.width * EDGE_STRIP;
  const stripH = crop.height * EDGE_STRIP;
  switch (face) {
    case 'front':
      return { rect: crop, mirror: false };
    case 'top':
      return { rect: { ...crop, height: stripH }, mirror: false };
    case 'bottom':
      return {
        rect: { ...crop, y: crop.y + crop.height - stripH, height: stripH },
        mirror: false,
      };
    case 'right':
      // Subject's right side is on the image's left edge.
      return { rect: { ...crop, width: stripW }, mirror: false };
    case 'left':
      return {
        rect: { ...crop, x: crop.x + crop.width - stripW, width: stripW },
        mirror: false,
      };
    case 'back':
      // Head: the back of a head is hair, so reuse the top band.
      // Body and limbs: mirror the front so clothing wraps continuously.
      return part === 'head'
        ? {
            rect: { ...crop, height: crop.height * 0.3 },
            mirror: false,
          }
        : { rect: crop, mirror: true };
  }
}

function paintRegion(
  texture: SkinTexture,
  source: ImageSource,
  region: SkinRegion,
  crop: Rect,
  mirror = false
) {
  const cellWidth = crop.width / region.width;
  const cellHeight = crop.height / region.height;
  for (let y = 0; y < region.height; y += 1) {
    for (let x = 0; x < region.width; x += 1) {
      const sx = mirror ? region.width - 1 - x : x;
      const color = sampleArea(
        source,
        crop.x + sx * cellWidth,
        crop.y + y * cellHeight,
        crop.x + (sx + 1) * cellWidth,
        crop.y + (y + 1) * cellHeight
      );
      const offset = textureOffset(region.x + x, region.y + y, texture.width);
      texture.pixels.set(color, offset);
    }
  }
}

function sourceCrop(source: ImageSource, part: SkinPart, crops?: PartCrops) {
  const crop = crops?.[part] ?? DEFAULT_CROPS[part];
  return {
    x: source.width * crop.x,
    y: source.height * crop.y,
    width: Math.max(1, source.width * crop.width),
    height: Math.max(1, source.height * crop.height),
  };
}

export function mapImageToSkin(
  source: ImageSource,
  format: SkinFormat,
  model: SkinModel = 'classic',
  crops?: PartCrops
): SkinTexture {
  if (source.width < 1 || source.height < 1) {
    throw new Error('Image source must have positive dimensions');
  }
  const texture = createBlankSkin(format, model);
  const regions = getSkinRegions(format, model);
  regions.forEach((region, index) => {
    const face = FACE_ORDER[index % FACE_ORDER.length];
    const { rect, mirror } = faceCrop(
      sourceCrop(source, region.part, crops),
      face,
      region.part
    );
    paintRegion(texture, source, region, rect, mirror);
  });
  return texture;
}

/**
 * Resizes a finished skin between Java and Bedrock sizes. Nearest-neighbour
 * on purpose: skins are pixel art, and filtering would blur face seams and
 * bleed into transparent overlay areas.
 */
export function scaleSkinTexture(
  texture: SkinTexture,
  format: SkinFormat,
  model = texture.model
): SkinTexture {
  const targetSize = SKIN_DIMENSIONS[format];
  if (texture.width === targetSize && texture.height === targetSize) {
    return { ...texture, format, model };
  }
  const pixels = new Uint8ClampedArray(targetSize * targetSize * 4);
  for (let y = 0; y < targetSize; y += 1) {
    for (let x = 0; x < targetSize; x += 1) {
      const sx = Math.floor((x / targetSize) * texture.width);
      const sy = Math.floor((y / targetSize) * texture.height);
      const sourceOffset = textureOffset(sx, sy, texture.width);
      pixels.set(
        texture.pixels.subarray(sourceOffset, sourceOffset + 4),
        textureOffset(x, y, targetSize)
      );
    }
  }
  return { width: targetSize, height: targetSize, pixels, format, model };
}
