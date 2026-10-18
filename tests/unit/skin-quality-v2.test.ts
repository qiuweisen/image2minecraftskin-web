import { describe, expect, it } from 'vitest';
import { mapImageToSkin } from '@/lib/skin/normalize';
import { getSkinRegions } from '@/lib/skin/layouts';
import { textureOffset } from '@/lib/skin/types';
import { isBackgroundLike, dominantColor } from '@/lib/skin/templates';

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

function at(
  skin: ReturnType<typeof mapImageToSkin>,
  x: number,
  y: number
) {
  const i = textureOffset(x, y, skin.width);
  return [skin.pixels[i]!, skin.pixels[i + 1]!, skin.pixels[i + 2]!, skin.pixels[i + 3]!];
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

  it('preserves blue dress clothing under a person mask (not scrubbed as sky)', () => {
    const width = 80;
    const height = 100;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const sky = [135, 206, 235, 255] as const;
    const skin = [210, 160, 120, 255] as const;
    const dress = [70, 120, 200, 255] as const;
    const mask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const inSubject = x >= 20 && x < 60 && y >= 10 && y < 90;
        mask[y * width + x] = inSubject ? 1 : 0;
        let color = sky;
        if (inSubject && y < 40) color = skin;
        else if (inSubject) color = dress;
        pixels.set(color, i);
      }
    // Clothing blue must not be treated as background when masked.
    expect(isBackgroundLike(dress)).toBe(false);
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      {
        kind: 'portrait',
        mask,
        face: { x: 0.3, y: 0.12, width: 0.4, height: 0.25 },
      }
    );
    const torso = at(skinTex, 24, 26);
    const distDress = Math.hypot(
      torso[0]! - dress[0],
      torso[1]! - dress[1],
      torso[2]! - dress[2]
    );
    const distCream = Math.hypot(
      torso[0]! - 210,
      torso[1]! - 160,
      torso[2]! - 120
    );
    expect(distDress).toBeLessThan(80);
    expect(distDress).toBeLessThan(distCream);
  });

  it('keeps green foliage outside the mask from dominating torso', () => {
    const width = 80;
    const height = 100;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const leaf = [40, 160, 50, 255] as const;
    const shirt = [180, 40, 40, 255] as const;
    const mask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const inSubject = x >= 25 && x < 55 && y >= 15 && y < 85;
        mask[y * width + x] = inSubject ? 1 : 0;
        pixels.set(inSubject ? shirt : leaf, i);
      }
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      { kind: 'portrait', mask }
    );
    const torso = at(skinTex, 24, 26);
    const distShirt = Math.hypot(
      torso[0]! - shirt[0],
      torso[1]! - shirt[1],
      torso[2]! - shirt[2]
    );
    const distLeaf = Math.hypot(
      torso[0]! - leaf[0],
      torso[1]! - leaf[1],
      torso[2]! - leaf[2]
    );
    expect(distShirt).toBeLessThan(distLeaf);
  });

  it('does not fall back to neutral gray when masked pixels exist', () => {
    const width = 40;
    const height = 40;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const mask = new Uint8Array(width * height);
    for (let i = 0; i < pixels.length; i += 4) {
      pixels.set([90, 40, 30, 255], i);
    }
    mask.fill(1);
    const color = dominantColor({ width, height, pixels, mask });
    expect(color[0]).not.toBe(136);
    expect(color[1]).not.toBe(136);
    expect(color[2]).not.toBe(136);
  });

  it('mirrors front torso colors onto the back instead of flat gray', () => {
    const width = 64;
    const height = 96;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const mask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        pixels.set([30, 80, 180, 255], i);
        mask[y * width + x] = 1;
      }
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      { kind: 'full-body', mask }
    );
    // torso front (20,20) vs back (32,20) in classic layout
    const front = at(skinTex, 24, 26);
    const back = at(skinTex, 36, 26);
    expect(Math.hypot(front[0]! - back[0]!, front[1]! - back[1]!, front[2]! - back[2]!)).toBeLessThan(30);
    expect(back[0]).not.toBe(136);
  });

  it('leaves no near-black voids in base body regions', () => {
    const width = 80;
    const height = 100;
    const pixels = new Uint8ClampedArray(width * height * 4);
    const mask = new Uint8Array(width * height);
    // Subject with intentional black speckles inside mask (should be filled)
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const inSubject = x >= 20 && x < 60 && y >= 10 && y < 90;
        mask[y * width + x] = inSubject ? 1 : 0;
        if (!inSubject) {
          pixels.set([40, 160, 50, 255], i);
        } else if ((x + y) % 17 === 0) {
          pixels.set([0, 0, 0, 255], i);
        } else {
          pixels.set([180, 120, 80, 255], i);
        }
      }
    const skinTex = mapImageToSkin(
      { width, height, pixels },
      'java-64',
      'classic',
      {
        kind: 'portrait',
        mask,
        face: { x: 0.3, y: 0.12, width: 0.4, height: 0.28 },
      }
    );
    const regions = getSkinRegions('java-64', 'classic');
    for (const region of regions) {
      for (let y = region.y; y < region.y + region.height; y++)
        for (let x = region.x; x < region.x + region.width; x++) {
          const i = textureOffset(x, y, skinTex.width);
          const r = skinTex.pixels[i]!;
          const g = skinTex.pixels[i + 1]!;
          const b = skinTex.pixels[i + 2]!;
          const a = skinTex.pixels[i + 3]!;
          expect(a).toBe(255);
          expect(r + g + b).toBeGreaterThan(30);
        }
    }
  });
});
