import Link from 'next/link';
import { Match, PredictionResult } from '@sportsprognose/core';

interface Props {
  match: Match;
  prediction?: PredictionResult;
}

function FormBadge({ form }: { form: string }) {
  return (
    <div className="flex gap-0.5">
      {form.split('').map((r, i) => (
        <span
          key={i}
          className={`w-4 h-4 rounded-sm text-[9px] font-bold flex items-center justify-center ${
            r === 'W' ? 'bg-green-500/80' : r === 'D' ? 'bg-yellow-500/80' : 'bg-red-500/80'
          }`}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

function ProbBar({ homeProb, drawProb, awayProb }: { homeProb: number; drawProb: number; awayProb: number }) {
  const h = Math.round(homeProb * 100);
  const d = Math.round(drawProb * 100);
  const a = Math.round(awayProb * 100);

  return (
    <div className="mt-3">
      <div className="flex text-xs text-slate-400 justify-between mb-1">
        <span className="text-green-400 font-medium">{h}%</span>
        <span>{d}%</span>
        <span className="text-blue-400 font-medium">{a}%</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <div className="bg-green-500 rounded-l-full transition-all" style={{ width: `${h}%` }} />
        <div className="bg-slate-500 transition-all" style={{ width: `${d}%` }} />
        <div className="bg-blue-500 rounded-r-full transition-all" style={{ width: `${a}%` }} />
      </div>
      <div className="flex text-[10px] text-slate-500 justify-between mt-0.5">
        <span>Heim</span>
        <span>Unentschieden</span>
        <span>Gast</span>
      </div>
    </div>
  );
}

export default function MatchCard({ match, prediction }: Props) {
  const date = new Date(match.utcDate);
  const dateStr = date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const timeStr = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const leagueColors: Record<string, string> = {
    BL1: 'text-red-400',
    PL: 'text-purple-400',
    PD: 'text-orange-400',
    CL: 'text-yellow-400',
  };

  return (
    <Link href={`/match/${match.id}`}>
      <div className="card p-4 hover:border-green-500/30 transition-all hover:shadow-lg hover:shadow-green-900/10 cursor-pointer">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold ${leagueColors[match.leagueId] || 'text-slate-400'}`}>
            {match.leagueName}
          </span>
          <span className="text-xs text-slate-500">{dateStr} · {timeStr}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-semibold text-white">{match.homeTeam.name}</div>
            <FormBadge form={match.homeTeam.form} />
          </div>

          <div className="px-4 text-center">
            {prediction ? (
              <div className="text-center">
                <div className="text-lg font-bold text-slate-300">
                  {prediction.mostLikelyScore.home} – {prediction.mostLikelyScore.away}
                </div>
                <div
                  className="text-xs font-medium mt-0.5"
                  style={{ color: prediction.confidence >= 60 ? '#00e676' : prediction.confidence >= 45 ? '#fbbf24' : '#f87171' }}
                >
                  {prediction.confidence}% sicher
                </div>
              </div>
            ) : (
              <span className="text-slate-600 text-sm">vs</span>
            )}
          </div>

          <div className="flex-1 text-right">
            <div className="font-semibold text-white">{match.awayTeam.name}</div>
            <div className="flex justify-end">
              <FormBadge form={match.awayTeam.form} />
            </div>
          </div>
        </div>

        {/* Probability bar */}
        {prediction && (
          <ProbBar
            homeProb={prediction.homeWinProbability}
            drawProb={prediction.drawProbability}
            awayProb={prediction.awayWinProbability}
          />
        )}

        {!prediction && (
          <div className="mt-3 h-2 bg-slate-800 rounded-full animate-pulse" />
        )}
      </div>
    </Link>
  );
}
