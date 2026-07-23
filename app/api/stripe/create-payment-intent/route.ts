import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/create-payment-intent
 * Crée un payment intent Stripe
 * PHASE 5: Intégration complète Stripe
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sejourId, amount } = body;

    if (!sejourId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing sejourId or amount' },
        { status: 400 }
      );
    }

    // TODO: Appeler Stripe API pour créer payment intent
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount * 100, // en cents
    //   currency: 'eur',
    //   metadata: { sejourId },
    // });

    // Pour maintenant: placeholder
    return NextResponse.json({
      success: true,
      data: {
        clientSecret: 'pi_test_' + Math.random().toString(36).substring(7),
        amount,
      },
    });
  } catch (err) {
    console.error('[api/stripe/create-payment-intent]', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
