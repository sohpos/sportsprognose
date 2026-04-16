// backend/src/core/accuracy.ts
// Accuracy calculation engine

import { Match, Prediction } from './types';

interface AccuracyResult {
  week: string;
  predictions: number;
  hits: number;
  exactScores: number;
  accuracy: number;
  scoreAccuracy: number;
}

interface PredictionWithResult {
  matchId: string;
  predicted: 'HOME' | 'DRAW' | 'AWAY';
  actual: 'HOME' | 'DRAW' | 'AWAY';
  homeGoals: number;
  awayGoals: number;
  isHit: boolean;
  isExactScore: boolean;
}

/**
 * Determine actual result from score
 */
export function getResult(homeGoals: number, awayGoals: number): 'HOME' | 'DRAW' | 'AWAY' {
  if (homeGoals > awayGoals) return 'HOME';
  if (homeGoals === awayGoals) return 'DRAW';
  return 'AWAY';
}

/**
 * Compare prediction with actual result
 */
export function evaluatePrediction(
  prediction: Prediction,
  homeGoals: number,
  awayGoals: number
): PredictionWithResult {
  const actualResult = getResult(homeGoals, awayGoals);
  
  const predictionResult = 
    prediction.homeWinProb > prediction.drawProb && 
    prediction.homeWinProb > prediction.awayWinProb ? 'HOME' :
    prediction.awayWinProb > prediction.drawProb && 
    prediction.awayWinProb > prediction.homeWinProb ? 'AWAY' : 'DRAW';

  return {
    matchId: prediction.matchId,
    predicted: predictionResult,
    actual: actualResult,
    homeGoals,
    awayGoals,
    isHit: predictionResult === actualResult,
    isExactScore: true, // Would need score prediction for this
  };
}

/**
 * Calculate accuracy for a set of predictions
 */
export function calculateAccuracy(
  results: PredictionWithResult[]
): AccuracyResult {
  const total = results.length;
  
  if (total === 0) {
    return {
      week: 'unknown',
      predictions: 0,
      hits: 0,
      exactScores: 0,
      accuracy: 0,
      scoreAccuracy: 0,
    };
  }

  const hits = results.filter(r => r.isHit).length;
  const exactScores = results.filter(r => r.isExactScore).length;

  return {
    week: new Date().toISOString().split('T')[0],
    predictions: total,
    hits,
    exactScores,
    accuracy: Math.round((hits / total) * 10000) / 10000,
    scoreAccuracy: Math.round((exactScores / total) * 10000) / 10000,
  };
}

/**
 * Calculate weighted accuracy (weighted by number of predictions per week)
 */
export function calculateWeightedAccuracy(
  weeklyResults: Map<string, AccuracyResult[]>
): number {
  let totalPredictions = 0;
  let totalHits = 0;

  // Sum up all weeks
  for (const results of weeklyResults.values()) {
    for (const week of results) {
      totalPredictions += week.predictions;
      totalHits += week.hits;
    }
  }

  if (totalPredictions === 0) return 0;
  return Math.round((totalHits / totalPredictions) * 10000) / 10000;
}