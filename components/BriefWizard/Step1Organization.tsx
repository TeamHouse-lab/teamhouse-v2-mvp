'use client';

import { useState } from 'react';
import { OrganizationSchema } from '@/lib/validation';
import type { OrganizationData } from '@/lib/types';

interface Props {
  value: Partial<OrganizationData>;
  onChange: (v: Partial<OrganizationData>) => void;
  onNext: () => void;
}

export default function Step1Organization({ value, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof OrganizationData>(k: K, v: OrganizationData[K]) {
    onChange({ ...value, [k]: v });
  }

  function submit() {
    const res = OrganizationSchema.safeParse(value);
    if (!res.success) {
      const flat = res.error.flatten().fieldErrors;
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
      <h2 className="font-serif text-3xl text-th-green mb-2">Votre entreprise</h2>
      <p className="text-th-green/70 mb-8">
        On commence par vous. Ces infos servent à personnaliser votre proposition.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label">Nom de l'entreprise *</label>
          <input
            className="input"
            placeholder="Acme SAS"
            value={value.companyName || ''}
            onChange={(e) => set('companyName', e.target.value)}
          />
          {errors.companyName && <ErrorMsg msg={errors.companyName} />}
        </div>

        <div>
          <label className="label">Prénom *</label>
          <input
            className="input"
            value={value.contactFirstName || ''}
            onChange={(e) => set('contactFirstName', e.target.value)}
          />
          {errors.contactFirstName && <ErrorMsg msg={errors.contactFirstName} />}
        </div>
        <div>
          <label className="label">Nom *</label>
          <input
            className="input"
            value={value.contactLastName || ''}
            onChange={(e) => set('contactLastName', e.target.value)}
          />
          {errors.contactLastName && <ErrorMsg msg={errors.contactLastName} />}
        </div>

        <div>
          <label className="label">Email *</label>
          <input
            className="input"
            type="email"
            placeholder="vous@entreprise.fr"
            value={value.contactEmail || ''}
            onChange={(e) => set('contactEmail', e.target.value)}
          />
          {errors.contactEmail && <ErrorMsg msg={errors.contactEmail} />}
        </div>
        <div>
          <label className="label">Téléphone</label>
          <input
            className="input"
            placeholder="+33 6…"
            value={value.contactPhone || ''}
            onChange={(e) => set('contactPhone', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Fonction</label>
          <input
            className="input"
            placeholder="Head of People"
            value={value.contactRole || ''}
            onChange={(e) => set('contactRole', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Taille de l'équipe</label>
          <select
            className="input"
            value={value.companySize || ''}
            onChange={(e) => set('companySize', e.target.value)}
          >
            <option value="">— choisir —</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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
