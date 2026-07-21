import Link from 'next/link';

export const metadata = {
  title: 'Brief envoyé · TeamHouse',
};

export default function BriefSuccessPage({
  searchParams,
}: {
  searchParams: { sejourId?: string };
}) {
  const sejourId = searchParams.sejourId;
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-serif text-4xl text-th-green mb-4">
        Merci, votre brief est bien reçu !
      </h1>
      <p className="text-th-green/80 mb-2">
        Notre équipe l'analyse et vous revient sous <strong>48h ouvrées</strong> avec
        une proposition sur mesure.
      </p>
      {sejourId && (
        <p className="text-xs text-th-muted mb-8">
          Référence dossier : <code className="bg-th-cream px-2 py-0.5 rounded">{sejourId}</code>
        </p>
      )}

      <div className="flex gap-3 justify-center mt-8">
        <Link href="/" className="btn-secondary">
          Retour à l'accueil
        </Link>
        {sejourId && (
          <Link
            href={`/payment?sejourId=${encodeURIComponent(sejourId)}`}
            className="btn-coral"
          >
            Payer un acompte (test)
          </Link>
        )}
      </div>
    </div>
  );
}
