'use client';
/**
 * Unit Tests: SeasonXPTable, SeasonChances, TeamSummaryGrid
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeasonXPTable } from './SeasonXPTable'
import { SeasonChances } from './SeasonChances'
import { TeamSummaryGrid } from './TeamSummaryGrid'

const mockTeams = [
  { id: '1', name: 'Bayern' },
  { id: '2', name: 'Dortmund' },
  { id: '3', name: 'Leverkusen' }
]

const mockData = {
  '1': { xp: 72.5, first: 35000, relegation: 100, distribution: Array(18).fill(0) },
  '2': { xp: 65.2, first: 15000, relegation: 500, distribution: Array(18).fill(0) },
  '3': { xp: 60.8, first: 8000, relegation: 2000, distribution: Array(18).fill(0) }
}

describe('SeasonXPTable', () => {
  it('renders table with teams sorted by xP', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(4) // header + 3 teams
    
    // Bayern should be first (highest xP)
    expect(screen.getByText('Bayern')).toBeInTheDocument()
  })

  it('displays xP values with 2 decimals', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('72.50')).toBeInTheDocument()
    expect(screen.getByText('65.20')).toBeInTheDocument()
  })

  it('shows championship and relegation percentages', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Meister (%)')).toBeInTheDocument()
    expect(screen.getByText('Abstieg (%)')).toBeInTheDocument()
  })
})

describe('SeasonChances', () => {
  it('renders championship chances section', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Meisterschafts-Chancen')).toBeInTheDocument()
  })

  it('renders relegation chances section', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Abstiegs-Wahrscheinlichkeit')).toBeInTheDocument()
  })

  it('shows top 8 teams per section', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText('Dortmund')).toBeInTheDocument()
    expect(screen.getByText('Leverkusen')).toBeInTheDocument()
  })
})

describe('TeamSummaryGrid', () => {
  it('renders all teams', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText('Dortmund')).toBeInTheDocument()
    expect(screen.getByText('Leverkusen')).toBeInTheDocument()
  })

  it('displays xP, champion and relegation stats', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText(/xP:/)).toBeInTheDocument()
    expect(screen.getByText(/Meister:/)).toBeInTheDocument()
    expect(screen.getByText(/Abstieg:/)).toBeInTheDocument()
  })
})