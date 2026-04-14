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
  // Get current locale from localStorage
  const [currentLocale, setCurrentLocale] = React.useState('de');

  // Load on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCurrentLocale(saved);
    }
  }, []);

  // Handle change - IMMEDIATE reload with debug
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Save to localStorage first
    localStorage.setItem(STORAGE_KEY, newLocale);
    
    // Log to console for debugging
    console.log('Setting locale to:', newLocale);
    console.log('localStorage value:', localStorage.getItem(STORAGE_KEY));
    
    // RELOAD NOW!
    window.location.reload();
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