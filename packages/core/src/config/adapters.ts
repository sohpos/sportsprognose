// packages/core/src/config/adapters.ts

import type { Match, Team, League } from '../types';

export interface LeagueAdapter {
  /** Get all teams in the league */
  getTeams(leagueId: string): Promise<Team[]>;
  
  /** Get upcoming matches */
  getUpcomingMatches(leagueId: string): Promise<Match[]>;
  
  /** Get past matches */
  getPastMatches(leagueId: string): Promise<Match[]>;
  
  /** Get match by ID */
  getMatchById(matchId: string): Promise<Match | undefined>;
  
  /** Get team stats (form, avgGoals, etc.) */
  getTeamStats(teamId: string): Promise<{
    avgGoalsScored: number;
    avgGoalsConceded: number;
    form: string;
  }>;
  
  /** Get head-to-head matches between two teams */
  getHeadToHead(team1Id: string, team2Id: string): Promise<any[]>;
  
  /** Get league info */
  getLeagueInfo(leagueId: string): Promise<League | undefined>;
}

export type AdapterType = 'openligadb' | 'football-data' | 'api-sports' | 'custom';

export interface AdapterConfig {
  type: AdapterType;
  apiKey?: string;
  baseUrl?: string;
}
