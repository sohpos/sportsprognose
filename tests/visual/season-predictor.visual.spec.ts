/**
 * Visual Regression Tests: Season Predictor Components
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

test.describe('Visual Regression: Season Predictor', () => {
  
  test.describe('Charts', () => {
    
    test('ScatterPlotXPvsActual renders correctly', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=xP vs Actual Points')
      
      const scatterPlot = page.locator('svg').first()
      await expect(scatterPlot).toHaveScreenshot('scatterplot.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('PositionDistributionChart heatmap renders correctly', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Bayern')
      
      const charts = page.locator('.rounded-xl').filter({ hasText: 'Bayern' })
      const firstChart = charts.first()
      await expect(firstChart).toHaveScreenshot('position-distribution-bayern.png', {
        maxDiffPixelRatio: 0.1,
      })
    })
  })

  test.describe('Cards & Grid Components', () => {
    
    test('TeamInsightCard full mode renders correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/team/1`)
      await page.waitForSelector('text=Expected Points')
      
      const card = page.locator('.rounded-xl').first()
      await expect(card).toHaveScreenshot('team-insight-card-full.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('TeamInsightCard compact mode renders correctly', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Luck Factor')
      
      const cards = page.locator('.rounded-xl').filter({ hasText: 'Bayern' })
      const firstCard = cards.first()
      await expect(firstCard).toHaveScreenshot('team-insight-card-compact.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('SurpriseIndex cards render correctly', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Luck Factor')
      
      const section = page.locator('.grid').first()
      await expect(section).toHaveScreenshot('surprise-index-cards.png', {
        maxDiffPixelRatio: 0.1,
      })
    })
  })

  test.describe('Full Page Screens', () => {
    
    test('SeasonPredictorPage full dashboard', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Expected Points')
      
      await expect(page.locator('body')).toHaveScreenshot('season-predictor-dashboard.png', {
        maxDiffPixelRatio: 0.05,
      })
    })

    test('TeamDetailPage renders correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/team/1`)
      await page.waitForSelector('text=xG Breakdown')
      
      await expect(page.locator('body')).toHaveScreenshot('team-detail-page.png', {
        maxDiffPixelRatio: 0.05,
      })
    })
  })

  test.describe('Responsive Visual Tests', () => {
    
    test('Mobile layout - Season Predictor', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Expected Points')
      
      await expect(page.locator('body')).toHaveScreenshot('season-predictor-mobile.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('Tablet layout - Season Predictor', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Expected Points')
      
      await expect(page.locator('body')).toHaveScreenshot('season-predictor-tablet.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('Desktop layout - Season Predictor', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Expected Points')
      
      await expect(page.locator('body')).toHaveScreenshot('season-predictor-desktop.png', {
        maxDiffPixelRatio: 0.1,
      })
    })
  })

  test.describe('Dark Mode Visual Tests', () => {
    
    test('Dark mode - Season Predictor', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=Expected Points')
      
      // Toggle dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      
      await expect(page.locator('body')).toHaveScreenshot('season-predictor-dark.png', {
        maxDiffPixelRatio: 0.1,
      })
    })

    test('Dark mode - Team Detail', async ({ page }) => {
      await page.goto(`${BASE_URL}/team/1`)
      await page.waitForSelector('text=xG Breakdown')
      
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      
      await expect(page.locator('body')).toHaveScreenshot('team-detail-dark.png', {
        maxDiffPixelRatio: 0.1,
      })
    })
  })

  test.describe('Interactive States', () => {
    
    test('Loading state snapshot', async ({ page }) => {
      await page.goto(BASE_URL)
      
      // Capture during loading (before data loads)
      const loading = page.locator('text=Simulation')
      if (await loading.isVisible()) {
        await expect(page.locator('body')).toHaveScreenshot('season-predictor-loading.png', {
          maxDiffPixelRatio: 0.1,
        })
      }
    })

    test('Hover state on scatterplot points', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.waitForSelector('text=xP vs Actual Points')
      
      // Hover over first point
      const point = page.locator('circle').first()
      await point.hover()
      
      await expect(page.locator('body')).toHaveScreenshot('scatterplot-hover.png', {
        maxDiffPixelRatio: 0.1,
      })
    })
  })
})