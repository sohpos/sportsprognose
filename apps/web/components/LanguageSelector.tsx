'use client';

import React, { useState } from 'react';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const STORAGE_KEY = 'sportsprognose_locale';

export function LanguageSelector() {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Save to localStorage FIRST
    localStorage.setItem(STORAGE_KEY, newLocale);
    
    const savedValue = localStorage.getItem(STORAGE_KEY);
    
    alert('Sprache gesetzt auf: ' + newLocale + '\nGespeichert: ' + savedValue + '\n\nNach OK wird neu geladen...');
    
    // Wait a moment then reload (give time to see alert)
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <select 
      defaultValue="de"
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