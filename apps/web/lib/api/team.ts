// apps/web/lib/api/team.ts

export interface FormData {
  teamId: string;
  teamName: string;
  leagueId?: string;
  form: string;
  avgGoalsScored: number;
  avgGoalsConceded: number;
  formPoints: number[];
  trend: number;
}

export interface TeamDetailData {
  form: FormData;
  recentMatches?: any[];
}

export interface TeamParams {
  teamId: number;
  leagueId?: string;
}

/**
 * Get team detail data - league agnostic
 * Uses leagueId to fetch from the correct adapter
 */
export async function getTeamDetailData(params: TeamParams): Promise<TeamDetailData> {
  const { teamId, leagueId = 'BL1' } = params;
  
  try {
    // Fetch form data with league context
    const formRes = await fetch(`/api/form/${teamId}?league=${leagueId}`);
    const form = await formRes.json();

    return {
      form: {
        ...form,
        leagueId: leagueId,
      },
      recentMatches: [],
    };
  } catch (error) {
    console.error('Failed to fetch team data:', error);
    return {
      form: {
        teamId: String(teamId),
        teamName: `Team ${teamId}`,
        leagueId: leagueId,
        form: 'DDDDD',
        avgGoalsScored: 1.4,
        avgGoalsConceded: 1.4,
        formPoints: [0, 0, 0, 0, 0],
        trend: 0,
      },
      recentMatches: [],
    };
  }
}
