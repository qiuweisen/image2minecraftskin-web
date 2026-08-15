import { expect, test } from '@playwright/test';
import {
  expectHealthyPage,
  installPageHealthMonitor,
  localizedPath,
  setTheme,
  type LocaleMode,
  type ThemeMode,
} from '../fixtures/page-health';

const publicPages = [
  { path: '/', name: 'home' },
  { path: '/pricing', name: 'pricing' },
  { path: '/blog', name: 'blog index' },
  { path: '/blog/getting-started', name: 'blog detail' },
  { path: '/ai', name: 'ai playground' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/changelog', name: 'changelog' },
  { path: '/roadmap', name: 'roadmap' },
  { path: '/waitlist', name: 'waitlist' },
  { path: '/cookie', name: 'cookie policy' },
  { path: '/privacy', name: 'privacy policy' },
  { path: '/terms', name: 'terms of service' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/register', name: 'register' },
  { path: '/auth/forgot-password', name: 'forgot password' },
  { path: '/auth/reset-password', name: 'reset password' },
] as const;

const smokeMatrix: Array<{ locale: LocaleMode; theme: ThemeMode }> = [
  { locale: 'en', theme: 'dark' },
  { locale: 'en', theme: 'light' },
  { locale: 'zh', theme: 'dark' },
  { locale: 'zh', theme: 'light' },
];

test.describe('public page smoke coverage', () => {
  for (const { locale, theme } of smokeMatrix) {
    test(`renders all public pages in ${locale}/${theme}`, async ({ page }) => {
      await setTheme(page, theme);
      const monitor = installPageHealthMonitor(page);

      for (const publicPage of publicPages) {
        await test.step(publicPage.name, async () => {
          await expectHealthyPage(
            page,
            monitor,
            localizedPath(publicPage.path, locale),
            { theme }
          );
        });
      }
    });
  }

  test('opens the home page login modal', async ({ page }) => {
    await setTheme(page, 'dark');
    const monitor = installPageHealthMonitor(page);

    await expectHealthyPage(page, monitor, '/', { theme: 'dark' });
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /^log in$/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[name="email"]')).toBeVisible();
    await expect(dialog.locator('input[name="password"]')).toBeVisible();
    monitor.expectNoErrors('home login modal');
  });

  test('shows mobile navbar controls and opens the menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setTheme(page, 'dark');
    const monitor = installPageHealthMonitor(page);

    await expectHealthyPage(page, monitor, '/', { theme: 'dark' });

    const mobileHeader = page.locator('header');
    await expect(
      mobileHeader.getByRole('button', { name: /language/i }).last()
    ).toBeVisible();
    await expect(
      mobileHeader.getByRole('button', { name: /toggle theme/i }).last()
    ).toBeVisible();

    await page.getByRole('button', { name: /toggle menu/i }).click();

    const mobileNavigation = page.getByRole('dialog', {
      name: /mobile navigation/i,
    });
    await expect(mobileNavigation).toBeVisible();

    const box = await mobileNavigation.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(0);
  });

  test('hides simulator links from mobile simulator pages', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setTheme(page, 'dark');
    const monitor = installPageHealthMonitor(page);

    for (const path of ['/play', '/day-trading-simulator']) {
      await expectHealthyPage(page, monitor, path, { theme: 'dark' });

      const simulatorHeader = page.locator('header');
      await expect(
        simulatorHeader.getByRole('link', { name: /daily replay/i })
      ).toBeHidden();
      await expect(
        simulatorHeader.getByRole('link', { name: /day trading/i })
      ).toBeHidden();
      await expect(
        simulatorHeader.getByRole('button', { name: /language/i })
      ).toBeVisible();
      await expect(
        simulatorHeader.getByRole('button', { name: /toggle theme/i })
      ).toBeVisible();
    }
  });

  test('renders the article practice modes card with both destinations', async ({
    page,
  }) => {
    await setTheme(page, 'light');
    const monitor = installPageHealthMonitor(page);

    await expectHealthyPage(
      page,
      monitor,
      '/blog/why-practice-trading-matters-simulate-before-you-risk-real-money-2026',
      { theme: 'light' }
    );

    const practiceCard = page.getByTestId('blog-practice-modes');
    await expect(practiceCard).toBeVisible();
    await expect(
      practiceCard.getByRole('link', { name: /daily replay/i })
    ).toHaveAttribute('href', '/play');
    await expect(
      practiceCard.getByRole('link', { name: /day trading simulator/i })
    ).toHaveAttribute('href', '/day-trading-simulator');
    monitor.expectNoErrors('article practice modes card');
  });

  test('health check responds with pong', async ({ request }) => {
    const response = await request.get('/api/ping');

    await expect(response).toBeOK();
    expect(await response.json()).toEqual({ message: 'pong' });
  });
});
