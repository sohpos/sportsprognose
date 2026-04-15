// apps/web/components/TeamCompareMatrix.tsx
'use client';

import { ScoreMatrixHeatmap } from './ScoreMatrixHeatmap';

interface TeamCompareMatrixProps {
  matrixA?: number[][];
  matrixB?: number[][];
  teamAName?: string;
  teamBName?: string;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: { title: 'Score-Matrix Vergleich', teamA: 'Team A', teamB: 'Team B' },
  en: { title: 'Score Matrix Comparison', teamA: 'Team A', teamB: 'Team B' },
  tr: { title: 'Skor Matrisi Karşılaştırması', teamA: 'Takım A', teamB: 'Takım B' },
};

export function TeamCompareMatrix({ 
  matrixA, 
  matrixB, 
  teamAName = 'Team A', 
  teamBName = 'Team B',
  locale = 'de' 
}: TeamCompareMatrixProps) {
  const t = translations[locale] || translations['de'];

  // Convert 2D array to ScoreCell format for ScoreMatrixHeatmap
  const convertToCells = (matrix: number[][] | undefined) => {
    if (!matrix || matrix.length === 0) return [];
    const cells = [];
    for (let h = 0; h <= 5; h++) {
      for (let a = 0; a <= 5; a++) {
        cells.push({
          homeGoals: h,
          awayGoals: a,
          probability: matrix[h]?.[a] || 0,
        });
      }
    }
    return cells;
  };

  // Calculate suspense for each team
  const calcSuspense = (matrix: number[][] | undefined) => {
    if (!matrix || matrix.length === 0) return 0.5;
    const flat = matrix.flat();
    const max = Math.max(...flat);
    return 1 - max;
  };

  const suspenseA = calcSuspense(matrixA);
  const suspenseB = calcSuspense(matrixB);

  return (
    <div className="card p-4" data-testid="compare-matrix">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        {t.title}
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Team A */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">{teamAName}</span>
            <span className="text-xs text-purple-400">
              {(suspenseA * 100).toFixed(0)}% Spannung
            </span>
          </div>
          {matrixA ? (
            <ScoreMatrixHeatmap matrix={convertToCells(matrixA)} locale={locale} />
          ) : (
            <div className="text-xs text-slate-500">Keine Daten</div>
          )}
        </div>

        {/* Team B */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">{teamBName}</span>
            <span className="text-xs text-purple-400">
              {(suspenseB * 100).toFixed(0)}% Spannung
            </span>
          </div>
          {matrixB ? (
            <ScoreMatrixHeatmap matrix={convertToCells(matrixB)} locale={locale} />
          ) : (
            <div className="text-xs text-slate-500">Keine Daten</div>
          )}
        </div>
      </div>

      {/* Suspense comparison bar */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Spannungs-Differenz:</span>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all"
              style={{ 
                width: `${Math.abs(suspenseA - suspenseB) * 100}%`,
                marginLeft: suspenseA >= suspenseB ? 0 : 'auto'
              }} 
            />
          </div>
          <span className="text-purple-400 font-bold">
            {suspenseA > suspenseB ? teamAName : suspenseB > suspenseA ? teamBName : '='}
          </span>
        </div>
      </div>
    </div>
  );
}
