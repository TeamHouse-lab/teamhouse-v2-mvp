'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MesSejours() {
  const [sejours] = useState([
    {
      id: 'sej123',
      nom: 'Team Retreat Q4 2026',
      status: 'En cours',
      date: '2026-09-15 to 2026-09-18',
      participants: 50,
    },
    {
      id: 'sej456',
      nom: 'Innovation Workshop',
      status: 'Devis envoyé',
      date: '2026-10-20 to 2026-10-22',
      participants: 30,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Retreats</h1>

        {sejours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No retreats yet. Create your first brief!</p>
            <Link
              href="/brief"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
            >
              Start New Brief
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sejours.map((s) => (
              <Link
                key={s.id}
                href={`/client/sejours/${s.id}`}
                className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition border-l-4 border-orange-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{s.nom}</h2>
                    <p className="text-gray-600 mb-1">{s.date}</p>
                    <p className="text-gray-600">{s.participants} participants</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      s.status === 'En cours'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
