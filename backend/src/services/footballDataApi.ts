import { League, Match, Team } from '../types';
import { getMockMatches, getMockMatchById, LEAGUES as MOCK_LEAGUES } from './mockData';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

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

// Current season - use 2025 for upcoming matches
const SEASON_PAST = 2024;
const SEASON_FUTURE = 2025;

async function fdApiGet(endpoint: string): Promise<any> {
  const cacheKey = `fd:${endpoint}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  if (!FD_API_KEY) throw new Error('FOOTBALL_API_KEY missing');
  const res = await fetch(`${FD_BASE_URL}${endpoint}`, { headers: { 'X-Auth-Token': FD_API_KEY } });
  if (!res.ok) throw new Error(`football-data.org ${res.status}`);
  
  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

async function asApiGet(endpoint: string): Promise<any> {
  if (!AS_API_KEY) throw new Error('API_SPORTS_KEY missing');
  const res = await fetch(`${AS_BASE_URL}${endpoint}`, { headers: { 'x-apisports-key': AS_API_KEY } });
  if (!res.ok) throw new Error(`api-sports.io ${res.status}`);
  return res.json();
}

async function oldbApiGet(endpoint: string): Promise<any> {
  const cacheKey = `oldb:${endpoint}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  const res = await fetch(`${OLDB_BASE_URL}${endpoint}`);
  if (!res.ok) {
    // If rate limited, try to use cache or return empty
    if (res.status === 429) {
      const cachedData = getCached(`oldb:fallback:${endpoint}`);
      if (cachedData) return cachedData;
      throw new Error('openligadb 429');
    }
    throw new Error(`openligadb ${res.status}`);
  }
  
  const data = await res.json();
  setCache(cacheKey, data);
  setCache(`oldb:fallback:${endpoint}`, data); // Store as fallback
  return data;
}

async function getTeamStatsFromOpenligaDB(teamId: string): Promise<Pick<Team, 'avgGoalsScored' | 'avgGoalsConceded' | 'form'>> {
  try {
    const data = await oldbApiGet(`/getmatchdata/bl1/${SEASON_PAST}?teamId=${teamId}`);
    if (!data || !data.length) return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
    
    const last10 = data.slice(-10);
    let gf = 0, ga = 0;
    const formArr: string[] = [];
    
    for (const m of last10) {
      const result = m.matchResults?.find((r: any) => r.resultTypeID === 2);
      if (!result) continue;
      
      const isHome = m.team1.teamId === Number(teamId);
      const homeGoals = result.pointsTeam1;
      const awayGoals = result.pointsTeam2;
      
      if (isHome) {
        gf += homeGoals;
        ga += awayGoals;
      } else {
        gf += awayGoals;
        ga += homeGoals;
      }
      
      // Form: last 5 games
      if (formArr.length < 5) {
        if (homeGoals > awayGoals) formArr.push(isHome ? 'W' : 'L');
        else if (homeGoals < awayGoals) formArr.push(isHome ? 'L' : 'W');
        else formArr.push('D');
      }
    }
    
    if (last10.length === 0) return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
    
    return {
      avgGoalsScored: Number((gf / last10.length || 1.4).toFixed(2)),
      avgGoalsConceded: Number((ga / last10.length || 1.4).toFixed(2)),
      form: formArr.join('') || 'DDDDD',
    };
  } catch {
    return { avgGoalsScored: 1.4, avgGoalsConceded: 1.4, form: 'DDDDD' };
  }
}

async function getMatchesFromOpenLigaDB(leagueId: string): Promise<Match[]> {
  try {
    const leagueKey = OLDB_LEAGUE_KEYS[leagueId];
    if (!leagueKey) return [];
    
    const data = await oldbApiGet(`/getmatchdata/${leagueKey}/${SEASON_FUTURE}`);
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
    // For OpenLigaDB matches, we need to fetch from the full list or use fallback
    const numericId = id.replace('oldb-', '');
    try {
      const data = await oldbApiGet(`/getmatchdata/bl1/${SEASON_FUTURE}`);
      const match = data?.find((m: any) => String(m.matchID) === numericId);
      if (match) {
        const homeStats = await getTeamStatsFromOpenligaDB(match.team1.teamId);
        const awayStats = await getTeamStatsFromOpenligaDB(match.team2.teamId);
        return {
          id: `oldb-${match.matchID}`,
          leagueId: 'BL1',
          leagueName: 'Bundesliga',
          utcDate: match.matchDateTime,
          status: 'SCHEDULED',
          homeTeam: {
            id: String(match.team1.teamId),
            name: match.team1.teamName,
            shortName: match.team1.teamShortcut,
            ...homeStats,
          },
          awayTeam: {
            id: String(match.team2.teamId),
            name: match.team2.teamName,
            shortName: match.team2.teamShortcut,
            ...awayStats,
          },
        };
      }
    } catch {}
  }
  if (id.startsWith('past-') || id.startsWith('live-')) {
    const numericId = id.replace(/^(past|live)-/, '');
    if (!FD_API_KEY) return undefined;
    try {
      const data = await fdApiGet(`/matches/${numericId}`);
      if (data.match) return mapApiMatch(data.match, id.startsWith('past-'));
    } catch {}
  }
  return getMockMatchById(id);
}