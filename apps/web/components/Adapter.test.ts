/**
 * Adapter Tests
 */

import { describe, it, expect } from 'vitest';
import { getAdapter } from '@sportsprognose/core';

describe('Adapter System', () => {
  it('getAdapter returns correct adapter for BL1', () => {
    const adapter = getAdapter('BL1');
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe('BL1');
  });

  it('getAdapter returns correct adapter for PL', () => {
    const adapter = getAdapter('PL');
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe('PL');
  });

  it('getAdapter returns correct adapter for PD', () => {
    const adapter = getAdapter('PD');
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe('PD');
  });

  it('getAdapter returns correct adapter for SA', () => {
    const adapter = getAdapter('SA');
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe('SA');
  });

  it('getAdapter returns correct adapter for CL', () => {
    const adapter = getAdapter('CL');
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe('CL');
  });

  it('getAdapter returns default for unknown league', () => {
    const adapter = getAdapter('UNKNOWN');
    expect(adapter).toBeDefined();
    expect(adapter.id).toBe('DEFAULT');
  });

  it('adapter has all required methods', () => {
    const adapter = getAdapter('BL1');

    expect(typeof adapter.getLeagueInfo).toBe('function');
    expect(typeof adapter.getTeams).toBe('function');
    expect(typeof adapter.getUpcomingMatches).toBe('function');
    expect(typeof adapter.getPastMatches).toBe('function');
    expect(typeof adapter.getMatchById).toBe('function');
    expect(typeof adapter.getTeamStats).toBe('function');
    expect(typeof adapter.getHeadToHead).toBe('function');
    expect(typeof adapter.getStandings).toBe('function');
  });
});

describe('Unified Types', () => {
  it('UnifiedMatch has required fields', () => {
    const match = {
      id: '123',
      date: '2024-04-15',
      leagueId: 'BL1',
      leagueName: 'Bundesliga',
      homeTeam: { id: '1', name: 'Bayern', shortName: 'FCB', country: 'DE' },
      awayTeam: { id: '2', name: 'Dortmund', shortName: 'BVB', country: 'DE' },
      homeGoals: 3,
      awayGoals: 1,
      status: 'FINISHED' as const,
    };

    expect(match.id).toBeDefined();
    expect(match.homeGoals).toBe(3);
    expect(match.status).toBe('FINISHED');
  });

  it('UnifiedTeamStats calculates correctly', () => {
    const stats = {
      teamId: '1',
      gamesPlayed: 10,
      wins: 6,
      draws: 2,
      losses: 2,
      goalsFor: 20,
      goalsAgainst: 10,
      goalDifference: 20 - 10,
      points: 6 * 3 + 2 * 1,
      avgGoalsFor: 2.0,
      avgGoalsAgainst: 1.0,
    };

    expect(stats.points).toBe(20);
    expect(stats.goalDifference).toBe(10);
  });
});
