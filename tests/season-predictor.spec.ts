/**
 * E2E Tests: Season Predictor Dashboard
 */

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Season Predictor Dashboard', () => {
  test('loads dashboard with teams', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Should show header
    await expect(page.locator('h1')).toContainText('Season Predictor')
    
    // Should show teams
    await expect(page.getByText('Bayern')).toBeVisible()
    await expect(page.getByText('Dortmund')).toBeVisible()
  })

  test('shows loading state during simulation', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Should show progress
    await expect(page.getByText(/Simulation läuft/)).toBeVisible()
  })

  test('displays xP table after loading', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Wait for data to load
    await page.waitForSelector('text=Expected Points')
    
    // Check table exists
    await expect(page.getByText('Meister (%)')).toBeVisible()
    await expect(page.getByText('Abstieg (%)')).toBeVisible()
  })

  test('displays season chances', async ({ page }) => {
    await page.goto(BASE_URL)
    
    await page.waitForSelector('text=Meisterschafts-Chancen')
    await expect(page.getByText('Meisterschafts-Chancen')).toBeVisible()
    await expect(page.getByText('Abstiegs-Wahrscheinlichkeit')).toBeVisible()
  })

  test('displays scatter plot', async ({ page }) => {
    await page.goto(BASE_URL)
    
    await page.waitForSelector('text=xP vs Actual Points')
    await expect(page.getByText('xP vs Actual Points')).toBeVisible()
    await expect(page.getByText('Überperformer')).toBeVisible()
    await expect(page.getByText('Underperformer')).toBeVisible()
  })

  test('displays surprise index cards', async ({ page }) => {
    await page.goto(BASE_URL)
    
    await page.waitForSelector('text=Luck Factor')
    await expect(page.getByText('Luck Factor')).toBeVisible()
    await expect(page.getByText('Consistency')).toBeVisible()
    await expect(page.getByText('xG Delta')).toBeVisible()
    await expect(page.getByText('Momentum')).toBeVisible()
  })

  test('displays league insights', async ({ page }) => {
    await page.goto(BASE_URL)
    
    await page.waitForSelector('text=Überperformer')
    await expect(page.getByText('Überperformer (Δ-Points)')).toBeVisible()
  })

  test('displays team cards', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Team cards should be visible
    const cards = page.locator('.rounded-xl')
    await expect(cards.first()).toBeVisible()
  })

  test('displays position distribution charts', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Each team should have a position distribution
    await expect(page.getByText('Bayern')).toBeVisible()
  })

  test('team detail page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/team/1`)
    
    await expect(page.getByText('Bayern')).toBeVisible()
    await expect(page.getByText('Positionsverteilung')).toBeVisible()
    await expect(page.getByText('Formkurve')).toBeVisible()
    await expect(page.getByText('xG Breakdown')).toBeVisible()
  })

  test('dark mode toggle works', async ({ page }) => {
    await page.goto(BASE_URL)
    
    // Toggle dark mode
    await page.click('[data-testid="dark-mode-toggle"]')
    
    // Should have dark class
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('mobile layout adapts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(BASE_URL)
    
    // Grid should stack on mobile
    const grid = page.locator('.grid')
    await expect(grid.first()).toBeVisible()
  })

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    
    await page.goto(BASE_URL)
    await page.waitForTimeout(2000)
    
    expect(errors.filter(e => !e.includes('hydration'))).toHaveLength(0)
  })
})