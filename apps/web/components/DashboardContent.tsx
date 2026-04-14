'use client';

import { useEffect, useState } from 'react';
import { t, getSavedLocale } from '@/lib/translations';

// Stats Component that uses translations
export default function DashboardContent() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Wait for mount before showing translations - fixes hydration mismatch!
  useEffect(() => {
    setMounted(true);
    
    fetch('http://localhost:3002/api/matches')
      .then(r => r.json())
      .then(data => {
        setMatches(data.matches?.slice(0, 6) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // If not mounted yet, show server-safe content (German)
  if (!mounted) {
    return (
      <>
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xl font-bold text-white">4</div>
            <div className="text-xs text-slate-500">Ligen</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xl font-bold text-white">0</div>
            <div className="text-xs text-slate-500">Prognosen heute</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">🧮</div>
            <div className="text-xl font-bold text-white">Poisson</div>
            <div className="text-xs text-slate-500">Modell</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Nächste Spiele</h2>
        </div>
      </>
    );
  }

  // After mount, show translated content
  const stats = [
    { label: t('stats:leagues'), value: '4', icon: '🏆' },
    { label: t('stats:predictions'), value: matches.length.toString(), icon: '📊' },
    { label: t('stats:model'), value: 'Poisson', icon: '🧮' },
  ];

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{t('matches:title')}</h2>
          <a href="/matches" className="text-sm text-green-400 hover:text-green-300">
            {t('matches:showAll')}
          </a>
        </div>

        {loading ? (
          <div className="card p-8 text-center text-slate-500">Loading...</div>
        ) : matches.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            {t('matches:noData')}
          </div>
        ) : (
          <div className="text-slate-400">
            {matches.length} {t('matches:title')}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-slate-600 pb-4">
        {t('disclaimer:text')}
      </div>
    </>
  );
}