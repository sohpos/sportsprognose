'use client';
type SurpriseIndexProps = {
  data: Record<string, {
    xp: number
    distribution: number[]
    actualPoints?: number
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    homePoints?: number
    awayPoints?: number
    form?: number[]
  }>
  teams: { id: string; name: string }[]
}

export function SurpriseIndex({ data, teams }: SurpriseIndexProps) {
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

  const rows = teams.map((t) => {
    const d = data[t.id]
    const volatility = d?.distribution ? getVolatility(d.distribution) : 0
    const actual = d?.actualPoints
    const xp = d?.xp ?? 0
    const delta = actual !== undefined ? actual - xp : null
    const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
    const consistency = volatility > 0 ? 1 / volatility : null
    const xgDelta = (d?.goalsFor !== undefined && d?.xG !== undefined) ? d.goalsFor - d.xG : null
    const xgaDelta = (d?.goalsAgainst !== undefined && d?.xGA !== undefined) ? d.goalsAgainst - d.xGA : null
    const momentum = d?.form ? getMomentum(d.form) : null

    return { id: t.id, name: t.name, xp, actual, delta, luckFactor, volatility, consistency, xgDelta, xgaDelta, momentum }
  })

  const byLuck = [...rows].filter(r => r.luckFactor !== null).sort((a, b) => (b.luckFactor ?? 0) - (a.luckFactor ?? 0))
  const byConsistency = [...rows].filter(r => r.consistency !== null).sort((a, b) => (b.consistency ?? 0) - (a.consistency ?? 0))
  const byXG = [...rows].filter(r => r.xgDelta !== null).sort((a, b) => (b.xgDelta ?? 0) - (a.xgDelta ?? 0))
  const byMomentum = [...rows].filter(r => r.momentum !== null).sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0))

  const renderCard = (title: string, subtitle: string, items: typeof rows, key: 'luckFactor' | 'consistency' | 'xgDelta' | 'momentum') => (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{subtitle}</p>
      <div className="space-y-1">
        {items.slice(0, 6).map((r) => {
          const val = r[key]
          if (val === null || val === undefined) return null
          const isPositive = Number(val) >= 0
          const display = key === 'luckFactor' ? `${isPositive ? '+' : ''}${Number(val).toFixed(1)}%` 
            : key === 'momentum' ? `${isPositive ? '↑' : '↓'}${Math.abs(Number(val)).toFixed(2)}`
            : `${isPositive ? '+' : ''}${Number(val).toFixed(2)}`
          return (
            <div key={r.id} className="flex justify-between text-xs">
              <span>{r.name}</span>
              <span className={isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>{display}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Mobile/Default: 4-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderCard("Luck Factor", "Δ-Points als % vom xP — + = Glück, - = Pech", byLuck, 'luckFactor')}
        {renderCard("Consistency", "1/Volatility — höher = stabiler", byConsistency, 'consistency')}
        {renderCard("xG Delta (Offense)", "Tore - xG — + = effizient", byXG, 'xgDelta')}
        {renderCard("Momentum", "Form-Trend (letzte 3 vs. vorherige 2)", byMomentum, 'momentum')}
      </div>

      {/* Desktop Only: Full Table */}
      <div className="hidden md:block rounded-xl bg-white dark:bg-neutral-900 p-4 shadow overflow-x-auto">
        <h3 className="text-sm font-semibold mb-3">Vollständige Analyse</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <th className="py-2 pr-2">Team</th>
              <th className="py-2 pr-2">Punkte</th>
              <th className="py-2 pr-2">xP</th>
              <th className="py-2 pr-2">Δ</th>
              <th className="py-2 pr-2">Luck %</th>
              <th className="py-2 pr-2">Volatility</th>
              <th className="py-2 pr-2">Consistency</th>
              <th className="py-2 pr-2">xGΔ</th>
              <th className="py-2 pr-2">xGAΔ</th>
              <th className="py-2">Momentum</th>
            </tr>
          </thead>
          <tbody>
            {[...rows].sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0)).map((r) => (
              <tr key={r.id} className="border-t border-neutral-100 dark:border-neutral-800">
                <td className="py-2 pr-2 font-medium">{r.name}</td>
                <td className="py-2 pr-2">{r.actual ?? '-'}</td>
                <td className="py-2 pr-2">{r.xp.toFixed(1)}</td>
                <td className={`py-2 pr-2 ${(r.delta ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {r.delta !== null ? `${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(1)}` : '-'}
                </td>
                <td className={`py-2 pr-2 ${(r.luckFactor ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {r.luckFactor !== null ? `${r.luckFactor >= 0 ? '+' : ''}${r.luckFactor.toFixed(1)}%` : '-'}
                </td>
                <td className="py-2 pr-2 font-mono text-xs text-neutral-500">{r.volatility.toFixed(2)}</td>
                <td className="py-2 pr-2 font-mono text-xs">{r.consistency ? r.consistency.toFixed(2) : '-'}</td>
                <td className={`py-2 pr-2 font-mono text-xs ${(r.xgDelta ?? 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {r.xgDelta !== null ? `${r.xgDelta >= 0 ? '+' : ''}${r.xgDelta.toFixed(1)}` : '-'}
                </td>
                <td className={`py-2 pr-2 font-mono text-xs ${(r.xgaDelta ?? 0) >= 0 ? "text-red-500" : "text-green-600"}`}>
                  {r.xgaDelta !== null ? `${r.xgaDelta >= 0 ? '+' : ''}${r.xgaDelta.toFixed(1)}` : '-'}
                </td>
                <td className={`py-2 ${(r.momentum ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {r.momentum !== null ? `${r.momentum >= 0 ? '↑' : '↓'}${Math.abs(r.momentum).toFixed(2)}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}