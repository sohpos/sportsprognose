// apps/web/components/ScoreMatrixHeatmap.tsx
'use client';

import { useState } from 'react';

interface ScoreCell {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

interface ScoreMatrixHeatmapProps {
  matrix: ScoreCell[];
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: { prob: 'Wahrscheinlichkeit', score: 'Ergebnis' },
  en: { prob: 'Probability', score: 'Score' },
  tr: { prob: 'Olasılık', score: 'Skor' },
};

/** Get color based on probability */
function getColorClass(p: number): string {
  if (p >= 0.20) return 'bg-blue-200 text-blue-900';
  if (p >= 0.15) return 'bg-blue-300 text-blue-900';
  if (p >= 0.10) return 'bg-blue-400 text-white';
  if (p >= 0.06) return 'bg-blue-500 text-white';
  if (p >= 0.03) return 'bg-blue-700 text-white';
  if (p >= 0.01) return 'bg-blue-900 text-blue-100';
  if (p > 0) return 'bg-gray-800 text-gray-400';
  return 'bg-gray-900 text-gray-600';
}

/** ScoreMatrixHeatmap - 6x6 grid with probability coloring */
export function ScoreMatrixHeatmap({ matrix, locale = 'de' }: ScoreMatrixHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<ScoreCell | null>(null);
  const t = translations[locale] || translations['de'];

  // Convert flat matrix to 2D for rendering
  const rows: ScoreCell[][] = [];
  for (let h = 0; h <= 5; h++) {
    const row: ScoreCell[] = [];
    for (let a = 0; a <= 5; a++) {
      const cell = matrix.find(c => c.homeGoals === h && c.awayGoals === a);
      row.push(cell || { homeGoals: h, awayGoals: a, probability: 0 });
    }
    rows.push(row);
  }

  if (!matrix || matrix.length === 0) {
    return <div className="text-xs text-slate-500">Keine Matrixdaten</div>;
  }

  return (
    <div className="relative">
      {/* Header: Away team goals (0-5) */}
      <div className="flex ml-6 mb-1">
        {[0, 1, 2, 3, 4, 5].map(n => (
          <div key={n} className="w-6 h-4 text-[8px] text-slate-500 flex items-end justify-center">
            {n}
          </div>
        ))}
      </div>

      <div className="flex gap-[2px]">
        {/* Row labels: Home team goals (0-5) */}
        <div className="flex flex-col gap-[2px]">
          {[0, 1, 2, 3, 4, 5].map(n => (
            <div key={n} className="w-5 h-6 text-[8px] text-slate-500 flex items-center justify-end pr-1">
              {n}
            </div>
          ))}
        </div>

        {/* Matrix grid */}
        <div className="grid grid-cols-6 gap-[2px]">
          {rows.map((row, h) =>
            row.map((cell, a) => (
              <div
                key={`${h}-${a}`}
                className={`
                  w-6 h-6 text-[8px] font-medium flex items-center justify-center rounded-sm
                  cursor-pointer transition-all duration-150
                  ${getColorClass(cell.probability)}
                  ${hoveredCell === cell ? 'ring-2 ring-white scale-110 z-10' : ''}
                `}
                title={`${cell.homeGoals}:${cell.awayGoals} → ${(cell.probability * 100).toFixed(1)}%`}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {cell.probability > 0.01 ? `${(cell.probability * 100).toFixed(0)}` : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredCell && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs z-20 whitespace-nowrap">
          <span className="font-bold text-white">{hoveredCell.homeGoals}:{hoveredCell.awayGoals}</span>
          <span className="text-slate-400 ml-1">→</span>
          <span className="text-green-400 ml-1">{(hoveredCell.probability * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
