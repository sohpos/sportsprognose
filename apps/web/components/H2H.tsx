// apps/web/components/H2H.tsx
'use client';

import { useState, useEffect } from 'react';

interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
}

interface H2HStats {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  btts: number;
  over25: number;
  avgGoals: string;
}

interface H2HProps {
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    h2h: 'Direktvergleich', last5: 'Letzte 5 Duelle',
    wins: 'Siege', draws: 'Unentschieden', btts: 'BTTS', over25: 'Ø 2.5',
    goals: 'Tore', home: 'Heim', away: 'Auswärts',
  },
  en: {
    h2h: 'Head-to-Head', last5: 'Last 5 matches',
    wins: 'Wins', draws: 'Draws', btts: 'BTTS', over25: 'Avg 2.5',
    goals: 'Goals', home: 'Home', away: 'Away',
  },
  tr: {
    h2h: 'Karşılaştırma', last5: 'Son 5 maç',
    wins: 'Galibiyet', draws: 'Beraberlik', btts: 'MM', over25: 'Ort 2.5',
    goals: 'Goller', home: 'Ev', away: 'Deplasman',
  },
};

export function H2HDisplay({ homeTeamId, awayTeamId, homeTeamName, awayTeamName, locale = 'de' }: H2HProps) {
  const [h2h, setH2h] = useState<H2HMatch[]>([]);
  const [stats, setStats] = useState<H2HStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  
  const t = translations[locale] || translations['de'];

  useEffect(() => {
    if (!homeTeamId || !awayTeamId) return;
    
    fetch(`/api/predictions/h2h/${homeTeamId}/${awayTeamId}`)
      .then(r => r.json())
      .then(data => {
        setH2h(data.h2h || []);
        setStats(data.stats || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [homeTeamId, awayTeamId]);

  if (loading) {
    return <div className="text-xs text-slate-500">Lade H2H...</div>;
  }

  if (h2h.length === 0) {
    return <div className="text-xs text-slate-500">{t.h2h}: -</div>;
  }

  return (
    <div className="mt-3">
      {/* Stats summary */}
      {stats && (
        <div 
          className="flex items-center gap-2 cursor-pointer text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-slate-400 font-medium">{t.h2h}:</span>
          <span className="text-green-400">{stats.homeWins}</span>
          <span className="text-slate-500">-</span>
          <span className="text-yellow-400">{stats.draws}</span>
          <span className="text-slate-500">-</span>
          <span className="text-blue-400">{stats.awayWins}</span>
          <span className="text-slate-600">({stats.avgGoals} {t.goals})</span>
        </div>
      )}

      {/* Expanded match list */}
      {expanded && (
        <div className="mt-2 bg-slate-800 rounded-lg p-2 text-xs space-y-1">
          <div className="text-slate-400 font-medium mb-1">{t.last5}</div>
          {h2h.map((m, i) => {
            const isHomeTeam = m.homeTeam === homeTeamName;
            const result = m.homeGoals > m.awayGoals ? 'H' : m.homeGoals === m.awayGoals ? 'D' : 'A';
            return (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-500">{new Date(m.date).toLocaleDateString(locale)}</span>
                <span className="text-slate-300">{m.homeTeam}</span>
                <span className={`font-bold ${result === 'H' ? 'text-green-400' : result === 'D' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {m.homeGoals}:{m.awayGoals}
                </span>
                <span className="text-slate-300">{m.awayTeam}</span>
              </div>
            );
          })}
          
          {/* Additional stats */}
          {stats && (
            <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between text-slate-400">
              <span>BTTS: <span className="text-pink-400">{stats.btts}</span></span>
              <span>Ø2.5: <span className="text-orange-400">{stats.over25}</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
