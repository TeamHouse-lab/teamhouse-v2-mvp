/**
 * Stripe integration
 * Pour l'instant: placeholder. Intégration complète en PHASE 5.
 */

export interface CreatePaymentIntentInput {
  sejourId: string;
  amount: number;
  currency: string;
  clientEmail: string;
  clientName: string;
}

export interface CreatePaymentIntentOutput {
  clientSecret: string;
  amount: number;
  currency: string;
}

/**
 * Crée un payment intent Stripe
 * TODO: Implémenter avec la clé secrète Stripe
 */
export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<CreatePaymentIntentOutput> {
  // Placeholder pour PHASE 5
  return {
    clientSecret: 'pi_test_' + Math.random().toString(36).substring(7),
    amount: input.amount,
    currency: input.currency,
  };
}

/**
 * Valide un webhook Stripe
 */
export function validateStripeWebhook(
  signature: string,
  body: string,
): Record<string, any> {
  // Placeholder pour PHASE 5
  // En prod: utiliser stripe.webhooks.constructEvent()
  return JSON.parse(body);
}
