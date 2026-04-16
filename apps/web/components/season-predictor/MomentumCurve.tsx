'use client';

import { memo, useMemo } from 'react';

type FormData = number[];

type MomentumCurveProps = {
  form: number[];
  label?: string;
  compact?: boolean;
  windowSize?: number;
};

export const MomentumCurve = memo<MomentumCurveProps>(({ form, label = 'Form (5 Games)', compact = false, windowSize = 5 }) => {
  const momentum = useMemo(() => {
    if (!form || form.length === 0) return 0;
    const recentGames = form.slice(-windowSize);
    return recentGames.reduce((sum, pts) => sum + pts, 0) / recentGames.length;
  }, [form, windowSize]);

  const momentumPercent = (momentum / 3) * 100;
  const recentForm = useMemo(() => form?.slice(-windowSize) || [], [form, windowSize]);
  const getResultColor = (pts: number) => pts >= 2.5 ? 'bg-green-500' : pts >= 1 ? 'bg-yellow-500' : 'bg-red-500';
  const getResultLabel = (pts: number) => pts >= 2.5 ? 'W' : pts >= 1 ? 'D' : 'L';

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {recentForm.map((pts, i) => (
          <span key={i} className={`w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center ${getResultColor(pts)} text-white`}>
            {getResultLabel(pts)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
      <h4 className="text-xs uppercase tracking-wide text-neutral-500 mb-3">{label}</h4>
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1"><span className="text-neutral-400">Momentum</span><span className="font-mono text-white">{momentum.toFixed(2)}</span></div>
        <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 rounded-full ${momentum >= 2 ? 'bg-green-500' : momentum >= 1 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${momentumPercent}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">Recent:</span>
        <div className="flex gap-1">
          {recentForm.map((pts, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${getResultColor(pts)} text-white`}>{getResultLabel(pts)}</div>
              <span className="text-[8px] text-neutral-500">{pts}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-neutral-800">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Trend</span>
          <span className={`font-mono ${momentum >= 2 ? 'text-green-400' : momentum >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
            {momentum >= 2 ? '🔥 Hot' : momentum >= 1 ? '➡️ Stable' : '❄️ Cold'}
          </span>
        </div>
      </div>
    </div>
  );
});

MomentumCurve.displayName = 'MomentumCurve';