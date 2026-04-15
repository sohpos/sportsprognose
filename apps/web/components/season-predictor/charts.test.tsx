/**
 * Unit Tests: PositionDistributionChart, ScatterPlotXPvsActual
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PositionDistributionChart } from './PositionDistributionChart'
import { ScatterPlotXPvsActual } from './ScatterPlotXPvsActual'

const mockTeam = { id: '1', name: 'Bayern' }

describe('PositionDistributionChart', () => {
  it('renders team name', () => {
    const distribution = Array(18).fill(0).map((_, i) => i === 0 ? 35000 : 5000)
    render(<PositionDistributionChart team={mockTeam} distribution={distribution} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
  })

  it('renders all 18 positions', () => {
    const distribution = Array(18).fill(0).map((_, i) => (i + 1) * 1000)
    render(<PositionDistributionChart team={mockTeam} distribution={distribution} />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('shows percentages', () => {
    const distribution = [35000, 15000, 10000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000]
    render(<PositionDistributionChart team={mockTeam} distribution={distribution} />)
    
    expect(screen.getByText('35.0%')).toBeInTheDocument()
  })

  it('handles empty distribution', () => {
    const distribution = Array(18).fill(0)
    render(<PositionDistributionChart team={mockTeam} distribution={distribution} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
  })
})

describe('ScatterPlotXPvsActual', () => {
  const mockTeams = [
    { id: '1', name: 'Bayern' },
    { id: '2', name: 'Dortmund' },
    { id: '3', name: 'Leverkusen' }
  ]

  const mockData = {
    '1': { xp: 70, actualPoints: 75, surprise: 5 },
    '2': { xp: 60, actualPoints: 55, surprise: -5 },
    '3': { xp: 50, actualPoints: 50, surprise: 0 }
  }

  it('renders title', () => {
    render(<ScatterPlotXPvsActual teams={mockTeams} data={mockData} />)
    
    expect(screen.getByText('xP vs Actual Points')).toBeInTheDocument()
  })

  it('renders legend', () => {
    render(<ScatterPlotXPvsActual teams={mockTeams} data={mockData} />)
    
    expect(screen.getByText('Überperformer')).toBeInTheDocument()
    expect(screen.getByText('Underperformer')).toBeInTheDocument()
  })

  it('renders all team points', () => {
    render(<ScatterPlotXPvsActual teams={mockTeams} data={mockData} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText('Dortmund')).toBeInTheDocument()
    expect(screen.getByText('Leverkusen')).toBeInTheDocument()
  })
})