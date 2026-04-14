'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_LOCALES, type Locale } from '@sportsprognose/core';

const STORAGE_KEY = 'sportsprognose_locale';

export function LanguageSelector() {
  // Exactly like user's example: useState to hold language
  const [locale, setLocale] = useState<Locale>('de');

  // Load saved language on mount - like user's useEffect
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && saved in SUPPORTED_LOCALES) {
      setLocale(saved);
    }
  }, []);

  // Exactly like user's changeLang function
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    
    // 1. Update React state (like user's setLang)
    setLocale(newLocale);
    
    // 2. Save to localStorage (like user's localStorage.setItem)
    localStorage.setItem(STORAGE_KEY, newLocale);
    
    // 3. Force re-render of all subscribers by dispatching event
    window.dispatchEvent(new CustomEvent('localechanged', { detail: newLocale }));
  };

  // Exactly like user's JSX: value=lang onChange=changeLang
  return (
    <select
      value={locale}
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

// Get current locale for other components
export function getCurrentLocale(): Locale {
  if (typeof window === 'undefined') return 'de';
  return (localStorage.getItem(STORAGE_KEY) as Locale) || 'de';
}