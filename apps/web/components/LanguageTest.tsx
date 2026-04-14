'use client';

import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  de: { 
    title: 'KI-Fußballprognosen', 
    subtitle: 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
    matches: 'Nächste Spiele',
    leagues: 'Ligen',
    predictions: 'Prognosen heute',
    model: 'Modell',
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
  },
  en: { 
    title: 'AI Football Predictions', 
    subtitle: 'Poisson Model · Real-time Stats · Accuracy Tracking',
    matches: 'Upcoming Matches',
    leagues: 'Leagues',
    predictions: 'Predictions today',
    model: 'Model',
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
  },
  tr: { 
    title: 'Yapay Zeka Futbol Tahminleri', 
    subtitle: 'Poisson Modeli · Gerçek Zamanlı İstatistikler',
    matches: 'Gelecek Maçlar',
    leagues: 'Ligler',
    predictions: 'Bugünkü Tahminler',
    model: 'Model',
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
  },
};

interface Match {
  id: string;
  homeTeam: { name: string; shortName: string };
  awayTeam: { name: string; shortName: string };
  leagueName: string;
  utcDate: string;
}

interface Prediction {
  predictedOutcome: 'home' | 'draw' | 'away';
  confidence: number;
  homeProbability: number;
  drawProbability: number;
  awayProbability: number;
}

export default function LanguageTest() {
  const [locale, setLocale] = useState('de');
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved && translations[saved]) {
      setLocale(saved);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:3002/api/matches')
      .then(r => r.json())
      .then(async data => {
        const matchesData = data.matches?.slice(0, 6) || [];
        setMatches(matchesData);
        
        // Fetch predictions
        const preds: Record<string, Prediction> = {};
        await Promise.allSettled(
          matchesData.map((m: Match) => 
            fetch(`http://localhost:3002/api/predictions/${m.id}`)
              .then(r => r.json())
              .then(d => { preds[m.id] = d.prediction; })
          )
        );
        setPredictions(preds);
      })
      .catch(console.error);
  }, []);

  const texts = translations[locale] || translations['de'];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">{texts.title}</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          {texts.subtitle}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xl font-bold text-white">4</div>
          <div className="text-xs text-slate-500">{texts.leagues}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xl font-bold text-white">{matches.length}</div>
          <div className="text-xs text-slate-500">{texts.predictions}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🧮</div>
          <div className="text-xl font-bold text-white">{texts.model}</div>
          <div className="text-xs text-slate-500">Poisson</div>
        </div>
      </div>

      {/* Matches */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{texts.matches}</h2>
        {matches.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(match => (
              <div key={match.id} className="card p-4">
                <div className="text-xs text-slate-500 mb-2">{match.leagueName}</div>
                <div className="flex justify-between items-center">
                  <div className="text-center flex-1">
                    <div className="font-bold text-white">{match.homeTeam.shortName}</div>
                  </div>
                  <div className="text-slate-500 px-4">-</div>
                  <div className="text-center flex-1">
                    <div className="font-bold text-white">{match.awayTeam.shortName}</div>
                  </div>
                </div>
                {predictions[match.id] && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-400">
                      {predictions[match.id].predictedOutcome === 'home' && texts.home}
                      {predictions[match.id].predictedOutcome === 'draw' && texts.draw}
                      {predictions[match.id].predictedOutcome === 'away' && texts.away}
                      {' '}({Math.round(predictions[match.id].confidence * 100)}%)
                    </div>
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