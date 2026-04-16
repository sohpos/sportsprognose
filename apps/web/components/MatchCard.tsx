'use client';

import Link from 'next/link';
import { Match, PredictionResult } from '@sportsprognose/core';

const translations: Record<string, Record<string, string>> = {
  de: {
    home: 'Heim', draw: 'Unentschieden', away: 'Gast',
    formW: 'S', formD: 'U', formN: 'N',
    formTooltip: 'Form der letzten 5 Spiele: S=Sieg, U=Unentschieden, N=Niederlage',
  },
  en: {
    home: 'Home', draw: 'Draw', away: 'Away',
    formW: 'W', formD: 'D', formL: 'L',
    formTooltip: 'Form in last 5 matches: W=Win, D=Draw, L=Loss',
  },
  tr: {
    home: 'Ev', draw: 'Beraberlik', away: 'Deplasman',
    formW: 'G', formD: 'B', formM: 'M',
    formTooltip: 'Son 5 maçtaki form: G=Galibiyet, B=Beraberlik, M=Mağlubiyet',
  },
};

interface Props {
  match: Match;
  prediction?: PredictionResult;
  locale?: string;
}

function FormBadge({ form, locale = 'de' }: { form: string; locale?: string }) {
  const t = translations[locale] || translations['de'];
  const formMap: Record<string, string> = locale === 'de' ? { W: t.formW, D: t.formD, L: t.formN } :
                                           locale === 'tr' ? { W: t.formW, D: t.formD, L: t.formM } :
                                           { W: t.formW, D: t.formD, L: t.formL };
  return (
    <div className="flex gap-0.5" title={t.formTooltip}>
      {form.split('').map((r, i) => (
        <span key={i} className={`w-4 h-4 rounded-sm text-[9px] font-bold flex items-center justify-center ${
          r === 'W' ? 'bg-green-500/80' : r === 'D' ? 'bg-yellow-500/80' : 'bg-red-500/80'}`}>
          {formMap[r] || r}
        </span>
      ))}
    </div>
  );
}

function ProbBar({ homeProb, drawProb, awayProb, locale = 'de' }: { homeProb: number; drawProb: number; awayProb: number; locale?: string }) {
  const t = translations[locale] || translations['de'];
  const h = Math.round(homeProb * 100);
  const d = Math.round(drawProb * 100);
  const a = Math.round(awayProb * 100);

  // Determine if home or away is more likely to set the label
  const isAwayMoreLikely = awayProb > homeProb;
  const probabilityLabel = isAwayMoreLikely ? t.away : t.home;
  const probabilityValue = isAwayMoreLikely ? a : h;

  return (
    <div className="mt-3">
      <div className="flex text-xs text-slate-400 justify-between mb-1">
        <span className="text-green-400 font-medium">{h}%</span>
        <span>{d}%</span>
        <span className="text-blue-400 font-medium">{a}%</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <div className="bg-green-500 rounded-l-full" style={{ width: `${h}%` }} />
        <div className="bg-slate-500" style={{ width: `${d}%` }} />
        <div className="bg-blue-500 rounded-r-full" style={{ width: `${a}%` }} />
      </div>
      <div className="flex text-[10px] text-slate-500 justify-between mt-0.5">
        <span>{t.home}</span>
        <span>{t.draw}</span>
        <span>{t.away}</span>
      </div>
    </div>
  );
}

/** Confidence Heatbar - Shows prediction certainty */
function ConfidenceHeatbar({ confidence, locale = 'de' }: { confidence: number; locale?: string }) {
  const t = translations[locale] || translations['de'];
  const pct = Math.round(confidence);
  
  // Color based on confidence level: <40% red, 40-60% yellow, >60% green
  let color = 'bg-red-500';
  let label = locale === 'en' ? 'Low' : locale === 'tr' ? 'Düşük' : 'Niedrig';
  if (pct >= 40) { color = 'bg-yellow-500'; label = locale === 'en' ? 'Medium' : locale === 'tr' ? 'Orta' : 'Mittel'; }
  if (pct > 60) { color = 'bg-green-500'; label = locale === 'en' ? 'High' : locale === 'tr' ? 'Yüksek' : 'Hoch'; }
  
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-[10px] text-slate-500">{locale === 'en' ? 'Confidence' : locale === 'tr' ? 'Güven' : 'Sicherheit'}:</span>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-medium text-slate-400">{pct}%</span>
    </div>
  );
}

export default function MatchCard({ match, prediction, locale = 'de' }: Props) {
  const t = translations[locale] || translations['de'];
  const date = new Date(match.utcDate);
  const dateStr = date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const timeStr = date.toLocaleTimeString(locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'de-DE', { hour: '2-digit', minute: '2-digit' });

  const leagueColors: Record<string, string> = { BL1: 'text-red-400', PL: 'text-purple-400', PD: 'text-orange-400', CL: 'text-yellow-400' };

  const outcomeLabel = prediction?.predictedOutcome === 'HOME' ? t.home : prediction?.predictedOutcome === 'DRAW' ? t.draw : prediction?.predictedOutcome === 'AWAY' ? t.away : '';

  return (
    <Link href={`/match/${match.id}`} className="card block p-4 hover:border-green-500/50 transition-colors border-neutral-700">
      <div className="flex justify-between items-center text-xs mb-2">
        <span className={leagueColors[match.leagueId] || 'text-slate-400'}>{match.leagueName}</span>
        <span className="text-slate-500">{dateStr} · {timeStr}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className="font-bold text-white text-lg">{match.homeTeam.shortName}</div>
          <FormBadge form={match.homeTeam.form || 'DDDDD'} locale={locale} />
        </div>
        <div className="text-slate-500 px-4 text-lg">vs</div>
        <div className="text-center flex-1">
          <div className="font-bold text-white text-lg">{match.awayTeam.shortName}</div>
          <FormBadge form={match.awayTeam.form || 'DDDDD'} locale={locale} />
        </div>
      </div>
      {prediction && (
        <div className="mt-3 pt-3 border-t border-neutral-700">
          <div className="text-center">
            <span className="text-sm font-medium text-green-400">{outcomeLabel}</span>
            <span className="text-xs text-slate-500 ml-2">({Math.round(prediction.confidence)}%)</span>
          </div>
          <ProbBar homeProb={prediction.homeWinProbability} drawProb={prediction.drawProbability} awayProb={prediction.awayWinProbability} locale={locale} />
          <ConfidenceHeatbar confidence={prediction.confidence} locale={locale} />
        </div>
      )}
    </Link>
  );
}