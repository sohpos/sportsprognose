'use client';

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SeasonPredictorPage } from './SeasonPredictorPage';

// Mock child components that cause issues
vi.mock('./SurpriseIndex', () => ({ SurpriseIndex: () => null }));
vi.mock('./LeagueInsightsPanel', () => ({ LeagueInsightsPanel: () => null }));
vi.mock('./TeamSummaryGrid', () => ({ TeamSummaryGrid: () => null }));

// Mock the hook
vi.mock('@/hooks/useSeasonPredictor', () => ({
  useSeasonPredictor: vi.fn().mockReturnValue({
    data: {},
    loading: false,
    progress: 100,
  }),
}));

const mockTeams = [
  { id: 'bl1-1', name: 'Bayern', logo: '' },
  { id: 'bl1-2', name: 'Dortmund', logo: '' },
];

const mockFixtures: any[] = [];

describe('SeasonPredictorPage', () => {
  it('renders without crashing', () => {
    render(<SeasonPredictorPage fixtures={mockFixtures} teams={mockTeams} />);
  });

  it('accepts actualPoints prop', () => {
    const actualPoints = { 'bl1-1': 75, 'bl1-2': 60 };
    render(<SeasonPredictorPage fixtures={mockFixtures} teams={mockTeams} actualPoints={actualPoints} />);
  });

  it('accepts initialData prop', () => {
    const initialData = { 'bl1-1': { xp: 75, championProb: 0.2 } };
    render(<SeasonPredictorPage fixtures={mockFixtures} teams={mockTeams} initialData={initialData} />);
  });
});
