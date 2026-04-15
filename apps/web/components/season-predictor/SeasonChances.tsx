type SeasonChancesProps = {
  data: Record<string, {
    xp: number
    first: number
    relegation: number
    distribution: number[]
  }>
  teams: { id: string; name: string; logo?: string }[]
}

export function SeasonChances({ data, teams }: SeasonChancesProps) {
  const champion = teams
    .map((t) => ({ 
      id: t.id,
      name: t.name, 
      logo: t.logo,
      value: data[t.id]?.first ?? 0 
    }))
    .filter(t => t.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const relegation = teams
    .map((t) => ({ 
      id: t.id,
      name: t.name,
      logo: t.logo,
      value: data[t.id]?.relegation ?? 0 
    }))
    .filter(t => t.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Meisterschaft */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-sm">
        <h2 className="text-base font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Meisterschafts-Chancen</h2>
        <div className="space-y-2 text-sm">
          {champion.map((t, i) => (
            <div key={t.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <span className="w-5 text-xs text-neutral-400 font-medium">{i + 1}.</span>
                {t.logo && (
                  <img src={t.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />
                )}
                <span className="text-neutral-700 dark:text-neutral-300">{t.name}</span>
              </div>
              <span className="font-mono text-green-600 dark:text-green-400 text-sm">
                {(t.value / 1000).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Abstieg */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-sm">
        <h2 className="text-base font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Abstiegs-Wahrscheinlichkeit</h2>
        <div className="space-y-2 text-sm">
          {relegation.map((t, i) => (
            <div key={t.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <span className="w-5 text-xs text-neutral-400 font-medium">{i + 1}.</span>
                {t.logo && (
                  <img src={t.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />
                )}
                <span className="text-neutral-700 dark:text-neutral-300">{t.name}</span>
              </div>
              <span className="font-mono text-red-500 dark:text-red-400 text-sm">
                {(t.value / 1000).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}