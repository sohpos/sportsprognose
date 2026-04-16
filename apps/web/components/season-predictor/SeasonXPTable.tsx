type SeasonXPTableProps = {
  data: Record<string, {
    xp: number
    first: number
    relegation: number
    distribution: number[]
  }>
  teams: { id: string; name: string; logo?: string }[]
}

export function SeasonXPTable({ data, teams }: SeasonXPTableProps) {
  const rows = teams.map((t) => ({
    id: t.id,
    name: t.name,
    logo: t.logo,
    xp: data[t.id]?.xp ?? 0,
    first: data[t.id]?.first ?? 0,
    relegation: data[t.id]?.relegation ?? 0,
  }))

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow overflow-hidden" data-testid="xp-table">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white dark:bg-neutral-900 z-10 shadow-sm">
            <tr className="text-left text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
              <th className="py-3 px-3 w-10 font-semibold">#</th>
              <th className="py-3 px-3 font-semibold">Team</th>
              <th className="py-3 px-3 font-semibold w-16 text-right">xP</th>
              <th className="py-3 px-3 font-semibold w-20 text-right">Meister</th>
              <th className="py-3 px-3 font-semibold w-20 text-right">Abstieg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {rows
              .sort((a, b) => b.xp - a.xp)
              .map((r, idx) => (
                <tr 
                  key={r.id} 
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <td className="py-2 px-2 text-neutral-400 font-medium text-center w-10">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {r.logo && (
                        <img 
                          src={r.logo} 
                          alt={r.name} 
                          className="w-4 h-4 rounded-sm object-contain bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                        />
                      )}
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {r.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-neutral-700 dark:text-neutral-300 w-16">
                    {r.xp.toFixed(1)}
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-green-600 dark:text-green-400 w-20">
                    {(r.first / 1000).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-red-500 dark:text-red-400 w-20">
                    {(r.relegation / 1000).toFixed(1)}%
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}