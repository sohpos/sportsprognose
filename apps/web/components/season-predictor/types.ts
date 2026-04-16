/**
 * Season Predictor - Shared Types (Unified + Corrected)
 */

export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface Fixtures {
  homeId: string;
  awayId: string;
  homeScore?: number | null;
  awayScore?: number | null;
  isPlayed: boolean;
  date?: string;
}

/**
 * Core Team Data returned by the Season Predictor Engine
 */
export interface TeamData {
  xp: number;

  /** champion probability (0–1) */
  championProb: number;

  /** relegation probability (0–1) */
  relegationProb: number;

  /** raw position distribution (counts out of 100000) */
  distribution: number[];

  /** normalized distribution (0–1) */
  positions?: Array<{ position: number; probability: number }>;

  actualPoints?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  xG?: number;
  xGA?: number;

  /** last N match results (0,1,3) */
  form?: number[];

  /** Home/Away splits */
  homePoints?: number;
  awayPoints?: number;
}

export interface SeasonPredictorData {
  [teamId: string]: TeamData;
}

export interface LeagueAverage {
  xp: number;
  xG: number;
  xGA: number;
}

/**
 * Surprise Index computed metrics
 */
export interface TeamSurpriseMetrics {
  delta: number | null;       // actualPoints - xp
  luckFactor: number | null;  // (delta / xp) * 100
  volatility: number;         // sqrt(var)
  consistency: number | null; // 1 / volatility
  xgDelta: number | null;     // goalsFor - xG
  xgaDelta: number | null;    // goalsAgainst - xGA
  momentum: number | null;    // form trend
}

/**
 * Props for pages
 */
export interface SeasonPredictorPageProps {
  fixtures: Fixtures[];
  teams: Team[];
  actualPoints?: Record<string, number>;
  leagueAverage?: LeagueAverage;
}

export interface TeamDetailPageProps {
  team: Team;
  data: TeamData;
  leagueAverage?: LeagueAverage;
}

/**
 * Chart Props
 */
export interface ChartProps {
  team: Team;
  distribution: number[];
}

/**
 * Scatter Plot Props
 * surprise = delta (actual - xp)
 */
export interface ScatterPlotProps {
  teams: Team[];
  data: Record<string, { xp: number; actualPoints: number; surprise: number }>;
}
