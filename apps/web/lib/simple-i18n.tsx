import React, { useState, useEffect } from 'react';

// Simple i18n translations (no external library)
const translations: Record<string, Record<string, string>> = {
  de: {
    'app:title': 'KI-Fußballprognosen',
    'app:subtitle': 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
    'matches:title': 'Nächste Spiele',
    'matches:all': 'Alle anzeigen →',
    'stats:leagues': 'Ligen',
    'stats:predictions': 'Prognosen heute',
    'stats:model': 'Modell',
    'prediction:win': 'Sieg',
    'prediction:draw': 'Unentschieden',
    'prediction:loss': 'Niederlage',
    'prediction:confidence': 'sicher',
    'accuracy:title': 'Trefferquote',
  },
  en: {
    'app:title': 'AI Football Predictions',
    'app:subtitle': 'Poisson Model · Real-time Stats · Accuracy Tracking',
    'matches:title': 'Upcoming Matches',
    'matches:all': 'Show all →',
    'stats:leagues': 'Leagues',
    'stats:predictions': 'Predictions today',
    'stats:model': 'Model',
    'prediction:win': 'Win',
    'prediction:draw': 'Draw',
    'prediction:loss': 'Loss',
    'prediction:confidence': 'confidence',
    'accuracy:title': 'Accuracy',
  },
};

const STORAGE_KEY = 'sportsprognose_locale';

// Get current language
export function getLocale(): string {
  if (typeof window === 'undefined') return 'de';
  return localStorage.getItem(STORAGE_KEY) || 'de';
}

// Set language and return the new language
export function setLocale(locale: string): string {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
    // Dispatch event so all components update
    window.dispatchEvent(new CustomEvent('localechanged', { detail: locale }));
  }
  return locale;
}

// Translate a key
export function t(key: string, locale?: string): string {
  const currentLocale = locale || getLocale();
  // First try current locale, then fallback to 'en', then return key
  return translations[currentLocale]?.[key] 
    || translations['en']?.[key]
    || translations['de']?.[key]
    || key;
}

// Test function - returns true if all tests pass
export function runTests(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  
  try {
    // Test 1: getLocale returns default
    const defaultLocale = getLocale();
    results.push(`Test 1 - Default locale: ${defaultLocale === 'de' ? '✓' : '✗'}`);
    
    // Test 2: setLocale changes locale
    setLocale('en');
    const newLocale = getLocale();
    results.push(`Test 2 - Set locale to 'en': ${newLocale === 'en' ? '✓' : '✗'}`);
    
    // Test 3: setLocale back to 'de'
    setLocale('de');
    const backToDe = getLocale();
    results.push(`Test 3 - Set locale back to 'de': ${backToDe === 'de' ? '✓' : '✗'}`);
    
    // Test 4: t() returns German translation
    const germanTitle = t('app:title', 'de');
    results.push(`Test 4 - German translation: ${germanTitle === 'KI-Fußballprognosen' ? '✓' : '✗'}`);
    
    // Test 5: t() returns English translation
    const englishTitle = t('app:title', 'en');
    results.push(`Test 5 - English translation: ${englishTitle === 'AI Football Predictions' ? '✓' : '✗'}`);
    
    // Test 6: t() returns key for missing (new behavior)
    const fallback = t('nonexistent:key', 'de');
    results.push(`Test 6 - Missing key returns key: ${fallback === 'nonexistent:key' ? '✓' : '✗'}`);
    
    const passed = results.filter(r => r.includes('✓')).length === 6;
    return { passed, results };
    
  } catch (e) {
    results.push(`Error: ${e}`);
    return { passed: false, results };
  }
}

// React component for testing
export function LanguageSelector() {
  const [locale, setLocaleState] = useState<string>('de');

  useEffect(() => {
    setLocaleState(getLocale());
    
    const handler = (e: Event) => {
      setLocaleState((e as CustomEvent).detail);
    };
    window.addEventListener('localechanged', handler);
    return () => window.removeEventListener('localechanged', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  return (
    <select value={locale} onChange={handleChange}>
      <option value="de">Deutsch</option>
      <option value="en">English</option>
    </select>
  );
}