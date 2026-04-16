/**
 * Season Predictor - Utility Functions (Corrected + Stabilized)
 */

import { TeamData, TeamSurpriseMetrics } from './types'

/**
 * Expected position helper
 */
const getExpectedPosition = (distribution: number[]): number => {
  const total = distribution.reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  return distribution.reduce(
    (sum, count, pos) => sum + (pos + 1) * (count / total),
    0
  )
}

/**
 * Calculate volatility (standard deviation)
 */
export const calculateVolatility = (distribution: number[]): number => {
  const total = distribution.reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  const expectedPos = getExpectedPosition(distribution)

  const variance = distribution.reduce((sum, count, pos) => {
    const prob = count / total
    return sum + prob * Math.pow(pos + 1 - expectedPos, 2)
  }, 0)

  return Math.sqrt(variance)
}

/**
 * Expected position
 */
export const calculateExpectedPosition = getExpectedPosition

/**
 * Momentum (last 5 matches)
 */
export const calculateMomentum = (form?: number[]): number | null => {
  if (!form || form.length < 3) return null

  const safeForm = form.map((v) => Number(v) || 0)

  const recent = safeForm.slice(-3)
  const earlier = safeForm.slice(-5, -3)

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const earlierAvg =
    earlier.length > 0
      ? earlier.reduce((a, b) => a + b, 0) / earlier.length
      : recentAvg

  return recentAvg - earlierAvg
}

/**
 * Surprise Metrics
 */
export const calculateSurpriseMetrics = (
  teamId: string,
  data: TeamData
): TeamSurpriseMetrics => {
  const volatility = calculateVolatility(data.distribution)
  const xp = Number(data.xp) || 0
  const actual = data.actualPoints
  const delta = actual !== undefined ? actual - xp : null

  const luckFactor =
    xp > 0 && delta !== null ? (delta / xp) * 100 : null

  const consistency =
    volatility > 0 ? 1 / volatility : null

  const xgDelta =
    data.goalsFor !== undefined && data.xG !== undefined
      ? Number(data.goalsFor) - Number(data.xG)
      : null

  const xgaDelta =
    data.goalsAgainst !== undefined && data.xGA !== undefined
      ? Number(data.goalsAgainst) - Number(data.xGA)
      : null

  const momentum = calculateMomentum(data.form)

  return {
    delta,
    luckFactor,
    volatility,
    consistency,
    xgDelta,
    xgaDelta,
    momentum,
  }
}

/**
 * Convert distribution to percentages
 */
export const distributionToPercentages = (
  distribution: number[]
): number[] => {
  const total = distribution.reduce((a, b) => a + b, 0)
  if (total === 0) return distribution.map(() => 0)

  return distribution.map((v) => (v / total) * 100)
}

/**
 * Quadrant (median-based)
 */
export const getQuadrant = (
  xp: number,
  actual: number,
  medianXP: number
): 'efficient' | 'lucky' | 'unlucky' | 'inefficient' => {
  if (actual >= xp && xp >= medianXP) return 'efficient'
  if (actual >= xp && xp < medianXP) return 'lucky'
  if (actual < xp && xp >= medianXP) return 'unlucky'
  return 'inefficient'
}

/**
 * Quadrant color
 */
export const getQuadrantColor = (
  quadrant: 'efficient' | 'lucky' | 'unlucky' | 'inefficient'
): string => {
  switch (quadrant) {
    case 'efficient': return '#16a34a'
    case 'lucky': return '#2563eb'
    case 'unlucky': return '#ea580c'
    case 'inefficient': return '#dc2626'
  }
}

/**
 * Scale value for charts
 */
export const scaleValue = (
  value: number,
  maxValue: number,
  range: number,
  offset: number
): number => {
  if (maxValue <= 0) return offset
  return (value / maxValue) * (range - offset * 2) + offset
}

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  const safe = Math.min(Math.max(value, 0), 100)
  return `${safe.toFixed(decimals)}%`
}

/**
 * Format delta
 */
export const formatDelta = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}`
}
