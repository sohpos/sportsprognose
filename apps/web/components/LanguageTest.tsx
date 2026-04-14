'use client';

import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  de: { 
    'title': 'KI-Fußballprognosen', 
    'subtitle': 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
    'matches': 'Nächste Spiele',
    'showAll': 'Alle anzeigen',
    'leagues': 'Ligen',
    'predictionsToday': 'Prognosen heute',
    'model': 'Modell',
    'accuracy': 'Trefferquote',
    'win': 'Sieg',
    'draw': 'Unentschieden',
    'loss': 'Niederlage',
    'confidence': 'sicher',
    'home': 'Heim',
    'drawLabel': 'Unentschieden',
    'away': 'Gast',
  },
  en: { 
    'title': 'AI Football Predictions', 
    'subtitle': 'Poisson Model · Real-time Stats · Accuracy Tracking',
    'matches': 'Upcoming Matches',
    'showAll': 'Show all',
    'leagues': 'Leagues',
    'predictionsToday': 'Predictions today',
    'model': 'Model',
    'accuracy': 'Accuracy',
    'win': 'Win',
    'draw': 'Draw',
    'loss': 'Loss',
    'confidence': 'confidence',
    'home': 'Home',
    'drawLabel': 'Draw',
    'away': 'Away',
  },
  tr: { 
    'title': 'Yapay Zeka Futbol Tahminleri', 
    'subtitle': 'Poisson Modeli · Gerçek Zamanlı İstatistikler',
    'matches': 'Gelecek Maçlar',
    'showAll': 'Tümünü göster',
    'leagues': 'Ligler',
    'predictionsToday': 'Bugünkü Tahminler',
    'model': 'Model',
    'accuracy': 'Doğruluk',
    'win': 'Galibiyet',
    'draw': 'Beraberlik',
    'loss': 'Mağlubiyet',
    'confidence': 'güven',
    'home': 'Ev',
    'drawLabel': 'Beraberlik',
    'away': 'Deplasman',
  },
};

export default function LanguageTest() {
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved && translations[saved]) {
      setLocale(saved);
    }
  }, []);

  const texts = translations[locale] || translations['de'];

  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold mb-3">
        <span className="gradient-text">{texts.title}</span>
      </h1>
      <p className="text-slate-400 text-lg max-w-xl mx-auto">
        {texts.subtitle}
      </p>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xl font-bold text-white">4</div>
          <div className="text-xs text-slate-500">{texts.leagues}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xl font-bold text-white">6</div>
          <div className="text-xs text-slate-500">{texts.predictionsToday}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🧮</div>
          <div className="text-xl font-bold text-white">{texts.model}</div>
          <div className="text-xs text-slate-500">Poisson</div>
        </div>
      </div>
      {/* Matches title */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white text-left">{texts.matches}</h2>
      </div>
    </div>
  );
}