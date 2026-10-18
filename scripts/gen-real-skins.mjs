import { chromium } from '@playwright/test';
import { execFileSync } from 'child_process';
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const LOCAL = process.env.ACCEPT_LOCAL_URL || 'http://127.0.0.1:3015';
const FIXTURE_DIR = 'docs/pr-screens/fixtures/real';
const OUT = 'docs/pr-screens/real-runs/new';
const FIXTURES = [
  'portrait-selfie.jpg',
  'half-body.jpg',
  'full-body.jpg',
  'busy-background.jpg',
  'anime-character.png',
  'pet.jpg',
  'logo-transparent.png',
  'pixel-sprite.png',
];

function readRgba(path) {
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
  const buf = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'],
    { maxBuffer: 64 << 20 }
  );
  return { width, height, rgba: [...buf] };
}

mkdirSync(OUT, { recursive: true });
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;

for (const file of FIXTURES) {
  const path = join(FIXTURE_DIR, file);
  if (!existsSync(path)) {
    console.warn('missing', path);
    continue;
  }
  const name = basename(file).replace(/\.[^.]+$/, '');
  if (only && !only.includes(name)) {
    console.log('skip', name);
    continue;
  }
  const dest = join(OUT, name);
  mkdirSync(dest, { recursive: true });
  console.log('gen', file);
  const { width, height, rgba } = readRgba(path);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`${LOCAL}/`, { waitUntil: 'load', timeout: 180000 });
    const pngB64 = await page.evaluate(
      async ({ width, height, rgba }) => {
        const t = Date.now();
        const { analyzeSource } = await import(
          `/src/lib/skin/vision.ts?t=${t}`
        );
        const { mapImageToSkin } = await import(
          `/src/lib/skin/normalize.ts?t=${t}`
        );
        const source = { width, height, pixels: new Uint8ClampedArray(rgba) };
        let analysis;
        try {
          analysis = await Promise.race([
            analyzeSource(source),
            new Promise((_, rej) =>
              setTimeout(() => rej(new Error('vision_timeout')), 25000)
            ),
          ]);
        } catch {
          analysis = undefined;
        }
        const tex = mapImageToSkin(source, 'java-64', 'classic', {
          kind: analysis?.kind,
          mask: analysis?.mask,
          hairMask: analysis?.hairMask,
          face: analysis?.face,
          crops: analysis?.poseCrops,
          maskSource: analysis?.maskSource,
        });
        const canvas = document.createElement('canvas');
        canvas.width = tex.width;
        canvas.height = tex.height;
        const ctx = canvas.getContext('2d');
        const img = ctx.createImageData(tex.width, tex.height);
        img.data.set(tex.pixels);
        ctx.putImageData(img, 0, 0);
        return {
          dataUrl: canvas.toDataURL('image/png'),
          meta: {
            kind: analysis?.kind,
            faceFound: analysis?.faceFound,
            maskSource: analysis?.maskSource,
          },
        };
      },
      { width, height, rgba }
    );
    writeFileSync(
      join(dest, 'skin.png'),
      Buffer.from(pngB64.dataUrl.split(',')[1], 'base64')
    );
    copyFileSync(
      path,
      join(dest, `original${file.endsWith('.png') ? '.png' : '.jpg'}`)
    );
    writeFileSync(
      join(dest, 'meta.json'),
      `${JSON.stringify(pngB64.meta, null, 2)}\n`
    );
    console.log('ok', name, pngB64.meta);
  } catch (err) {
    console.error('FAIL', file, err.message || err);
  }
  await browser.close().catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));
}
console.log('done');
