import { PredictionResult, ScorelineProbability } from '../types';

/**
 * Factorial function (cached for performance)
 */
const factorialCache: number[] = [1];
function factorial(n: number): number {
  if (n <= 1) return 1;
  if (factorialCache[n]) return factorialCache[n];
  factorialCache[n] = n * factorial(n - 1);
  return factorialCache[n];
}

/**
 * Poisson probability: P(k events) = (lambda^k * e^-lambda) / k!
 */
function poissonProbability(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Dixon-Coles adjustment for low-scoring matches
 * Corrects for the statistical dependency between 0-0, 1-0, 0-1, 1-1
 */
function dixonColesAdjustment(
  homeGoals: number,
  awayGoals: number,
  lambdaHome: number,
  lambdaAway: number,
  rho: number = -0.13
): number {
  if (homeGoals === 0 && awayGoals === 0) {
    return 1 - lambdaHome * lambdaAway * rho;
  }
  if (homeGoals === 1 && awayGoals === 0) {
    return 1 + lambdaAway * rho;
  }
  if (homeGoals === 0 && awayGoals === 1) {
    return 1 + lambdaHome * rho;
  }
  if (homeGoals === 1 && awayGoals === 1) {
    return 1 - rho;
  }
  return 1;
}

export interface TeamStats {
  avgGoalsScored: number;
  avgGoalsConceded: number;
}

/**
 * League average goals (used for attack/defence strength normalization)
 */
const LEAGUE_AVG_GOALS = 1.35;
const HOME_ADVANTAGE = 1.1; // ~10% boost for home team

/**
 * Main Poisson prediction engine
 */
export function predictMatch(
  homeTeam: TeamStats,
  awayTeam: TeamStats,
  matchId: string
): PredictionResult {
  // Attack strength = team avg goals scored / league average
  const homeAttack = homeTeam.avgGoalsScored / LEAGUE_AVG_GOALS;
  const awayAttack = awayTeam.avgGoalsScored / LEAGUE_AVG_GOALS;

  // Defence strength = team avg goals conceded / league average
  const homeDefence = homeTeam.avgGoalsConceded / LEAGUE_AVG_GOALS;
  const awayDefence = awayTeam.avgGoalsConceded / LEAGUE_AVG_GOALS;

  // Expected goals (lambda) for each team
  const lambdaHome = homeAttack * awayDefence * LEAGUE_AVG_GOALS * HOME_ADVANTAGE;
  const lambdaAway = awayAttack * homeDefence * LEAGUE_AVG_GOALS;

  // Build score matrix (0-6 goals each)
  const maxGoals = 6;
  const scoreMatrix: ScorelineProbability[] = [];

  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over25 = 0;
  let totalProb = 0;

  let bestProb = 0;
  let mostLikelyScore = { home: 1, away: 1 };

  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const prob =
        poissonProbability(lambdaHome, h) *
        poissonProbability(lambdaAway, a) *
        dixonColesAdjustment(h, a, lambdaHome, lambdaAway);

      scoreMatrix.push({ homeGoals: h, awayGoals: a, probability: prob });
      totalProb += prob;

      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;

      if (h + a > 2.5) over25 += prob;

      if (prob > bestProb) {
        bestProb = prob;
        mostLikelyScore = { home: h, away: a };
      }
    }
  }

  // Normalize
  homeWin /= totalProb;
  draw /= totalProb;
  awayWin /= totalProb;
  over25 /= totalProb;

  // Determine predicted outcome
  const maxProb = Math.max(homeWin, draw, awayWin);
  let predictedOutcome: 'HOME' | 'DRAW' | 'AWAY';
  if (maxProb === homeWin) predictedOutcome = 'HOME';
  else if (maxProb === draw) predictedOutcome = 'DRAW';
  else predictedOutcome = 'AWAY';

  // Confidence: how dominant is the top outcome?
  const confidence = Math.round(maxProb * 100);

  // Top 5 most likely scores
  const allScores = scoreMatrix.flat().map((row: any, idx: number) => ({
    homeGoals: Math.floor(idx / (maxGoals + 1)),
    awayGoals: idx % (maxGoals + 1),
    probability: row.probability
  })).sort((a: any, b: any) => b.probability - a.probability).slice(0, 5);

  return {
    matchId,
    homeWinProbability: homeWin,
    drawProbability: draw,
    awayWinProbability: awayWin,
    over25Probability: over25,
    under25Probability: 1 - over25,
    mostLikelyScore,
    scoreMatrix: scoreMatrix.map(s => ({
      ...s,
      probability: s.probability / totalProb,
    })),
    confidence,
    predictedOutcome,
    generatedAt: new Date().toISOString(),
  };
}
