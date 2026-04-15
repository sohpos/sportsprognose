import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Dashboard
 * Tests that the dashboard renders correctly without visual regressions
 */
test.describe('Visual Regression - Dashboard', () => {
  test('dashboard snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for content to be visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Take screenshot for comparison
    await expect(page).toHaveScreenshot('dashboard.png', { maxDiffPixelRatio: 0.1 });
  });
});
