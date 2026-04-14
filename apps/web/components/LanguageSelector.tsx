// apps/web/components/LanguageSelector.tsx

'use client';

import { useTranslation } from './TranslationContext';
import type { Locale } from '@sportsprognose/core';

export function LanguageSelector() {
  const { locale, setLocale, supportedLocales } = useTranslation();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="px-3 py-2 rounded-lg text-sm bg-slate-800 border border-slate-600 text-white hover:border-green-400 focus:border-green-400 focus:outline-none cursor-pointer transition-colors"
    >
      {Object.entries(supportedLocales).map(([code, config]) => (
        <option key={code} value={code} className="bg-slate-800">
          {config.flag} {config.name}
        </option>
      ))}
    </select>
  );
}