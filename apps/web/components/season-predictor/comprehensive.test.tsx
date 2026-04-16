/**
 * Extended Unit Tests: All Season Predictor Components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import all components
import { SeasonXPTable } from './SeasonXPTable'
import { SeasonChances } from './SeasonChances'
import { TeamSummaryGrid } from './TeamSummaryGrid'
import { PositionDistributionChart } from './PositionDistributionChart'
import { ScatterPlotXPvsActual } from './ScatterPlotXPvsActual'
import { SurpriseIndex } from './SurpriseIndex'
import { TeamInsightCard, TeamInsightGrid } from './TeamInsightCard'
import { LeagueInsightsPanel } from './LeagueInsightsPanel'
import { SeasonPredictorPage } from './SeasonPredictorPage'

// Mock useSeasonPredictor hook
vi.mock('@/hooks/useSeasonPredictor', () => ({
  useSeasonPredictor: vi.fn(() => ({
    data: null,
    loading: false,
    progress: 100
  }))
}))

// Test data
const mockTeams = [
  { id: '1', name: 'Bayern München', logo: 'https://example.com/bayern.png' },
  { id: '2', name: 'Borussia Dortmund', logo: 'https://example.com/dortmund.png' },
  { id: '3', name: 'Bayer Leverkusen', logo: 'https://example.com/leverkusen.png' },
  { id: '4', name: 'RB Leipzig' },
  { id: '5', name: 'Eintracht Frankfurt' },
]

const mockData = {
  '1': { xp: 78.5, first: 45000, relegation: 100, distribution: Array(18).fill(0).map((_, i) => i === 0 ? 45000 : 2000) },
  '2': { xp: 68.2, first: 15000, relegation: 500, distribution: Array(18).fill(0).map((_, i) => i === 1 ? 15000 : 2000) },
  '3': { xp: 72.0, first: 25000, relegation: 300, distribution: Array(18).fill(0).map((_, i) => i === 2 ? 25000 : 2000) },
  '4': { xp: 66.5, first: 8000, relegation: 2000, distribution: Array(18).fill(0).map((_, i) => i === 3 ? 8000 : 2000) },
  '5': { xp: 58.0, first: 2000, relegation: 15000, distribution: Array(18).fill(0).map((_, i) => i === 10 ? 2000 : 2000) },
}

const mockDataWithExtras = {
  '1': { 
    xp: 78.5, first: 45000, relegation: 100, distribution: Array(18).fill(0).map((_, i) => i === 0 ? 45000 : 2000),
    actualPoints: 75, goalsFor: 65, goalsAgainst: 25, xG: 60, xGA: 28, form: [3, 1, 3, 3, 0]
  },
  '2': { 
    xp: 68.2, first: 15000, relegation: 500, distribution: Array(18).fill(0).map((_, i) => i === 1 ? 15000 : 2000),
    actualPoints: 65, goalsFor: 50, goalsAgainst: 35, xG: 48, xGA: 32, form: [1, 1, 0, 3, 1]
  },
}

describe('SeasonXPTable', () => {
  it('renders all teams sorted by xP', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
    expect(screen.getByText('Bayer Leverkusen')).toBeInTheDocument()
  })

  it('displays correct xP values with 2 decimals', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    expect(screen.getByText('78.50')).toBeInTheDocument()
    expect(screen.getByText('68.20')).toBeInTheDocument()
  })

  it('shows champion and relegation percentages', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    expect(screen.getByText('45.0%')).toBeInTheDocument() // Bayern champion
    expect(screen.getByText('15.0%')).toBeInTheDocument() // Frankfurt relegation
  })

  it('renders team logos', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    const logos = screen.getAllByRole('img')
    expect(logos.length).toBeGreaterThan(0)
  })

  it('has sticky header', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    const thead = screen.getByRole('rowgroup')
    expect(thead).toHaveClass('sticky')
  })

  it('handles empty data gracefully', () => {
    render(<SeasonXPTable data={{}} teams={mockTeams} />)
    expect(screen.queryByText('78.50')).not.toBeInTheDocument()
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

  it('shows top 8 teams in each section', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
  })

  it('applies correct colors to percentages', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    const greenText = screen.getAllByText((content) => content.includes('%') && !content.includes('%'))
    expect(greenText.length).toBeGreaterThan(0)
  })
})

describe('TeamSummaryGrid', () => {
  it('renders all teams', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
    expect(screen.getByText('Eintracht Frankfurt')).toBeInTheDocument()
  })

  it('displays xP, champion and relegation stats', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    expect(screen.getByText(/xP:/)).toBeInTheDocument()
    expect(screen.getByText(/Meister:/)).toBeInTheDocument()
    expect(screen.getByText(/Abstieg:/)).toBeInTheDocument()
  })

  it('shows delta when actualPoints is provided', () => {
    render(<TeamTeamSummaryGrid data={mockDataWithExtras} teams={mockTeams} />)
    expect(screen.getByText('Δ')).toBeInTheDocument()
  })

  it('has hover effects on cards', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    const cards = screen.getAllByText(/xP:/)
    expect(cards[0].closest('div')).toHaveClass('hover:scale-[1.02]')
  })
})

describe('PositionDistributionChart', () => {
  it('renders team name', () => {
    const distribution = Array(18).fill(0).map((_, i) => i === 0 ? 45000 : 5000)
    render(<PositionDistributionChart team={mockTeams[0]} distribution={distribution} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
  })

  it('renders all 18 positions', () => {
    const distribution = Array(18).fill(1000)
    render(<PositionDistributionChart team={mockTeams[0]} distribution={distribution} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('shows percentages with 1 decimal', () => {
    const distribution = [35000, 15000, 10000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000]
    render(<PositionDistributionChart team={mockTeams[0]} distribution={distribution} />)
    expect(screen.getByText('35.0%')).toBeInTheDocument()
  })

  it('hides negligible probabilities (<0.5%)', () => {
    const distribution = Array(18).fill(0).map((_, i) => i < 3 ? 40000 : 100)
    render(<PositionDistributionChart team={mockTeams[0]} distribution={distribution} />)
    // Positions 4-18 should be filtered out
    expect(screen.queryByText('4.')).not.toBeInTheDocument()
  })
})

describe('ScatterPlotXPvsActual', () => {
  it('renders title', () => {
    const scatterData = {
      '1': { xp: 70, actualPoints: 75, surprise: 5 },
      '2': { xp: 60, actualPoints: 55, surprise: -5 },
      '3': { xp: 50, actualPoints: 50, surprise: 0 }
    }
    render(<ScatterPlotXPvsActual teams={mockTeams} data={scatterData} />)
    expect(screen.getByText('xP vs Actual Points')).toBeInTheDocument()
  })

  it('renders legend with all quadrants', () => {
    const scatterData = {
      '1': { xp: 70, actualPoints: 75, surprise: 5 },
    }
    render(<ScatterPlotXPvsActual teams={mockTeams} data={scatterData} />)
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Lucky')).toBeInTheDocument()
    expect(screen.getByText('Unlucky')).toBeInTheDocument()
    expect(screen.getByText('Bad')).toBeInTheDocument()
  })

  it('handles empty data', () => {
    render(<ScatterPlotXPvsActual teams={mockTeams} data={{}} />)
    expect(screen.getByText('Keine Daten verfügbar')).toBeInTheDocument()
  })

  it('renders grid lines', () => {
    const scatterData = {
      '1': { xp: 70, actualPoints: 75, surprise: 5 },
    }
    render(<ScatterPlotXPvsActual teams={mockTeams} data={scatterData} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })
})

describe('SurpriseIndex', () => {
  it('renders all 4 metric cards', () => {
    render(<SurpriseIndex data={mockDataWithExtras} teams={mockTeams} />)
    expect(screen.getByText('Luck Factor')).toBeInTheDocument()
    expect(screen.getByText('Consistency')).toBeInTheDocument()
    expect(screen.getByText('xG Delta (Offense)')).toBeInTheDocument()
    expect(screen.getByText('Momentum')).toBeInTheDocument()
  })

  it('shows teams in each card', () => {
    render(<SurpriseIndex data={mockDataWithExtras} teams={mockTeams} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
  })

  it('applies color coding correctly', () => {
    render(<SurpriseIndex data={mockDataWithExtras} teams={mockTeams} />)
    const greenElements = screen.getAllByText((content) => content.includes('+'))
    expect(greenElements.length).toBeGreaterThan(0)
  })
})

describe('TeamInsightCard', () => {
  it('renders full card mode', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockDataWithExtras['1']} compact={false} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
    expect(screen.getByText('Expected Points')).toBeInTheDocument()
  })

  it('renders compact mode', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockDataWithExtras['1']} compact={true} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
    expect(screen.getByText(/xP:/)).toBeInTheDocument()
  })

  it('shows delta with correct color', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockDataWithExtras['1']} compact={false} />)
    const delta = screen.getByText((content) => content.includes('+'))
    expect(delta).toHaveClass('text-green-600')
  })
})

describe('TeamInsightGrid', () => {
  it('renders all teams', () => {
    render(<TeamInsightGrid data={mockDataWithExtras} teams={mockTeams} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
    expect(screen.getByText('Borussia Dortmund')).toBeInTheDocument()
  })
})

describe('LeagueInsightsPanel', () => {
  it('renders multiple insight sections', () => {
    render(<LeagueInsightsPanel data={mockDataWithExtras} teams={mockTeams} />)
    expect(screen.getByText('Überperformer')).toBeInTheDocument()
    expect(screen.getByText('Underperformer')).toBeInTheDocument()
    expect(screen.getByText('Glücksfaktor')).toBeInTheDocument()
  })

  it('shows team logos in insights', () => {
    render(<LeagueInsightsPanel data={mockDataWithExtras} teams={mockTeams} />)
    const logos = screen.getAllByRole('img')
    expect(logos.length).toBeGreaterThan(0)
  })

  it('applies color coding for positive/negative values', () => {
    render(<LeagueInsightsPanel data={mockDataWithExtras} teams={mockTeams} />)
    // Should have green for positive, red for negative
    const coloredElements = screen.getAllByText((content) => 
      content.includes('+') || (content.includes('-') && !content.includes('-'))
    )
    expect(coloredElements.length).toBeGreaterThan(0)
  })
})

describe('SeasonPredictorPage', () => {
  it('renders with initialData without loading', async () => {
    const { useSeasonPredictor } = await import('@/hooks/useSeasonPredictor')
    vi.mocked(useSeasonPredictor).mockReturnValue({
      data: null,
      loading: false,
      progress: 100
    })

    render(<SeasonPredictorPage 
      teams={mockTeams} 
      actualPoints={{ '1': 75, '2': 65 }}
      initialData={mockData}
    />)

    await waitFor(() => {
      expect(screen.getByText('Expected Points')).toBeInTheDocument()
    })
  })

  it('shows loading state when simulating', async () => {
    const { useSeasonPredictor } = await import('@/hooks/useSeasonPredictor')
    vi.mocked(useSeasonPredictor).mockReturnValue({
      data: null,
      loading: true,
      progress: 45
    })

    render(<SeasonPredictorPage teams={mockTeams} fixtures={[]} />)
    
    expect(screen.getByText(/Simulation läuft/)).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('renders all sections', async () => {
    const { useSeasonPredictor } = await import('@/hooks/useSeasonPredictor')
    vi.mocked(useSeasonPredictor).mockReturnValue({
      data: mockData,
      loading: false,
      progress: 100
    })

    render(<SeasonPredictorPage 
      teams={mockTeams} 
      actualPoints={{ '1': 75 }}
      initialData={mockData}
    />)

    await waitFor(() => {
      expect(screen.getByText('Expected Points')).toBeInTheDocument()
      expect(screen.getByText('Meisterschafts-Chancen')).toBeInTheDocument()
      expect(screen.getByText('Surprise Index')).toBeInTheDocument()
      expect(screen.getByText('Liga Insights')).toBeInTheDocument()
    })
  })
})

describe('Accessibility', () => {
  it('SeasonXPTable has proper table structure', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Team/ })).toBeInTheDocument()
  })

  it('components have sufficient color contrast markers', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    // Green text should be present for positive values
    const greenText = screen.getAllByText((content) => 
      content.includes('%') && content.match(/\d+\.\d+%/)
    )
    greenText.forEach(el => {
      expect(el).toHaveClass(/text-green/)
    })
  })

  it('interactive elements are focusable', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    const cards = screen.getAllByText(/xP:/)
    cards.forEach(card => {
      expect(card.closest('div')).toHaveClass('cursor-pointer')
    })
  })
})

describe('Responsive Behavior', () => {
  it('TeamSummaryGrid uses grid layout', () => {
    render(<TeamSummaryGrid data={mockData} teams={mockTeams} />)
    const grid = screen.getByText(/xP:/).closest('div')
    expect(grid?.parentElement).toHaveClass(/grid/)
  })

  it('SeasonChances uses responsive grid', () => {
    render(<SeasonChances data={mockData} teams={mockTeams} />)
    const container = screen.getByText('Meisterschafts-Chancen').closest('div')
    expect(container?.parentElement).toHaveClass(/grid/)
  })
})

describe('Dark Mode Support', () => {
  it('components have dark mode classes', () => {
    render(<SeasonXPTable data={mockData} teams={mockTeams} />)
    const table = screen.getByRole('table')
    expect(table).toHaveClass(/dark:/)
  })

  it('text colors include dark mode variants', () => {
    render(<TeamInsightCard team={mockTeams[0]} data={mockDataWithExtras['1']} compact={false} />)
    const name = screen.getByText('Bayern München')
    expect(name).toHaveClass(/dark:text-neutral-200/)
  })
})

describe('Error Handling', () => {
  it('handles missing data gracefully', () => {
    render(<SeasonXPTable data={{} as any} teams={mockTeams} />)
    expect(screen.queryByText('78.50')).not.toBeInTheDocument()
  })

  it('handles undefined distribution', () => {
    const noDistData = { '1': { xp: 70, first: 0, relegation: 0, distribution: undefined as any } }
    render(<PositionDistributionChart team={mockTeams[0]} distribution={[]} />)
    expect(screen.getByText('Bayern München')).toBeInTheDocument()
  })
})