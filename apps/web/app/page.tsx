import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import LanguageTest from '@/components/LanguageTest';

export const metadata: Metadata = {
  title: 'SportsPrognose – KI-Fußballprognosen',
  description: 'Präzise Fußballprognosen mit Poisson-Modell und Echtzeit-Statistiken',
};

export default function Home() {
  return <LanguageTest />;
}