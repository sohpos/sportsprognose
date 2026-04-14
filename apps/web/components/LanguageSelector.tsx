'use client';

import React, { useState, useEffect } from 'react';

// Import from simple-i18n
import { getLocale, setLocale, t } from '../lib/simple-i18n';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageSelector() {
  const [locale, setLocaleState] = useState('de');

  // Load initial locale
  useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  // Handle language change - THIS IS THE KEY FUNCTION
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // 1. Update local state - IMMEDIATE re-render
    setLocaleState(newLocale);
    
    // 2. Save to localStorage
    setLocale(newLocale);
    
    // 3. Force page refresh to show translation
    window.location.reload();
  };

  return (
    <select 
      value={locale} 
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