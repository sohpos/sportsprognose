interface WeekStats {
  week: string;
  totalPredictions: number;
  correctOutcomes: number;
  outcomeAccuracy: number;
  scoreAccuracy: number;
}

interface Props {
  stats: WeekStats[];
}

export default function AccuracyWidget({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  const latest = stats[0];
  const avgAccuracy = Math.round(
    stats.reduce((sum, s) => sum + s.outcomeAccuracy, 0) / stats.length
  );

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Trefferquote (8 Wochen)
      </h3>

      <div className="flex gap-6 mb-5">
        <div>
          <div className="text-3xl font-bold" style={{ color: '#00e676' }}>{avgAccuracy}%</div>
          <div className="text-xs text-slate-500">Ø Ergebnis-Genauigkeit</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-400">{latest.scoreAccuracy}%</div>
          <div className="text-xs text-slate-500">Exakter Score (diese Woche)</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-300">{latest.totalPredictions}</div>
          <div className="text-xs text-slate-500">Prognosen (diese Woche)</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-16">
        {[...stats].reverse().map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${(s.outcomeAccuracy / 100) * 60}px`,
                backgroundColor: s.outcomeAccuracy >= 65
                  ? '#00e676'
                  : s.outcomeAccuracy >= 55
                  ? '#2979ff'
                  : '#f87171',
                opacity: 0.7 + (i / stats.length) * 0.3,
              }}
            />
          </div>
        ))}
      </div>
      <div className="text-[10px] text-slate-600 mt-1 text-center">← 8 Wochen →</div>
    </div>
  );
}
