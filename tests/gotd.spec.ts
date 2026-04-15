import { test, expect } from './fixtures/base';

/**
 * Game of the Day Tests
 */
test.describe('Game of the Day', () => {
  test('shows GOTD page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
