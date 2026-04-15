/**
 * Unit Tests: SurpriseIndex, TeamInsightCard, LeagueInsightsPanel
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurpriseIndex } from './SurpriseIndex'
import { TeamInsightCard, TeamInsightGrid } from './TeamInsightCard'
import { LeagueInsightsPanel } from './LeagueInsightsPanel'

const mockTeams = [
  { id: '1', name: 'Bayern' },
  { id: '2', name: 'Dortmund' },
  { id: '3', name: 'Leverkusen' }
]

const mockData = {
  '1': { 
    xp: 70, 
    distribution: Array(18).fill(0).map((_, i) => i === 0 ? 35000 : 5000),
    actualPoints: 75,
    goalsFor: 60,
    goalsAgainst: 25,
    xG: 55,
    xGA: 28,
    form: [3, 1, 3, 3, 0]
  },
  '2': { 
    xp: 60, 
    distribution: Array(18).fill(0).map((_, i) => i === 1 ? 20000 : 5000),
    actualPoints: 55,
    goalsFor: 45,
    goalsAgainst: 35,
    xG: 48,
    xGA: 32,
    form: [1, 1, 0, 3, 1]
  },
  '3': { 
    xp: 55, 
    distribution: Array(18).fill(0).map((_, i) => i === 3 ? 15000 : 5000),
    actualPoints: 58,
    goalsFor: 40,
    goalsAgainst: 30,
    xG: 42,
    xGA: 28,
    form: [3, 3, 1, 1, 0]
  }
}

describe('SurpriseIndex', () => {
  it('renders 4 metric cards', () => {
    render(<SurpriseIndex data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Luck Factor')).toBeInTheDocument()
    expect(screen.getByText('Consistency')).toBeInTheDocument()
    expect(screen.getByText('xG Delta (Offense)')).toBeInTheDocument()
    expect(screen.getByText('Momentum')).toBeInTheDocument()
  })

  it('shows teams in each card', () => {
    render(<SurpriseIndex data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
  })

  it('renders desktop table on md+', () => {
    render(<SurpriseIndex data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Vollständige Analyse')).toBeInTheDocument()
  })
})

describe('TeamInsightCard', () => {
  it('renders full card mode', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockData['1']} compact={false} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText('Expected Points')).toBeInTheDocument()
  })

  it('renders compact mode', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockData['1']} compact={true} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText(/xP:/)).toBeInTheDocument()
  })
})

describe('TeamInsightGrid', () => {
  it('renders all teams', () => {
    render(<TeamInsightGrid data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText('Dortmund')).toBeInTheDocument()
    expect(screen.getByText('Leverkusen')).toBeInTheDocument()
  })
})

describe('LeagueInsightsPanel', () => {
  it('renders insight sections', () => {
    render(<LeagueInsightsPanel data={mockData} teams={mockTeams} />)
    
    expect(screen.getByText('Überperformer (Δ-Points)')).toBeInTheDocument()
  })

  it('identifies overperformer', () => {
    render(<LeagueInsightsPanel data={mockData} teams={mockTeams} />)
    
    // Bayern has +5 delta, should appear as overperformer
    expect(screen.getByText('Bayern')).toBeInTheDocument()
  })
})