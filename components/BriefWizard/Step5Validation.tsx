'use client';

import type { BriefFormState } from '@/lib/types';

interface Props {
  formData: BriefFormState;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function Step5Validation({ formData, onBack, onSubmit, submitting }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Brief</h2>

      <div className="space-y-6 mb-8">
        {formData.org && (
          <div className="border rounded p-4">
            <h3 className="font-bold mb-3">Organization</h3>
            <p><strong>Name:</strong> {formData.org.nomOrganisation}</p>
            <p><strong>Email:</strong> {formData.org.mailContact}</p>
            <p><strong>Participants:</strong> {formData.org.nombreParticipants}</p>
            <p><strong>Contact:</strong> {formData.org.nomContact}</p>
          </div>
        )}

        {formData.details && (
          <div className="border rounded p-4">
            <h3 className="font-bold mb-3">Event Details</h3>
            <p><strong>Region:</strong> {formData.details.region}</p>
            <p><strong>Dates:</strong> {formData.details.dateDebut} to {formData.details.dateFin}</p>
            <p><strong>Type:</strong> {formData.details.typeEvenement}</p>
            <p><strong>Objectives:</strong> {formData.details.objectif?.join(', ')}</p>
          </div>
        )}

        {formData.budget && (
          <div className="border rounded p-4">
            <h3 className="font-bold mb-3">Budget</h3>
            {formData.budget.budgetTotal && <p><strong>Total:</strong> €{formData.budget.budgetTotal}</p>}
            {formData.budget.budgetParPersonne && <p><strong>Per Person:</strong> €{formData.budget.budgetParPersonne}</p>}
            <p><strong>Selected Homes:</strong> {formData.budget.hebergementIds?.length || 0}</p>
          </div>
        )}

        {formData.services && (
          <div className="border rounded p-4">
            <h3 className="font-bold mb-3">Services</h3>
            <p>Transfers: {formData.services.besoinTransfert ? 'Yes' : 'No'}</p>
            <p>Catering: {formData.services.besoinCatering ? 'Yes' : 'No'}</p>
            <p>Animator: {formData.services.besoinAnimateur ? 'Yes' : 'No'}</p>
            <p><strong>Activities:</strong> {formData.services.activiteIds?.length || 0}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={submitting}
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Brief'}
        </button>
      </div>
    </div>
  );
}
