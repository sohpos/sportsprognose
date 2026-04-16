'use client';

type ScatterPlotProps = {
  teams: { id: string; name: string; logo?: string }[];
  data: Record<string, { xp: number; actualPoints: number; surprise: number }>;
};

export function ScatterPlotXPvsActual({ teams, data }: ScatterPlotProps) {
  const points = teams
    .map((t) => ({
      id: t.id,
      name: t.name,
      logo: t.logo,
      xp: Number(data[t.id]?.xp ?? 0),
      actual: Number(data[t.id]?.actualPoints ?? 0),
      surprise: Number(data[t.id]?.surprise ?? 0),
    }))
    .filter((p) => p.xp > 0 && p.actual > 0);

  if (points.length === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
        <h3 className="font-bold mb-3 text-neutral-800 dark:text-neutral-200">
          xP vs Actual Points
        </h3>
        <p className="text-sm text-neutral-500">Keine Daten verfügbar</p>
      </div>
    );
  }

  const maxVal = Math.max(...points.map((p) => Math.max(p.xp, p.actual)));

  const size = 260;
  const padding = 32;

  const scaleX = (v: number) =>
    (v / maxVal) * (size - padding * 2) + padding;

  const scaleY = (v: number) =>
    size - padding - (v / maxVal) * (size - padding * 2);

  // Median-basierte Quadrantenlogik (stabiler als maxVal/2)
  const medianXP =
    points
      .map((p) => p.xp)
      .sort((a, b) => a - b)[Math.floor(points.length / 2)];

  const getQuadrant = (xp: number, actual: number): string => {
    if (actual >= xp && xp >= medianXP) return 'efficient';
    if (actual >= xp && xp < medianXP) return 'lucky';
    if (actual < xp && xp >= medianXP) return 'unlucky';
    return 'inefficient';
  };

  const getColor = (quadrant: string): string => {
    switch (quadrant) {
      case 'efficient':
        return '#16a34a';
      case 'lucky':
        return '#2563eb';
      case 'unlucky':
        return '#ea580c';
      case 'inefficient':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
      <h3 className="font-bold mb-4 text-neutral-800 dark:text-neutral-200">
        xP vs Actual Points
      </h3>

      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <g key={pct}>
              <line
                x1={padding}
                y1={scaleY(maxVal * pct)}
                x2={size - padding}
                y2={scaleY(maxVal * pct)}
                stroke="#e5e7eb"
                strokeDasharray="2 2"
              />
              <line
                x1={scaleX(maxVal * pct)}
                y1={padding}
                x2={scaleX(maxVal * pct)}
                y2={size - padding}
                stroke="#e5e7eb"
                strokeDasharray="2 2"
              />
            </g>
          ))}

          {/* Axes */}
          <line
            x1={padding}
            y1={size - padding}
            x2={size - padding}
            y2={size - padding}
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={size - padding}
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Axis labels */}
          <text
            x={size - padding}
            y={size - 8}
            className="text-[10px] fill-neutral-400"
          >
            xP
          </text>
          <text
            x={8}
            y={padding + 8}
            className="text-[10px] fill-neutral-400"
          >
            Actual
          </text>

          {/* 1:1 Diagonal */}
          <line
            x1={padding}
            y1={size - padding}
            x2={size - padding}
            y2={padding}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />

          {/* Points */}
          {points.map((p) => {
            const quad = getQuadrant(p.xp, p.actual);
            const color = getColor(quad);

            return (
              <g key={p.id}>
                {/* Glow */}
                <circle
                  cx={scaleX(p.xp)}
                  cy={scaleY(p.actual)}
                  r={10}
                  fill={color}
                  opacity="0.15"
                />

                {/* Main point */}
                <circle
                  cx={scaleX(p.xp)}
                  cy={scaleY(p.actual)}
                  r={5}
                  fill={color}
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>
                    {`${p.name}
xP: ${p.xp.toFixed(1)}
Actual: ${p.actual}
Δ: ${p.surprise >= 0 ? '+' : ''}${p.surprise.toFixed(1)}`}
                  </title>
                </circle>

                {/* Label for important teams */}
                {(p.xp > 65 || Math.abs(p.surprise) > 10) && (
                  <text
                    x={scaleX(p.xp) + 8}
                    y={scaleY(p.actual) + 3}
                    className="text-[8px] fill-neutral-500"
                  >
                    {p.name.split(' ').slice(-1)[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
          <span className="text-neutral-600 dark:text-neutral-400">Good</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-neutral-600 dark:text-neutral-400">Lucky</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            Unlucky
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span className="text-neutral-600 dark:text-neutral-400">Bad</span>
        </span>
      </div>
    </div>
  );
}
