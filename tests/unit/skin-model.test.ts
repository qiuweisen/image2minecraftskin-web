import { describe, expect, it } from 'vitest';
import {
  createBlankSkin,
  mapImageToSkin,
  scaleSkinTexture,
} from '@/lib/skin/normalize';
import type { ImageSource } from '@/lib/skin/types';
import { textureOffset } from '@/lib/skin/types';

const source: ImageSource = {
  width: 2,
  height: 2,
  pixels: new Uint8ClampedArray([
    255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255,
  ]),
};

describe('skin model', () => {
  it('creates transparent textures with the requested dimensions', () => {
    const skin = createBlankSkin('java-64', 'slim');
    expect(skin.width).toBe(64);
    expect(skin.height).toBe(64);
    expect(skin.model).toBe('slim');
    expect(skin.pixels.every((value) => value === 0)).toBe(true);
  });

  it('maps a source image deterministically into a Java skin', () => {
    const first = mapImageToSkin(source, 'java-64');
    const second = mapImageToSkin(source, 'java-64');
    expect(first.pixels).toEqual(second.pixels);
    expect(first.pixels.some((value) => value !== 0)).toBe(true);
  });

  it('paints every base body surface needed by the 3D preview', () => {
    const skin = mapImageToSkin(source, 'java-64');
    const representativeSurfacePixels = [
      [12, 4],
      [4, 12],
      [28, 12],
      [24, 18],
      [18, 26],
      [36, 26],
      [46, 18],
      [42, 26],
      [54, 26],
      [6, 18],
      [2, 26],
      [14, 26],
      [22, 50],
      [18, 58],
      [30, 58],
      [38, 50],
      [34, 58],
      [46, 58],
    ];

    for (const [x, y] of representativeSurfacePixels) {
      expect(skin.pixels[textureOffset(x, y, skin.width) + 3]).toBe(255);
    }
  });

  it('maps upper, middle, and lower source areas to matching body parts', () => {
    const portrait: ImageSource = {
      width: 1,
      height: 6,
      pixels: new Uint8ClampedArray([
        255, 0, 0, 255, 255, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 0,
        255, 255, 0, 0, 255, 255,
      ]),
    };
    const skin = mapImageToSkin(portrait, 'java-64');
    const rgbAt = (x: number, y: number) => {
      const offset = textureOffset(x, y, skin.width);
      return [...skin.pixels.slice(offset, offset + 3)];
    };

    expect(rgbAt(12, 12)).toEqual([255, 0, 0]);
    expect(rgbAt(24, 26)).toEqual([0, 255, 0]);
    expect(rgbAt(6, 26)).toEqual([0, 0, 255]);
  });

  it('scales a Java texture to Bedrock dimensions', () => {
    const java = mapImageToSkin(source, 'java-64');
    const bedrock = scaleSkinTexture(java, 'bedrock-128');
    expect(bedrock.width).toBe(128);
    expect(bedrock.height).toBe(128);
    expect(bedrock.format).toBe('bedrock-128');
  });
});
