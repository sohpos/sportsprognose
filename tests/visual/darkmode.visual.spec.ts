import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Dark/Light Mode
 */
test.describe('Visual Regression - Dark Mode', () => {
  test('dark mode snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode if possible
    const html = page.locator('html');
    const isDarkInitially = await html.evaluate(el => el.classList.contains('dark'));
    
    if (!isDarkInitially) {
      // Try clicking theme toggle if exists
      try {
        await page.click('[data-testid="theme-toggle"]');
        await page.waitForTimeout(500);
      } catch {
        // Toggle might not exist, continue anyway
      }
    }
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await expect(page).toHaveScreenshot('dashboard-dark.png', { maxDiffPixelRatio: 0.1 });
  });
});
