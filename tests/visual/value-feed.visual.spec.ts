import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Value Feed
 */
test.describe('Visual Regression - Value Feed', () => {
  test('value feed snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await expect(page).toHaveScreenshot('value-feed.png', { maxDiffPixelRatio: 0.1 });
  });
});
