import { expect, test } from '@playwright/test';

test('previews an existing Minecraft skin without uploading it', async ({
  page,
}) => {
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
