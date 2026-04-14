'use client';

import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Trefferquote & Statistiken', modelInfo: 'Was das Modell kann (und was nicht)',
    poisson: 'Das Poisson-Modell ist der', standard: 'Industriestandard', forPredictions: 'für Fußballprognosen. Es berechnet erwartete Toranzahlen basierend auf Angriffs- und Abwehrstärken.',
    realistic: 'Realistic realistic', hitRate: 'Trefferquote', range: 'für Ergebnisse (Sieg/Unentschieden/Niederlage).', marketing: 'Claims von 80%+ sind Marketing.',
    weeklyDetails: 'Wöchentliche Details', predictions: 'Prognosen', noData: 'Backend nicht erreichbar — starte den Server auf Port 3002',
    warningTitle: '⚠️ Wichtiger Hinweis', warningText: 'Diese App ist ein Lern- und Analyse-Tool. Die Prognosen sind kein Aufruf zur Teilnahme an Sportwetten. Statistik ≠ Garantie. Fußball ist chaotisch — das gehört dazu.',
  },
  en: {
    title: 'Accuracy & Statistics', modelInfo: 'What the model can (and cannot) do',
    poisson: 'The Poisson model is the', standard: 'industry standard', forPredictions: 'for football predictions. It calculates expected goals based on attack and defense strengths.',
    realistic: 'Realistic', hitRate: 'hit rate', range: 'for outcomes (win/draw/loss).', marketing: 'Claims of 80%+ are marketing.',
    weeklyDetails: 'Weekly Details', predictions: 'Predictions', noData: 'Backend not reachable — start server on Port 3002',
    warningTitle: '⚠️ Important Note', warningText: 'This app is a learning and analysis tool. Predictions are not a call to participate in sports betting. Statistics ≠ Guarantee. Football is chaotic — that comes with it.',
  },
  tr: {
    title: 'Doğruluk ve İstatistikler', modelInfo: 'Model ne yapabilir (ve yapamaz)',
    poisson: 'Poisson modeli', standard: 'endüstri standardı', forPredictions: 'futbol tahminleri için. Hesaplanan beklenen gol sayıları saldırı ve savunma güçlerine dayalıdır.',
    realistic: 'Gerçekçi', hitRate: 'doğruluk oranı', range: 'sonuçlar için (galibiyet/beraberlik/mağlubiyet).', marketing: '%80+ iddiaları pazarlamadır.',
    weeklyDetails: 'Haftalık Detaylar', predictions: 'Tahminler', noData: 'Backend erişilebilir değil — sunucuyu 3002 portunda başlat',
    warningTitle: '⚠️ Önemli Not', warningText: 'Bu uygulama bir öğrenme ve analiz aracıdır. Tahminler spor bahislerine katılma çağrısı değildir. İstatistik ≠ Garanti. Futbol kaotiktir — bu da işin bir parçasıdır.',
  },
};

interface WeekStats {
  week: string;
  totalPredictions: number;
  outcomeAccuracy: number;
}

export default function AccuracyPage() {
  const [stats, setStats] = useState<WeekStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved) setLocale(saved);
  }, []);

  const t = translations[locale] || translations['de'];

  useEffect(() => {
    fetch('http://localhost:3002/api/predictions/stats/accuracy')
      .then(r => r.json())
      .then(data => {
        setStats(data.stats || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const avgAccuracy = stats.length > 0 ? Math.round(stats.reduce((s, w) => s + w.outcomeAccuracy, 0) / stats.length) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">{t.title}</h1>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.modelInfo}</h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>{t.poisson} <strong>{t.standard}</strong> {t.forPredictions}</p>
          <p className="text-slate-400">{t.realistic} {t.hitRate}: <span className="text-green-400 font-semibold">55–65%</span> {t.range} {t.marketing}</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-slate-500">Loading...</div>
      ) : stats.length > 0 ? (
        <>
          {/* Accuracy widget */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.title} (8 weeks)</h3>
            <div className="flex gap-6 mb-5">
              <div>
                <div className="text-3xl font-bold" style={{ color: '#00e676' }}>{avgAccuracy}%</div>
                <div className="text-xs text-slate-500">Ø Result Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{stats[0].scoreAccuracy || 0}%</div>
                <div className="text-xs text-slate-500">Exact Score (this week)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-300">{stats[0].totalPredictions}</div>
                <div className="text-xs text-slate-500">{t.predictions}</div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-16">
              {[...stats].reverse().map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t transition-all" style={{
                    height: `${(s.outcomeAccuracy / 100) * 60}px`,
                    backgroundColor: s.outcomeAccuracy >= 65 ? '#00e676' : s.outcomeAccuracy >= 55 ? '#2979ff' : '#f87171',
                  }} />
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-600 mt-1 text-center">← 8 Wochen →</div>
          </div>

          {/* Weekly details */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.weeklyDetails}</h3>
            <div className="space-y-2">
              {stats.map((week, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-500 w-24">{week.week}</span>
                  <span className="text-sm text-slate-300 w-24">{week.totalPredictions} {t.predictions}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${week.outcomeAccuracy}%`,
                        backgroundColor: week.outcomeAccuracy >= 65 ? '#00e676' : week.outcomeAccuracy >= 55 ? '#2979ff' : '#f87171',
                      }} />
                    </div>
                    <span className="text-sm font-bold w-12 text-right" style={{
                      color: week.outcomeAccuracy >= 65 ? '#00e676' : week.outcomeAccuracy >= 55 ? '#2979ff' : '#f87171',
                    }}>{week.outcomeAccuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center text-slate-500">{t.noData}</div>
      )}

      <div className="card p-5 border-yellow-900/30" style={{ borderColor: 'rgba(234,179,8,0.2)' }}>
        <h3 className="text-sm font-semibold text-yellow-500 mb-2">{t.warningTitle}</h3>
        <p className="text-xs text-slate-400">{t.warningText}</p>
      </div>
    </div>
  );
}