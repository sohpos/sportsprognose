import { Router, Request, Response } from 'express';
import { getLeagueTable, getTeamStats, getTeamForm, getAllTeams } from '../services/footballDataApi';

const router = Router();

// GET /api/teams - List all teams
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const { league = 'BL1' } = req.query;
    const teams = await getAllTeams(league as string);
    res.json({ teams });
  } catch (error) {
    console.error('[API] /teams error:', error);
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
    console.error('[API] /table error:', error);
    res.status(500).json({ error: 'Failed to fetch table' });
  }
});

// GET /api/stats/:teamId - Team statistics
router.get('/stats/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const stats = await getTeamStats(teamId);
    res.json({ teamId, stats });
  } catch (error) {
    console.error('[API] /stats error:', error);
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
});

// GET /api/form/:teamId - Team form (last 5 games)
router.get('/form/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const form = await getTeamForm(teamId);
    res.json({ teamId, form });
  } catch (error) {
    console.error('[API] /form error:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

export default router;