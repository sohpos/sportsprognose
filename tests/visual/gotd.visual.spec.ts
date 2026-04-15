import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Game of the Day
 */
test.describe('Visual Regression - GOTD', () => {
  test('gotd snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await expect(page).toHaveScreenshot('gotd.png', { maxDiffPixelRatio: 0.1 });
  });
});
