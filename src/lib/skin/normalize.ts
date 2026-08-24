import {
  SKIN_DIMENSIONS,
  type ImageSource,
  type SkinFormat,
  type SkinModel,
  type SkinTexture,
  textureOffset,
} from './types';
import { SKIN_REGIONS, type SkinRegion } from './layouts';

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

export function mapImageToSkin(
  source: ImageSource,
  format: SkinFormat,
  model: SkinModel = 'classic'
): SkinTexture {
  if (source.width < 1 || source.height < 1) {
    throw new Error('Image source must have positive dimensions');
  }
  const texture = createBlankSkin(format, model);
  const regions = SKIN_REGIONS[format];
  regions.forEach((region, index) => {
    const sourceWidth = Math.max(1, source.width * (index === 0 ? 0.5 : 0.7));
    const sourceHeight = Math.max(1, source.height * (index === 0 ? 0.5 : 0.8));
    paintRegion(
      texture,
      source,
      region,
      (source.width - sourceWidth) / 2,
      (source.height - sourceHeight) / 2,
      sourceWidth,
      sourceHeight
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
