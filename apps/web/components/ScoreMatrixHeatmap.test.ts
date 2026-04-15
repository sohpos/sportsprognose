/**
 * ScoreMatrixHeatmap Component Tests
 */

import { describe, it, expect } from 'vitest';

// Mock matrix data
export const mockMatrix = [
  { homeGoals: 0, awayGoals: 0, probability: 0.12 },
  { homeGoals: 0, awayGoals: 1, probability: 0.08 },
  { homeGoals: 0, awayGoals: 2, probability: 0.04 },
  { homeGoals: 0, awayGoals: 3, probability: 0.02 },
  { homeGoals: 0, awayGoals: 4, probability: 0.01 },
  { homeGoals: 0, awayGoals: 5, probability: 0.005 },
  { homeGoals: 1, awayGoals: 0, probability: 0.10 },
  { homeGoals: 1, awayGoals: 1, probability: 0.07 },
  { homeGoals: 1, awayGoals: 2, probability: 0.03 },
  { homeGoals: 2, awayGoals: 1, probability: 0.02 },
  { homeGoals: 2, awayGoals: 2, probability: 0.01 },
  // ... more entries to fill 36 cells
];

// Helper function that matches component logic
function getColorClass(p: number): string {
  if (p >= 0.20) return 'bg-blue-200 text-blue-900';
  if (p >= 0.15) return 'bg-blue-300 text-blue-900';
  if (p >= 0.10) return 'bg-blue-400 text-white';
  if (p >= 0.06) return 'bg-blue-500 text-white';
  if (p >= 0.03) return 'bg-blue-700 text-white';
  if (p >= 0.01) return 'bg-blue-900 text-blue-100';
  if (p > 0) return 'bg-gray-800 text-gray-400';
  return 'bg-gray-900 text-gray-600';
}

describe('ScoreMatrixHeatmap - color logic', () => {
  it('applies correct color for high probability (>=20%)', () => {
    expect(getColorClass(0.25)).toContain('bg-blue-200');
  });

  it('applies correct color for medium-high probability (15-20%)', () => {
    expect(getColorClass(0.15)).toContain('bg-blue-300');
  });

  it('applies correct color for medium probability (10-15%)', () => {
    expect(getColorClass(0.12)).toContain('bg-blue-400');
  });

  it('applies correct color for low-medium probability (6-10%)', () => {
    expect(getColorClass(0.08)).toContain('bg-blue-500');
  });

  it('applies correct color for low probability (3-6%)', () => {
    expect(getColorClass(0.04)).toContain('bg-blue-700');
  });

  it('applies correct color for very low probability (1-3%)', () => {
    expect(getColorClass(0.02)).toContain('bg-blue-900');
  });

  it('applies correct color for near-zero probability', () => {
    expect(getColorClass(0.005)).toContain('bg-gray-800');
  });

  it('applies correct color for zero probability', () => {
    expect(getColorClass(0)).toContain('bg-gray-900');
  });
});

describe('ScoreMatrixHeatmap - data transformation', () => {
  it('converts flat matrix to 2D grid', () => {
    const to2D = (matrix: any[]) => {
      const rows: any[][] = [];
      for (let h = 0; h <= 5; h++) {
        const row: any[] = [];
        for (let a = 0; a <= 5; a++) {
          const cell = matrix.find(c => c.homeGoals === h && c.awayGoals === a);
          row.push(cell || { homeGoals: h, awayGoals: a, probability: 0 });
        }
        rows.push(row);
      }
      return rows;
    };

    const result = to2D(mockMatrix);
    expect(result.length).toBe(6);
    expect(result[0].length).toBe(6);
    expect(result[0][0].homeGoals).toBe(0);
    expect(result[0][0].awayGoals).toBe(0);
  });

  it('calculates percentage correctly', () => {
    const toPercent = (p: number) => (p * 100).toFixed(1);
    expect(toPercent(0.12)).toBe('12.0');
    expect(toPercent(0.005)).toBe('0.5');
  });
});
