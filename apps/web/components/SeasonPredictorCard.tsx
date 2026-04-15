// apps/web/components/SeasonPredictorCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSeasonPredictor, type SeasonPredictorResponse } from '@/lib/api/season-predictor';

interface SeasonPredictorCardProps {
  league?: string;
  iterations?: number;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Saison Prognose',
    xp: 'Erwartete Punkte',
    championship: 'Meister',
    relegation: 'Abstieg',
    top4: 'Top 4',
    top6: 'Top 6',
    lastUpdate: 'Letzte Aktualisierung',
    simulations: 'Simulationen',
    loading: 'Laden...',
  },
  en: {
    title: 'Season Prediction',
    xp: 'Expected Points',
    championship: 'Championship',
    relegation: 'Relegation',
    top4: 'Top 4',
    top6: 'Top 6',
    lastUpdate: 'Last Updated',
    simulations: 'Simulations',
    loading: 'Loading...',
  },
  tr: {
    title: 'Sezon Tahmini',
    xp: 'Beklenen Puan',
    championship: 'Şampiyonluk',
    relegation: 'Düşme',
    top4: 'İlk 4',
    top6: 'İlk 6',
    lastUpdate: 'Son Güncelleme',
    simulations: 'Simülasyon',
    loading: 'Yükleniyor...',
  },
};

export function SeasonPredictorCard({ 
  league = 'BL1', 
  iterations = 1000,
  locale = 'de' 
}: SeasonPredictorCardProps) {
  const [data, setData] = useState<SeasonPredictorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[locale] || translations['de'];

  useEffect(() => {
    getSeasonPredictor(league, iterations)
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [league, iterations]);

  if (loading) {
    return (
      <div className="card p-4" data-testid="season-predictor-loading">
        <div className="text-sm text-slate-500">{t.loading}</div>
      </div>
    );
  }

  if (!data?.standings) {
    return null;
  }

  return (
    <div className="card p-4" data-testid="season-predictor">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {t.title}
        </h3>
        <span className="text-xs text-slate-500">
          {data.simulations} {t.simulations}
        </span>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {data.standings.map((team, index) => (
          <div 
            key={team.teamId} 
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            {/* Position */}
            <span className={`w-6 text-xs font-bold ${
              index === 0 ? 'text-yellow-400' :
              index < 4 ? 'text-green-400' :
              index < 6 ? 'text-blue-400' :
              index >= 15 ? 'text-red-400' : 'text-slate-400'
            }`}>
              {index + 1}.
            </span>

            {/* Team name */}
            <span className="flex-1 text-sm font-medium truncate">
              {team.teamName}
            </span>

            {/* Expected Points */}
            <span className="text-sm font-bold text-white w-12 text-right">
              {team.expectedPoints}
            </span>

            {/* Probabilities */}
            <div className="flex gap-1 text-xs">
              {team.championshipProbability > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400" title={t.championship}>
                {team.championshipProbability}%
              </span>
              )}
              {team.top4Probability > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400" title={t.top4}>
                4
              </span>
              )}
              {team.relegationProbability > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400" title={t.relegation}>
                ↓
              </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Last updated */}
      <div className="mt-3 pt-2 border-t border-slate-700 text-xs text-slate-500">
        {t.lastUpdate}: {new Date(data.lastUpdated).toLocaleString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'de-DE')}
      </div>
    </div>
  );
}
