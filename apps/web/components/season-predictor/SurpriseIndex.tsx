type SurpriseIndexProps = {
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
  teams: { id: string; name: string; logo?: string }[]
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
    if (!form || form.length < 3) return 0
    const recent = form.slice(-3)
    const earlier = form.slice(-5, -3)
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const earlierAvg = earlier.length > 0 ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg
    return recentAvg - earlierAvg
  }

  const rows = teams.filter(t => data[t.id]?.xp > 0).map((t) => {
    const d = data[t.id]
    const volatility = d?.distribution ? getVolatility(d.distribution) : 0
    const xp = d?.xp ?? 0
    const actual = d?.actualPoints
    const delta = actual !== undefined ? actual - xp : null
    const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
    const consistency = volatility > 0 ? (1 / volatility) : null
    const xgDelta = (d?.goalsFor !== undefined && d?.xG !== undefined) ? d.goalsFor - d.xG : null
    const momentum = d?.form ? getMomentum(d.form) : null
    return { id: t.id, name: t.name, logo: t.logo, delta, luckFactor, consistency, xgDelta, momentum }
  })

  const byLuck = rows.filter(r => r.luckFactor !== null).sort((a, b) => (b.luckFactor ?? 0) - (a.luckFactor ?? 0))
  const byConsistency = rows.filter(r => r.consistency !== null).sort((a, b) => (b.consistency ?? 0) - (a.consistency ?? 0))
  const byXG = rows.filter(r => r.xgDelta !== null).sort((a, b) => (b.xgDelta ?? 0) - (a.xgDelta ?? 0))
  const byMomentum = rows.filter(r => r.momentum !== null).sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0))

  const Card = ({ title, subtitle, items, getValue, color }: { 
    title: string, subtitle: string, items: typeof rows, 
    getValue: (r: typeof rows[0]) => string, color?: boolean 
  }) => (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
      <h3 className="font-bold text-sm mb-1 text-neutral-800 dark:text-neutral-200">{title}</h3>
      <p className="text-xs text-neutral-500 mb-3">{subtitle}</p>
      <div className="space-y-1.5">
        {items.slice(0, 5).map((r) => {
          const val = getValue(r)
          const isPositive = r.luckFactor !== null ? r.luckFactor >= 0 : r.momentum !== null ? r.momentum >= 0 : r.xgDelta !== null ? r.xgDelta >= 0 : true
          return (
            <div key={r.id} className="flex justify-between text-xs group hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded px-1 py-0.5 -mx-1">
              <div className="flex items-center gap-1.5 min-w-0">
                {r.logo && <img src={r.logo} alt="" className="w-3 h-3 rounded-sm object-contain flex-shrink-0" />}
                <span className="text-neutral-700 dark:text-neutral-300 truncate">{r.name}</span>
              </div>
              <span className={`font-mono font-medium ${color && isPositive ? 'text-green-600 dark:text-green-400' : color && !isPositive ? 'text-red-500 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {val}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Luck Factor" subtitle="Δ-Points als % vom xP" items={byLuck} getValue={(r) => r.luckFactor !== null ? `${r.luckFactor >= 0 ? '+' : ''}${r.luckFactor.toFixed(1)}%` : '-'} color />
      <Card title="Consistency" subtitle="1/Volatility – höher = stabiler" items={byConsistency} getValue={(r) => r.consistency ? r.consistency.toFixed(2) : '-'} />
      <Card title="xG Delta (Offense)" subtitle="Tore - xG" items={byXG} getValue={(r) => r.xgDelta !== null ? `${r.xgDelta >= 0 ? '+' : ''}${r.xgDelta.toFixed(1)}` : '-'} color />
      <Card title="Momentum" subtitle="Form-Trend (letzte 3)" items={byMomentum} getValue={(r) => r.momentum !== null ? `${r.momentum >= 0 ? '↑' : '↓'}${Math.abs(r.momentum).toFixed(2)}` : '-'} color />
    </div>
  )
}