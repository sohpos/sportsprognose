// backend/src/core/predictor.ts
// Main prediction engine - brings together Poisson, Team Strength, and Value

import { Match, Prediction, TeamStrength } from './types';
import { calculateScoreMatrix, aggregateTo1X2, calculateConfidence, calculateLambda, calculateDefenseWeakness } from './poisson';
import { calculate1X2Value, valueCategory } from './value';

/**
 * Generate prediction for a single match
 */
export function predictMatch(
  match: Match,
  homeStrength: TeamStrength,
  awayStrength: TeamStrength
): Prediction {
  // Calculate lambda values
  const lambdaHome = calculateLambda(
    homeStrength.attackStrength,
    calculateDefenseWeakness(awayStrength.defenseStrength),
    homeStrength.homeAdvantage
  );

  const lambdaAway = calculateLambda(
    awayStrength.attackStrength,
    calculateDefenseWeakness(homeStrength.defenseStrength),
    1.0 // No home advantage for away team
  );

  // Generate score matrix
  const scoreMatrix = calculateScoreMatrix(lambdaHome, lambdaAway);

  // Aggregate to 1X2
  const { homeWin, draw, awayWin } = aggregateTo1X2(scoreMatrix.matrix);

  // Calculate confidence/security
  const confidence = calculateConfidence(scoreMatrix.matrix);

  // Return prediction
  return {
    matchId: match.id,
    homeWinProb: homeWin,
    drawProb: draw,
    awayWinProb: awayWin,
    scoreMatrix,
    confidence,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Prediction with value - extended type
 */
export interface PredictionWithValue extends Prediction {
  homeValue: number;
  drawValue: number;
  awayValue: number;
  valuePick: 'HOME' | 'DRAW' | 'AWAY' | null;
}

/**
 * Add odds and value to prediction
 */
export function addValueToPrediction(
  prediction: Prediction,
  homeOdds: number,
  drawOdds: number,
  awayOdds: number
): PredictionWithValue {
  const value = calculate1X2Value(
    prediction.homeWinProb,
    prediction.drawProb,
    prediction.awayWinProb,
    homeOdds,
    drawOdds,
    awayOdds,
    prediction.confidence
  );

  const pick = value.bestPick;
  
  return {
    ...prediction,
    homeValue: value.home,
    drawValue: value.draw,
    awayValue: value.away,
    valuePick: pick ?? null,
  };
}

/**
 * Generate match prediction with odds value
 */
export function predictMatchWithOdds(
  match: Match,
  homeStrength: TeamStrength,
  awayStrength: TeamStrength,
  homeOdds: number,
  drawOdds: number,
  awayOdds: number
): PredictionWithValue {
  const prediction = predictMatch(match, homeStrength, awayStrength);
  return addValueToPrediction(prediction, homeOdds, drawOdds, awayOdds);
}

// League average goals (for form calculations)
export const DEFAULT_LEAGUE_AVG = {
  BL1: { scored: 1.85, conceded: 1.85 },
  PL: { scored: 1.52, conceded: 1.52 },
  PD: { scored: 1.68, conceded: 1.68 },
  CL: { scored: 1.45, conceded: 1.45 },
};
