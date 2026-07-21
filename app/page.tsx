import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-th-coral font-medium uppercase tracking-wider text-xs mb-3">
            Séjours d'équipe · France
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight text-th-green mb-6">
            Vos séjours d'équipe, <br />
            <span className="italic">clé-en-main.</span>
          </h1>
          <p className="text-lg text-th-green/80 mb-8 max-w-lg">
            Décrivez votre projet en 5 minutes. Recevez des propositions sur mesure
            dans des maisons privatisées, aux quatre coins de la France.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/brief" className="btn-coral">
              Démarrer un projet →
            </Link>
            <a
              href="#comment"
              className="btn-secondary"
            >
              Comment ça marche
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="card bg-th-cream/60 backdrop-blur">
            <div className="text-xs uppercase tracking-wider text-th-coral mb-3">
              Aperçu d'un séjour
            </div>
            <h3 className="font-serif text-2xl text-th-green mb-2">
              Séminaire Automne · 18 pax
            </h3>
            <div className="text-th-green/80 text-sm space-y-1 mb-4">
              <div>📍 Normandie · 3 nuits</div>
              <div>🏠 Domaine privatisé · piscine, spa</div>
              <div>🎯 Cohésion + workshop stratégique</div>
            </div>
            <div className="border-t border-th-border pt-4 flex justify-between items-baseline">
              <span className="text-sm text-th-muted">Budget estimé</span>
              <span className="font-serif text-2xl text-th-green">
                24 500&nbsp;€ <span className="text-sm font-sans text-th-muted">TTC</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="comment" className="mt-24 grid md:grid-cols-3 gap-6">
        {[
          {
            n: '01',
            t: 'Vous décrivez',
            d: 'Type de séjour, dates, participants, objectifs, région. 5 minutes.',
          },
          {
            n: '02',
            t: 'On propose',
            d: 'Sélection de maisons + activités, budget clair, transparent.',
          },
          {
            n: '03',
            t: 'Vous réservez',
            d: 'Paiement sécurisé, contrat, on gère le séjour de A à Z.',
          },
        ].map((step) => (
          <div key={step.n} className="card">
            <div className="text-th-coral font-serif text-3xl mb-2">{step.n}</div>
            <h3 className="font-serif text-xl text-th-green mb-2">{step.t}</h3>
            <p className="text-th-green/70 text-sm">{step.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
