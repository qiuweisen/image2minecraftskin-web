import { describe, expect, it } from 'vitest';
import {
  applySourceTransform,
  IDENTITY_SOURCE_TRANSFORM,
  recommendSourceTransform,
  normalizeSourceTransform,
} from '@/lib/skin/source-transform';
import type { ImageSource } from '@/lib/skin/types';

const source: ImageSource = {
  width: 2,
  height: 2,
  pixels: new Uint8ClampedArray([
    255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
  ]),
};

describe('source transform', () => {
  it('clamps pan and zoom to the supported range', () => {
    expect(normalizeSourceTransform({ x: 4, y: -3, zoom: 9 })).toEqual({
      x: 1,
      y: -1,
      zoom: 2.5,
    });
  });

  it('preserves source pixels for the identity transform', () => {
    const result = applySourceTransform(source, { x: 0, y: 0, zoom: 1 });

    expect(result).not.toBe(source);
    expect(result.width).toBe(2);
    expect(result.height).toBe(2);
    expect(result.pixels).toEqual(source.pixels);
  });

  it('does not mutate the source while applying a non-identity transform', () => {
    const original = new Uint8ClampedArray(source.pixels);
    applySourceTransform(source, { x: 0.5, y: -0.5, zoom: 2 });

    expect(source.pixels).toEqual(original);
  });

  it('recommends a tighter framing for a transparent subject', () => {
    const transparent: ImageSource = {
      width: 10,
      height: 10,
      pixels: new Uint8ClampedArray(10 * 10 * 4),
    };
    for (let y = 2; y < 8; y += 1) {
      for (let x = 3; x < 7; x += 1) {
        transparent.pixels[(y * 10 + x) * 4 + 3] = 255;
      }
    }

    expect(recommendSourceTransform(transparent)).toEqual({
      x: 0,
      y: 0,
      zoom: 1.5,
    });
  });

  it('keeps opaque images on the original framing', () => {
    expect(recommendSourceTransform(source)).toEqual(IDENTITY_SOURCE_TRANSFORM);
  });
});
