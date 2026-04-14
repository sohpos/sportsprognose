// packages/core/src/index.ts - Simple re-exports

export { localeManager } from './i18n/LocaleManager';
export { SUPPORTED_LOCALES } from './i18n/LocaleManager';
export { NAMESPACES } from './i18n/LocaleManager';
export { t, d, n, p, c, o } from './i18n/LocaleManager';

// Type exports
export type { Locale } from './i18n/LocaleManager';
export type { LocaleConfig } from './i18n/LocaleManager';

// Utils
export * from './utils';
export * from './types';