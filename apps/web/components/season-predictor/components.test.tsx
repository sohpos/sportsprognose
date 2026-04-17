'use client';

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SeasonXPTable } from './SeasonXPTable';
import { SeasonChances } from './SeasonChances';
import { TeamSummaryGrid } from './TeamSummaryGrid';

const mockTeams = [
  { id: 'bl1-1', name: 'Bayern München', logo: '' },
  { id: 'bl1-2', name: 'Borussia Dortmund', logo: '' },
];

const mockData: Record<string, any> = {
  'bl1-1': { xp: 78, championProb: 25180, relegationProb: 100, distribution: Array(18).fill(0) },
  'bl1-2': { xp: 65, championProb: 7000, relegationProb: 500, distribution: Array(18).fill(0) },
};

describe('SeasonXPTable', () => {
  it('renders without crashing', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />);
  });
});

describe('SeasonChances', () => {
  it('renders without crashing', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />);
  });
});

describe('TeamSummaryGrid', () => {
  it('renders without crashing', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />);
  });
});
