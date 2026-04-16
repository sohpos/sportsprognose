// backend/src/core/monteCarlo.ts
// Monte-Carlo Season Simulation

import { TeamStrength } from './types';
import { predictMatch } from './predictor';

interface SeasonSimulationResult {
  teamId: string;
  expectedPoints: number;
  championProb: number;
  relegationProb: number;
  positionDistribution: Array<{ position: number; probability: number }>;
}

/**
 * Run Monte-Carlo simulation for season
 */
export async function simulateSeason(
  teamStrengths: Map<string, TeamStrength>,
  fixtures: Array<{ homeId: string; awayId: string }>,
  iterations: number = 100000
): Promise<SeasonSimulationResult[]> {
  const results: Map<string, number> = new Map();
  const positionCounts: Map<string, Map<number, number>> = new Map();

  // Initialize
  for (const [teamId] of teamStrengths) {
    results.set(teamId, 0);
    positionCounts.set(teamId, new Map());
    for (let p = 1; p <= 18; p++) {
      positionCounts.get(teamId)!.set(p, 0);
    }
  }

  // Run simulations
  for (let i = 0; i < iterations; i++) {
    const table: Map<string, { pts: number; gd: number }> = new Map();

    // Initialize teams
    for (const [teamId] of teamStrengths) {
      table.set(teamId, { pts: 0, gd: 0 });
    }

    // Simulate all fixtures
    for (const fixture of fixtures) {
      const homeStrength = teamStrengths.get(fixture.homeId);
      const awayStrength = teamStrengths.get(fixture.awayId);

      if (!homeStrength || !awayStrength) continue;

      // Create match object
      const match: any = {
        id: `${fixture.homeId}-${fixture.awayId}`,
        homeTeam: { id: fixture.homeId },
        awayTeam: { id: fixture.awayId },
      };

      const prediction = predictMatch(match, homeStrength, awayStrength);

      // Random outcome based on probabilities
      const rand = Math.random();
      let homeGoals = 0, awayGoals = 0;

      if (rand < prediction.homeWinProb) {
        homeGoals = Math.random() < 0.4 ? 1 : Math.floor(Math.random() * 3) + 1;
        awayGoals = Math.floor(Math.random() * homeGoals);
      } else if (rand < prediction.homeWinProb + prediction.drawProb) {
        homeGoals = awayGoals = Math.floor(Math.random() * 3);
      } else {
        awayGoals = Math.random() < 0.4 ? 1 : Math.floor(Math.random() * 3) + 1;
        homeGoals = Math.floor(Math.random() * awayGoals);
      }

      const home = table.get(fixture.homeId)!;
      const away = table.get(fixture.awayId)!;

      if (homeGoals > awayGoals) {
        home.pts += 3;
      } else if (homeGoals === awayGoals) {
        home.pts += 1;
        away.pts += 1;
      } else {
        away.pts += 3;
      }

      home.gd += homeGoals - awayGoals;
      away.gd += awayGoals - homeGoals;
    }

    // Sort by points, then goal difference
    const sorted = Array.from(table.values())
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd);

    // Update counts
    sorted.forEach((_, pos) => {
      const teamId = Array.from(table.keys())[pos];
      const position = pos + 1;

      results.set(teamId, results.get(teamId)! + sorted[pos].pts);

      const pc = positionCounts.get(teamId)!;
      pc.set(position, pc.get(position)! + 1);
    });
  }

  // Calculate results
  const seasonResults: SeasonSimulationResult[] = [];

  for (const [teamId, totalPts] of results) {
    const pc = positionCounts.get(teamId)!;
    const positions: Array<{ position: number; probability: number }> = [];

    for (let p = 1; p <= 18; p++) {
      positions.push({
        position: p,
        probability: (pc.get(p) || 0) / iterations,
      });
    }

    seasonResults.push({
      teamId,
      expectedPoints: totalPts / iterations,
      championProb: (pc.get(1) || 0) / iterations,
      relegationProb: (pc.get(16)! + pc.get(17)! + pc.get(18)!) / iterations,
      positionDistribution: positions,
    });
  }

  return seasonResults.sort((a, b) => b.expectedPoints - a.expectedPoints);
}