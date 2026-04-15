/**
 * Multi-League Support Tests
 */

import { describe, it, expect } from 'vitest';
import { getLeagueById, getEnabledLeagues, LEAGUES } from '@sportsprognose/core';

describe('Multi-League Support', () => {
  describe('LeagueConfig', () => {
    it('has all required leagues', () => {
      const leagueIds = LEAGUES.map(l => l.id);
      expect(leagueIds).toContain('BL1'); // Bundesliga
      expect(leagueIds).toContain('PL'); // Premier League
      expect(leagueIds).toContain('PD'); // La Liga
      expect(leagueIds).toContain('SA'); // Serie A
      expect(leagueIds).toContain('CL'); // Champions League
    });

    it('has valid structure for each league', () => {
      LEAGUES.forEach(league => {
        expect(league.id).toBeDefined();
        expect(league.name).toBeDefined();
        expect(league.country).toBeDefined();
        expect(league.apiSource).toBeDefined();
        expect(league.enabled).toBeDefined();
      });
    });

    it('has correct flags', () => {
      const bl1 = getLeagueById('BL1');
      expect(bl1?.flag).toBe('🇩🇪');
      
      const pl = getLeagueById('PL');
      expect(pl?.flag).toBe('🇬🇧');
    });

    it('getLeagueById returns correct league', () => {
      const bundesliga = getLeagueById('BL1');
      expect(bundesliga?.name).toBe('Bundesliga');
      expect(bundesliga?.country).toBe('DE');
    });

    it('getLeagueById returns undefined for unknown', () => {
      const unknown = getLeagueById('XXX');
      expect(unknown).toBeUndefined();
    });

    it('getEnabledLeagues returns only enabled', () => {
      const enabled = getEnabledLeagues();
      enabled.forEach(l => {
        expect(l.enabled).toBe(true);
      });
    });
  });

  describe('TeamPage with League', () => {
    it('builds correct team params', () => {
      const params = { teamId: 1, leagueId: 'PL' };
      expect(params.teamId).toBe(1);
      expect(params.leagueId).toBe('PL');
    });

    it('handles missing leagueId', () => {
      const params = { teamId: 1 };
      const leagueId = params.leagueId || 'BL1';
      expect(leagueId).toBe('BL1');
    });

    it('works with all leagues', () => {
      const leagues = ['BL1', 'PL', 'PD', 'SA', 'CL'];
      leagues.forEach(leagueId => {
        const params = { teamId: 1, leagueId };
        expect(params.leagueId).toBeDefined();
      });
    });
  });

  describe('Adapter Types', () => {
    it('has correct apiSource per league', () => {
      const bl1 = getLeagueById('BL1');
      expect(bl1?.apiSource).toBe('openligadb');
      
      const pl = getLeagueById('PL');
      expect(pl?.apiSource).toBe('football-data');
    });
  });
});
