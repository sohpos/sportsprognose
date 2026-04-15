type SeasonXPTableProps = {
  data: any
  teams: { id: string; name: string }[]
}

export function SeasonXPTable({ data, teams }: SeasonXPTableProps) {
  const rows = teams.map((t) => ({
    id: t.id,
    name: t.name,
    xp: data[t.id].xp,
    first: data[t.id].first,
    relegation: data[t.id].relegation,
  }))

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow" data-testid="xp-table">
      <h2 className="text-lg font-semibold mb-3">Expected Points (xP)</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500 dark:text-neutral-400">
            <th className="py-1">#</th>
            <th className="py-1">Team</th>
            <th className="py-1">xP</th>
            <th className="py-1">Meister (%)</th>
            <th className="py-1">Abstieg (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows
            .sort((a, b) => b.xp - a.xp)
            .map((r, idx) => (
              <tr
                key={r.id}
                className="border-t border-neutral-200 dark:border-neutral-800"
              >
                <td className="py-1 pr-2 text-neutral-500 dark:text-neutral-400">
                  {idx + 1}
                </td>
                <td className="py-1">{r.name}</td>
                <td className="py-1">{r.xp.toFixed(2)}</td>
                <td className="py-1">{(r.first / 1000).toFixed(1)}</td>
                <td className="py-1">{(r.relegation / 1000).toFixed(1)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}