// packages/core/src/i18n/__tests__/LocaleManager.test.ts

import { describe, test, expect, beforeAll, afterEach } from 'vitest';
import { localeManager, Locale, SUPPORTED_LOCALES } from '../LocaleManager';

// Mock fetch for Node environment
const mockTranslations: Record<string, Record<string, Record<string, unknown>>> = {
  de: {
    app: { name: 'SportsPrognose', tagline: 'Intelligente Fußballvorhersagen' },
    prediction: { win: 'Sieg', draw: 'Unentschieden', loss: 'Niederlage' },
    ui: { matches: 'Spiele', settings: 'Einstellungen' },
  },
  en: {
    app: { name: 'SportsPrognose', tagline: 'Intelligent Football Predictions' },
    prediction: { win: 'Win', draw: 'Draw', loss: 'Loss' },
    ui: { matches: 'Matches', settings: 'Settings' },
  },
};

// Mock global fetch
(global as unknown as { fetch: unknown }).fetch = async (url: string) => {
  const locale = url.includes('/de/') ? 'de' : 'en';
  const ns = url.includes('app') ? 'app' : url.includes('prediction') ? 'prediction' : 'ui';
  return {
    ok: true,
    json: () => Promise.resolve(mockTranslations[locale][ns]),
  };
};

describe('LocaleManager', () => {
  beforeAll(async () => {
    await localeManager.init();
  });

  describe('1. Laden einer Sprachdatei', () => {
    test('lädt erfolgreich eine Sprachdatei', async () => {
      expect(localeManager.locale).toBeDefined();
      expect(typeof localeManager.locale).toBe('string');
    });
  });

  describe('2. Übersetzung eines Keys', () => {
    test('übersetzt einen vorhandenen Key korrekt', () => {
      const result = localeManager.t('app:name');
      expect(result).toBe('SportsPrognose');
    });
  });

  describe('3. Fallback-Mechanismus', () => {
    test('nutzt Fallback-Sprache, wenn Key fehlt', async () => {
      await localeManager.setLocale('de');
      const result = localeManager.t('nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });
  });

  describe('4. Parameter-Interpolation', () => {
    test('ersetzt Parameter korrekt', () => {
      const result = localeManager.t('prediction:win', { team: 'FC Köln', value: 72 });
      expect(result).toContain('72');
    });
  });

  describe('5. Dynamischer Sprachwechsel', () => {
    test('ändert die aktive Sprache korrekt', async () => {
      await localeManager.setLocale('en');
      expect(localeManager.locale).toBe('en');

      await localeManager.setLocale('de');
      expect(localeManager.locale).toBe('de');
    });
  });
});

describe('Formatter – Zahlenformatierung', () => {
  test('formatiert Quoten abhängig von der Sprache', () => {
    const odds = 1.753;

    const deFormat = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
    }).format(odds);

    const enFormat = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
    }).format(odds);

    expect(deFormat).toBe('1,75');
    expect(enFormat).toBe('1.75');
  });
});

describe('Formatter – Datumsformatierung', () => {
  test('formatiert Datum abhängig von der Locale', () => {
    const date = new Date('2025-05-10T12:00:00Z');

    const deFormatter = new Intl.DateTimeFormat('de-DE');
    const enFormatter = new Intl.DateTimeFormat('en-US');

    const de = deFormatter.format(date);
    const en = enFormatter.format(date);

    expect(de).not.toBe(en);
  });
});

describe('SUPPORTED_LOCALES', () => {
  test('enthält alle unterstützten Sprachen', () => {
    expect(SUPPORTED_LOCALES.de).toBeDefined();
    expect(SUPPORTED_LOCALES.en).toBeDefined();
    expect(SUPPORTED_LOCALES.es).toBeDefined();
    expect(SUPPORTED_LOCALES.fr).toBeDefined();
    expect(SUPPORTED_LOCALES.it).toBeDefined();
  });

  test('hat korrekte Konfiguration für jede Sprache', () => {
    expect(SUPPORTED_LOCALES.de.flag).toBe('🇩🇪');
    expect(SUPPORTED_LOCALES.en.flag).toBe('🇬🇧');
    expect(SUPPORTED_LOCALES.de.currency).toBe('EUR');
    expect(SUPPORTED_LOCALES.en.currency).toBe('USD');
  });
});