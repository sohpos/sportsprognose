// packages/core/src/types/unified.ts

/**
 * Unified Data Model - League Agnostic
 * All adapters return data in this format
 */

// Unified Match - normalized across all leagues
export interface UnifiedMatch {
  id: string;
  date: string;
  leagueId: string;
  leagueName: string;
  homeTeam: UnifiedTeam;
  awayTeam: UnifiedTeam;
  homeGoals: number;
  awayGoals: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED';
  venue?: string;
}

// Unified Team
export interface UnifiedTeam {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  country: string;
}

// Unified Team Stats
export interface UnifiedTeamStats {
  teamId: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
}

// Unified Standing/Table
export interface UnifiedStanding {
  position: number;
  team: UnifiedTeam;
  playedGames: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// Unified H2H Match
export interface UnifiedH2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  competition?: string;
}

// League Info
export interface UnifiedLeague {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag?: string;
  season: string;
  currentMatchday?: number;
  logo?: string;
}
