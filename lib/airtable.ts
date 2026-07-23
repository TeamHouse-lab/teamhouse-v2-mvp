/**
 * Client Airtable — accès REST à la base Webapp TeamHouse
 * Base: appFWg6elYrhlYYip
 * 
 * Utilise l'API REST directement pour rester léger, cachable et serverless-friendly.
 * Doc: https://airtable.com/developers/web/api/introduction
 */

import type {
  Hebergement,
  HebergementFields,
  Activite,
  ActiviteFields,
  Sejour,
  SejourFields,
  AirtableListResponse,
} from './types';
import { AIRTABLE_TABLES } from './constants';

// ============================================
// Config & Helpers
// ============================================

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
    cache: 'no-store', // Données dynamiques, pas de cache
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
): Promise<Array<{ id: string; fields: T }>> {
  const records: Array<{ id: string; fields: T }> = [];
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

function escapeFormula(v: string): string {
  return v.replace(/'/g, "\\'");
}

// ============================================
// HEBERGEMENTS
// ============================================

export interface GetHebergementsOptions {
  region?: string;
  minCapacite?: number;
  onlyActive?: boolean;
  limit?: number;
}

/**
 * Récupère les hébergements filtrés
 * Critères: région, capacité minimale
 */
export async function getHebergements(
  opts: GetHebergementsOptions = {},
): Promise<Hebergement[]> {
  const filters: string[] = [];

  if (opts.region) {
    filters.push(`{Région}='${escapeFormula(opts.region)}'`);
  }

  if (opts.minCapacite) {
    filters.push(`{Nombre de couchages}>=${Math.floor(opts.minCapacite)}`);
  }

  if (opts.onlyActive !== false) {
    filters.push(`{Statut}='Actif'`);
  }

  const params: Record<string, string> = {};

  if (filters.length > 0) {
    params['filterByFormula'] =
      filters.length === 1 ? filters[0] : `AND(${filters.join(',')})`;
  }

  if (opts.limit) {
    params['maxRecords'] = String(opts.limit);
  }

  const records = await listAll<HebergementFields>(
    AIRTABLE_TABLES.HEBERGEMENTS,
    params,
  );

  return records.map((r) => ({
    id: r.id,
    fields: r.fields,
    createdTime: '', // optionnel
  }));
}

export async function getHebergementById(id: string): Promise<Hebergement> {
  const rec = await airtableFetch<{ id: string; fields: HebergementFields }>(
    `${AIRTABLE_TABLES.HEBERGEMENTS}/${encodeURIComponent(id)}`,
  );
  return {
    id: rec.id,
    fields: rec.fields,
    createdTime: '',
  };
}

// ============================================
// ACTIVITES
// ============================================

export interface GetActivitesOptions {
  region?: string;
  type?: string;
  onlyActive?: boolean;
  limit?: number;
}

/**
 * Récupère les activités filtrées
 */
export async function getActivites(
  opts: GetActivitesOptions = {},
): Promise<Activite[]> {
  const filters: string[] = [];

  if (opts.region) {
    filters.push(`{Département}='${escapeFormula(opts.region)}'`);
  }

  if (opts.type) {
    filters.push(`{Type}='${escapeFormula(opts.type)}'`);
  }

  if (opts.onlyActive !== false) {
    filters.push(`{Visible sur l'app}=TRUE()`);
  }

  const params: Record<string, string> = {};

  if (filters.length > 0) {
    params['filterByFormula'] =
      filters.length === 1 ? filters[0] : `AND(${filters.join(',')})`;
  }

  if (opts.limit) {
    params['maxRecords'] = String(opts.limit);
  }

  const records = await listAll<ActiviteFields>(
    AIRTABLE_TABLES.ACTIVITES,
    params,
  );

  return records.map((r) => ({
    id: r.id,
    fields: r.fields,
    createdTime: '',
  }));
}

export async function getActiviteById(id: string): Promise<Activite> {
  const rec = await airtableFetch<{ id: string; fields: ActiviteFields }>(
    `${AIRTABLE_TABLES.ACTIVITES}/${encodeURIComponent(id)}`,
  );
  return {
    id: rec.id,
    fields: rec.fields,
    createdTime: '',
  };
}

// ============================================
// SEJOURS
// ============================================

/**
 * Crée un nouveau séjour dans Airtable
 * Appelé après la soumission du brief wizard
 */
export async function createSejour(
  fields: Partial<SejourFields>,
): Promise<Sejour> {
  const body = { fields, typecast: true };
  const rec = await airtableFetch<{ id: string; fields: SejourFields }>(
    AIRTABLE_TABLES.SEJOURS,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
  return {
    id: rec.id,
    fields: rec.fields,
    createdTime: new Date().toISOString(),
  };
}

/**
 * Met à jour un séjour existant
 */
export async function updateSejour(
  id: string,
  fields: Partial<SejourFields>,
): Promise<Sejour> {
  const body = { fields, typecast: true };
  const rec = await airtableFetch<{ id: string; fields: SejourFields }>(
    `${AIRTABLE_TABLES.SEJOURS}/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
  return {
    id: rec.id,
    fields: rec.fields,
    createdTime: '',
  };
}

export async function getSejourById(id: string): Promise<Sejour> {
  const rec = await airtableFetch<{ id: string; fields: SejourFields }>(
    `${AIRTABLE_TABLES.SEJOURS}/${encodeURIComponent(id)}`,
  );
  return {
    id: rec.id,
    fields: rec.fields,
    createdTime: '',
  };
}

/**
 * Récupère les séjours du client (par mail)
 */
export async function getSejoursByClient(
  mailClient: string,
): Promise<Sejour[]> {
  const filters = `OR(
    {Mail Organisateur 1}='${escapeFormula(mailClient)}',
    {Mail Organisateur 2}='${escapeFormula(mailClient)}'
  )`;

  const records = await listAll<SejourFields>(AIRTABLE_TABLES.SEJOURS, {
    filterByFormula: filters,
    maxRecords: '50',
  });

  return records.map((r) => ({
    id: r.id,
    fields: r.fields,
    createdTime: '',
  }));
}

// ============================================
// Health check
// ============================================

/**
 * Teste la connexion à Airtable
 */
export async function testConnection(): Promise<boolean> {
  try {
    const records = await listAll<HebergementFields>(
      AIRTABLE_TABLES.HEBERGEMENTS,
      { maxRecords: '1' },
    );
    return records.length >= 0;
  } catch (e) {
    console.error('[Airtable] Connection test failed:', e);
    return false;
  }
}
