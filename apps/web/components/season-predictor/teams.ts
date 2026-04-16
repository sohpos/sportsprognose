// Bundesliga Teams (clean, corrected, future-proof)

export const BUNDESLIGA_TEAMS = [
  { id: 'bl1-1',  name: 'Bayern München',       short: 'FCB',  slug: 'bayern-muenchen',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },

  { id: 'bl1-2',  name: 'Borussia Dortmund',    short: 'BVB',  slug: 'borussia-dortmund',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Borussia_Dortmund_logo.svg' },

  { id: 'bl1-3',  name: 'Bayer Leverkusen',     short: 'B04',  slug: 'bayer-leverkusen',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Bayer_04_Leverkusen_logo.svg' },

  { id: 'bl1-4',  name: 'RB Leipzig',           short: 'RBL',  slug: 'rb-leipzig',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/RB_Leipzig_2014.svg' },

  { id: 'bl1-5',  name: 'Eintracht Frankfurt',  short: 'SGE',  slug: 'eintracht-frankfurt',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg' },

  { id: 'bl1-6',  name: 'VfB Stuttgart',        short: 'VFB',  slug: 'vfb-stuttgart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/VfB_Stuttgart_1893_Logo.svg' },

  { id: 'bl1-7',  name: 'SC Freiburg',          short: 'SCF',  slug: 'sc-freiburg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Logo_SC_Freiburg.svg' },

  { id: 'bl1-8',  name: 'Union Berlin',         short: 'FCU',  slug: 'union-berlin',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/1._FC_Union_Berlin_Logo.svg' },

  { id: 'bl1-9',  name: 'VfL Wolfsburg',        short: 'WOB',  slug: 'vfl-wolfsburg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/VfL_Wolfsburg_logo.svg' },

  { id: 'bl1-10', name: 'Mainz 05',             short: 'M05',  slug: 'mainz-05',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_1._FSV_Mainz_05.svg' },

  { id: 'bl1-11', name: 'FC Augsburg',          short: 'FCA',  slug: 'fc-augsburg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/FC_Augsburg_logo.svg' },

  { id: 'bl1-12', name: 'Borussia Mönchengladbach', short: 'BMG', slug: 'borussia-moenchengladbach',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Borussia_M%C3%B6nchengladbach_logo.svg' },

  { id: 'bl1-13', name: 'TSG Hoffenheim',       short: 'TSG',  slug: 'tsg-hoffenheim',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/TSG_1899_Hoffenheim_Logo.svg' },

  { id: 'bl1-14', name: 'Werder Bremen',        short: 'WER',  slug: 'werder-bremen',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/SV_Werder_Bremen_logo.svg' },

  { id: 'bl1-15', name: 'VfL Bochum',           short: 'BOC',  slug: 'vfl-bochum',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VfL_Bochum_logo.svg' },

  { id: 'bl1-16', name: '1. FC Köln',           short: 'KOEL', slug: '1-fc-koeln',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/1._FC_K%C3%B6ln_logo.svg' },

  { id: 'bl1-17', name: 'Arminia Bielefeld',    short: 'DSC',  slug: 'arminia-bielefeld',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Arminia_Bielefeld_logo.svg' },
] as const;

export type TeamId = typeof BUNDESLIGA_TEAMS[number]['id'];

export function getTeamById(id: TeamId) {
  return BUNDESLIGA_TEAMS.find(t => t.id === id);
}

export function getTeamLogo(id: TeamId): string {
  return getTeamById(id)?.logo ?? '/placeholder-team.svg';
}
