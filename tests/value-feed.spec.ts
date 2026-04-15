import { test, expect } from './fixtures/base';

/**
 * Value Feed Tests
 */
test.describe('Value Feed', () => {
  test('shows value feed page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
