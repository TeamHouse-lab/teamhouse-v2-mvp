/**
 * Debug route: Returns raw record from Hebergements table
 * Used to inspect actual Airtable field structure
 */

import { AIRTABLE_TABLES } from '@/lib/constants';

const AIRTABLE_API = 'https://api.airtable.com/v0';

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = AIRTABLE_TABLES.HEBERGEMENTS;

    if (!apiKey || !baseId) {
      return Response.json(
        { error: 'Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID' },
        { status: 400 },
      );
    }

    // Fetch first record from Hebergements table
    const url = `${AIRTABLE_API}/${baseId}/${tableId}?pageSize=1`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        { error: `Airtable API error: ${res.status}`, details: text },
        { status: res.status },
      );
    }

    const data = await res.json();

    // Return the first record with all its fields
    if (data.records && data.records.length > 0) {
      const record = data.records[0];
      return Response.json(
        {
          message: 'Raw record from Hebergements table',
          tableId: AIRTABLE_TABLES.HEBERGEMENTS,
          record,
          fieldNames: Object.keys(record.fields || {}),
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: 'No records found in Hebergements table', records: [] },
        { status: 200 },
      );
    }
  } catch (error) {
    return Response.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
