// apps/web/components/TeamCompareCard.tsx
'use client';

import { type TeamCompareData } from '@/lib/api/compare';
import { FormBadge } from './FormCurve';

interface TeamCompareCardProps {
  data: TeamCompareData;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Team Vergleich', vs: 'vs', form: 'Form', stats: 'Statistiken',
    value: 'Value', h2h: 'Direktvergleich', score: 'Score',
    games: 'Spiele', wins: 'Siege', draws: 'Unent.', losses: 'Niederlagen',
    goals: 'Tore', gd: 'TD', points: 'Punkte', xg: 'xG',
  },
  en: {
    title: 'Team Comparison', vs: 'vs', form: 'Form', stats: 'Stats',
    value: 'Value', h2h: 'Head-to-Head', score: 'Score',
    games: 'Games', wins: 'Wins', draws: 'Draws', losses: 'Losses',
    goals: 'Goals', gd: 'GD', points: 'Points', xg: 'xG',
  },
  tr: {
    title: 'Takım Karşılaştırması', vs: 'vs', form: 'Form', stats: 'İstatistikler',
    value: 'Değer', h2h: 'H2H', score: 'Skor',
    games: 'Maçlar', wins: 'Galibiyet', draws: 'Beraberlik', losses: 'Mağlubiyet',
    goals: 'Goller', gd: 'GD', points: 'Puan', xg: 'xG',
  },
};

export function TeamCompareCard({ data, locale = 'de' }: TeamCompareCardProps) {
  const t = translations[locale] || translations['de'];
  const { teamA, teamB, h2h } = data;

  // Determine winner
  const winner = teamA.score > teamB.score ? 'A' : teamB.score > teamA.score ? 'B' : 'draw';

  return (
    <div className="space-y-4" data-testid="team-compare">
      {/* Header with scores */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Team A */}
        <div className={`text-right ${winner === 'A' ? 'text-green-400' : ''}`}>
          <div className="text-xl font-bold">{teamA.stats.games > 0 ? 'Team A' : '-'}</div>
          <FormBadge form={teamA.form?.form || 'DDDDD'} locale={locale} />
          <div className="text-3xl font-bold mt-2">{Math.round(teamA.score * 100)}</div>
        </div>

        {/* VS */}
        <div className="text-center">
          <span className="text-slate-500 text-sm">{t.vs}</span>
        </div>

        {/* Team B */}
        <div className={`text-left ${winner === 'B' ? 'text-green-400' : ''}`}>
          <div className="text-xl font-bold">{teamB.stats.games > 0 ? 'Team B' : '-'}</div>
          <FormBadge form={teamB.form?.form || 'DDDDD'} locale={locale} />
          <div className="text-3xl font-bold mt-2">{Math.round(teamB.score * 100)}</div>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Team A Stats */}
        <div className="card p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">{t.games}</span>
            <span className="font-bold">{teamA.stats.games}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.wins}</span>
            <span className="font-bold text-green-400">{teamA.stats.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.draws}</span>
            <span className="font-bold text-yellow-400">{teamA.stats.draws}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.losses}</span>
            <span className="font-bold text-red-400">{teamA.stats.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.goals}</span>
            <span className="font-bold">{teamA.stats.goalsFor}:{teamA.stats.goalsAgainst}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.points}</span>
            <span className="font-bold text-green-400">{teamA.stats.points}</span>
          </div>
        </div>

        {/* Team B Stats */}
        <div className="card p-3 space-y-2">
          <div className="flex justify-between">
            <span className="font-bold">{teamB.stats.games}</span>
            <span className="text-slate-500">{t.games}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-green-400">{teamB.stats.wins}</span>
            <span className="text-slate-500">{t.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-yellow-400">{teamB.stats.draws}</span>
            <span className="text-slate-500">{t.draws}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-red-400">{teamB.stats.losses}</span>
            <span className="text-slate-500">{t.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">{teamB.stats.goalsFor}:{teamB.stats.goalsAgainst}</span>
            <span className="text-slate-500">{t.goals}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-green-400">{teamB.stats.points}</span>
            <span className="text-slate-500">{t.points}</span>
          </div>
        </div>
      </div>

      {/* Value comparison */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="card p-3">
          <div className="text-slate-500 mb-1">{t.value}</div>
          <div className="flex justify-between">
            <span className={teamA.value?.avgEdge > teamB.value?.avgEdge ? 'text-green-400' : 'text-slate-400'}>
              {teamA.value?.avgEdge > 0 ? '+' : ''}{teamA.value?.avgEdge || 0}%
            </span>
          </div>
        </div>
        <div className="card p-3">
          <div className="text-slate-500 mb-1 text-right">{t.value}</div>
          <div className="flex justify-between">
            <span className={teamB.value?.avgEdge > teamA.value?.avgEdge ? 'text-green-400' : 'text-slate-400'}>
              {teamB.value?.avgEdge > 0 ? '+' : ''}{teamB.value?.avgEdge || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* H2H summary */}
      {h2h && h2h.length > 0 && (
        <div className="card p-3">
          <div className="text-sm font-semibold text-slate-400 mb-2">{t.h2h}</div>
          <div className="text-xs text-slate-500">
            {h2h.length} Spiele in der Historie
          </div>
        </div>
      )}
    </div>
  );
}
