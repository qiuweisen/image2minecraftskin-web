import { execFileSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

function readRgba(path) {
  const probe = execFileSync(
    'ffprobe',
    ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0:s=x', path],
    { encoding: 'utf8' }
  ).trim();
  const [width, height] = probe.split('x').map(Number);
  const pixels = new Uint8ClampedArray(
    execFileSync('ffmpeg', ['-v','error','-i', path, '-f','rawvideo','-pix_fmt','rgba','-'], { maxBuffer: 32 << 20 })
  );
  return { width, height, pixels };
}

// Classic 64 base regions (mirrors layouts.ts)
function regions(armW = 4) {
  const head = [[8,0,8,8],[16,0,8,8],[0,8,8,8],[8,8,8,8],[16,8,8,8],[24,8,8,8]];
  const torso = [[20,16,8,4],[28,16,8,4],[16,20,4,12],[20,20,8,12],[28,20,4,12],[32,20,8,12]];
  const limb = (x,y,w) => [[x+4,y,w,4],[x+4+w,y,w,4],[x,y+4,4,12],[x+4,y+4,w,12],[x+4+w,y+4,4,12],[x+8+w,y+4,w,12]];
  return [...head, ...torso, ...limb(40,16,armW), ...limb(0,16,4), ...limb(16,48,4), ...limb(32,48,armW)];
}

// Intentional eyes from faceDetails (java-64)
const EYES = new Set(['10,12','10,13','13,12','13,13']);

function check(path) {
  const img = readRgba(path);
  const s = img.width / 64;
  let bad = 0;
  const samples = [];
  for (const [x0,y0,rw,rh] of regions()) {
    for (let y = y0; y < y0 + rh; y++)
      for (let x = x0; x < x0 + rw; x++) {
        if (EYES.has(`${x},${y}`)) continue;
        const i = (Math.floor(y * s) * img.width + Math.floor(x * s)) * 4;
        const r = img.pixels[i], g = img.pixels[i+1], b = img.pixels[i+2], a = img.pixels[i+3];
        if (a < 255 || r + g + b <= 30) {
          bad++;
          if (samples.length < 8) samples.push({ x, y, r, g, b, a });
        }
      }
  }
  return { bad, samples };
}

const dir = process.argv[2] || 'docs/pr-screens/real-runs/new';
let failed = 0;
for (const name of readdirSync(dir)) {
  const skin = join(dir, name, 'skin.png');
  if (!existsSync(skin)) continue;
  const { bad, samples } = check(skin);
  const ok = bad === 0;
  console.log(ok ? 'PASS' : 'FAIL', name, 'bad=', bad, samples);
  if (!ok) failed++;
}
process.exit(failed ? 2 : 0);
