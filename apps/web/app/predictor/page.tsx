import type { Metadata } from 'next';
import { SeasonPredictorPage } from '@/components/season-predictor';

export const metadata: Metadata = {
  title: 'SportsPrognose – Season Predictor',
  description: 'Monte Carlo Simulation für die Bundesliga',
};

export default function SeasonPredictorDashboard() {
  // Page components handle their own data via hook
  return (
    <div className="min-h-screen bg-neutral-950">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <SeasonPredictorPage 
          fixtures={[]} 
          teams={[]} 
        />
      </main>
    </div>
  );
}
