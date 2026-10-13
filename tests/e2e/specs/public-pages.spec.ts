import { expect, test } from '@playwright/test';
import {
  expectHealthyPage,
  installPageHealthMonitor,
  setTheme,
} from '../fixtures/page-health';

const publicPages = [
  { path: '/', name: 'home' },
  { path: '/minecraft-skin-viewer', name: 'Minecraft skin viewer' },
  { path: '/image-to-minecraft-skin', name: 'image-to-skin guide' },
  { path: '/minecraft-skin-formats', name: 'skin formats guide' },
  { path: '/privacy', name: 'privacy policy' },
  { path: '/terms', name: 'terms of service' },
] as const;

test.describe('public page smoke coverage', () => {
  test('renders the current public pages', async ({ page }) => {
    await setTheme(page, 'dark');
    const monitor = installPageHealthMonitor(page);

    for (const publicPage of publicPages) {
      await test.step(publicPage.name, async () => {
        await expectHealthyPage(page, monitor, publicPage.path, {
          theme: 'dark',
        });
      });
    }
  });

  test('tool pages expose distinct search intent and canonical URLs', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /image to minecraft skin/i })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/$/
    );

    await page.goto('/minecraft-skin-viewer');
    await expect(
      page.getByRole('heading', { name: /preview your minecraft skin in 3d/i })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/minecraft-skin-viewer$/
    );
  });

  test('machine-readable discovery describes only the current product', async ({
    request,
  }) => {
    const llmsResponse = await request.get('/llms.txt');
    await expect(llmsResponse).toBeOK();
    const llms = await llmsResponse.text();
    expect(llms).toContain('# image2minecraftskin');
    expect(llms).toContain('https://image2minecraftskin.com/');
    expect(llms).toContain('/minecraft-skin-viewer');
    expect(llms).not.toMatch(/ChartMini|trading|ASCII/i);

    const response = await request.get('/sitemap.xml');
    await expect(response).toBeOK();
    const sitemap = await response.text();
    expect(sitemap).toContain('<loc>http://localhost:3000/</loc><lastmod>');
    expect(sitemap).toContain(
      '<loc>http://localhost:3000/minecraft-skin-viewer</loc><lastmod>'
    );
    expect(sitemap).toContain(
      '<loc>http://localhost:3000/image-to-minecraft-skin</loc><lastmod>'
    );
    expect(sitemap).toContain('hreflang="ja"');
    expect(sitemap).toContain(
      'hreflang="pt-BR" href="http://localhost:3000/pt-BR/minecraft-skin-viewer"'
    );
    expect(sitemap).not.toContain('ascii-art-for-');
  });

  test('localized SEO guide renders translated SSR metadata and content', async ({
    page,
  }) => {
    await page.goto('/ja/minecraft-skin-formats');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page).toHaveTitle(/Minecraftスキンのサイズと形式ガイド/);
    await expect(
      page.getByRole('heading', { name: /Minecraftスキンのサイズと形式ガイド/ })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/ja\/minecraft-skin-formats$/
    );
  });
});
