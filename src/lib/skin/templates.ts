import type { ImageSource, SkinTexture } from './types';

/**
 * Heuristic for outdoor BACKGROUND washes. Must NOT classify clothing:
 * a blue dress is subject clothing when it sits inside the person mask.
 * Only use this on unmasked samples / known-background corners.
 */
export function isBackgroundLike(color: readonly number[]) {
  const [r, g, b] = color;
  // Sky washes are bright in R and G too; saturated clothing blues have low R.
  const sky =
    b > 170 &&
    b > r + 40 &&
    b > g + 15 &&
    r > 100 &&
    g > 120;
  const foliage = g > 110 && g > r + 35 && g > b + 30 && r < 120;
  return sky || foliage;
}

export function isSkyLike(color: readonly number[]) {
  return isBackgroundLike(color);
}

export function dominantColor(
  source: ImageSource & { mask?: Uint8Array },
  rect?: { x: number; y: number; width: number; height: number }
) {
  const bins = new Map<number, number>();
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;
  const x0 = Math.floor((rect?.x ?? 0) * source.width);
  const y0 = Math.floor((rect?.y ?? 0) * source.height);
  const x1 = Math.ceil((rect ? rect.x + rect.width : 1) * source.width);
  const y1 = Math.ceil((rect ? rect.y + rect.height : 1) * source.height);
  for (let y = y0; y < y1; y += 2)
    for (let x = x0; x < x1; x += 2) {
      if (x < 0 || y < 0 || x >= source.width || y >= source.height) continue;
      const i = (y * source.width + x) * 4;
      if (source.mask && source.mask[y * source.width + x] === 0) continue;
      if ((source.pixels[i + 3] ?? 255) < 16) continue;
      const r = source.pixels[i]!;
      const g = source.pixels[i + 1]!;
      const b = source.pixels[i + 2]!;
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      bins.set(key, (bins.get(key) ?? 0) + 1);
      sumR += r;
      sumG += g;
      sumB += b;
      count += 1;
    }
  if (count === 0) {
    // Last resort: unmasked mean of the rect (still better than flat gray).
    for (let y = y0; y < y1; y += 3)
      for (let x = x0; x < x1; x += 3) {
        if (x < 0 || y < 0 || x >= source.width || y >= source.height) continue;
        const i = (y * source.width + x) * 4;
        if ((source.pixels[i + 3] ?? 255) < 16) continue;
        sumR += source.pixels[i]!;
        sumG += source.pixels[i + 1]!;
        sumB += source.pixels[i + 2]!;
        count += 1;
      }
    if (count === 0) return [120, 100, 85, 255] as const; // warm skin-ish, not gray
    return [
      Math.round(sumR / count),
      Math.round(sumG / count),
      Math.round(sumB / count),
      255,
    ] as const;
  }
  const key = [...bins].sort((a, b) => b[1] - a[1])[0]![0];
  return [
    ((key >> 8) & 15) * 17,
    ((key >> 4) & 15) * 17,
    (key & 15) * 17,
    255,
  ] as const;
}

/**
 * Dominant color of the subject. When a mask is present, trust it even if the
 * clothing is blue/green. Without a mask, skip background-like bins.
 */
export function subjectDominantColor(
  source: ImageSource & { mask?: Uint8Array },
  rect?: { x: number; y: number; width: number; height: number }
) {
  if (source.mask) return dominantColor(source, rect);
  const color = dominantColor(source, rect);
  if (!isBackgroundLike(color)) return color;
  const tight = rect
    ? {
        x: rect.x + rect.width * 0.25,
        y: rect.y + rect.height * 0.25,
        width: rect.width * 0.5,
        height: rect.height * 0.5,
      }
    : { x: 0.35, y: 0.3, width: 0.3, height: 0.35 };
  const retry = dominantColor(source, tight);
  return isBackgroundLike(retry)
    ? ([210, 160, 120, 255] as const)
    : retry;
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

export function maskCoverage(
  source: ImageSource & { mask?: Uint8Array },
  rect: { x: number; y: number; width: number; height: number }
) {
  if (!source.mask) return 1;
  const x0 = Math.floor(rect.x * source.width);
  const y0 = Math.floor(rect.y * source.height);
  const x1 = Math.ceil((rect.x + rect.width) * source.width);
  const y1 = Math.ceil((rect.y + rect.height) * source.height);
  let on = 0;
  let total = 0;
  for (let y = y0; y < y1; y += 2)
    for (let x = x0; x < x1; x += 2) {
      if (x < 0 || y < 0 || x >= source.width || y >= source.height) continue;
      total += 1;
      if (source.mask[y * source.width + x]) on += 1;
    }
  return total === 0 ? 0 : on / total;
}

/**
 * Structural limb/body fills only when photo sampling has almost no subject
 * coverage. Prefer real sampled colors whenever the mask sees the part.
 */
export function paintTemplate(
  texture: SkinTexture,
  source: ImageSource & { mask?: Uint8Array },
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
  const shirt = subjectDominantColor(source, {
    x: 0.25,
    y: 0.35,
    width: 0.5,
    height: 0.4,
  });
  const fur = subjectDominantColor(source);
  const skin = subjectDominantColor(source, {
    x: 0.35,
    y: 0.22,
    width: 0.3,
    height: 0.22,
  });
  const pants = subjectDominantColor(source, {
    x: 0.3,
    y: 0.65,
    width: 0.4,
    height: 0.25,
  });
  if (kind === 'animal') {
    c(20, 20, 8, 12, fur);
    c(8, 20, 8, 12, fur);
    return;
  }
  if (kind === 'logo') {
    const logo = dominantColor(source, {
      x: 0.25,
      y: 0.2,
      width: 0.5,
      height: 0.5,
    });
    c(22, 23, 4, 4, logo);
    // Limbs stay structure-only with sampled tones
    c(44, 20, 4, 12, skin);
    c(48, 20, 4, 12, skin);
    c(4, 20, 4, 12, skin);
    c(8, 20, 4, 12, skin);
    c(4, 32, 4, 12, pants);
    c(8, 32, 4, 12, pants);
    return;
  }
  // portrait / character structural fill — only call when coverage is low
  c(20, 20, 8, 12, shirt);
  c(44, 20, 4, 12, skin);
  c(48, 20, 4, 12, skin);
  c(4, 20, 4, 12, skin);
  c(8, 20, 4, 12, skin);
  c(4, 32, 4, 12, pants);
  c(8, 32, 4, 12, pants);
  c(20, 44, 4, 4, pants);
  c(24, 44, 4, 4, pants);
}
