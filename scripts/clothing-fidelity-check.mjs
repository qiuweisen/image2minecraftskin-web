/**
 * Compare photo clothing dominant color (masked mid-body band) vs skin torso front.
 * Uses a simple CIE76 deltaE on sRGB→Lab approximation.
 */
import { execFileSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const FIXTURES = [
  'portrait-selfie',
  'half-body',
  'full-body',
  'busy-background',
  'anime-character',
  'pet',
  'logo-transparent',
  'pixel-sprite',
];

function readRgba(path) {
  const probe = execFileSync(
    'ffprobe',
    ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0:s=x', path],
    { encoding: 'utf8' }
  ).trim();
  const [width, height] = probe.split('x').map(Number);
  const pixels = new Uint8ClampedArray(
    execFileSync('ffmpeg', ['-v','error','-i', path, '-f','rawvideo','-pix_fmt','rgba','-'], {
      maxBuffer: 64 << 20,
    })
  );
  return { width, height, pixels };
}

function srgbToLab([r, g, b]) {
  const lin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r), G = lin(g), B = lin(b);
  let x = R * 0.4124 + G * 0.3576 + B * 0.1805;
  let y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  let z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  x /= 0.95047; y /= 1; z /= 1.08883;
  const f = (t) => (t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116);
  const fx = f(x), fy = f(y), fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function deltaE(a, b) {
  const A = srgbToLab(a), B = srgbToLab(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
}

function dominantInBand(img, y0, y1, x0 = 0.2, x1 = 0.8) {
  const bins = new Map();
  const X0 = Math.floor(img.width * x0);
  const X1 = Math.floor(img.width * x1);
  const Y0 = Math.floor(img.height * y0);
  const Y1 = Math.floor(img.height * y1);
  for (let y = Y0; y < Y1; y += 2)
    for (let x = X0; x < X1; x += 2) {
      const i = (y * img.width + x) * 4;
      if ((img.pixels[i + 3] ?? 255) < 16) continue;
      const key = ((img.pixels[i] >> 4) << 8) | ((img.pixels[i + 1] >> 4) << 4) | (img.pixels[i + 2] >> 4);
      bins.set(key, (bins.get(key) ?? 0) + 1);
    }
  const key = [...bins].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0x888;
  return [((key >> 8) & 15) * 17, ((key >> 4) & 15) * 17, (key & 15) * 17];
}

function skinTorso(path) {
  const img = readRgba(path);
  // classic torso front center around (24,26) on 64 grid
  const s = img.width / 64;
  const bins = new Map();
  for (let y = Math.floor(20 * s); y < Math.floor(32 * s); y++)
    for (let x = Math.floor(20 * s); x < Math.floor(28 * s); x++) {
      const i = (y * img.width + x) * 4;
      const key = ((img.pixels[i] >> 4) << 8) | ((img.pixels[i + 1] >> 4) << 4) | (img.pixels[i + 2] >> 4);
      bins.set(key, (bins.get(key) ?? 0) + 1);
    }
  const key = [...bins].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0x888;
  return [((key >> 8) & 15) * 17, ((key >> 4) & 15) * 17, (key & 15) * 17];
}

const rows = [];
for (const name of FIXTURES) {
  const origJpg = `docs/pr-screens/fixtures/real/${name}.jpg`;
  const origPng = `docs/pr-screens/fixtures/real/${name}.png`;
  const orig = existsSync(origJpg) ? origJpg : origPng;
  const newSkin = `docs/pr-screens/real-runs/new/${name}/skin.png`;
  const prodSkin = `docs/pr-screens/real-runs/prod/${name}/skin.png`;
  if (!existsSync(orig) || !existsSync(newSkin) || !existsSync(prodSkin)) {
    rows.push({ name, error: 'missing files' });
    continue;
  }
  const photo = readRgba(orig);
  const clothes = dominantInBand(photo, 0.4, 0.85);
  const n = skinTorso(newSkin);
  const p = skinTorso(prodSkin);
  const dNew = deltaE(clothes, n);
  const dProd = deltaE(clothes, p);
  const prefer =
    dNew + 3 < dProd ? 'new' : dProd + 3 < dNew ? 'prod' : 'tie';
  const passPeople =
    !['portrait-selfie', 'half-body', 'full-body'].includes(name) ||
    (dNew <= 35 || dNew <= dProd + 5);
  rows.push({
    name,
    clothes,
    newTorso: n,
    prodTorso: p,
    deltaE_new: Math.round(dNew * 10) / 10,
    deltaE_prod: Math.round(dProd * 10) / 10,
    prefer,
    passPeople,
  });
}

const out = 'docs/pr-screens/clothing-fidelity.json';
writeFileSync(out, JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows, null, 2));
const people = rows.filter((r) =>
  ['portrait-selfie', 'half-body', 'full-body'].includes(r.name)
);
const peopleOk = people.every((r) => r.passPeople);
const newWins = rows.filter((r) => r.prefer === 'new').length;
console.log('\npeople_pass', peopleOk, 'new_wins', newWins, '/', rows.length);
process.exit(peopleOk ? 0 : 2);
