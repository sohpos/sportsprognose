import React from 'react';
import React from 'react'

'use client';
/**
 * Unit Tests: TeamDetailPage
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamDetailPage } from './TeamDetailPage'

const mockTeam = { id: '1', name: 'Bayern', logo: 'https://example.com/bayern.png' }

const mockData = {
  xp: 70,
  distribution: Array(18).fill(0).map((_, i) => i === 0 ? 35000 : 5000),
  actualPoints: 75,
  goalsFor: 60,
  goalsAgainst: 25,
  xG: 55,
  xGA: 28,
  form: [3, 1, 3, 3, 0, 1, 3, 3, 1, 0],
  homePoints: 40,
  awayPoints: 35
}

describe('TeamDetailPage', () => {
  it('renders team header', () => {
    render(<TeamDetailPage team={mockTeam} data={mockData} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    expect(screen.getByText('75 Punkte')).toBeInTheDocument()
  })

  it('renders positions distribution section', () => {
    render(<TeamDetailPage team={mockTeam} data={mockData} />)
    
    expect(screen.getByText('Positionsverteilung')).toBeInTheDocument()
  })

  it('renders form curve when form data exists', () => {
    render(<TeamDetailPage team={mockTeam} data={mockData} />)
    
    expect(screen.getByText('Formkurve (letzte 10)')).toBeInTheDocument()
  })

  it('renders xG breakdown section', () => {
    render(<TeamDetailPage team={mockTeam} data={mockData} />)
    
    expect(screen.getByText('xG Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Expected Goals (xG)')).toBeInTheDocument()
    expect(screen.getByText('Expected Goals Against (xGA)')).toBeInTheDocument()
  })

  it('renders home/away split', () => {
    render(<TeamDetailPage team={mockTeam} data={mockData} />)
    
    expect(screen.getByText('Heim / Auswärts')).toBeInTheDocument()
    expect(screen.getByText('Heim')).toBeInTheDocument()
    expect(screen.getByText('Auswärts')).toBeInTheDocument()
  })

  it('handles team without logo', () => {
    const teamWithoutLogo = { id: '1', name: 'Dortmund' }
    render(<TeamDetailPage team={teamWithoutLogo} data={mockData} />)
    
    expect(screen.getByText('Dortmund')).toBeInTheDocument()
  })

  it('handles missing optional data', () => {
    const minimalData = {
      xp: 70,
      distribution: Array(18).fill(0)
    }
    render(<TeamDetailPage team={mockTeam} data={minimalData} />)
    
    expect(screen.getByText('Bayern')).toBeInTheDocument()
    // Should not crash, just not render optional sections
  })
})