// backend/src/core/value.ts
// Value calculation - comparing model probabilities with bookmaker odds

import { Prediction } from './types';

/**
 * Calculate fair probability from odds
 */
export function fairProbability(odds: number): number {
  if (odds <= 0) return 0;
  return 1 / odds;
}

/**
 * Calculate value percentage
 * Value = (ModelProb - FairProb) * 100
 * 
 * Positive value = edge in our favor
 * Negative value = edge for bookmaker
 */
export function calculateValue(
  modelProb: number,
  odds: number
): number {
  const fairProb = fairProbability(odds);
  const value = (modelProb - fairProb) * 100;
  
  return Math.round(value * 100) / 100; // 2 decimal places
}

/**
 * Value category for display
 */
export function valueCategory(value: number): {
  label: string;
  color: string;
  recommendation: 'BET' | 'SKIP' | 'LAY';
} {
  if (value > 10) {
    return { label: '🔥 STRONG BET', color: 'green', recommendation: 'BET' };
  }
  if (value > 5) {
    return { label: '✅ VALUE', color: 'green', recommendation: 'BET' };
  }
  if (value < -10) {
    return { label: '❌ LAY', color: 'red', recommendation: 'LAY' };
  }
  if (value < -5) {
    return { label: '⚠️ AVOID', color: 'red', recommendation: 'LAY' };
  }
  return { label: '➖ NO VALUE', color: 'gray', recommendation: 'SKIP' };
}

/**
 * Calculate value score (weighted by confidence)
 */
export function calculateValueScore(
  value: number,
  confidence: number
): number {
  // Value score = value * confidence factor
  // Confidence factor: 0.5 to 1.0
  const confidenceFactor = Math.max(0.5, Math.min(1, confidence));
  const valueScore = value * confidenceFactor;
  
  return Math.round(valueScore * 100) / 100;
}

/**
 * Process multiple odds (1X2) for value calculation
 */
export function calculate1X2Value(
  homeWinProb: number,
  drawProb: number,
  awayWinProb: number,
  homeOdds: number,
  drawOdds: number,
  awayOdds: number,
  confidence: number
): {
  home: number;
  draw: number;
  away: number;
  bestPick: 'HOME' | 'DRAW' | 'AWAY' | null;
} {
  const homeValue = calculateValue(homeWinProb, homeOdds);
  const drawValue = calculateValue(drawProb, drawOdds);
  const awayValue = calculateValue(awayWinProb, awayOdds);

  const values = [
    { pick: 'HOME' as const, value: homeValue },
    { pick: 'DRAW' as const, value: drawValue },
    { pick: 'AWAY' as const, value: awayValue },
  ];

  // Sort by value descending
  values.sort((a, b) => b.value - a.value);

  return {
    home: homeValue,
    draw: drawValue,
    away: awayValue,
    bestPick: values[0].value > 0 ? values[0].pick : null,
  };
}