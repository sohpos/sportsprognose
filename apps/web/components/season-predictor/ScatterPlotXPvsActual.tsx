type ScatterPlotProps = {
  teams: { id: string; name: string }[]
  data: Record<string, { xp: number; actualPoints: number; surprise: number }>
}

export function ScatterPlotXPvsActual({ teams, data }: ScatterPlotProps) {
  const points = teams.map(t => ({
    id: t.id,
    name: t.name,
    xp: data[t.id].xp,
    actual: data[t.id].actualPoints,
    surprise: data[t.id].surprise,
  }))

  const maxXP = Math.max(...points.map(p => p.xp))
  const maxActual = Math.max(...points.map(p => p.actual))
  const maxVal = Math.max(maxXP, maxActual)

  const size = 320
  const padding = 32

  const scaleX = (v: number) => (v / maxVal) * (size - padding * 2) + padding
  const scaleY = (v: number) =>
    size - padding - (v / maxVal) * (size - padding * 2)

  // Quadrant helper
  const getQuadrant = (xp: number, actual: number) => {
    if (actual >= xp && xp >= maxVal / 2) return 'efficient'
    if (actual >= xp && xp < maxVal / 2) return 'lucky'
    if (actual < xp && xp >= maxVal / 2) return 'unlucky'
    return 'inefficient'
  }

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
      <h3 className="font-semibold mb-3">xP vs Actual Points</h3>

      <svg width={size} height={size} className="overflow-visible">
        {/* Quadrant backgrounds (transparent zones) */}
        {/* Above diagonal zone (Good & Lucky) */}
        <defs>
          <linearGradient id="quadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Background zones */}
        <rect x={padding} y={padding} width={size - padding * 2} height={size - padding * 2} fill="transparent" />

        {/* Quadrant labels (subtle) */}
        <text x={size - padding - 20} y={padding + 20} className="text-[10px] fill-green-600 dark:fill-green-400 opacity-60">Good & Efficient</text>
        <text x={padding + 5} y={padding + 20} className="text-[10px] fill-blue-600 dark:fill-blue-400 opacity-60">Lucky</text>
        <text x={size - padding - 30} y={size - padding - 5} className="text-[10px] fill-orange-600 dark:fill-orange-400 opacity-60">Unlucky</text>
        <text x={padding + 5} y={size - padding - 5} className="text-[10px] fill-red-600 dark:fill-red-400 opacity-60">Bad</text>

        {/* Achsen */}
        <line
          x1={padding}
          y1={size - padding}
          x2={size - padding}
          y2={size - padding}
          stroke="#aaa"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={size - padding}
          stroke="#aaa"
          strokeWidth="1"
        />

        {/* 1:1 Diagonale */}
        <line
          x1={padding}
          y1={scaleY(0)}
          x2={scaleX(maxVal)}
          y2={scaleY(maxVal)}
          stroke="#3b82f6"
          strokeDasharray="4 4"
          strokeWidth="1.5"
        />

        {/* Punkte */}
        {points.map(p => {
          const quad = getQuadrant(p.xp, p.actual)
          const color = quad === 'efficient' ? '#16a34a' 
            : quad === 'lucky' ? '#2563eb' 
            : quad === 'unlucky' ? '#ea580c' 
            : '#dc2626'
          return (
            <g key={p.id}>
              <circle
                cx={scaleX(p.xp)}
                cy={scaleY(p.actual)}
                r={8}
                fill={color}
                opacity="0.15"
                className="transition-all"
              />
              <circle
                cx={scaleX(p.xp)}
                cy={scaleY(p.actual)}
                r={5}
                fill={color}
                className="transition-all hover:scale-150 cursor-pointer"
              >
                <title>
                  {p.name}
                  {"\n"}xP: {p.xp.toFixed(1)}
                  {"\n"}Actual: {p.actual}
                  {"\n"}Δ: {p.surprise.toFixed(1)}
                  {"\n"}Type: {quad === 'efficient' ? 'Good & Efficient' : quad === 'lucky' ? 'Lucky' : quad === 'unlucky' ? 'Unlucky' : 'Bad & Inefficient'}
                </title>
              </circle>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-neutral-600 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-600" /> Good & Efficient
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600" /> Lucky
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-600" /> Unlucky
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-600" /> Bad
        </span>
      </div>
    </div>
  )
}