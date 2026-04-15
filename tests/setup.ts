/**
 * Global Test Setup & Mocks
 */

import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
}))

// Mock SVGElement.getBBox (used in some chart calculations)
if (typeof SVGElement !== 'undefined') {
  SVGElement.prototype.getBBox = vi.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.innerWidth / innerHeight for responsive tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1280,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 720,
})

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  writable: true,
})

// Mock URL.createObjectURL
URL.createObjectURL = vi.fn(() => 'blob:mock-url')
URL.revokeObjectURL = vi.fn()

// Silence console warnings in tests (optional)
// Uncomment to suppress specific warnings:
// vi.spyOn(console, 'warn').mockImplementation(() => {})
// vi.spyOn(console, 'error').mockImplementation(() => {})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(callback => setTimeout(callback, 0))
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id))

// Mock setImmediate
global.setImmediate = vi.fn(callback => setTimeout(callback, 0))
global.clearImmediate = vi.fn(id => clearTimeout(id))