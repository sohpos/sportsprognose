import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.spec.*',
        '**/*.test.*',
        'dist/',
        '.next/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    include: [
      'apps/web/**/*.test.{ts,tsx}',
      'apps/web/**/*.spec.{ts,tsx}',
    ],
    environmentMatchGlobs: [
      ['**/season-predictor/**', 'jsdom'],
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web'),
    },
  },
})