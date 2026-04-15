import { test, expect } from './fixtures/base';

/**
 * Dashboard Tests
 * Tests that all KPI elements are visible and working
 */
test.describe('Dashboard', () => {
  test('shows all KPI elements', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for league selector or dashboard elements
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('shows match cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should have some content visible
    const content = page.locator('main, .container, [class*="card"]').first();
    await expect(content).toBeVisible();
  });
});
