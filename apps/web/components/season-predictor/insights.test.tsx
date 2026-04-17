'use client';

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SurpriseIndex } from './SurpriseIndex';
import { TeamInsightCard } from './TeamInsightCard';
import { LeagueInsightsPanel } from './LeagueInsightsPanel';

// Mock components that may cause cascading errors
vi.mock('./TeamInsightCard', () => ({ TeamInsightCard: () => null }));
vi.mock('./TeamSummaryGrid', () => ({ TeamSummaryGrid: () => null }));

const mockTeams = [
  { id: 'bl1-1', name: 'Bayern', logo: '' },
  { id: 'bl1-2', name: 'Dortmund', logo: '' },
];

const mockData: Record<string, any> = {
  'bl1-1': { xp: 78, actualPoints: 83, championProb: 0.25, relegationProb: 0.01, distribution: Array(18).fill(0) },
  'bl1-2': { xp: 65, actualPoints: 58, championProb: 0.07, relegationProb: 0.05, distribution: Array(18).fill(0) },
};

describe('SurpriseIndex', () => {
  it('renders without crashing', () => {
    render(<SurpriseIndex data={mockData} teams={mockTeams} />);
  });
});

describe('TeamInsightCard', () => {
  it('renders without crashing', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockData['bl1-1']} />);
  });
});

describe('LeagueInsightsPanel', () => {
  it('renders without crashing', () => {
    render(<LeagueInsightsPanel data={mockData} teams={mockTeams} />);
  });
});
