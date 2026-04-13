import { Router } from 'express';
import { getMatchById } from '../services/footballDataApi';
import { predictMatch } from '../prediction/poisson';
import { savePrediction, getAccuracyStats } from '../db/database';
import crypto from 'crypto';

function uuidv4(): string {
  return crypto.randomUUID();
}

const router = Router();

// Cache predictions in memory to avoid recomputing
const predictionCache = new Map<string, ReturnType<typeof predictMatch>>();

router.get('/:matchId', async (req, res) => {
  const { matchId } = req.params;

  // Check cache
  if (predictionCache.has(matchId)) {
    return res.json({ prediction: predictionCache.get(matchId) });
  }

  const match = await getMatchById(matchId);
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  const prediction = predictMatch(
    {
      avgGoalsScored: match.homeTeam.avgGoalsScored,
      avgGoalsConceded: match.homeTeam.avgGoalsConceded,
    },
    {
      avgGoalsScored: match.awayTeam.avgGoalsScored,
      avgGoalsConceded: match.awayTeam.avgGoalsConceded,
    },
    matchId
  );

  // Save to DB (fire and forget)
  try {
    savePrediction({
      id: uuidv4(),
      match_id: matchId,
      home_team: match.homeTeam.name,
      away_team: match.awayTeam.name,
      league: match.leagueName,
      match_date: match.utcDate,
      home_win_prob: prediction.homeWinProbability,
      draw_prob: prediction.drawProbability,
      away_win_prob: prediction.awayWinProbability,
      over25_prob: prediction.over25Probability,
      predicted_outcome: prediction.predictedOutcome,
      confidence: prediction.confidence,
      most_likely_home: prediction.mostLikelyScore.home,
      most_likely_away: prediction.mostLikelyScore.away,
    });
  } catch (e) {
    console.warn('DB save failed (non-critical):', e);
  }

  predictionCache.set(matchId, prediction);
  return res.json({ prediction });
});

router.get('/stats/accuracy', (_req, res) => {
  try {
    const stats = getAccuracyStats();
    res.json({ stats });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load accuracy stats' });
  }
});

export default router;
