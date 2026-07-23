'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SejourDetail({ params }: { params: { id: string } }) {
  const [sejour] = useState({
    id: params.id,
    nom: 'Team Retreat Q4 2026',
    status: 'En cours',
    dateArrivee: '2026-09-15',
    dateDepart: '2026-09-18',
    participants: 50,
    budget: 30000,
    hebergement: 'Chateau de la Foret',
    description: 'Beautiful 18th century castle in Provence with modern amenities.',
    activites: ['Team building workshop', 'Wine tasting', 'Cooking class'],
    paiementStatus: 'En attente',
    acompteAmount: 21000,
    soldeAmount: 9000,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <Link href="/client/sejours" className="text-orange-500 hover:underline">
            ← Back to My Retreats
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">{sejour.nom}</h1>
        <p className="text-gray-600 mb-8">
          {sejour.dateArrivee} to {sejour.dateDepart}
        </p>

        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Main content */}
          <div className="col-span-2 space-y-8">
            {/* Hebergement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Accommodation</h2>
              <h3 className="text-xl font-semibold mb-2">{sejour.hebergement}</h3>
              <p className="text-gray-600 mb-4">{sejour.description}</p>
              <p className="text-sm text-gray-500">{sejour.participants} participants</p>
            </div>

            {/* Activites */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Activities</h2>
              <ul className="space-y-2">
                {sejour.activites.map((a, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Planning */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Planning</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Day 1: Arrival & Welcome</h3>
                  <p className="text-gray-600 text-sm">Check-in, welcome dinner</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Day 2-3: Activities</h3>
                  <p className="text-gray-600 text-sm">Team building, workshops</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Day 4: Departure</h3>
                  <p className="text-gray-600 text-sm">Breakfast and checkout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="font-semibold text-lg">{sejour.status}</p>
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">Budget</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">€{sejour.budget.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between mb-2">
                    <span>Deposit (70%)</span>
                    <span className="font-semibold">€{sejour.acompteAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance (30%)</span>
                    <span className="font-semibold">€{sejour.soldeAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">Payment</h3>
              <p className="text-sm text-gray-600 mb-4">Status: {sejour.paiementStatus}</p>
              <Link
                href={`/client/sejours/${sejour.id}/payment`}
                className="w-full block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-center font-semibold"
              >
                Pay Now
              </Link>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">Questions?</h3>
              <a
                href="mailto:hello@teamhouse.fr"
                className="text-orange-500 hover:underline text-sm"
              >
                contact@teamhouse.fr
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
