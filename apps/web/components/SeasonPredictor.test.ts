/**
 * Season Predictor Tests
 */

import { describe, it, expect } from 'vitest';
import { computeTeamStrength, runSeasonSimulation } from '../../backend/src/services/seasonPredictor';

describe('Season Predictor', () => {
  describe('computeTeamStrength', () => {
    it('calculates team strength correctly', () => {
      const team = { id: '1', name: 'Bayern', xG: 30, xGA: 15, games: 10 };
      const strength = computeTeamStrength(team);
      
      expect(strength.attack).toBe(3);
      expect(strength.defense).toBe(1.5);
    });

    it('handles zero games', () => {
      const team = { id: '1', name: 'Bayern', xG: 0, xGA: 0, games: 0 };
      const strength = computeTeamStrength(team);
      
      expect(strength.attack).toBe(1.5); // default
      expect(strength.defense).toBe(1.5);
    });

    it('applies home advantage', () => {
      const team = { id: '1', name: 'Bayern', xG: 30, xGA: 15, games: 10, homeStrength: 1.2 };
      const strength = computeTeamStrength(team);
      
      expect(strength.homeAdvantage).toBe(1.2);
    });
  });

  describe('runSeasonSimulation', () => {
    it('simulates season without NaN', () => {
      const teams = [
        { id: '1', name: 'Bayern', xG: 30, xGA: 15, games: 10 },
        { id: '2', name: 'Dortmund', xG: 25, xGA: 20, games: 10 },
      ];
      const matches = [
        { homeId: '1', awayId: '2' },
        { homeId: '2', awayId: '1' },
      ];
      
      const results = runSeasonSimulation(teams, matches, 100);
      
      results.forEach(r => {
        expect(Number.isFinite(r.expectedPoints)).toBe(true);
        expect(r.expectedPoints).toBeGreaterThan(0);
      });
    });

    it('returns results for all teams', () => {
      const teams = [
        { id: '1', name: 'Bayern', xG: 30, xGA: 15, games: 10 },
        { id: '2', name: 'Dortmund', xG: 25, xGA: 20, games: 10 },
      ];
      const matches = [
        { homeId: '1', awayId: '2' },
        { homeId: '2', awayId: '1' },
      ];
      
      const results = runSeasonSimulation(teams, matches, 100);
      
      expect(results.length).toBe(2);
    });

    it('calculates probabilities', () => {
      const teams = [
        { id: '1', name: 'Bayern', xG: 30, xGA: 15, games: 10 },
        { id: '2', name: 'Dortmund', xG: 25, xGA: 20, games: 10 },
      ];
      const matches = [
        { homeId: '1', awayId: '2' },
        { homeId: '2', awayId: '1' },
      ];
      
      const results = runSeasonSimulation(teams, matches, 100);
      
      results.forEach(r => {
        expect(r.championshipProbability).toBeGreaterThanOrEqual(0);
        expect(r.championshipProbability).toBeLessThanOrEqual(100);
        expect(r.positionDistribution.length).toBe(18);
      });
    });
  });
});
