import { getSkinRegions, type SkinRegion } from './layouts';
import { mapImageToSkin } from './normalize';
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

function copyRegion(
  target: SkinTexture,
  source: SkinTexture,
  region: SkinRegion
) {
  for (let y = 0; y < region.height; y += 1)
    for (let x = 0; x < region.width; x += 1) {
      const ti = textureOffset(region.x + x, region.y + y, target.width);
      const si = textureOffset(region.x + x, region.y + y, source.width);
      target.pixels.set(source.pixels.slice(si, si + 4), ti);
    }
}

/** Map a validated two-panel AI image into a Minecraft skin. The mapped PNG stays in the browser. */
export function mapAiSheetToSkin(
  source: ImageSource,
  model: SkinModel = 'classic'
): { texture: SkinTexture; quality: AiSheetQuality } {
  const [front, back] = splitAiPanels(source);
  const quality = assessAiSheet(front, back);
  const texture = mapImageToSkin(cropToBounds(front), 'java-64', model, {
    kind: 'full-body',
  });
  if (!quality.valid) return { texture, quality };
  const backTexture = mapImageToSkin(cropToBounds(back), 'java-64', model, {
    kind: 'full-body',
  });
  const regions = getSkinRegions('java-64', model);
  const seen = new Map<string, number>();
  for (const region of regions) {
    const index = seen.get(region.part) ?? 0;
    seen.set(region.part, index + 1);
    if (index === 5) copyRegion(texture, backTexture, region);
  }
  return { texture, quality };
}
