'use client';

interface Props {
  selected: string;
  onChange: (league: string) => void;
}

const leagues = [
  { id: '', label: 'Alle Ligen' },
  { id: 'BL1', label: '🇩🇪 Bundesliga' },
  { id: 'PL', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { id: 'PD', label: '🇪🇸 La Liga' },
  { id: 'CL', label: '⭐ Champions League' },
];

export default function LeagueFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {leagues.map(l => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === l.id
              ? 'text-white'
              : 'text-slate-400 hover:text-white'
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
