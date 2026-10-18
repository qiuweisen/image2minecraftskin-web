/**
 * Sequential Playwright acceptance: upload real fixtures through the UI,
 * wait for MediaPipe-backed generation, capture skin PNG + 3D front/back,
 * compare local (new) vs production, rebuild contact sheets.
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { execFileSync } from 'child_process';

const FIXTURE_DIR = 'docs/pr-screens/fixtures/real';
const OUT_DIR = 'docs/pr-screens/real-runs';
const CONTACT_DIR = 'docs/pr-screens';
const LOCAL = process.env.ACCEPT_LOCAL_URL || 'http://127.0.0.1:3015';
const PROD = process.env.ACCEPT_PROD_URL || 'https://image2minecraftskin.com';

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

mkdirSync(OUT_DIR, { recursive: true });

function slug(name) {
  return basename(name).replace(/\.[^.]+$/, '');
}

async function captureRun(page, baseUrl, label, fixturePath) {
  const name = slug(fixturePath);
  const destDir = join(OUT_DIR, label, name);
  mkdirSync(destDir, { recursive: true });

  await page.goto(baseUrl + '/', { waitUntil: 'networkidle', timeout: 120000 });
  // Dismiss cookie/dialog if any
  for (const text of [/accept/i, /got it/i, /close/i]) {
    const btn = page.getByRole('button', { name: text }).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
    }
  }

  const workspace = page.getByRole('region', {
    name: /minecraft skin generator/i,
  });
  await workspace.waitFor({ state: 'visible', timeout: 60000 });

  const fileInput = workspace.locator('input[type="file"]');
  await fileInput.setInputFiles(fixturePath);

  // Wait for models + generation. Prefer "Skin ready"; also accept localized variants.
  await workspace.getByText(/skin ready/i).first().waitFor({ state: 'visible', timeout: 90000 });
  // Wait until 3D canvases have painted (non-empty pixels)
  await page.waitForFunction(() => {
    const canvases = [...document.querySelectorAll('[role="region"] canvas')];
    const painted = canvases.filter((c) => {
      try {
        const ctx = c.getContext('2d');
        if (!ctx || c.width < 8) return false;
        const d = ctx.getImageData(c.width >> 1, c.height >> 1, 1, 1).data;
        return d[3] > 0 && (d[0] + d[1] + d[2] > 0);
      } catch {
        // WebGL canvas — assume ready if sized
        return c.width > 64 && c.height > 64;
      }
    });
    return painted.length >= 2;
  }, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // Download skin PNG
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await workspace
    .getByRole('button', { name: /download (png|java|bedrock)/i })
    .last()
    .click();
  const download = await downloadPromise;
  const skinPath = join(destDir, 'skin.png');
  await download.saveAs(skinPath);

  // WebGL canvases often yield blank toDataURL without preserveDrawingBuffer.
  // Screenshot the Front/Back columns instead.
  const preview = workspace.locator('[role="img"]').filter({ has: page.locator('canvas') }).first();
  const cols = preview.locator('div.grid > div');
  const colCount = await cols.count();
  if (colCount >= 2) {
    await cols.nth(0).screenshot({ path: join(destDir, 'front3d.png') });
    await cols.nth(1).screenshot({ path: join(destDir, 'back3d.png') });
  } else {
    await preview.screenshot({ path: join(destDir, 'preview.png') }).catch(() => {});
  }
  await preview.screenshot({ path: join(destDir, 'preview.png') }).catch(() => {});

  // Copy original
  const origBuf = readFileSync(fixturePath);
  writeFileSync(join(destDir, 'original' + fixturePath.slice(fixturePath.lastIndexOf('.'))), origBuf);

  return { name, destDir, skinPath };
}

function composeContact(name) {
  const origCandidates = FIXTURES.map((f) => join(FIXTURE_DIR, f)).filter(
    (p) => slug(p) === name
  );
  const original = origCandidates[0];
  const prodSkin = join(OUT_DIR, 'prod', name, 'skin.png');
  const newSkin = join(OUT_DIR, 'new', name, 'skin.png');
  const prodFront = join(OUT_DIR, 'prod', name, 'front3d.png');
  const newFront = join(OUT_DIR, 'new', name, 'front3d.png');
  const prodBack = join(OUT_DIR, 'prod', name, 'back3d.png');
  const newBack = join(OUT_DIR, 'new', name, 'back3d.png');
  const out = join(CONTACT_DIR, `contact-real-${name}.png`);

  const inputs = [original, prodSkin, newSkin, prodFront, newFront, prodBack, newBack]
    .filter((p) => p && existsSync(p));
  if (inputs.length < 3) {
    console.warn('skip contact', name, 'missing inputs', inputs.length);
    return null;
  }

  // Build a labeled sheet with ffmpeg: row1 original|prod skin|new skin
  // row2 prod front|new front|prod back|new back — scale each to 256 tall
  const scaled = inputs.map((p, i) => {
    const tmp = join(OUT_DIR, `_s${i}-${name}.png`);
    execFileSync('ffmpeg', [
      '-v', 'error', '-y', '-i', p,
      '-vf', 'scale=-1:256',
      tmp,
    ]);
    return tmp;
  });

  // Use montage if available, else ffmpeg hstack/vstack
  try {
    execFileSync('montage', [
      ...scaled.slice(0, 3),
      ...scaled.slice(3),
      '-tile', '3x',
      '-geometry', '+4+4',
      '-background', '#1a1a1a',
      '-label', '%t',
      out,
    ]);
  } catch {
    // Fallback: horizontal stack of first 3, then rest
    const row1 = join(OUT_DIR, `_row1-${name}.png`);
    const row1Inputs = scaled.slice(0, Math.min(3, scaled.length));
    if (row1Inputs.length === 1) {
      execFileSync('cp', [row1Inputs[0], row1]);
    } else {
      execFileSync('ffmpeg', [
        '-v', 'error', '-y',
        ...row1Inputs.flatMap((p) => ['-i', p]),
        '-filter_complex',
        `hstack=inputs=${row1Inputs.length}`,
        row1,
      ]);
    }
    if (scaled.length > 3) {
      const row2 = join(OUT_DIR, `_row2-${name}.png`);
      const row2Inputs = scaled.slice(3);
      execFileSync('ffmpeg', [
        '-v', 'error', '-y',
        ...row2Inputs.flatMap((p) => ['-i', p]),
        '-filter_complex',
        `hstack=inputs=${row2Inputs.length}`,
        row2,
      ]);
      execFileSync('ffmpeg', [
        '-v', 'error', '-y', '-i', row1, '-i', row2,
        '-filter_complex', 'vstack=inputs=2',
        out,
      ]);
    } else {
      execFileSync('cp', [row1, out]);
    }
  }
  console.log('wrote', out);
  return out;
}

async function runAgainst(label, baseUrl) {
  console.log(`\n=== ${label} @ ${baseUrl} ===`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  const results = [];
  for (const file of FIXTURES) {
    const path = join(FIXTURE_DIR, file);
    if (!existsSync(path)) {
      console.warn('missing fixture', path);
      continue;
    }
    console.log('upload', file);
    try {
      const r = await captureRun(page, baseUrl, label, path);
      console.log('ok', r.destDir);
      results.push(r);
    } catch (err) {
      console.error('FAIL', file, err.message || err);
      await page.screenshot({
        path: join(OUT_DIR, `${label}-${slug(file)}-error.png`),
        fullPage: true,
      }).catch(() => {});
    }
  }
  await browser.close();
  return results;
}

const mode = process.argv[2] || 'all';
if (mode === 'local' || mode === 'all') {
  await runAgainst('new', LOCAL);
}
if (mode === 'prod' || mode === 'all') {
  await runAgainst('prod', PROD);
}
if (mode === 'contact' || mode === 'all') {
  for (const file of FIXTURES) {
    composeContact(slug(file));
  }
}
console.log('done');
