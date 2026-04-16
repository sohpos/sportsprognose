import type { Metadata } from 'next';
import { SeasonPredictorPage } from '@/components/season-predictor';
import { generateSeasonData, generateMatchData } from './mockData';
import { BUNDESLIGA_TEAMS } from '@/components/season-predictor/teams';

// Transform teams to correct format for component
const mockTeams = BUNDESLIGA_TEAMS.map((t) => ({
  id: t.id,
  name: t.name,
  shortName: t.short,
  logo: t.logo,
}));

export const metadata: Metadata = {
  title: 'SportsPrognose – Season Predictor',
  description: 'Monte Carlo Simulation für die Bundesliga',
};

// Force dynamic rendering (important for mock data)
export const dynamic = 'force-dynamic';

export default function SeasonPredictorDashboard() {
  // Generate deterministic mock data (runs server-side)
  const seasonData = generateSeasonData();
  const mockMatches = generateMatchData();

  // Transform actualPoints to initialData format
  const initialData: Record<string, any> = {};

  mockTeams.forEach((team, index) => {
    const points = seasonData[team.id] ?? 50 + index * 3;
    const basePos = Math.min(18, Math.max(1, index + 1));

    // Create distribution based on expected position
    const distribution = Array(18).fill(0);

    for (let pos = 0; pos < 18; pos++) {
      const distance = Math.abs(pos - (basePos - 1));
      distribution[pos] = Math.exp(-(distance * distance) / 8);
    }

    const total = distribution.reduce((a, b) => a + b, 0);
    for (let i = 0; i < distribution.length; i++) {
      distribution[i] = distribution[i] / total;
    }

    initialData[team.id] = {
      xp: points,
      championProb: distribution[0] * 1000,
      relegationProb:
        (distribution[15] + distribution[16] + distribution[17]) * 1000,
      distribution: distribution.map((d) => Math.round(d * 100000)),
      actualPoints: points,
    };
  });

  return (
    <div className="min-h-screen bg-neutral-950">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <SeasonPredictorPage
          fixtures={mockMatches}
          teams={mockTeams}
          initialData={initialData}
        />
      </main>
    </div>
  );
}
