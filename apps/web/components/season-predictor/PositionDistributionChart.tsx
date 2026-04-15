type PositionDistributionChartProps = {
  team: { id: string; name: string }
  distribution: number[] // absolute counts from 100k simulations
}

export function PositionDistributionChart({
  team,
  distribution,
}: PositionDistributionChartProps) {
  const total = 100_000
  const percentages = distribution.map((v) => (v / total) * 100)
  const max = Math.max(...percentages)

  // Farbskala: 0% → #dbeafe (hellblau), 100% → #1e40af (dunkelblau)
  const colorScale = (pct: number) => {
    const intensity = pct / max // 0 → 1
    const start = [219, 234, 254] // #dbeafe
    const end = [30, 64, 175]     // #1e40af

    const r = Math.round(start[0] + (end[0] - start[0]) * intensity)
    const g = Math.round(start[1] + (end[1] - start[1]) * intensity)
    const b = Math.round(start[2] + (end[2] - start[2]) * intensity)

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow text-sm">
      <h3 className="font-semibold mb-2">{team.name}</h3>

      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {percentages.map((pct, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Tabellenplatz */}
            <span className="w-6 text-xs text-neutral-500 dark:text-neutral-400">
              {i + 1}
            </span>

            {/* Balken */}
            <div className="flex-1 h-3 rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-3 rounded transition-all"
                style={{
                  width: max ? `${(pct / max) * 100}%` : "0%",
                  backgroundColor: colorScale(pct),
                }}
              />
            </div>

            {/* Prozentwert */}
            <span className="w-12 text-xs text-right font-mono">
              {pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}