'use client';

import { useState, useEffect } from 'react';
import { DetailsSchema } from '@/lib/validation';
import {
  SEJOUR_TYPES,
  OBJECTIFS_SEJOUR,
  REGIONS_FR,
  MIN_PARTICIPANTS,
} from '@/lib/constants';
import type { DetailsData } from '@/lib/types';

interface Props {
  value: Partial<DetailsData>;
  onChange: (v: Partial<DetailsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Details({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof DetailsData>(k: K, v: DetailsData[K]) {
    onChange({ ...value, [k]: v });
  }

  // auto-calcul nbNights depuis dates
  useEffect(() => {
    if (value.dateStart && value.dateEnd) {
      const start = new Date(value.dateStart);
      const end = new Date(value.dateEnd);
      const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff !== value.nbNights) {
        onChange({ ...value, nbNights: Math.max(1, diff) });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.dateStart, value.dateEnd]);

  function toggleObjectif(v: string) {
    const list = value.objectifs || [];
    const has = list.includes(v);
    set('objectifs', has ? list.filter((x) => x !== v) : [...list, v]);
  }

  function submit() {
    const parsed = DetailsSchema.safeParse(value);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const errs: Record<string, string> = {};
      for (const [k, v] of Object.entries(flat)) if (v?.[0]) errs[k] = v[0];
      setErrors(errs);
      return;
    }
    setErrors({});
    onNext();
  }

  return (
    <div className="card">
      <h2 className="font-serif text-3xl text-th-green mb-2">Le séjour</h2>
      <p className="text-th-green/70 mb-8">
        Type, dates, participants — parlez-nous du projet.
      </p>

      <div className="space-y-6">
        {/* Type */}
        <div>
          <label className="label">Type de séjour *</label>
          <div className="flex flex-wrap gap-2">
            {SEJOUR_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set('sejourType', t.value)}
                className={`chip ${value.sejourType === t.value ? 'chip-active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {errors.sejourType && <ErrorMsg msg={errors.sejourType} />}
        </div>

        {/* Objectifs */}
        <div>
          <label className="label">Objectifs (plusieurs possibles) *</label>
          <div className="flex flex-wrap gap-2">
            {OBJECTIFS_SEJOUR.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleObjectif(o.value)}
                className={`chip ${
                  value.objectifs?.includes(o.value) ? 'chip-active' : ''
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {errors.objectifs && <ErrorMsg msg={errors.objectifs} />}
        </div>

        {/* Participants */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="label">Nombre de participants *</label>
            <input
              className="input"
              type="number"
              min={MIN_PARTICIPANTS}
              value={value.nbParticipants ?? ''}
              onChange={(e) => set('nbParticipants', Number(e.target.value))}
            />
            {errors.nbParticipants && <ErrorMsg msg={errors.nbParticipants} />}
          </div>
          <div>
            <label className="label">Date de début *</label>
            <input
              className="input"
              type="date"
              value={value.dateStart || ''}
              onChange={(e) => set('dateStart', e.target.value)}
            />
            {errors.dateStart && <ErrorMsg msg={errors.dateStart} />}
          </div>
          <div>
            <label className="label">Date de fin *</label>
            <input
              className="input"
              type="date"
              value={value.dateEnd || ''}
              onChange={(e) => set('dateEnd', e.target.value)}
            />
            {errors.dateEnd && <ErrorMsg msg={errors.dateEnd} />}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label">Nombre de nuits</label>
            <input
              className="input"
              type="number"
              min={1}
              value={value.nbNights ?? ''}
              onChange={(e) => set('nbNights', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Flexibilité des dates</label>
            <select
              className="input"
              value={value.flexibilite || 'flexible'}
              onChange={(e) =>
                set('flexibilite', e.target.value as 'strict' | 'flexible')
              }
            >
              <option value="flexible">Flexible (± 1 semaine)</option>
              <option value="strict">Strict</option>
            </select>
          </div>
        </div>

        {/* Lieu */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label">Région préférée</label>
            <select
              className="input"
              value={value.region || ''}
              onChange={(e) => set('region', e.target.value)}
            >
              <option value="">Peu importe</option>
              {REGIONS_FR.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ville (optionnel)</label>
            <input
              className="input"
              placeholder="Deauville, Annecy…"
              value={value.ville || ''}
              onChange={(e) => set('ville', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Notes / contexte</label>
          <textarea
            className="input min-h-[100px]"
            placeholder="Contraintes, moments clés, ambiance souhaitée…"
            value={value.notes || ''}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn-secondary" onClick={onBack}>← Retour</button>
        <button className="btn-coral" onClick={submit}>
          Continuer →
        </button>
      </div>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="text-sm text-red-600 mt-1">{msg}</p>;
}
