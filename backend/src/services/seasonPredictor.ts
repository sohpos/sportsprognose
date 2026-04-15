// backend/src/services/seasonPredictor.ts

/**
 * Season Predictor Service
 * Monte-Carlo simulation to predict season outcomes
 */

interface Team {
  id: string;
  name: string;
  xG: number;
  xGA: number;
  games: number;
  homeStrength?: number;
  awayStrength?: number;
}

interface Match {
  homeId: string;
  awayId: string;
}

interface SimulationResult {
  teamId: string;
  teamName: string;
  expectedPoints: number;
  championshipProbability: number;
  relegationProbability: number;
  top4Probability: number;
  top6Probability: number;
  positionDistribution: number[]; // 1-18 positions
}

interface TeamStrength {
  id: string;
  name: string;
  attack: number;
  defense: number;
  homeAdvantage: number;
}

// Poisson distribution - probability of scoring k goals
function poisson(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Compute team strength from stats
export function computeTeamStrength(team: Team): TeamStrength {
  const attack = team.games > 0 ? team.xG / team.games : 1.5;
  const defense = team.games > 0 ? team.xGA / team.games : 1.5;
  
  return {
    id: team.id,
    name: team.name,
    attack,
    defense,
    homeAdvantage: team.homeStrength || 1.12, // Home teams score ~12% more
  };
}

// Simulate a single match
function simulateMatch(home: TeamStrength, away: TeamStrength): { homeGoals: number; awayGoals: number } {
  // Expected goals
  const lambdaHome = home.attack * away.defense * home.homeAdvantage;
  const lambdaAway = away.attack * home.defense;
  
  // Generate goals using poisson
  let pHome = 0;
  let pAway = 0;
  let cumulative = 0;
  
  // Home goals
  let homeGoals = 0;
  let prob = poisson(0, lambdaHome);
  cumulative = prob;
  const r1 = Math.random();
  while (cumulative < r1) {
    homeGoals++;
    prob = poisson(homeGoals, lambdaHome);
    cumulative += prob;
  }
  
  // Away goals
  let awayGoals = 0;
  prob = poisson(0, lambdaAway);
  cumulative = prob;
  const r2 = Math.random();
  while (cumulative < r2) {
    awayGoals++;
    prob = poisson(awayGoals, lambdaAway);
    cumulative += prob;
  }
  
  return { homeGoals, awayGoals };
}

// Get points from match result
function getPoints(homeGoals: number, awayGoals: number): { home: number; away: number } {
  if (homeGoals > awayGoals) return { home: 3, away: 0 };
  if (homeGoals < awayGoals) return { home: 0, away: 3 };
  return { home: 1, away: 1 };
}

// Run Monte-Carlo simulation
export function runSeasonSimulation(
  teams: Team[],
  matches: Match[],
  iterations: number = 10000
): SimulationResult[] {
  const results: Map<string, SimulationResult> = new Map();
  
  // Initialize results
  teams.forEach(team => {
    results.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      expectedPoints: 0,
      championshipProbability: 0,
      relegationProbability: 0,
      top4Probability: 0,
      top6Probability: 0,
      positionDistribution: Array(18).fill(0),
    });
  });
  
  // Compute team strengths
  const strengths = new Map<string, TeamStrength>();
  teams.forEach(team => {
    strengths.set(team.id, computeTeamStrength(team));
  });
  
  // Run simulations
  for (let i = 0; i < iterations; i++) {
    const table: Map<string, number> = new Map();
    teams.forEach(team => table.set(team.id, 0));
    
    // Simulate each match
    matches.forEach(match => {
      const home = strengths.get(match.homeId);
      const away = strengths.get(match.awayId);
      
      if (!home || !away) return;
      
      const { homeGoals, awayGoals } = simulateMatch(home, away);
      const points = getPoints(homeGoals, awayGoals);
      
      table.set(match.homeId, (table.get(match.homeId) || 0) + points.home);
      table.set(match.awayId, (table.get(match.awayId) || 0) + points.away);
    });
    
    // Sort by points
    const sorted = Array.from(table.entries())
      .sort((a, b) => b[1] - a[1]);
    
    // Update results
    sorted.forEach(([teamId, points], position) => {
      const result = results.get(teamId)!;
      result.expectedPoints += points;
      result.positionDistribution[position]++;
      
      if (position === 0) result.championshipProbability++;
      if (position < 4) result.top4Probability++;
      if (position < 6) result.top6Probability++;
      if (position >= 15) result.relegationProbability++;
    });
  }
  
  // Average and convert to percentages
  return Array.from(results.values()).map(result => ({
    ...result,
    expectedPoints: Math.round(result.expectedPoints / iterations * 10) / 10,
    championshipProbability: Math.round(result.championshipProbability / iterations * 1000) / 10,
    relegationProbability: Math.round(result.relegationProbability / iterations * 1000) / 10,
    top4Probability: Math.round(result.top4Probability / iterations * 1000) / 10,
    top6Probability: Math.round(result.top6Probability / iterations * 1000) / 10,
    positionDistribution: result.positionDistribution.map(p => 
      Math.round(p / iterations * 1000) / 10
    ),
  })).sort((a, b) => b.expectedPoints - a.expectedPoints);
}
