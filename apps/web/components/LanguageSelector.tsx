'use client';

import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LOCALES, type Locale } from '@sportsprognose/core';

const STORAGE_KEY = 'sportsprognose_locale';

// Global state for locale - simple approach
let globalLocale: Locale = 'de';
let listeners: Set<() => void> = new Set();

export function getGlobalLocale(): Locale {
  return globalLocale;
}

export function setGlobalLocale(loc: Locale) {
  globalLocale = loc;
  localStorage.setItem(STORAGE_KEY, loc);
  listeners.forEach(fn => fn());
}

export function subscribeToLocale(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function LanguageSelector() {
  const [, update] = useState(0);
  
  useEffect(() => {
    // Load saved locale
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && saved in SUPPORTED_LOCALES) {
      globalLocale = saved;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setGlobalLocale(newLocale);
    update(n => n + 1); // Force re-render
  };

  return (
    <select
      value={globalLocale}
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