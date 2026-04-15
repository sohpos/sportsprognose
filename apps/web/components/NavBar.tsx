'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelector } from './LanguageSelector';
import { useState, useEffect } from 'react';

const translations: Record<string, Record<string, string>> = {
  de: { dashboard: 'Dashboard', matches: 'Spiele', accuracy: 'Trefferquote', predictor: 'Predictor', active: 'Poisson-Modell aktiv' },
  en: { dashboard: 'Dashboard', matches: 'Matches', accuracy: 'Accuracy', predictor: 'Predictor', active: 'Poisson Model active' },
  tr: { dashboard: 'Panel', matches: 'Maçlar', accuracy: 'Doğruluk', predictor: 'Tahmin', active: 'Poisson Modeli aktif' },
};

export default function NavBar() {
  const pathname = usePathname();
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const saved = localStorage.getItem('sportsprognose_locale');
    if (saved && translations[saved]) setLocale(saved);
  }, []);

  const t = translations[locale] || translations['de'];

  return (
    <nav className="border-b" style={{ backgroundColor: '#0f1629', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="font-bold text-lg gradient-text">SportsPrognose</span>
        </Link>

        <div className="flex gap-1">
          {[
            { href: '/', label: t.dashboard },
            { href: '/predictor', label: t.predictor },
            { href: '/matches', label: t.matches },
            { href: '/accuracy', label: t.accuracy },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={pathname === link.href ? { backgroundColor: 'rgba(0,230,118,0.12)', color: '#00e676' } : {}}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <LanguageSelector />
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span>{t.active}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}