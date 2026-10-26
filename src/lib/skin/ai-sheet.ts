import { getSkinRegions, type SkinPart, type SkinRegion } from './layouts';
import { createBlankSkin } from './normalize';
import {
  textureOffset,
  type ImageSource,
  type SkinModel,
  type SkinTexture,
} from './types';

export type AiPanel = ImageSource & {
  bbox: { x: number; y: number; width: number; height: number } | null;
};
export type AiSheetQuality = {
  valid: boolean;
  reason?: 'empty' | 'small' | 'height_mismatch';
};

type Rect = { x: number; y: number; width: number; height: number };
type Face = 'top' | 'bottom' | 'right' | 'front' | 'left' | 'back';
const FACE_ORDER: Face[] = ['top', 'bottom', 'right', 'front', 'left', 'back'];
const EDGE = 0.22;

/** True for the two standard Java UV skin dimensions. */
export function isMinecraftSkinTemplate(source: ImageSource) {
  return (
    (source.width === 64 && source.height === 64) ||
    (source.width === 64 && source.height === 32)
  );
}

function resizeTemplate(source: ImageSource): SkinTexture {
  const pixels = new Uint8ClampedArray(64 * 64 * 4);
  for (let y = 0; y < 64; y += 1)
    for (let x = 0; x < 64; x += 1) {
      const sx = Math.min(
        source.width - 1,
        Math.floor((x / 64) * source.width)
      );
      const sy = Math.min(
        source.height - 1,
        Math.floor((y / 64) * source.height)
      );
      const si = textureOffset(sx, sy, source.width);
      pixels.set(source.pixels.subarray(si, si + 4), textureOffset(x, y, 64));
    }
  return { width: 64, height: 64, pixels, format: 'java-64', model: 'classic' };
}

function pixel(source: ImageSource, x: number, y: number) {
  const i = textureOffset(x, y, source.width);
  return [
    source.pixels[i] ?? 0,
    source.pixels[i + 1] ?? 0,
    source.pixels[i + 2] ?? 0,
    source.pixels[i + 3] ?? 255,
  ] as const;
}

export function removeWhiteBackground(
  source: ImageSource,
  threshold = 245
): ImageSource {
  const pixels = new Uint8ClampedArray(source.pixels);
  for (let i = 0; i < pixels.length; i += 4) {
    if (
      pixels[i]! >= threshold &&
      pixels[i + 1]! >= threshold &&
      pixels[i + 2]! >= threshold
    )
      pixels[i + 3] = 0;
  }
  return { ...source, pixels };
}

export function findSubjectBounds(source: ImageSource) {
  let minX = source.width,
    minY = source.height,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < source.height; y += 1)
    for (let x = 0; x < source.width; x += 1) {
      if (pixel(source, x, y)[3] < 16) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  return maxX < 0
    ? null
    : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function splitAiPanels(source: ImageSource): [AiPanel, AiPanel] {
  const width = Math.floor(source.width / 2);
  const make = (offset: number): AiPanel => {
    const pixels = new Uint8ClampedArray(width * source.height * 4);
    for (let y = 0; y < source.height; y += 1)
      for (let x = 0; x < width; x += 1)
        pixels.set(pixel(source, x + offset, y), textureOffset(x, y, width));
    const clean = removeWhiteBackground({
      width,
      height: source.height,
      pixels,
    });
    const raw = findSubjectBounds(clean);
    return {
      ...clean,
      bbox: raw
        ? {
            x: raw.x / width,
            y: raw.y / source.height,
            width: raw.width / width,
            height: raw.height / source.height,
          }
        : null,
    };
  };
  return [make(0), make(width)];
}

export function assessAiSheet(front: AiPanel, back: AiPanel): AiSheetQuality {
  if (!front.bbox || !back.bbox) return { valid: false, reason: 'empty' };
  if (
    front.bbox.width < 0.08 ||
    back.bbox.width < 0.08 ||
    front.bbox.height < 0.15 ||
    back.bbox.height < 0.15
  )
    return { valid: false, reason: 'small' };
  if (
    Math.abs(front.bbox.height - back.bbox.height) /
      Math.max(front.bbox.height, back.bbox.height) >
    0.15
  )
    return { valid: false, reason: 'height_mismatch' };
  return { valid: true };
}

function cropToBounds(source: AiPanel): ImageSource {
  const b = source.bbox;
  if (!b) return source;
  const x0 = Math.max(0, Math.floor(b.x * source.width));
  const y0 = Math.max(0, Math.floor(b.y * source.height));
  const width = Math.max(
    1,
    Math.min(source.width - x0, Math.ceil(b.width * source.width))
  );
  const height = Math.max(
    1,
    Math.min(source.height - y0, Math.ceil(b.height * source.height))
  );
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1)
    for (let x = 0; x < width; x += 1)
      pixels.set(pixel(source, x + x0, y + y0), textureOffset(x, y, width));
  return { width, height, pixels };
}

/** Steve standing front view: arms at sides. Units relative to subject bbox. */
function stevePartCrop(part: SkinPart, w: number, h: number): Rect {
  // Logical 16×32 grid over the subject.
  const cellX = w / 16;
  const cellY = h / 32;
  switch (part) {
    case 'head':
      return { x: 4 * cellX, y: 0, width: 8 * cellX, height: 8 * cellY };
    case 'torso':
      return {
        x: 4 * cellX,
        y: 8 * cellY,
        width: 8 * cellX,
        height: 12 * cellY,
      };
    case 'right-arm':
      return { x: 0, y: 8 * cellY, width: 4 * cellX, height: 12 * cellY };
    case 'left-arm':
      return {
        x: 12 * cellX,
        y: 8 * cellY,
        width: 4 * cellX,
        height: 12 * cellY,
      };
    case 'right-leg':
      return {
        x: 4 * cellX,
        y: 20 * cellY,
        width: 4 * cellX,
        height: 12 * cellY,
      };
    case 'left-leg':
      return {
        x: 8 * cellX,
        y: 20 * cellY,
        width: 4 * cellX,
        height: 12 * cellY,
      };
  }
}

function faceRect(crop: Rect, face: Face): { rect: Rect; mirror: boolean } {
  const sw = Math.max(1, crop.width * EDGE);
  const sh = Math.max(1, crop.height * EDGE);
  switch (face) {
    case 'front':
      return { rect: crop, mirror: false };
    case 'back':
      return { rect: crop, mirror: true };
    case 'top':
      return { rect: { ...crop, height: sh }, mirror: false };
    case 'bottom':
      return {
        rect: { ...crop, y: crop.y + crop.height - sh, height: sh },
        mirror: false,
      };
    case 'right':
      // Character's right = image left.
      return { rect: { ...crop, width: sw }, mirror: false };
    case 'left':
      return {
        rect: { ...crop, x: crop.x + crop.width - sw, width: sw },
        mirror: false,
      };
  }
}

function sampleNN(
  source: ImageSource,
  rect: Rect,
  u: number,
  v: number,
  mirror: boolean
) {
  const uu = mirror ? 1 - u : u;
  const sx = Math.min(
    source.width - 1,
    Math.max(0, Math.floor(rect.x + uu * Math.max(1, rect.width - 1e-6)))
  );
  const sy = Math.min(
    source.height - 1,
    Math.max(0, Math.floor(rect.y + v * Math.max(1, rect.height - 1e-6)))
  );
  const color = pixel(source, sx, sy);
  // Sheets sit on white; keep leftover near-white from leaking into UV tops.
  if (color[3] < 16 || (color[0] >= 245 && color[1] >= 245 && color[2] >= 245))
    return [0, 0, 0, 0] as const;
  return color;
}

function paintFaceNN(
  texture: SkinTexture,
  source: ImageSource,
  region: SkinRegion,
  rect: Rect,
  mirror: boolean
) {
  for (let y = 0; y < region.height; y += 1)
    for (let x = 0; x < region.width; x += 1) {
      const color = sampleNN(
        source,
        rect,
        (x + 0.5) / region.width,
        (y + 0.5) / region.height,
        mirror
      );
      texture.pixels.set(
        color,
        textureOffset(region.x + x, region.y + y, texture.width)
      );
    }
}

function mapPanelSteve(
  panel: ImageSource,
  model: SkinModel,
  preferBack: boolean
): SkinTexture {
  const texture = createBlankSkin('java-64', model);
  const regions = getSkinRegions('java-64', model);
  const seen = new Map<SkinPart, number>();
  for (const region of regions) {
    const faceIndex = seen.get(region.part) ?? 0;
    seen.set(region.part, faceIndex + 1);
    const face = FACE_ORDER[faceIndex]!;
    // Front panel paints all but the true back face; back panel paints back.
    if (preferBack ? face !== 'back' : face === 'back') continue;
    const crop = stevePartCrop(region.part, panel.width, panel.height);
    const { rect, mirror } = faceRect(crop, face);
    paintFaceNN(texture, panel, region, rect, preferBack ? false : mirror);
  }
  return texture;
}

function copyRegion(
  target: SkinTexture,
  source: SkinTexture,
  region: SkinRegion
) {
  for (let y = 0; y < region.height; y += 1)
    for (let x = 0; x < region.width; x += 1) {
      const ti = textureOffset(region.x + x, region.y + y, target.width);
      const si = textureOffset(region.x + x, region.y + y, source.width);
      target.pixels.set(source.pixels.subarray(si, si + 4), ti);
    }
}

/** Copy opaque base pixels into the matching outer-layer UV for volume. */
function paintOuterVolume(texture: SkinTexture, model: SkinModel) {
  const base = getSkinRegions('java-64', model, 'base');
  const outer = getSkinRegions('java-64', model, 'outer');
  for (let i = 0; i < base.length; i += 1) {
    const src = base[i]!;
    const dst = outer[i]!;
    // Prefer head + torso + upper arms for readable outer volume.
    if (
      src.part !== 'head' &&
      src.part !== 'torso' &&
      src.part !== 'right-arm' &&
      src.part !== 'left-arm'
    )
      continue;
    for (let y = 0; y < dst.height; y += 1)
      for (let x = 0; x < dst.width; x += 1) {
        const si = textureOffset(src.x + x, src.y + y, texture.width);
        const a = texture.pixels[si + 3] ?? 0;
        const r = texture.pixels[si] ?? 0;
        const g = texture.pixels[si + 1] ?? 0;
        const b = texture.pixels[si + 2] ?? 0;
        if (a < 16 || (r >= 245 && g >= 245 && b >= 245)) continue;
        const di = textureOffset(dst.x + x, dst.y + y, texture.width);
        texture.pixels[di] = r;
        texture.pixels[di + 1] = g;
        texture.pixels[di + 2] = b;
        // Slightly translucent so base still reads under outer.
        texture.pixels[di + 3] = Math.min(255, Math.round(a * 0.92));
      }
  }
}

/** Map a validated two-panel AI image into a Minecraft skin. The mapped PNG stays in the browser. */
export function mapAiSheetToSkin(
  source: ImageSource,
  model: SkinModel = 'classic'
): { texture: SkinTexture; quality: AiSheetQuality } {
  if (isMinecraftSkinTemplate(source))
    return { texture: resizeTemplate(source), quality: { valid: true } };

  const [front, back] = splitAiPanels(source);
  const quality = assessAiSheet(front, back);
  const frontCrop = cropToBounds(front);
  const texture = mapPanelSteve(frontCrop, model, false);
  if (!quality.valid) {
    paintOuterVolume(texture, model);
    return { texture, quality };
  }
  const backTexture = mapPanelSteve(cropToBounds(back), model, true);
  const regions = getSkinRegions('java-64', model);
  const seen = new Map<string, number>();
  for (const region of regions) {
    const index = seen.get(region.part) ?? 0;
    seen.set(region.part, index + 1);
    if (index === 5) copyRegion(texture, backTexture, region); // back faces
  }
  paintOuterVolume(texture, model);
  return { texture, quality };
}
