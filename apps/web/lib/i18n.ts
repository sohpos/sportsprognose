import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Get saved language or default to 'de'
const savedLang = typeof window !== 'undefined' 
  ? (localStorage.getItem('sportsprognose_locale') || 'de')
  : 'de';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: {
          'app:title': 'KI-Fußballprognosen',
          'app:subtitle': 'Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking',
          'matches:title': 'Nächste Spiele',
          'matches:all': 'Alle anzeigen →',
          'stats:leagues': 'Ligen',
          'stats:predictions': 'Prognosen heute',
          'stats:model': 'Modell',
          'prediction:win': 'Sieg',
          'prediction:draw': 'Unentschieden',
          'prediction:loss': 'Niederlage',
          'prediction:confidence': 'sicher',
          'accuracy:title': 'Trefferquote',
        }
      },
      en: {
        translation: {
          'app:title': 'AI Football Predictions',
          'app:subtitle': 'Poisson Model · Real-time Stats · Accuracy Tracking',
          'matches:title': 'Upcoming Matches',
          'matches:all': 'Show all →',
          'stats:leagues': 'Leagues',
          'stats:predictions': 'Predictions today',
          'stats:model': 'Model',
          'prediction:win': 'Win',
          'prediction:draw': 'Draw',
          'prediction:loss': 'Loss',
          'prediction:confidence': 'confidence',
          'accuracy:title': 'Accuracy',
        }
      },
      es: {
        translation: {
          'app:title': 'Predicciones de Fútbol IA',
          'app:subtitle': 'Modelo Poisson · Estadísticas en Vivo',
          'matches:title': 'Próximos Partidos',
          'matches:all': 'Ver todos →',
          'stats:leagues': 'Ligas',
          'stats:predictions': 'Predicciones hoy',
          'stats:model': 'Modelo',
          'prediction:win': 'Victoria',
          'prediction:draw': 'Empate',
          'prediction:loss': 'Derrota',
          'prediction:confidence': 'confianza',
          'accuracy:title': 'Precisión',
        }
      },
      fr: {
        translation: {
          'app:title': 'Prédictions Football IA',
          'app:subtitle': 'Modèle Poisson · Statistiques en Direct',
          'matches:title': 'Matchs à Venir',
          'matches:all': 'Voir tout →',
          'stats:leagues': 'Ligues',
          'stats:predictions': "Prédictions aujourd'hui",
          'stats:model': 'Modèle',
          'prediction:win': 'Victoire',
          'prediction:draw': 'Match nul',
          'prediction:loss': 'Défaite',
          'prediction:confidence': 'confiance',
          'accuracy:title': 'Précision',
        }
      },
      it: {
        translation: {
          'app:title': 'Previsioni Calcio IA',
          'app:subtitle': 'Modello Poisson · Statistiche in Tempo Reale',
          'matches:title': 'Prossime Partite',
          'matches:all': 'Vedi tutte →',
          'stats:leagues': 'Leghe',
          'stats:predictions': 'Previsioni oggi',
          'stats:model': 'Modello',
          'prediction:win': 'Vittoria',
          'prediction:draw': 'Pareggio',
          'prediction:loss': 'Sconfitta',
          'prediction:confidence': 'fiducia',
          'accuracy:title': 'Precisione',
        }
      }
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;