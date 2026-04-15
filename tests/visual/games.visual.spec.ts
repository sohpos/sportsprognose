import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Games List
 */
test.describe('Visual Regression - Games', () => {
  test('games list snapshot', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await expect(page).toHaveScreenshot('games.png', { maxDiffPixelRatio: 0.1 });
  });
});
