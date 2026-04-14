'use client';

import { useState, useEffect } from 'react';
import MatchCard from '@/components/MatchCard';
import LeagueFilter from '@/components/LeagueFilter';
import { Match, PredictionResult } from '@sportsprognose/core';

const translations: Record<string, Record<string, string>> = {
  de: { 
    title: 'Alle Spiele', found: 'Spiele gefunden', loading: 'Laden...', noData: 'Keine Spiele gefunden', league: 'Liga' 
  },
  en: { 
    title: 'All Matches', found: 'Matches found', loading: 'Loading...', noData: 'No matches found', league: 'League' 
  },
  tr: { 
    title: 'Tüm Maçlar', found: 'Maç bulundu', loading: 'Yükleniyor...', noData: 'Maç yok', league: 'Lig' 
  },
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, PredictionResult>>({});
  const [selectedLeague, setSelectedLeague] = useState('');
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved && translations[saved]) setLocale(saved);
  }, []);

  const t = translations[locale] || translations['de'];

  useEffect(() => {
    setLoading(true);
    const url = selectedLeague
      ? `http://localhost:3002/api/matches?league=${selectedLeague}`
      : 'http://localhost:3002/api/matches';

    fetch(url)
      .then(r => r.json())
      .then(async data => {
        // Sort by date
        const sorted = (data.matches || []).sort((a: Match, b: Match) => 
          new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
        );
        setMatches(sorted);
        
        // Fetch predictions
        const preds: Record<string, PredictionResult> = {};
        await Promise.allSettled(
          sorted.map((m: Match) => 
            fetch(`http://localhost:3002/api/predictions/${m.id}`).then(r => r.json())
          )
        ).then(results => {
          results.forEach((r, i) => {
            if (r.status === 'fulfilled' && r.value.prediction) {
              preds[sorted[i].id] = r.value.prediction;
            }
          });
          setPredictions(preds);
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedLeague]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        <span className="text-sm text-slate-500">{matches.length} {t.found}</span>
      </div>

      <LeagueFilter selected={selectedLeague} onChange={setSelectedLeague} locale={locale} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-3 w-1/3" />
              <div className="h-6 bg-slate-700 rounded mb-2" />
              <div className="h-3 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">{t.noData}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} prediction={predictions[match.id]} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}