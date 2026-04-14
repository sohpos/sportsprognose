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
  },
  en: { 
    title: 'AI Football Predictions', 
    subtitle: 'Poisson Model · Real-time Stats · Accuracy Tracking',
    matches: 'Upcoming Matches',
    leagues: 'Leagues',
    predictions: 'Predictions today',
    model: 'Model',
  },
  tr: { 
    title: 'Yapay Zeka Futbol Tahminleri', 
    subtitle: 'Poisson Modeli · Gerçek Zamanlı İstatistikler',
    matches: 'Gelecek Maçlar',
    leagues: 'Ligler',
    predictions: 'Bugünkü Tahminler',
    model: 'Model',
  },
};

export default function LanguageTest() {
  const [locale, setLocale] = useState('de');
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved && translations[saved]) {
      setLocale(saved);
    }
    
    // Fetch matches
    fetch('http://localhost:3002/api/matches')
      .then(r => r.json())
      .then(data => setMatches(data.matches?.slice(0, 6) || []))
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

      {/* Matches title */}
      <div>
        <h2 className="text-xl font-bold text-white">{texts.matches}</h2>
      </div>
    </div>
  );
}