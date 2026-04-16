import type { Metadata } from 'next';
import { SeasonPredictorPage } from '@/components/season-predictor';
import { generateSeasonData, generateMatchData } from './mockData';
import { BUNDESLIGA_TEAMS } from '@/components/season-predictor/teams';

// Transform teams to correct format for component
const mockTeams = BUNDESLIGA_TEAMS.map(t => ({
  id: t.id,
  name: t.name,
  shortName: t.short,
  logo: t.logo,
}));

export const metadata: Metadata = {
  title: 'SportsPrognose – Season Predictor',
  description: 'Monte Carlo Simulation für die Bundesliga',
};

export default function SeasonPredictorDashboard() {
  // Generate deterministic mock data (runs server-side)
  const seasonData = generateSeasonData();
  const mockMatches = generateMatchData();
  
  return (
    <div className="min-h-screen bg-neutral-950">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <SeasonPredictorPage 
          fixtures={mockMatches}
          teams={mockTeams}
          actualPoints={seasonData}
        />
      </main>
    </div>
  );
}