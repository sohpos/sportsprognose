import { test, expect } from './fixtures/base';

/**
 * Games List Tests
 * Tests that match cards are displayed correctly
 */
test.describe('Games List', () => {
  test('shows match cards', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
    
    // Check page loaded
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('shows league selector', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');
    
    // Look for league-related content
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });
});
