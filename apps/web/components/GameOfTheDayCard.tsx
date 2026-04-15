// apps/web/components/GameOfTheDayCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getGameOfTheDay, type GameOfTheDay } from '@/lib/api/game-of-the-day';

interface GameOfTheDayCardProps {
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Spiel des Tages', noData: 'Keine Daten', loading: 'Laden...',
    confidence: 'Sicherheit', suspense: 'Spannung', edge: 'Value',
  },
  en: {
    title: 'Game of the Day', noData: 'No data', loading: 'Loading...',
    confidence: 'Confidence', suspense: 'Suspense', edge: 'Value',
  },
  tr: {
    title: 'Günün Maçı', noData: 'Veri yok', loading: 'Yükleniyor...',
    confidence: 'Güven', suspense: 'Gerilim', edge: 'Değer',
  },
};

// Inline components for simplicity
function ConfidenceHeatbar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence);
  let color = 'bg-red-500';
  if (pct >= 60) color = 'bg-yellow-500';
  if (pct >= 75) color = 'bg-green-500';
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-medium text-slate-400">{pct}%</span>
    </div>
  );
}

export function GameOfTheDayCard({ locale = 'de' }: GameOfTheDayCardProps) {
  const [gotd, setGotd] = useState<GameOfTheDay | null>(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[locale] || translations['de'];

  useEffect(() => {
    getGameOfTheDay()
      .then(data => {
        setGotd(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-4" data-testid="gotd-loading">
        <div className="text-sm text-slate-500">{t.loading}</div>
      </div>
    );
  }

  if (!gotd) {
    return (
      <div className="card p-4" data-testid="gotd-empty">
        <div className="text-sm text-slate-500">{t.noData}</div>
      </div>
    );
  }

  const marketSymbol = gotd.market === 'HOME' ? '1' : gotd.market === 'DRAW' ? 'X' : '2';
  const edgePercent = Math.round(gotd.edge * 100);
  const isPositiveEdge = edgePercent > 0;

  return (
    <div 
      className="card p-4 border-2 border-green-500/30" 
      data-testid="gotd-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-green-400">💎 {t.title}</span>
            <span className="text-xs text-slate-500">{gotd.leagueName}</span>
          </div>
          <div className="text-lg font-bold text-white">
            {gotd.homeTeam} — {gotd.awayTeam}
          </div>
          <div className="text-xs text-slate-400">
            {new Date(gotd.date).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'de-DE', { 
              weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
            })}
          </div>
        </div>
        
        {/* Value Badge */}
        <div className="text-right">
          <div className={`text-xl font-bold ${isPositiveEdge ? 'text-green-400' : 'text-slate-400'}`}>
            {isPositiveEdge ? '+' : ''}{edgePercent}%
          </div>
          <div className="text-xs text-slate-500">{t.edge}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">
              {marketSymbol}
            </span>
            <span className="text-sm text-slate-300">@{gotd.odds.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">{t.confidence}</span>
          <span className="text-slate-400">{Math.round(gotd.confidence)}%</span>
        </div>
        <ConfidenceHeatbar confidence={gotd.confidence} />
      </div>

      {/* Suspense & Score */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500">{t.suspense}</div>
          <div className="text-purple-400 font-bold">
            {(gotd.suspense * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500">Composite</div>
          <div className="text-yellow-400 font-bold">
            {(gotd.score * 100).toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
}
