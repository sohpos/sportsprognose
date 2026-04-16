type TeamSummaryGridProps = {
  data: Record<string, {
    xp: number
    championProb: number
    relegationProb: number
    distribution: number[]
    actualPoints?: number
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    form?: number[]
    homePoints?: number
    awayPoints?: number
  }>
  teams: { id: string; name: string; logo?: string }[]
}

export function TeamSummaryGrid({ data, teams }: TeamSummaryGridProps) {
  const rows = teams.filter(t => data[t.id]?.xp >= 0 || !data[t.id])
  
  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-6 shadow text-center text-neutral-500">
        Keine Daten verfügbar
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {rows.map((t) => {
        const d = data[t.id]
        if (!d) return null
        
        const delta = d.actualPoints !== undefined ? d.actualPoints - d.xp : null
        
        return (
          <div
            key={t.id}
            className="rounded-lg bg-white dark:bg-neutral-900 p-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
          >
            {/* Team header with logo */}
            <div className="flex items-center gap-1.5 mb-2 min-w-0">
              {t.logo && (
                <img src={t.logo} alt="" className="w-4 h-4 rounded-sm object-contain flex-shrink-0" />
              )}
              <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 truncate">
                {t.name}
              </h3>
            </div>
            
            {/* Stats */}
            <div className="space-y-1 text-xs">
              <p className="text-neutral-500 dark:text-neutral-400">
                xP: <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">{d.xp.toFixed(1)}</span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Meister: <span className="font-mono text-green-600 dark:text-green-400 font-medium">{(d.championProb / 1000).toFixed(1)}%</span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Abstieg: <span className="font-mono text-red-500 dark:text-red-400 font-medium">{(d.relegationProb / 1000).toFixed(1)}%</span>
              </p>
              {delta !== null && (
                <p className={`font-mono font-medium ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  Δ {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}