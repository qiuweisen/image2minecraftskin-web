import { describe, expect, it } from 'vitest';
import { mapImageToSkin } from '@/lib/skin/normalize';
import { getSkinRegions } from '@/lib/skin/layouts';
import { textureOffset } from '@/lib/skin/types';

function source(width = 64, height = 96, alpha = 255) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = (i / 4) % 255;
    pixels[i + 1] = 110;
    pixels[i + 2] = 80;
    pixels[i + 3] = alpha;
  }
  return { width, height, pixels };
}

describe('skin quality v2 mapping', () => {
  it('fills transparent inputs so every body base pixel is opaque', () => {
    const skin = mapImageToSkin(source(64, 96, 0), 'java-64');
    const alphas = getSkinRegions('java-64', 'classic').flatMap((region) =>
      Array.from({ length: region.height }, (_, y) =>
        Array.from(
          { length: region.width },
          (_, x) =>
            skin.pixels[
              textureOffset(region.x + x, region.y + y, skin.width) + 3
            ]
        )
      ).flat()
    );
    expect(alphas.every((alpha) => alpha === 255)).toBe(true);
  });
  it('keeps slim arms narrow and supports Bedrock dimensions', () => {
    expect(mapImageToSkin(source(), 'bedrock-128', 'slim').width).toBe(128);
    expect(mapImageToSkin(source(), 'java-64', 'slim').width).toBe(64);
  });
  it('paints explicit face details and makes pixel style distinct', () => {
    const plain = mapImageToSkin(source(), 'java-64');
    const face = mapImageToSkin(source(), 'java-64', 'classic', {
      faceDetails: true,
    });
    const pixel = mapImageToSkin(source(), 'java-64', 'classic', {
      style: 'pixel',
    });
    expect(face.pixels).not.toEqual(plain.pixels);
    expect(pixel.pixels).not.toEqual(plain.pixels);
  });
  it('keeps a logo kind chest-centered rather than stretching it across limbs', () => {
    const skin = mapImageToSkin(source(), 'java-64', 'classic', {
      kind: 'logo',
    });
    const chest = (20 * 64 + 22) * 4;
    const arm = (25 * 64 + 44) * 4;
    expect(skin.pixels.slice(chest, chest + 3)).not.toEqual([118, 113, 105]);
    expect(skin.pixels[arm + 3]).toBe(255);
  });

  it('rejects sky-blue from portrait head-top and arm hole fills', () => {
    const width = 80;
    const height = 100;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const sky = [135, 206, 235, 255] as const;
    const skin = [210, 160, 120, 255] as const;
    const shirt = [40, 90, 160, 255] as const;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const color =
          y < height * 0.12 ? sky : y < height * 0.45 ? skin : shirt;
        pixels.set(color, i);
      }
    }
    // Mask: subject is the middle band (face/torso), not the sky strip.
    const mask = new Uint8Array(width * height);
    for (let y = Math.floor(height * 0.12); y < height; y++)
      for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++)
        mask[y * width + x] = 1;
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      {
        kind: 'portrait',
        mask,
        face: { x: 0.3, y: 0.15, width: 0.4, height: 0.28 },
      }
    );
    const regions = getSkinRegions('java-64', 'classic');
    const headTop = regions.find((r, i) => r.part === 'head' && i % 6 === 0)!;
    const sample = (region: (typeof regions)[number]) => {
      const i = textureOffset(
        region.x + Math.floor(region.width / 2),
        region.y + Math.floor(region.height / 2),
        skinTex.width
      );
      return [skinTex.pixels[i]!, skinTex.pixels[i + 1]!, skinTex.pixels[i + 2]!];
    };
    const topColor = sample(headTop);
    // Sky blue is ~135,206,235 — hair/skin fallback must not be that close.
    const distSky = Math.hypot(
      topColor[0]! - sky[0],
      topColor[1]! - sky[1],
      topColor[2]! - sky[2]
    );
    expect(distSky).toBeGreaterThan(60);
    const rightArm = regions.find((r) => r.part === 'right-arm')!;
    const armColor = sample(rightArm);
    const armDistSky = Math.hypot(
      armColor[0]! - sky[0],
      armColor[1]! - sky[1],
      armColor[2]! - sky[2]
    );
    expect(armDistSky).toBeGreaterThan(60);
  });

  it('scrubs sky-like torso/arm pixels even when kind is character', () => {
    const width = 80;
    const height = 64;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const sky = [135, 206, 235, 255] as const;
    const skin = [210, 160, 120, 255] as const;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        // Entire frame sky except a small face patch
        const isFace = x > 30 && x < 50 && y > 10 && y < 30;
        pixels.set(isFace ? skin : sky, i);
      }
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      { kind: 'character' }
    );
    const arm = textureOffset(46, 26, skinTex.width);
    const torso = textureOffset(24, 26, skinTex.width);
    const armRGB = [skinTex.pixels[arm]!, skinTex.pixels[arm + 1]!, skinTex.pixels[arm + 2]!];
    const torsoRGB = [skinTex.pixels[torso]!, skinTex.pixels[torso + 1]!, skinTex.pixels[torso + 2]!];
    const skyDist = (c: number[]) =>
      Math.hypot(c[0]! - sky[0], c[1]! - sky[1], c[2]! - sky[2]);
    expect(skyDist(armRGB)).toBeGreaterThan(60);
    expect(skyDist(torsoRGB)).toBeGreaterThan(60);
  });

  it('scrubs green foliage from character limbs', () => {
    const width = 80;
    const height = 64;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const leaf = [40, 160, 50, 255] as const;
    const skin = [200, 150, 120, 255] as const;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const isFace = x > 30 && x < 50 && y > 8 && y < 28;
        pixels.set(isFace ? skin : leaf, i);
      }
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      { kind: 'character' }
    );
    const arm = textureOffset(46, 26, skinTex.width);
    const c = [skinTex.pixels[arm]!, skinTex.pixels[arm + 1]!, skinTex.pixels[arm + 2]!];
    expect(Math.hypot(c[0]! - leaf[0], c[1]! - leaf[1], c[2]! - leaf[2])).toBeGreaterThan(60);
  });
});
