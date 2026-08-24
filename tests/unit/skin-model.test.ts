import { describe, expect, it } from 'vitest';
import {
  createBlankSkin,
  mapImageToSkin,
  scaleSkinTexture,
} from '@/lib/skin/normalize';
import type { ImageSource } from '@/lib/skin/types';

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

  it('scales a Java texture to Bedrock dimensions', () => {
    const java = mapImageToSkin(source, 'java-64');
    const bedrock = scaleSkinTexture(java, 'bedrock-128');
    expect(bedrock.width).toBe(128);
    expect(bedrock.height).toBe(128);
    expect(bedrock.format).toBe('bedrock-128');
  });
});
