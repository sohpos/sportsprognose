import { Router, Request, Response } from 'express';
import { predictMatch, addValueToPrediction } from '../core/predictor';
import { TeamStrength } from '../core/types';
import { getAllTeams, getTeamStats, getTeamForm, getLeagueTable } from '../services/footballDataApi';

// Helper to get strength from API data
function getStrengthFromStats(stats: any): TeamStrength {
  return {
    teamId: stats.teamId || 'unknown',
    league: stats.league || 'BL1',
    attackStrength: stats.xG ? stats.xG / 50 : 1.0, // Normalize
    defenseStrength: stats.xGA ? 50 / stats.xGA : 1.0,
    form: stats.form || [1,1,1,1,1],
    homeAdvantage: 1.1,
    lastUpdate: new Date().toISOString(),
  };
}

const router = Router();

// GET /api/predictions/:matchId
router.get('/predictions/:matchId', async (req: Request, res: Response) => {
  const { matchId } = req.params;
  const { homeOdds, drawOdds, awayOdds } = req.query;

  try {
    // Get teams from database (or API)
    const [homeId, awayId] = matchId.split('-vs-');
    
    const homeStats = await getTeamStats(homeId);
    const awayStats = await getTeamStats(awayId);

    if (!homeStats || !awayStats) {
      res.status(404).json({ error: 'Teams not found' });
      return;
    }

    const homeStrength = getStrengthFromStats(homeStats);
    const awayStrength = getStrengthFromStats(awayStats);

    // Create match object
    const match: any = {
      id: matchId,
      homeTeam: { id: homeId },
      awayTeam: { id: awayId },
    };

    // Generate prediction
    let prediction = predictMatch(match, homeStrength, awayStrength);

    // Add odds if provided
    if (homeOdds && drawOdds && awayOdds) {
      prediction = addValueToPrediction(
        prediction,
        parseFloat(homeOdds as string),
        parseFloat(drawOdds as string),
        parseFloat(awayOdds as string)
      );
    }

    res.json({
      matchId,
      prediction,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// GET /api/teams - All teams
router.get('/teams', async (_req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    res.json({ teams });
  } catch (error) {
    console.error('Teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// GET /api/table/:league - League table
router.get('/table/:league', async (req: Request, res: Response) => {
  try {
    const { league } = req.params;
    const table = await getLeagueTable(league);
    res.json({ league, table });
  } catch (error) {
    console.error('Table error:', error);
    res.status(500).json({ error: 'Failed to fetch table' });
  }
});

// GET /api/form/:teamId - Team form
router.get('/form/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const form = await getTeamForm(teamId);
    res.json({ teamId, form });
  } catch (error) {
    console.error('Form error:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// GET /api/stats/:teamId
router.get('/stats/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const stats = await getTeamStats(teamId);
    res.json({ teamId, stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;