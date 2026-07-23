import { NextRequest, NextResponse } from 'next/server';
import { getHebergements } from '@/lib/airtable';
import type { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/airtable/hebergements
 *  Query params:
 *    - region?: string
 *    - minCapacite?: number
 *    - limit?: number
 *
 * curl "http://localhost:3000/api/airtable/hebergements?region=Bretagne&minCapacite=20"
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const records = await getHebergements({
      region: searchParams.get('region') || undefined,
      minCapacite: searchParams.get('minCapacite')
        ? Number(searchParams.get('minCapacite'))
        : undefined,
      limit: searchParams.get('limit')
        ? Number(searchParams.get('limit'))
        : undefined,
    });

    const body: ApiResponse<typeof records> = { success: true, data: records };
    return NextResponse.json(body);
  } catch (err) {
    console.error('[api/airtable/hebergements]', err);
    const body: ApiResponse<never> = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
    return NextResponse.json(body, { status: 500 });
  }
}
