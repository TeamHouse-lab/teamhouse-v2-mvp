'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadStripe, type Stripe as StripeJS } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { formatEUR } from '@/lib/pricing';

interface Props {
  sejourId: string;
  /** Montant en euros TTC */
  amountEUR: number;
  onSuccess?: () => void;
}

let stripePromise: Promise<StripeJS | null> | null = null;
function getStripePromise() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

export default function PaymentCheckout({ sejourId, amountEUR, onSuccess }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const amountCents = useMemo(() => Math.round(amountEUR * 100), [amountEUR]);

  useEffect(() => {
    let cancelled = false;
    async function createIntent() {
      setError(null);
      try {
        const res = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sejourId, amount: amountCents }),
        });
        const json = await res.json();
        if (!res.ok || !json.success)
          throw new Error(json.error || 'Erreur Stripe');
        if (!cancelled) setClientSecret(json.data.clientSecret);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur');
      }
    }
    if (sejourId && amountCents > 0) createIntent();
    return () => {
      cancelled = true;
    };
  }, [sejourId, amountCents]);

  const stripePromise = getStripePromise();

  if (!stripePromise) {
    return (
      <div className="card border-amber-300 bg-amber-50 text-amber-900 text-sm">
        Configuration Stripe manquante (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-300 bg-red-50 text-red-800 text-sm">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="card">
        <div className="animate-pulse text-th-muted text-sm">
          Préparation du paiement…
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-serif text-2xl text-th-green">Paiement de l'acompte</h3>
        <span className="font-serif text-2xl text-th-coral">
          {formatEUR(amountEUR)}
        </span>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#2B3A3A',
              colorText: '#1F1F1F',
              colorBackground: '#ffffff',
              borderRadius: '10px',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            },
          },
        }}
      >
        <InnerForm onSuccess={onSuccess} />
      </Elements>
    </div>
  );
}

function InnerForm({ onSuccess }: { onSuccess?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'Erreur lors du paiement');
      setProcessing(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Paiement réussi ✔');
      onSuccess?.();
    }
    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        className="btn-coral w-full"
        disabled={!stripe || processing}
      >
        {processing ? 'Traitement…' : 'Payer maintenant'}
      </button>
      {message && (
        <div className="text-sm text-center text-th-green">{message}</div>
      )}
    </form>
  );
}
