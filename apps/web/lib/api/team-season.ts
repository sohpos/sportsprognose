// apps/web/lib/api/team-season.ts

export interface TeamSeasonStats {
  teamId: number;
  leagueId?: string;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  avgGF: number;
  avgGA: number;
  xg: number;
  xga: number;
}

/**
 * Fetch team season statistics
 */
export async function getTeamSeasonStats(
  teamId: number,
  leagueId?: string
): Promise<TeamSeasonStats> {
  const query = leagueId ? `?league=${leagueId}` : '';
  
  try {
    const res = await fetch(`/api/team/${teamId}/season${query}`);
    if (!res.ok) {
      throw new Error('Failed to load season stats');
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch season stats:', error);
    // Return default stats on error
    return {
      teamId,
      leagueId,
      games: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      avgGF: 0,
      avgGA: 0,
      xg: 0,
      xga: 0,
    };
  }
}
