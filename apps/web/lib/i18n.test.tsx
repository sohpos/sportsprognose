/**
 * Simple i18n Tests
 * Run with: npx vitest run
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLocale, setLocale, t, runTests } from './simple-i18n';

// Mock window
const mockDispatch = vi.fn();
const mockAddListener = vi.fn();
const mockRemoveListener = vi.fn();

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  
  // Mock window
  (globalThis.window as any) = {
    dispatchEvent: mockDispatch,
    addEventListener: mockAddListener,
    removeEventListener: mockRemoveListener,
  };
});

describe('i18n - getLocale()', () => {
  it('should return de (default) when nothing is saved', () => {
    localStorage.removeItem('sportsprognose_locale');
    expect(getLocale()).toBe('de');
  });
  
  it('should return saved locale', () => {
    localStorage.setItem('sportsprognose_locale', 'en');
    expect(getLocale()).toBe('en');
  });
});

describe('i18n - setLocale()', () => {
  it('should change locale to en', () => {
    setLocale('en');
    expect(getLocale()).toBe('en');
  });
  
  it('should change locale back to de', () => {
    setLocale('en');
    setLocale('de');
    expect(getLocale()).toBe('de');
  });
  
  it('should dispatch localechanged event', () => {
    setLocale('en');
    expect(mockDispatch).toHaveBeenCalled();
  });
});

describe('i18n - t()', () => {
  it('should translate German correctly', () => {
    setLocale('de');
    expect(t('app:title')).toBe('KI-Fußballprognosen');
  });
  
  it('should translate English correctly', () => {
    setLocale('en');
    expect(t('app:title')).toBe('AI Football Predictions');
  });
  
  it('should return key for missing translation', () => {
    setLocale('de');
    // When key is not found, returns the key itself
    expect(t('nonexistent:key')).toBe('nonexistent:key');
  });
  
  it('should accept locale parameter', () => {
    expect(t('app:title', 'de')).toBe('KI-Fußballprognosen');
    expect(t('app:title', 'en')).toBe('AI Football Predictions');
  });
});

describe('i18n - runTests()', () => {
  it('should run all tests successfully', () => {
    const { passed, results } = runTests();
    console.log('\n--- Test Results ---');
    results.forEach(r => console.log(r));
    expect(passed).toBe(true);
  });
});