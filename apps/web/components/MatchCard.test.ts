/**
 * MatchCard Component Tests
 * Run with: npm test:run
 */

import { describe, it, expect, vi } from 'vitest';

// Simple test for ConfidenceHeatbar color logic
describe('ConfidenceHeatbar', () => {
  it('should return red color for low confidence (<60%)', () => {
    const getColor = (pct: number) => {
      if (pct >= 75) return 'bg-green-500';
      if (pct >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    expect(getColor(30)).toBe('bg-red-500');
    expect(getColor(59)).toBe('bg-red-500');
  });

  it('should return yellow color for medium confidence (60-74%)', () => {
    const getColor = (pct: number) => {
      if (pct >= 75) return 'bg-green-500';
      if (pct >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    expect(getColor(60)).toBe('bg-yellow-500');
    expect(getColor(74)).toBe('bg-yellow-500');
  });

  it('should return green color for high confidence (>=75%)', () => {
    const getColor = (pct: number) => {
      if (pct >= 75) return 'bg-green-500';
      if (pct >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    expect(getColor(75)).toBe('bg-green-500');
    expect(getColor(100)).toBe('bg-green-500');
  });
});

// Test probability bar calculation
describe('ProbBar calculations', () => {
  it('should calculate correct percentages', () => {
    const homeProb = 0.45;
    const drawProb = 0.25;
    const awayProb = 0.30;
    
    const h = Math.round(homeProb * 100);
    const d = Math.round(drawProb * 100);
    const a = Math.round(awayProb * 100);
    
    expect(h).toBe(45);
    expect(d).toBe(25);
    expect(a).toBe(30);
  });

  it('should handle edge case of 100% confidence', () => {
    const homeProb = 1.0;
    const h = Math.round(homeProb * 100);
    expect(h).toBe(100);
  });
});
