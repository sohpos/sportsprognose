import { test, expect } from './fixtures/base';

/**
 * Team Detail Page Tests
 */
test.describe('Team Detail', () => {
  test('shows team page', async ({ page }) => {
    await page.goto('/team/1');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
