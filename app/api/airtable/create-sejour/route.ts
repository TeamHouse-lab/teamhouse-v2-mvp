import { NextRequest, NextResponse } from 'next/server';
import { createSejour } from '@/lib/airtable';
import { CreateSejourSchema } from '@/lib/validation';
import { SEJOUR_STATUSES } from '@/lib/constants';
import type { ApiResponse, SejourFields } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/airtable/create-sejour
 *
 * Body: CreateSejourInput (organization + details + budget + services)
 * Response: { success, data: { id, url } }
 *
 * curl -X POST http://localhost:3000/api/airtable/create-sejour \
 *   -H 'Content-Type: application/json' \
 *   -d '{"organization":{"companyName":"Acme","contactFirstName":"Jean","contactLastName":"Test","contactEmail":"j@test.fr"},"details":{"sejourType":"seminaire","objectifs":["cohesion"],"nbParticipants":15,"dateStart":"2026-09-10","dateEnd":"2026-09-12","nbNights":2},"budget":{"hebergementIds":[]},"services":{"activiteIds":[],"besoinTransfert":false,"besoinCatering":false,"besoinAnimateur":false}}'
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = CreateSejourSchema.safeParse(json);
    if (!parsed.success) {
      const body: ApiResponse<never> = {
        success: false,
        error: 'Validation error',
        details: parsed.error.flatten(),
      };
      return NextResponse.json(body, { status: 400 });
    }

    const { organization, details, budget, services } = parsed.data;

    const fields: Partial<SejourFields> = {
      'Nom entreprise': organization.companyName,
      'Contact prenom': organization.contactFirstName,
      'Contact nom': organization.contactLastName,
      'Contact email': organization.contactEmail,
      'Contact telephone': organization.contactPhone,
      'Fonction contact': organization.contactRole,

      'Type sejour': details.sejourType,
      Objectifs: details.objectifs,
      'Nombre participants': details.nbParticipants,
      'Date debut': details.dateStart,
      'Date fin': details.dateEnd,
      'Nombre nuits': details.nbNights,
      Region: details.region,
      'Ville souhaitee': details.ville,

      'Budget total': budget.budgetTotal,
      'Budget par personne': budget.budgetPerPerson,
      'Hebergement souhaite': budget.hebergementIds?.length
        ? budget.hebergementIds
        : undefined,

      Activites: services.activiteIds?.length ? services.activiteIds : undefined,

      Notes: buildNotes({
        objectifs: details.objectifs,
        detailsNotes: details.notes,
        services,
      }),

      Statut: SEJOUR_STATUSES.BRIEF_SUBMITTED,
      Source: 'Webapp',
    };

    const created = await createSejour(fields);

    // Optionnel: notifier Make
    const makeUrl = process.env.MAKE_WEBHOOK_SEJOUR_CREATED;
    if (makeUrl) {
      // fire-and-forget
      fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sejourId: created.id, fields: created.fields }),
      }).catch((e) => console.warn('[make webhook]', e));
    }

    const body: ApiResponse<{ id: string; fields: SejourFields }> = {
      success: true,
      data: { id: created.id, fields: created.fields },
    };
    return NextResponse.json(body);
  } catch (err) {
    console.error('[api/airtable/create-sejour]', err);
    const body: ApiResponse<never> = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
    return NextResponse.json(body, { status: 500 });
  }
}

function buildNotes(input: {
  objectifs?: string[];
  detailsNotes?: string;
  services: {
    besoinTransfert: boolean;
    besoinCatering: boolean;
    besoinAnimateur: boolean;
    autresBesoins?: string;
  };
}): string {
  const lines: string[] = [];
  if (input.detailsNotes) lines.push(input.detailsNotes);
  const needs: string[] = [];
  if (input.services.besoinTransfert) needs.push('Transferts');
  if (input.services.besoinCatering) needs.push('Catering complémentaire');
  if (input.services.besoinAnimateur) needs.push('Animateur/facilitateur');
  if (needs.length) lines.push('Besoins : ' + needs.join(', '));
  if (input.services.autresBesoins) lines.push('Autres : ' + input.services.autresBesoins);
  return lines.join('\n');
}
