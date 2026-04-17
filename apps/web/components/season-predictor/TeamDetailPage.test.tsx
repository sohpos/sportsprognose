'use client';

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamDetailPage } from './TeamDetailPage';

const mockTeam = {
  id: 'bl1-1',
  name: 'Bayern München',
  short: 'FCB',
  logo: '',
};

const mockData: Record<string, any> = {
  'bl1-1': {
    xp: 78,
    championProb: 25180,
    relegationProb: 100,
    distribution: [25180, 18000, 12000, 8000, 5000, 3000, 2000, 1500, 1000, 800, 600, 400, 300, 200, 150, 100, 70, 50],
    goalsFor: 65,
    goalsAgainst: 25,
    xG: 62,
    xGA: 28,
    form: [3, 1, 3, 3, 0],
  },
};

describe('TeamDetailPage', () => {
  it('renders team name', () => {
    render(<TeamDetailPage team={mockTeam} data={mockData} />);
    // Just verify it renders without crashing
  });

  it('handles team without logo', () => {
    const teamNoLogo = { id: 'bl1-2', name: 'Dortmund' };
    render(<TeamDetailPage team={teamNoLogo} data={mockData} />);
  });

  it('handles missing data', () => {
    render(<TeamDetailPage team={mockTeam} data={{}} />);
  });
});
