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
  teams: { id: string; name: string }[]
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

  // Build team metrics
  const teamMetrics = teams.map((t) => {
    const d = data[t.id]
    const volatility = d?.distribution ? getVolatility(d.distribution) : 0
    const xp = d?.xp ?? 0
    const actual = d?.actualPoints
    const delta = actual !== undefined ? actual - xp : null
    const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
    const consistency = volatility > 0 ? 1 / volatility : null
    const xgDelta = (d?.goalsFor !== undefined && d?.xG !== undefined) ? d.goalsFor - d.xG : null
    const xgaDelta = (d?.goalsAgainst !== undefined && d?.xGA !== undefined) ? d.goalsAgainst - d.xGA : null
    const momentum = d?.form ? getMomentum(d.form) : null

    return { id: t.id, name: t.name, xp, actual, delta, luckFactor, volatility, consistency, xgDelta, xgaDelta, momentum, first: d?.distribution ? d.distribution[0] : 0 }
  })

  // Sort helpers
  const sortDesc = <T,>(arr: T[], key: keyof T) => [...arr].sort((a, b) => (b[key] as number) - (a[key] as number))
  const sortAsc = <T,>(arr: T[], key: keyof T) => [...arr].sort((a, b) => (a[key] as number) - (b[key] as number))

  const Section = ({ title, items, formatter, color }: { title: string; items: typeof teamMetrics; formatter: (t: typeof teamMetrics[0]) => string; color?: 'green' | 'red' | 'neutral' }) => {
    if (!items || items.length === 0) return null
    return (
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
        <h3 className="font-semibold mb-3 text-sm">{title}</h3>
        <ul className="space-y-1 text-sm">
          {items.slice(0, 3).map((t, i) => (
            <li key={t.id} className="flex justify-between items-center">
              <span className="text-neutral-700 dark:text-neutral-200">
                <span className="text-neutral-400 mr-1">{i + 1}.</span>
                {t.name}
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Section
        title="Überperformer (Δ-Points)"
        items={sortDesc(teamMetrics.filter(t => t.delta !== null), 'delta' as keyof typeof teamMetrics[0])}
        formatter={(t) => `+${t.delta!.toFixed(1)}`}
        color="green"
      />

      <Section
        title="Underperformer (Δ-Points)"
        items={sortAsc(teamMetrics.filter(t => t.delta !== null), 'delta' as keyof typeof teamMetrics[0])}
        formatter={(t) => t.delta!.toFixed(1)}
        color="red"
      />

      <Section
        title="Glücksfaktoren (Luck)"
        items={sortDesc(teamMetrics.filter(t => t.luckFactor !== null), 'luckFactor' as keyof typeof teamMetrics[0])}
        formatter={(t) => `+${t.luckFactor!.toFixed(0)}%`}
        color="green"
      />

      <Section
        title="Pechvögel (Luck)"
        items={sortAsc(teamMetrics.filter(t => t.luckFactor !== null), 'luckFactor' as keyof typeof teamMetrics[0])}
        formatter={(t) => `${t.luckFactor!.toFixed(0)}%`}
        color="red"
      />

      <Section
        title="Stabilste Teams (Consistency)"
        items={sortDesc(teamMetrics.filter(t => t.consistency !== null), 'consistency' as keyof typeof teamMetrics[0])}
        formatter={(t) => t.consistency!.toFixed(2)}
      />

      <Section
        title="Volatilste Teams"
        items={sortDesc(teamMetrics.filter(t => t.volatility > 0), 'volatility' as keyof typeof teamMetrics[0])}
        formatter={(t) => `±${t.volatility.toFixed(1)}`}
      />

      <Section
        title="Effizienteste Offensiven (xGΔ)"
        items={sortDesc(teamMetrics.filter(t => t.xgDelta !== null), 'xgDelta' as keyof typeof teamMetrics[0])}
        formatter={(t) => `+${t.xgDelta!.toFixed(1)}`}
        color="green"
      />

      <Section
        title="Ineffizienteste Offensiven (xGΔ)"
        items={sortAsc(teamMetrics.filter(t => t.xgDelta !== null), 'xgDelta' as keyof typeof teamMetrics[0])}
        formatter={(t) => t.xgDelta!.toFixed(1)}
        color="red"
      />

      <Section
        title="Heißeste Teams (Momentum)"
        items={sortDesc(teamMetrics.filter(t => t.momentum !== null), 'momentum' as keyof typeof teamMetrics[0])}
        formatter={(t) => `+${t.momentum!.toFixed(2)}`}
        color="green"
      />

      <Section
        title="Abkühlende Teams (Momentum)"
        items={sortAsc(teamMetrics.filter(t => t.momentum !== null), 'momentum' as keyof typeof teamMetrics[0])}
        formatter={(t) => t.momentum!.toFixed(2)}
        color="red"
      />

      <Section
        title="Beste Defensive (xGAΔ)"
        items={sortAsc(teamMetrics.filter(t => t.xgaDelta !== null), 'xgaDelta' as keyof typeof teamMetrics[0])}
        formatter={(t) => t.xgaDelta!.toFixed(1)}
        color="green"
      />

      <Section
        title="Schwächste Defensive (xGAΔ)"
        items={sortDesc(teamMetrics.filter(t => t.xgaDelta !== null), 'xgaDelta' as keyof typeof teamMetrics[0])}
        formatter={(t) => `+${t.xgaDelta!.toFixed(1)}`}
        color="red"
      />
    </div>
  )
}