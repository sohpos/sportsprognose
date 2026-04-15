// apps/web/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        className={`p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 ${className}`}
        aria-label="Theme toggle"
      >
        <span className="text-lg">◐</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      data-testid="theme-toggle"
      className={`
        p-2 rounded-lg transition-all duration-200
        bg-slate-200 dark:bg-slate-700 
        text-slate-700 dark:text-slate-200
        hover:bg-slate-300 dark:hover:bg-slate-600
        ${className}
      `}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      <span className="text-lg">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
