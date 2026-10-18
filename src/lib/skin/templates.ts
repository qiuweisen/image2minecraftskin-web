import type { ImageSource, SkinTexture } from './types';

export function dominantColor(
  source: ImageSource & { mask?: Uint8Array },
  rect?: { x: number; y: number; width: number; height: number }
) {
  const bins = new Map<number, number>();
  const x0 = Math.floor((rect?.x ?? 0) * source.width);
  const y0 = Math.floor((rect?.y ?? 0) * source.height);
  const x1 = Math.ceil((rect ? rect.x + rect.width : 1) * source.width);
  const y1 = Math.ceil((rect ? rect.y + rect.height : 1) * source.height);
  for (let y = y0; y < y1; y += 2)
    for (let x = x0; x < x1; x += 2) {
      const i = (y * source.width + x) * 4;
      if (source.mask && source.mask[y * source.width + x] === 0) continue;
      if ((source.pixels[i + 3] ?? 255) < 16) continue;
      const key =
        ((source.pixels[i]! >> 4) << 8) |
        ((source.pixels[i + 1]! >> 4) << 4) |
        (source.pixels[i + 2]! >> 4);
      bins.set(key, (bins.get(key) ?? 0) + 1);
    }
  const key = [...bins].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0x888;
  return [
    ((key >> 8) & 15) * 17,
    ((key >> 4) & 15) * 17,
    (key & 15) * 17,
    255,
  ] as const;
}

export function fillRegion(
  texture: SkinTexture,
  region: { x: number; y: number; width: number; height: number },
  color: readonly number[]
) {
  for (let y = region.y; y < region.y + region.height; y++)
    for (let x = region.x; x < region.x + region.width; x++) {
      const i = (y * texture.width + x) * 4;
      texture.pixels.set(color, i);
    }
}

export function paintTemplate(
  texture: SkinTexture,
  source: ImageSource,
  kind: 'portrait' | 'full-body' | 'character' | 'animal' | 'logo'
) {
  const scale = texture.width / 64;
  const c = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: readonly number[]
  ) =>
    fillRegion(
      texture,
      { x: x * scale, y: y * scale, width: w * scale, height: h * scale },
      color
    );
  const shirt = dominantColor(source, {
    x: 0.25,
    y: 0.35,
    width: 0.5,
    height: 0.4,
  });
  const fur = dominantColor(source);
  const skin = dominantColor(source, {
    x: 0.3,
    y: 0.12,
    width: 0.4,
    height: 0.3,
  });
  if (kind === 'animal') {
    c(20, 20, 8, 12, fur);
    c(8, 20, 8, 12, fur);
  } else {
    c(20, 20, 8, 12, shirt);
    c(44, 20, 4, 12, skin);
    c(48, 20, 4, 12, skin);
    c(4, 20, 4, 12, skin);
    c(8, 20, 4, 12, skin);
    c(4, 32, 4, 12, [45, 62, 78, 255]);
    c(8, 32, 4, 12, [45, 62, 78, 255]);
    c(20, 44, 4, 4, [28, 32, 39, 255]);
    c(24, 44, 4, 4, [28, 32, 39, 255]);
  }
  if (kind === 'logo') {
    // Chest front center only; sampled artwork is deliberately not stretched over limbs.
    const logo = dominantColor(source, {
      x: 0.25,
      y: 0.2,
      width: 0.5,
      height: 0.5,
    });
    c(22, 23, 4, 4, logo);
  }
}
