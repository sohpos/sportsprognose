// apps/web/components/ValueHistoryChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { getValueHistory, type ValueHistoryResponse } from '@/lib/api/value-history';

interface ValueHistoryChartProps {
  teamId: number;
  limit?: number;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Value Verlauf', noData: 'Keine Daten',
    positive: 'Positive', negative: 'Negative', neutral: 'Neutrale',
    avgEdge: 'Ø Edge', last10: 'Letzte 10',
  },
  en: {
    title: 'Value History', noData: 'No data',
    positive: 'Positive', negative: 'Negative', neutral: 'Neutral',
    avgEdge: 'Avg Edge', last10: 'Last 10',
  },
  tr: {
    title: 'Değer Geçmişi', noData: 'Veri yok',
    positive: 'Pozitif', negative: 'Negatif', neutral: 'Nötr',
    avgEdge: 'Ort Edge', last10: 'Son 10',
  },
};

export function ValueHistoryChart({ teamId, limit = 10, locale = 'de' }: ValueHistoryChartProps) {
  const [data, setData] = useState<ValueHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[locale] || translations['de'];

  useEffect(() => {
    getValueHistory(teamId, limit)
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [teamId, limit]);

  if (loading) {
    return <div className="card p-4 text-sm text-slate-500">{t.noData}</div>;
  }

  if (!data?.valueHistory?.length) {
    return <div className="card p-4 text-sm text-slate-500">{t.noData}</div>;
  }

  const { valueHistory, summary } = data;

  return (
    <div className="card p-4" data-testid="value-history">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {t.title}
        </h3>
        <span className="text-xs text-slate-500">
          {t.last10}
        </span>
      </div>

      {/* Chart bars */}
      <div className="flex items-end gap-1 h-20 mb-3">
        {valueHistory.slice(0, 10).map((item, i) => {
          const height = Math.min(Math.abs(item.edge) * 2, 100);
          const isPositive = item.edge > 0;
          const color = isPositive ? 'bg-green-500' : item.edge < 0 ? 'bg-red-500' : 'bg-slate-600';
          
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center"
              title={`${item.date}: ${item.edge > 0 ? '+' : ''}${item.edge}%`}
            >
              <div
                className={`w-full ${color} rounded-t transition-all hover:opacity-80`}
                style={{ height: `${height}%` }}
              />
              <span className="text-[8px] text-slate-500 mt-1">
                {item.edge > 0 ? '+' : ''}{item.edge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="text-center">
          <div className="text-green-400 font-bold">+{summary.positiveValue}</div>
          <div className="text-slate-500">{t.positive}</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 font-bold">-{summary.negativeValue}</div>
          <div className="text-slate-500">{t.negative}</div>
        </div>
        <div className="text-center">
          <div className="text-slate-400 font-bold">{summary.neutral}</div>
          <div className="text-slate-500">{t.neutral}</div>
        </div>
        <div className="text-center">
          <div className={`font-bold ${summary.avgEdge >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.avgEdge > 0 ? '+' : ''}{summary.avgEdge}%
          </div>
          <div className="text-slate-500">{t.avgEdge}</div>
        </div>
      </div>
    </div>
  );
}
