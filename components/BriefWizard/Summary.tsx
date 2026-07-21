'use client';

import { useEffect, useState } from 'react';
import { computePriceBreakdown, formatEUR, formatEURPrecise } from '@/lib/pricing';
import type { BriefFormState, Hebergement, Activite } from '@/lib/types';

interface Props {
  state: BriefFormState;
}

/**
 * Estimation indicative : basée sur les lieux/activités sélectionnés.
 * Purement UI - la vraie tarification est faite par l'équipe TH après le brief.
 */
export default function Summary({ state }: Props) {
  const [prixPartenaireHT, setPrixPartenaireHT] = useState(0);
  const [details, setDetails] = useState<{
    hebergementsCount: number;
    activitesCount: number;
  }>({ hebergementsCount: 0, activitesCount: 0 });

  const nbPax = state.details.nbParticipants || 1;
  const nbNights = state.details.nbNights || 1;

  useEffect(() => {
    async function estimate() {
      let total = 0;

      // Fetch hébergements sélectionnés
      const hebIds = state.budget.hebergementIds || [];
      if (hebIds.length) {
        // On prend le prix médian des lieux sélectionnés * nb nuits
        try {
          const res = await fetch('/api/airtable/hebergements');
          const json = await res.json();
          if (json.success) {
            const all = json.data as Hebergement[];
            const selected = all.filter((h) => hebIds.includes(h.id));
            const prices = selected
              .map((h) => h.fields['Prix nuit HT'])
              .filter((p): p is number => typeof p === 'number' && p > 0);
            if (prices.length) {
              const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
              total += avg * nbNights;
            }
          }
        } catch {
          // ignore
        }
      }

      // Fetch activités sélectionnées
      const actIds = state.services.activiteIds || [];
      if (actIds.length) {
        try {
          const res = await fetch('/api/airtable/activites');
          const json = await res.json();
          if (json.success) {
            const all = json.data as Activite[];
            const selected = all.filter((a) => actIds.includes(a.id));
            for (const a of selected) {
              const perPax = a.fields['Prix HT'];
              const groupe = a.fields['Prix HT groupe'];
              if (perPax) total += perPax * nbPax;
              else if (groupe) total += groupe;
            }
          }
        } catch {
          // ignore
        }
      }

      setPrixPartenaireHT(total);
      setDetails({
        hebergementsCount: hebIds.length,
        activitesCount: actIds.length,
      });
    }
    estimate();
  }, [
    state.budget.hebergementIds,
    state.services.activiteIds,
    nbPax,
    nbNights,
  ]);

  if (prixPartenaireHT === 0) {
    return (
      <div className="card mt-4 bg-th-cream/50 border-dashed">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-th-green/80">
            Une estimation apparaîtra ici dès que vous sélectionnez au moins un lieu ou une activité.
            Sinon, pas d'inquiétude — notre équipe vous enverra une proposition chiffrée.
          </div>
        </div>
      </div>
    );
  }

  const br = computePriceBreakdown({
    prixPartenaireHT,
    nbParticipants: nbPax,
  });

  return (
    <div className="card mt-4 bg-gradient-to-br from-th-cream to-th-beige-light">
      <h3 className="font-serif text-2xl text-th-green mb-1">
        Estimation indicative
      </h3>
      <p className="text-xs text-th-muted mb-5">
        Basée sur {details.hebergementsCount} lieu(x) et {details.activitesCount} activité(s) sélectionnés.
        Le prix définitif sera confirmé dans notre proposition.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-2 text-sm">
            <Row label="Prix partenaire HT" value={formatEURPrecise(br.prixPartenaireHT)} muted />
            <Row label="Prestation TH (15%)" value={formatEURPrecise(br.commissionTH)} muted />
            <Row
              label="Prix client HT"
              value={formatEURPrecise(br.prixClientHT)}
              strong
            />
            {br.serviceFeeApplied && (
              <Row
                label="Frais de service (10%)"
                value={formatEURPrecise(br.fraisService)}
                muted
              />
            )}
            <Row label="TVA 20%" value={formatEURPrecise(br.tva)} muted />
            <div className="border-t border-th-border pt-2 mt-2">
              <Row label="Total TTC" value={formatEUR(br.totalTTC)} big />
              <Row
                label="Par personne"
                value={`${formatEUR(br.prixParPersonne)} / pax`}
                muted
              />
            </div>
          </div>
        </div>

        <div className="rounded-th bg-white border border-th-border p-4">
          <div className="text-xs uppercase tracking-wider text-th-coral mb-2">
            Modalités de paiement
          </div>
          <div className="space-y-2 text-sm">
            <Row
              label="Acompte à la réservation (30%)"
              value={formatEUR(br.acompte)}
              strong
            />
            <Row
              label="Solde (avant séjour)"
              value={formatEUR(br.solde)}
              muted
            />
          </div>
          <p className="text-xs text-th-muted mt-4">
            {br.serviceFeeApplied
              ? 'Frais de service appliqués (groupe < 30 pax).'
              : 'Frais de service exonérés (groupe ≥ 30 pax).'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
  big,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
  big?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <span className={muted ? 'text-th-muted' : 'text-th-green'}>{label}</span>
      <span
        className={`${strong ? 'font-medium' : ''} ${
          big ? 'font-serif text-2xl text-th-green' : 'text-th-green'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
