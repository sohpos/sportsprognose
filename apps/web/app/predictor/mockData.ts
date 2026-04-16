// apps/web/app/predictor/mockData.ts
// Comprehensive mock data for Season Predictor

import { BUNDESLIGA_TEAMS } from '@/components/season-predictor/teams';

// Realistic Bundesliga expected points (xP)
const xPRankings: Record<string, number> = {
  'bl1-1': 78, 'bl1-2': 68, 'bl1-3': 72, 'bl1-4': 66,
  'bl1-5': 58, 'bl1-6': 56, 'bl1-7': 54, 'bl1-8': 48,
  'bl1-9': 50, 'bl1-10': 46, 'bl1-11': 44, 'bl1-12': 42,
  'bl1-13': 40, 'bl1-14': 38, 'bl1-15': 36, 'bl1-16': 34,
  'bl1-17': 32, 'bl1-18': 28,
};

// Actual points (with some variance from xP)
const actualPoints: Record<string, number> = {
  'bl1-1': 75, 'bl1-2': 65, 'bl1-3': 70, 'bl1-4': 64,
  'bl1-5': 55, 'bl1-6': 58, 'bl1-7': 52, 'bl1-8': 45,
  'bl1-9': 48, 'bl1-10': 44, 'bl1-11': 42, 'bl1-12': 40,
  'bl1-13': 38, 'bl1-14': 35, 'bl1-15': 33, 'bl1-16': 31,
  'bl1-17': 29, 'bl1-18': 25,
};

// Generate realistic mock data
export function generateSeasonData() {
  const data: Record<string, any> = {};

  const sortedTeams = [...BUNDESLIGA_TEAMS].sort((a, b) => {
    const xP_a = xPRankings[a.id] || 50;
    const xP_b = xPRankings[b.id] || 50;
    return xP_b - xP_a;
  });

  sortedTeams.forEach((team, rankIndex) => {
    const xp = xPRankings[team.id] || 50;
    const actual = actualPoints[team.id] || xp;
    const distribution = Array(18).fill(0);

    const expectedPos = rankIndex + 1;
    for (let pos = 0; pos < 18; pos++) {
      const distance = Math.abs(pos - expectedPos);
      let prob = Math.exp(-distance * distance / 8);
      prob *= 0.8 + Math.random() * 0.4;
      distribution[pos] = Math.max(100, Math.round(prob * 12000));
    }

    const total = distribution.reduce((a, b) => a + b, 0);
    distribution.forEach((_, i) => {
      distribution[i] = Math.round((distribution[i] / total) * 100000);
    });

    const championProb = distribution[0] / 100000;
    const relegationProb =
      (distribution[15] + distribution[16] + distribution[17]) / 100000;

    const form = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 4)
    );

    const goalsFor = Math.floor(
      50 + (17 - rankIndex) * 2.5 + Math.random() * 10
    );
    const goalsAgainst = Math.floor(
      20 + rankIndex * 1.5 + Math.random() * 8
    );
    const xG = Math.floor(45 + (17 - rankIndex) * 2 + Math.random() * 8);
    const xGA = Math.floor(22 + rankIndex * 1.2 + Math.random() * 6);

    const homePoints = Math.floor(xp * 0.55);
    const awayPoints = Math.floor(xp * 0.45);

    data[team.id] = {
      xp,
      championProb,
      relegationProb,
      positions: distribution.map((prob, pos) => ({
        position: pos + 1,
        probability: prob / 100000,
      })),
      distribution,
      actualPoints: actual,
      goalsFor,
      goalsAgainst,
      xG,
      xGA,
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

  const teamCount = BUNDESLIGA_TEAMS.length;
  const pairCount = Math.floor(teamCount / 2);

  for (let i = 0; i < pairCount; i++) {
    const home = BUNDESLIGA_TEAMS[i];
    const away = BUNDESLIGA_TEAMS[teamCount - 1 - i];

    if (!home || !away) continue;

    const homeWinProb = 0.3 + Math.random() * 0.4;
    const drawProb = 0.15 + Math.random() * 0.2;
    const awayWinProb = Math.max(0.01, 1 - homeWinProb - drawProb);

    const homeOdds = parseFloat((1 / homeWinProb).toFixed(2));
    const drawOdds = parseFloat((1 / drawProb).toFixed(2));
    const awayOdds = parseFloat((1 / awayWinProb).toFixed(2));

    const sorted = [homeWinProb, drawProb, awayWinProb].sort((a, b) => b - a);
    const confidence = sorted[0] - sorted[1];

    matches.push({
      id: `match-${i + 1}`,
      utcDate: new Date(Date.now() + i * 7 * 86400000).toISOString(),
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
      homeWinProb,
      drawProb,
      awayWinProb,
      homeOdds,
      drawOdds,
      awayOdds,
      confidence,
      homeForm: Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 4)
      ),
      awayForm: Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 4)
      ),
    });
  }

  return matches;
}

export const mockTeams = BUNDESLIGA_TEAMS.map((t) => ({
  ...t,
  logo: t.logo,
}));
