// apps/web/lib/api/value-history.ts

export interface ValueHistoryItem {
  date: string;
  opponent: string;
  opponentId: string;
  market: 'HOME' | 'DRAW' | 'AWAY';
  probability: number;
  odds: number;
  fairOdds: number;
  edge: number;
  result: string;
}

export interface ValueHistorySummary {
  totalBets: number;
  positiveValue: number;
  negativeValue: number;
  neutral: number;
  avgEdge: number;
}

export interface ValueHistoryResponse {
  teamId: string;
  valueHistory: ValueHistoryItem[];
  summary: ValueHistorySummary;
}

/**
 * Fetch value history for a team
 */
export async function getValueHistory(
  teamId: number,
  limit: number = 10
): Promise<ValueHistoryResponse> {
  try {
    const res = await fetch(`/api/team/${teamId}/value-history?limit=${limit}`);
    if (!res.ok) {
      throw new Error('Failed to load value history');
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch value history:', error);
    return {
      teamId: String(teamId),
      valueHistory: [],
      summary: {
        totalBets: 0,
        positiveValue: 0,
        negativeValue: 0,
        neutral: 0,
        avgEdge: 0,
      },
    };
  }
}
