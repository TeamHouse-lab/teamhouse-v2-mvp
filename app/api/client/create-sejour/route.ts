import { NextRequest, NextResponse } from 'next/server';
import { createSejour } from '@/lib/airtable';
import type { ApiResponse, SejourFields } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/client/create-sejour
 * Crée un nouveau séjour après le brief wizard
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { org, details, budget, services } = body;

    // Validation basique
    if (!org?.mailContact || !details?.dateDebut) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Préparer les données pour Airtable
    const sejourData: Partial<SejourFields> = {
      'Nom Organisateur (from Organisateur)': org.nomOrganisation,
      'Mail Organisateur 1': org.mailContact,
      'Nombre de participants': org.nombreParticipants,
      'Date d\'arrivée': details.dateDebut,
      'Date de Départ (avec jr de la sem.)': details.dateFin,
      'Type d\'évenement': details.typeEvenement,
      'Objectif du séjour': details.objectif || [],
      'Budget': budget?.budgetTotal || 0,
      'Statut séjour': 'Nouveau brief',
      'Notes internes TH': `Brief submitted from webapp. Services requested: Transfer=${services?.besoinTransfert}, Catering=${services?.besoinCatering}, Animator=${services?.besoinAnimateur}`,
    };

    // Créer le séjour dans Airtable
    const sejour = await createSejour(sejourData);

    return NextResponse.json({
      success: true,
      data: { sejourId: sejour.id },
    });
  } catch (err) {
    console.error('[api/client/create-sejour]', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
