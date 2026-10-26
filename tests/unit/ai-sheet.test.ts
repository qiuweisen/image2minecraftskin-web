import { describe, expect, it } from 'vitest';
import {
  assessAiSheet,
  isMinecraftSkinTemplate,
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
  it('detects standard Minecraft UV templates and bypasses AI mapping', () => {
    const pixels = new Uint8ClampedArray(64 * 64 * 4);
    pixels.fill(0);
    pixels[textureOffset(7, 7, 64)] = 231;
    const source = { width: 64, height: 64, pixels };
    expect(isMinecraftSkinTemplate(source)).toBe(true);
    const result = mapAiSheetToSkin(source);
    expect(result.texture.pixels[textureOffset(7, 7, 64)]).toBe(231);
    expect(result.quality.valid).toBe(true);
  });
  it('accepts legacy 64x32 templates and nearest-resizes them', () => {
    const pixels = new Uint8ClampedArray(64 * 32 * 4);
    pixels.fill(0);
    pixels[textureOffset(9, 4, 64)] = 199;
    const source = { width: 64, height: 32, pixels };
    expect(isMinecraftSkinTemplate(source)).toBe(true);
    const result = mapAiSheetToSkin(source);
    expect(result.texture.pixels[textureOffset(9, 8, 64)]).toBe(199);
  });
  it('paints outer-layer volume from the AI front and back panels', () => {
    const result = mapAiSheetToSkin(fixture(), 'classic').texture;
    // Hat outer origin (32,0); jacket outer origin (16,32).
    expect(
      result.pixels
        .slice(textureOffset(32, 0, 64), textureOffset(40, 8, 64))
        .some((v) => v !== 0)
    ).toBe(true);
    expect(
      result.pixels
        .slice(textureOffset(16, 32, 64), textureOffset(40, 48, 64))
        .some((v) => v !== 0)
    ).toBe(true);
  });
});

function textureOffset(x: number, y: number, width: number) {
  return (y * width + x) * 4;
}
