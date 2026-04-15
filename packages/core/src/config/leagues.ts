// packages/core/src/config/leagues.ts

export interface LeagueConfig {
  id: string;           // Internal ID: 'BL1', 'PL', 'PD', 'SA', 'CL'
  name: string;        // Display name: 'Bundesliga', 'Premier League'
  country: string;     // Country code: 'DE', 'EN', 'ES', 'IT', 'EU'
  flag?: string;       // Flag emoji
  apiSource: 'openligadb' | 'football-data' | 'api-sports';
  season?: string;     // e.g. '2025'
  enabled: boolean;
}

export const LEAGUES: LeagueConfig[] = [
  {
    id: 'BL1',
    name: 'Bundesliga',
    country: 'DE',
    flag: '🇩🇪',
    apiSource: 'openligadb',
    season: '2025',
    enabled: true,
  },
  {
    id: 'PL',
    name: 'Premier League',
    country: 'EN',
    flag: '🇬🇧',
    apiSource: 'football-data',
    season: '2025',
    enabled: true,
  },
  {
    id: 'PD',
    name: 'La Liga',
    country: 'ES',
    flag: '🇪🇸',
    apiSource: 'football-data',
    season: '2025',
    enabled: true,
  },
  {
    id: 'SA',
    name: 'Serie A',
    country: 'IT',
    flag: '🇮🇹',
    apiSource: 'football-data',
    season: '2025',
    enabled: true,
  },
  {
    id: 'CL',
    name: 'Champions League',
    country: 'EU',
    flag: '🏆',
    apiSource: 'football-data',
    season: '2025',
    enabled: true,
  },
];

export function getLeagueById(id: string): LeagueConfig | undefined {
  return LEAGUES.find(l => l.id === id);
}

export function getEnabledLeagues(): LeagueConfig[] {
  return LEAGUES.filter(l => l.enabled);
}
