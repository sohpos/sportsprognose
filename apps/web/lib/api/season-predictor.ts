// apps/web/lib/api/season-predictor.ts

export interface SeasonPrediction {
  teamId: string;
  teamName: string;
  expectedPoints: number;
  championshipProbability: number;
  relegationProbability: number;
  top4Probability: number;
  top6Probability: number;
  positionDistribution: number[];
}

export interface SeasonPredictorResponse {
  league: string;
  simulations: number;
  lastUpdated: string;
  standings: SeasonPrediction[];
}

export async function getSeasonPredictor(
  league: string = 'BL1',
  iterations: number = 1000
): Promise<SeasonPredictorResponse | null> {
  try {
    const res = await fetch(`/api/season/${league}?iterations=${iterations}`);
    if (!res.ok) throw new Error('Failed to fetch season predictor');
    return res.json();
  } catch (error) {
    console.error('Failed to fetch season predictor:', error);
    return null;
  }
}
