// backend/src/tests/core.test.ts
// Unit tests for core prediction engine

import { describe, it, expect } from 'vitest';
import { poissonProb, calculateScoreMatrix, aggregateTo1X2, calculateConfidence } from '../core/poisson';
import { calculateValue, valueCategory, fairProbability } from '../core/value';
import { calculateAccuracy, getResult } from '../core/accuracy';

describe('Poisson', () => {
  it('should calculate probability correctly', () => {
    const prob = poissonProb(2, 1.5);
    expect(prob).toBeGreaterThan(0);
    expect(prob).toBeLessThan(1);
  });

  it('should sum to ~1 for valid lambda', () => {
    const matrix = calculateScoreMatrix(2.0, 1.5);
    let sum = 0;
    for (let i = 0; i < matrix.matrix.length; i++) {
      for (let j = 0; j < matrix.matrix[i].length; j++) {
        sum += matrix.matrix[i][j];
      }
    }
    expect(sum).toBeCloseTo(1, 2);
  });
});

describe('1X2 Aggregation', () => {
  it('should aggregate correctly', () => {
    const matrix = calculateScoreMatrix(2.0, 1.5);
    const { homeWin, draw, awayWin } = aggregateTo1X2(matrix.matrix);
    expect(homeWin).toBeGreaterThan(awayWin);
    expect(homeWin + draw + awayWin).toBeCloseTo(1, 2);
  });

  it('should calculate confidence', () => {
    const matrix = calculateScoreMatrix(2.0, 1.5);
    const confidence = calculateConfidence(matrix.matrix);
    expect(confidence).toBeGreaterThan(0);
    expect(confidence).toBeLessThan(1);
  });
});

describe('Value Calculation', () => {
  it('should calculate fair probability', () => {
    expect(fairProbability(2.0)).toBe(0.5);
    expect(fairProbability(4.0)).toBe(0.25);
  });

  it('should identify positive value', () => {
    const value = calculateValue(0.55, 2.0);
    expect(value).toBeGreaterThan(0);
  });

  it('should categorize correctly', () => {
    expect(valueCategory(15).label).toBe('🔥 STRONG BET');
    expect(valueCategory(7).label).toBe('✅ VALUE');
    expect(valueCategory(0).label).toBe('➖ NO VALUE');
    expect(valueCategory(-7).label).toBe('⚠️ AVOID');
  });
});

describe('Accuracy', () => {
  it('should determine correct result', () => {
    expect(getResult(2, 1)).toBe('HOME');
    expect(getResult(1, 1)).toBe('DRAW');
    expect(getResult(0, 2)).toBe('AWAY');
  });

  it('should calculate accuracy', () => {
    const results = [
      { matchId: '1', predicted: 'HOME' as const, actual: 'HOME' as const, homeGoals: 2, awayGoals: 1, isHit: true, isExactScore: false },
      { matchId: '2', predicted: 'AWAY' as const, actual: 'AWAY' as const, homeGoals: 0, awayGoals: 2, isHit: true, isExactScore: false },
      { matchId: '3', predicted: 'HOME' as const, actual: 'DRAW' as const, homeGoals: 1, awayGoals: 1, isHit: false, isExactScore: true },
    ];
    
    const accuracy = calculateAccuracy(results);
    expect(accuracy.accuracy).toBeCloseTo(0.6667, 2);
  });
});
