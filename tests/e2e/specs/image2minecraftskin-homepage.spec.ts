import { expect, test } from '@playwright/test';

test('converts an image locally and downloads a skin texture', async ({
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
  const authRequests: string[] = [];
  const uploadRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/auth/')) authRequests.push(request.url());
    if (request.method() === 'POST' && request.url().startsWith('http')) {
      uploadRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('heading', { name: /image to minecraft skin/i })
  ).toBeVisible();
  await expect(
    page.getByText(/turning portraits, character art, and pixel art/i)
  ).toBeVisible();
  await expect(
    page.getByText(/PNG \/ JPG \/ WEBP/i, { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /verified conversion case/i })
  ).toBeVisible();
  await expect(
    page.getByAltText(/aligned pixel character source/i)
  ).toBeVisible();
  await expect(page.getByAltText(/exported java 64x64 texture/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /inspect a skin in the 3d viewer/i })
  ).toHaveAttribute('href', '/minecraft-skin-viewer#skin-viewer');
  const schemaTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type'])
    );
  expect(schemaTypes).toEqual(
    expect.arrayContaining(['WebApplication', 'HowTo', 'FAQPage'])
  );

  const workspace = page.getByRole('region', {
    name: /minecraft skin generator/i,
  });
  await workspace.getByRole('button', { name: /try an example/i }).click();
  await expect(
    workspace.getByText('Skin ready', { exact: true })
  ).toBeVisible();
  await expect(workspace.getByRole('img').locator('canvas')).toBeVisible();
  const adjustButton = workspace.getByRole('button', {
    name: /adjust source/i,
  });
  await expect(adjustButton).toHaveAttribute('aria-expanded', 'false');
  await adjustButton.click();
  await expect(adjustButton).toHaveAttribute('aria-expanded', 'true');
  const zoom = workspace.getByRole('slider', { name: /zoom/i });
  await zoom.fill('1.4');
  await workspace.getByRole('button', { name: /reset framing/i }).click();
  await expect(zoom).toHaveValue('1');
  await expect(
    workspace.getByText(/rotate the model and check each side/i)
  ).toBeVisible();
  const bedrockButton = workspace.getByRole('button', { name: /bedrock/i });
  await bedrockButton.click();
  await expect(bedrockButton).toHaveAttribute('aria-pressed', 'true');

  const downloadPromise = page.waitForEvent('download');
  await workspace.getByRole('button', { name: /download png/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/bedrock-128.*\.png$/);
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
        name: 'skin_format_selected',
        data: { format: 'bedrock-128' },
      },
      {
        name: 'skin_downloaded',
        data: { format: 'bedrock-128', model: 'classic' },
      },
      {
        name: 'skin_source_adjustment_opened',
        data: { format: 'java-64', model: 'classic' },
      },
      {
        name: 'skin_source_adjusted',
        data: { axis: 'zoom', value: 1.4 },
      },
      { name: 'skin_source_adjustment_reset', data: {} },
    ])
  );
  expect(JSON.stringify(trackedEvents)).not.toMatch(/fileName|imageData/);
  expect(authRequests).toEqual([]);
  expect(uploadRequests).toEqual([]);
});
