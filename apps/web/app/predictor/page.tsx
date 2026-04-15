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
  { id: 'bl1-13', name: 'Borussia Mönchengladbach', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Borussia_M%C3%B6nchengladbach_logo.svg' },
  { id: 'bl1-14', name: 'TSG Hoffenheim', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/TSG_1899_Hoffenheim_Logo.svg' },
  { id: 'bl1-15', name: 'SV Werder Bremen', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/SV_Werder_Bremen_logo.svg' },
  { id: 'bl1-16', name: 'VfL Bochum', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VfL_Bochum_logo.svg' },
  { id: 'bl1-17', name: '1. FC Köln', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/1._FC_K%C3%B6ln_logo.svg' },
  { id: 'bl1-18', name: 'DSC Arminia Bielefeld', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Arminia_Bielefeld_logo.svg' },
];

// Realistic xP values based on typical Bundesliga performance
const xPRankings = {
  'bl1-1': 78,   // Bayern
  'bl1-2': 68,   // Dortmund  
  'bl1-3': 72,   // Leverkusen
  'bl1-4': 66,   // Leipzig
  'bl1-5': 58,   // Frankfurt
  'bl1-6': 56,   // Stuttgart
  'bl1-7': 54,   // Freiburg
  'bl1-8': 48,   // Hertha
  'bl1-9': 50,   // Union
  'bl1-10': 46,  // Wolfsburg
  'bl1-11': 44,  // Mainz
  'bl1-12': 42,  // Augsburg
  'bl1-13': 40,  // Gladbach
  'bl1-14': 38,  // Hoffenheim
  'bl1-15': 36,  // Bremen
  'bl1-16': 34,  // Bochum
  'bl1-17': 32,  // Köln
  'bl1-18': 28,  // Bielefeld
};

// Actual points (similar to xP but with some variance)
const actualPoints = {
  'bl1-1': 75,
  'bl1-2': 65,
  'bl1-3': 70,
  'bl1-4': 64,
  'bl1-5': 55,
  'bl1-6': 58,
  'bl1-7': 52,
  'bl1-8': 45,
  'bl1-9': 48,
  'bl1-10': 44,
  'bl1-11': 42,
  'bl1-12': 40,
  'bl1-13': 38,
  'bl1-14': 35,
  'bl1-15': 33,
  'bl1-16': 31,
  'bl1-17': 29,
  'bl1-18': 25,
};

// Generate realistic distribution based on xP
const generateRealisticData = () => {
  const data: Record<string, any> = {};
  
  // Sort teams by xP to determine probabilities
  const sortedTeams = Object.entries(xPRankings).sort((a, b) => b[1] - a[1]);
  
  sortedTeams.forEach(([teamId], rankIndex) => {
    const xp = xPRankings[teamId as keyof typeof xPRankings];
    
    // Champion probability based on xP rank (top team ~45%, decreases exponentially)
    const championProb = Math.round(45000 * Math.pow(0.75, rankIndex));
    
    // Relegation probability (bottom teams ~40%, decreases for mid-table)
    const relegationRank = 17 - rankIndex;
    const relegationProb = relegationRank > 0 
      ? Math.max(500, Math.round(40000 * Math.pow(0.8, relegationRank)))
      : Math.max(100, Math.round(5000 * Math.random()));
    
    // Position distribution - peaked around expected position
    const distribution = Array(18).fill(0);
    const expectedPos = rankIndex + 1;
    
    for (let pos = 0; pos < 18; pos++) {
      const distance = Math.abs(pos - expectedPos);
      // Gaussian-like distribution
      let prob = Math.exp(-distance * distance / 8);
      // Add randomness
      prob *= (0.8 + Math.random() * 0.4);
      distribution[pos] = Math.max(100, Math.round(prob * 12000));
    }
    
    // Normalize to 100000
    const total = distribution.reduce((a, b) => a + b, 0);
    distribution.forEach((_, i) => {
      distribution[i] = Math.round((distribution[i] / total) * 100000);
    });
    
    // Update champion/relegation to match actual distribution
    const actualChampion = distribution[0];
    const actualRelegation = distribution[15] + distribution[16] + distribution[17];
    
    data[teamId] = {
      xp,
      first: actualChampion,
      relegation: actualRelegation,
      distribution,
      actualPoints: actualPoints[teamId as keyof typeof actualPoints],
      // Additional metrics
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
    <div className="min-h-screen bg-neutral-900">
      <NavBar />
      <main className="container mx-auto px-4 py-6">
        <SeasonPredictorPage 
          teams={mockTeams}
          actualPoints={actualPoints}
          initialData={mockData}
        />
      </main>
    </div>
  );
}