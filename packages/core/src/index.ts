// packages/core/src/index.ts

// i18n exports - re-export from LocaleManager
import { 
  localeManager, 
  Locale, 
  LocaleConfig, 
  SUPPORTED_LOCALES,
  NAMESPACES,
  t, d, n, p, c, o 
} from './i18n/LocaleManager';

export { 
  localeManager, 
  Locale, 
  LocaleConfig, 
  SUPPORTED_LOCALES,
  NAMESPACES,
  t, d, n, p, c, o 
};

// Types exports
export * from './types';

// Utils exports
export * from './utils';