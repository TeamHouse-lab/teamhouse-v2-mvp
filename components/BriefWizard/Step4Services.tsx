'use client';

import { useEffect, useState } from 'react';
import type { Activite, DetailsData, ServicesData } from '@/lib/types';
import { formatEUR } from '@/lib/pricing';

interface Props {
  value: Partial<ServicesData>;
  details: Partial<DetailsData>;
  onChange: (v: Partial<ServicesData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Services({ value, details, onChange, onNext, onBack }: Props) {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (details.region) params.set('region', details.region);
        params.set('limit', '30');
        const res = await fetch(`/api/airtable/activites?${params.toString()}`);
        const json = await res.json();
        if (res.ok && json.success && !cancelled) setActivites(json.data);
      } catch {
        // silencieux : les activités sont optionnelles
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [details.region]);

  function toggleAct(id: string) {
    const list = value.activiteIds || [];
    onChange({
      ...value,
      activiteIds: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    });
  }

  function toggleBool(k: keyof ServicesData, v: boolean) {
    onChange({ ...value, [k]: v });
  }

  const categories = Array.from(
    new Set(activites.map((a) => a.fields.Categorie).filter(Boolean) as string[]),
  );

  return (
    <div className="card">
      <h2 className="font-serif text-3xl text-th-green mb-2">Prestations</h2>
      <p className="text-th-green/70 mb-8">
        Activités, transferts, catering : ce qui donnera du relief au séjour.
      </p>

      {/* Besoins généraux */}
      <div className="grid md:grid-cols-3 gap-3 mb-8">
        <Checkbox
          label="Transferts / navettes"
          checked={!!value.besoinTransfert}
          onChange={(v) => toggleBool('besoinTransfert', v)}
        />
        <Checkbox
          label="Catering complémentaire"
          checked={!!value.besoinCatering}
          onChange={(v) => toggleBool('besoinCatering', v)}
        />
        <Checkbox
          label="Animateur / facilitateur"
          checked={!!value.besoinAnimateur}
          onChange={(v) => toggleBool('besoinAnimateur', v)}
        />
      </div>

      {/* Activités */}
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-serif text-xl text-th-green">
          Activités disponibles
        </h3>
        <span className="text-sm text-th-muted">
          {value.activiteIds?.length || 0} sélectionnée(s)
        </span>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-th bg-th-cream animate-pulse h-40" />
          ))}
        </div>
      ) : activites.length === 0 ? (
        <div className="p-4 rounded-th border border-th-border bg-th-cream text-th-green/80 text-sm">
          Nous vous proposerons des activités sur mesure dans notre proposition.
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-full bg-th-cream border border-th-border text-th-green/80"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            {activites.map((a) => {
              const selected = value.activiteIds?.includes(a.id);
              const cover = a.fields.Photos?.[0]?.url;
              const perPax = a.fields['Prix HT'];
              const prixClient = perPax ? perPax / (1 - 0.15) : undefined;
              const nomStr = typeof a.fields.Nom === 'string' ? a.fields.Nom : String(a.fields.Nom || 'Sans nom');
              const categStr = typeof a.fields.Categorie === 'string' ? a.fields.Categorie : undefined;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAct(a.id)}
                  className={`text-left rounded-th border overflow-hidden bg-white transition-all
                    ${
                      selected
                        ? 'border-th-coral ring-2 ring-th-coral/30'
                        : 'border-th-border hover:border-th-green/40'
                    }`}
                >
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={nomStr} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium text-th-green leading-tight text-sm">
                        {nomStr}
                      </div>
                      {selected && <span className="text-th-coral text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-th-muted flex items-center gap-2">
                      {categStr && <span>{categStr}</span>}
                      {a.fields.Duree && <span>· {a.fields.Duree}</span>}
                    </div>
                    {prixClient && (
                      <div className="text-xs text-th-green/80 mt-1">
                        dès {formatEUR(prixClient)} / pax
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-6">
        <label className="label">Autres besoins / précisions</label>
        <textarea
          className="input min-h-[80px]"
          placeholder="Kit d'accueil, cadeau, dietary requirements, etc."
          value={value.autresBesoins || ''}
          onChange={(e) => onChange({ ...value, autresBesoins: e.target.value })}
        />
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

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`cursor-pointer rounded-th border px-4 py-3 flex items-center gap-3 transition-colors
        ${
          checked
            ? 'border-th-coral bg-th-coral/5'
            : 'border-th-border bg-white hover:border-th-green/40'
        }`}
    >
      <input
        type="checkbox"
        className="accent-th-coral"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-th-green">{label}</span>
    </label>
  );
}
