'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefWizard from '@/components/BriefWizard/BriefWizard';

export default function BriefPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <BriefWizard />
      </main>
      <Footer />
    </div>
  );
}
