// apps/web/lib/api/compare.ts

export interface TeamCompareData {
  teamA: TeamData;
  teamB: TeamData;
  h2h: H2HData[];
}

export interface TeamData {
  stats: SeasonStats;
  form: FormData;
  value: ValueData;
  score: number;
}

export interface SeasonStats {
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  avgGF: number;
  avgGA: number;
  xg: number;
  xga: number;
}

export interface FormData {
  form: string;
  formPoints: number[];
  trend: number;
}

export interface ValueData {
  positiveValue: number;
  negativeValue: number;
  avgEdge: number;
}

export interface H2HData {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
}

/**
 * Compare two teams
 */
export async function compareTeams(
  league: string,
  teamA: number,
  teamB: number
): Promise<TeamCompareData> {
  try {
    const res = await fetch(`/api/compare?league=${league}&teamA=${teamA}&teamB=${teamB}`);
    if (!res.ok) throw new Error('Failed to compare teams');
    return res.json();
  } catch (error) {
    console.error('Failed to compare teams:', error);
    // Return empty data on error
    return {
      teamA: createEmptyTeam(),
      teamB: createEmptyTeam(),
      h2h: [],
    };
  }
}

function createEmptyTeam(): TeamData {
  return {
    stats: {
      games: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
      avgGF: 0, avgGA: 0, xg: 0, xga: 0,
    },
    form: { form: 'DDDDD', formPoints: [0,0,0,0,0], trend: 0 },
    value: { positiveValue: 0, negativeValue: 0, avgEdge: 0 },
    score: 0,
  };
}

/**
 * Calculate composite score for team comparison
 */
export function calculateCompositeScore(
  formPoints: number[],
  avgEdge: number,
  avgGF: number,
  avgGA: number,
  suspense: number
): number {
  // Form: max 15 points (3 per game * 5)
  const formScore = formPoints.reduce((a, b) => a + b, 0) / 15;
  
  // Value: normalized (-1 to 1 → 0 to 1)
  const valueScore = Math.max(0, avgEdge / 100 + 0.5);
  
  // Attack: 0-3 goals expected
  const attackScore = Math.min(1, avgGF / 3);
  
  // Defense: 0-3 goals allowed, inverted (0 = bad, 1 = good)
  const defenseScore = Math.max(0, 1 - avgGA / 3);
  
  // Suspense: higher = more even match
  const suspenseScore = suspense;

  return (
    0.30 * formScore +
    0.25 * valueScore +
    0.20 * attackScore +
    0.15 * defenseScore +
    0.10 * suspenseScore
  );
}
