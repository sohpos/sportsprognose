// Shared types (mirrored from packages/core for standalone compilation)
export interface Team {
  id: string;
  name: string;
  shortName: string;
  crest?: string;
  avgGoalsScored: number;
  avgGoalsConceded: number;
  form: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  emblem?: string;
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED';
  score?: {
    home: number | null;
    away: number | null;
  };
}

export interface ScorelineProbability {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

export interface PredictionResult {
  matchId: string;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  over25Probability: number;
  under25Probability: number;
  mostLikelyScore: { home: number; away: number };
  scoreMatrix: ScorelineProbability[];
  confidence: number;
  predictedOutcome: 'HOME' | 'DRAW' | 'AWAY';
  generatedAt: string;
}

export interface AccuracyStats {
  week: string;
  totalPredictions: number;
  correctOutcomes: number;
  correctScores: number;
  outcomeAccuracy: number;
  scoreAccuracy: number;
}
