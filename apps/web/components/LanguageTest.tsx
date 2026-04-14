'use client';

import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  de: { 'title': 'KI-Fußballprognosen', 'subtitle': 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking' },
  en: { 'title': 'AI Football Predictions', 'subtitle': 'Poisson Model · Real-time Stats · Accuracy Tracking' },
  es: { 'title': 'Predicciones de Fútbol IA', 'subtitle': 'Modelo Poisson · Estadísticas en Vivo' },
  fr: { 'title': 'Prédictions Football IA', 'subtitle': 'Modèle Poisson · Statistiques en Direct' },
  it: { 'title': 'Previsioni Calcio IA', 'subtitle': 'Modello Poisson · Statistiche in Tempo Reale' },
  tr: { 'title': 'Yapay Zeka Futbol Tahminleri', 'subtitle': 'Poisson Modeli · Gerçek Zamanlı İstatistikler' },
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
      <p className="mt-4 text-green-400">Aktuelle Sprache: {locale}</p>
    </div>
  );
}