import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import LanguageTest from '@/components/LanguageTest';
import DashboardContent from '@/components/DashboardContent';

export const metadata: Metadata = {
  title: 'SportsPrognose – KI-Fußballprognosen',
  description: 'Präzise Fußballprognosen mit Poisson-Modell und Echtzeit-Statistiken',
};

export default function Home() {
  return (
    <div className="space-y-8">
      <LanguageTest />
      <DashboardContent />
    </div>
  );
}