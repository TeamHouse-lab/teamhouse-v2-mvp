'use client';

import { useState } from 'react';
import type { OrganizationData } from '@/lib/types';

interface Props {
  value: Partial<OrganizationData>;
  onChange: (data: Partial<OrganizationData>) => void;
  onNext: () => void;
}

export default function Step1Organization({ value, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = () => {
    const newErrors: string[] = [];
    if (!value.nomOrganisation) newErrors.push('Organization name required');
    if (!value.mailContact) newErrors.push('Email required');
    if (!value.nombreParticipants) newErrors.push('Number of participants required');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Organization</h2>
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          {errors.map((e, i) => <p key={i} className="text-red-700 text-sm">{e}</p>)}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Organization Name</label>
          <input
            type="text"
            value={value.nomOrganisation || ''}
            onChange={(e) => onChange({ nomOrganisation: e.target.value })}
            className="w-full border rounded px-4 py-2"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={value.mailContact || ''}
            onChange={(e) => onChange({ mailContact: e.target.value })}
            className="w-full border rounded px-4 py-2"
            placeholder="hello@acme.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Participants</label>
          <input
            type="number"
            min={10}
            max={500}
            value={value.nombreParticipants || ''}
            onChange={(e) => onChange({ nombreParticipants: parseInt(e.target.value) || 0 })}
            className="w-full border rounded px-4 py-2"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Name</label>
          <input
            type="text"
            value={value.nomContact || ''}
            onChange={(e) => onChange({ nomContact: e.target.value })}
            className="w-full border rounded px-4 py-2"
            placeholder="John"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8 gap-4">
        <button
          onClick={handleNext}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
