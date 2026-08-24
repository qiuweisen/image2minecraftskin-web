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
  await expect(
    page.getByRole('heading', { name: /image to minecraft skin/i })
  ).toBeVisible();

  await page.getByRole('button', { name: /use example/i }).click();
  await expect(page.getByText(/skin ready/i)).toBeVisible();
  await page.getByRole('button', { name: /bedrock/i }).click();
  await expect(page.getByText('128')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /download png/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/bedrock-128.*\.png$/);
  expect(authRequests).toEqual([]);
  expect(uploadRequests).toEqual([]);
});
