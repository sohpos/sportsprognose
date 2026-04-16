'use client';

import { memo, useMemo } from 'react';

type TeamDNA = { attack: number; defense: number; xG: number; xGA: number; form: number; efficiency: number };
type TeamDNARadarProps = { teamDNA: TeamDNA; teamName?: string; compact?: boolean };

const RADAR_LABELS = [
  { key: 'attack' as keyof TeamDNA, label: 'Attack' },
  { key: 'defense' as keyof TeamDNA, label: 'Defense' },
  { key: 'xG' as keyof TeamDNA, label: 'xG' },
  { key: 'xGA' as keyof TeamDNA, label: 'xGA' },
  { key: 'form' as keyof TeamDNA, label: 'Form' },
  { key: 'efficiency' as keyof TeamDNA, label: 'Efficiency' },
];

function calcPoly(values: number[], size: number): string {
  const n = values.length;
  const cx = size / 2, cy = size / 2, r = size / 2 - 20;
  return values.map((v, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * (v / 100) * Math.cos(a)},${cy + r * (v / 100) * Math.sin(a)}`;
  }).join(' ');
}

function calcGrid(size: number, lvl: number): string {
  const n = 6, cx = size / 2, cy = size / 2, r = (size / 2 - 20) * (lvl / 5);
  return Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

export const TeamDNARadar = memo<TeamDNARadarProps>(({ teamDNA, teamName, compact = false }) => {
  const values = useMemo(() => [teamDNA.attack, teamDNA.defense, teamDNA.xG, teamDNA.xGA, teamDNA.form, teamDNA.efficiency], [teamDNA]);
  const maxStat = Math.max(...values);
  const minStat = Math.min(...values);
  const colors = ['#22c55e', '#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7'];

  if (compact) {
    const sz = 120;
    return (
      <div className="flex flex-col items-center">
        <svg width={sz} height={sz} className="overflow-visible">
          {[1, 2, 3, 4, 5].map(l => <polygon key={l} points={calcGrid(sz, l)} fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />)}
          <polygon points={calcPoly(values, sz)} fill="rgba(34,197,94,0.3)" stroke="#22c55e" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-neutral-900/80 p-4 border border-neutral-800">
      <h4 className="text-xs uppercase tracking-wide text-neutral-500 mb-4">Team DNA {teamName && <span className="text-green-400"> — {teamName}</span>}</h4>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <svg width={180} height={180} className="overflow-visible">
          {[1, 2, 3, 4, 5].map(l => <polygon key={l} points={calcGrid(180, l)} fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />)}
          {RADAR_LABELS.map((_, i) => {
            const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            return <line key={i} x1={90} y1={90} x2={90 + 70 * Math.cos(a)} y2={90 + 70 * Math.sin(a)} stroke="#374151" strokeWidth="1" />;
          })}
          <polygon points={calcPoly(values, 180)} fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" />
          {values.map((v, i) => {
            const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            return <circle key={i} cx={90 + 70 * (v / 100) * Math.cos(a)} cy={90 + 70 * (v / 100) * Math.sin(a)} r="4" fill="#22c55e" />;
          })}
        </svg>
        <div className="flex-1 grid grid-cols-2 gap-3">
          {RADAR_LABELS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">{label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${teamDNA[key]}%`, backgroundColor: colors[RADAR_LABELS.findIndex(r => r.key === key)] }} />
                </div>
                <span className="text-xs font-mono text-neutral-300 w-8">{teamDNA[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-neutral-800 flex gap-2 flex-wrap">
        {maxStat >= 80 && <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 text-xs">🏆 Strong</span>}
        {minStat <= 30 && <span className="px-2 py-1 rounded bg-red-900/30 text-red-400 text-xs">⚠️ Weak</span>}
        {values.reduce((a, b) => a + b, 0) / 6 >= 60 && <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-xs">📊 Balanced</span>}
      </div>
    </div>
  );
});

TeamDNARadar.displayName = 'TeamDNARadar';