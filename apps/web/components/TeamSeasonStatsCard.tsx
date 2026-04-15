// apps/web/components/TeamSeasonStatsCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getTeamSeasonStats, type TeamSeasonStats } from '@/lib/api/team-season';

interface TeamSeasonStatsCardProps {
  teamId: number;
  leagueId?: string;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    title: 'Saisonstatistiken',
    games: 'Spiele', points: 'Punkte',
    wins: 'Siege', draws: 'Unent.', losses: 'Niederlagen',
    goals: 'Tore', against: 'Gegentore', gd: 'Torverh.',
    avgGoals: 'Ø Tore', avgAgainst: 'Ø Gegentore',
    xg: 'xG', xga: 'xGA',
    loading: 'Lade Statistiken...',
  },
  en: {
    title: 'Season Stats',
    games: 'Games', points: 'Points',
    wins: 'Wins', draws: 'Draws', losses: 'Losses',
    goals: 'Goals', against: 'Against', gd: 'GD',
    avgGoals: 'Avg Goals', avgAgainst: 'Avg Against',
    xg: 'xG', xga: 'xGA',
    loading: 'Loading stats...',
  },
  tr: {
    title: 'Sezon İstatistikleri',
    games: 'Maçlar', points: 'Puan',
    wins: 'Galibiyet', draws: 'Beraberlik', losses: 'Mağlubiyet',
    goals: 'Goller', against: 'Yedi', gd: 'GD',
    avgGoals: 'Ort Gol', avgAgainst: 'Ort Yedi',
    xg: 'xG', xga: 'xGA',
    loading: 'İstatistikler yükleniyor...',
  },
};

export function TeamSeasonStatsCard({
  teamId,
  leagueId,
  locale = 'de'
}: TeamSeasonStatsCardProps) {
  const [stats, setStats] = useState<TeamSeasonStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[locale] || translations['de'];

  useEffect(() => {
    getTeamSeasonStats(teamId, leagueId)
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [teamId, leagueId]);

  if (loading) {
    return (
      <div className="card p-4" data-testid="season-stats-loading">
        <span className="text-slate-500 text-sm">{t.loading}</span>
      </div>
    );
  }

  if (!stats || stats.games === 0) {
    return null;
  }

  const winRate = ((stats.wins / stats.games) * 100).toFixed(0);
  const gdColor = stats.goalDiff > 0 ? 'text-green-400' : stats.goalDiff < 0 ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="card p-4" data-testid="season-stats">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        {t.title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {/* Basic Stats */}
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.games}</div>
          <div className="text-xl font-bold text-white">{stats.games}</div>
        </div>
        
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.points}</div>
          <div className="text-xl font-bold text-green-400">{stats.points}</div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.wins} / {t.draws} / {t.losses}</div>
          <div className="text-sm font-medium">
            <span className="text-green-400">{stats.wins}</span>
            <span className="text-slate-600"> / </span>
            <span className="text-yellow-400">{stats.draws}</span>
            <span className="text-slate-600"> / </span>
            <span className="text-red-400">{stats.losses}</span>
          </div>
          <div className="text-xs text-slate-500">{winRate}% Win-Rate</div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.goals} / {t.against}</div>
          <div className="text-sm font-medium">
            <span className="text-blue-400">{stats.goalsFor}</span>
            <span className="text-slate-600"> : </span>
            <span className="text-red-400">{stats.goalsAgainst}</span>
          </div>
          <div className={`text-xs font-bold ${gdColor}`}>
            {stats.goalDiff > 0 ? '+' : ''}{stats.goalDiff} {t.gd}
          </div>
        </div>

        {/* Averages */}
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.avgGoals}</div>
          <div className="text-lg font-bold text-blue-400">{stats.avgGF.toFixed(2)}</div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.avgAgainst}</div>
          <div className="text-lg font-bold text-red-400">{stats.avgGA.toFixed(2)}</div>
        </div>

        {/* xG Stats */}
        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.xg}</div>
          <div className="text-lg font-bold text-purple-400">{stats.xg.toFixed(1)}</div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <div className="text-slate-500 text-xs">{t.xga}</div>
          <div className="text-lg font-bold text-orange-400">{stats.xga.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}
