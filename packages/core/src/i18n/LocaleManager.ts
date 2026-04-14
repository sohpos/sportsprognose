// packages/core/src/i18n/LocaleManager.ts
// UTF-8 encoded multi-language support with namespaces, fallback, persistence & dynamic loading

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

// Detect browser/System language on startup
function detectSystemLocale(): Locale {
  if (typeof navigator === 'undefined') return 'de';
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in { de: 1, en: 1, es: 1, fr: 1, it: 1 }) {
    return browserLang as Locale;
  }
  return 'de';
}

export const SUPPORTED_LOCALES: Record<Locale, LocaleConfig> = {
  de: { code: 'de', name: 'Deutsch', dateFormat: 'dd.MM.yyyy', numberFormat: 'de-DE', currency: 'EUR', flag: '🇩🇪' },
  en: { code: 'en', name: 'English', dateFormat: 'MM/dd/yyyy', numberFormat: 'en-US', currency: 'USD', flag: '🇬🇧' },
  es: { code: 'es', name: 'Español', dateFormat: 'dd/MM/yyyy', numberFormat: 'es-ES', currency: 'EUR', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'Français', dateFormat: 'dd/MM/yyyy', numberFormat: 'fr-FR', currency: 'EUR', flag: '🇫🇷' },
  it: { code: 'it', name: 'Italiano', dateFormat: 'dd/MM/yyyy', numberFormat: 'it-IT', currency: 'EUR', flag: '🇮🇹' },
};

const STORAGE_KEY = 'sportsprognose_locale';
const DEFAULT_FALLBACK: Locale = 'en';

// Get nested value from object (supports keys like "Algorithms.poisson")
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

type TranslationData = Record<string, Record<string, unknown>>;

class LocaleManager {
  private _currentLocale: Locale;
  private fallbackLocale: Locale = DEFAULT_FALLBACK;
  private translations: Map<Locale, TranslationData> = new Map();
  private loadedLocales: Set<Locale> = new Set();
  private listeners: Set<() => void> = new Set();
  private initialized: boolean = false;

  constructor() {
    // 1. Load saved preference or detect system language
    const saved = this.loadFromStorage();
    this._currentLocale = saved || detectSystemLocale();
  }

  // Initialize on app start
  async init(): Promise<void> {
    if (this.initialized) return;
    await this.loadAllNamespaces(this._currentLocale);
    this.initialized = true;
    this.notifyListeners();
  }

  private loadFromStorage(): Locale | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && stored in SUPPORTED_LOCALES ? stored as Locale : null;
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, this._currentLocale);
  }

  // Public getter for active locale
  get locale(): Locale {
    return this._currentLocale;
  }
  
  get currentLocale(): Locale {
    return this._currentLocale;
  }

  get fallback(): Locale {
    return this.fallbackLocale;
  }

  get config(): LocaleConfig {
    return SUPPORTED_LOCALES[this._currentLocale];
  }

  getConfig(): LocaleConfig {
    return SUPPORTED_LOCALES[this._currentLocale];
  }

  // 2. Dynamic language switching without restart
  async setLocale(locale: Locale): Promise<void> {
    if (!(locale in SUPPORTED_LOCALES)) {
      console.warn(`Locale ${locale} not supported`);
      return;
    }
    
    this._currentLocale = locale;
    
    // 3. Persist to localStorage
    this.saveToStorage();
    
    // Load if not already loaded
    if (!this.loadedLocales.has(locale)) {
      await this.loadAllNamespaces(locale);
    }
    
    this.notifyListeners();
  }

  async loadAllNamespaces(locale: Locale): Promise<void> {
    const data: TranslationData = {};
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

  // Main translation function
  t(key: string, params?: Record<string, string | number>): string {
    const [nsKey, ...rest] = key.split(':');
    let namespace: Namespace | undefined;
    let keyPath: string;
    
    // Parse namespace:key format
    if (rest.length > 0) {
      namespace = nsKey as Namespace;
      keyPath = rest.join(':');
    } else {
      // Auto-detect namespace from key prefix
      const prefix = nsKey.split('.')[0];
      namespace = NAMESPACES.includes(prefix as Namespace) 
        ? prefix as Namespace 
        : 'ui';
      keyPath = nsKey;
    }

    // 1. Try current locale
    let value = this.getTranslation(this._currentLocale, namespace, keyPath);
    
    // 2. Fallback to default language (EN)
    if (value === undefined) {
      value = this.getTranslation(this.fallbackLocale, namespace, keyPath);
    }
    
    // 3. If not found → return key + logging for debugging
    if (value === undefined) {
      const missingKey = `${this._currentLocale}:${namespace}:${keyPath}`;
      console.warn(`[i18n] Missing key: "${missingKey}" (fallback: ${this.fallbackLocale})`);
      return key;
    }

    // Replace parameters (e.g., {goals} -> "2.5")
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, pk) => 
        String(params[pk] ?? `{${pk}}`)
      );
    }
    
    return typeof value === 'string' ? value : key;
  }

  private getTranslation(locale: Locale, namespace: Namespace, keyPath: string): unknown {
    const localeData = this.translations.get(locale);
    if (!localeData || !localeData[namespace]) return undefined;
    return getNestedValue(localeData[namespace], keyPath);
  }

  // Check if key exists (useful for conditional rendering)
  hasKey(key: string): boolean {
    const [nsKey, ...rest] = key.split(':');
    let namespace: Namespace | undefined;
    let keyPath: string;
    
    if (rest.length > 0) {
      namespace = nsKey as Namespace;
      keyPath = rest.join(':');
    } else {
      const prefix = nsKey.split('.')[0];
      namespace = NAMESPACES.includes(prefix as Namespace) ? prefix as Namespace : 'ui';
      keyPath = nsKey;
    }
    
    const currentValue = this.getTranslation(this._currentLocale, namespace, keyPath);
    const fallbackValue = this.getTranslation(this.fallbackLocale, namespace, keyPath);
    
    return currentValue !== undefined || fallbackValue !== undefined;
  }

  // Get missing keys for debugging/reporting
  getMissingKeys(): string[] {
    const missing: string[] = [];
    // This would track keys that were requested but not found
    // In production, you might want to collect these in a Set
    return missing;
  }

  // 4. Formatting functions for dynamic data
  d(date: Date | string, format?: 'short' | 'long' | 'time'): string {
    const cfg = SUPPORTED_LOCALES[this._currentLocale];
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'time') {
      return d.toLocaleTimeString(cfg.numberFormat, { hour: '2-digit', minute: '2-digit' });
    }
    if (format === 'long') {
      return d.toLocaleDateString(cfg.numberFormat, { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
    }
    return d.toLocaleDateString(cfg.numberFormat);
  }

  n(value: number, decimals = 2): string {
    const cfg = SUPPORTED_LOCALES[this._currentLocale];
    return value.toLocaleString(cfg.numberFormat, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // Format probability as percentage
  p(probability: number, decimals = 1): string {
    return this.n(probability * 100, decimals) + '%';
  }

  // Format currency/odds
  c(amount: number, currency?: string): string {
    const cfg = SUPPORTED_LOCALES[this._currentLocale];
    return new Intl.NumberFormat(cfg.numberFormat, {
      style: 'currency',
      currency: currency || cfg.currency,
    }).format(amount);
  }

  // Odds (decimal format 1.xx - sprachabhängig)
  o(odds: number): string {
    return this.n(odds, 2);
  }

  // Subscribe to locale changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l());
  }
}

// Singleton instance
export const localeManager = new LocaleManager();

// Helper exports
export const t = (key: string, params?: Record<string, string | number>) => 
  localeManager.t(key, params);
export const d = (date: Date | string, format?: 'short' | 'long' | 'time') => 
  localeManager.d(date, format);
export const n = (value: number, decimals?: number) => 
  localeManager.n(value, decimals);
export const p = (probability: number, decimals?: number) => 
  localeManager.p(probability, decimals);
export const c = (amount: number, currency?: string) => 
  localeManager.c(amount, currency);
export const o = (odds: number) => localeManager.o(odds);