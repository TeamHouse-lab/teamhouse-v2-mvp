import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { updateSejour, getSejourById } from '@/lib/airtable';
import { CreatePaymentIntentSchema } from '@/lib/validation';
import type { ApiResponse, CreatePaymentIntentOutput } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/stripe/create-payment-intent
 * Body: { sejourId, amount (centimes), currency? }
 *
 * curl -X POST http://localhost:3000/api/stripe/create-payment-intent \
 *   -H 'Content-Type: application/json' \
 *   -d '{"sejourId":"recXXXX","amount":50000}'
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = CreatePaymentIntentSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: parsed.error.flatten() } satisfies ApiResponse<never>,
        { status: 400 },
      );
    }

    const { sejourId, amount, currency } = parsed.data;

    // Vérifier que le séjour existe
    let sejour;
    try {
      sejour = await getSejourById(sejourId);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: `Séjour introuvable: ${sejourId}` } satisfies ApiResponse<never>,
        { status: 404 },
      );
    }

    const intent = await createPaymentIntent({
      sejourId,
      amount,
      currency,
      metadata: {
        entreprise: sejour.fields['Nom entreprise'] || '',
      },
    });

    // Enregistrer l'intent dans Airtable
    await updateSejour(sejourId, {
      'Stripe payment intent': intent.paymentIntentId,
    }).catch((e) => console.warn('[updateSejour intent]', e));

    const body: ApiResponse<CreatePaymentIntentOutput> = {
      success: true,
      data: intent,
    };
    return NextResponse.json(body);
  } catch (err) {
    console.error('[api/stripe/create-payment-intent]', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' } satisfies ApiResponse<never>,
      { status: 500 },
    );
  }
}
