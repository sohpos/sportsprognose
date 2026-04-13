import { Match, League, Team } from '../types';

export const LEAGUES: League[] = [
  { id: 'BL1', name: 'Bundesliga', country: 'Germany' },
  { id: 'PL', name: 'Premier League', country: 'England' },
  { id: 'PD', name: 'La Liga', country: 'Spain' },
  { id: 'CL', name: 'Champions League', country: 'Europe' },
];

const BUNDESLIGA_TEAMS: Team[] = [
  { id: 'bvb', name: 'Borussia Dortmund', shortName: 'BVB', avgGoalsScored: 1.9, avgGoalsConceded: 1.2, form: 'WWDLW' },
  { id: 'fcb', name: 'FC Bayern München', shortName: 'FCB', avgGoalsScored: 2.4, avgGoalsConceded: 0.9, form: 'WWWWW' },
  { id: 'rbl', name: 'RB Leipzig', shortName: 'RBL', avgGoalsScored: 1.8, avgGoalsConceded: 1.1, form: 'WDWLW' },
  { id: 'b04', name: 'Bayer Leverkusen', shortName: 'B04', avgGoalsScored: 2.1, avgGoalsConceded: 1.0, form: 'WWWDW' },
  { id: 'sgf', name: 'SC Freiburg', shortName: 'SGF', avgGoalsScored: 1.4, avgGoalsConceded: 1.3, form: 'DWLWL' },
  { id: 'vfb', name: 'VfB Stuttgart', shortName: 'VFB', avgGoalsScored: 1.7, avgGoalsConceded: 1.4, form: 'WLWDW' },
  { id: 'bsc', name: 'Hertha BSC', shortName: 'BSC', avgGoalsScored: 1.1, avgGoalsConceded: 1.7, form: 'LLDDL' },
  { id: 's04', name: 'Schalke 04', shortName: 'S04', avgGoalsScored: 1.0, avgGoalsConceded: 1.8, form: 'LLDLL' },
];

const PREMIER_LEAGUE_TEAMS: Team[] = [
  { id: 'mci', name: 'Manchester City', shortName: 'MCI', avgGoalsScored: 2.3, avgGoalsConceded: 0.8, form: 'WWWWW' },
  { id: 'ars', name: 'Arsenal', shortName: 'ARS', avgGoalsScored: 2.0, avgGoalsConceded: 0.9, form: 'WWDWW' },
  { id: 'liv', name: 'Liverpool', shortName: 'LIV', avgGoalsScored: 2.2, avgGoalsConceded: 1.0, form: 'WWWLW' },
  { id: 'che', name: 'Chelsea', shortName: 'CHE', avgGoalsScored: 1.6, avgGoalsConceded: 1.3, form: 'WDWLW' },
  { id: 'tot', name: 'Tottenham Hotspur', shortName: 'TOT', avgGoalsScored: 1.5, avgGoalsConceded: 1.4, form: 'LDWDL' },
  { id: 'mun', name: 'Manchester United', shortName: 'MUN', avgGoalsScored: 1.4, avgGoalsConceded: 1.5, form: 'DLWLL' },
  { id: 'new', name: 'Newcastle United', shortName: 'NEW', avgGoalsScored: 1.7, avgGoalsConceded: 1.1, form: 'WWWDL' },
  { id: 'avl', name: 'Aston Villa', shortName: 'AVL', avgGoalsScored: 1.6, avgGoalsConceded: 1.2, form: 'WDWWL' },
];

const LA_LIGA_TEAMS: Team[] = [
  { id: 'rma', name: 'Real Madrid', shortName: 'RMA', avgGoalsScored: 2.3, avgGoalsConceded: 0.8, form: 'WWWWW' },
  { id: 'fcb2', name: 'FC Barcelona', shortName: 'BAR', avgGoalsScored: 2.1, avgGoalsConceded: 1.0, form: 'WWWDW' },
  { id: 'atm', name: 'Atlético Madrid', shortName: 'ATM', avgGoalsScored: 1.6, avgGoalsConceded: 0.9, form: 'WDWWL' },
  { id: 'sev', name: 'Sevilla FC', shortName: 'SEV', avgGoalsScored: 1.3, avgGoalsConceded: 1.4, form: 'DLDDL' },
];

const CL_TEAMS: Team[] = [
  ...BUNDESLIGA_TEAMS.slice(0, 2),
  ...PREMIER_LEAGUE_TEAMS.slice(0, 2),
  ...LA_LIGA_TEAMS.slice(0, 2),
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', avgGoalsScored: 2.0, avgGoalsConceded: 1.0, form: 'WWWWL' },
  { id: 'int', name: 'Inter Milan', shortName: 'INT', avgGoalsScored: 1.8, avgGoalsConceded: 1.0, form: 'WWDWW' },
];

function randomDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(15 + Math.floor(Math.random() * 6), Math.random() > 0.5 ? 0 : 30, 0, 0);
  return date.toISOString();
}

function createMatch(id: string, leagueId: string, leagueName: string, home: Team, away: Team, daysFromNow: number): Match {
  return {
    id,
    leagueId,
    leagueName,
    homeTeam: home,
    awayTeam: away,
    utcDate: randomDate(daysFromNow),
    status: 'SCHEDULED',
  };
}

export function getMockMatches(): Match[] {
  const matches: Match[] = [];

  // Bundesliga matches
  matches.push(createMatch('mock-BL1-1', 'BL1', 'Bundesliga', BUNDESLIGA_TEAMS[0], BUNDESLIGA_TEAMS[1], 1));
  matches.push(createMatch('mock-BL1-2', 'BL1', 'Bundesliga', BUNDESLIGA_TEAMS[2], BUNDESLIGA_TEAMS[3], 2));
  matches.push(createMatch('mock-BL1-3', 'BL1', 'Bundesliga', BUNDESLIGA_TEAMS[4], BUNDESLIGA_TEAMS[5], 3));
  matches.push(createMatch('mock-BL1-4', 'BL1', 'Bundesliga', BUNDESLIGA_TEAMS[6], BUNDESLIGA_TEAMS[7], 4));
  matches.push(createMatch('mock-BL1-5', 'BL1', 'Bundesliga', BUNDESLIGA_TEAMS[1], BUNDESLIGA_TEAMS[3], 5));
  matches.push(createMatch('mock-BL1-6', 'BL1', 'Bundesliga', BUNDESLIGA_TEAMS[0], BUNDESLIGA_TEAMS[5], 6));

  // Premier League matches
  matches.push(createMatch('mock-PL-1', 'PL', 'Premier League', PREMIER_LEAGUE_TEAMS[0], PREMIER_LEAGUE_TEAMS[1], 1));
  matches.push(createMatch('mock-PL-2', 'PL', 'Premier League', PREMIER_LEAGUE_TEAMS[2], PREMIER_LEAGUE_TEAMS[3], 2));
  matches.push(createMatch('mock-PL-3', 'PL', 'Premier League', PREMIER_LEAGUE_TEAMS[4], PREMIER_LEAGUE_TEAMS[5], 3));
  matches.push(createMatch('mock-PL-4', 'PL', 'Premier League', PREMIER_LEAGUE_TEAMS[6], PREMIER_LEAGUE_TEAMS[7], 4));
  matches.push(createMatch('mock-PL-5', 'PL', 'Premier League', PREMIER_LEAGUE_TEAMS[1], PREMIER_LEAGUE_TEAMS[2], 5));

  // La Liga matches
  matches.push(createMatch('mock-PD-1', 'PD', 'La Liga', LA_LIGA_TEAMS[0], LA_LIGA_TEAMS[1], 2));
  matches.push(createMatch('mock-PD-2', 'PD', 'La Liga', LA_LIGA_TEAMS[2], LA_LIGA_TEAMS[3], 4));
  matches.push(createMatch('mock-PD-3', 'PD', 'La Liga', LA_LIGA_TEAMS[1], LA_LIGA_TEAMS[0], 6));

  // Champions League
  matches.push(createMatch('mock-CL-1', 'CL', 'Champions League', CL_TEAMS[0], CL_TEAMS[4], 3));
  matches.push(createMatch('mock-CL-2', 'CL', 'Champions League', CL_TEAMS[2], CL_TEAMS[6], 3));
  matches.push(createMatch('mock-CL-3', 'CL', 'Champions League', CL_TEAMS[1], CL_TEAMS[5], 4));

  return matches.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
}

export function getMockMatchById(id: string): Match | undefined {
  return getMockMatches().find(m => m.id === id);
}
