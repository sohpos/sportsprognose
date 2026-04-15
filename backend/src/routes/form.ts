import { Router } from 'express';
import { getTeamStatsFromOpenligaDB } from '../services/footballDataApi';

const router = Router();

// Get detailed form curve for a team
router.get('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  console.log(`[FORM] Request for team: ${teamId}`);
  
  try {
    // Get team stats including form
    const stats = await getTeamStatsFromOpenligaDB(teamId);
    
    const formStr = stats?.form || 'DDDDD';
    const formPoints = formStr.slice(0, 5).split('').map((r: string) => r === 'W' ? 3 : r === 'D' ? 1 : 0);
    const trend = calculateTrend(formStr);
    
    res.json({
      teamId,
      teamName: `Team ${teamId}`,
      avgGoalsScored: stats?.avgGoalsScored || 1.4,
      avgGoalsConceded: stats?.avgGoalsConceded || 1.4,
      form: formStr,
      formPoints,
      trend,
    });
  } catch (e) {
    console.error('[FORM] Error:', e);
    res.status(500).json({ error: 'Failed to load form curve' });
  }
});

function calculateTrend(form: string): number {
  if (form.length < 3) return 0;
  const recent = form.slice(-3).replace(/W/g, '3').replace(/D/g, '1').replace(/L/g, '0')
    .split('').reduce((a: number, b: string) => a + parseInt(b), 0);
  const older = form.slice(0, 3).replace(/W/g, '3').replace(/D/g, '1').replace(/L/g, '0')
    .split('').reduce((a: number, b: string) => a + parseInt(b), 0);
  
  if (recent > older + 2) return 1;
  if (recent < older - 2) return -1;
  return 0;
}

export default router;
