'use client';

import React, { useState, useEffect } from 'react';
import { SUPPORTED_LOCALES } from '@sportsprognose/core';
import type { Locale } from '@sportsprognose/core';

const STORAGE_KEY = 'sportsprognose_locale';

export function LanguageSelector() {
  const [locale, setLocale] = useState<Locale>('de');

  // Load saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && saved in SUPPORTED_LOCALES) {
      setLocale(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setLocale(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    window.dispatchEvent(new CustomEvent('localechanged', { detail: newLocale }));
  };

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