import { performance } from 'node:perf_hooks';
import { mapImageToSkin } from '../src/lib/skin/normalize';
import type { ImageSource, SubjectKind } from '../src/lib/skin/types';

const cases: Array<{ name: string; kind: SubjectKind; alpha: number }> = [
  { name: 'portrait', kind: 'portrait', alpha: 255 },
  { name: 'full-body', kind: 'full-body', alpha: 255 },
  { name: 'busy-background', kind: 'auto', alpha: 255 },
  { name: 'anime-style', kind: 'character', alpha: 255 },
  { name: 'pet', kind: 'animal', alpha: 255 },
  { name: 'transparent-logo', kind: 'logo', alpha: 0 },
  { name: 'pixel-sprite', kind: 'character', alpha: 255 },
];

for (const test of cases) {
  const source: ImageSource = {
    width: 96,
    height: 128,
    pixels: new Uint8ClampedArray(96 * 128 * 4),
  };
  for (let i = 0; i < source.pixels.length; i += 4) {
    source.pixels[i] = (i * 13) % 256;
    source.pixels[i + 1] = (i * 7) % 256;
    source.pixels[i + 2] = (i * 3) % 256;
    source.pixels[i + 3] = test.alpha;
  }
  const started = performance.now();
  const skin = mapImageToSkin(source, 'java-64', 'classic', {
    kind: test.kind,
    style: 'photo',
    faceDetails: true,
  });
  const durationMs = Math.round(performance.now() - started);
  const opaquePixels = Array.from(
    { length: skin.width * skin.height },
    (_, i) => skin.pixels[i * 4 + 3]
  ).filter((alpha) => alpha === 255).length;
  console.log(
    `${test.name}: ${durationMs}ms, ${opaquePixels} opaque texture pixels`
  );
}
