'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const translations: Record<string, Record<string, string>> = {
  de: {
    back: '← Alle Spiele', notFound: 'Spiel nicht gefunden', league: 'Liga', form: 'Form',
    goalsPerMatch: '∅ Tore/Spiel', confidence: 'Konfidenz', outcomeProbs: 'Ausgangs-Wahrscheinlichkeiten',
    homeWin: 'Heimsieg', draw: 'Unentschieden', awayWin: 'Auswärtssieg', prediction: 'Prognose',
    over25: 'Over 2.5 Tore', under25: 'Under 2.5 Tore', scoreProbs: 'Ergebnis-Wahrscheinlichkeiten',
    topScores: 'Top 5 wahrscheinlichste Ergebnisse', disclaimer: '⚠️ Statistische Prognose, kein Wettaufruf. Erwartete Genauigkeit: 55–65%.',
    home: 'Heim', away: 'Gast',
  },
  en: {
    back: '← All Matches', notFound: 'Match not found', league: 'League', form: 'Form',
    goalsPerMatch: '∅ Goals/Match', confidence: 'Confidence', outcomeProbs: 'Outcome Probabilities',
    homeWin: 'Home Win', draw: 'Draw', awayWin: 'Away Win', prediction: 'Prediction',
    over25: 'Over 2.5 Goals', under25: 'Under 2.5 Goals', scoreProbs: 'Score Probabilities',
    topScores: 'Top 5 most likely results', disclaimer: '⚠️ Statistical prediction, not a betting recommendation. Expected accuracy: 55–65%.',
    home: 'Home', away: 'Away',
  },
  tr: {
    back: '← Tüm Maçlar', notFound: 'Maç bulunamadı', league: 'Lig', form: 'Form',
    goalsPerMatch: '∅ Gol/Maç', confidence: 'Güven', outcomeProbs: 'Sonuç Olasılıkları',
    homeWin: 'Ev Galibiyeti', draw: 'Beraberlik', awayWin: 'Deplasman Galibiyeti', prediction: 'Tahmin',
    over25: 'Over 2.5 Gol', under25: 'Under 2.5 Gol', scoreProbs: 'Skor Olasılıkları',
    topScores: 'En olası 5 sonuç', disclaimer: '⚠️ İstatistiksel tahmin, bahis tavsiyesi değil. Beklenen doğruluk: %55–65.',
    home: 'Ev', away: 'Deplasman',
  },
};

function ScoreMatrix({ matrix, homeTeam, awayTeam, t }: { matrix: any[]; homeTeam: string; awayTeam: string; t: any }) {
  const maxGoals = 5;
  const topScores = matrix.filter((s: any) => s.homeGoals <= maxGoals && s.awayGoals <= maxGoals).sort((a: any, b: any) => b.probability - a.probability);
  const maxProb = topScores[0]?.probability || 1;

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.scoreProbs}</h3>
      <div className="overflow-x-auto">
        <table className="text-xs text-center">
          <thead>
            <tr>
              <th className="w-12 text-slate-500 pb-2 pr-2 text-left">{homeTeam.split(' ')[0]} ↓ / {awayTeam.split(' ')[0]} →</th>
              {Array.from({ length: maxGoals + 1 }, (_, i) => <th key={i} className="w-10 pb-2 text-slate-400">{i}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxGoals + 1 }, (_, h) => (
              <tr key={h}>
                <td className="text-slate-400 pr-2 font-medium">{h}</td>
                {Array.from({ length: maxGoals + 1 }, (_, a) => {
                  const entry = matrix.find((s: any) => s.homeGoals === h && s.awayGoals === a);
                  const prob = entry?.probability || 0;
                  const intensity = prob / maxProb;
                  return (
                    <td key={a} className="w-10 h-8 rounded text-[10px] font-medium transition-colors"
                      style={{ backgroundColor: `rgba(0, 230, 118, ${intensity * 0.8})`, color: intensity > 0.5 ? '#0a0e1a' : '#e2e8f0' }}>
                      {(prob * 100).toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <div className="text-xs text-slate-500 mb-2">{t.topScores}</div>
        <div className="space-y-1">
          {topScores.slice(0, 5).map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-slate-300 w-12 text-center font-mono">{s.homeGoals}:{s.awayGoals}</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(s.probability / maxProb) * 100}%`, backgroundColor: i === 0 ? '#00e676' : '#2979ff' }} />
              </div>
              <span className="text-xs text-slate-400 w-12 text-right">{(s.probability * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const [match, setMatch] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved) setLocale(saved);
  }, []);

  const t = translations[locale] || translations['de'];

  useEffect(() => {
    const id = params.id;
    Promise.all([
      fetch('http://localhost:3002/api/matches').then(r => r.json()),
      id ? fetch(`http://localhost:3002/api/predictions/${id}`).then(r => r.json()).catch(() => ({})) : Promise.resolve({}),
    ]).then(([data, predData]) => {
      const found = data.matches?.find((m: any) => m.id === id);
      setMatch(found || null);
      setPrediction(predData.prediction || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="text-center py-16 text-slate-500">Laden...</div>;
  if (!match) return (
    <div className="text-center py-16">
      <div className="text-4xl mb-4">⚠️</div>
      <h1 className="text-xl text-slate-400">{t.notFound}</h1>
      <Link href="/matches" className="mt-4 inline-block text-green-400 hover:underline">{t.back}</Link>
    </div>
  );

  const date = new Date(match.utcDate);
  const dateStr = date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'de-DE', { weekday: 'long', day: '2-digit', month: 'long' });
  const timeStr = date.toLocaleTimeString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'de-DE', { hour: '2-digit', minute: '2-digit' });

  const outcomeLabels = { HOME: t.homeWin, DRAW: t.draw, AWAY: t.awayWin };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/matches" className="text-sm text-slate-500 hover:text-green-400 inline-flex items-center gap-1">{t.back}</Link>
      <div className="card p-6 text-center">
        <div className="text-xs text-slate-500 mb-2">{match.leagueName} · {dateStr} · {timeStr}</div>
        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-white">{match.homeTeam.name}</div>
            <div className="text-xs text-slate-500 mt-1">{t.form}: {match.homeTeam.form}</div>
            <div className="text-xs text-slate-500">{match.homeTeam.avgGoalsScored.toFixed(1)} {t.goalsPerMatch}</div>
          </div>
          <div className="text-center">
            {prediction ? (
              <div>
                <div className="text-4xl font-black text-slate-200">{prediction.mostLikelyScore.home} – {prediction.mostLikelyScore.away}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: prediction.confidence >= 60 ? '#00e676' : '#fbbf24' }}>{prediction.confidence}% {t.confidence}</div>
              </div>
            ) : <span className="text-3xl text-slate-600">VS</span>}
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-white">{match.awayTeam.name}</div>
            <div className="text-xs text-slate-500 mt-1">{t.form}: {match.awayTeam.form}</div>
            <div className="text-xs text-slate-500">{match.awayTeam.avgGoalsScored.toFixed(1)} {t.goalsPerMatch}</div>
          </div>
        </div>
      </div>
      {prediction && (
        <>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{t.outcomeProbs}</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: t.homeWin, prob: prediction.homeWinProbability, color: '#00e676', outcome: 'HOME' },
                { label: t.draw, prob: prediction.drawProbability, color: '#94a3b8', outcome: 'DRAW' },
                { label: t.awayWin, prob: prediction.awayWinProbability, color: '#2979ff', outcome: 'AWAY' },
              ].map(item => (
                <div key={item.label} className="text-center p-4 rounded-xl border"
                  style={{ borderColor: prediction.predictedOutcome === item.outcome ? item.color : 'rgba(255,255,255,0.06)', backgroundColor: prediction.predictedOutcome === item.outcome ? `${item.color}15` : 'transparent' }}>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>{(item.prob * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                  {prediction.predictedOutcome === item.outcome && <div className="text-[10px] mt-1" style={{ color: item.color }}>✓ {t.prediction}</div>}
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-orange-400">{(prediction.over25Probability * 100).toFixed(1)}%</div>
                <div className="text-xs text-slate-500">{t.over25}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-cyan-400">{(prediction.under25Probability * 100).toFixed(1)}%</div>
                <div className="text-xs text-slate-500">{t.under25}</div>
              </div>
            </div>
          </div>
          <ScoreMatrix matrix={prediction.scoreMatrix} homeTeam={match.homeTeam.name} awayTeam={match.awayTeam.name} t={t} />
          <div className="text-center text-xs text-slate-600 pb-4">{t.disclaimer}</div>
        </>
      )}
    </div>
  );
}