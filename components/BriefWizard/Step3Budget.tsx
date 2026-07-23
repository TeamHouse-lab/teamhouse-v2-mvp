'use client';

import { useEffect, useState } from 'react';
import type { BudgetData, DetailsData, Hebergement } from '@/lib/types';

interface Props {
  value: Partial<BudgetData>;
  details: Partial<DetailsData>;
  onChange: (data: Partial<BudgetData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Budget({ value, details, onChange, onNext, onBack }: Props) {
  const [homes, setHomes] = useState<Hebergement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/airtable/hebergements?region=${details.region || ''}&limit=12`);
        const json = await res.json();
        if (json.success) setHomes(json.data);
      } catch (e) {
        console.error('Error loading homes:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [details.region]);

  const toggleHome = (id: string) => {
    const list = value.hebergementIds || [];
    onChange({
      ...value,
      hebergementIds: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Budget & Homes</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Total Budget (EUR)</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={value.budgetTotal || ''}
            onChange={(e) => onChange({ ...value, budgetTotal: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full border rounded px-4 py-2"
            placeholder="25000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Or Per Person (EUR)</label>
          <input
            type="number"
            min={0}
            step={100}
            value={value.budgetParPersonne || ''}
            onChange={(e) => onChange({ ...value, budgetParPersonne: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full border rounded px-4 py-2"
            placeholder="500"
          />
        </div>
      </div>

      <h3 className="font-bold mb-4">Available Homes</h3>
      {loading ? (
        <p className="text-gray-500">Loading homes...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {homes.map((h) => {
            const selected = value.hebergementIds?.includes(h.id);
            const photo = h.fields['Photos']?.[0]?.url;
            const nom = h.fields['Nom'];
            const region = h.fields['Région'];
            const couchages = h.fields['Nombre de couchages'];

            return (
              <button
                key={h.id}
                onClick={() => toggleHome(h.id)}
                className={`text-left rounded border-2 overflow-hidden transition ${
                  selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-32 bg-gray-200 overflow-hidden">
                  {photo ? (
                    <img src={photo} alt={nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-300 text-gray-600">No image</div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm">{nom}</h4>
                  <p className="text-xs text-gray-600">{region}</p>
                  <p className="text-xs text-gray-600">{couchages} bedrooms</p>
                  {selected && <p className="text-orange-600 text-xs font-bold mt-2">✓ Selected</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
          ← Back
        </button>
        <button onClick={onNext} className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
          Next →
        </button>
      </div>
    </div>
  );
}
