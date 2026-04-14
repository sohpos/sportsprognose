import { League, Match, Team } from '../types';
import { getMockMatches, getMockMatchById, LEAGUES as MOCK_LEAGUES } from './mockData';

// api-sports.io configuration
const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.FOOTBALL_API_KEY;

const SUPPORTED_LEAGUES: League[] = [
  { id: 'BL1', name: 'Bundesliga', country: 'Germany' },
  { id: 'PL', name: 'Premier League', country: 'England' },
  { id: 'PD', name: 'La Liga', country: 'Spain' },
  { id: 'CL', name: 'Champions League', country: 'Europe' },
];

// League ID mapping for api-sports.io
const LEAGUE_IDS: Record<string, number> = {
  BL1: 2002, // Bundesliga
  PL: 39,    // Premier League
  PD: 140,   // La Liga
  CL: 2,     // Champions League
};

// Season 2024/25 for historical data
const LEAGUE_SEASONS: Record<string, number> = {
  BL1: 2024,
  PL: 2024,
  PD: 2024,
  CL: 2024,
};

async function apiGet(endpoint: string): Promise<any> {
  if (!API_KEY) throw new Error('FOOTBALL_API_KEY missing');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'x-apisports-key': API_KEY },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`api-sports.io ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  if (data.errors?.length) {
    throw new Error(`api-sports.io error: ${data.errors.join(', ')}`);
  }
  return data;
}

function resultChar(fixture: any, teamId: number): string {
  const homeGoals = fixture.goals?.home;
  const awayGoals = fixture.goals?.away;
  if (homeGoals == null || awayGoals == null) return 'D';

  const isHome = fixture.teams?.home?.id === teamId;
  const gf = isHome ? homeGoals : awayGoals;
  const ga = isHome ? awayGoals : homeGoals;
  if (gf > ga) return 'W';
  if (gf < ga) return 'L';
  return 'D';
}

async function getTeamStats(teamId: number, leagueId: string): Promise<Pick<Team, 'avgGoalsScored' | 'avgGoalsConceded' | 'form'>> {
  try {
    const season = LEAGUE_SEASONS[leagueId] || 2024;
    const data = await apiGet(`/fixtures?team=${teamId}&season=${season}&status=FT&limit=15`);
    const fixtures = data.response || [];

    if (!fixtures.length) {
      return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
    }

    const last10 = fixtures.slice(-10);
    let gf = 0, ga = 0;

    const form = last10.map((f: any) => resultChar(f, teamId)).join('') || 'DDDDD';

    for (const f of last10) {
      const homeGoals = f.goals?.home;
      const awayGoals = f.goals?.away;
      if (homeGoals == null || awayGoals == null) continue;
      const isHome = f.teams?.home?.id === teamId;
      gf += isHome ? homeGoals : awayGoals;
      ga += isHome ? awayGoals : homeGoals;
    }

    return {
      avgGoalsScored: Number((gf / last10.length || 1.4).toFixed(2)),
      avgGoalsConceded: Number((ga / last10.length || 1.4).toFixed(2)),
      form,
    };
  } catch {
    return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
  }
}

async function mapApiMatch(fixture: any, isPast: boolean = false): Promise<Match> {
  const homeId = fixture.teams?.home?.id;
  const awayId = fixture.teams?.away?.id;
  
  const apiLeagueId = fixture.league?.id;
  const leagueCode = Object.entries(LEAGUE_IDS).find(([_, id]) => id === apiLeagueId)?.[0] || 'PL';

  const [homeStats, awayStats] = await Promise.all([
    homeId ? getTeamStats(homeId, leagueCode) : Promise.resolve({ avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' }),
    awayId ? getTeamStats(awayId, leagueCode) : Promise.resolve({ avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' }),
  ]);

  return {
    id: isPast ? `past-${fixture.fixture?.id}` : `live-${fixture.fixture?.id}`,
    leagueId: leagueCode,
    leagueName: fixture.league?.name || 'Unknown League',
    utcDate: fixture.fixture?.date,
    status: isPast ? 'FINISHED' : (fixture.fixture?.status?.short === 'NS' ? 'SCHEDULED' : fixture.fixture?.status?.short),
    homeTeam: {
      id: String(homeId),
      name: fixture.teams?.home?.name || 'Home Team',
      shortName: fixture.teams?.home?.name?.slice(0, 3).toUpperCase() || 'HOM',
      ...homeStats,
    },
    awayTeam: {
      id: String(awayId),
      name: fixture.teams?.away?.name || 'Away Team',
      shortName: fixture.teams?.away?.name?.slice(0, 3).toUpperCase() || 'AWY',
      ...awayStats,
    },
  };
}

export function getSupportedLeagues(): League[] {
  return API_KEY ? SUPPORTED_LEAGUES : MOCK_LEAGUES;
}

export async function getUpcomingMatches(league?: string): Promise<Match[]> {
  // Use mock data for future matches
  const matches = getMockMatches();
  return league ? matches.filter(m => m.leagueId === league) : matches;
}

export async function getPastMatches(league?: string): Promise<Match[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const targets = league ? [league] : SUPPORTED_LEAGUES.map(l => l.id);
    
    // Get matches from the 2024/25 season (August 2024 - May 2025)
    const from = '2024-08-01';
    const to = '2025-05-31';

    const buckets = await Promise.all(
      targets.map(code => {
        const leagueId = LEAGUE_IDS[code];
        const season = LEAGUE_SEASONS[code] || 2024;
        return apiGet(`/fixtures?league=${leagueId}&season=${season}&from=${from}&to=${to}&status=FT`);
      })
    );

    const allFixtures = buckets.flatMap(b => b.response || []);
    const mapped = await Promise.all(allFixtures.map(f => mapApiMatch(f, true)));

    // Sort by date (newest first) and take last 50
    return mapped
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 50);
  } catch (e) {
    console.error('API error fetching past matches:', e);
    return [];
  }
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  if (id.startsWith('mock-')) return getMockMatchById(id);
  if (id.startsWith('past-') || id.startsWith('live-')) {
    const numericId = id.replace(/^(past|live)-/, '');
    if (!API_KEY) return undefined;

    try {
      const data = await apiGet(`/fixtures?id=${numericId}`);
      const fixture = data.response?.[0];
      if (fixture) return mapApiMatch(fixture, id.startsWith('past-'));
    } catch {
      return undefined;
    }
  }

  return getMockMatchById(id);
}