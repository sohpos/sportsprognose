'use client';

type TeamInsightCardProps = {
  team: { id: string; name: string; logo?: string }
  data: {
    xp: number
    distribution: number[]
    actualPoints?: number
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    form?: number[]
  }
  compact?: boolean
}

export function TeamInsightCard({ team, data, compact = false }: TeamInsightCardProps) {
  const volatility = data?.distribution ? Math.sqrt(
    data.distribution.reduce((sum, count, pos) => {
      const total = data.distribution.reduce((a, b) => a + b, 0)
      const prob = count / total
      const mean = data.distribution.reduce((s, c, i) => s + c * (i + 1), 0) / total
      return sum + prob * Math.pow(pos + 1 - mean, 2)
    }, 0)
  ) : 0

  const xp = data?.xp ?? 0
  const actual = data?.actualPoints
  const delta = actual !== undefined ? actual - xp : null
  const luckFactor = xp > 0 && delta !== null ? (delta / xp) * 100 : null
  const consistency = volatility > 0 ? (1 / volatility) : null

  const Metric = ({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) => (
    <div className={`flex flex-col ${compact ? 'text-xs' : 'text-sm'}`}>
      <span className="text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{label}</span>
      <span className={`font-mono font-medium ${
        positive ? 'text-green-600 dark:text-green-400' : 
        negative ? 'text-red-500 dark:text-red-400' : 
        'text-neutral-700 dark:text-neutral-300'
      }`}>
        {value}
      </span>
    </div>
  )

  if (compact) {
    return (
      <div className="rounded-lg bg-white dark:bg-neutral-900 p-2 shadow flex items-center gap-3 hover:shadow-md transition-shadow">
        {team.logo && <img src={team.logo} alt="" className="w-5 h-5 rounded-sm object-contain" />}
        <div className="flex gap-3 text-xs min-w-0">
          <span className="text-neutral-500">xP: <span className="font-mono font-medium">{xp.toFixed(1)}</span></span>
          {delta !== null && <span className={delta >= 0 ? "text-green-600" : "text-red-500"}>Δ: {delta >= 0 ? '+' : ''}{delta.toFixed(1)}</span>}
          {luckFactor !== null && <span className={luckFactor >= 0 ? "text-green-600" : "text-red-500"}>Luck: {luckFactor >= 0 ? '+' : ''}{luckFactor.toFixed(0)}%</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {team.logo && <img src={team.logo} alt="" className="w-6 h-6 rounded-sm object-contain" />}
          <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-200">{team.name}</h3>
        </div>
        {actual !== null && (
          <span className={`text-xl font-bold ${(delta ?? 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {actual} <span className="text-xs font-normal text-neutral-400">Pkt</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Metric label="Expected Points" value={xp.toFixed(1)} />
          {delta !== null && Metric(label="Delta" value={`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`} positive={delta >= 0} negative={delta < 0} />
          {luckFactor !== null && Metric(label="Luck Factor" value={`${luckFactor >= 0 ? '+' : ''}${luckFactor.toFixed(0)}%`} positive={luckFactor >= 0} negative={luckFactor < 0} />
        </div>
        <div className="space-y-3">
          {consistency !== null && Metric(label="Consistency" value={consistency.toFixed(2)})}
          {volatility > 0 && Metric(label="Volatility" value={`±${volatility.toFixed(1)}`} />}
        </div>
      </div>
    </div>
  )
}

type TeamInsightGridProps = {
  data: Record<string, any>
  teams: { id: string; name: string; logo?: string }[]
  compact?: boolean
}

export function TeamInsightGrid({ data, teams, compact = false }: TeamInsightGridProps) {
  return (
    <div className={compact ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
      {teams.filter(t => data[t.id]?.xp > 0).map((t) => (
        <TeamInsightCard key={t.id} team={t} data={data[t.id]} compact={compact} />
      ))}
    </div>
  )
}