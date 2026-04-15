import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import { SeasonPredictorPage } from '@/components/season-predictor';

// Mock data for demonstration - in production this would come from API
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
  { id: 'bl1-13', name: 'Borussia Mönchengladbach', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Borussia_M%C3%B6nchengladbach_logo.svg' },
  { id: 'bl1-14', name: 'TSG Hoffenheim', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/TSG_1899_Hoffenheim_Logo.svg' },
  { id: 'bl1-15', name: 'SV Werder Bremen', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/SV_Werder_Bremen_logo.svg' },
  { id: 'bl1-16', name: 'VfL Bochum', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VfL_Bochum_logo.svg' },
  { id: 'bl1-17', name: '1. FC Köln', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/1._FC_K%C3%B6ln_logo.svg' },
  { id: 'bl1-18', name: 'DSC Arminia Bielefeld', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Arminia_Bielefeld_logo.svg' },
];

const mockFixtures = mockTeams.slice(0, 17).map((_, i) => ({
  homeId: mockTeams[i].id,
  awayId: mockTeams[i + 1]?.id || mockTeams[0].id,
}));

// Mock actual points (current Bundesliga standings simulation)
const mockActualPoints: Record<string, number> = {
  'bl1-1': 72,
  'bl1-2': 63,
  'bl1-3': 68,
  'bl1-4': 58,
  'bl1-5': 55,
  'bl1-6': 52,
  'bl1-7': 50,
  'bl1-8': 45,
  'bl1-9': 44,
  'bl1-10': 43,
  'bl1-11': 42,
  'bl1-12': 40,
  'bl1-13': 38,
  'bl1-14': 36,
  'bl1-15': 34,
  'bl1-16': 32,
  'bl1-17': 30,
  'bl1-18': 28,
};

// Generate mock prediction data
const generateMockData = () => {
  const data: Record<string, any> = {};
  
  mockTeams.forEach((team, index) => {
    const baseXP = 60 + (Math.random() * 30 - 15); // Random base between 45-75
    const championProb = Math.max(500, 50000 - index * 2500 + Math.random() * 3000);
    const relegationProb = Math.max(200, index * 1000 - 15000 + Math.random() * 2000);
    
    // Generate position distribution (18 teams, 100000 total)
    const distribution = Array(18).fill(0);
    const peakPosition = Math.max(0, Math.min(17, index + Math.floor(Math.random() * 3) - 1));
    for (let i = 0; i < 18; i++) {
      const distance = Math.abs(i - peakPosition);
      distribution[i] = Math.max(500, Math.round(8000 / (distance + 1) + Math.random() * 2000));
    }
    // Normalize to 100000
    const total = distribution.reduce((a, b) => a + b, 0);
    distribution.forEach((_, i) => {
      distribution[i] = Math.round((distribution[i] / total) * 100000);
    });
    
    data[team.id] = {
      xp: Math.round(baseXP * 10) / 10,
      first: distribution[0],
      relegation: distribution[15] + distribution[16] + distribution[17],
      distribution,
      actualPoints: mockActualPoints[team.id],
      goalsFor: 65 + Math.floor(Math.random() * 20),
      goalsAgainst: 35 + Math.floor(Math.random() * 20),
      xG: 60 + Math.floor(Math.random() * 15),
      xGA: 32 + Math.floor(Math.random() * 15),
      form: [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)],
      homePoints: Math.floor((mockActualPoints[team.id] || 40) * 0.6),
      awayPoints: Math.floor((mockActualPoints[team.id] || 40) * 0.4),
    };
  });
  
  return data;
};

export const metadata: Metadata = {
  title: 'SportsPrognose – Season Predictor',
  description: 'Monte Carlo Simulation für die Bundesliga',
};

export default function SeasonPredictorDashboard() {
  const mockData = generateMockData();
  
  return (
    <div className="min-h-screen bg-neutral-900">
      <NavBar />
      <main className="container mx-auto px-4 py-6">
        <SeasonPredictorPage 
          fixtures={mockFixtures} 
          teams={mockTeams}
          actualPoints={mockActualPoints}
        />
      </main>
    </div>
  );
}