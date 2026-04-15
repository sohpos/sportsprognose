'use client';
type TeamInsightCardProps = {
  team: { id: string; name: string }
  data: {
    xp: number
    distribution: number[]
    actualPoints?: number
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    form?: number[]
  }
  compact?: boolean
}

export function TeamInsightCard({ team, data, compact = false }: TeamInsightCardProps) {
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
    if (!form || form.length < 3) return null
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

  const Metric = ({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) => (
    <div className={`flex flex-col ${compact ? 'text-xs' : 'text-sm'}`}>
      <span className="text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{label}</span>
      <span className={`font-mono font-medium ${
        positive ? 'text-green-600 dark:text-green-400' : 
        negative ? 'text-red-500 dark:text-red-400' : 
        'text-neutral-700 dark:text-neutral-200'
      }`}>
        {value}
      </span>
    </div>
  )

  if (compact) {
    // Compact: single row, horizontal
    return (
      <div className="rounded-lg bg-white dark:bg-neutral-900 p-3 shadow flex items-center gap-4">
        <div className="font-semibold text-sm min-w-[100px]">{team.name}</div>
        <div className="flex gap-3 text-xs">
          <span className="text-neutral-500">xP: <span className="font-mono">{xp.toFixed(1)}</span></span>
          {delta !== null && (
            <span className={delta >= 0 ? "text-green-600" : "text-red-500"}>Δ: {delta >= 0 ? '+' : ''}{delta.toFixed(1)}</span>
          )}
          {luckFactor !== null && (
            <span className={luckFactor >= 0 ? "text-green-600" : "text-red-500"}>Luck: {luckFactor >= 0 ? '+' : ''}{luckFactor.toFixed(0)}%</span>
          )}
          {xgDelta !== null && (
            <span className={xgDelta >= 0 ? "text-green-600" : "text-red-500"}>xGΔ: {xgDelta >= 0 ? '+' : ''}{xgDelta.toFixed(1)}</span>
          )}
        </div>
      </div>
    )
  }

  // Full card
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base">{team.name}</h3>
        {actual !== null && (
          <span className={`text-lg font-bold ${(delta ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {actual} <span className="text-xs font-normal text-neutral-400">Pkt</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Metric label="Expected Points" value={xp.toFixed(1)} />
          {delta !== null && (
            <Metric 
              label="Delta" 
              value={`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`} 
              positive={delta >= 0} 
              negative={delta < 0} 
            />
          )}
          {luckFactor !== null && (
            <Metric 
              label="Luck Factor" 
              value={`${luckFactor >= 0 ? '+' : ''}${luckFactor.toFixed(0)}%`} 
              positive={luckFactor >= 0} 
              negative={luckFactor < 0} 
            />
          )}
        </div>

        <div className="space-y-3">
          {consistency !== null && (
            <Metric label="Consistency" value={consistency.toFixed(2)} />
          )}
          {volatility > 0 && (
            <Metric label="Volatility" value={`±${volatility.toFixed(1)}`} />
          )}
          {momentum !== null && (
            <Metric 
              label="Momentum" 
              value={`${momentum >= 0 ? '↑' : '↓'}${Math.abs(momentum).toFixed(1)}`} 
              positive={momentum >= 0} 
              negative={momentum < 0} 
            />
          )}
        </div>
      </div>

      {(xgDelta !== null || xgaDelta !== null) && (
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="grid grid-cols-2 gap-3">
            {xgDelta !== null && (
              <Metric 
                label="xG Delta (Off)" 
                value={`${xgDelta >= 0 ? '+' : ''}${xgDelta.toFixed(1)}`} 
                positive={xgDelta >= 0} 
                negative={xgDelta < 0} 
              />
            )}
            {xgaDelta !== null && (
              <Metric 
                label="xGA Delta (Def)" 
                value={`${xgaDelta >= 0 ? '+' : ''}${xgaDelta.toFixed(1)}`} 
                positive={xgaDelta < 0} 
                negative={xgaDelta >= 0} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Grid wrapper for multiple teams
type TeamInsightGridProps = {
  data: Record<string, {
    xp: number
    distribution: number[]
    actualPoints?: number
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    form?: number[]
  }>
  teams: { id: string; name: string }[]
  compact?: boolean
}

export function TeamInsightGrid({ data, teams, compact = false }: TeamInsightGridProps) {
  return (
    <div className={compact ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
      {teams.map((t) => (
        <TeamInsightCard key={t.id} team={t} data={data[t.id]} compact={compact} />
      ))}
    </div>
  )
}