interface WeekStats {
  week: string;
  totalPredictions: number;
  correctOutcomes: number;
  outcomeAccuracy: number; // kann 0–1 oder 0–100 sein
  scoreAccuracy: number;
}

interface Props {
  stats: WeekStats[];
}

export default function AccuracyWidget({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  // 🔥 outcomeAccuracy automatisch normalisieren (0–1 oder 0–100)
  const normalize = (v: number) => (v <= 1 ? v * 100 : v);

  const normalizedStats = stats.map(s => ({
    ...s,
    outcomeAccuracy: normalize(s.outcomeAccuracy),
    scoreAccuracy: normalize(s.scoreAccuracy),
  }));

  const latest = normalizedStats[0];

  const avgAccuracy = Math.round(
    normalizedStats.reduce((sum, s) => sum + s.outcomeAccuracy, 0) /
      normalizedStats.length
  );

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Trefferquote (8 Wochen)
      </h3>

      <div className="flex gap-6 mb-5">
        <div>
          <div className="text-3xl font-bold" style={{ color: '#00e676' }}>
            {avgAccuracy}%
          </div>
          <div className="text-xs text-slate-500">Ø Ergebnis-Genauigkeit</div>
        </div>

        <div>
          <div className="text-3xl font-bold text-blue-400">
            {latest.scoreAccuracy}%
          </div>
          <div className="text-xs text-slate-500">Exakter Score (diese Woche)</div>
        </div>

        <div>
          <div className="text-3xl font-bold text-slate-300">
            {latest.totalPredictions}
          </div>
          <div className="text-xs text-slate-500">Prognosen (diese Woche)</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-16">
        {[...normalizedStats].reverse().map((s, i) => {
          const height = (s.outcomeAccuracy / 100) * 60;

          const color =
            s.outcomeAccuracy >= 65
              ? '#00e676'
              : s.outcomeAccuracy >= 55
              ? '#2979ff'
              : '#f87171';

          const opacity = Math.min(1, 0.7 + (i / normalizedStats.length) * 0.3);

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${height}px`,
                  backgroundColor: color,
                  opacity,
                }}
              >
                <title>
                  {`${s.week}
Outcome: ${s.outcomeAccuracy}%
Score: ${s.scoreAccuracy}%
Predictions: ${s.totalPredictions}`}
                </title>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-slate-600 mt-1 text-center">← 8 Wochen →</div>
    </div>
  );
}
