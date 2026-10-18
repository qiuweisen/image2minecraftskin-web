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
});
