type TeamSummaryGridProps = {
  data: Record<string, {
    xp: number
    first: number
    relegation: number
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
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {teams.map((t) => {
        const d = data[t.id]
        if (!d) return null
        
        const delta = d.actualPoints !== undefined ? d.actualPoints - d.xp : null
        
        return (
          <div
            key={t.id}
            className="rounded-lg bg-white dark:bg-neutral-900 p-3 shadow-sm text-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-1.5 mb-2">
              {t.logo && (
                <img src={t.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />
              )}
              <h3 className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{t.name}</h3>
            </div>
            
            <div className="space-y-1">
              <p className="text-neutral-500 dark:text-neutral-400">
                xP: <span className="font-mono text-neutral-700 dark:text-neutral-300">{d.xp.toFixed(1)}</span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Meister: <span className="font-mono text-green-600 dark:text-green-400">{(d.first / 1000).toFixed(1)}%</span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Abstieg: <span className="font-mono text-red-500 dark:text-red-400">{(d.relegation / 1000).toFixed(1)}%</span>
              </p>
              {delta !== null && (
                <p className={`font-mono ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
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