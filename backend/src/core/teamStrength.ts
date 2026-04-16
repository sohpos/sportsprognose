// backend/src/core/teamStrength.ts
// Team strength calculation based on historical data

import { TeamStrength, LeagueId, Match } from './types';

const DEFAULT_HOME_ADVANTAGE = 1.1;
const DEFAULT_ROLLING_WINDOW = 5;

/**
 * Calculate team strength from recent matches
 */
export function calculateTeamStrength(
  teamId: string,
  league: LeagueId,
  recentMatches: Match[],
  leagueAvgGoalsFor: number,
  leagueAvgGoalsAgainst: number
): TeamStrength {
  if (recentMatches.length === 0) {
    return {
      teamId,
      league,
      attackStrength: 1.0,
      defenseStrength: 1.0,
      form: [1, 1, 1, 1, 1],
      homeAdvantage: DEFAULT_HOME_ADVANTAGE,
      lastUpdate: new Date().toISOString(),
    };
  }

  // Calculate goals scored vs conceded
  let totalGoalsFor = 0;
  let totalGoalsAgainst = 0;
  const form: number[] = [];

  const recent = recentMatches.slice(-DEFAULT_ROLLING_WINDOW);

  for (const match of recent) {
    const isHome = match.homeTeam.id === teamId;
    const goalsFor = isHome ? (match.homeGoals ?? 0) : (match.awayGoals ?? 0);
    const goalsAgainst = isHome ? (match.awayGoals ?? 0) : (match.homeGoals ?? 0);

    totalGoalsFor += goalsFor;
    totalGoalsAgainst += goalsAgainst;

    // Form: 3 pts for win, 1 for draw, 0 for loss
    if (goalsFor > goalsAgainst) {
      form.push(3);
    } else if (goalsFor === goalsAgainst) {
      form.push(1);
    } else {
      form.push(0);
    }
  }

  const gamesPlayed = recent.length;

  // Attack: goals scored / league average
  const avgGoalsFor = totalGoalsFor / gamesPlayed;
  const attackStrength = avgGoalsFor / leagueAvgGoalsFor;

  // Defense: goals conceded / league average
  const avgGoalsAgainst = totalGoalsAgainst / gamesPlayed;
  const defenseStrength = avgGoalsAgainst / leagueAvgGoalsAgainst;

  return {
    teamId,
    league,
    attackStrength: Math.round(attackStrength * 1000) / 1000,
    defenseStrength: Math.round(defenseStrength * 1000) / 1000,
    form: form.reverse(), // Most recent last
    homeAdvantage: DEFAULT_HOME_ADVANTAGE,
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Get rolling window average form (0-3)
 */
export function getRollingForm(form: number[], windowSize: number = 5): number {
  const recent = form.slice(-windowSize);
  return recent.reduce((sum, pts) => sum + pts, 0) / recent.length;
}

/**
 * Calculate strength from raw numbers (for external API data)
 */
export function calculateStrengthFromRaw(
  goalsFor: number,
  goalsAgainst: number,
  leagueAvgGoalsFor: number,
  leagueAvgGoalsAgainst: number
): { attack: number; defense: number } {
  return {
    attack: Math.round((goalsFor / leagueAvgGoalsFor) * 1000) / 1000,
    defense: Math.round((goalsAgainst / leagueAvgGoalsAgainst) * 1000) / 1000,
  };
}

// League average goals (2024/25 season)
export const LEAGUE_AVG_GOALS: Record<LeagueId, { scored: number; conceded: number }> = {
  BL1: { scored: 1.85, conceded: 1.85 }, // Bundesliga
  PL: { scored: 1.52, conceded: 1.52 }, // Premier League
  PD: { scored: 1.68, conceded: 1.68 }, // La Liga
  CL: { scored: 1.45, conceded: 1.45 }, // Champions League
};