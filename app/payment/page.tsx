import PaymentCheckout from '@/components/PaymentCheckout';
import { getSejourById } from '@/lib/airtable';
import { computePriceBreakdown } from '@/lib/pricing';
import Link from 'next/link';

export const metadata = {
  title: 'Paiement · TeamHouse',
};

export const dynamic = 'force-dynamic';

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { sejourId?: string };
}) {
  const sejourId = searchParams.sejourId;
  if (!sejourId) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-th-green mb-4">
          Séjour introuvable
        </h1>
        <p className="text-th-green/70 mb-6">
          Le lien de paiement ne contient pas de référence de séjour.
        </p>
        <Link href="/" className="btn-secondary">Retour</Link>
      </div>
    );
  }

  let sejour;
  try {
    sejour = await getSejourById(sejourId);
  } catch (e) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-th-green mb-4">
          Séjour introuvable
        </h1>
        <p className="text-th-green/70 mb-6">Référence invalide : {sejourId}</p>
        <Link href="/" className="btn-secondary">Retour</Link>
      </div>
    );
  }

  const totalTTCFromAirtable = sejour.fields['Total TTC'];
  const acompteFromAirtable = sejour.fields.Acompte;

  // Fallback: estimation minimale si pas encore chiffré
  let acompteEUR = acompteFromAirtable;
  if (!acompteEUR && totalTTCFromAirtable) {
    acompteEUR = totalTTCFromAirtable * 0.3;
  }
  if (!acompteEUR) {
    // Placeholder demo (le montant réel est calculé côté TH)
    const nb = sejour.fields['Nombre participants'] || 10;
    const nights = sejour.fields['Nombre nuits'] || 2;
    const estimate = computePriceBreakdown({
      prixPartenaireHT: nb * nights * 250,
      nbParticipants: nb,
    });
    acompteEUR = estimate.acompte;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-th-coral mb-1">
          Séjour {sejour.fields['Nom entreprise']}
        </p>
        <h1 className="font-serif text-3xl text-th-green">
          Réglez votre acompte
        </h1>
      </div>
      <PaymentCheckout sejourId={sejourId} amountEUR={acompteEUR} />
      <p className="text-xs text-th-muted mt-4">
        Paiement sécurisé via Stripe. Aucun numéro de carte n'est stocké par TeamHouse.
      </p>
    </div>
  );
}
