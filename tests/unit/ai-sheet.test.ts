import { describe, expect, it } from 'vitest';
import {
  assessAiSheet,
  mapAiSheetToSkin,
  splitAiPanels,
} from '@/lib/skin/ai-sheet';
import type { ImageSource } from '@/lib/skin/types';

function fixture(leftHeight = 70, rightHeight = leftHeight): ImageSource {
  const width = 200,
    height = 100;
  const pixels = new Uint8ClampedArray(width * height * 4);
  pixels.fill(255);
  for (let y = 0; y < leftHeight; y += 1)
    for (let x = 25; x < 75; x += 1) {
      const i = (y * width + x) * 4;
      pixels[i] = 30;
      pixels[i + 1] = 160;
      pixels[i + 2] = 180;
      pixels[i + 3] = 255;
    }
  for (let y = 0; y < rightHeight; y += 1)
    for (let x = 125; x < 175; x += 1) {
      const i = (y * width + x) * 4;
      pixels[i] = 180;
      pixels[i + 1] = 80;
      pixels[i + 2] = 90;
      pixels[i + 3] = 255;
    }
  return { width, height, pixels };
}

describe('AI sheet mapping', () => {
  it('splits panels and removes white background', () => {
    const [front, back] = splitAiPanels(fixture());
    expect(front.width).toBe(100);
    expect(back.width).toBe(100);
    expect(front.bbox?.height).toBeCloseTo(0.7);
    expect(front.pixels[3]).toBe(0);
  });
  it('rejects empty and mismatched layouts', () => {
    const [front, back] = splitAiPanels(fixture(70, 40));
    expect(assessAiSheet(front, back)).toEqual({
      valid: false,
      reason: 'height_mismatch',
    });
    const [empty] = splitAiPanels({
      width: 200,
      height: 100,
      pixels: new Uint8ClampedArray(200 * 100 * 4).fill(255),
    });
    expect(assessAiSheet(empty, empty).valid).toBe(false);
  });
  it('maps a valid classic and slim sheet to 64x64 textures', () => {
    expect(mapAiSheetToSkin(fixture(), 'classic').texture.width).toBe(64);
    expect(mapAiSheetToSkin(fixture(), 'slim').texture.model).toBe('slim');
  });
});
