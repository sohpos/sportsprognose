// packages/core/src/i18n/LocaleManager.ts

export type Locale = 'de' | 'en' | 'es' | 'fr' | 'it';

export interface LocaleConfig {
  code: Locale;
  name: string;
  dateFormat: string;
  numberFormat: string;
  currency: string;
}

export const SUPPORTED_LOCALES: Record<Locale, LocaleConfig> = {
  de: { code: 'de', name: 'Deutsch', dateFormat: 'dd.MM.yyyy', numberFormat: 'de-DE', currency: 'EUR' },
  en: { code: 'en', name: 'English', dateFormat: 'MM/dd/yyyy', numberFormat: 'en-US', currency: 'USD' },
  es: { code: 'es', name: 'Español', dateFormat: 'dd/MM/yyyy', numberFormat: 'es-ES', currency: 'EUR' },
  fr: { code: 'fr', name: 'Français', dateFormat: 'dd/MM/yyyy', numberFormat: 'fr-FR', currency: 'EUR' },
  it: { code: 'it', name: 'Italiano', dateFormat: 'dd/MM/yyyy', numberFormat: 'it-IT', currency: 'EUR' },
};

const STORAGE_KEY = 'sportsprognose_locale';
constDEFAULT_FALLBACK: Locale = 'de';

class LocaleManager {
  private currentLocale: Locale = 'de';
  private fallbackLocale: Locale = DEFAULT_FALLBACK;
  private translations: Map<Locale, Record<string, unknown>> = new Map();
  private loadedLocales: Set<Locale> = new Set();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in SUPPORTED_LOCALES) {
        this.currentLocale = stored as Locale;
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, this.currentLocale);
    }
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  getFallback(): Locale {
    return this.fallbackLocale;
  }

  getConfig(): LocaleConfig {
    return SUPPORTED_LOCALES[this.currentLocale];
  }

  async setLocale(locale: Locale): Promise<void> {
    if (!(locale in SUPPORTED_LOCALES)) {
      console.warn(`Locale ${locale} not supported`);
      return;
    }
    this.currentLocale = locale;
    this.saveToStorage();
    this.notifyListeners();
    
    if (!this.loadedLocales.has(locale)) {
      await this.loadTranslations(locale);
    }
  }

  async loadTranslations(locale: Locale): Promise<void> {
    try {
      const response = await fetch(`/locales/${locale}.json`);
      if (!response.ok) throw new Error(`Failed to load ${locale}`);
      const data = await response.json();
      this.translations.set(locale, data);
      this.loadedLocales.add(locale);
    } catch (error) {
      console.error(`Error loading translations for ${locale}:`, error);
    }
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: unknown = this.translations.get(this.currentLocale);
    
    // Traverse the key path
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to default locale
        value = this.translations.get(this.fallbackLocale);
        for (const fk of keys) {
          if (value && typeof value === 'object' && fk in value) {
            value = (value as Record<string, unknown>)[fk];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    if (typeof value !== 'string') return key;
    
    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => 
        String(params[paramKey] ?? `{${paramKey}}`)
      );
    }
    
    return value;
  }

  d(date: Date | string): string {
    const config = SUPPORTED_LOCALES[this.currentLocale];
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(config.numberFormat);
  }

  n(value: number, decimals = 2): string {
    const config = SUPPORTED_LOCALES[this.currentLocale];
    return value.toLocaleString(config.numberFormat, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  p(probability: number): string {
    return this.n(probability * 100, 1) + '%';
  }

  c(amount: number): string {
    const config = SUPPORTED_LOCALES[this.currentLocale];
    return new Intl.NumberFormat(config.numberFormat, {
      style: 'currency',
      currency: config.currency,
    }).format(amount);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const localeManager = new LocaleManager();
export const { t, d, n, p, c } = {
  t: (key: string, params?: Record<string, string | number>) => localeManager.t(key, params),
  d: (date: Date | string) => localeManager.d(date),
  n: (value: number, decimals?: number) => localeManager.n(value, decimals),
  p: (probability: number) => localeManager.p(probability),
  c: (amount: number) => localeManager.c(amount),
};