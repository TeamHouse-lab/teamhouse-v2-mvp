'use client';

import { WIZARD_STEPS, SEJOUR_TYPES, OBJECTIFS_SEJOUR } from '@/lib/constants';
import type { BriefFormState, WizardStepId } from '@/lib/types';

interface Props {
  state: BriefFormState;
  onEditStep: (id: WizardStepId) => void;
}

export default function Step5Validation({ state, onEditStep }: Props) {
  const typeLabel =
    SEJOUR_TYPES.find((t) => t.value === state.details.sejourType)?.label ||
    state.details.sejourType;
  const objectifsLabels = (state.details.objectifs || [])
    .map((v) => OBJECTIFS_SEJOUR.find((o) => o.value === v)?.label || v)
    .join(', ');

  return (
    <div className="card">
      <h2 className="font-serif text-3xl text-th-green mb-2">Récapitulatif</h2>
      <p className="text-th-green/70 mb-6">
        Vérifiez et envoyez votre brief. Nous revenons vers vous sous 48h ouvrées.
      </p>

      <div className="divide-y divide-th-border">
        <Section
          title="Entreprise"
          onEdit={() => onEditStep('organization')}
          rows={[
            ['Entreprise', state.organization.companyName],
            [
              'Contact',
              [
                state.organization.contactFirstName,
                state.organization.contactLastName,
              ]
                .filter(Boolean)
                .join(' '),
            ],
            ['Email', state.organization.contactEmail],
            ['Téléphone', state.organization.contactPhone],
            ['Fonction', state.organization.contactRole],
          ]}
        />
        <Section
          title="Séjour"
          onEdit={() => onEditStep('details')}
          rows={[
            ['Type', typeLabel],
            ['Objectifs', objectifsLabels],
            ['Participants', state.details.nbParticipants?.toString()],
            [
              'Dates',
              state.details.dateStart && state.details.dateEnd
                ? `${state.details.dateStart} → ${state.details.dateEnd} (${state.details.nbNights} nuits)`
                : undefined,
            ],
            [
              'Lieu',
              [state.details.ville, state.details.region]
                .filter(Boolean)
                .join(', ') || 'Peu importe',
            ],
            ['Notes', state.details.notes],
          ]}
        />
        <Section
          title="Budget & lieux"
          onEdit={() => onEditStep('budget')}
          rows={[
            [
              'Budget total',
              state.budget.budgetTotal
                ? `${state.budget.budgetTotal.toLocaleString('fr-FR')} € TTC`
                : undefined,
            ],
            [
              'Budget / pax',
              state.budget.budgetPerPerson
                ? `${state.budget.budgetPerPerson.toLocaleString('fr-FR')} € TTC`
                : undefined,
            ],
            [
              'Lieux favoris',
              (state.budget.hebergementIds || []).length
                ? `${state.budget.hebergementIds!.length} sélectionné(s)`
                : 'Aucun — laissez-nous vous proposer',
            ],
          ]}
        />
        <Section
          title="Prestations"
          onEdit={() => onEditStep('services')}
          rows={[
            [
              'Activités',
              (state.services.activiteIds || []).length
                ? `${state.services.activiteIds!.length} sélectionnée(s)`
                : '—',
            ],
            [
              'Besoins',
              [
                state.services.besoinTransfert && 'Transferts',
                state.services.besoinCatering && 'Catering',
                state.services.besoinAnimateur && 'Animateur',
              ]
                .filter(Boolean)
                .join(', ') || '—',
            ],
            ['Autres', state.services.autresBesoins],
          ]}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: [string, string | undefined | null][];
}) {
  return (
    <div className="py-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg text-th-green">{title}</h3>
        <button
          className="text-sm text-th-coral hover:underline"
          onClick={onEdit}
        >
          Modifier
        </button>
      </div>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <dt className="text-th-muted min-w-[110px]">{label}</dt>
            <dd className="text-th-green break-words">
              {value ? value : <span className="text-th-muted">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
