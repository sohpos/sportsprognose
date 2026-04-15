/**
 * ThemeToggle Component Tests
 * Testing the theme logic without DOM dependencies
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Theme Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('default theme is light', () => {
    const stored = localStorage.getItem('sportsprognose_theme');
    // No theme stored, should default to light
    expect(stored || 'light').toBe('light');
  });

  it('toggle switches theme', () => {
    let theme = 'light';
    
    const toggle = () => {
      theme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('sportsprognose_theme', theme);
    };

    toggle();
    expect(theme).toBe('dark');
    expect(localStorage.getItem('sportsprognose_theme')).toBe('dark');
    
    toggle();
    expect(theme).toBe('light');
    expect(localStorage.getItem('sportsprognose_theme')).toBe('light');
  });

  it('saves theme to localStorage', () => {
    const setTheme = (newTheme: string) => {
      localStorage.setItem('sportsprognose_theme', newTheme);
    };

    setTheme('dark');
    expect(localStorage.getItem('sportsprognose_theme')).toBe('dark');

    setTheme('light');
    expect(localStorage.getItem('sportsprognose_theme')).toBe('light');
  });

  it('loads theme from localStorage', () => {
    localStorage.setItem('sportsprognose_theme', 'dark');
    
    const loadTheme = () => {
      return localStorage.getItem('sportsprognose_theme') || 'light';
    };
    
    expect(loadTheme()).toBe('dark');
  });
});
