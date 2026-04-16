import type { Metadata } from 'next';
import '../globals.css';
import NavBar from '@/components/NavBar';
import { SeasonPredictorPage } from '@/components/season-predictor';

const mockTeams = [
  { id: 'bl1-1', name: 'Bayern München', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
  { id: 'bl1-2', name: 'Borussia Dortmund', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Borussia_Dortmund_logo.svg' },
  { id: 'bl1-3', name: 'Bayer Leverkusen', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Bayer_04_Leverkusen_logo.svg' },
  { id: 'bl1-4', name: 'RB Leipzig', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/RB_Leipzig_2014.svg' },
  { id: 'bl1-5', name: 'Eintracht Frankfurt', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg' },
  { id: 'bl1-6', name: 'VfB Stuttgart', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/VfB_Stuttgart_1893_Logo.svg' },
  { id: 'bl1-7', name: 'SC Freiburg', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Logo_SC_Freiburg.svg' },
  { id: 'bl1-8', name: 'Hertha BSC', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Hertha_BSC_Logo.svg' },
  { id: 'bl1-9', name: 'Union Berlin', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/1._FC_Union_Berlin_Logo.svg' },
  { id: 'bl1-10', name: 'VfL Wolfsburg', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/VfL_Wolfsburg_logo.svg' },
  { id: 'bl1-11', name: 'Mainz 05', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_1._FSV_Mainz_05.svg' },
  { id: 'bl1-12', name: 'FC Augsburg', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/FC_Augsburg_logo.svg' },
  { id: 'bl1-13', name: 'Mönchengladbach', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Borussia_M%C3%B6nchengladbach_logo.svg' },
  { id: 'bl1-14', name: 'TSG Hoffenheim', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/TSG_1899_Hoffenheim_Logo.svg' },
  { id: 'bl1-15', name: 'Werder Bremen', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/SV_Werder_Bremen_logo.svg' },
  { id: 'bl1-16', name: 'VfL Bochum', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VfL_Bochum_logo.svg' },
  { id: 'bl1-17', name: '1. FC Köln', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/1._FC_K%C3%B6ln_logo.svg' },
  { id: 'bl1-18', name: 'Arminia Bielefeld', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Arminia_Bielefeld_logo.svg' },
];

const xPRankings = {
  'bl1-1': 78, 'bl1-2': 68, 'bl1-3': 72, 'bl1-4': 66, 'bl1-5': 58,
  'bl1-6': 56, 'bl1-7': 54, 'bl1-8': 48, 'bl1-9': 50, 'bl1-10': 46,
  'bl1-11': 44, 'bl1-12': 42, 'bl1-13': 40, 'bl1-14': 38, 'bl1-15': 36,
  'bl1-16': 34, 'bl1-17': 32, 'bl1-18': 28,
};

const actualPoints = {
  'bl1-1': 75, 'bl1-2': 65, 'bl1-3': 70, 'bl1-4': 64, 'bl1-5': 55,
  'bl1-6': 58, 'bl1-7': 52, 'bl1-8': 45, 'bl1-9': 48, 'bl1-10': 44,
  'bl1-11': 42, 'bl1-12': 40, 'bl1-13': 38, 'bl1-14': 35, 'bl1-15': 33,
  'bl1-16': 31, 'bl1-17': 29, 'bl1-18': 25,
};

const generateRealisticData = () => {
  const data: Record<string, any> = {};
  const sortedTeams = Object.entries(xPRankings).sort((a, b) => b[1] - a[1]);
  
  sortedTeams.forEach(([teamId], rankIndex) => {
    const xp = xPRankings[teamId as keyof typeof xPRankings];
    const distribution = Array(18).fill(0);
    const expectedPos = rankIndex + 1;
    
    for (let pos = 0; pos < 18; pos++) {
      const distance = Math.abs(pos - expectedPos);
      let prob = Math.exp(-distance * distance / 8);
      prob *= (0.8 + Math.random() * 0.4);
      distribution[pos] = Math.max(100, Math.round(prob * 12000));
    }
    
    const total = distribution.reduce((a, b) => a + b, 0);
    distribution.forEach((_, i) => {
      distribution[i] = Math.round((distribution[i] / total) * 100000);
    });
    
    data[teamId] = {
      xp,
      first: distribution[0],
      relegation: distribution[15] + distribution[16] + distribution[17],
      distribution,
      actualPoints: actualPoints[teamId as keyof typeof actualPoints],
      goalsFor: 50 + Math.floor((18 - rankIndex) * 2.5) + Math.floor(Math.random() * 10),
      goalsAgainst: 20 + Math.floor(rankIndex * 1.5) + Math.floor(Math.random() * 8),
      xG: 45 + Math.floor((18 - rankIndex) * 2) + Math.floor(Math.random() * 8),
      xGA: 22 + Math.floor(rankIndex * 1.2) + Math.floor(Math.random() * 6),
      form: [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)],
      homePoints: Math.floor(xp * 0.55),
      awayPoints: Math.floor(xp * 0.45),
    };
  });
  
  return data;
};

export const metadata: Metadata = {
  title: 'SportsPrognose – Season Predictor',
  description: 'Monte Carlo Simulation für die Bundesliga',
};

export default function SeasonPredictorDashboard() {
  const mockData = generateRealisticData();
  
  return (
    <div className="min-h-screen bg-neutral-950">
      <NavBar />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Season Predictor</h1>
          <p className="text-neutral-400">Monte Carlo Simulation · 100.000 Iterationen · Bundesliga 2024/25</p>
        </div>
        
        <SeasonPredictorPage 
          teams={mockTeams}
          actualPoints={actualPoints}
          initialData={mockData}
        />
      </main>
    </div>
  );
}