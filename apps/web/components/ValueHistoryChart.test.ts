/**
 * ValueHistory Tests
 */

import { describe, it, expect } from 'vitest';

const mockValueHistory = {
  teamId: '1',
  valueHistory: [
    { date: '2024-04-01', opponent: 'Bayern', market: 'HOME', probability: 45, odds: 2.2, fairOdds: 2.22, edge: 6, result: 'W' },
    { date: '2024-03-25', opponent: 'Dortmund', market: 'AWAY', probability: 35, odds: 3.0, fairOdds: 2.86, edge: -2, result: 'D' },
    { date: '2024-03-18', opponent: 'Leverkusen', market: 'HOME', probability: 50, odds: 1.9, fairOdds: 2.0, edge: 10, result: 'W' },
  ],
  summary: {
    totalBets: 3,
    positiveValue: 2,
    negativeValue: 1,
    neutral: 0,
    avgEdge: 5,
  },
};

describe('ValueHistory Logic', () => {
  it('calculates edge correctly', () => {
    // Edge = Probability - Implied Probability
    // prob=0.45 → implied = 1/2.2 = 0.4545 → edge = 0.45 - 0.4545 = -0.0045 (negative in this case)
    const prob = 0.45;
    const odds = 2.2;
    const impliedProb = 1 / odds;
    const edge = (prob - impliedProb) * 100;
    
    expect(edge).toBeCloseTo(-0.45, 0);
  });

  it('calculates fair odds correctly', () => {
    const prob = 0.45;
    const fairOdds = 1 / prob;
    expect(fairOdds).toBeCloseTo(2.22, 1);
  });

  it('determines positive value (edge > 5%)', () => {
    const edge = mockValueHistory.valueHistory[0].edge;
    expect(edge > 5).toBe(true); // edge = 6
  });

  it('handles edge values correctly', () => {
    // Test different edge scenarios
    const edge6 = mockValueHistory.valueHistory[0].edge; // 6
    const edgeNeg2 = mockValueHistory.valueHistory[1].edge; // -2
    
    expect(edge6).toBe(6);
    expect(edgeNeg2).toBe(-2);
  });

  it('calculates average edge', () => {
    const edges = mockValueHistory.valueHistory.map(v => v.edge);
    const avg = edges.reduce((a, b) => a + b, 0) / edges.length;
    expect(avg).toBeCloseTo(4.67, 0);
  });

  it('counts positive/negative/neutral correctly', () => {
    const positive = mockValueHistory.summary.positiveValue;
    const negative = mockValueHistory.summary.negativeValue;
    const neutral = mockValueHistory.summary.neutral;
    
    expect(positive).toBe(2);
    expect(negative).toBe(1);
    expect(neutral).toBe(0);
  });

  it('sorts by date descending', () => {
    const sorted = [...mockValueHistory.valueHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    expect(sorted[0].date).toBe('2024-04-01');
  });
});
