import { TeamInsightCard } from "./TeamInsightCard"
import { PositionDistributionChart } from "./PositionDistributionChart"

type TeamDetailPageProps = {
  team: { id: string; name: string; logo?: string }
  data: {
    xp: number
    distribution: number[]
    actualPoints?: number
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    form?: number[]
    homePoints?: number
    awayPoints?: number
  }
  leagueAverage?: { xp: number; xG: number; xGA: number }
}

export function TeamDetailPage({ team, data, leagueAverage }: TeamDetailPageProps) {
  // Calculate metrics inline
  const getVolatility = (distribution: number[]) => {
    const total = distribution.reduce((a, b) => a + b, 0)
    if (total === 0) return 0
    let expectedPos = 0
    distribution.forEach((count, pos) => { expectedPos += (pos + 1) * (count / total) })
    let variance = 0
    distribution.forEach((count, pos) => {
      const prob = count / total
      variance += prob * Math.pow(pos + 1 - expectedPos, 2)
    })
    return Math.sqrt(variance)
  }

  const getMomentum = (form?: number[]) => {
    if (!form || form.length < 3) return 0
    const recent = form.slice(-3)
    const earlier = form.slice(-5, -3)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const earlierAvg = earlier.length > 0 ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg
    return recentAvg - earlierAvg
  }

  const volatility = data?.distribution ? getVolatility(data.distribution) : 0
  const xp = data?.xp ?? 0
  const actual = data?.actualPoints
  const delta = actual !== undefined ? actual - xp : null
  const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
  const consistency = volatility > 0 ? 1 / volatility : null
  const xgDelta = (data?.goalsFor !== undefined && data?.xG !== undefined) ? data.goalsFor - data.xG : null
  const xgaDelta = (data?.goalsAgainst !== undefined && data?.xGA !== undefined) ? data.goalsAgainst - data.xGA : null
  const momentum = data?.form ? getMomentum(data.form) : null

  // Form curve (last 10 matches)
  const formHistory = data?.form?.slice(-10) || []
  const formPoints = formHistory.map((r, i) => ({
    match: i + 1,
    points: r,
    // Simple bar height: 0-3 points -> 0-100%
    height: (r / 3) * 100,
  }))

  // Expected position from distribution
  const getExpectedPosition = (distribution: number[]) => {
    const total = distribution.reduce((a, b) => a + b, 0)
    if (total === 0) return 0
    let expectedPos = 0
    distribution.forEach((count, pos) => {
      expectedPos += (pos + 1) * (count / total)
    })
    return expectedPos
  }
  const expectedPosition = data?.distribution ? getExpectedPosition(data.distribution) : 0

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        {team.logo && (
          <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          {actual !== null && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {actual} Punkte • Erwartete Position: {expectedPosition.toFixed(1)}.
            </p>
          )}
        </div>
      </div>

      {/* Team Insight Card (full) */}
      <TeamInsightCard team={team} data={data} compact={false} />

      {/* Position Distribution */}
      <div className="max-w-md">
        <h2 className="text-lg font-semibold mb-3">Positionsverteilung</h2>
        <PositionDistributionChart team={team} distribution={data?.distribution || []} />
      </div>

      {/* Form Curve */}
      {formHistory.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
          <h2 className="text-lg font-semibold mb-3">Formkurve (letzte 10)</h2>
          <div className="flex items-end gap-1 h-24">
            {formPoints.map((f, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${
                    f.points >= 3 ? 'bg-green-500' : f.points >= 1 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${f.height}%` }}
                />
                <span className="text-[10px] text-neutral-400">{f.points}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 mt-2">
            <span>älteste</span>
            <span>neueste</span>
          </div>
        </div>
      )}

      {/* xG/xGA Breakdown */}
      {(data?.xG !== undefined || data?.xGA !== undefined) && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
          <h2 className="text-lg font-semibold mb-3">xG Breakdown</h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.xG !== undefined && (
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Expected Goals (xG)</p>
                <p className="text-2xl font-bold">{data.xG.toFixed(1)}</p>
                {data.goalsFor !== undefined && (
                  <p className={`text-sm ${xgDelta! >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {xgDelta! >= 0 ? '+' : ''}{xgDelta!.toFixed(1)} vs. Tore
                  </p>
                )}
              </div>
            )}
            {data?.xGA !== undefined && (
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Expected Goals Against (xGA)</p>
                <p className="text-2xl font-bold">{data.xGA.toFixed(1)}</p>
                {data.goalsAgainst !== undefined && (
                  <p className={`text-sm ${xgaDelta! <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {xgaDelta! >= 0 ? '+' : ''}{xgaDelta!.toFixed(1)} vs. Gegentore
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Home/Away Split */}
      {data?.homePoints !== undefined && data?.awayPoints !== undefined && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
          <h2 className="text-lg font-semibold mb-3">Heim / Auswärts</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Heim</p>
              <p className="text-2xl font-bold">{data.homePoints}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Auswärts</p>
              <p className="text-2xl font-bold">{data.awayPoints}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}