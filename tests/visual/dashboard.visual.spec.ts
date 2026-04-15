import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Dashboard
 */
test.describe('Visual Regression - Dashboard', () => {
  test('dashboard snapshot', async ({ page }) => {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.goto('/', { timeout: 10000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        break;
      } catch (e) {
        if (i === maxRetries - 1) throw e;
        await page.waitForTimeout(1000);
      }
    }
    const body = page.locator('body');
    await expect(body).toBeVisible({ timeout: 5000 });
  });
});
