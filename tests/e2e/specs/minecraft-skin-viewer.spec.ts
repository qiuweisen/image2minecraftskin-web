import { expect, test } from '@playwright/test';

test('previews an existing Minecraft skin without uploading it', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const tracked: Array<{
      name: string;
      data?: Record<string, unknown>;
    }> = [];
    Object.defineProperty(window, '__skinTrackedEvents', { value: tracked });
    Object.defineProperty(window, 'umami', {
      configurable: true,
      value: {
        track: (name: string, data?: Record<string, unknown>) =>
          tracked.push({ name, data }),
      },
    });
  });
  const uploadRequests: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().startsWith('http')) {
      uploadRequests.push(request.url());
    }
  });

  await page.goto('/minecraft-skin-viewer');
  await expect(
    page.getByRole('heading', { name: /preview your minecraft skin in 3d/i })
  ).toBeVisible();
  await expect(
    page.getByText(/renders the flat png texture on a player model/i)
  ).toBeVisible();
  await expect(
    page.getByText(/classic skins use four-pixel-wide arms/i)
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /create a skin from an image/i })
  ).toHaveAttribute('href', '/#generator');
  const schemaTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type'])
    );
  expect(schemaTypes).toEqual(
    expect.arrayContaining([
      'WebApplication',
      'BreadcrumbList',
      'HowTo',
      'FAQPage',
    ])
  );

  const exampleButton = page.getByRole('button', {
    name: /try an example skin/i,
  });
  await expect(exampleButton).toBeEnabled();
  await exampleButton.click();
  await expect(page.getByText('Skin ready', { exact: true })).toBeVisible();
  const workspace = page.getByRole('region', {
    name: 'Minecraft skin preview workspace',
  });
  await expect(
    workspace.getByText('Java 64x64', { exact: true })
  ).toBeVisible();
  const preview = workspace.getByRole('img', {
    name: 'Interactive 3D Minecraft skin preview',
  });
  await expect(preview.locator('canvas')).toBeVisible();

  const slimButton = page.getByRole('button', { name: 'Slim', exact: true });
  await slimButton.click();
  await expect(slimButton).toHaveAttribute('data-active', 'true');
  const trackedEvents = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __skinTrackedEvents: Array<{
            name: string;
            data?: Record<string, unknown>;
          }>;
        }
      ).__skinTrackedEvents
  );
  expect(trackedEvents).toEqual(
    expect.arrayContaining([
      {
        name: 'skin_viewer_ready',
        data: { format: 'java-64', width: 64, height: 64 },
      },
      {
        name: 'skin_viewer_model_selected',
        data: { model: 'slim' },
      },
    ])
  );
  expect(JSON.stringify(trackedEvents)).not.toMatch(/fileName|imageData/);
  expect(uploadRequests).toEqual([]);
});

test('shows a recoverable error for an unsupported PNG', async ({ page }) => {
  await page.goto('/minecraft-skin-viewer');
  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toBeEnabled();
  await fileInput.setInputFiles('public/logo.png');
  await expect(page.getByRole('alert')).toContainText(
    /must be 64x64 or 128x128|could not be opened/i
  );
});
