/**
 * TeamSeasonStatsCard Tests
 */

import { describe, it, expect } from 'vitest';

const mockStats = {
  teamId: 1,
  leagueId: 'BL1',
  games: 10,
  wins: 6,
  draws: 2,
  losses: 2,
  goalsFor: 20,
  goalsAgainst: 10,
  goalDiff: 10,
  points: 20,
  avgGF: 2.0,
  avgGA: 1.0,
  xg: 18.5,
  xga: 11.2,
};

describe('TeamSeasonStats Logic', () => {
  it('calculates goal difference correctly', () => {
    const gd = mockStats.goalsFor - mockStats.goalsAgainst;
    expect(gd).toBe(10);
  });

  it('calculates points correctly', () => {
    // 6 wins * 3 = 18, 2 draws * 1 = 2, total = 20
    const points = mockStats.wins * 3 + mockStats.draws * 1 + mockStats.losses * 0;
    expect(points).toBe(20);
  });

  it('calculates win rate correctly', () => {
    const winRate = (mockStats.wins / mockStats.games) * 100;
    expect(winRate).toBe(60);
  });

  it('calculates average goals correctly', () => {
    const avgGF = mockStats.goalsFor / mockStats.games;
    expect(avgGF).toBe(2.0);
  });

  it('handles zero games', () => {
    const zeroStats = { ...mockStats, games: 0 };
    const avgGF = zeroStats.games ? zeroStats.goalsFor / zeroStats.games : 0;
    expect(avgGF).toBe(0);
  });

  it('determines goal difference color', () => {
    const getGdColor = (gd: number) => 
      gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-slate-400';
    
    expect(getGdColor(10)).toBe('text-green-400');
    expect(getGdColor(-5)).toBe('text-red-400');
    expect(getGdColor(0)).toBe('text-slate-400');
  });

  it('formats xG correctly', () => {
    const formatted = mockStats.xg.toFixed(1);
    expect(formatted).toBe('18.5');
  });

  it('handles negative goal difference', () => {
    const negativeStats = { ...mockStats, goalDiff: -5 };
    expect(negativeStats.goalDiff).toBeLessThan(0);
  });
});
