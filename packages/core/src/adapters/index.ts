// packages/core/src/adapters/index.ts

import type { 
  UnifiedMatch, 
  UnifiedTeam, 
  UnifiedTeamStats, 
  UnifiedStanding, 
  UnifiedH2HMatch,
  UnifiedLeague 
} from '../types/unified';

/**
 * Base interface for all league adapters
 */
export interface LeagueAdapter {
  /** Get league info */
  getLeagueInfo(): Promise<UnifiedLeague | undefined>;
  
  /** Get all teams in the league */
  getTeams(): Promise<UnifiedTeam[]>;
  
  /** Get upcoming matches */
  getUpcomingMatches(limit?: number): Promise<UnifiedMatch[]>;
  
  /** Get past matches */
  getPastMatches(limit?: number): Promise<UnifiedMatch[]>;
  
  /** Get match by ID */
  getMatchById(matchId: string): Promise<UnifiedMatch | undefined>;
  
  /** Get team stats */
  getTeamStats(teamId: string): Promise<UnifiedTeamStats>;
  
  /** Get head-to-head matches between two teams */
  getHeadToHead(team1Id: string, team2Id: string): Promise<UnifiedH2HMatch[]>;
  
  /** Get league standings/table */
  getStandings(): Promise<UnifiedStanding[]>;
}

/**
 * Factory to get the right adapter for a league
 */
export function getAdapter(leagueId: string): LeagueAdapter {
  // Import adapters dynamically to avoid circular deps
  switch (leagueId) {
    case 'BL1':
      return new OpenLigaDBAdapter();
    case 'PL':
    case 'PD':
    case 'SA':
    case 'CL':
      return new FootballDataAdapter();
    default:
      return new OpenLigaDBAdapter(); // Default to Bundesliga
  }
}

// OpenLigaDB Adapter for Bundesliga
class OpenLigaDBAdapter implements LeagueAdapter {
  private baseUrl = 'https://api.openligadb.de';
  private season = '2024';

  async getLeagueInfo(): Promise<UnifiedLeague | undefined> {
    return {
      id: 'BL1',
      name: 'Bundesliga',
      country: 'Germany',
      countryCode: 'DE',
      flag: '🇩🇪',
      season: this.season,
    };
  }

  async getTeams(): Promise<UnifiedTeam[]> {
    // Would fetch from OpenLigaDB
    return [];
  }

  async getUpcomingMatches(_limit?: number): Promise<UnifiedMatch[]> {
    return [];
  }

  async getPastMatches(_limit?: number): Promise<UnifiedMatch[]> {
    return [];
  }

  async getMatchById(_matchId: string): Promise<UnifiedMatch | undefined> {
    return undefined;
  }

  async getTeamStats(_teamId: string): Promise<UnifiedTeamStats> {
    return {
      teamId: _teamId,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      avgGoalsFor: 0,
      avgGoalsAgainst: 0,
    };
  }

  async getHeadToHead(_team1Id: string, _team2Id: string): Promise<UnifiedH2HMatch[]> {
    return [];
  }

  async getStandings(): Promise<UnifiedStanding[]> {
    return [];
  }
}

// Football-Data.org Adapter for PL, PD, SA, CL
class FootballDataAdapter implements LeagueAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.football-data.org/v4';

  constructor() {
    this.apiKey = process.env.FOOTBALL_API_KEY || '';
  }

  async getLeagueInfo(): Promise<UnifiedLeague | undefined> {
    return undefined;
  }

  async getTeams(): Promise<UnifiedTeam[]> {
    return [];
  }

  async getUpcomingMatches(_limit?: number): Promise<UnifiedMatch[]> {
    return [];
  }

  async getPastMatches(_limit?: number): Promise<UnifiedMatch[]> {
    return [];
  }

  async getMatchById(_matchId: string): Promise<UnifiedMatch | undefined> {
    return undefined;
  }

  async getTeamStats(_teamId: string): Promise<UnifiedTeamStats> {
    return {
      teamId: _teamId,
      gamesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      avgGoalsFor: 0,
      avgGoalsAgainst: 0,
    };
  }

  async getHeadToHead(_team1Id: string, _team2Id: string): Promise<UnifiedH2HMatch[]> {
    return [];
  }

  async getStandings(): Promise<UnifiedStanding[]> {
    return [];
  }
}

// Re-export for external use
export { OpenLigaDBAdapter, FootballDataAdapter };
