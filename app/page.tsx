'use client';

import { useState, useEffect } from 'react';
import type { Hebergement } from '@/lib/types';

export default function HomePage() {
  const [hebergements, setHebergements] = useState<Hebergement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/airtable/hebergements?limit=6');
        const json = await res.json();
        if (json.success) setHebergements(json.data);
      } catch (e) {
        console.error('Error loading:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="bg-gradient-to-b from-th-beige to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-th-coral font-medium uppercase tracking-wider text-xs mb-3">
              Séjours d'équipe privatisés en France
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight text-th-green mb-6">
              Vos séjours d'équipe, <span className="italic">clé-en-main.</span>
            </h1>
            <p className="text-lg text-th-green/80 mb-8 max-w-2xl mx-auto">
              Oubliez les hôtels standardisés. Maisons 100% privatisées, espaces de travail inspirants, et expériences sur-mesure pour renforcer la cohésion de votre équipe.
            </p>
          </div>

          {/* SEARCH BOX */}
          <div className="card bg-white max-w-2xl mx-auto shadow-th-lg">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Dates</label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="label">Participants</label>
                <input type="number" className="input" placeholder="20" />
              </div>
              <div className="flex items-end">
                <button className="w-full btn-coral">Trouver une maison</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 6 MAISONS */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-th-green mb-3">Top 6 de notre collection</h2>
          <p className="text-th-green/70">Découvrez nos maisons les plus appréciées par les équipes</p>
        </div>

        {loading ? (
          <p className="text-center text-th-muted">Chargement...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hebergements.map((h) => {
              const photo = h.fields['Photos']?.[0]?.url;
              const nom = h.fields['Nom'];
              const commune = h.fields['Commune'];
              const couchages = h.fields['Nombre de couchages'];
              const region = h.fields['Région'];

              return (
                <div key={h.id} className="card overflow-hidden hover:shadow-th-lg transition">
                  {photo && (
                    <div className="h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                      <img src={photo} alt={nom} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-serif text-xl text-th-green mb-1">{nom}</h3>
                  <p className="text-sm text-th-muted mb-3">{commune}, {region}</p>
                  <p className="text-th-green/70 text-sm mb-4">{couchages} couchages</p>
                  <button className="w-full btn-coral text-sm">Découvrir →</button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3 PILLIERS */}
      <section className="bg-th-beige py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-th-green text-center mb-12">Votre séjour d'équipe en un clic</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-serif text-2xl text-th-green mb-3">Hébergement</h3>
              <p className="text-th-green/70">
                Maisons 100% privatisées, soigneusement sélectionnées. Confort, détente et espaces de travail adaptés.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="font-serif text-2xl text-th-green mb-3">Restauration</h3>
              <p className="text-th-green/70">
                Menus de saison, produits locaux, traiteur ou chef à domicile. Vous choisissez, on s'occupe du reste.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-serif text-2xl text-th-green mb-3">Activités</h3>
              <p className="text-th-green/70">
                Expériences sur-mesure : sport, ateliers, escape game, coaching. Renforcez la cohésion de votre équipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-4xl text-th-green mb-6">Prêt à organiser votre séjour ?</h2>
        <p className="text-lg text-th-green/80 mb-8 max-w-lg mx-auto">
          Décrivez votre projet en quelques minutes. Recevez des propositions sur mesure.
        </p>
        <button className="btn-coral text-lg">Demander un devis →</button>
      </section>
    </div>
  );
}
