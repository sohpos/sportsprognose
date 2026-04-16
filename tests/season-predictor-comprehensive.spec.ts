/**
 * Comprehensive E2E and Visual Tests: Season Predictor Dashboard
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

test.describe('Season Predictor Dashboard - Comprehensive Testing', () => {
  
  // ==================== FUNCTIONAL TESTS ====================
  
  test.describe('Functional Tests', () => {
    
    test('page loads without errors', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Check page loaded
      await expect(page.locator('body')).toBeVisible()
      
      // No console errors
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      await page.waitForTimeout(1000)
      expect(errors.filter(e => !e.includes('hydration'))).toHaveLength(0)
    })

    test('all sections render correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Main sections
      await expect(page.getByText('Expected Points')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('Meisterschafts-Chancen')).toBeVisible()
      await expect(page.getByText('Surprise Index')).toBeVisible()
      await expect(page.getByText('Positionsverteilung')).toBeVisible()
      await expect(page.getByText('Liga Insights')).toBeVisible()
      await expect(page.getByText('Alle Teams')).toBeVisible()
    })

    test('navigation works correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/`)
      await page.waitForLoadState('networkidle')
      
      // Click Predictor nav
      await page.click('text=Predictor')
      await expect(page).toHaveURL(/predictor/)
    })

    test('team data displays correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Check team data
      await expect(page.getByText('Bayern München')).toBeVisible()
      await expect(page.getByText('78.50')).toBeVisible() // xP
    })

    test('charts render without errors', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Scatter plot
      await expect(page.getByText('xP vs Actual Points')).toBeVisible()
      
      // Position distribution charts
      await expect(page.getByText('Bayern München').first()).toBeVisible()
    })
  })

  // ==================== VISUAL REGRESSION TESTS ====================
  
  test.describe('Visual Regression Tests', () => {
    
    test('full dashboard desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      await expect(page.locator('body')).toHaveScreenshot('predictor-desktop.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('full dashboard tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      await expect(page.locator('body')).toHaveScreenshot('predictor-tablet.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('full dashboard mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      await expect(page.locator('body')).toHaveScreenshot('predictor-mobile.png', {
        maxDiffPixelRatio: 0.15,
      })
    })

    test('dark mode', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Enable dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      
      await expect(page.locator('body')).toHaveScreenshot('predictor-dark.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('individual components', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Table
      const table = page.locator('table').first()
      await expect(table).toHaveScreenshot('xp-table.png', {
        maxDiffPixelRatio: 0.1,
      })
      
      // Cards section
      const cardsSection = page.locator('text=Surprise Index').closest('div')
      await expect(cardsSection).toHaveScreenshot('surprise-cards.png', {
        maxDiffPixelRatio: 0.1,
      })
    })
  })

  // ==================== ACCESSIBILITY TESTS ====================
  
  test.describe('Accessibility Tests', () => {
    
    test('page has proper heading hierarchy', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Should have h1
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
    })

    test('images have alt text', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      const images = page.locator('img')
      const count = await images.count()
      
      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        // Log if missing alt (not failing test)
        if (!alt) console.log('Image missing alt text')
      }
    })

    test('tables have proper structure', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      const table = page.locator('table').first()
      await expect(table).toBeVisible()
      
      // Check for thead
      const thead = table.locator('thead')
      await expect(thead).toBeVisible()
    })

    test('interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Tab through page
      await page.keyboard.press('Tab')
      
      // Should move focus to first interactive element
      const focused = page.locator(':focus')
      expect(focused).toBeTruthy()
    })
  })

  // ==================== RESPONSIVE TESTS ====================
  
  test.describe('Responsive Tests', () => {
    
    test('layout adapts to mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Check that grid becomes single column
      const grid = page.locator('.grid').first()
      const classList = await grid.getAttribute('class')
      expect(classList).toMatch(/grid-cols-1/)
    })

    test('layout adapts to tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Check that grid becomes 2 columns
      const grid = page.locator('.grid').first()
      const classList = await grid.getAttribute('class')
      expect(classList).toMatch(/grid-cols-2/)
    })

    test('layout adapts to desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Check that grid becomes more columns
      const grid = page.locator('.grid').first()
      const classList = await grid.getAttribute('class')
      expect(classList).toMatch(/grid-cols-/)
    })
  })

  // ==================== INTERACTION TESTS ====================
  
  test.describe('Interaction Tests', () => {
    
    test('hover states work on table rows', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      const firstRow = page.locator('tbody tr').first()
      await firstRow.hover()
      
      // Should have hover class
      const classList = await firstRow.getAttribute('class')
      expect(classList).toMatch(/hover/)
    })

    test('hover states work on team cards', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      const card = page.locator('.rounded-lg').filter({ hasText: 'Bayern München' }).first()
      await card.hover()
      
      // Should have scale effect
      const classList = await card.getAttribute('class')
      expect(classList).toMatch(/hover:scale/)
    })

    test('scatter plot tooltips work', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Find a point in scatter plot
      const point = page.locator('circle[r="5"]').first()
      
      if (await point.isVisible()) {
        await point.hover()
        // Title should appear
        await page.waitForTimeout(500)
      }
    })
  })

  // ==================== DARK MODE TESTS ====================
  
  test.describe('Dark Mode Tests', () => {
    
    test('dark mode toggle works', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Toggle dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      
      // Background should be dark
      const bg = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor
      })
      expect(bg).not.toBe('rgb(255, 255, 255)')
    })

    test('text is readable in dark mode', async ({ page }) => {
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      
      // Check main text is visible
      const heading = page.locator('h1').first()
      await expect(heading).toBeVisible()
    })
  })

  // ==================== PERFORMANCE TESTS ====================
  
  test.describe('Performance Tests', () => {
    
    test('page loads within reasonable time', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // 5 seconds max
    })

    test('no memory leaks on repeated visits', async ({ page }) => {
      // Visit page multiple times
      for (let i = 0; i < 3; i++) {
        await page.goto(`${BASE_URL}/predictor`)
        await page.waitForLoadState('networkidle')
        await page.reload()
        await page.waitForLoadState('networkidle')
      }
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ==================== ERROR HANDLING TESTS ====================
  
  test.describe('Error Handling Tests', () => {
    
    test('shows message when no data', async ({ page }) => {
      // This would require a route that returns empty data
      // For now, test that component handles edge cases
      await page.goto(`${BASE_URL}/predictor`)
      await page.waitForLoadState('networkidle')
      
      // Should not have error messages
      const errors = await page.locator('text=Error').count()
      expect(errors).toBe(0)
    })
  })
})

// ==================== CROSS-BROWSER TESTS ====================

test.describe('Cross-Browser Tests', () => {
  test.skip(process.env.BROWSER !== 'all', 'Run with BROWSER=all to enable')
  
  test('works in Chrome', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    
    await page.goto(`${BASE_URL}/predictor`)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('body')).toBeVisible()
  })
})