// Complete translations - use anywhere!

export type Locale = 'de' | 'en' | 'es' | 'fr' | 'it' | 'tr';

export const translations: Record<Locale, Record<string, string>> = {
  de: {
    // Hero
    'app:title': 'KI-Fuleyballprognosen',
    'app:subtitle': 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
    
    // Stats
    'stats:leagues': 'Ligen',
    'stats:predictions': 'Prognosen heute',
    'stats:model': 'Modell',
    
    // Accuracy
    'accuracy:title': 'Trefferquote',
    'accuracy:weeks': '(8 Wochen)',
    'accuracy:exact': 'Exakter Score',
    'accuracy:thisWeek': 'diese Woche',
    'accuracy:avgResult': 'Ø Ergebnis-Genauigkeit',
    'accuracy:predictions': 'Prognosen',
    
    // Matches
    'matches:title': 'Nächste Spiele',
    'matches:showAll': 'Alle anzeigen →',
    'matches:noData': 'Backend nicht erreichbar — starte zuerst den Backend-Server (Port 3002)',
    
    // Prediction
    'prediction:win': 'Sieg',
    'prediction:draw': 'Unentschieden',
    'prediction:loss': 'Niederlage',
    'prediction:confidence': 'sicher',
    'prediction:vs': 'vs',
    'prediction:home': 'Heim',
    'prediction:away': 'Gast',
    'prediction:drawLabel': 'Unentschieden',
    
    // Form
    'form:w': 'W',
    'form:d': 'D',
    'form:l': 'L',
    
    // Days
    'day:monday': 'Mo.',
    'day:tuesday': 'Di.',
    'day:wednesday': 'Mi.',
    'day:thursday': 'Do.',
    'day:friday': 'Fr.',
    'day:saturday': 'Sa.',
    'day:sunday': 'So.',
    
    // Leagues
    'league:bundesliga': 'Bundesliga',
    'league:premierLeague': 'Premier League',
    'league:laLiga': 'La Liga',
    'league:championsLeague': 'Champions League',
    
    // Disclaimer
    'disclaimer:text': '⚠️ Prognosen basieren auf statistischen Modellen und sind kein Aufruf zur Teilnahme an Sportwetten. Realistische Trefferquoten liegen bei 55–65%. Spiele verantwortungsbewusst.',
    
    // Navigation
    'nav:dashboard': 'Dashboard',
    'nav:matches': 'Spiele',
    'nav:accuracy': 'Trefferquote',
  },
  en: {
    // Hero
    'app:title': 'AI Football Predictions',
    'app:subtitle': 'Poisson Model · Real-time Stats · Accuracy Tracking',
    
    // Stats
    'stats:leagues': 'Leagues',
    'stats:predictions': 'Predictions today',
    'stats:model': 'Model',
    
    // Accuracy
    'accuracy:title': 'Accuracy',
    'accuracy:weeks': '(8 weeks)',
    'accuracy:exact': 'Exact Score',
    'accuracy:thisWeek': 'this week',
    'accuracy:avgResult': 'Ø Result Accuracy',
    'accuracy:predictions': 'Predictions',
    
    // Matches
    'matches:title': 'Upcoming Matches',
    'matches:showAll': 'Show all →',
    'matches:noData': 'Backend not reachable — start the backend server first (Port 3002)',
    
    // Prediction
    'prediction:win': 'Win',
    'prediction:draw': 'Draw',
    'prediction:loss': 'Loss',
    'prediction:confidence': 'confidence',
    'prediction:vs': 'vs',
    'prediction:home': 'Home',
    'prediction:away': 'Away',
    'prediction:drawLabel': 'Draw',
    
    // Form
    'form:w': 'W',
    'form:d': 'D',
    'form:l': 'L',
    
    // Days
    'day:monday': 'Mon.',
    'day:tuesday': 'Tue.',
    'day:wednesday': 'Wed.',
    'day:thursday': 'Thu.',
    'day:friday': 'Fri.',
    'day:saturday': 'Sat.',
    'day:sunday': 'Sun.',
    
    // Leagues
    'league:bundesliga': 'Bundesliga',
    'league:premierLeague': 'Premier League',
    'league:laLiga': 'La Liga',
    'league:championsLeague': 'Champions League',
    
    // Disclaimer
    'disclaimer:text': '⚠️ Predictions are based on statistical models and are not a call to participate in sports betting. Realistic hit rates are 55-65%. Play responsibly.',
    
    // Navigation
    'nav:dashboard': 'Dashboard',
    'nav:matches': 'Matches',
    'nav:accuracy': 'Accuracy',
  },
  tr: {
    // Hero
    'app:title': 'Yapay Zeka Futbol Tahminleri',
    'app:subtitle': 'Poisson Modeli · Gerçek Zamanlı İstatistikler',
    
    // Stats
    'stats:leagues': 'Ligler',
    'stats:predictions': 'Bugünkü Tahminler',
    'stats:model': 'Model',
    
    // Accuracy
    'accuracy:title': 'Doğruluk',
    'accuracy:weeks': '(8 hafta)',
    'accuracy:exact': 'Kesin Skor',
    'accuracy:thisWeek': 'bu hafta',
    'accuracy:avgResult': 'Ø Sonuç Doğruluğu',
    'accuracy:predictions': 'Tahminler',
    
    // Matches
    'matches:title': 'Gelecek Maçlar',
    'matches:showAll': 'Tümünü göster →',
    'matches:noData': 'Backend erişilebilir değil — önce backend sunucusunu başlatın (Port 3002)',
    
    // Prediction
    'prediction:win': 'Galibiyet',
    'prediction:draw': 'Beraberlik',
    'prediction:loss': 'Mağlubiyet',
    'prediction:confidence': 'güven',
    'prediction:vs': 'vs',
    'prediction:home': 'Ev',
    'prediction:away': 'Deplasman',
    'prediction:drawLabel': 'Beraberlik',
    
    // Form
    'form:w': 'G',
    'form:d': 'B',
    'form:l': 'M',
    
    // Days
    'day:monday': 'Pzt.',
    'day:tuesday': 'Sal.',
    'day:wednesday': 'Çrş.',
    'day:thursday': 'Prş.',
    'day:friday': 'Cum.',
    'day:saturday': 'Cmt.',
    'day:sunday': 'Paz.',
    
    // Leagues
    'league:bundesliga': 'Bundesliga',
    'league:premierLeague': 'Premier League',
    'league:laLiga': 'La Liga',
    'league:championsLeague': 'Şampiyonlar Ligi',
    
    // Disclaimer
    'disclaimer:text': '⚠️ Tahminler istatistiksel modellere dayalıdır ve spor bahislerine katılma çağrısı değildir. Gerçekçi başarı oranları %55-65 arasındadır. Sorumlu oynayın.',
    
    // Navigation
    'nav:dashboard': 'Panel',
    'nav:matches': 'Maçlar',
    'nav:accuracy': 'Doğruluk',
  },
};

// Get saved locale - use this in any component!
export function getSavedLocale(): string {
  if (typeof window === 'undefined') return 'de';
  return localStorage.getItem('sportsprognose_locale') || 'de';
}

// Translation function - use anywhere!
export function t(key: string): string {
  const locale = getSavedLocale() as Locale;
  return translations[locale]?.[key] || translations['de'][key] || key;
}