type TeamSummaryGridProps = {
  data: any
  teams: { id: string; name: string }[]
}

export function TeamSummaryGrid({ data, teams }: TeamSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {teams.map((t) => {
        const d = data[t.id]
        return (
          <div
            key={t.id}
            className="rounded-xl bg-white dark:bg-neutral-900 p-3 shadow text-xs"
          >
            <h3 className="font-semibold mb-1 text-sm">{t.name}</h3>

            <p className="text-neutral-500 dark:text-neutral-400">
              xP: <span className="font-mono">{d.xp.toFixed(2)}</span>
            </p>

            <p className="text-neutral-500 dark:text-neutral-400">
              Meister:{" "}
              <span className="font-mono">{(d.first / 1000).toFixed(1)}%</span>
            </p>

            <p className="text-neutral-500 dark:text-neutral-400">
              Abstieg:{" "}
              <span className="font-mono">
                {(d.relegation / 1000).toFixed(1)}%
              </span>
            </p>
          </div>
        )
      })}
    </div>
  )
}