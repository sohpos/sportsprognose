import { Router } from 'express';
import { runSeasonSimulation } from '../../services/seasonPredictor';

const router = Router();

// Mock teams for testing
const MOCK_TEAMS = [
  { id: '1', name: 'Bayern München', xG: 72, xGA: 25, games: 30, homeStrength: 1.2 },
  { id: '2', name: 'Dortmund', xG: 58, xGA: 32, games: 30, homeStrength: 1.15 },
  { id: '3', name: 'Leverkusen', xG: 65, xGA: 28, games: 30, homeStrength: 1.1 },
  { id: '4', name: 'Stuttgart', xG: 52, xGA: 38, games: 30, homeStrength: 1.12 },
  { id: '5', name: 'Leipzig', xG: 55, xGA: 35, games: 30, homeStrength: 1.15 },
  { id: '6', name: 'Frankfurt', xG: 45, xGA: 40, games: 30, homeStrength: 1.1 },
  { id: '7', name: 'Freiburg', xG: 42, xGA: 38, games: 30, homeStrength: 1.08 },
  { id: '8', name: 'Wolfsburg', xG: 40, xGA: 42, games: 30, homeStrength: 1.1 },
  { id: '9', name: 'Hoffenheim', xG: 45, xGA: 48, games: 30, homeStrength: 1.12 },
  { id: '10', name: 'M\'gladbach', xG: 38, xGA: 40, games: 30, homeStrength: 1.1 },
];

// Generate remaining fixtures (simplified)
function generateFixtures(teamIds: string[]): { homeId: string; awayId: string }[] {
  const fixtures = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      // Randomize who plays home
      if (Math.random() > 0.5) {
        fixtures.push({ homeId: teamIds[i], awayId: teamIds[j] });
        fixtures.push({ homeId: teamIds[j], awayId: teamIds[i] });
      } else {
        fixtures.push({ homeId: teamIds[j], awayId: teamIds[i] });
        fixtures.push({ homeId: teamIds[i], awayId: teamIds[j] });
      }
    }
  }
  return fixtures;
}

// Season Predictor endpoint
router.get('/:league', async (req, res) => {
  const { league } = req.params;
  const { iterations = '1000' } = req.query;
  
  console.log(`[SEASON] Running prediction for ${league} with ${iterations} iterations`);
  
  try {
    const teamIds = MOCK_TEAMS.map(t => t.id);
    const fixtures = generateFixtures(teamIds);
    
    const results = runSeasonSimulation(MOCK_TEAMS, fixtures, parseInt(iterations as string));
    
    res.json({
      league,
      simulations: parseInt(iterations as string),
      lastUpdated: new Date().toISOString(),
      standings: results,
    });
  } catch (e) {
    console.error('[SEASON] Error:', e);
    res.status(500).json({ error: 'Failed to run season simulation' });
  }
});

export default router;
