type PositionDistributionChartProps = {
  team: { id: string; name: string; logo?: string };
  distribution: number[];
};

export function PositionDistributionChart({
  team,
  distribution,
}: PositionDistributionChartProps) {
  // FIX 1: total dynamisch berechnen
  const total = distribution.reduce((a, b) => a + b, 0) || 1;

  const percentages = distribution.map((v) => (v / total) * 100);

  // FIX 2: max robust berechnen
  const positive = percentages.filter((p) => p > 0);
  const max = positive.length > 0 ? Math.max(...positive) : 1;

  const colorScale = (pct: number): string => {
    if (max === 0 || pct < 0.5) return "rgba(59, 130, 246, 0.1)";
    const intensity = pct / max;

    const start = [219, 234, 254];
    const end = [30, 64, 175];

    const r = Math.round(start[0] + (end[0] - start[0]) * intensity);
    const g = Math.round(start[1] + (end[1] - start[1]) * intensity);
    const b = Math.round(start[2] + (end[2] - start[2]) * intensity);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="rounded-lg bg-white dark:bg-neutral-900 p-3 shadow-lg hover:shadow-xl transition-shadow text-sm">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-3">
        {team.logo && (
          <img src={team.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />
        )}
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
          {team.name}
        </h3>
      </div>

      {/* Bars */}
      <div className="space-y-1 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
        {percentages.map((pct, i) => {
          if (pct < 0.5) return null;

          return (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="w-5 text-xs text-neutral-400 font-medium text-right">
                {i + 1}.
              </span>

              <div className="flex-1 h-4 rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded transition-all group-hover:opacity-80"
                  style={{
                    width: `${(pct / max) * 100}%`,
                    backgroundColor: colorScale(pct),
                  }}
                />
              </div>

              <span className="w-12 text-xs text-right font-mono text-neutral-600 dark:text-neutral-400 font-medium">
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
