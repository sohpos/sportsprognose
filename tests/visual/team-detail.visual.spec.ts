import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Team Detail
 */
test.describe('Visual Regression - Team Detail', () => {
  test('team detail snapshot', async ({ page }) => {
    await page.goto('/team/1');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await expect(page).toHaveScreenshot('team-detail.png', { maxDiffPixelRatio: 0.1 });
  });
});
