'use client';

import { useState } from 'react';
import Step1Organization from './Step1Organization';
import Step2Details from './Step2Details';
import Step3Budget from './Step3Budget';
import Step4Services from './Step4Services';
import Step5Validation from './Step5Validation';
import type { BriefFormState, OrganizationData, DetailsData, BudgetData, ServicesData } from '@/lib/types';

const STEPS = [
  { id: 1, title: 'Organisation', comp: Step1Organization },
  { id: 2, title: 'Details', comp: Step2Details },
  { id: 3, title: 'Budget & Homes', comp: Step3Budget },
  { id: 4, title: 'Services', comp: Step4Services },
  { id: 5, title: 'Review', comp: Step5Validation },
];

export default function BriefWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BriefFormState>({});
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleUpdateOrg = (data: Partial<OrganizationData>) => {
    setFormData((prev) => ({ ...prev, org: { ...prev.org, ...data } as OrganizationData }));
  };

  const handleUpdateDetails = (data: Partial<DetailsData>) => {
    setFormData((prev) => ({ ...prev, details: { ...prev.details, ...data } as DetailsData }));
  };

  const handleUpdateBudget = (data: Partial<BudgetData>) => {
    setFormData((prev) => ({ ...prev, budget: { ...prev.budget, ...data } as BudgetData }));
  };

  const handleUpdateServices = (data: Partial<ServicesData>) => {
    setFormData((prev) => ({ ...prev, services: { ...prev.services, ...data } as ServicesData }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/client/create-sejour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = `/client/sejours/${json.data.sejourId}`;
      } else {
        alert('Error: ' + (json.error || 'Unknown'));
      }
    } catch (e) {
      alert('Error submitting brief');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const CurrentStep = STEPS[step - 1].comp;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`flex-1 h-1 mx-1 rounded ${
                  s.id <= step ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Step {step} of {STEPS.length}: {STEPS[step - 1].title}
          </p>
        </div>

        {/* Current step */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {step === 1 && (
            <Step1Organization
              value={formData.org || {}}
              onChange={handleUpdateOrg}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2Details
              value={formData.details || {}}
              onChange={handleUpdateDetails}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <Step3Budget
              value={formData.budget || { hebergementIds: [] }}
              details={formData.details || {}}
              onChange={handleUpdateBudget}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <Step4Services
              value={formData.services || { activiteIds: [], besoinTransfert: false, besoinCatering: false, besoinAnimateur: false }}
              details={formData.details || {}}
              onChange={handleUpdateServices}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 5 && (
            <Step5Validation
              formData={formData}
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
