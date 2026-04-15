/**
 * Season Predictor - Shared Types
 */

export interface Team {
  id: string
  name: string
  logo?: string
}

export interface Fixtures {
  homeId: string
  awayId: string
  homeScore?: number | null
  awayScore?: number | null
  isPlayed: boolean
  date?: string
}

export interface TeamData {
  xp: number
  first: number // champion probability (count out of 100k)
  relegation: number // relegation probability (count out of 100k)
  distribution: number[] // position distribution (18 elements, counts out of 100k)
  actualPoints?: number
  goalsFor?: number
  goalsAgainst?: number
  xG?: number
  xGA?: number
  form?: number[] // last 5 results (points per match: 0, 1, or 3)
  homePoints?: number
  awayPoints?: number
}

export interface SeasonPredictorData {
  [teamId: string]: TeamData
}

export interface LeagueAverage {
  xp: number
  xG: number
  xGA: number
}

// Surprise Index computed values
export interface TeamSurpriseMetrics {
  delta: number | null // actualPoints - xp
  luckFactor: number | null // (delta / xp) * 100
  volatility: number
  consistency: number | null // 1 / volatility
  xgDelta: number | null // goalsFor - xG
  xgaDelta: number | null // goalsAgainst - xGA
  momentum: number | null // form trend
}

// Props for all components
export interface SeasonPredictorPageProps {
  fixtures: Fixtures[]
  teams: Team[]
  actualPoints?: Record<string, number>
  leagueAverage?: LeagueAverage
}

export interface TeamDetailPageProps {
  team: Team
  data: TeamData
  leagueAverage?: LeagueAverage
}

export interface ChartProps {
  team: Team
  distribution: number[]
}

export interface ScatterPlotProps {
  teams: Team[]
  data: Record<string, { xp: number; actualPoints: number; surprise: number }>
}