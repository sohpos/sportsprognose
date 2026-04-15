'use client';

import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, any>> = {
  de: { 
    title: 'KI-Fuβballprognosen', 
    subtitle: 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
    matches: 'Nächste Spiele',
    leagues: 'Ligen',
    predictions: 'Prognosen heute',
    model: 'Modell', xg: 'xG', over25: 'Over 2.5', under25: 'Under 2.5', lambda: 'λ',
    accuracyTitle: 'Trefferquote (8 Wochen)',
    avgAccuracy: 'Ø Ergebnis-Genauigkeit',
    exactScore: 'Exakter Score (diese Woche)',
    predictionsThisWeek: 'Prognosen (diese Woche)',
    weeks: '← 8 Wochen →',
    win: 'Sieg',
    draw: 'Unentschieden',
    loss: 'Niederlage',
    home: 'Heim',
    away: 'Gast',
    dateFormat: { weekday: 'short', day: '2-digit', month: '2-digit' },
    timeFormat: { hour: '2-digit', minute: '2-digit' },
    dashboard: 'Dashboard',
    navMatches: 'Spiele',
    navAccuracy: 'Trefferquote',
    active: 'Poisson-Modell aktiv',
    leagueAll: 'Alle Ligen',
    showAll: 'Alle anzeigen', showDetails: 'Details', topScores: 'Top 6 Ergebnisse',
    loading: 'Laden...',
    noData: 'Keine Daten verfügbar',
    prevWeek: '← Vorherige Woche',
    nextWeek: 'Nächste Woche →',
    probHome: 'Heim',
    probDraw: 'Unentschieden',
    probAway: 'Gast',
    confidence: 'Sicherheit',
    form: { w: 'S', d: 'U', n: 'N' },
  },
  en: { 
    title: 'AI Football Predictions', 
    subtitle: 'Poisson Model · Real-time Stats · Accuracy Tracking',
    matches: 'Upcoming Matches',
    leagues: 'Leagues',
    predictions: 'Predictions today',
    model: 'Model', xg: 'xG', over25: 'Over 2.5', under25: 'Under 2.5', xg: 'xG', over25: 'Over 2.5', under25: 'Under 2.5', lambda: 'λ',
    accuracyTitle: 'Accuracy (8 weeks)',
    avgAccuracy: 'Ø Result Accuracy',
    exactScore: 'Exact Score (this week)',
    predictionsThisWeek: 'Predictions (this week)',
    weeks: '← 8 weeks →',
    win: 'Win',
    draw: 'Draw',
    loss: 'Loss',
    home: 'Home',
    away: 'Away',
    dateFormat: { weekday: 'short', day: '2-digit', month: '2-digit' },
    timeFormat: { hour: '2-digit', minute: '2-digit' },
    dashboard: 'Dashboard',
    navMatches: 'Matches',
    navAccuracy: 'Accuracy',
    active: 'Poisson Model active',
    leagueAll: 'All Leagues',
    showAll: 'Show all', showDetails: 'Details', topScores: 'Top 6 Scores',
    loading: 'Loading...',
    noData: 'No data available',
    prevWeek: '← Previous week',
    nextWeek: 'Next week →',
    probHome: 'Home',
    probDraw: 'Draw',
    probAway: 'Away',
    confidence: 'Confidence',
    form: { w: 'W', d: 'D', l: 'L' },
  },
  tr: { 
    title: 'Yapay Zeka Futbol Tahminleri', 
    subtitle: 'Poisson Modeli · Gerçek Zamanlı İstatistikler',
    matches: 'Gelecek Maçlar',
    leagues: 'Ligler',
    predictions: 'Bugünkü Tahminler',
    model: 'Model', xg: 'xG', over25: 'Over 2.5', under25: 'Under 2.5', xg: 'xG', over25: 'Over 2.5', under25: 'Under 2.5', lambda: 'λ',
    accuracyTitle: 'Doğruluk (8 hafta)',
    avgAccuracy: 'Ø Sonuç Doğruluğu',
    exactScore: 'Kesin Skor (bu hafta)',
    predictionsThisWeek: 'Tahminler (bu hafta)',
    weeks: '← 8 hafta →',
    win: 'Galibiyet',
    draw: 'Beraberlik',
    loss: 'Mağlubiyet',
    home: 'Ev',
    away: 'Deplasman',
    dateFormat: { weekday: 'short', day: '2-digit', month: '2-digit' },
    timeFormat: { hour: '2-digit', minute: '2-digit' },
    dashboard: 'Panel',
    navMatches: 'Maçlar',
    navAccuracy: 'Doğruluk',
    active: 'Poisson Modeli aktif',
    leagueAll: 'Tüm Ligler',
    showAll: 'Tümünü göster', showDetails: 'Detaylar', topScores: 'En olası 6 sonuç',
    loading: 'Yükleniyor...',
    noData: 'Veri yok',
    prevWeek: '← Önceki hafta',
    nextWeek: 'Sonraki hafta →',
    probHome: 'Ev',
    probDraw: 'Beraberlik',
    probAway: 'Deplasman',
    confidence: 'Güven',
    form: { w: 'G', d: 'B', l: 'M' },
  },
};

export const getTranslations = (locale: string) => translations[locale] || translations['de'];
export const getLocale = () => {
  if (typeof window === 'undefined') return 'de';
  return localStorage.getItem('sportsprognose_locale') || 'de';
};

interface Match {
  id: string;
  homeTeam: { name: string; shortName: string };
  awayTeam: { name: string; shortName: string };
  leagueName: string;
  leagueId: string;
  utcDate: string;
}

interface Prediction {
  predictedOutcome: 'home' | 'draw' | 'away';
  confidence: number;
  homeProbability: number;
  drawProbability: number;
  awayProbability: number;
}

interface WeekStats {
  week: string;
  totalPredictions: number;
  correctOutcomes: number;
  outcomeAccuracy: number;
  scoreAccuracy: number;
}

export default function LanguageTest() {
  const [locale, setLocale] = useState('de');
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [stats, setStats] = useState<WeekStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved && translations[saved]) setLocale(saved);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3002/api/matches').then(r => r.json()),
      fetch('http://localhost:3002/api/predictions/stats/accuracy').then(r => r.json()).catch(() => ({ stats: [] }))
    ]).then(([matchData, statsData]) => {
      const matchesData = matchData.matches?.slice(0, 6) || [];
      setMatches(matchesData);
      setStats(statsData.stats || []);
      
      Promise.allSettled(
        matchesData.map((m: Match) => 
          fetch(`http://localhost:3002/api/predictions/${m.id}`).then(r => r.json())
        )
      ).then(results => {
        const preds: Record<string, Prediction> = {};
        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value.prediction) {
            preds[matchesData[i].id] = r.value.prediction;
          }
        });
        setPredictions(preds);
        setLoading(false);
      });
    }).catch(() => setLoading(false));
  }, []);

  const t = translations[locale] || translations['de'];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-US', tr: 'tr-TR' };
    return date.toLocaleDateString(localeMap[locale] || 'de-DE', t.dateFormat);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-US', tr: 'tr-TR' };
    return date.toLocaleTimeString(localeMap[locale] || 'de-DE', t.timeFormat);
  };

  const leagueColors: Record<string, string> = {
    BL1: 'text-red-400',
    PL: 'text-purple-400',
    PD: 'text-orange-400',
    CL: 'text-yellow-400',
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">{t.title}</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xl font-bold text-white">4</div>
          <div className="text-xs text-slate-500">{t.leagues}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xl font-bold text-white">{matches.length}</div>
          <div className="text-xs text-slate-500">{t.predictions}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🧮</div>
          <div className="text-xl font-bold text-white">{t.model}</div>
          <div className="text-xs text-slate-500">Poisson</div>
        </div>
      </div>

      {/* Accuracy widget */}
      {stats.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.accuracyTitle}</h3>
          <div className="flex gap-6 mb-5">
            <div>
              <div className="text-3xl font-bold" style={{ color: '#00e676' }}>
                {Math.round(stats.reduce((s, st) => s + st.outcomeAccuracy, 0) / stats.length)}%
              </div>
              <div className="text-xs text-slate-500">{t.avgAccuracy}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{stats[0].scoreAccuracy}%</div>
              <div className="text-xs text-slate-500">{t.exactScore}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-300">{stats[0].totalPredictions}</div>
              <div className="text-xs text-slate-500">{t.predictionsThisWeek}</div>
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
          <div className="text-[10px] text-slate-600 mt-1 text-center">{t.weeks}</div>
        </div>
      )}

      {/* Matches */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{t.matches}</h2>
        {loading ? (
          <div className="card p-8 text-center text-slate-500">{t.loading}</div>
        ) : matches.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">{t.noData}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(match => (
              <div key={match.id} className="card p-4">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className={leagueColors[match.leagueId] || 'text-slate-400'}>{match.leagueName}</span>
                  <span className="text-slate-500">{formatDate(match.utcDate)} · {formatTime(match.utcDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center flex-1">
                    <div className="font-bold text-white text-lg flex items-center gap-2 justify-center">{match.homeTeam.logo && <img src={match.homeTeam.logo} alt="" className="w-5 h-5" />}{match.homeTeam.shortName}</div>
                    <div className="text-[10px] text-slate-500">{match.homeTeam.name}</div>
                    {predictions[match.id] && (
                      <div className="text-[10px] text-orange-400">xG {predictions[match.id].mostLikelyScore.home.toFixed(1)}</div>
                    )}
                  </div>
                  <div className="text-slate-500 px-4 text-xl">-</div>
                  <div className="text-center flex-1">
                    <div className="font-bold text-white text-lg flex items-center gap-2 justify-center">{match.awayTeam.logo && <img src={match.awayTeam.logo} alt="" className="w-5 h-5" />}{match.awayTeam.shortName}</div>
                    <div className="text-[10px] text-slate-500">{match.awayTeam.name}</div>
                    {predictions[match.id] && (
                      <div className="text-[10px] text-orange-400">xG {predictions[match.id].mostLikelyScore.away.toFixed(1)}</div>
                    )}
                  </div>
                </div>
                {predictions[match.id] && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-2">{t.confidence}: {Math.round(predictions[match.id].confidence)}%</div>
                    <div className="flex text-xs text-slate-400 justify-between mb-1">
                      <span className="text-green-400">{Math.round(predictions[match.id].homeWinProbability * 100)}%</span>
                      <span>{Math.round(predictions[match.id].drawProbability * 100)}%</span>
                      <span className="text-blue-400">{Math.round(predictions[match.id].awayWinProbability * 100)}%</span>
                    </div>
                    <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                      <div className="bg-green-500 rounded-l-full" style={{ width: `${predictions[match.id].homeWinProbability * 100}%` }} />
                      <div className="bg-slate-500" style={{ width: `${predictions[match.id].drawProbability * 100}%` }} />
                      <div className="bg-blue-500 rounded-r-full" style={{ width: `${predictions[match.id].awayWinProbability * 100}%` }} />
                    </div>
                    <div className="flex text-[10px] text-slate-500 justify-between mt-1">
                      <span>{t.probHome}</span>
                      <span>{t.probDraw}</span>
                      <span>{t.probAway}</span>
                    </div>
                    {/* Over/Under */}
                    <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-xs">
                      <span className="text-orange-400">Over 2.5: {Math.round(prediction.over25Probability * 100)}%</span>
                      <span className="text-cyan-400">Under 2.5: {Math.round(prediction.under25Probability * 100)}%</span>
                    </div>
                    {/* Score Matrix */}
                    <ScoreMatrix prediction={predictions[match.id]} t={t} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// Score Matrix Component - 6x6 grid (goals 0-5)
function ScoreMatrix({ prediction, t }: { prediction: any; t: any }) {
  const [expanded, setExpanded] = useState(false);
  const matrix = prediction.scoreMatrix || [];
  const maxGoals = 5; // Shows 0-5 = 6 rows
  
  if (!matrix.length) return null;

  return (
    <div className="mt-3">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
      >
        {expanded ? '▼' : '▶'} {t.showDetails || 'Score-Matrix'}
      </button>
      
      {expanded && (
        <div className="mt-2 overflow-x-auto">
          <table className="text-xs text-center w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="p-1"></th>
                {Array.from({ length: maxGoals + 1 }).map((_, a) => (
                  <th key={a} className="p-1 bg-slate-700 text-slate-300">{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxGoals + 1 }).map((_, h) => (
                <tr key={h}>
                  <th className="p-1 bg-slate-700 text-slate-300">{h}</th>
                  {Array.from({ length: maxGoals + 1 }).map((_, a) => {
                    const cell = matrix.find((s: any) => s.homeGoals === h && s.awayGoals === a);
                    const prob = cell?.probability || 0;
                    const intensity = Math.min(prob * 5, 1);
                    return (
                      <td 
                        key={a} 
                        className="p-1"
                        style={{ 
                          backgroundColor: `rgba(0, 230, 118, ${intensity * 0.8})`,
                          color: intensity > 0.5 ? '#0a0e1a' : '#e2e8f0',
                        }}
                      >
                        {(prob * 100).toFixed(1)}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
