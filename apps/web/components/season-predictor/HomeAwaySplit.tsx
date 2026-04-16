'use client';

import { memo, useMemo } from 'react';

type TeamStats = {
  homePoints?: number;
  homeGames?: number;
  awayPoints?: number;
  awayGames?: number;
  homeGoalsFor?: number;
  homeGoalsAgainst?: number;
  awayGoalsFor?: number;
  awayGoalsAgainst?: number;
};

type HomeAwaySplitProps = {
  stats: TeamStats;
  compact?: boolean;
};

export const HomeAwaySplit = memo<HomeAwaySplitProps>(({ stats, compact = false }) => {
  const { homePoints = 0, homeGames = 0, awayPoints = 0, awayGames = 0, homeGoalsFor = 0, homeGoalsAgainst = 0, awayGoalsFor = 0, awayGoalsAgainst = 0 } = stats;
  const homePPG = useMemo(() => (homeGames > 0 ? homePoints / homeGames : 0), [homePoints, homeGames]);
  const awayPPG = useMemo(() => (awayGames > 0 ? awayPoints / awayGames : 0), [awayPoints, awayGames]);
  const homeGoalDiff = homeGoalsFor - homeGoalsAgainst;
  const awayGoalDiff = awayGoalsFor - awayGoalsAgainst;

  if (compact) {
    return (
      <div className="flex gap-4 text-sm">
        <span className="text-neutral-500">🏠</span>
        <span className="text-green-400">{homePoints}pts</span>
        <span className="text-neutral-600">/</span>
        <span className="text-blue-400">{awayPoints}pts</span>
        <span className="text-neutral-500">✈️</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
      <h4 className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Home / Away</h4>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏠</span>
            <span className="text-sm font-medium text-green-400">Home</span>
            <span className="text-xs text-neutral-500">({homeGames})</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-neutral-400">Points</span><span className="font-mono text-green-400">{homePoints}</span></div>
              <div className="h-2 bg-neutral-800 rounded-full"><div className="h-full bg-green-600 rounded-full" style={{ width: `${(homePoints / 51) * 100}%` }} /></div>
            </div>
            <div className="flex justify-between text-xs"><span className="text-neutral-400">PPG</span><span className="font-mono text-neutral-300">{homePPG.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-neutral-400">Goal Diff</span><span className={`font-mono ${homeGoalDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>{homeGoalDiff >= 0 ? '+' : ''}{homeGoalDiff}</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✈️</span>
            <span className="text-sm font-medium text-blue-400">Away</span>
            <span className="text-xs text-neutral-500">({awayGames})</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-neutral-400">Points</span><span className="font-mono text-blue-400">{awayPoints}</span></div>
              <div className="h-2 bg-neutral-800 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${(awayPoints / 51) * 100}%` }} /></div>
            </div>
            <div className="flex justify-between text-xs"><span className="text-neutral-400">PPG</span><span className="font-mono text-neutral-300">{awayPPG.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-neutral-400">Goal Diff</span><span className={`font-mono ${awayGoalDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>{awayGoalDiff >= 0 ? '+' : ''}{awayGoalDiff}</span></div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Home Advantage</span>
          <span className={`font-mono ${homePoints > awayPoints ? 'text-green-400' : homePoints < awayPoints ? 'text-red-400' : 'text-neutral-400'}`}>{homePoints > awayPoints ? '+' : ''}{homePoints - awayPoints} pts</span>
        </div>
      </div>
    </div>
  );
});

HomeAwaySplit.displayName = 'HomeAwaySplit';