// backend/src/core/types.ts
// Core types and entities for the prediction engine

export type LeagueId = 'BL1' | 'PL' | 'PD' | 'CL';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  league: LeagueId;
}

export interface Match {
  id: string;
  league: LeagueId;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals?: number;
  awayGoals?: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
}

export interface Prediction {
  matchId: string;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  scoreMatrix: ScoreDistribution;
  confidence: number;
  value?: number;
  timestamp: string;
}

export interface ScoreDistribution {
  /**
   * 2D array where matrix[homeGoals][awayGoals] = probability
   * Index 0-6 for each team (0-6 goals)
   */
  matrix: number[][];
}

export interface TeamStrength {
  teamId: string;
  league: LeagueId;
  // Offensive strength (goals scored vs league average)
  attackStrength: number;
  // Defensive strength (goals conceded vs league average)
  defenseStrength: number;
  // Form over last N games (0-3 points per game)
  form: number[];
  // Home advantage factor (typically 1.1)
  homeAdvantage: number;
  // Last updated
  lastUpdate: string;
}

export interface SeasonPrediction {
  teamId: string;
  expectedPoints: number;
  championProb: number;
  relegationProb: number;
  positionDistribution: Array<{ position: number; probability: number }>;
}

export interface Accuracy {
  week: string; // e.g., "2026-W17"
  predictions: number;
  hits: number;
  exactScores: number;
  accuracy: number;
  scoreAccuracy: number;
}

// Utility types
export type Result = 'HOME' | 'DRAW' | 'AWAY';

export function resultFromScore(home: number, away: number): Result {
  if (home > away) return 'HOME';
  if (home === away) return 'DRAW';
  return 'AWAY';
}