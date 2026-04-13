import { Router } from 'express';
import { getUpcomingMatches, getSupportedLeagues } from '../services/footballDataApi';

const router = Router();

router.get('/', async (req, res) => {
  const { league } = req.query;
  const leagueCode = typeof league === 'string' ? league : undefined;

  try {
    const matches = await getUpcomingMatches(leagueCode);
    res.json({ matches, total: matches.length, source: process.env.FOOTBALL_API_KEY ? 'live' : 'mock' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

router.get('/leagues', (_req, res) => {
  res.json({ leagues: getSupportedLeagues() });
});

export default router;
