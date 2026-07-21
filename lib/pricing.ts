/**
 * Moteur de calcul de prix TeamHouse
 * Règles :
 *   - Prix client HT = Prix partenaire HT / (1 - 15%) = / 0.85
 *   - Commission TH = Prix client HT - Prix partenaire HT
 *   - Frais de service = 10% si participants < 30, sinon 0
 *   - TVA 20% sur (prix client HT + frais service)
 */

import {
  TH_COMMISSION_RATE,
  SERVICE_FEE_RATE,
  SERVICE_FEE_MAX_PAX,
  VAT_RATE,
  DEPOSIT_RATE,
} from './constants';
import type { PriceBreakdown } from './types';

export interface PricingInput {
  prixPartenaireHT: number;   // total HT côté partenaire (hébergement + activités + prestations)
  nbParticipants: number;
  depositRate?: number;
}

/**
 * Calcule le breakdown complet d'un séjour.
 */
export function computePriceBreakdown(input: PricingInput): PriceBreakdown {
  const { prixPartenaireHT, nbParticipants } = input;
  const depositRate = input.depositRate ?? DEPOSIT_RATE;

  // Sanity
  const base = Math.max(0, prixPartenaireHT);
  const pax = Math.max(1, Math.floor(nbParticipants || 1));

  // Prix client HT = prix partenaire HT / 0.85
  const prixClientHT = base / (1 - TH_COMMISSION_RATE);
  const commissionTH = prixClientHT - base;

  // Frais de service (10% du prix client HT, si <30 pax)
  const serviceFeeApplied = pax < SERVICE_FEE_MAX_PAX;
  const fraisService = serviceFeeApplied ? prixClientHT * SERVICE_FEE_RATE : 0;

  const totalHT = prixClientHT + fraisService;
  const tva = totalHT * VAT_RATE;
  const totalTTC = totalHT + tva;

  const acompte = totalTTC * depositRate;
  const solde = totalTTC - acompte;
  const prixParPersonne = totalTTC / pax;

  return {
    prixPartenaireHT: round2(base),
    commissionTH: round2(commissionTH),
    prixClientHT: round2(prixClientHT),
    fraisService: round2(fraisService),
    totalHT: round2(totalHT),
    tva: round2(tva),
    totalTTC: round2(totalTTC),
    acompte: round2(acompte),
    solde: round2(solde),
    prixParPersonne: round2(prixParPersonne),
    serviceFeeApplied,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Formatage EUR user-facing */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEURPrecise(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
