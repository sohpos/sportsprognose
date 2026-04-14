'use client';

import React from 'react';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const STORAGE_KEY = 'sportsprognose_locale';

export function LanguageSelector() {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    localStorage.setItem(STORAGE_KEY, newLocale);
    window.location.reload();
  };

  // Read from localStorage on first render - this fixes the jumping!
  const savedLocale = typeof window !== 'undefined' 
    ? (localStorage.getItem(STORAGE_KEY) || 'de')
    : 'de';

  return (
    <select 
      defaultValue={savedLocale}
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