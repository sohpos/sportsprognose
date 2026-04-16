'use client';

import { memo, useMemo } from 'react';

type XGxGADeltaChartProps = {
  xG: number;
  xGA: number;
  showDiff?: boolean;
  compact?: boolean;
};

export const XGxGADeltaChart = memo<XGxGADeltaChartProps>(({ xG, xGA, showDiff = true, compact = false }) => {
  const delta = xG - xGA;
  const isPositive = delta > 0;
  const diffPercent = useMemo(() => {
    if (xG + xGA === 0) return 0;
    return Math.round((delta / (xG + xGA)) * 100);
  }, [delta, xG, xGA]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-neutral-400">xG:</span>
        <span className="font-mono text-green-400">{xG.toFixed(1)}</span>
        <span className="text-neutral-600">/</span>
        <span className="text-neutral-400">xGA:</span>
        <span className="font-mono text-red-400">{xGA.toFixed(1)}</span>
        {showDiff && (
          <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
            ({isPositive ? '+' : ''}{delta.toFixed(1)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
      <h4 className="text-xs uppercase tracking-wide text-neutral-500 mb-3">xG / xGA</h4>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-400">xG</span>
            <span className="text-green-400 font-mono">{xG.toFixed(1)}</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(xG * 4, 100)}%` }} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400">xGA</span>
            <span className="text-red-400 font-mono">{xGA.toFixed(1)}</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(xGA * 4, 100)}%` }} />
          </div>
        </div>
      </div>
      {showDiff && (
        <div className={`mt-3 text-center py-2 rounded ${isPositive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
          <span className="text-lg font-bold">{isPositive ? '+' : ''}{delta.toFixed(1)}</span>
          <span className="text-xs ml-1">({isPositive ? '+' : ''}{diffPercent}%)</span>
        </div>
      )}
    </div>
  );
});

XGxGADeltaChart.displayName = 'XGxGADeltaChart';