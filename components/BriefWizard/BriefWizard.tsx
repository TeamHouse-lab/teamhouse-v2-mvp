'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WIZARD_STEPS, type WizardStepId } from '@/lib/constants';
import type { BriefFormState } from '@/lib/types';
import Step1Organization from './Step1Organization';
import Step2Details from './Step2Details';
import Step3Budget from './Step3Budget';
import Step4Services from './Step4Services';
import Step5Validation from './Step5Validation';
import Summary from './Summary';

const INITIAL_STATE: BriefFormState = {
  organization: {},
  details: { objectifs: [], nbNights: 2 },
  budget: { hebergementIds: [] },
  services: {
    activiteIds: [],
    besoinTransfert: false,
    besoinCatering: false,
    besoinAnimateur: false,
  },
  currentStep: 'organization',
  completedSteps: [],
};

export default function BriefWizard() {
  const router = useRouter();
  const [state, setState] = useState<BriefFormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepIndex = useMemo(
    () => WIZARD_STEPS.findIndex((s) => s.id === state.currentStep),
    [state.currentStep],
  );

  function goTo(step: WizardStepId) {
    setState((s) => ({ ...s, currentStep: step }));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    const nextIdx = Math.min(stepIndex + 1, WIZARD_STEPS.length - 1);
    setState((s) => ({
      ...s,
      currentStep: WIZARD_STEPS[nextIdx].id,
      completedSteps: Array.from(new Set([...s.completedSteps, s.currentStep])),
    }));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    const prevIdx = Math.max(stepIndex - 1, 0);
    goTo(WIZARD_STEPS[prevIdx].id);
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/airtable/create-sejour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization: state.organization,
          details: state.details,
          budget: state.budget,
          services: state.services,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la création du séjour');
      }
      // Rediriger vers page de succès / paiement
      const sejourId = json.data.id;
      router.push(`/brief/success?sejourId=${encodeURIComponent(sejourId)}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <StepBar current={state.currentStep} completed={state.completedSteps} onNavigate={goTo} />

      <div className="mt-8">
        {state.currentStep === 'organization' && (
          <Step1Organization
            value={state.organization}
            onChange={(v) => setState((s) => ({ ...s, organization: v }))}
            onNext={next}
          />
        )}
        {state.currentStep === 'details' && (
          <Step2Details
            value={state.details}
            onChange={(v) => setState((s) => ({ ...s, details: v }))}
            onNext={next}
            onBack={back}
          />
        )}
        {state.currentStep === 'budget' && (
          <Step3Budget
            value={state.budget}
            details={state.details}
            onChange={(v) => setState((s) => ({ ...s, budget: v }))}
            onNext={next}
            onBack={back}
          />
        )}
        {state.currentStep === 'services' && (
          <Step4Services
            value={state.services}
            details={state.details}
            onChange={(v) => setState((s) => ({ ...s, services: v }))}
            onNext={next}
            onBack={back}
          />
        )}
        {state.currentStep === 'validation' && (
          <>
            <Step5Validation state={state} onEditStep={goTo} />
            <Summary state={state} />
            <div className="mt-8 flex justify-between items-center">
              <button className="btn-secondary" onClick={back} disabled={submitting}>
                ← Retour
              </button>
              <button
                className="btn-coral"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? 'Envoi en cours…' : 'Envoyer le brief →'}
              </button>
            </div>
            {submitError && (
              <div className="mt-4 p-4 rounded-th border border-red-300 bg-red-50 text-red-800 text-sm">
                {submitError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StepBar({
  current,
  completed,
  onNavigate,
}: {
  current: WizardStepId;
  completed: WizardStepId[];
  onNavigate: (id: WizardStepId) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-2 relative">
      {WIZARD_STEPS.map((step, i) => {
        const isCurrent = step.id === current;
        const isDone = completed.includes(step.id) && !isCurrent;
        return (
          <li key={step.id} className="flex-1 flex items-center">
            <button
              onClick={() => (isDone || isCurrent) && onNavigate(step.id)}
              disabled={!isDone && !isCurrent}
              className={`flex items-center gap-2 min-w-0 ${
                isDone || isCurrent ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <span
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium border transition-colors
                  ${
                    isCurrent
                      ? 'bg-th-green text-white border-th-green'
                      : isDone
                      ? 'bg-th-coral text-white border-th-coral'
                      : 'bg-th-cream text-th-green border-th-border'
                  }`}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span
                className={`text-sm truncate ${
                  isCurrent ? 'text-th-green font-medium' : 'text-th-muted'
                } hidden sm:block`}
              >
                {step.short}
              </span>
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 bg-th-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
