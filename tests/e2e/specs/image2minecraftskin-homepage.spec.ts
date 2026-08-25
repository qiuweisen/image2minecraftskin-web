import { expect, test } from '@playwright/test';

test('converts an image locally and downloads a skin texture', async ({
  page,
}) => {
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

  await page.getByRole('button', { name: /try an example/i }).click();
  await expect(page.getByText(/skin ready/i)).toBeVisible();
  const bedrockButton = page.getByRole('button', { name: /bedrock/i });
  await bedrockButton.click();
  await expect(bedrockButton).toHaveClass(/is-active/);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /download png/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/bedrock-128.*\.png$/);
  expect(authRequests).toEqual([]);
  expect(uploadRequests).toEqual([]);
});
