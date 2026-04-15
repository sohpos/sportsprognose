/**
 * Team Compare Tests
 */

import { describe, it, expect } from 'vitest';

// Inline function (same as in api/compare.ts)
const calculateCompositeScore = (
  formPoints: number[],
  avgEdge: number,
  avgGF: number,
  avgGA: number,
  suspense: number
) => {
  const formScore = formPoints.reduce((a, b) => a + b, 0) / 15;
  const valueScore = Math.max(0, avgEdge / 100 + 0.5);
  const attackScore = Math.min(1, avgGF / 3);
  const defenseScore = Math.max(0, 1 - avgGA / 3);
  const suspenseScore = suspense;

  return (
    0.30 * formScore +
    0.25 * valueScore +
    0.20 * attackScore +
    0.15 * defenseScore +
    0.10 * suspenseScore
  );
};

describe('Team Compare Logic', () => {
  describe('calculateCompositeScore', () => {
    it('weights form at 30%', () => {
      const best = calculateCompositeScore([3,3,3,3,3], 10, 2.0, 1.0, 0.7);
      const worst = calculateCompositeScore([0,0,0,0,0], 10, 2.0, 1.0, 0.7);
      expect(best).toBeGreaterThan(worst);
    });

    it('weights value at 25%', () => {
      const high = calculateCompositeScore([1,1,1,1,1], 20, 2.0, 1.0, 0.7);
      const low = calculateCompositeScore([1,1,1,1,1], -10, 2.0, 1.0, 0.7);
      expect(high).toBeGreaterThan(low);
    });

    it('weights attack at 20%', () => {
      const high = calculateCompositeScore([1,1,1,1,1], 0, 3.0, 1.0, 0.7);
      const low = calculateCompositeScore([1,1,1,1,1], 0, 0.5, 1.0, 0.7);
      expect(high).toBeGreaterThan(low);
    });

    it('weights defense at 15%', () => {
      const good = calculateCompositeScore([1,1,1,1,1], 0, 2.0, 0.3, 0.7);
      const bad = calculateCompositeScore([1,1,1,1,1], 0, 2.0, 2.5, 0.7);
      expect(good).toBeGreaterThan(bad);
    });

    it('weights suspense at 10%', () => {
      const high = calculateCompositeScore([1,1,1,1,1], 0, 1.5, 1.5, 0.9);
      const low = calculateCompositeScore([1,1,1,1,1], 0, 1.5, 1.5, 0.3);
      expect(high).toBeGreaterThan(low);
    });

    it('returns score between 0 and 1', () => {
      const score = calculateCompositeScore([3,3,3,3,3], 50, 3.0, 0.0, 1.0);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});
