// apps/web/components/TranslationContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  localeManager, 
  Locale, 
  SUPPORTED_LOCALES,
  type LocaleConfig 
} from '@sportsprognose/core/i18n/LocaleManager';

interface TranslationContextValue {
  locale: Locale;
  localeConfig: LocaleConfig;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  d: (date: Date | string) => string;
  n: (value: number, decimals?: number) => string;
  p: (probability: number) => string;
  c: (amount: number) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    setLocaleState(localeManager.getLocale());
    const unsubscribe = localeManager.subscribe(() => {
      setLocaleState(localeManager.getLocale());
      forceUpdate(n => n + 1);
    });
    return unsubscribe;
  }, []);

  const handleSetLocale = useCallback(async (newLocale: Locale) => {
    await localeManager.setLocale(newLocale);
  }, []);

  const value: TranslationContextValue = {
    locale,
    localeConfig: localeManager.getConfig(),
    setLocale: handleSetLocale,
    t: localeManager.t.bind(localeManager),
    d: localeManager.d.bind(localeManager),
    n: localeManager.n.bind(localeManager),
    p: localeManager.p.bind(localeManager),
    c: localeManager.c.bind(localeManager),
    supportedLocales: SUPPORTED_LOCALES,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback to basic translations
    return {
      locale: 'de' as Locale,
      localeConfig: SUPPORTED_LOCALES['de'],
      setLocale: async () => {},
      t: (key: string) => key,
      d: (date: Date | string) => new Date(date).toLocaleDateString(),
      n: (value: number) => value.toString(),
      p: (probability: number) => (probability * 100).toFixed(1) + '%',
      c: (amount: number) => amount.toFixed(2) + ' €',
      supportedLocales: SUPPORTED_LOCALES,
    };
  }
  return context;
}

// Simple hook for non-client components
export function useTranslations() {
  return {
    t: localeManager.t.bind(localeManager),
    d: localeManager.d.bind(localeManager),
    n: localeManager.n.bind(localeManager),
    p: localeManager.p.bind(localeManager),
    c: localeManager.c.bind(localeManager),
  };
}