'use client';

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PositionDistributionChart } from './PositionDistributionChart';
import { ScatterPlotXPvsActual } from './ScatterPlotXPvsActual';

// Mock child components
vi.mock('./TeamInsightCard', () => ({ TeamInsightCard: () => null }));
vi.mock('./TeamSummaryGrid', () => ({ TeamSummaryGrid: () => null }));

const mockTeams = [
  { id: 'bl1-1', name: 'Bayern', logo: '' },
];

// Valid distribution with 18 positions
const validDistribution = [25000, 18000, 12000, 8000, 5000, 3000, 2000, 1500, 1000, 800, 600, 400, 300, 200, 150, 100, 70, 50];

const mockData: Record<string, any> = {
  'bl1-1': { xp: 75, distribution: validDistribution, actualPoints: 80 },
};

describe('PositionDistributionChart', () => {
  it('renders without crashing', () => {
    // Pass distribution directly as the component expects
    render(<PositionDistributionChart team={mockTeams[0]} distribution={validDistribution} />);
  });
});

describe('ScatterPlotXPvsActual', () => {
  it('renders without crashing', () => {
    render(<ScatterPlotXPvsActual data={mockData} teams={mockTeams} />);
  });
});
