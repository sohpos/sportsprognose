'use client';

/**
 * Unit Tests: Adapter System + Unified Types
 */

import { describe, it, expect } from 'vitest';
import { getAdapter } from '@sportsprognose/core';

describe('Adapter System', () => {
  it('getAdapter returns an adapter for BL1', () => {
    const adapter = getAdapter('BL1');
    expect(adapter).toBeDefined();
    expect(typeof adapter.getLeagueInfo).toBe('function');
    expect(typeof adapter.getTeams).toBe('function');
    expect(typeof adapter.getUpcomingMatches).toBe('function');
  });

  it('getAdapter returns an adapter for PL', () => {
    const adapter = getAdapter('PL');
    expect(adapter).toBeDefined();
    expect(typeof adapter.getLeagueInfo).toBe('function');
  });

  it('getAdapter returns an adapter for PD', () => {
    const adapter = getAdapter('PD');
    expect(adapter).toBeDefined();
    expect(typeof adapter.getLeagueInfo).toBe('function');
  });

  it('getAdapter returns an adapter for SA', () => {
    const adapter = getAdapter('SA');
    expect(adapter).toBeDefined();
    expect(typeof adapter.getLeagueInfo).toBe('function');
  });

  it('getAdapter returns an adapter for CL', () => {
    const adapter = getAdapter('CL');
    expect(adapter).toBeDefined();
    expect(typeof adapter.getLeagueInfo).toBe('function');
  });

  it('getAdapter returns default adapter for unknown league', () => {
    const adapter = getAdapter('UNKNOWN');
    expect(adapter).toBeDefined();
    expect(typeof adapter.getLeagueInfo).toBe('function');
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

  it('OpenLigaDBAdapter returns Bundesliga league info', async () => {
    const adapter = getAdapter('BL1');
    const info = await adapter.getLeagueInfo();
    expect(info).toBeDefined();
    expect(info?.id).toBe('BL1');
    expect(info?.name).toBe('Bundesliga');
  });
});
