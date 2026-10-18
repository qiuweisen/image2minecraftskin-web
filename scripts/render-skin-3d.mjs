import { chromium } from '@playwright/test';
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const bundle = join(
  root,
  'node_modules/.pnpm/skinview3d@3.4.2/node_modules/skinview3d/bundles/skinview3d.bundle.js'
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 420 } });

async function renderOne(skinPath, outDir) {
  const dataUrl =
    'data:image/png;base64,' + readFileSync(skinPath).toString('base64');
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#18181b;display:flex;gap:8px;padding:8px">
<canvas id="front" width="420" height="380" style="background:#27272a"></canvas>
<canvas id="back" width="420" height="380" style="background:#27272a"></canvas>
</body></html>`);
  await page.addScriptTag({ path: bundle });
  await page.evaluate(async (dataUrl) => {
    const SV = window.skinview3d;
    const make = (id, z) => {
      const canvas = document.getElementById(id);
      const v = new SV.SkinViewer({
        canvas,
        width: 420,
        height: 380,
        skin: dataUrl,
        model: 'default',
      });
      v.camera.position.set(12, 8, z);
      v.autoRotate = false;
      v.animation = null;
      // Force a few frames
      for (let i = 0; i < 5; i++) v.render();
      return v;
    };
    window.__vf = make('front', 30);
    window.__vb = make('back', -30);
    await new Promise((r) => setTimeout(r, 500));
    window.__vf.render();
    window.__vb.render();
  }, dataUrl);
  await page
    .locator('#front')
    .screenshot({ path: join(outDir, 'front3d.png') });
  await page.locator('#back').screenshot({ path: join(outDir, 'back3d.png') });
  await page.evaluate(() => {
    window.__vf?.dispose?.();
    window.__vb?.dispose?.();
  });
}

const targets = process.argv.slice(2);
const bases = targets.length
  ? targets
  : ['docs/pr-screens/real-runs/new', 'docs/pr-screens/real-runs/prod'].filter(
      existsSync
    );

for (const base of bases) {
  for (const name of readdirSync(base)) {
    const dir = join(base, name);
    const skin = join(dir, 'skin.png');
    if (!existsSync(skin)) continue;
    process.stdout.write(`render ${dir} ... `);
    try {
      await renderOne(skin, dir);
      console.log('ok');
    } catch (e) {
      console.log('FAIL', e.message);
    }
  }
}
await browser.close();
