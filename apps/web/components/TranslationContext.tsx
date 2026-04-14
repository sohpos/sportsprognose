'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LOCALES } from '@sportsprognose/core';
import type { Locale, LocaleConfig } from '@sportsprognose/core';
import { getGlobalLocale, subscribeToLocale } from './LanguageSelector';

const STORAGE_KEY = 'sportsprognose_locale';

// Simple translation function
function translate(key: string, locale: Locale): string {
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
      'stats:predictions': 'Prédictions aujourd\'hui',
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
  return translations[locale]?.[key] || translations['en'][key] || key;
}

interface TranslationContextValue {
  locale: Locale;
  config: LocaleConfig;
  isInitialized: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  d: (date: Date | string, format?: 'short' | 'long' | 'time') => string;
  n: (value: number, decimals?: number) => string;
  p: (probability: number, decimals?: number) => string;
  c: (amount: number, currency?: string) => string;
  o: (odds: number) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('de');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and subscribe to language changes
  useEffect(() => {
    // Load saved locale
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && saved in SUPPORTED_LOCALES) {
      setLocale(saved);
    }
    setIsInitialized(true);

    // Subscribe to language changes from LanguageSelector
    const unsubscribe = subscribeToLocale(() => {
      const newLocale = getGlobalLocale();
      setLocale(newLocale);
    });

    return unsubscribe;
  }, []);

  const value: TranslationContextValue = {
    locale,
    config: SUPPORTED_LOCALES[locale],
    isInitialized,
    setLocale: (newLocale: Locale) => {
      localStorage.setItem(STORAGE_KEY, newLocale);
      setLocale(newLocale);
    },
    t: (key: string) => translate(key, locale),
    d: (date: Date | string, format = 'short') => {
      const d = new Date(date);
      if (format === 'short') return d.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US');
      if (format === 'time') return d.toLocaleTimeString(locale === 'de' ? 'de-DE' : 'en-US');
      return d.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US');
    },
    n: (value: number, decimals = 0) => value.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    p: (probability: number, decimals = 1) => (probability * 100).toFixed(decimals) + '%',
    c: (amount: number, currency = 'EUR') => amount.toFixed(2) + ' ' + (currency === 'EUR' ? '€' : '$'),
    o: (odds: number) => odds.toFixed(2),
    supportedLocales: SUPPORTED_LOCALES,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook for components
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    return {
      locale: 'de' as Locale,
      config: SUPPORTED_LOCALES['de'],
      isInitialized: false,
      setLocale: () => {},
      t: (key: string) => key,
      d: (date: Date | string) => new Date(date).toLocaleDateString(),
      n: (value: number) => value.toString(),
      p: (probability: number) => (probability * 100).toFixed(1) + '%',
      c: (amount: number) => amount.toFixed(2) + ' €',
      o: (odds: number) => odds.toFixed(2),
      supportedLocales: SUPPORTED_LOCALES,
    };
  }
  return context;
}

// Simple hook for utilities
export function useTranslations() {
  const { t, d, n, p, c, o } = useTranslation();
  return { t, d, n, p, c, o };
}