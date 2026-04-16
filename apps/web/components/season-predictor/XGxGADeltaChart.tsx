'use client';

import { memo, useMemo } from 'react';

type XGxGADeltaChartProps = {
  xG: number;
  xGA: number;
  showDiff?: boolean;
  compact?: boolean;
};

export const XGxGADeltaChart = memo<XGxGADeltaChartProps>(
  ({ xG, xGA, showDiff = true, compact = false }) => {
    const safeXG = Number(xG) || 0;
    const safeXGA = Number(xGA) || 0;

    const delta = safeXG - safeXGA;
    const isPositive = delta > 0;
    const isNegative = delta < 0;

    const diffPercent = useMemo(() => {
      const sum = safeXG + safeXGA;
      if (sum === 0) return 0;
      return Math.round((delta / sum) * 100);
    }, [delta, safeXG, safeXGA]);

    // Dynamic bar scaling
    const maxVal = Math.max(safeXG, safeXGA, 1);
    const scale = (v: number) => Math.min((v / maxVal) * 100, 100);

    if (compact) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-400">xG:</span>
          <span className={`font-mono ${safeXG >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {safeXG.toFixed(1)}
          </span>

          <span className="text-neutral-600">/</span>

          <span className="text-neutral-400">xGA:</span>
          <span className={`font-mono ${safeXGA >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {safeXGA.toFixed(1)}
          </span>

          {showDiff && (
            <span className={isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-neutral-400'}>
              ({delta >= 0 ? '+' : ''}{delta.toFixed(1)})
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
        <h4 className="text-xs uppercase tracking-wide text-neutral-500 mb-3">xG / xGA</h4>

        {/* xG */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400">xG</span>
              <span className="text-green-400 font-mono">{safeXG.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${scale(safeXG)}%` }}
              />
            </div>
          </div>
        </div>

        {/* xGA */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-400">xGA</span>
              <span className="text-red-400 font-mono">{safeXGA.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${scale(safeXGA)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Delta */}
        {showDiff && (
          <div
            className={`mt-3 text-center py-2 rounded ${
              isPositive
                ? 'bg-green-900/20 text-green-400'
                : isNegative
                ? 'bg-red-900/20 text-red-400'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            <span className="text-lg font-bold">
              {delta >= 0 ? '+' : ''}
              {delta.toFixed(1)}
            </span>
            <span className="text-xs ml-1">
              ({diffPercent >= 0 ? '+' : ''}
              {diffPercent}%)
            </span>
          </div>
        )}
      </div>
    );
  }
);

XGxGADeltaChart.displayName = 'XGxGADeltaChart';
