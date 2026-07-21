import Link from 'next/link';

export const metadata = {
  title: 'Paiement confirmé · TeamHouse',
};

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-6">🥂</div>
      <h1 className="font-serif text-4xl text-th-green mb-4">
        Paiement confirmé
      </h1>
      <p className="text-th-green/80 mb-8">
        Votre acompte est bien reçu — merci !<br />
        Vous recevez un email de confirmation d'ici quelques minutes.
      </p>
      <Link href="/" className="btn-secondary">
        Retour à l'accueil
      </Link>
    </div>
  );
}
