// apps/web/components/PredictionCard.tsx

'use client';

import { useTranslation } from './TranslationContext';
import { localeManager } from '@sportsprognose/core';

interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string | Date;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  league: string;
}

interface Props {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: Props) {
  const { t, d, p, o, locale } = useTranslation();

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white">
      {/* Dynamic date formatting */}
      <div className="text-sm text-gray-400 mb-2">
        {d(prediction.kickoff, 'long')}
      </div>
      
      {/* Teams (stay in original language) */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">{prediction.homeTeam}</span>
        <span className="text-gray-500">vs</span>
        <span className="font-bold">{prediction.awayTeam}</span>
      </div>
      
      {/* Probabilities as percentage per locale */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('prediction:homeWin')}</span>
          <span>{p(prediction.homeWinProb)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('prediction:draw')}</span>
          <span>{p(prediction.drawProb)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('prediction:awayWin')}</span>
          <span>{p(prediction.awayWinProb)}</span>
        </div>
      </div>
      
      {/* Odds (decimal format 1.xx) */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-400">{t('prediction:win')}</div>
            <div className="font-bold">{o(prediction.odds.home)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">{t('prediction:draw')}</div>
            <div className="font-bold">{o(prediction.odds.draw)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">{t('prediction:loss')}</div>
            <div className="font-bold">{o(prediction.odds.away)}</div>
          </div>
        </div>
      </div>
      
      {/* League info */}
      <div className="mt-4 text-xs text-gray-500">
        {t(`league:${prediction.league}`)}
      </div>
    </div>
  );
}

// Backend: providing locale to API
export function getBackendLocale(): string {
  return localeManager.locale;
}