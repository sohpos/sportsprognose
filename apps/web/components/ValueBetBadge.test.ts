/**
 * ValueBetBadge Component Tests
 */

import { describe, it, expect } from 'vitest';
import { computeValueBets } from '../components/ValueBetBadge';

describe('computeValueBets', () => {
  it('calculates positive edge correctly', () => {
    // p=0.5 → fairOdds=2.0, odds=2.4 → edge = 0.5 - 0.417 = 0.083 (+8.3%)
    const res = computeValueBets(0.5, 0.3, 0.2, 2.4, 3.2, 4.0);
    const home = res.find(r => r.market === 'HOME')!;
    
    expect(home.fairOdds).toBeCloseTo(2.0, 1);
    expect(home.edge).toBeGreaterThan(0);
    expect(home.hasValue).toBe(true);
  });

  it('calculates negative edge correctly', () => {
    // p=0.5 → fairOdds=2.0, odds=1.5 → edge = 0.5 - 0.667 = -0.167
    const res = computeValueBets(0.5, 0.3, 0.2, 1.5, 3.2, 4.0);
    const home = res.find(r => r.market === 'HOME')!;
    
    expect(home.fairOdds).toBeCloseTo(2.0, 1);
    expect(home.edge).toBeLessThan(0);
    expect(home.hasValue).toBe(false);
  });

  it('filters out non-value bets', () => {
    // edge = 0.5 - 0.417 = 0.083 (> 0.05 threshold)
    const res = computeValueBets(0.5, 0.3, 0.2, 2.4, 3.2, 4.0);
    const withValue = res.filter(r => r.hasValue);
    
    expect(withValue.length).toBeGreaterThan(0);
  });

  it('sorts by edge descending', () => {
    const res = computeValueBets(0.5, 0.3, 0.2, 2.4, 3.2, 4.0);
    
    // First should have highest edge
    expect(res[0].edge).toBeGreaterThanOrEqual(res[1].edge);
    expect(res[1].edge).toBeGreaterThanOrEqual(res[2].edge);
  });

  it('handles zero probability', () => {
    const res = computeValueBets(0, 0.3, 0.7, 2.0, 3.0, 1.5);
    
    // Should filter out zero probability
    expect(res.length).toBe(2);
  });
});
