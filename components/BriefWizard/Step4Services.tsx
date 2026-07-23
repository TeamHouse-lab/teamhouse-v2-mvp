'use client';

import { useEffect, useState } from 'react';
import type { ServicesData, DetailsData, Activite } from '@/lib/types';

interface Props {
  value: Partial<ServicesData>;
  details: Partial<DetailsData>;
  onChange: (data: Partial<ServicesData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Services({ value, details, onChange, onNext, onBack }: Props) {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/airtable/activites?region=${details.region || ''}&limit=12`);
        const json = await res.json();
        if (json.success) setActivites(json.data);
      } catch (e) {
        console.error('Error loading activities:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [details.region]);

  const toggleActivite = (id: string) => {
    const list = value.activiteIds || [];
    onChange({
      ...value,
      activiteIds: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Services & Activities</h2>

      <div className="space-y-4 mb-8">
        <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={value.besoinTransfert || false}
            onChange={(e) => onChange({ ...value, besoinTransfert: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="font-medium">Transfers / Shuttles</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={value.besoinCatering || false}
            onChange={(e) => onChange({ ...value, besoinCatering: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="font-medium">Catering / Meals</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={value.besoinAnimateur || false}
            onChange={(e) => onChange({ ...value, besoinAnimateur: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="font-medium">Facilitator / Animator</span>
        </label>
      </div>

      <h3 className="font-bold mb-4">Activities</h3>
      {loading ? (
        <p className="text-gray-500">Loading activities...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {activites.map((a) => {
            const selected = value.activiteIds?.includes(a.id);
            const photo = a.fields['Photos activité']?.[0]?.url;
            const nom = a.fields['Nom'];
            const type = a.fields['Type'];

            return (
              <button
                key={a.id}
                onClick={() => toggleActivite(a.id)}
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
                  <p className="text-xs text-gray-600">{type}</p>
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
