import { League, Match, Team } from '../types';
import { getMockMatches, getMockMatchById, LEAGUES as MOCK_LEAGUES } from './mockData';

// football-data.org API (primary)
const FD_BASE_URL = 'https://api.football-data.org/v4';
const FD_API_KEY = process.env.FOOTBALL_API_KEY;

// api-sports.io API (backup)
const AS_BASE_URL = 'https://v3.football.api-sports.io';
const AS_API_KEY = process.env.API_SPORTS_KEY;

// OpenLigaDB API (German football - no key needed)
const OLDB_BASE_URL = 'https://api.openligadb.de';

const SUPPORTED_LEAGUES: League[] = [
  { id: 'BL1', name: 'Bundesliga', country: 'Germany' },
  { id: 'PL', name: 'Premier League', country: 'England' },
  { id: 'PD', name: 'La Liga', country: 'Spain' },
  { id: 'CL', name: 'Champions League', country: 'Europe' },
];

// League mappings
const FD_LEAGUE_CODES: Record<string, string> = { BL1: 'BL1', PL: 'PL', PD: 'PD', CL: 'CL' };
const AS_LEAGUE_IDS: Record<string, number> = { BL1: 2002, PL: 39, PD: 140, CL: 2 };
const OLDB_LEAGUE_KEYS: Record<string, string> = { BL1: 'bl1' };

// Current season
const SEASON = 2024;

async function fdApiGet(endpoint: string): Promise<any> {
  if (!FD_API_KEY) throw new Error('FOOTBALL_API_KEY missing');
  const res = await fetch(`${FD_BASE_URL}${endpoint}`, { headers: { 'X-Auth-Token': FD_API_KEY } });
  if (!res.ok) throw new Error(`football-data.org ${res.status}`);
  return res.json();
}

async function asApiGet(endpoint: string): Promise<any> {
  if (!AS_API_KEY) throw new Error('API_SPORTS_KEY missing');
  const res = await fetch(`${AS_BASE_URL}${endpoint}`, { headers: { 'x-apisports-key': AS_API_KEY } });
  if (!res.ok) throw new Error(`api-sports.io ${res.status}`);
  return res.json();
}

async function oldbApiGet(endpoint: string): Promise<any> {
  const res = await fetch(`${OLDB_BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`openligadb ${res.status}`);
  return res.json();
}

async function getTeamStatsFromOpenligaDB(teamId: string): Promise<Pick<Team, 'avgGoalsScored' | 'avgGoalsConceded' | 'form'>> {
  try {
    const matches = await oldbApiGet(`/getmatchdata/${OLDB_LEAGUE_KEYS.BL1}/${SEASON}?teamId=${teamId}`);
    if (!matches || !matches.length) return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
    
    const last10 = matches.slice(-10);
    let gf = 0, ga = 0;
    const form = last10.slice(-5).map((m: any) => {
      const homeGoals = m.matchResults?.find((r: any) => r.resultTypeID === 2)?.pointsTeam1;
      const awayGoals = m.matchResults?.find((r: any) => r.resultTypeID === 2)?.pointsTeam2;
      if (homeGoals == null || awayGoals == null) return 'D';
      if (m.team1.teamId === teamId) {
        gf += homeGoals; ga += awayGoals;
        return homeGoals > awayGoals ? 'W' : homeGoals < awayGoals ? 'L' : 'D';
      } else {
        gf += awayGoals; ga += homeGoals;
        return awayGoals > homeGoals ? 'W' : awayGoals < homeGoals ? 'L' : 'D';
      }
    }).join('') || 'DDDDD';

    return {
      avgGoalsScored: Number((gf / last10.length || 1.4).toFixed(2)),
      avgGoalsConceded: Number((ga / last10.length || 1.4).toFixed(2)),
      form,
    };
  } catch {
    return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
  }
}

async function getMatchesFromOpenLigaDB(leagueId: string): Promise<Match[]> {
  try {
    const leagueKey = OLDB_LEAGUE_KEYS[leagueId];
    if (!leagueKey) return [];
    
    const data = await oldbApiGet(`/getmatchdata/${leagueKey}/${SEASON}`);
    if (!data || !data.length) return [];
    
    // Filter upcoming matches (no result yet)
    const upcoming = data.filter((m: any) => !m.matchResults?.find((r: any) => r.resultTypeID === 2));
    
    const mapped = await Promise.all(upcoming.slice(0, 10).map(async (m: any) => {
      const homeStats = await getTeamStatsFromOpenligaDB(m.team1.teamId);
      const awayStats = await getTeamStatsFromOpenligaDB(m.team2.teamId);
      
      return {
        id: `oldb-${m.matchID}`,
        leagueId: 'BL1',
        leagueName: 'Bundesliga',
        utcDate: m.matchDateTime,
        status: 'SCHEDULED',
        homeTeam: {
          id: String(m.team1.teamId),
          name: m.team1.teamName,
          shortName: m.team1.teamShortcut,
          ...homeStats,
        },
        awayTeam: {
          id: String(m.team2.teamId),
          name: m.team2.teamName,
          shortName: m.team2.teamShortcut,
          ...awayStats,
        },
      };
    }));
    
    return mapped.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
  } catch (e) {
    console.error('OpenLigaDB error:', e);
    return [];
  }
}

export function getSupportedLeagues(): League[] {
  return FD_API_KEY ? SUPPORTED_LEAGUES : MOCK_LEAGUES;
}

export async function getUpcomingMatches(league?: string): Promise<Match[]> {
  // Try OpenLigaDB first for Bundesliga (best German data)
  if (!league || league === 'BL1') {
    const oldbMatches = await getMatchesFromOpenLigaDB('BL1');
    if (oldbMatches.length > 0) return oldbMatches;
  }
  
  // Fallback to football-data.org or mock
  if (FD_API_KEY) {
    try {
      const targets = league ? [league] : SUPPORTED_LEAGUES.map(l => l.id);
      const today = new Date();
      const from = today.toISOString().split('T')[0];
      const toDate = new Date(today);
      toDate.setDate(toDate.getDate() + 7);
      const to = toDate.toISOString().split('T')[0];

      const buckets = await Promise.all(
        targets.map(code => fdApiGet(`/competitions/${code}/matches?dateFrom=${from}&dateTo=${to}&status=SCHEDULED`))
      );

      return buckets.flatMap(b => b.matches || [])
        .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
    } catch (e) {
      console.error('football-data.org error:', e);
    }
  }
  
  const matches = getMockMatches();
  return league ? matches.filter(m => m.leagueId === league) : matches;
}

export async function getPastMatches(league?: string): Promise<Match[]> {
  if (!FD_API_KEY) return [];
  // Similar implementation for past matches
  return [];
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  if (id.startsWith('mock-')) return getMockMatchById(id);
  if (id.startsWith('oldb-')) {
    // Could implement detailed match lookup
  }
  return getMockMatchById(id);
}