// apps/web/components/FormCurve.tsx
'use client';

import { useState } from 'react';

interface FormMatch {
  date: string;
  opponent: string;
  home: boolean;
  goalsFor: number;
  goalsAgainst: number;
}

interface FormCurveProps {
  form: string; // e.g. "WWDLW"
  matches?: FormMatch[];
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    form: 'Form', last5: 'Letzte 5',
    W: 'S', D: 'U', N: 'N',
    home: 'Heim', away: 'Auswärts',
  },
  en: {
    form: 'Form', last5: 'Last 5',
    W: 'W', D: 'D', L: 'L',
    home: 'Home', away: 'Away',
  },
  tr: {
    form: 'Form', last5: 'Son 5',
    W: 'G', D: 'B', M: 'M',
    home: 'Ev', away: 'Deplasman',
  },
};

/** Simple FormBadge - shows last 5 results as colored badges */
export function FormBadge({ form, locale = 'de' }: { form: string; locale?: string }) {
  const t = translations[locale] || translations['de'];
  const formMap: Record<string, string> = { W: t.W, D: t.D, L: t.N };
  
  const validForm = form?.length >= 5 ? form.slice(0, 5) : 'DDDDD';
  
  return (
    <div className="flex gap-0.5" title={`${t.form}: ${t.last5}`}>
      {validForm.split('').map((r, i) => (
        <span key={i} className={`w-4 h-4 rounded-sm text-[9px] font-bold flex items-center justify-center ${
          r === 'W' ? 'bg-green-500/80 text-white' : r === 'D' ? 'bg-yellow-500/80 text-black' : 'bg-red-500/80 text-white'
        }`}>
          {formMap[r] || r}
        </span>
      ))}
    </div>
  );
}

/** Enhanced FormCurve - shows detailed match history */
export function FormCurve({ form, matches = [], locale = 'de' }: FormCurveProps) {
  const [expanded, setExpanded] = useState(false);
  const t = translations[locale] || translations['de'];
  
  const validForm = form?.length >= 5 ? form.slice(0, 5) : 'DDDDD';
  const formChars = validForm.split('');
  
  // Calculate form points (3 for W, 1 for D, 0 for L)
  const formPoints = formChars.reduce((acc, r) => acc + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
  
  // Determine trend (last 3 vs first 2)
  const recentForm = formChars.slice(-3).filter(r => r === 'W').length;
  const trend = recentForm >= 2 ? '📈' : recentForm === 1 ? '➡️' : '📉';
  
  return (
    <div className="relative">
      {/* Compact view */}
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex gap-0.5">
          {formChars.map((r, i) => (
            <span key={i} className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
              r === 'W' ? 'bg-green-500 text-white' : r === 'D' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
            }`}>
              {r}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-400">{formPoints} pts</span>
        <span className="text-xs">{trend}</span>
      </div>
      
      {/* Expanded view with details */}
      {expanded && (
        <div className="absolute z-50 top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl min-w-[200px]">
          <div className="text-xs font-semibold text-slate-400 mb-2">{t.last5}</div>
          <div className="space-y-1">
            {matches.length > 0 ? matches.slice(0, 5).map((m, i) => {
              const result = m.goalsFor > m.goalsAgainst ? 'W' : m.goalsFor === m.goalsAgainst ? 'D' : 'L';
              return (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-500">{new Date(m.date).toLocaleDateString(locale)}</span>
                  <span className={m.home ? 'text-blue-400' : 'text-red-400'}>{m.home ? t.home : t.away}</span>
                  <span className="text-slate-300">{m.opponent}</span>
                  <span className={`font-bold ${result === 'W' ? 'text-green-400' : result === 'D' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {m.goalsFor}:{m.goalsAgainst}
                  </span>
                </div>
              );
            }) : formChars.map((r, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-slate-500">Match {i + 1}</span>
                <span className={`font-bold ${r === 'W' ? 'text-green-400' : r === 'D' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {r === 'W' ? 'Sieg' : r === 'D' ? 'Unent.' : 'Niederlage'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
