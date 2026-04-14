// packages/core/src/index.ts - Simple re-exports

export { localeManager } from './i18n/LocaleManager';
export { SUPPORTED_LOCALES } from './i18n/LocaleManager';
export { NAMESPACES } from './i18n/LocaleManager';
export { t, d, n, p, c, o } from './i18n/LocaleManager';

// Type exports (use inline for bundler compatibility)
import type { Locale, LocaleConfig } from './i18n/LocaleManager';
export type { Locale, LocaleConfig };

// Utils
export * from './utils';
export * from './types';