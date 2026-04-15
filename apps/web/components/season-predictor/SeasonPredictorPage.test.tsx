/**
 * Unit Tests: SeasonPredictorPage
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SeasonPredictorPage } from './SeasonPredictorPage'

// Mock useSeasonPredictor hook
vi.mock('@/hooks/useSeasonPredictor', () => ({
  useSeasonPredictor: vi.fn()
}))

const mockTeams = [
  { id: '1', name: 'Bayern' },
  { id: '2', name: 'Dortmund' },
  { id: '3', name: 'Leverkusen' }
]

const mockFixtures = [
  { homeId: '1', awayId: '2' },
  { homeId: '2', awayId: '3' }
]

const mockData = {
  '1': { xp: 72, first: 35000, relegation: 100, distribution: Array(18).fill(0).map((_, i) => i === 0 ? 35000 : 0) },
  '2': { xp: 65, first: 15000, relegation: 500, distribution: Array(18).fill(0).map((_, i) => i === 1 ? 15000 : 0) },
  '3': { xp: 60, first: 8000, relegation: 2000, distribution: Array(18).fill(0).map((_, i) => i === 2 ? 8000 : 0) }
}

describe('SeasonPredictorPage', () => {
  it('shows loading state while simulating', async () => {
    const { useSeasonPredictor } = await import('@/hooks/useSeasonPredictor')
    vi.mocked(useSeasonPredictor).mockReturnValue({
      data: null,
      loading: true,
      progress: 45
    })

    render(<SeasonPredictorPage fixtures={mockFixtures} teams={mockTeams} />)
    
    expect(screen.getByText(/Simulation läuft/)).toBeInTheDocument()
    expect(screen.getByText(/45%/)).toBeInTheDocument()
  })

  it('renders all subcomponents when data is loaded', async () => {
    const { useSeasonPredictor } = await import('@/hooks/useSeasonPredictor')
    vi.mocked(useSeasonPredictor).mockReturnValue({
      data: mockData,
      loading: false,
      progress: 100
    })

    render(<SeasonPredictorPage fixtures={mockFixtures} teams={mockTeams} />)
    
    await waitFor(() => {
      expect(screen.getByText('Season Predictor')).toBeInTheDocument()
      expect(screen.getByText('Expected Points')).toBeInTheDocument()
      expect(screen.getByText('Meisterschafts-Chancen')).toBeInTheDocument()
    })
  })

  it('renders with actualPoints when provided', async () => {
    const { useSeasonPredictor } = await import('@/hooks/useSeasonPredictor')
    vi.mocked(useSeasonPredictor).mockReturnValue({
      data: mockData,
      loading: false,
      progress: 100
    })

    const actualPoints = { '1': 75, '2': 60, '3': 58 }
    
    render(<SeasonPredictorPage 
      fixtures={mockFixtures} 
      teams={mockTeams} 
      actualPoints={actualPoints}
    />)
    
    await waitFor(() => {
      expect(screen.getByText('Season Predictor')).toBeInTheDocument()
    })
  })
})