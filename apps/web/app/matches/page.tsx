'use client';
import { useState, useEffect } from 'react';
import MatchCard from '@/components/MatchCard';
import LeagueFilter from '@/components/LeagueFilter';
import { Match, PredictionResult } from '@sportsprognose/core';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, PredictionResult>>({});
  const [selectedLeague, setSelectedLeague] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = selectedLeague
      ? `${API_URL}/api/matches?league=${selectedLeague}`
      : `${API_URL}/api/matches`;

    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setMatches(data.matches || []);
        setLoading(false);

        // Fetch predictions for all matches
        data.matches?.forEach((m: Match) => {
          fetch(`${API_URL}/api/predictions/${m.id}`)
            .then(r => r.json())
            .then(d => {
              if (d.prediction) {
                setPredictions(prev => ({ ...prev, [m.id]: d.prediction }));
              }
            })
            .catch(() => {});
        });
      })
      .catch(() => setLoading(false));
  }, [selectedLeague]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Alle Spiele</h1>
        <span className="text-sm text-slate-500">{matches.length} Spiele gefunden</span>
      </div>

      <LeagueFilter selected={selectedLeague} onChange={setSelectedLeague} />

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
        <div className="card p-8 text-center text-slate-500">
          Keine Spiele gefunden
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
