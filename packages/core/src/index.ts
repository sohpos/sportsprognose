// packages/core/src/index.ts - Simple re-exports

// i18n
export { localeManager } from './i18n/LocaleManager';
export { SUPPORTED_LOCALES } from './i18n/LocaleManager';
export { NAMESPACES } from './i18n/LocaleManager';
export { t, d, n, p, c, o } from './i18n/LocaleManager';

// Config
export * from './config/leagues';

// Adapters
export * from './adapters';

// Unified Types
export * from './types/unified';

// Type exports (use inline for bundler compatibility)
import type { Locale, LocaleConfig } from './i18n/LocaleManager';
export type { Locale, LocaleConfig };

// Utils
export * from './utils';
export * from './types';
