import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { updateSejour } from '@/lib/airtable';
import { SEJOUR_STATUSES } from '@/lib/constants';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook endpoint.
 * Configure dans Stripe Dashboard : https://your-domain/api/webhooks/stripe
 * Events attendus :
 *  - payment_intent.succeeded    → marquer acompte payé
 *  - payment_intent.payment_failed
 *  - checkout.session.completed
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    console.error('[stripe webhook] signature error', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const sejourId = pi.metadata?.sejourId;
        if (sejourId) {
          await updateSejour(sejourId, {
            Statut: SEJOUR_STATUSES.DEPOSIT_PAID,
          });
          console.log(`[stripe] deposit paid for sejour=${sejourId}`);
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const sejourId = session.metadata?.sejourId;
        if (sejourId) {
          await updateSejour(sejourId, {
            Statut: SEJOUR_STATUSES.DEPOSIT_PAID,
            'Stripe session id': session.id,
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(
          `[stripe] payment failed pi=${pi.id} sejour=${pi.metadata?.sejourId}`,
        );
        break;
      }

      default:
        // ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe webhook] handler error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Handler error' },
      { status: 500 },
    );
  }
}
