// apps/web/components/TeamPage.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeamDetailData, type TeamDetailData } from '@/lib/api/team';
import { FormBadge } from '@/components/FormCurve';

interface TeamPageProps {
  teamId: number;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Team', form: 'Form', loading: 'Laden...',
    avgGoals: 'Ø Tore', goalsFor: 'Tore', goalsAgainst: 'Gegentore',
    trend: 'Trend', improving: 'Verbessernd', stable: 'Stabil', declining: 'Absteigend',
    noData: 'Keine Daten verfügbar',
  },
  en: {
    title: 'Team', form: 'Form', loading: 'Loading...',
    avgGoals: 'Avg Goals', goalsFor: 'Goals', goalsAgainst: 'Against',
    trend: 'Trend', improving: 'Improving', stable: 'Stable', declining: 'Declining',
    noData: 'No data available',
  },
  tr: {
    title: 'Takım', form: 'Form', loading: 'Yükleniyor...',
    avgGoals: 'Ort Gol', goalsFor: 'Goller', goalsAgainst: 'Yedi',
    trend: 'Trend', improving: 'İyileşen', stable: 'Sabit', declining: 'Düşen',
    noData: 'Veri yok',
  },
};

export function TeamPage({ teamId, locale = 'de' }: TeamPageProps) {
  const [data, setData] = useState<TeamDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[locale] || translations['de'];

  useEffect(() => {
    getTeamDetailData(teamId)
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [teamId]);

  if (loading) {
    return (
      <div className="card p-8 text-center" data-testid="team-loading">
        <span className="text-slate-500">{t.loading}</span>
      </div>
    );
  }

  if (!data?.form) {
    return (
      <div className="card p-8 text-center">
        <span className="text-slate-500">{t.noData}</span>
      </div>
    );
  }

  const { form } = data;
  const trendIcon = form.trend > 0 ? '📈' : form.trend < 0 ? '📉' : '➡️';
  const trendLabel = form.trend > 0 ? t.improving : form.trend < 0 ? t.declining : t.stable;

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="team-page">
      {/* Header */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{form.teamName}</h1>
          <span className="text-sm text-slate-500">ID: {teamId}</span>
        </div>

        {/* Form Badge */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{t.form}:</span>
          <FormBadge form={form.form || 'DDDDD'} locale={locale} />
          <span className="text-sm text-slate-400">
            {trendIcon} {trendLabel}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{form.avgGoalsScored.toFixed(2)}</div>
          <div className="text-xs text-slate-500">{t.avgGoals} ⚽</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{form.avgGoalsConceded.toFixed(2)}</div>
          <div className="text-xs text-slate-500">{t.avgGoals} 🥅</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {form.formPoints.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-slate-500">Form Points</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{(form.avgGoalsScored - form.avgGoalsConceded).toFixed(2)}</div>
          <div className="text-xs text-slate-500">GD</div>
        </div>
      </div>

      {/* Form Points Breakdown */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {t.form} Breakdown
        </h2>
        <div className="flex gap-2">
          {(form.formPoints || [0, 0, 0, 0, 0]).map((pts, i) => (
            <div
              key={i}
              className={`
                flex-1 p-3 rounded-lg text-center
                ${pts === 3 ? 'bg-green-500/20 text-green-400' : ''}
                ${pts === 1 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                ${pts === 0 ? 'bg-red-500/20 text-red-400' : ''}
              `}
            >
              <div className="text-lg font-bold">{pts}</div>
              <div className="text-xs opacity-70">
                {i === 0 ? 'Last' : i === 4 ? '5th ago' : `${5 - i}th ago`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
