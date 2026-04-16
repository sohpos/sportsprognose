'use client';

import { memo, useMemo } from 'react';

type TeamDNA = {
  attack: number;
  defense: number;
  xG: number;
  xGA: number;
  form: number;
  efficiency: number;
};

type TeamDNARadarProps = {
  teamDNA: TeamDNA;
  teamName?: string;
  compact?: boolean;
};

const RADAR_LABELS = [
  { key: 'attack' as keyof TeamDNA, label: 'Attack', color: '#22c55e' },
  { key: 'defense' as keyof TeamDNA, label: 'Defense', color: '#3b82f6' },
  { key: 'xG' as keyof TeamDNA, label: 'xG', color: '#22c55e' },
  { key: 'xGA' as keyof TeamDNA, label: 'xGA', color: '#ef4444' },
  { key: 'form' as keyof TeamDNA, label: 'Form', color: '#eab308' },
  { key: 'efficiency' as keyof TeamDNA, label: 'Efficiency', color: '#a855f7' },
];

function calcPoly(values: number[], size: number): string {
  const n = values.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;

  return values
    .map((v, i) => {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + r * (v / 100) * Math.cos(a)},${cy + r * (v / 100) * Math.sin(a)}`;
    })
    .join(' ');
}

function calcGrid(size: number, lvl: number, n: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2 - 20) * (lvl / 5);

  return Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

export const TeamDNARadar = memo<TeamDNARadarProps>(({ teamDNA, teamName, compact = false }) => {
  // Safe values + xGA invertieren
  const safeValues = useMemo(() => {
    return RADAR_LABELS.map(({ key }) => {
      const raw = Number(teamDNA[key]) || 0;
      return key === 'xGA' ? Math.max(0, 100 - raw) : Math.min(Math.max(raw, 0), 100);
    });
  }, [teamDNA]);

  const maxStat = Math.max(...safeValues);
  const minStat = Math.min(...safeValues);

  const n = RADAR_LABELS.length;

  if (compact) {
    const sz = 120;
    return (
      <div className="flex flex-col items-center">
        <svg width={sz} height={sz} className="overflow-visible">
          {[1, 2, 3, 4, 5].map((l) => (
            <polygon
              key={l}
              points={calcGrid(sz, l, n)}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          <polygon
            points={calcPoly(safeValues, sz)}
            fill="rgba(34,197,94,0.3)"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
      <h4 className="text-xs uppercase tracking-wide text-neutral-500 mb-4">
        Team DNA {teamName && <span className="text-green-400"> — {teamName}</span>}
      </h4>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <svg width={180} height={180} className="overflow-visible">
          {[1, 2, 3, 4, 5].map((l) => (
            <polygon
              key={l}
              points={calcGrid(180, l, n)}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {RADAR_LABELS.map((_, i) => {
            const a = (Math.PI * 2 * i) / n - Math.PI / 2;
            return (
              <line
                key={i}
                x1={90}
                y1={90}
                x2={90 + 70 * Math.cos(a)}
                y2={90 + 70 * Math.sin(a)}
                stroke="#374151"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={calcPoly(safeValues, 180)}
            fill="rgba(34,197,94,0.2)"
            stroke="#22c55e"
            strokeWidth="2"
          />

          {safeValues.map((v, i) => {
            const a = (Math.PI * 2 * i) / n - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={90 + 70 * (v / 100) * Math.cos(a)}
                cy={90 + 70 * (v / 100) * Math.sin(a)}
                r="4"
                fill="#22c55e"
              />
            );
          })}
        </svg>

        <div className="flex-1 grid grid-cols-2 gap-3">
          {RADAR_LABELS.map(({ key, label, color }, i) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">{label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${safeValues[i]}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-neutral-300 w-8">
                  {safeValues[i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 flex gap-2 flex-wrap">
        {maxStat >= 80 && (
          <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 text-xs">
            🏆 Strong
          </span>
        )}
        {minStat <= 30 && (
          <span className="px-2 py-1 rounded bg-red-900/30 text-red-400 text-xs">
            ⚠️ Weak
          </span>
        )}
        {safeValues.reduce((a, b) => a + b, 0) / n >= 60 && (
          <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-xs">
            📊 Balanced
          </span>
        )}
