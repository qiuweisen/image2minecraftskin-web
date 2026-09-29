import { type ImageSource, textureOffset } from './types';

export type SourceTransform = {
  x: number;
  y: number;
  zoom: number;
};

export const IDENTITY_SOURCE_TRANSFORM: SourceTransform = {
  x: 0,
  y: 0,
  zoom: 1,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function normalizeSourceTransform(
  transform: SourceTransform
): SourceTransform {
  return {
    x: clamp(transform.x, -1, 1),
    y: clamp(transform.y, -1, 1),
    zoom: clamp(transform.zoom, 1, 2.5),
  };
}

export function recommendSourceTransform(source: ImageSource): SourceTransform {
  let minX = source.width;
  let minY = source.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const alpha = source.pixels[textureOffset(x, y, source.width) + 3] ?? 255;
      if (alpha < 16) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (
    maxX < 0 ||
    (minX === 0 &&
      minY === 0 &&
      maxX === source.width - 1 &&
      maxY === source.height - 1)
  ) {
    return IDENTITY_SOURCE_TRANSFORM;
  }

  const subjectWidth = maxX - minX + 1;
  const subjectHeight = maxY - minY + 1;
  const zoom = Math.min(
    2.5,
    Math.max(
      1,
      Math.min(source.width / subjectWidth, source.height / subjectHeight) * 0.9
    )
  );
  const maxOffsetX = (source.width - source.width / zoom) / 2;
  const maxOffsetY = (source.height - source.height / zoom) / 2;
  const subjectCenterX = (minX + maxX) / 2;
  const subjectCenterY = (minY + maxY) / 2;

  return normalizeSourceTransform({
    x: maxOffsetX ? (subjectCenterX - (source.width - 1) / 2) / maxOffsetX : 0,
    y: maxOffsetY ? (subjectCenterY - (source.height - 1) / 2) / maxOffsetY : 0,
    zoom,
  });
}

export function applySourceTransform(
  source: ImageSource,
  input: SourceTransform
): ImageSource {
  const transform = normalizeSourceTransform(input);
  const pixels = new Uint8ClampedArray(source.pixels.length);
  const visibleWidth = source.width / transform.zoom;
  const visibleHeight = source.height / transform.zoom;
  const maxOffsetX = (source.width - visibleWidth) / 2;
  const maxOffsetY = (source.height - visibleHeight) / 2;
  const startX = maxOffsetX * (1 + transform.x);
  const startY = maxOffsetY * (1 + transform.y);

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const sourceX = Math.min(
        source.width - 1,
        Math.floor(startX + (x / source.width) * visibleWidth)
      );
      const sourceY = Math.min(
        source.height - 1,
        Math.floor(startY + (y / source.height) * visibleHeight)
      );
      const from = textureOffset(sourceX, sourceY, source.width);
      const to = textureOffset(x, y, source.width);
      pixels.set(source.pixels.slice(from, from + 4), to);
    }
  }

  return { width: source.width, height: source.height, pixels };
}
