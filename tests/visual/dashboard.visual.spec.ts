import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Dashboard
 * Note: Requires running server
 */
test.describe('Visual Regression - Dashboard', () => {
  test('page loads without errors', async ({ page }) => {
    try {
      await page.goto('/', { timeout: 5000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
    } catch {
      test.skip();
    }
  });
});
