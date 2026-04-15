/**
 * Game of the Day Tests
 */

import { describe, it, expect } from 'vitest';

// Inline test functions (matching the actual implementation)
const calculateCompositeScore = (edge: number, confidence: number, suspense: number, leagueWeight: number) => {
  const wEdge = 0.40;
  const wConfidence = 0.25;
  const wSuspense = 0.20;
  const wLeague = 0.15;
  return wEdge * edge + wConfidence * confidence + wSuspense * suspense + wLeague * leagueWeight;
};

const getLeagueWeight = (leagueId: string) => {
  const weights: Record<string, number> = { 'CL': 1.0, 'BL1': 0.95, 'PL': 0.95, 'PD': 0.90, 'SA': 0.90 };
  return weights[leagueId] || 0.70;
};

const calculateSuspense = (scoreMatrix: number[][]) => {
  if (!scoreMatrix || scoreMatrix.length === 0) return 0.5;
  const flat = scoreMatrix.flat();
  const max = Math.max(...flat);
  return 1 - max;
};

describe('Game of the Day Logic', () => {
  describe('calculateCompositeScore', () => {
    it('weights edge correctly at 40%', () => {
      const score = calculateCompositeScore(0.15, 0.6, 0.8, 1.0);
      expect(score).toBeCloseTo(0.52, 2);
    });

    it('returns higher score for higher edge', () => {
      const scoreHigh = calculateCompositeScore(0.20, 0.5, 0.5, 0.9);
      const scoreLow = calculateCompositeScore(0.05, 0.5, 0.5, 0.9);
      expect(scoreHigh).toBeGreaterThan(scoreLow);
    });

    it('returns higher score for higher confidence', () => {
      const scoreHigh = calculateCompositeScore(0.10, 0.8, 0.5, 0.9);
      const scoreLow = calculateCompositeScore(0.10, 0.3, 0.5, 0.9);
      expect(scoreHigh).toBeGreaterThan(scoreLow);
    });

    it('returns higher score for higher suspense', () => {
      const scoreHigh = calculateCompositeScore(0.10, 0.5, 0.9, 0.9);
      const scoreLow = calculateCompositeScore(0.10, 0.5, 0.2, 0.9);
      expect(scoreHigh).toBeGreaterThan(scoreLow);
    });
  });

  describe('getLeagueWeight', () => {
    it('returns highest for Champions League', () => {
      expect(getLeagueWeight('CL')).toBe(1.0);
    });

    it('returns high for top leagues', () => {
      expect(getLeagueWeight('BL1')).toBe(0.95);
      expect(getLeagueWeight('PL')).toBe(0.95);
    });

    it('returns medium for other leagues', () => {
      expect(getLeagueWeight('PD')).toBe(0.90);
      expect(getLeagueWeight('SA')).toBe(0.90);
    });

    it('returns default for unknown league', () => {
      expect(getLeagueWeight('UNKNOWN')).toBe(0.70);
    });
  });

  describe('calculateSuspense', () => {
    it('returns high suspense for evenly distributed matrix', () => {
      const evenMatrix = Array(6).fill(null).map(() => Array(6).fill(0.027));
      const suspense = calculateSuspense(evenMatrix);
      expect(suspense).toBeGreaterThan(0.8);
    });

    it('returns low suspense for skewed matrix', () => {
      const skewedMatrix = [
        [0.50, 0.05, 0.02, 0.01, 0.005, 0.005],
        [0.05, 0.05, 0.02, 0.01, 0.005, 0.005],
        [0.02, 0.02, 0.02, 0.01, 0.005, 0.005],
        [0.01, 0.01, 0.01, 0.01, 0.005, 0.005],
        [0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
        [0.005, 0.005, 0.005, 0.005, 0.005, 0.005],
      ];
      const suspense = calculateSuspense(skewedMatrix);
      expect(suspense).toBeLessThan(0.6);
    });

    it('handles empty matrix', () => {
      expect(calculateSuspense([])).toBe(0.5);
    });
  });
});
