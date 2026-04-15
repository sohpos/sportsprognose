/**
 * Season Predictor - Utility Functions
 */

import { TeamData, TeamSurpriseMetrics } from './types'

/**
 * Calculate volatility (standard deviation) from position distribution
 */
export const calculateVolatility = (distribution: number[]): number => {
  const total = distribution.reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  let expectedPos = 0
  distribution.forEach((count, pos) => {
    expectedPos += (pos + 1) * (count / total)
  })

  let variance = 0
  distribution.forEach((count, pos) => {
    const prob = count / total
    variance += prob * Math.pow(pos + 1 - expectedPos, 2)
  })

  return Math.sqrt(variance)
}

/**
 * Calculate expected position from distribution
 */
export const calculateExpectedPosition = (distribution: number[]): number => {
  const total = distribution.reduce((a, b) => a + b, 0)
  if (total === 0) return 0

  let expectedPos = 0
  distribution.forEach((count, pos) => {
    expectedPos += (pos + 1) * (count / total)
  })

  return expectedPos
}

/**
 * Calculate momentum from form array (last 5 matches)
 */
export const calculateMomentum = (form?: number[]): number | null => {
  if (!form || form.length < 3) return null

  const recent = form.slice(-3)
  const earlier = form.slice(-5, -3)

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const earlierAvg = earlier.length > 0
    ? earlier.reduce((a, b) => a + b, 0) / earlier.length
    : recentAvg

  return recentAvg - earlierAvg
}

/**
 * Calculate all surprise metrics for a team
 */
export const calculateSurpriseMetrics = (
  teamId: string,
  data: TeamData
): TeamSurpriseMetrics => {
  const volatility = calculateVolatility(data.distribution)
  const xp = data.xp
  const actual = data.actualPoints
  const delta = actual !== undefined ? actual - xp : null
  const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
  const consistency = volatility > 0 ? 1 / volatility : null
  const xgDelta = (data.goalsFor !== undefined && data.xG !== undefined)
    ? data.goalsFor - data.xG
    : null
  const xgaDelta = (data.goalsAgainst !== undefined && data.xGA !== undefined)
    ? data.goalsAgainst - data.xGA
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
 * Convert distribution counts to percentages
 */
export const distributionToPercentages = (
  distribution: number[],
  total: number = 100000
): number[] => {
  return distribution.map((v) => (v / total) * 100)
}

/**
 * Get quadrant for scatter plot position
 */
export const getQuadrant = (
  xp: number,
  actual: number,
  maxVal: number
): 'efficient' | 'lucky' | 'unlucky' | 'inefficient' => {
  if (actual >= xp && xp >= maxVal / 2) return 'efficient'
  if (actual >= xp && xp < maxVal / 2) return 'lucky'
  if (actual < xp && xp >= maxVal / 2) return 'unlucky'
  return 'inefficient'
}

/**
 * Get color for quadrant
 */
export const getQuadrantColor = (quadrant: string): string => {
  switch (quadrant) {
    case 'efficient': return '#16a34a' // green
    case 'lucky': return '#2563eb' // blue
    case 'unlucky': return '#ea580c' // orange
    case 'inefficient': return '#dc2626' // red
    default: return '#6b7280' // gray
  }
}

/**
 * Scale value for chart positioning
 */
export const scaleValue = (
  value: number,
  maxValue: number,
  range: number,
  offset: number
): number => {
  return (value / maxValue) * (range - offset * 2) + offset
}

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format points delta with sign
 */
export const formatDelta = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}`
}