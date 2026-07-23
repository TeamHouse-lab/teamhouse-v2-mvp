import { NextRequest, NextResponse } from 'next/server';
import { getActivites } from '@/lib/airtable';
import type { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/airtable/activites
 *  Query: region (département), type, limit
 *
 * curl "http://localhost:3000/api/airtable/activites?type=Sport&limit=10"
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const records = await getActivites({
      region: searchParams.get('region') || undefined,
      type: searchParams.get('type') || undefined,
      limit: searchParams.get('limit')
        ? Number(searchParams.get('limit'))
        : undefined,
    });
    const body: ApiResponse<typeof records> = { success: true, data: records };
    return NextResponse.json(body);
  } catch (err) {
    console.error('[api/airtable/activites]', err);
    const body: ApiResponse<never> = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
    return NextResponse.json(body, { status: 500 });
  }
}
