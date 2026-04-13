import { fetchAccuracyStats } from '@/lib/api';
import AccuracyWidget from '@/components/AccuracyWidget';

export const dynamic = 'force-dynamic';

export default async function AccuracyPage() {
  let stats: any[] = [];

  try {
    const data = await fetchAccuracyStats();
    stats = data.stats;
  } catch (e) {
    console.error('Failed to load accuracy:', e);
  }

  const avgAccuracy = stats.length > 0
    ? Math.round(stats.reduce((s, w) => s + w.outcomeAccuracy, 0) / stats.length)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Trefferquote & Statistiken</h1>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Was das Modell kann (und was nicht)
        </h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            Das Poisson-Modell ist der <strong>Industriestandard</strong> für Fußballprognosen.
            Es berechnet erwartete Toranzahlen basierend auf Angriffs- und Abwehrstärken.
          </p>
          <p className="text-slate-400">
            Realistische Trefferquote: <span className="text-green-400 font-semibold">55–65%</span> für Ergebnisse (Sieg/Unentschieden/Niederlage).
            Claims von 80%+ sind Marketing.
          </p>
        </div>
      </div>

      {stats.length > 0 ? (
        <>
          <AccuracyWidget stats={stats} />

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Wöchentliche Details
            </h3>
            <div className="space-y-2">
              {stats.map((week, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-xs text-slate-500 w-24">{week.week}</span>
                  <span className="text-sm text-slate-300 w-24">
                    {week.totalPredictions} Prognosen
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${week.outcomeAccuracy}%`,
                          backgroundColor: week.outcomeAccuracy >= 65
                            ? '#00e676'
                            : week.outcomeAccuracy >= 55
                            ? '#2979ff'
                            : '#f87171',
                        }}
                      />
                    </div>
                    <span
                      className="text-sm font-bold w-12 text-right"
                      style={{
                        color: week.outcomeAccuracy >= 65
                          ? '#00e676'
                          : week.outcomeAccuracy >= 55
                          ? '#2979ff'
                          : '#f87171',
                      }}
                    >
                      {week.outcomeAccuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center text-slate-500">
          Backend nicht erreichbar — starte den Server auf Port 3001
        </div>
      )}

      <div className="card p-5 border-yellow-900/30" style={{ borderColor: 'rgba(234,179,8,0.2)' }}>
        <h3 className="text-sm font-semibold text-yellow-500 mb-2">⚠️ Wichtiger Hinweis</h3>
        <p className="text-xs text-slate-400">
          Diese App ist ein Lern- und Analyse-Tool. Die Prognosen sind kein Aufruf zur
          Teilnahme an Sportwetten. Statistik ≠ Garantie. Fußball ist chaotisch —
          das gehört dazu.
        </p>
      </div>
    </div>
  );
}
