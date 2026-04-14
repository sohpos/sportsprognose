'use client';

import React from 'react';
import { setLocale, getLocale } from '../lib/simple-i18n';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageSelector() {
  // Get current locale from localStorage
  const currentLocale = getLocale();

  // Handle change - IMMEDIATE reload, no waiting
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Save to localStorage
    localStorage.setItem('sportsprognose_locale', newLocale);
    
    // RELOAD THE PAGE NOW!
    window.location.reload();
    return;
  };

  return (
    <select 
      value={currentLocale} 
      onChange={handleChange}
      className="px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-600 text-white hover:border-green-400 focus:border-green-400 focus:outline-none cursor-pointer transition-colors"
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}