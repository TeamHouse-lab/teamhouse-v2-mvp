/**
 * Client Airtable - accès REST à la base Webapp TeamHouse
 *
 * On utilise l'API REST directement (pas le SDK `airtable`) pour rester léger,
 * cachable, et exécutable en edge/serverless sans dépendance Node.
 *
 * Doc: https://airtable.com/developers/web/api/introduction
 */

import type {
  Activite,
  ActiviteFields,
  AirtableRecord,
  Hebergement,
  HebergementFields,
  Sejour,
  SejourFields,
} from './types';
import { AIRTABLE_TABLES } from './constants';

// ----- Config -----
const AIRTABLE_API = 'https://api.airtable.com/v0';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getApiKey() {
  return requireEnv('AIRTABLE_API_KEY');
}

function getBaseId() {
  return requireEnv('AIRTABLE_BASE_ID');
}

const TABLES = {
  sejours: () => AIRTABLE_TABLES.SEJOURS,
  hebergements: () => AIRTABLE_TABLES.HEBERGEMENTS,
  activites: () => AIRTABLE_TABLES.ACTIVITES,
};

// ==============================================
// HTTP helpers
// ==============================================

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

async function airtableFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${AIRTABLE_API}/${getBaseId()}/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    // Next.js: pas de cache par défaut sur données dynamiques
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

async function listAll<T>(
  tableId: string,
  params: Record<string, string | number | string[]> = {},
): Promise<AirtableRecord<T>[]> {
  const records: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  do {
    const qs = new URLSearchParams();

    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) {
        v.forEach((x) => qs.append(k, String(x)));
      } else {
        qs.append(k, String(v));
      }
    }

    qs.set('pageSize', '100');
    if (offset) qs.set('offset', offset);

    const query = qs.toString();
    const page = await airtableFetch<AirtableListResponse<T>>(
      query ? `${tableId}?${query}` : tableId,
    );

    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  return records;
}

// ==============================================
// HEBERGEMENTS
// ==============================================

export interface GetHebergementsOptions {
  region?: string;
  minCapacite?: number;
  onlyActive?: boolean;
  limit?: number;
}

export async function getHebergements(
  opts: GetHebergementsOptions = {},
): Promise<Hebergement[]> {
  const filters: string[] = [];

  if (opts.onlyActive !== false) {
    filters.push(`{Statut}='Actif'`);
  }

  if (opts.region) {
    filters.push(`{Region}='${escapeFormula(opts.region)}'`);
  }

  if (opts.minCapacite) {
    filters.push(`{Nombre de couchages}>=${Math.floor(opts.minCapacite)}`);
  }

  const params: Record<string, string> = {};

  if (filters.length > 0) {
    params['filterByFormula'] =
      filters.length === 1 ? filters[0] : `AND(${filters.join(',')})`;
  }

  if (opts.limit) {
    params['maxRecords'] = String(opts.limit);
  }

  return listAll<HebergementFields>(TABLES.hebergements(), params);
}

export async function getHebergementById(id: string): Promise<Hebergement> {
  return airtableFetch<Hebergement>(
    `${TABLES.hebergements()}/${encodeURIComponent(id)}`,
  );
}

// ==============================================
// ACTIVITES
// ==============================================

export interface GetActivitesOptions {
  region?: string;
  categorie?: string;
  onlyActive?: boolean;
  limit?: number;
}

export async function getActivites(
  opts: GetActivitesOptions = {},
): Promise<Activite[]> {
  const filters: string[] = [];

  if (opts.onlyActive !== false) {
    filters.push(`{Statut}='Actif'`);
  }

  if (opts.region) {
    filters.push(`{Region}='${escapeFormula(opts.region)}'`);
  }

  if (opts.categorie) {
    filters.push(`{Categorie}='${escapeFormula(opts.categorie)}'`);
  }

  const params: Record<string, string> = {};

  if (filters.length > 0) {
    params['filterByFormula'] =
      filters.length === 1 ? filters[0] : `AND(${filters.join(',')})`;
  }

  if (opts.limit) {
    params['maxRecords'] = String(opts.limit);
  }

  return listAll<ActiviteFields>(TABLES.activites(), params);
}

// ==============================================
// SEJOURS
// ==============================================

export async function createSejour(
  fields: Partial<SejourFields>,
): Promise<Sejour> {
  const body = { fields, typecast: true };
  return airtableFetch<Sejour>(TABLES.sejours(), {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateSejour(
  id: string,
  fields: Partial<SejourFields>,
): Promise<Sejour> {
  const body = { fields, typecast: true };
  return airtableFetch<Sejour>(
    `${TABLES.sejours()}/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
}

export async function getSejourById(id: string): Promise<Sejour> {
  return airtableFetch<Sejour>(
    `${TABLES.sejours()}/${encodeURIComponent(id)}`,
  );
}

// ==============================================
// Utils
// ==============================================

/** Airtable formulas: échapper les apostrophes */
function escapeFormula(v: string): string {
  return v.replace(/'/g, "\\'");
}
