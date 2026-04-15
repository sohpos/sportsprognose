// apps/web/components/LeagueSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getEnabledLeagues, type LeagueConfig } from '@sportsprognose/core';

const STORAGE_KEY = 'sportsprognose_league';

interface LeagueSelectorProps {
  className?: string;
}

export function LeagueSelector({ className = '' }: LeagueSelectorProps) {
  const leagues = getEnabledLeagues();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedLeague, setSelectedLeague] = useState<string>('BL1');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedLeague(stored);
    }
  }, []);

  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeague(leagueId);
    localStorage.setItem(STORAGE_KEY, leagueId);
    setIsOpen(false);
    
    // Navigate to matches page with new league
    router.push(`/matches?league=${leagueId}`);
  };

  const currentLeague = leagues.find(l => l.id === selectedLeague) || leagues[0];

  // Don't show on team pages
  if (pathname?.startsWith('/team/')) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
        aria-label="Select league"
      >
        <span>{currentLeague.flag}</span>
        <span className="text-slate-200">{currentLeague.name}</span>
        <span className="text-slate-500 text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-[160px]">
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => handleLeagueChange(league.id)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                hover:bg-slate-700 transition-colors
                ${league.id === selectedLeague ? 'text-green-400 bg-slate-700/50' : 'text-slate-300'}
              `}
            >
              <span>{league.flag}</span>
              <span>{league.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Get selected league from URL or localStorage */
export function useSelectedLeague(): string {
  const [league, setLeague] = useState('BL1');
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLeague(stored);
    }
  }, []);
  
  return league;
}