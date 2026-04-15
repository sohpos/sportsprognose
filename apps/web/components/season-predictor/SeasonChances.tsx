type SeasonChancesProps = {
  data: any
  teams: { id: string; name: string }[]
}

export function SeasonChances({ data, teams }: SeasonChancesProps) {
  const champion = teams
    .map((t) => ({ name: t.name, value: data[t.id].first }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const relegation = teams
    .map((t) => ({ name: t.name, value: data[t.id].relegation }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Meisterschaft */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
        <h2 className="text-lg font-semibold mb-3">Meisterschafts-Chancen</h2>
        <div className="space-y-1 text-sm">
          {champion.map((t) => (
            <div key={t.name} className="flex justify-between">
              <span>{t.name}</span>
              <span className="font-mono">{(t.value / 1000).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Abstieg */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
        <h2 className="text-lg font-semibold mb-3">Abstiegs-Wahrscheinlichkeit</h2>
        <div className="space-y-1 text-sm">
          {relegation.map((t) => (
            <div key={t.name} className="flex justify-between">
              <span>{t.name}</span>
              <span className="font-mono">{(t.value / 1000).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}