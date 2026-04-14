import type { Metadata } from 'next';
import './globals.css';
import '@/lib/i18n';
import NavBar from '@/components/NavBar';
import { TranslationProvider } from '@/components/TranslationContext';

export const metadata: Metadata = {
  title: 'SportsPrognose – KI-Fußballprognosen',
  description: 'Präzise Fußballprognosen mit Poisson-Modell und Echtzeit-Statistiken',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
        <TranslationProvider>
          <NavBar />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </TranslationProvider>
      </body>
    </html>
  );
}
