// backend/src/core/poisson.ts
// Poisson model for goal distribution

import { ScoreDistribution } from './types';

/**
 * Calculate Poisson probability:
 * P(k) = e^(-λ) × λ^k / k!
 */
export function poissonProb(k: number, lambda: number): number {
  if (k < 0 || lambda <= 0) return 0;
  
  // Use log for numerical stability
  const logProb = -lambda + k * Math.log(lambda) - logFactorial(k);
  return Math.exp(logProb);
}

// Precomputed factorials for 0-10
const factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];

function logFactorial(n: number): number {
  if (n <= 10) return Math.log(factorials[n]);
  
  // Stirling approximation for large n
  return n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
}

/**
 * Generate score matrix for a match
 * Returns 2D array: matrix[homeGoals][awayGoals] = probability
 */
export function calculateScoreMatrix(
  lambdaHome: number,
  lambdaAway: number,
  maxGoals: number = 6
): ScoreDistribution {
  const matrix: number[][] = [];

  for (let home = 0; home <= maxGoals; home++) {
    matrix[home] = [];
    for (let away = 0; away <= maxGoals; away++) {
      const probHome = poissonProb(home, lambdaHome);
      const probAway = poissonProb(away, lambdaAway);
      matrix[home][away] = probHome * probAway;
    }
  }

  // Normalize (may not sum to exactly 1 due to truncation)
  normalizeMatrix(matrix);
  
  return { matrix };
}

/**
 * Normalize score matrix so all probabilities sum to 1
 */
function normalizeMatrix(matrix: number[][]): void {
  let sum = 0;
  for (let home = 0; home < matrix.length; home++) {
    for (let away = 0; away < matrix[home].length; away++) {
      sum += matrix[home][away];
    }
  }

  if (sum > 0) {
    for (let home = 0; home < matrix.length; home++) {
      for (let away = 0; away < matrix[home].length; away++) {
        matrix[home][away] /= sum;
      }
    }
  }
}

/**
 * Aggregate score matrix to 1X2 probabilities
 */
export function aggregateTo1X2(matrix: number[][]): {
  homeWin: number;
  draw: number;
  awayWin: number;
} {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  for (let home = 0; home < matrix.length; home++) {
    for (let away = 0; away < matrix[home].length; away++) {
      const prob = matrix[home][away];
      if (home > away) {
        homeWin += prob;
      } else if (home === away) {
        draw += prob;
      } else {
        awayWin += prob;
      }
    }
  }

  return {
    homeWin: Math.round(homeWin * 10000) / 10000,
    draw: Math.round(draw * 10000) / 10000,
    awayWin: Math.round(awayWin * 10000) / 10000,
  };
}

/**
 * Calculate confidence (security) - gap between most and second most likely outcome
 */
export function calculateConfidence(matrix: number[][]): number {
  const { homeWin, draw, awayWin } = aggregateTo1X2(matrix);
  
  const probs = [homeWin, draw, awayWin].sort((a, b) => b - a);
  const gap = probs[0] - probs[1];
  
  return Math.round(gap * 10000) / 10000; // 4 decimal places
}

/**
 * Calculate expected goals from strength parameters
 */
export function calculateLambda(
  attackStrength: number,
  defenseWeakness: number,
  homeAdvantage: number = 1.1
): number {
  // λ = Attack × DefenseWeakness × HomeAdvantage
  // DefenseWeakness = LeagueAvgGoals / ActualGoalsAgainst
  const lambda = attackStrength * defenseWeakness * homeAdvantage;
  
  // Cap at reasonable max (avoid overflow)
  return Math.min(lambda, 5);
}

/**
 * Calculate defense weakness (inverse of defense strength)
 */
export function calculateDefenseWeakness(
  defenseStrength: number
): number {
  // If team concedes MORE than average, weakness > 1
  // If team concedes LESS than average, weakness < 1
  return defenseStrength > 0 ? 1 / defenseStrength : 1;
}