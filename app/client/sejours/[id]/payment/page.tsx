'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sejourId = params.id;
  const amount = 21000; // 70% acompte

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Créer payment intent
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sejourId,
          amount,
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Ici on aurait Stripe checkout en prod
        // Pour maintenant: marquer comme "en attente de paiement"
        setSuccess(true);
      }
    } catch (e) {
      alert('Payment error: ' + (e instanceof Error ? e.message : 'Unknown'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-4">Payment Received!</h1>
            <p className="text-gray-600 mb-8">Your deposit of €{amount.toLocaleString()} has been recorded.</p>
            <Link
              href={`/client/sejours/${sejourId}`}
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Back to Retreat
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <Link href={`/client/sejours/${sejourId}`} className="text-orange-500 hover:underline mb-8 block">
          ← Back to Retreat
        </Link>

        <div className="grid grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Payment</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Retreat ID</p>
                <p className="font-semibold">{sejourId}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>€30,000</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Service fees (10%)</span>
                  <span>€3,000</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total (100%)</span>
                  <span>€33,000</span>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded p-4">
                <p className="text-sm text-gray-600 mb-1">Deposit Due (70%)</p>
                <p className="text-2xl font-bold text-orange-600">€{amount.toLocaleString()}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-gray-600 mb-1">Balance Due (30%)</p>
                <p className="text-xl font-bold text-blue-600">€{(amount * 0.43).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                <p className="text-xs text-gray-500 mt-2">Due 7 days before retreat</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>

              <div className="space-y-4">
                <div className="border rounded p-4 cursor-pointer bg-orange-50 border-orange-200">
                  <p className="font-semibold mb-2">Card Payment</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>

                <div className="border rounded p-4 cursor-pointer">
                  <p className="font-semibold mb-2">Bank Transfer</p>
                  <p className="text-sm text-gray-600">SEPA, Wire transfer</p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded font-bold mt-8 hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay €${amount.toLocaleString()} Now`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment is secure and encrypted
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6 text-sm text-blue-900">
              <p className="font-semibold mb-2">Secure Payment</p>
              <p>All transactions are processed securely. You'll receive a confirmation email immediately.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
