import { Router } from 'express';
import { getTeamStatsFromOpenligaDB } from '../../services/footballDataApi';

const router = Router();

// Get value history for a team
router.get('/:teamId/value-history', async (req, res) => {
  const { teamId } = req.params;
  const { limit = '10' } = req.query;
  console.log(`[VALUE] Fetching value history for team: ${teamId}`);

  try {
    // Get team's recent matches from OpenLigaDB
    const stats = await getTeamStatsFromOpenligaDB(teamId);
    
    // Generate mock value history based on form
    const form = stats?.form || 'DDDDD';
    const formArr = form.split('');
    const limitNum = Math.min(parseInt(limit as string), 10);
    
    const valueHistory = formArr.slice(0, limitNum).map((result, index) => {
      // Simulate probabilities and calculate value
      const homeProb = Math.random() * 0.3 + 0.3; // 30-60%
      const drawProb = Math.random() * 0.2 + 0.2;  // 20-40%
      const awayProb = 1 - homeProb - drawProb;
      
      // Simulate odds (bookmaker)
      const homeOdds = (Math.random() * 1 + 1.5).toFixed(2);
      const drawOdds = (Math.random() * 1.5 + 2.5).toFixed(2);
      const awayOdds = (Math.random() * 2 + 2).toFixed(2);
      
      // Calculate value (edge)
      const market = index % 2 === 0 ? 'HOME' : 'AWAY';
      const prob = market === 'HOME' ? homeProb : awayProb;
      const odds = market === 'HOME' ? parseFloat(homeOdds) : parseFloat(awayOdds);
      const fairOdds = 1 / prob;
      const edge = (prob - (1 / odds)) * 100;
      
      return {
        date: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        opponent: `Team ${Math.floor(Math.random() * 20) + 1}`,
        opponentId: String(Math.floor(Math.random() * 50) + 1),
        market,
        probability: Math.round(prob * 100),
        odds: odds,
        fairOdds: Math.round(fairOdds * 100) / 100,
        edge: Math.round(edge),
        result: result,
      };
    });

    res.json({
      teamId,
      valueHistory: valueHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      summary: {
        totalBets: valueHistory.length,
        positiveValue: valueHistory.filter(v => v.edge > 5).length,
        negativeValue: valueHistory.filter(v => v.edge < -5).length,
        neutral: valueHistory.filter(v => v.edge >= -5 && v.edge <= 5).length,
        avgEdge: Math.round(valueHistory.reduce((sum, v) => sum + v.edge, 0) / valueHistory.length),
      },
    });
  } catch (e) {
    console.error('[VALUE] Error:', e);
    res.status(500).json({ error: 'Failed to load value history', valueHistory: [] });
  }
});

export default router;
