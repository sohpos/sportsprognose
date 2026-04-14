'use client';

import React from 'react';

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
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, newLocale);
    
    // Show confirmation
    alert('Sprache geändert zu: ' + newLocale + '\nDie Seite wird neu geladen...');
    
    // Reload
    window.location.reload();
  };

  // On first load - check localStorage but don't use it to set initial value
  // This prevents hydration mismatch
  const initialValue = 'de'; // Always start with 'de', then in useEffect it will update

  return (
    <select 
      defaultValue={initialValue}
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