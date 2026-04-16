type LeagueInsightsPanelProps = {
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

export function LeagueInsightsPanel({ data, teams }: LeagueInsightsPanelProps) {
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

  const rows = teams.filter(t => data[t.id]?.xp >= 0 || !data[t.id]).map((t) => {
    const d = data[t.id]
    const volatility = d?.distribution ? getVolatility(d.distribution) : 0
    const xp = d?.xp ?? 0
    const actual = d?.actualPoints
    const delta = actual !== undefined ? actual - xp : null
    const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
    const inverseVol = 1.0 / volatility
  const consistency = volatility > 0 ? inverseVol : null
    const xgDelta = (d?.goalsFor !== undefined && d?.xG !== undefined) ? d.goalsFor - d.xG : null
    const xgaDelta = (d?.goalsAgainst !== undefined && d?.xGA !== undefined) ? d.goalsAgainst - d.xGA : null
    const momentum = d?.form ? getMomentum(d.form) : null
    return { id: t.id, name: t.name, logo: t.logo, delta, luckFactor, volatility, consistency, xgDelta, xgaDelta, momentum }
  })

  const sortDesc = <T,>(arr: T[], key: keyof T) => [...arr].sort((a, b) => (b[key] as number) - (a[key] as number))
  const sortAsc = <T,>(arr: T[], key: keyof T) => [...arr].sort((a, b) => (a[key] as number) - (b[key] as number))

  const Section = ({ title, items, formatter, color }: { title: string, items: typeof rows, formatter: (t: typeof rows[0]) => string, color?: 'green' | 'red' }) => {
    if (!items || items.length === 0) return null
    return (
      <div className="rounded-lg bg-white dark:bg-neutral-900 p-3 shadow">
        <h3 className="font-bold text-xs mb-2 text-neutral-700 dark:text-neutral-300">{title}</h3>
        <ul className="space-y-1 text-xs">
          {items.slice(0, 3).map((t, i) => (
            <li key={t.id} className="flex justify-between items-center group hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded px-1 -mx-1">
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="text-neutral-400 w-3">{i + 1}.</span>
                {t.logo && <img src={t.logo} alt="" className="w-3 h-3 rounded-sm object-contain flex-shrink-0" />}
                <span className="text-neutral-600 dark:text-neutral-400 truncate">{t.name}</span>
              </span>
              <span className={`font-mono text-xs ${
                color === 'green' ? 'text-green-600 dark:text-green-400' :
                color === 'red' ? 'text-red-500 dark:text-red-400' :
                'text-neutral-500'
              }`}>
                {formatter(t)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <Section title="Überperformer" items={sortDesc(rows.filter(t => t.delta !== null), 'delta' as keyof typeof rows[0])} formatter={(t) => `+${t.delta!.toFixed(1)}`} color="green" />
      <Section title="Underperformer" items={sortAsc(rows.filter(t => t.delta !== null), 'delta' as keyof typeof rows[0])} formatter={(t) => t.delta!.toFixed(1)} color="red" />
      <Section title="Glücksfaktor" items={sortDesc(rows.filter(t => t.luckFactor !== null), 'luckFactor' as keyof typeof rows[0])} formatter={(t) => `+${t.luckFactor!.toFixed(0)}%`} color="green" />
      <Section title="Pechvögel" items={sortAsc(rows.filter(t => t.luckFactor !== null), 'luckFactor' as keyof typeof rows[0])} formatter={(t) => `${t.luckFactor!.toFixed(0)}%`} color="red" />
      <Section title="Stabilste" items={sortDesc(rows.filter(t => t.consistency !== null), 'consistency' as keyof typeof rows[0])} formatter={(t) => t.consistency!.toFixed(2)} />
      <Section title="Volatilste" items={sortDesc(rows.filter(t => t.volatility > 0), 'volatility' as keyof typeof rows[0])} formatter={(t) => `±${t.volatility.toFixed(1)}`} />
      <Section title="xG Offense" items={sortDesc(rows.filter(t => t.xgDelta !== null), 'xgDelta' as keyof typeof rows[0])} formatter={(t) => `+${t.xgDelta!.toFixed(1)}`} color="green" />
      <Section title="xG Defense" items={sortAsc(rows.filter(t => t.xgaDelta !== null), 'xgaDelta' as keyof typeof rows[0])} formatter={(t) => t.xgaDelta!.toFixed(1)} color="green" />
      <Section title="Momentum ↑" items={sortDesc(rows.filter(t => t.momentum !== null), 'momentum' as keyof typeof rows[0])} formatter={(t) => `+${t.momentum!.toFixed(2)}`} color="green" />
      <Section title="Momentum ↓" items={sortAsc(rows.filter(t => t.momentum !== null), 'momentum' as keyof typeof rows[0])} formatter={(t) => t.momentum!.toFixed(2)} color="red" />
    </div>
  )
}