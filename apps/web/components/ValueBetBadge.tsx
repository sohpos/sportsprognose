// apps/web/components/ValueBetBadge.tsx
'use client';

interface ValueBet {
  hasValue: boolean;
  edge: number;
  impliedProb: number;
}

interface ValueBetData {
  home: ValueBet;
  draw: ValueBet;
  away: ValueBet;
  bestBet: 'HOME' | 'DRAW' | 'AWAY' | null;
}

interface ValueBetBadgeProps {
  valueBets?: ValueBetData;
  locale?: string;
}

const translations: Record<string, Record<string, string>> = {
  de: { value: 'Value', home: 'Heim', draw: 'Unent.', away: 'Ausw.' },
  en: { value: 'Value', home: 'Home', draw: 'Draw', away: 'Away' },
  tr: { value: 'Değer', home: 'Ev', draw: 'Berab.', away: 'Deplas.' },
};

export function ValueBetBadge({ valueBets, locale = 'de' }: ValueBetBadgeProps) {
  const t = translations[locale] || translations['de'];
  
  if (!valueBets) return null;
  
  // Find the best value bet
  const bets = [
    { market: 'HOME', ...valueBets.home, label: t.home },
    { market: 'DRAW', ...valueBets.draw, label: t.draw },
    { market: 'AWAY', ...valueBets.away, label: t.away },
  ].filter(b => b.hasValue);
  
  if (bets.length === 0) return null;
  
  // Sort by edge (highest first)
  bets.sort((a, b) => b.edge - a.edge);
  const best = bets[0];
  
  // Market symbol
  const symbol = best.market === 'HOME' ? '1' : best.market === 'DRAW' ? 'X' : '2';
  
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-900/60 text-emerald-300 px-2 py-0.5 text-xs mt-1">
      <span className="font-semibold">💎 {t.value}</span>
      <span className="font-bold">{symbol}</span>
      <span className="text-emerald-200">+{best.edge}%</span>
      <span className="text-[10px] opacity-60">
        ({best.impliedProb}% ⇢ {100 / (1 + best.edge / 100)}%)
      </span>
    </div>
  );
}

/**
 * Compute value bets from probability and odds
 * Used for tests
 */
export function computeValueBets(
  pHome: number,
  pDraw: number,
  pAway: number,
  oddsHome: number,
  oddsDraw: number,
  oddsAway: number
) {
  const markets = [
    { market: 'HOME', p: pHome, odds: oddsHome },
    { market: 'DRAW', p: pDraw, odds: oddsDraw },
    { market: 'AWAY', p: pAway, odds: oddsAway },
  ];

  return markets
    .filter(m => m.p > 0)
    .map(m => {
      const fairOdds = 1 / m.p;
      const edge = m.p - (1 / m.odds);
      return {
        market: m.market,
        probability: m.p,
        odds: m.odds,
        fairOdds,
        edge,
        hasValue: edge > 0.05,
      };
    })
    .sort((a, b) => b.edge - a.edge);
}
