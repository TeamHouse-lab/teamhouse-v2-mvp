'use client';

import { useEffect, useState } from 'react';
import type { BudgetData, DetailsData, Hebergement } from '@/lib/types';
import { formatEUR } from '@/lib/pricing';

interface Props {
  value: Partial<BudgetData>;
  details: Partial<DetailsData>;
  onChange: (v: Partial<BudgetData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Budget({ value, details, onChange, onNext, onBack }: Props) {
  const [hebergements, setHebergements] = useState<Hebergement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (details.region) params.set('region', details.region);
        if (details.nbParticipants)
          params.set('minCapacite', String(details.nbParticipants));
        params.set('limit', '24');
        const res = await fetch(`/api/airtable/hebergements?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || !json.success)
          throw new Error(json.error || 'Erreur de chargement');
        if (!cancelled) setHebergements(json.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [details.region, details.nbParticipants]);

  function toggleHeb(id: string) {
    const list = value.hebergementIds || [];
    onChange({
      ...value,
      hebergementIds: list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id],
    });
  }

  return (
    <div className="card">
      <h2 className="font-serif text-3xl text-th-green mb-2">Budget & lieux</h2>
      <p className="text-th-green/70 mb-8">
        Donnez-nous une fourchette et sélectionnez les lieux qui vous inspirent.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div>
          <label className="label">Budget total indicatif (TTC, €)</label>
          <input
            className="input"
            type="number"
            min={0}
            step={500}
            placeholder="25000"
            value={value.budgetTotal ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                budgetTotal: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
        <div>
          <label className="label">Ou budget par personne (TTC, €)</label>
          <input
            className="input"
            type="number"
            min={0}
            step={50}
            placeholder="1200"
            value={value.budgetPerPerson ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                budgetPerPerson: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-serif text-xl text-th-green">
          Lieux qui matchent votre brief
        </h3>
        <span className="text-sm text-th-muted">
          {value.hebergementIds?.length || 0} sélectionné(s)
        </span>
      </div>

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-th bg-th-cream animate-pulse h-56" />
          ))}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-th border border-amber-300 bg-amber-50 text-amber-800 text-sm">
          {error} — vous pourrez continuer sans sélectionner de lieu, nous vous proposerons des options.
        </div>
      )}

      {!loading && !error && hebergements.length === 0 && (
        <div className="p-4 rounded-th border border-th-border bg-th-cream text-th-green/80 text-sm">
          Aucun lieu trouvé pour ces critères. Notre équipe vous proposera des options adaptées.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {hebergements.map((h) => {
          const selected = value.hebergementIds?.includes(h.id);
          const cover = h.fields.Photos?.[0]?.url;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => toggleHeb(h.id)}
              className={`text-left rounded-th border overflow-hidden bg-white transition-all
                ${
                  selected
                    ? 'border-th-coral ring-2 ring-th-coral/30 shadow-th-lg'
                    : 'border-th-border hover:border-th-green/40'
                }`}
            >
              {cover ? (
                <div className="relative w-full h-40 bg-th-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={h.fields.Nom} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-th-beige-dark to-th-cream flex items-center justify-center font-serif text-th-green/50">
                  {h.fields.Nom?.charAt(0) || '?'}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-serif text-lg text-th-green leading-tight">
                    {h.fields.Nom}
                  </div>
                  {selected && (
                    <span className="text-th-coral text-sm shrink-0">✓ Choisi</span>
                  )}
                </div>
                <div className="text-xs text-th-muted mb-2">
                  {[h.fields.Ville, h.fields.Region].filter(Boolean).join(' · ')}
                </div>
                <div className="text-sm text-th-green/80 flex items-center gap-3">
                  {h.fields['Capacite max'] && (
                    <span>👥 {h.fields['Capacite max']} pax</span>
                  )}
                  {h.fields['Prix nuit HT'] && (
                    <span>
                      dès {formatEUR(h.fields['Prix nuit HT'] / (1 - 0.15))} / nuit
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn-secondary" onClick={onBack}>← Retour</button>
        <button className="btn-coral" onClick={onNext}>
          Continuer →
        </button>
      </div>
    </div>
  );
}
