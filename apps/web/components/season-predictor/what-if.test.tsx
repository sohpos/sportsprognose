'use client';

/**
 * Unit Tests: What-If Engine (simplified)
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SeasonPredictorPage } from './SeasonPredictorPage';

// Mock child components
vi.mock('./SurpriseIndex', () => ({ SurpriseIndex: () => null }));
vi.mock('./LeagueInsightsPanel', () => ({ LeagueInsightsPanel: () => null }));
vi.mock('./TeamSummaryGrid', () => ({ TeamSummaryGrid: () => null }));
vi.mock('./ScatterPlotXPvsActual', () => ({ ScatterPlotXPvsActual: () => null }));

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

describe('What-If Engine', () => {
  it('renders SeasonPredictorPage', () => {
    render(<SeasonPredictorPage fixtures={mockFixtures} teams={mockTeams} />);
  });
});
