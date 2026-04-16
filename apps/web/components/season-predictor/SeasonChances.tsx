'use client';

import { memo } from 'react';

type SeasonChancesProps = {
  data: Record<string, any> | null;
  teams: any[];
};

// FIX: prob ist 0–1 → korrekt formatieren
const formatPct = (prob: number): string => {
  const pct = prob * 100;
  return pct >= 0.1 ? pct.toFixed(1) + '%' : '<0.1%';
};

export const SeasonChances = memo<SeasonChancesProps>(({ data, teams }) => {
  if (!data) return null;

  // FIX: championProb NICHT durch 1000 teilen
  const championship = teams
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      logo: t.logo,
      prob: Number(data?.[t.id]?.championProb ?? 0), // 0–1 korrekt
    }))
    .filter((t: any) => t.prob > 0)
    .sort((a: any, b: any) => b.prob - a.prob);

  // FIX: relegationProb NICHT durch 1000 teilen
  const relegationZone = teams
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      logo: t.logo,
      prob: Number(data?.[t.id]?.relegationProb ?? 0), // 0–1 korrekt
    }))
    .filter((t: any) => t.prob > 0)
    .sort((a: any, b: any) => b.prob - a.prob); // FIX: highest first

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Meisterschaft */}
      <div className="rounded-xl bg-neutral-900/80 p-4 border border-neutral-800">
        <h2 className="text-sm font-bold mb-3 text-neutral-300">🏆 Meisterschaft</h2>
        <div className="space-y-1 text-sm max-h-96 overflow-y-auto">
          {championship.length === 0 ? (
            <p className="text-neutral-500 text-xs">Keine Daten</p>
          ) : (
            championship.map((t: any, i: number) => (
              <div
                key={t.id}
                className="flex items-center justify-between group hover:bg-neutral-800 rounded px-2 py-1 -mx-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-5 text-xs text-neutral-500 font-bold">{i + 1}.</span>
                  {t.logo && (
                    <img
                      src={t.logo}
                      alt=""
                      className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
                    />
                  )}
                  <span className="text-neutral-300 truncate text-xs">{t.name}</span>
                </div>
                <span className="font-mono text-green-400 font-medium text-xs">
                  {formatPct(t.prob)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Abstieg */}
      <div className="rounded-xl bg-neutral-900/80 p-4 border border-neutral-800">
        <h2 className="text-sm font-bold mb-3 text-neutral-300">📉 Abstieg</h2>
        <div className="space-y-1 text-sm max-h-96 overflow-y-auto">
          {relegationZone.length === 0 ? (
            <p className="text-neutral-500 text-xs">Keine Daten</p>
          ) : (
            relegationZone.map((t: any, i: number) => {
              const isHighRisk = t.prob > 0.1;
              const isMediumRisk = t.prob > 0.01;

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between group hover:bg-neutral-800 rounded px-2 py-1 -mx-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-5 text-xs text-neutral-500 font-bold">{i + 1}.</span>
                    {t.logo && (
                      <img
                        src={t.logo}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
                      />
                    )}
                    <span className="text-neutral-300 truncate text-xs">{t.name}</span>
                  </div>

                  <span
                    className={`font-mono font-medium text-xs ${
                      isHighRisk
                        ? 'text-red-500'
                        : isMediumRisk
                        ? 'text-yellow-500'
                        : 'text-green-400'
                    }`}
                  >
                    {formatPct(t.prob)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

SeasonChances.displayName = 'SeasonChances';
