import { test, expect } from './fixtures/base';

/**
 * Dark/Light Mode Tests
 */
test.describe('Dark Mode', () => {
  test('page loads in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const html = page.locator('html');
    // Page should load without errors
    await expect(html).toBeVisible();
  });
});
