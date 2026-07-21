/**
 * Client Stripe - server-side.
 *
 * Le client browser utilise @stripe/stripe-js avec NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
 * initialisé côté composants (voir components/PaymentCheckout.tsx).
 */

import Stripe from 'stripe';
import type {
  CreatePaymentIntentInput,
  CreatePaymentIntentOutput,
} from './types';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
  _stripe = new Stripe(key, {
    apiVersion: '2024-06-20',
    typescript: true,
    appInfo: {
      name: 'TeamHouse V2',
      version: '0.1.0',
    },
  });
  return _stripe;
}

/**
 * Crée un PaymentIntent pour un séjour donné.
 * `amount` est en centimes (ex: 12345 = 123,45 €).
 */
export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentOutput> {
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(input.amount),
    currency: (input.currency || 'eur').toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: {
      sejourId: input.sejourId,
      ...(input.metadata || {}),
    },
    description: `TeamHouse - Séjour ${input.sejourId}`,
  });
  if (!intent.client_secret) {
    throw new Error('Stripe did not return a client_secret');
  }
  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
  };
}

/**
 * Crée une session Checkout hébergée par Stripe (alternative simple au Payment Element).
 */
export async function createCheckoutSession(params: {
  sejourId: string;
  amount: number;   // centimes
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(params.amount),
          product_data: {
            name: params.description || `Séjour TeamHouse ${params.sejourId}`,
            description: 'Acompte de réservation',
          },
        },
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { sejourId: params.sejourId },
  });
}

/**
 * Vérifie la signature d'un webhook Stripe et renvoie l'événement typé.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export async function retrieveSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.retrieve(sessionId);
}
