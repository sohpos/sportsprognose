// apps/web/lib/api/team.ts

export interface FormData {
  teamId: string;
  teamName: string;
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

export async function getTeamDetailData(teamId: number): Promise<TeamDetailData> {
  try {
    // Fetch form data
    const formRes = await fetch(`/api/form/${teamId}`);
    const form = await formRes.json();

    return {
      form: form,
      recentMatches: [],
    };
  } catch (error) {
    console.error('Failed to fetch team data:', error);
    return {
      form: {
        teamId: String(teamId),
        teamName: `Team ${teamId}`,
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
