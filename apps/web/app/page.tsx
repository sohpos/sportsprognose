import { fetchMatches, fetchPrediction, fetchAccuracyStats } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import AccuracyWidget from '@/components/AccuracyWidget';
import { Match, PredictionResult } from '@sportsprognose/core';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let matches: Match[] = [];
  let predictions: Record<string, PredictionResult> = {};
  let accuracyStats = [];

  try {
    const data = await fetchMatches();
    matches = data.matches.slice(0, 6);

    // Fetch predictions for top matches
    const predResults = await Promise.allSettled(
      matches.map(m => fetchPrediction(m.id))
    );
    predResults.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        predictions[matches[i].id] = result.value.prediction;
      }
    });
  } catch (e) {
    console.error('Failed to load matches:', e);
  }

  try {
    const data = await fetchAccuracyStats();
    accuracyStats = data.stats;
  } catch (e) {
    console.error('Failed to load accuracy:', e);
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">KI-Fußballprognosen</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Poisson-Modell · Echtzeit-Statistiken · Trefferquoten-Tracking
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ligen', value: '4', icon: '🏆' },
          { label: 'Prognosen heute', value: `${matches.length}`, icon: '📊' },
          { label: 'Modell', value: 'Poisson', icon: '🧮' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Accuracy widget */}
      {accuracyStats.length > 0 && <AccuracyWidget stats={accuracyStats} />}

      {/* Upcoming matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Nächste Spiele</h2>
          <a href="/matches" className="text-sm text-green-400 hover:text-green-300">
            Alle anzeigen →
          </a>
        </div>

        {matches.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            Backend nicht erreichbar — starte zuerst den Backend-Server (Port 3001)
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

      {/* Disclaimer */}
      <div className="text-center text-xs text-slate-600 pb-4">
        ⚠️ Prognosen basieren auf statistischen Modellen und sind kein Aufruf zur Teilnahme an Sportwetten.
        Realistische Trefferquoten liegen bei 55–65%. Spiele verantwortungsbewusst.
      </div>
    </div>
  );
}
