import { test, expect } from './fixtures/base';

/**
 * Navigation Tests
 */
test.describe('Navigation', () => {
  test('navigates between pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('can access matches page', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('can access team page', async ({ page }) => {
    await page.goto('/team/1');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
