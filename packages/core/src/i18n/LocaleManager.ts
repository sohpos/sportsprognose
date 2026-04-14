// packages/core/src/i18n/LocaleManager.ts
// UTF-8 encoded multi-language support with namespaces and fallback

export type Locale = 'de' | 'en' | 'es' | 'fr' | 'it';

export type Namespace = 'app' | 'prediction' | 'errors' | 'ui' | 'match' | 'league' | 'settings';

export const NAMESPACES: Namespace[] = [
  'app', 'prediction', 'errors', 'ui', 'match', 'league', 'settings'
];

export interface LocaleConfig {
  code: Locale;
  name: string;
  dateFormat: string;
  numberFormat: string;
  currency: string;
  flag: string;
}

export const SUPPORTED_LOCALES: Record<Locale, LocaleConfig> = {
  de: { code: 'de', name: 'Deutsch', dateFormat: 'dd.MM.yyyy', numberFormat: 'de-DE', currency: 'EUR', flag: '🇩🇪' },
  en: { code: 'en', name: 'English', dateFormat: 'MM/dd/yyyy', numberFormat: 'en-US', currency: 'USD', flag: '🇬🇧' },
  es: { code: 'es', name: 'Español', dateFormat: 'dd/MM/yyyy', numberFormat: 'es-ES', currency: 'EUR', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'Français', dateFormat: 'dd/MM/yyyy', numberFormat: 'fr-FR', currency: 'EUR', flag: '🇫🇷' },
  it: { code: 'it', name: 'Italiano', dateFormat: 'dd/MM/yyyy', numberFormat: 'it-IT', currency: 'EUR', flag: '🇮🇹' },
};

const STORAGE_KEY = 'sportsprognose_locale';
const DEFAULT_LOCALE: Locale = 'de';
const DEFAULT_FALLBACK: Locale = 'en';

// Nested key getter
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

class LocaleManager {
  private currentLocale: Locale = DEFAULT_LOCALE;
  private fallbackLocale: Locale = DEFAULT_FALLBACK;
  private translations: Map<Locale, Record<string, Record<string, unknown>>> = new Map();
  private loadedLocales: Set<Locale> = new Set();
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in SUPPORTED_LOCALES) {
        this.currentLocale = stored as Locale;
      }
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
    }
    this.notifyListeners();
    if (!this.loadedLocales.has(locale)) {
      await this.loadAllNamespaces(locale);
    }
  }

  async loadAllNamespaces(locale: Locale): Promise<void> {
    const data: Record<string, Record<string, unknown>> = {};
    for (const ns of NAMESPACES) {
      try {
        const res = await fetch(`/locales/${locale}/${ns}.json`);
        if (res.ok) {
          data[ns] = await res.json();
        }
      } catch (e) {
        console.warn(`Missing namespace ${ns} for ${locale}`);
      }
    }
    this.translations.set(locale, data);
    this.loadedLocales.add(locale);
  }

  // Main translation function with namespace support
  t(key: string, params?: Record<string, string | number>): string {
    // Parse namespace:key format (e.g., "prediction.win" or "errors.notFound")
    const [nsKey, ...rest] = key.split(':');
    let namespace: Namespace | undefined;
    let keyPath: string;
    
    if (rest.length > 0) {
      // Format: namespace:key
      namespace = nsKey as Namespace;
      keyPath = rest.join(':');
    } else {
      // Auto-detect namespace from key prefix
      const prefix = nsKey.split('.')[0];
      if (NAMESPACES.includes(prefix as Namespace)) {
        namespace = prefix as Namespace;
        keyPath = nsKey.slice(prefix.length + 1);
      } else {
        namespace = 'ui';
        keyPath = nsKey;
      }
    }

    // Try current locale
    let value = this.getTranslation(this.currentLocale, namespace, keyPath);
    
    // Fallback to default language
    if (value === undefined) {
      value = this.getTranslation(this.fallbackLocale, namespace, keyPath);
    }
    
    // Return key if not found
    if (value === undefined) {
      return key;
    }

    // Replace parameters
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, pk) => 
        String(params[pk] ?? `{${pk}}`)
      );
    }
    
    return typeof value === 'string' ? value : key;
  }

  private getTranslation(locale: Locale, namespace: Namespace | undefined, keyPath: string): unknown {
    if (!namespace) return undefined;
    const localeData = this.translations.get(locale);
    if (!localeData || !localeData[namespace]) return undefined;
    return getNestedValue(localeData[namespace], keyPath);
  }

  // Formatting functions
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
    this.listeners.forEach(l => l());
  }
}

export const localeManager = new LocaleManager();

// Helper object for direct usage
export const t = (key: string, params?: Record<string, string | number>) => 
  localeManager.t(key, params);
export const d = (date: Date | string) => localeManager.d(date);
export const n = (value: number, decimals?: number) => localeManager.n(value, decimals);
export const p = (probability: number) => localeManager.p(probability);
export const c = (amount: number) => localeManager.c(amount);