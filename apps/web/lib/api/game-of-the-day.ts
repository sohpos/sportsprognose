// apps/web/lib/api/game-of-the-day.ts

export interface GameOfTheDay {
  league: string;
  leagueName: string;
  matchId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeId: string;
  awayId: string;
  market: 'HOME' | 'DRAW' | 'AWAY';
  edge: number;
  odds: number;
  confidence: number;
  suspense: number;
  score: number;
}

/**
 * Fetch Game of the Day - the most interesting match
 */
export async function getGameOfTheDay(): Promise<GameOfTheDay | null> {
  try {
    const res = await fetch('/api/game-of-the-day');
    if (!res.ok) {
      throw new Error('Failed to load GOTD');
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch GOTD:', error);
    return null;
  }
}

/**
 * Calculate composite score for game selection
 */
export function calculateCompositeScore(
  edge: number,
  confidence: number,
  suspense: number,
  leagueWeight: number
): number {
  // Weights
  const wEdge = 0.40;
  const wConfidence = 0.25;
  const wSuspense = 0.20;
  const wLeague = 0.15;

  return (
    wEdge * edge +
    wConfidence * confidence +
    wSuspense * suspense +
    wLeague * leagueWeight
  );
}

/**
 * Get league weight
 */
export function getLeagueWeight(leagueId: string): number {
  const weights: Record<string, number> = {
    'CL': 1.0,      // Champions League - highest
    'BL1': 0.95,    // Bundesliga
    'PL': 0.95,     // Premier League
    'PD': 0.90,     // La Liga
    'SA': 0.90,     // Serie A
  };
  return weights[leagueId] || 0.70;
}

/**
 * Calculate suspense from score matrix (higher = more suspense)
 * Suspense = 1 - max probability (more even distribution = higher suspense)
 */
export function calculateSuspense(scoreMatrix: number[][]): number {
  if (!scoreMatrix || scoreMatrix.length === 0) return 0.5;
  
  const flat = scoreMatrix.flat();
  const max = Math.max(...flat);
  return 1 - max;
}
