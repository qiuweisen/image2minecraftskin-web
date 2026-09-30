import { describe, expect, it } from 'vitest';
import { derivePartCrops } from '@/lib/skin/ai-improve';
import { mapImageToSkin, scaleSkinTexture } from '@/lib/skin/normalize';
import type { ImageSource } from '@/lib/skin/types';
import { textureOffset } from '@/lib/skin/types';

function solid(
  width: number,
  height: number,
  paint: (x: number, y: number) => [number, number, number, number]
): ImageSource {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      pixels.set(paint(x, y), textureOffset(x, y, width));
    }
  }
  return { width, height, pixels };
}

const rgbaAt = (pixels: Uint8ClampedArray, x: number, y: number, w: number) => {
  const offset = textureOffset(x, y, w);
  return [...pixels.slice(offset, offset + 4)];
};

describe('area sampling', () => {
  it('averages fine detail instead of picking a single source pixel', () => {
    // 1px checkerboard: point sampling returns pure black or white,
    // area averaging should land near mid-grey.
    const checker = solid(400, 400, (x, y) =>
      (x + y) % 2 ? [255, 255, 255, 255] : [0, 0, 0, 255]
    );
    const skin = mapImageToSkin(checker, 'java-64');
    const [r, g, b, a] = rgbaAt(skin.pixels, 12, 12, skin.width);
    expect(a).toBe(255);
    for (const channel of [r, g, b]) {
      expect(channel).toBeGreaterThan(80);
      expect(channel).toBeLessThan(175);
    }
  });

  it('does not darken edge colour next to a transparent background', () => {
    // Left half transparent black, right half opaque red.
    const edge = solid(400, 400, (x) =>
      x < 200 ? [0, 0, 0, 0] : [255, 0, 0, 255]
    );
    const skin = mapImageToSkin(edge, 'java-64');
    for (let x = 8; x < 16; x += 1) {
      const [r, g, b, a] = rgbaAt(skin.pixels, x, 12, skin.width);
      if (a === 0) continue;
      expect([r, g, b]).toEqual([255, 0, 0]);
    }
  });

  it('keeps Java → Bedrock scaling pixel-exact', () => {
    const java = mapImageToSkin(
      solid(64, 64, (x, y) => [x * 4, y * 4, 0, 255]),
      'java-64'
    );
    const bedrock = scaleSkinTexture(java, 'bedrock-128');
    for (const [x, y] of [
      [8, 8],
      [20, 20],
      [44, 52],
    ]) {
      const expected = rgbaAt(java.pixels, x, y, 64);
      expect(rgbaAt(bedrock.pixels, x * 2, y * 2, 128)).toEqual(expected);
      expect(rgbaAt(bedrock.pixels, x * 2 + 1, y * 2 + 1, 128)).toEqual(
        expected
      );
    }
  });

  it('uses supplied part crops for the head', () => {
    // Top half green, bottom half blue. Default head crop is the top third;
    // a crop pointing at the bottom should paint the face blue.
    const split = solid(100, 100, (_x, y) =>
      y < 50 ? [0, 255, 0, 255] : [0, 0, 255, 255]
    );
    const skin = mapImageToSkin(split, 'java-64', 'classic', {
      head: { x: 0.3, y: 0.7, width: 0.4, height: 0.2 },
    });
    expect(rgbaAt(skin.pixels, 12, 12, skin.width)).toEqual([0, 0, 255, 255]);
  });
});

describe('pose part crops', () => {
  // Normalized landmarks for a front-facing full-body subject.
  const pose = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    visibility: 0,
  }));
  const set = (i: number, x: number, y: number) => {
    pose[i] = { x, y, visibility: 0.9 };
  };
  set(0, 0.5, 0.12); // nose
  set(11, 0.62, 0.25); // left shoulder (image right)
  set(12, 0.38, 0.25); // right shoulder (image left)
  set(13, 0.64, 0.4);
  set(14, 0.36, 0.4);
  set(15, 0.65, 0.52);
  set(16, 0.35, 0.52);
  set(23, 0.56, 0.55);
  set(24, 0.44, 0.55);
  set(25, 0.56, 0.72);
  set(26, 0.44, 0.72);
  set(27, 0.56, 0.9);
  set(28, 0.44, 0.9);

  it('builds non-degenerate crops for every part', () => {
    const crops = derivePartCrops(pose, 1000, 1000);
    expect(crops).toBeDefined();
    for (const part of [
      'head',
      'torso',
      'right-arm',
      'left-arm',
      'right-leg',
      'left-leg',
    ] as const) {
      const crop = crops?.[part];
      expect(crop, part).toBeDefined();
      expect(crop?.width, part).toBeGreaterThan(0.02);
      expect(crop?.height, part).toBeGreaterThan(0.02);
    }
  });

  it('keeps the head above the torso and the subject right arm on image left', () => {
    const crops = derivePartCrops(pose, 1000, 1000);
    const head = crops?.head;
    const torso = crops?.torso;
    expect(head && torso && head.y + head.height <= torso.y + 1e-6).toBe(true);
    const right = crops?.['right-arm'];
    const left = crops?.['left-arm'];
    expect(right && left && right.x < left.x).toBe(true);
  });

  it('returns undefined without both shoulders', () => {
    const noShoulders = pose.map((p, i) =>
      i === 11 ? { ...p, visibility: 0 } : p
    );
    expect(derivePartCrops(noShoulders, 1000, 1000)).toBeUndefined();
  });
});
