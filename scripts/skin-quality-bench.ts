import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { mapImageToSkin } from '../src/lib/skin/normalize';
import type {
  ImageSource,
  SkinTexture,
  SubjectKind,
} from '../src/lib/skin/types';

const fixtureDir = 'docs/pr-screens/fixtures';
const outputDir = 'docs/pr-screens';
mkdirSync(outputDir, { recursive: true });

function readPng(path: string): ImageSource {
  const probe = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height',
      '-of',
      'csv=p=0:s=x',
      path,
    ],
    { encoding: 'utf8' }
  ).trim();
  const [width, height] = probe.split('x').map(Number);
  const pixels = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'],
    { maxBuffer: 64 * 1024 * 1024 }
  );
  return { width, height, pixels: new Uint8ClampedArray(pixels) };
}

function writePng(
  path: string,
  width: number,
  height: number,
  pixels: Uint8ClampedArray
) {
  execFileSync(
    'ffmpeg',
    [
      '-v',
      'error',
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgba',
      '-s',
      `${width}x${height}`,
      '-i',
      'pipe:0',
      '-frames:v',
      '1',
      '-y',
      path,
    ],
    { input: Buffer.from(pixels) }
  );
}

function scale(
  texture: SkinTexture | ImageSource,
  width: number,
  height: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1)
    for (let x = 0; x < width; x += 1) {
      const sx = Math.floor((x / width) * texture.width);
      const sy = Math.floor((y / height) * texture.height);
      const si = (sy * texture.width + sx) * 4;
      out.set(texture.pixels.subarray(si, si + 4), (y * width + x) * 4);
    }
  return out;
}

const fixtures = [
  ['portrait-selfie.png', 'portrait'],
  ['fullbody-busy.png', 'full-body'],
  ['logo-transparent.png', 'logo'],
  ['pixel-sprite.png', 'character'],
  ['anime-character.png', 'character'],
  ['pet-cat.png', 'animal'],
] as const satisfies ReadonlyArray<readonly [string, SubjectKind]>;

for (const [name, kind] of fixtures) {
  const source = readPng(join(fixtureDir, name));
  const started = performance.now();
  const v1 = mapImageToSkin(source, 'java-64', 'classic', {
    kind: 'full-body',
  });
  const v2 = mapImageToSkin(source, 'java-64', 'classic', {
    kind,
    style: 'photo',
    faceDetails: true,
  });
  const pixel = mapImageToSkin(source, 'java-64', 'classic', {
    kind,
    style: 'pixel',
    faceDetails: true,
  });
  const elapsed = Math.round(performance.now() - started);
  const cellW = 256;
  const cellH = 256;
  const sheet = new Uint8ClampedArray(cellW * 4 * cellH * 4);
  [source, v1, v2, pixel].forEach((cell, index) => {
    const pixels = scale(cell, cellW, cellH);
    for (let y = 0; y < cellH; y += 1)
      sheet.set(
        pixels.subarray(y * cellW * 4, (y + 1) * cellW * 4),
        y * cellW * 4 * 4 + index * cellW * 4
      );
  });
  const stem = basename(name, '.png');
  writePng(join(outputDir, `contact-${stem}.png`), cellW * 4, cellH, sheet);
  writePng(join(outputDir, `${stem}-v1.png`), 64, 64, v1.pixels);
  writePng(join(outputDir, `${stem}-v2.png`), 64, 64, v2.pixels);
  console.log(`${stem}: ${elapsed}ms`);
}
