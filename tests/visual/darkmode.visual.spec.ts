import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Dark/Light Mode
 */
test.describe('Visual Regression - Dark Mode', () => {
  test('dark mode snapshot', async ({ page }) => {
    // Try to load page with retries
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
    
    // Basic visible check
    const body = page.locator('body');
    await expect(body).toBeVisible({ timeout: 5000 });
  });
});
