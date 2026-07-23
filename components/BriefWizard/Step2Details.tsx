'use client';

import { useState } from 'react';
import type { DetailsData } from '@/lib/types';

const REGIONS = [
  'Bretagne', 'Provence-Alpes-Cote Azur', 'Auvergne-Rhone-Alpes',
  'Occitanie', 'Nouvelle-Aquitaine', 'Bourgogne-Franche-Comte',
  'Ile-de-France'
];

const EVENT_TYPES = ['Team building', 'Incentive', 'Seminar', 'Conference', 'Retreat'];

interface Props {
  value: Partial<DetailsData>;
  onChange: (data: Partial<DetailsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Details({ value, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = () => {
    const newErrors: string[] = [];
    if (!value.region) newErrors.push('Region required');
    if (!value.dateDebut) newErrors.push('Start date required');
    if (!value.dateFin) newErrors.push('End date required');
    if (!value.typeEvenement) newErrors.push('Event type required');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Retreat Details</h2>
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          {errors.map((e, i) => <p key={i} className="text-red-700 text-sm">{e}</p>)}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Region</label>
          <select
            value={value.region || ''}
            onChange={(e) => onChange({ region: e.target.value })}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">-- Select region --</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={value.dateDebut || ''}
              onChange={(e) => onChange({ dateDebut: e.target.value })}
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={value.dateFin || ''}
              onChange={(e) => onChange({ dateFin: e.target.value })}
              className="w-full border rounded px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Event Type</label>
          <select
            value={value.typeEvenement || ''}
            onChange={(e) => onChange({ typeEvenement: e.target.value })}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">-- Select type --</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Objectives (comma-separated)</label>
          <textarea
            value={value.objectif?.join(', ') || ''}
            onChange={(e) => onChange({ objectif: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="w-full border rounded px-4 py-2 h-24"
            placeholder="Team bonding, strategy planning, innovation..."
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
          ← Back
        </button>
        <button onClick={handleNext} className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
          Next →
        </button>
      </div>
    </div>
  );
}
