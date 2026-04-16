'use client';

interface Props {
  selected: string;
  onChange: (league: string) => void;
  locale?: string;
}

const leagues: Record<string, { id: string; label: string }[]> = {
  de: [
    { id: '', label: 'Alle Ligen' },
    { id: 'BL1', label: '🇩🇪 Bundesliga' },
    { id: 'PL', label: '🏴 Premier League' },
    { id: 'PD', label: '🇪🇸 La Liga' },
    { id: 'CL', label: '⭐ Champions League' },
  ],
  en: [
    { id: '', label: 'All Leagues' },
    { id: 'BL1', label: '🇩🇪 Bundesliga' },
    { id: 'PL', label: '🏴 Premier League' },
    { id: 'PD', label: '🇪🇸 La Liga' },
    { id: 'CL', label: '⭐ Champions League' },
  ],
  tr: [
    { id: '', label: 'Tüm Ligler' },
    { id: 'BL1', label: '🇩🇪 Bundesliga' },
    { id: 'PL', label: '🏴 Premier League' },
    { id: 'PD', label: '🇪🇸 La Liga' },
    { id: 'CL', label: '⭐ Şampiyonlar Ligi' },
  ],
};

export default function LeagueFilter({ selected, onChange, locale = 'de' }: Props) {
  const options = leagues[locale] || leagues['de'];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((l) => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === l.id ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
          style={
            selected === l.id
              ? { backgroundColor: '#00e676', color: '#0a0e1a' }
              : { backgroundColor: 'rgba(255,255,255,0.05)' }
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
