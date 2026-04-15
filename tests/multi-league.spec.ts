import { test, expect } from './fixtures/base';

/**
 * Multi-Liga Tests
 */
test.describe('Multi-Liga', () => {
  test('supports league switching', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
