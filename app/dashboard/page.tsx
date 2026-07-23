'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const STATUSES = [
  'Nouveau brief',
  'Qualification',
  'Devis envoyé',
  'Signé',
  'En cours',
  'Terminé',
];

const DEMO_SEJOURS = [
  {
    id: 'sej001',
    nom: 'Acme Corp Retreat',
    status: 'Nouveau brief',
    clients: 'John Doe',
    participants: 50,
    dateDebut: '2026-09-15',
  },
  {
    id: 'sej002',
    nom: 'Tech Innovation',
    status: 'Devis envoyé',
    clients: 'Jane Smith',
    participants: 30,
    dateDebut: '2026-10-20',
  },
  {
    id: 'sej003',
    nom: 'Sales Kick-off',
    status: 'Signé',
    clients: 'Bob Johnson',
    participants: 75,
    dateDebut: '2026-11-10',
  },
  {
    id: 'sej004',
    nom: 'Leadership Summit',
    status: 'En cours',
    clients: 'Alice Williams',
    participants: 40,
    dateDebut: '2026-08-20',
  },
];

export default function Dashboard() {
  const [sejours] = useState(DEMO_SEJOURS);

  const getSejours = (status: string) => sejours.filter((s) => s.status === status);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold">Sales Pipeline</h1>
          <Link
            href="/dashboard/create-devis"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            + Create Quote
          </Link>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-6 gap-4">
          {STATUSES.map((status) => {
            const items = getSejours(status);
            return (
              <div key={status} className="bg-gray-200 rounded-lg p-4 min-h-96">
                <h2 className="font-bold mb-4 text-sm">{status}</h2>
                <div className="space-y-3">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded p-3 shadow-sm cursor-pointer hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-sm mb-2">{s.nom}</h3>
                      <p className="text-xs text-gray-600 mb-2">{s.clients}</p>
                      <div className="text-xs text-gray-500">
                        <p>{s.participants} pax</p>
                        <p>{s.dateDebut}</p>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-gray-500 text-xs text-center py-4">No items</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Retreats</h2>
          <div className="space-y-3">
            {sejours.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{s.nom}</h3>
                  <p className="text-sm text-gray-600">{s.clients} • {s.dateDebut}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    s.status === 'En cours'
                      ? 'bg-blue-100 text-blue-800'
                      : s.status === 'Terminé'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
