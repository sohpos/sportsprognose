// apps/web/components/TranslationContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  localeManager, 
  Locale, 
  SUPPORTED_LOCALES,
  type LocaleConfig 
} from '@sportsprognose/core';

interface TranslationContextValue {
  locale: Locale;
  config: LocaleConfig;
  isInitialized: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  d: (date: Date | string, format?: 'short' | 'long' | 'time') => string;
  n: (value: number, decimals?: number) => string;
  p: (probability: number, decimals?: number) => string;
  c: (amount: number, currency?: string) => string;
  o: (odds: number) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

// Initialize locale manager on app startup
async function initLocale(): Promise<void> {
  await localeManager.init();
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');
  const [isInitialized, setIsInitialized] = useState(false);
  const [, forceUpdate] = useState(0);

  // 1. Load default language on app startup
  useEffect(() => {
    initLocale().then(() => {
      setLocaleState(localeManager.locale);
      setIsInitialized(true);
    });
    
    // Subscribe for dynamic language changes
    const unsubscribe = localeManager.subscribe(() => {
      setLocaleState(localeManager.locale);
      forceUpdate(n => n + 1);
    });
    
    return unsubscribe;
  }, []);

  // 2. Dynamic language switching - simple direct update
  const handleSetLocale = useCallback(async (newLocale: Locale) => {
    console.log('Changing locale to:', newLocale);
    // Directly update state first for immediate feedback
    setLocaleState(newLocale);
    // Also try to update localeManager
    try {
      await localeManager.setLocale(newLocale);
    } catch (e) {
      console.error('setLocale failed:', e);
    }
  }, []);

  const value: TranslationContextValue = {
    locale,
    config: localeManager.config,
    isInitialized,
    setLocale: handleSetLocale,
    t: localeManager.t.bind(localeManager),
    d: localeManager.d.bind(localeManager),
    n: localeManager.n.bind(localeManager),
    p: localeManager.p.bind(localeManager),
    c: localeManager.c.bind(localeManager),
    o: localeManager.o.bind(localeManager),
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
    // Fallback values when not initialized
    return {
      locale: 'de' as Locale,
      config: SUPPORTED_LOCALES['de'],
      isInitialized: false,
      setLocale: async () => {},
      t: (key: string, params?: Record<string, string | number>) => key,
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

// Example usage in component:
// const { t, d, p, o, locale } = useTranslation();
// <span>{t('prediction:win')}</span>           // "Sieg"
// <span>{d(match.kickoff)}</span>            // "13.04.2026"
// <span>{p(prediction.probability)}</span>   // "75,0%"
// <span>{o(odds)}</span>                    // "1,85"