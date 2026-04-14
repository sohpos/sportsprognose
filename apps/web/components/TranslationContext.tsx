'use client';

import React, { createContext, useContext } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '@sportsprognose/core';
import type { Locale, LocaleConfig } from '@sportsprognose/core';
import '../lib/i18n';

// Simple context
const TranslationContext = createContext<{
  locale: Locale;
  config: LocaleConfig;
  isInitialized: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}>({
  locale: 'de',
  config: SUPPORTED_LOCALES['de'],
  isInitialized: false,
  setLocale: () => {},
  t: (key) => key,
  supportedLocales: SUPPORTED_LOCALES,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  // Use react-i18next directly - THIS IS THE USER'S PATTERN
  const { t, i18n } = useI18nextTranslation();
  
  const value = {
    locale: (i18n.language || 'de') as Locale,
    config: SUPPORTED_LOCALES[i18n.language as Locale] || SUPPORTED_LOCALES['de'],
    isInitialized: true,
    setLocale: (newLocale: Locale) => {
      i18n.changeLanguage(newLocale);  // THIS ALWAYS WORKS
      localStorage.setItem('sportsprognose_locale', newLocale);
    },
    t: (key: string) => t(key),
    supportedLocales: SUPPORTED_LOCALES,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// Use the context
export function useTranslation() {
  return useContext(TranslationContext);
}