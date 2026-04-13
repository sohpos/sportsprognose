import { fetchMatches, fetchPrediction } from '@/lib/api';
import { Match, PredictionResult } from '@sportsprognose/core';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function ScoreMatrix({ matrix, homeTeam, awayTeam }: {
  matrix: PredictionResult['scoreMatrix'];
  homeTeam: string;
  awayTeam: string;
}) {
  const maxGoals = 5;
  const topScores = matrix
    .filter(s => s.homeGoals <= maxGoals && s.awayGoals <= maxGoals)
    .sort((a, b) => b.probability - a.probability);

  const maxProb = topScores[0]?.probability || 1;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Ergebnis-Wahrscheinlichkeiten
      </h3>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="text-xs text-center">
          <thead>
            <tr>
              <th className="w-12 text-slate-500 pb-2 pr-2 text-left">{homeTeam.split(' ')[0]} ↓ / {awayTeam.split(' ')[0]} →</th>
              {Array.from({ length: maxGoals + 1 }, (_, i) => (
                <th key={i} className="w-10 pb-2 text-slate-400">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxGoals + 1 }, (_, h) => (
              <tr key={h}>
                <td className="text-slate-400 pr-2 font-medium">{h}</td>
                {Array.from({ length: maxGoals + 1 }, (_, a) => {
                  const entry = matrix.find(s => s.homeGoals === h && s.awayGoals === a);
                  const prob = entry?.probability || 0;
                  const intensity = prob / maxProb;
                  return (
                    <td
                      key={a}
                      className="w-10 h-8 rounded text-[10px] font-medium transition-colors"
                      style={{
                        backgroundColor: `rgba(0, 230, 118, ${intensity * 0.8})`,
                        color: intensity > 0.5 ? '#0a0e1a' : '#e2e8f0',
                      }}
                    >
                      {(prob * 100).toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top 5 most likely scores */}
      <div className="mt-5">
        <div className="text-xs text-slate-500 mb-2">Top 5 wahrscheinlichste Ergebnisse</div>
        <div className="space-y-1">
          {topScores.slice(0, 5).map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-slate-300 w-12 text-center font-mono">
                {s.homeGoals}:{s.awayGoals}
              </span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(s.probability / maxProb) * 100}%`,
                    backgroundColor: i === 0 ? '#00e676' : '#2979ff',
                  }}
                />
              </div>
              <span className="text-xs text-slate-400 w-12 text-right">
                {(s.probability * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  let match: Match | null = null;
  let prediction: PredictionResult | null = null;

  try {
    const matchesData = await fetchMatches();
    match = matchesData.matches.find((m: Match) => m.id === params.id) || null;

    if (match) {
      const predData = await fetchPrediction(params.id);
      prediction = predData.prediction;
    }
  } catch (e) {
    console.error('Failed to load match detail:', e);
  }

  if (!match) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl text-slate-400">Spiel nicht gefunden</h1>
        <Link href="/matches" className="mt-4 inline-block text-green-400 hover:underline">
          ← Zurück zu allen Spielen
        </Link>
      </div>
    );
  }

  const date = new Date(match.utcDate);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/matches" className="text-sm text-slate-500 hover:text-green-400 inline-flex items-center gap-1">
        ← Alle Spiele
      </Link>

      {/* Match header */}
      <div className="card p-6 text-center">
        <div className="text-xs text-slate-500 mb-2">
          {match.leagueName} · {date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })} · {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
        </div>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-white">{match.homeTeam.name}</div>
            <div className="text-xs text-slate-500 mt-1">Form: {match.homeTeam.form}</div>
            <div className="text-xs text-slate-500">
              ⌀ {match.homeTeam.avgGoalsScored.toFixed(1)} Tore/Spiel
            </div>
          </div>

          <div className="text-center">
            {prediction ? (
              <div>
                <div className="text-4xl font-black text-slate-200">
                  {prediction.mostLikelyScore.home} – {prediction.mostLikelyScore.away}
                </div>
                <div
                  className="text-sm font-semibold mt-1"
                  style={{ color: prediction.confidence >= 60 ? '#00e676' : '#fbbf24' }}
                >
                  {prediction.confidence}% Konfidenz
                </div>
              </div>
            ) : (
              <span className="text-3xl text-slate-600">VS</span>
            )}
          </div>

          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-white">{match.awayTeam.name}</div>
            <div className="text-xs text-slate-500 mt-1">Form: {match.awayTeam.form}</div>
            <div className="text-xs text-slate-500">
              ⌀ {match.awayTeam.avgGoalsScored.toFixed(1)} Tore/Spiel
            </div>
          </div>
        </div>
      </div>

      {/* Outcome probabilities */}
      {prediction && (
        <>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Ausgangs-Wahrscheinlichkeiten
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Heimsieg', prob: prediction.homeWinProbability, color: '#00e676', outcome: 'HOME' },
                { label: 'Unentschieden', prob: prediction.drawProbability, color: '#94a3b8', outcome: 'DRAW' },
                { label: 'Auswärtssieg', prob: prediction.awayWinProbability, color: '#2979ff', outcome: 'AWAY' },
              ].map(item => (
                <div
                  key={item.label}
                  className="text-center p-4 rounded-xl border"
                  style={{
                    borderColor: prediction.predictedOutcome === item.outcome
                      ? item.color
                      : 'rgba(255,255,255,0.06)',
                    backgroundColor: prediction.predictedOutcome === item.outcome
                      ? `${item.color}15`
                      : 'transparent',
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {(item.prob * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                  {prediction.predictedOutcome === item.outcome && (
                    <div className="text-[10px] mt-1" style={{ color: item.color }}>
                      ✓ Prognose
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Over/Under */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-orange-400">
                  {(prediction.over25Probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">Over 2.5 Tore</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-cyan-400">
                  {(prediction.under25Probability * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">Under 2.5 Tore</div>
              </div>
            </div>
          </div>

          <ScoreMatrix
            matrix={prediction.scoreMatrix}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
          />

          <div className="text-center text-xs text-slate-600 pb-4">
            ⚠️ Statistische Prognose, kein Wettaufruf. Erwartete Genauigkeit: 55–65%.
          </div>
        </>
      )}
    </div>
  );
}
