type PositionDistributionChartProps = {
  team: { id: string; name: string; logo?: string }
  distribution: number[]
}

export function PositionDistributionChart({
  team,
  distribution,
}: PositionDistributionChartProps) {
  const total = 100_000
  const percentages = distribution.map((v) => (v / total) * 100)
  const max = Math.max(...percentages.filter(p => p > 0))

  const colorScale = (pct: number) => {
    if (max === 0) return 'rgba(59, 130, 246, 0.1)'
    const intensity = pct / max
    const start = [219, 234, 254]
    const end = [30, 64, 175]
    const r = Math.round(start[0] + (end[0] - start[0]) * intensity)
    const g = Math.round(start[1] + (end[1] - start[1]) * intensity)
    const b = Math.round(start[2] + (end[2] - start[2]) * intensity)
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="rounded-lg bg-white dark:bg-neutral-900 p-3 shadow-sm text-sm">
      <div className="flex items-center gap-2 mb-2">
        {team.logo && (
          <img src={team.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />
        )}
        <h3 className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{team.name}</h3>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
        {percentages.map((pct, i) => {
          if (pct < 0.5) return null // Hide negligible probabilities
          return (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="w-5 text-xs text-neutral-400 dark:text-neutral-500 text-right">
                {i + 1}.
              </span>

              <div className="flex-1 h-4 rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded transition-all group-hover:opacity-80"
                  style={{
                    width: max ? `${(pct / max) * 100}%` : '0%',
                    backgroundColor: colorScale(pct),
                  }}
                />
              </div>

              <span className="w-12 text-xs text-right font-mono text-neutral-600 dark:text-neutral-400">
                {pct.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}