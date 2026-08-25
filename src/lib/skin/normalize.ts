import {
  SKIN_DIMENSIONS,
  type ImageSource,
  type SkinFormat,
  type SkinModel,
  type SkinTexture,
  textureOffset,
} from './types';
import { getSkinRegions, type SkinPart, type SkinRegion } from './layouts';

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

function sample(source: ImageSource, x: number, y: number) {
  const sx = Math.min(source.width - 1, Math.max(0, Math.floor(x)));
  const sy = Math.min(source.height - 1, Math.max(0, Math.floor(y)));
  const offset = textureOffset(sx, sy, source.width);
  return [
    source.pixels[offset] ?? 0,
    source.pixels[offset + 1] ?? 0,
    source.pixels[offset + 2] ?? 0,
    source.pixels[offset + 3] ?? 255,
  ];
}

function paintRegion(
  texture: SkinTexture,
  source: ImageSource,
  region: SkinRegion,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number
) {
  for (let y = 0; y < region.height; y += 1) {
    for (let x = 0; x < region.width; x += 1) {
      const color = sample(
        source,
        sourceX + (x / Math.max(1, region.width - 1)) * (sourceWidth - 1),
        sourceY + (y / Math.max(1, region.height - 1)) * (sourceHeight - 1)
      );
      const offset = textureOffset(region.x + x, region.y + y, texture.width);
      texture.pixels.set(color, offset);
    }
  }
}

function sourceCrop(source: ImageSource, part: SkinPart) {
  const cropByPart: Record<
    SkinPart,
    { x: number; y: number; width: number; height: number }
  > = {
    head: { x: 0.2, y: 0, width: 0.6, height: 0.34 },
    torso: { x: 0.24, y: 0.33, width: 0.52, height: 0.38 },
    'right-arm': { x: 0, y: 0.33, width: 0.28, height: 0.38 },
    'left-arm': { x: 0.72, y: 0.33, width: 0.28, height: 0.38 },
    'right-leg': { x: 0.24, y: 0.66, width: 0.28, height: 0.34 },
    'left-leg': { x: 0.48, y: 0.66, width: 0.28, height: 0.34 },
  };
  const crop = cropByPart[part];
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
  model: SkinModel = 'classic'
): SkinTexture {
  if (source.width < 1 || source.height < 1) {
    throw new Error('Image source must have positive dimensions');
  }
  const texture = createBlankSkin(format, model);
  const regions = getSkinRegions(format, model);
  regions.forEach((region) => {
    const crop = sourceCrop(source, region.part);
    paintRegion(
      texture,
      source,
      region,
      crop.x,
      crop.y,
      crop.width,
      crop.height
    );
  });
  return texture;
}

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
      const targetOffset = textureOffset(x, y, targetSize);
      pixels.set(
        texture.pixels.slice(sourceOffset, sourceOffset + 4),
        targetOffset
      );
    }
  }
  return { width: targetSize, height: targetSize, pixels, format, model };
}
