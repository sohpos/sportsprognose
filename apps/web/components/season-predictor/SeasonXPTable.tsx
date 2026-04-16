type SeasonXPTableProps = {
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
  } | null>
  teams: { id: string; name: string; logo?: string }[]
}

// Utility function for formatting
const formatXP = (value: number): string => value.toFixed(2)
const formatPercent = (value: number): string => (value / 1000).toFixed(1) + '%'

export function SeasonXPTable({ data, teams }: SeasonXPTableProps) {
  if (!data) return null;
  const rows = teams.map((t) => ({
    id: t.id,
    name: t.name,
    logo: t.logo,
    xp: data[t.id]?.xp ?? 0,
    championProb: data[t.id]?.championProb ?? 0,
    relegationProb: data[t.id]?.relegationProb ?? 0,
  })).filter(r => r.xp >= 0)

  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-6 shadow text-center text-neutral-500">
        Keine Daten verfügbar
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg overflow-hidden" data-testid="xp-table">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-neutral-50 dark:bg-neutral-800 z-10 shadow-sm">
            <tr className="text-left text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
              <th className="py-3 px-3 w-10 font-bold text-center">#</th>
              <th className="py-3 px-3 font-bold min-w-[140px]">Team</th>
              <th className="py-3 px-3 font-bold w-16 text-right">xP</th>
              <th className="py-3 px-3 font-bold w-20 text-right">Meister</th>
              <th className="py-3 px-3 font-bold w-20 text-right">Abstieg</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {rows
              .sort((a, b) => b.xp - a.xp)
              .map((r, idx) => (
                <tr 
                  key={r.id} 
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {/* # - centered, bold */}
                  <td className="py-2.5 px-2 text-neutral-500 font-bold text-center w-10">
                    {idx + 1}
                  </td>
                  
                  {/* Team - with logo */}
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {r.logo && (
                        <img 
                          src={r.logo} 
                          alt={r.name} 
                          className="w-5 h-5 rounded-sm object-contain bg-neutral-100 dark:bg-neutral-700 flex-shrink-0"
                        />
                      )}
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {r.name}
                      </span>
                    </div>
                  </td>
                  
                  {/* xP - right aligned, 2 decimals */}
                  <td className="py-2.5 px-2 text-right font-mono text-neutral-700 dark:text-neutral-300 w-16">
                    {formatXP(r.xp)}
                  </td>
                  
                  {/* Meister % - right aligned, green */}
                  <td className="py-2.5 px-2 text-right font-mono text-green-600 dark:text-green-400 w-20">
                    {formatPercent(r.championProb)}
                  </td>
                  
                  {/* Abstieg % - right aligned, red */}
                  <td className="py-2.5 px-2 text-right font-mono text-red-500 dark:text-red-400 w-20">
                    {formatPercent(r.relegationProb)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}