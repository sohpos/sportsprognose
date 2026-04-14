// apps/web/components/LanguageSelector.tsx

'use client';

import { useTranslation } from './TranslationContext';
import type { Locale } from '@sportsprognose/core';

export function LanguageSelector() {
  const { locale, setLocale, supportedLocales } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
      >
        {Object.entries(supportedLocales).map(([code, config]) => (
          <option key={code} value={code}>
            {config.name}
          </option>
        ))}
      </select>
    </div>
  );
}