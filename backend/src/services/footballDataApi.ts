import { League, Match, Team } from '../types';
import { getMockMatches, getMockMatchById, LEAGUES as MOCK_LEAGUES } from './mockData';

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY;

const SUPPORTED_LEAGUES: League[] = [
  { id: 'BL1', name: 'Bundesliga', country: 'Germany' },
  { id: 'PL', name: 'Premier League', country: 'England' },
  { id: 'PD', name: 'La Liga', country: 'Spain' },
  { id: 'CL', name: 'Champions League', country: 'Europe' },
];

async function apiGet(path: string): Promise<any> {
  if (!API_KEY) throw new Error('FOOTBALL_API_KEY missing');

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'X-Auth-Token': API_KEY },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`football-data API ${res.status}: ${body.slice(0, 200)}`);
  }

  return res.json();
}

function resultChar(match: any, teamId: number): string {
  const home = match.score?.fullTime?.home;
  const away = match.score?.fullTime?.away;
  if (home == null || away == null) return 'D';

  const isHome = match.homeTeam?.id === teamId;
  const gf = isHome ? home : away;
  const ga = isHome ? away : home;
  if (gf > ga) return 'W';
  if (gf < ga) return 'L';
  return 'D';
}

async function getTeamStats(teamId: number): Promise<Pick<Team, 'avgGoalsScored' | 'avgGoalsConceded' | 'form'>> {
  try {
    const data = await apiGet(`/teams/${teamId}/matches?status=FINISHED&limit=10`);
    const matches = (data.matches || []).slice(-10);

    if (!matches.length) {
      return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
    }

    let gf = 0;
    let ga = 0;
    const form = matches.slice(-5).map((m: any) => resultChar(m, teamId)).join('') || 'DDDDD';

    for (const m of matches) {
      const home = m.score?.fullTime?.home;
      const away = m.score?.fullTime?.away;
      if (home == null || away == null) continue;
      const isHome = m.homeTeam?.id === teamId;
      gf += isHome ? home : away;
      ga += isHome ? away : home;
    }

    return {
      avgGoalsScored: Number((gf / matches.length || 1.4).toFixed(2)),
      avgGoalsConceded: Number((ga / matches.length || 1.4).toFixed(2)),
      form,
    };
  } catch {
    return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
  }
}

async function mapApiMatch(m: any): Promise<Match> {
  const [homeStats, awayStats] = await Promise.all([
    getTeamStats(m.homeTeam.id),
    getTeamStats(m.awayTeam.id),
  ]);

  return {
    id: `live-${m.id}`,
    leagueId: m.competition?.code || 'UNK',
    leagueName: m.competition?.name || 'Unknown League',
    utcDate: m.utcDate,
    status: m.status === 'TIMED' ? 'SCHEDULED' : m.status,
    homeTeam: {
      id: String(m.homeTeam.id),
      name: m.homeTeam.name,
      shortName: m.homeTeam.shortName || m.homeTeam.tla || m.homeTeam.name,
      ...homeStats,
    },
    awayTeam: {
      id: String(m.awayTeam.id),
      name: m.awayTeam.name,
      shortName: m.awayTeam.shortName || m.awayTeam.tla || m.awayTeam.name,
      ...awayStats,
    },
  };
}

export function getSupportedLeagues(): League[] {
  return API_KEY ? SUPPORTED_LEAGUES : MOCK_LEAGUES;
}

export async function getUpcomingMatches(league?: string): Promise<Match[]> {
  if (!API_KEY) {
    const matches = getMockMatches();
    return league ? matches.filter(m => m.leagueId === league) : matches;
  }

  try {
    const targets = league ? [league] : SUPPORTED_LEAGUES.map(l => l.id);
    const today = new Date();
    const from = today.toISOString().split('T')[0];
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 7);
    const to = toDate.toISOString().split('T')[0];

    const buckets = await Promise.all(
      targets.map(code => apiGet(`/competitions/${code}/matches?dateFrom=${from}&dateTo=${to}&status=SCHEDULED`))
    );

    const allMatches = buckets.flatMap(b => b.matches || []);
    const mapped = await Promise.all(allMatches.map(mapApiMatch));

    return mapped.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
  } catch {
    const matches = getMockMatches();
    return league ? matches.filter(m => m.leagueId === league) : matches;
  }
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  if (id.startsWith('mock-')) return getMockMatchById(id);

  if (id.startsWith('live-')) {
    const numericId = id.replace('live-', '');
    if (!API_KEY) return undefined;

    try {
      const m = await apiGet(`/matches/${numericId}`);
      return mapApiMatch(m.match || m);
    } catch {
      return undefined;
    }
  }

  // fallback
  return getMockMatchById(id);
}
