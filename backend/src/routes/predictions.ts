import { Router } from 'express';
import { getMatchById, getPastMatches, getHeadToHead } from '../services/footballDataApi';
import { predictMatch, addValueBets } from '../prediction/poisson';
import { savePrediction, getAccuracyStats } from '../db/database';
import crypto from 'crypto';

function uuidv4(): string {
  return crypto.randomUUID();
}

const router = Router();

const predictionCache = new Map<string, ReturnType<typeof predictMatch>>();

// Get Head-to-Head matches between two teams
router.get('/h2h/:team1Id/:team2Id', async (req, res) => {
  const { team1Id, team2Id } = req.params;
  console.log(`[H2H] Request: ${team1Id} vs ${team2Id}`);
  try {
    const h2h = await getHeadToHead(team1Id, team2Id);
    console.log(`[H2H] Found: ${h2h.length} matches`);
    
    // Calculate H2H stats
    const stats = {
      totalMatches: h2h.length,
      homeWins: h2h.filter(m => m.homeGoals > m.awayGoals).length,
      awayWins: h2h.filter(m => m.awayGoals > m.homeGoals).length,
      draws: h2h.filter(m => m.homeGoals === m.awayGoals).length,
      btts: h2h.filter(m => m.homeGoals > 0 && m.awayGoals > 0).length,
      over25: h2h.filter(m => (m.homeGoals + m.awayGoals) > 2).length,
      avgGoals: h2h.length > 0 
        ? (h2h.reduce((sum, m) => sum + m.homeGoals + m.awayGoals, 0) / h2h.length).toFixed(2)
        : '0',
    };
    
    res.json({ h2h, stats });
  } catch (e) {
    console.error('[H2H] Error:', e);
    res.json({ h2h: [], stats: {} });
  }
});

router.get('/:matchId', async (req, res) => {
  const { matchId } = req.params;

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
  const predictionWithValue = addValueBets(prediction);
  return res.json({ prediction: predictionWithValue });
});

router.get('/stats/accuracy', (_req, res) => {
  try {
    const stats = getAccuracyStats();
    res.json({ stats });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load accuracy stats' });
  }
});

// Get past matches for display
router.get('/past', async (req, res) => {
  const { league } = req.query;
  try {
    const matches = await getPastMatches(league as string | undefined);
    res.json({ matches, total: matches.length });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load past matches' });
  }
});

export default router;
