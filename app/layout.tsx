import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TeamHouse — Vos séjours d\'équipe, clé-en-main',
  description:
    'Plateforme B2B de séjours d\'équipe en maisons privatisées en France : séminaires, team building, incentives.',
  themeColor: '#F0EBE0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-th-beige">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
