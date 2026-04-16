// Bundesliga Teams with Logos
// Data source: OpenLigaDB + Wikipedia

export const BUNDESLIGA_TEAMS = [
  { id: 'bl1-1', name: 'Bayern München', short: 'FCB', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
  { id: 'bl1-2', name: 'Borussia Dortmund', short: 'BVB', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Borussia_Dortmund_logo.svg' },
  { id: 'bl1-3', name: 'Bayer Leverkusen', short: 'B04', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Bayer_04_Leverkusen_logo.svg' },
  { id: 'bl1-4', name: 'RB Leipzig', short: 'RBL', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/RB_Leipzig_2014.svg' },
  { id: 'bl1-5', name: 'Eintracht Frankfurt', short: 'SGE', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg' },
  { id: 'bl1-6', name: 'VfB Stuttgart', short: 'VFB', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/VfB_Stuttgart_1893_Logo.svg' },
  { id: 'bl1-7', name: 'SC Freiburg', short: 'SCF', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Logo_SC_Freiburg.svg' },
  { id: 'bl1-8', name: 'Hertha BSC', short: 'HBSC', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Hertha_BSC_Logo.svg' },
  { id: 'bl1-9', name: 'Union Berlin', short: 'FCU', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/1._FC_Union_Berlin_Logo.svg' },
  { id: 'bl1-10', name: 'VfL Wolfsburg', short: 'WOB', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/VfL_Wolfsburg_logo.svg' },
  { id: 'bl1-11', name: 'Mainz 05', short: 'M05', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_1._FSV_Mainz_05.svg' },
  { id: 'bl1-12', name: 'FC Augsburg', short: 'FCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/FC_Augsburg_logo.svg' },
  { id: 'bl1-13', name: 'Mönchengladbach', short: 'BMG', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Borussia_M%C3%B6nchengladbach_logo.svg' },
  { id: 'bl1-14', name: 'TSG Hoffenheim', short: 'TSG', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/TSG_1899_Hoffenheim_Logo.svg' },
  { id: 'bl1-15', name: 'Werder Bremen', short: 'WER', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/SV_Werder_Bremen_logo.svg' },
  { id: 'bl1-16', name: 'VfL Bochum', short: 'BOC', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VfL_Bochum_logo.svg' },
  { id: 'bl1-17', name: '1. FC Köln', short: 'KÖL', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/1._FC_K%C3%B6ln_logo.svg' },
  { id: 'bl1-18', name: 'Arminia Bielefeld', short: 'DAC', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Arminia_Bielefeld_logo.svg' },
] as const;

export type TeamId = typeof BUNDESLIGA_TEAMS[number]['id'];

export function getTeamById(id: string) {
  return BUNDESLIGA_TEAMS.find(t => t.id === id);
}

export function getTeamLogo(id: string): string | undefined {
  return getTeamById(id)?.logo;
}
