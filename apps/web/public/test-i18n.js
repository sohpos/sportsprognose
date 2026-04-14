/**
 * Simple Manual Test for Language Switching
 * Run in browser console at http://localhost:3000
 */

import { getLocale, setLocale, t } from './lib/simple-i18n';

// Test 1: Check current locale
console.log('Current locale:', getLocale());

// Test 2: Change to English
setLocale('en');
console.log('After setLocale("en"):', getLocale());
console.log('Translation test:', t('app:title'));

// Test 3: Change back to German  
setLocale('de');
console.log('After setLocale("de"):', getLocale());
console.log('Translation test:', t('app:title'));

console.log('\n✅ If these values change, the i18n works!');
console.log('The issue is in the React component rendering, not the i18n logic.');