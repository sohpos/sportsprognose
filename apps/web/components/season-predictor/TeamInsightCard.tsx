'use client';

import { memo, useMemo, useCallback } from 'react';

type Team = {
  id: string;
  name: string;
  logo?: string;
};

type TeamData = {
  xp: number;
  distribution: number[];
  actualPoints?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  xG?: number;
  xGA?: number;
  form?: number[];
};

type MetricProps = {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
};

// Memoized Metric component
const Metric = memo<MetricProps>(({ label, value, positive, negative }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
      {label}
    </span>
    <span
      className={`font-mono font-medium transition-colors duration-200 ${
        positive
          ? 'text-green-400 dark:text-green-400'
          : negative
          ? 'text-red-400 dark:text-red-400'
          : 'text-neutral-300 dark:text-neutral-300'
      }`}
    >
      {value}
    </span>
  </div>
));
Metric.displayName = 'Metric';

type TeamInsightCardProps = {
  team: Team;
  data: TeamData;
  compact?: boolean;
};

// Main card component with memo
export const TeamInsightCard = memo<TeamInsightCardProps>(({ team, data, compact = false }) => {
  // useMemo for expensive calculations
  const volatility = useMemo(() => {
    if (!data?.distribution) return 0;
    const dist = data.distribution;
    const total = dist.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    
    const mean = dist.reduce((s, c, i) => s + c * (i + 1), 0) / total;
    const variance = dist.reduce((sum, count, pos) => {
      const prob = count / total;
      return sum + prob * Math.pow(pos + 1 - mean, 2);
    }, 0);
    
    return Math.sqrt(variance);
  }, [data?.distribution]);

  const xp = data?.xp ?? 0;
  const actual = data?.actualPoints;
  const delta = actual !== undefined ? actual - xp : null;
  
  const luckFactor = useMemo(() => {
    if (xp <= 0 || delta === null) return null;
    return (delta / xp) * 100;
  }, [xp, delta]);

  const inverseVol = useMemo(() => 1.0 / volatility, [volatility]);
  const consistency = volatility > 0 ? inverseVol : null;

  // Stable Metric render with useCallback
  const renderMetric = useCallback(
    (props: MetricProps) => <Metric {...props} />,
    []
  );

  if (compact) {
    return (
      <div className="rounded-lg bg-neutral-900/80 dark:bg-neutral-900 p-2 shadow flex items-center gap-3 hover:shadow-md hover:shadow-green-900/20 transition-all duration-200">
        {team.logo && (
          <img src={team.logo} alt="" className="w-5 h-5 rounded-sm object-contain" />
        )}
        <div className="flex gap-3 text-xs min-w-0">
          <span className="text-neutral-400">
            xP: <span className="font-mono font-medium text-white">{xp.toFixed(1)}</span>
          </span>
          {delta !== null && (
            <span className={delta >= 0 ? 'text-green-400' : 'text-red-400'}>
              Δ: {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
            </span>
          )}
          {luckFactor !== null && (
            <span className={luckFactor >= 0 ? 'text-green-400' : 'text-red-400'}>
              Luck: {luckFactor >= 0 ? '+' : ''}{luckFactor.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-neutral-900/80 dark:bg-neutral-900 p-4 shadow-lg hover:shadow-xl hover:shadow-green-900/10 transition-all duration-300 border border-neutral-800 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {team.logo && (
            <img src={team.logo} alt="" className="w-6 h-6 rounded-sm object-contain" />
          )}
          <h3 className="font-bold text-base text-neutral-100 dark:text-neutral-100">
            {team.name}
          </h3>
        </div>
        {actual !== null && (
          <span
            className={`text-xl font-bold ${
              (delta ?? 0) >= 0
                ? 'text-green-400 dark:text-green-400'
                : 'text-red-400 dark:text-red-400'
            }`}
          >
            {actual}{' '}
            <span className="text-xs font-normal text-neutral-500">Pkt</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {renderMetric({ label: 'Expected Points', value: xp.toFixed(1) })}
          {delta !== null &&
            renderMetric({
              label: 'Delta',
              value: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`,
              positive: delta >= 0,
              negative: delta < 0,
            })}
          {luckFactor !== null &&
            renderMetric({
              label: 'Luck Factor',
              value: `${luckFactor >= 0 ? '+' : ''}${luckFactor.toFixed(0)}%`,
              positive: luckFactor >= 0,
              negative: luckFactor < 0,
            })}
        </div>
        <div className="space-y-3">
          {consistency !== null &&
            renderMetric({
              label: 'Consistency',
              value: consistency.toFixed(2),
              positive: consistency > 0.5,
            })}
          {volatility > 0 &&
            renderMetric({
              label: 'Volatility',
              value: `±${volatility.toFixed(1)}`,
            })}
        </div>
      </div>
    </div>
  );
});

TeamInsightCard.displayName = 'TeamInsightCard';

// Grid component
type TeamInsightGridProps = {
  data: Record<string, TeamData>;
  teams: Team[];
  compact?: boolean;
};

export const TeamInsightGrid = memo<TeamInsightGridProps>(({ data, teams, compact = false }) => (
  <div
    className={
      compact
        ? 'space-y-2'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    }
  >
    {teams
      .filter((t) => data[t.id]?.xp > 0)
      .map((t) => (
        <TeamInsightCard key={t.id} team={t} data={data[t.id]} compact={compact} />
      ))}
  </div>
));

TeamInsightGrid.displayName = 'TeamInsightGrid';
