import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
    },
  },
  use: {
    headless: true,
    viewport: { width: 1400, height: 900 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
