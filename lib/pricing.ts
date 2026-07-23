/**
 * Logique de tarification TeamHouse
 * 
 * Prix client = Prix partenaire HT ÷ 0.85 (commission TH 15%)
 * Frais de service = 10% du total HT (si < 30 participants)
 * Acompte = 70% du total TTC
 * Solde = 30% du total TTC
 */

export interface PricingCalculation {
  prixPartenairHT: number;
  commissionTH: number;
  prixHTClient: number;
  fraisService: number;
  sousTotal: number;
  totalTTC: number;
  acompte70: number;
  solde30: number;
}

/**
 * Calcule le prix TTC client à partir du prix partenaire HT
 */
export function calculatePrice(
  prixPartenairHT: number,
  nombreParticipants: number,
  tauxTVA: number = 0.2, // 20% TVA par défaut
): PricingCalculation {
  // Commission TH: 15%
  const commissionTH = prixPartenairHT * 0.15;
  const prixHTClient = prixPartenairHT + commissionTH;

  // Frais de service: 10% (sauf si >= 30 participants)
  const fraisService = nombreParticipants < 30 ? prixHTClient * 0.1 : 0;

  // Sous-total HT
  const sousTotal = prixHTClient + fraisService;

  // TVA
  const tva = sousTotal * tauxTVA;

  // Total TTC
  const totalTTC = sousTotal + tva;

  // Acompte et solde
  const acompte70 = totalTTC * 0.7;
  const solde30 = totalTTC * 0.3;

  return {
    prixPartenairHT,
    commissionTH,
    prixHTClient,
    fraisService,
    sousTotal,
    totalTTC,
    acompte70,
    solde30,
  };
}

/**
 * Formate un montant en EUR
 */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Calcule le prix par personne
 */
export function pricePerPerson(totalTTC: number, nbPersonnes: number): number {
  return nbPersonnes > 0 ? totalTTC / nbPersonnes : 0;
}
