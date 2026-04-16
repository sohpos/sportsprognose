// apps/web/app/predictor/mockData.ts
// Comprehensive mock data for Season Predictor

import { BUNDESLIGA_TEAMS } from '@/components/season-predictor/teams';

// Realistic Bundesliga expected points (xP)
const xPRankings: Record<string, number> = {
  'bl1-1': 78, // Bayern
  'bl1-2': 68, // Dortmund
  'bl1-3': 72, // Leverkusen
  'bl1-4': 66, // Leipzig
  'bl1-5': 58, // Frankfurt
  'bl1-6': 56, // Stuttgart
  'bl1-7': 54, // Freiburg
  'bl1-8': 48, // Hertha
  'bl1-9': 50, // Union
  'bl1-10': 46, // Wolfsburg
  'bl1-11': 44, // Mainz
  'bl1-12': 42, // Augsburg
  'bl1-13': 40, // Gladbach
  'bl1-14': 38, // Hoffenheim
  'bl1-15': 36, // Bremen
  'bl1-16': 34, // Bochum
  'bl1-17': 32, // Köln
  'bl1-18': 28, // Bielefeld
};

// Actual points (with some variance from xP)
const actualPoints: Record<string, number> = {
  'bl1-1': 75,
  'bl1-2': 65,
  'bl1-3': 70,
  'bl1-4': 64,
  'bl1-5': 55,
  'bl1-6': 58,
  'bl1-7': 52,
  'bl1-8': 45,
  'bl1-9': 48,
  'bl1-10': 44,
  'bl1-11': 42,
  'bl1-12': 40,
  'bl1-13': 38,
  'bl1-14': 35,
  'bl1-15': 33,
  'bl1-16': 31,
  'bl1-17': 29,
  'bl1-18': 25,
};

// Generate realistic mock data
export function generateSeasonData() {
  const data: Record<string, any> = {};
  
  // Sort teams by xP
  const sortedTeams = [...BUNDESLIGA_TEAMS].sort((a, b) => {
    const xP_a = xPRankings[a.id] || 50;
    const xP_b = xPRankings[b.id] || 50;
    return xP_b - xP_a;
  });

  sortedTeams.forEach((team, rankIndex) => {
    const xp = xPRankings[team.id] || 50;
    const actual = actualPoints[team.id] || xp;
    const distribution = Array(18).fill(0);
    
    // Position distribution (Gaussian around expected position)
    const expectedPos = rankIndex + 1;
    for (let pos = 0; pos < 18; pos++) {
      const distance = Math.abs(pos - expectedPos);
      let prob = Math.exp(-distance * distance / 8);
      prob *= (0.8 + Math.random() * 0.4);
      distribution[pos] = Math.max(100, Math.round(prob * 12000));
    }
    
    // Normalize distribution
    const total = distribution.reduce((a, b) => a + b, 0);
    distribution.forEach((_, i) => {
      distribution[i] = Math.round((distribution[i] / total) * 100000);
    });

    // Calculate probabilities
    const championProb = distribution[0] / 100000;
    const relegationProb = (distribution[15] + distribution[16] + distribution[17]) / 100000;
    
    // Generate form (random but realistic)
    const form = Array(5).fill(0).map(() => Math.floor(Math.random() * 4));

    // Calculate xG/xGA from rank
    const goalsFor = Math.floor(50 + (17 - rankIndex) * 2.5 + Math.random() * 10);
    const goalsAgainst = Math.floor(20 + rankIndex * 1.5 + Math.random() * 8);
    const xG = Math.floor(45 + (17 - rankIndex) * 2 + Math.random() * 8);
    const xGA = Math.floor(22 + rankIndex * 1.2 + Math.random() * 6);

    // Split home/away points
    const homePoints = Math.floor(xp * 0.55);
    const awayPoints = Math.floor(xp * 0.45);

    data[team.id] = {
      xp,
      // NEW field names for components
      championProb,
      relegationProb,
      positions: distribution.map((prob, pos) => ({
        position: pos + 1,
        probability: prob / 100000,
      })),
      // Existing fields
      distribution,
      actualPoints: actual,
      goalsFor,
      goalsAgainst,
      xG,
      xGA: xGA,
      form,
      homePoints,
      awayPoints,
    };
  });

  return data;
}

// Generate match data
export function generateMatchData() {
  const matches = [];
  
  for (let i = 0; i < 9; i++) {
    const home = BUNDESLIGA_TEAMS[i];
    const away = BUNDESLIGA_TEAMS[17 - i];
    
    // Simulate probabilities
    const homeWinProb = 0.3 + Math.random() * 0.4;
    const drawProb = 0.15 + Math.random() * 0.2;
    const awayWinProb = 1 - homeWinProb - drawProb;
    
    // Calculate odds (inverse of probability)
    const homeOdds = (1 / homeWinProb).toFixed(2);
    const drawOdds = (1 / drawProb).toFixed(2);
    const awayOdds = (1 / awayWinProb).toFixed(2);
    
    // Confidence = spread between most and second most likely
    const probs = [homeWinProb, drawProb, awayWinProb].sort((a, b) => b - a);
    const confidence = probs[0] - probs[1];

    matches.push({
      id: `match-${i + 1}`,
      utcDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      league: 'BL1',
      homeTeam: {
        id: home.id,
        name: home.name,
        shortName: home.short,
        logo: home.logo,
      },
      awayTeam: {
        id: away.id,
        name: away.name,
        shortName: away.short,
        logo: away.logo,
      },
      // Prediction results
      homeWinProb,
      drawProb,
      awayWinProb,
      homeOdds: parseFloat(homeOdds),
      drawOdds: parseFloat(drawOdds),
      awayOdds: parseFloat(awayOdds),
      confidence,
      // Form (last 5 games)
      homeForm: Array(5).fill(0).map(() => Math.floor(Math.random() * 4)),
      awayForm: Array(5).fill(0).map(() => Math.floor(Math.random() * 4)),
    });
  }

  return matches;
}

export const mockTeams = BUNDESLIGA_TEAMS.map(t => ({
  ...t,
  logo: t.logo,
}));