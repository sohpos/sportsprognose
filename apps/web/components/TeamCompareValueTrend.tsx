// apps/web/components/TeamCompareValueTrend.tsx
'use client';

interface ValueTrend {
  date: string;
  edge: number;
  result?: string;
}

interface TeamCompareValueTrendProps {
  valueA?: {
    positiveValue: number;
    negativeValue: number;
    avgEdge: number;
    history?: ValueTrend[];
  };
  valueB?: {
    positiveValue: number;
    negativeValue: number;
    avgEdge: number;
    history?: ValueTrend[];
  };
  teamAName?: string;
  teamBName?: string;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: { 
    title: 'Value Trend', 
    teamA: 'Team A', 
    teamB: 'Team B',
    positive: 'Positiv',
    negative: 'Negativ',
    avgEdge: 'Ø Edge',
  },
  en: { 
    title: 'Value Trend', 
    teamA: 'Team A', 
    teamB: 'Team B',
    positive: 'Positive',
    negative: 'Negative',
    avgEdge: 'Avg Edge',
  },
  tr: { 
    title: 'Değer Trendi', 
    teamA: 'Takım A', 
    teamB: 'Takım B',
    positive: 'Pozitif',
    negative: 'Negatif',
    avgEdge: 'Ort Edge',
  },
};

export function TeamCompareValueTrend({ 
  valueA, 
  valueB, 
  teamAName = 'Team A', 
  teamBName = 'Team B',
  locale = 'de' 
}: TeamCompareValueTrendProps) {
  const t = translations[locale] || translations['de'];

  // Get edge values with fallbacks
  const edgeA = valueA?.avgEdge || 0;
  const edgeB = valueB?.avgEdge || 0;
  const posA = valueA?.positiveValue || 0;
  const posB = valueB?.positiveValue || 0;
  const negA = valueA?.negativeValue || 0;
  const negB = valueB?.negativeValue || 0;

  // Determine which team has better value
  const betterEdge = edgeA > edgeB ? teamAName : edgeB > edgeA ? teamBName : '=';

  // Calculate value trend from history if available
  const getTrend = (history?: ValueTrend[]) => {
    if (!history || history.length < 2) return 0;
    const recent = history.slice(-3).reduce((sum, v) => sum + v.edge, 0) / 3;
    const older = history.slice(0, 3).reduce((sum, v) => sum + v.edge, 0) / 3;
    return recent - older;
  };

  return (
    <div className="card p-4" data-testid="compare-value-trend">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        {t.title}
      </h3>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Team A */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-300">{teamAName}</div>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-slate-500">{t.positive}:</span>
              <span className="text-green-400 ml-1 font-bold">+{posA}</span>
            </div>
            <div>
              <span className="text-slate-500">{t.negative}:</span>
              <span className="text-red-400 ml-1 font-bold">-{negA}</span>
            </div>
          </div>
          <div className="text-lg font-bold text-green-400">
            {edgeA > 0 ? '+' : ''}{edgeA.toFixed(1)}% {t.avgEdge}
          </div>
        </div>

        {/* Team B */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-300 text-right">{teamBName}</div>
          <div className="flex gap-4 text-xs justify-end">
            <div>
              <span className="text-slate-500">{t.positive}:</span>
              <span className="text-green-400 ml-1 font-bold">+{posB}</span>
            </div>
            <div>
              <span className="text-slate-500">{t.negative}:</span>
              <span className="text-red-400 ml-1 font-bold">-{negB}</span>
            </div>
          </div>
          <div className="text-lg font-bold text-green-400 text-right">
            {edgeB > 0 ? '+' : ''}{edgeB.toFixed(1)}% {t.avgEdge}
          </div>
        </div>
      </div>

      {/* Visual comparison bar */}
      <div className="relative pt-3 border-t border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Better Value:</span>
          <span className={`font-bold ${betterEdge !== '=' ? 'text-yellow-400' : 'text-slate-400'}`}>
            {betterEdge}
          </span>
        </div>
        
        {/* Bar visualization */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-500 w-12">{teamAName}</span>
          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500"
              style={{ width: `${Math.max(5, Math.min(95, 50 + (edgeA - edgeB) * 2))}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-12 text-right">{teamBName}</span>
        </div>
      </div>
    </div>
  );
}
