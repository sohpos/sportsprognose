'use client';

import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '@sportsprognose/core';
import type { Locale } from '@sportsprognose/core';

const STORAGE_KEY = 'sportsprognose_locale';

export function LanguageSelector() {
  // Exactly like user's pattern - use i18n directly
  const { i18n } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    
    // 1. Change i18n language - this ALWAYS works
    i18n.changeLanguage(newLocale);
    
    // 2. Save to localStorage
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-600 text-white hover:border-green-400 focus:border-green-400 focus:outline-none cursor-pointer transition-colors"
    >
      {Object.entries(SUPPORTED_LOCALES).map(([code, config]) => (
        <option key={code} value={code} className="bg-slate-800">
          {config.flag} {config.name}
        </option>
      ))}
    </select>
  );
}