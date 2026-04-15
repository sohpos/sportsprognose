'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '@sportsprognose/core';
import type { Locale, LocaleConfig } from '@sportsprognose/core';

const STORAGE_KEY = 'sportsprognose_locale';

interface TranslationContextValue {
  locale: Locale;
  config: LocaleConfig;
  isInitialized: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}

const TranslationContext = createContext<TranslationContextValue>({
  locale: 'de',
  config: SUPPORTED_LOCALES['de'],
  isInitialized: false,
  setLocale: () => {},
  t: (key) => key,
  supportedLocales: SUPPORTED_LOCALES,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('de');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use a simple translation object instead of i18next on server
  const translations: Record<Locale, Record<string, string>> = {
    de: {
      'app:title': 'KI-Fußballprognosen',
      'app:subtitle': 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
      'matches:title': 'Nächste Spiele',
      'matches:all': 'Alle anzeigen →',
      'stats:leagues': 'Ligen',
      'stats:predictions': 'Prognosen heute',
      'stats:model': 'Modell',
      'prediction:win': 'Sieg',
      'prediction:draw': 'Unentschieden',
      'prediction:loss': 'Niederlage',
      'prediction:confidence': 'sicher',
      'accuracy:title': 'Trefferquote',
    },
    en: {
      'app:title': 'AI Football Predictions',
      'app:subtitle': 'Poisson Model · Real-time Stats · Accuracy Tracking',
      'matches:title': 'Upcoming Matches',
      'matches:all': 'Show all →',
      'stats:leagues': 'Leagues',
      'stats:predictions': 'Predictions today',
      'stats:model': 'Model',
      'prediction:win': 'Win',
      'prediction:draw': 'Draw',
      'prediction:loss': 'Loss',
      'prediction:confidence': 'confidence',
      'accuracy:title': 'Accuracy',
    },
    es: {
      'app:title': 'Predicciones de Fútbol IA',
      'app:subtitle': 'Modelo Poisson · Estadísticas en Vivo',
      'matches:title': 'Próximos Partidos',
      'matches:all': 'Ver todos →',
      'stats:leagues': 'Ligas',
      'stats:predictions': 'Predicciones hoy',
      'stats:model': 'Modelo',
      'prediction:win': 'Victoria',
      'prediction:draw': 'Empate',
      'prediction:loss': 'Derrota',
      'prediction:confidence': 'confianza',
      'accuracy:title': 'Precisión',
    },
    fr: {
      'app:title': 'Prédictions Football IA',
      'app:subtitle': 'Modèle Poisson · Statistiques en Direct',
      'matches:title': 'Matchs à Venir',
      'matches:all': 'Voir tout →',
      'stats:leagues': 'Ligues',
      'stats:predictions': "Prédictions aujourd'hui",
      'stats:model': 'Modèle',
      'prediction:win': 'Victoire',
      'prediction:draw': 'Match nul',
      'prediction:loss': 'Défaite',
      'prediction:confidence': 'confiance',
      'accuracy:title': 'Précision',
    },
    it: {
      'app:title': 'Previsioni Calcio IA',
      'app:subtitle': 'Modello Poisson · Statistiche in Tempo Reale',
      'matches:title': 'Prossime Partite',
      'matches:all': 'Vedi tutte →',
      'stats:leagues': 'Leghe',
      'stats:predictions': 'Previsioni oggi',
      'stats:model': 'Modello',
      'prediction:win': 'Vittoria',
      'prediction:draw': 'Pareggio',
      'prediction:loss': 'Sconfitta',
      'prediction:confidence': 'fiducia',
      'accuracy:title': 'Precisione',
    },
  };

  // Load saved locale on mount
  useEffect(() => {
    // FIRST: Check localStorage directly
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log('TranslationContext: localStorage shows:', saved);
    
    if (saved && saved in translations) {
      setLocale(saved as Locale);
      console.log('TranslationContext: set to saved:', saved);
    } else {
      console.log('TranslationContext: no saved, using default');
    }
    setIsInitialized(true);
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handler = (e: Event) => {
      const newLocale = (e as CustomEvent).detail as Locale;
      setLocale(newLocale);
    };
    window.addEventListener('localechanged', handler);
    return () => window.removeEventListener('localechanged', handler);
  }, []);

  const value: TranslationContextValue = {
    locale,
    config: SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES['de'],
    isInitialized,
    setLocale: (newLocale: Locale) => {
      setLocale(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      window.dispatchEvent(new CustomEvent('localechanged', { detail: newLocale }));
    },
    t: (key: string) => translations[locale]?.[key] || translations['en'][key] || key,
    supportedLocales: SUPPORTED_LOCALES,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}