/**
 * Configuration métier TeamHouse
 * Ces valeurs sont critiques - toute modification doit être validée par Benjamin.
 */

// ----- Marges & commissions -----
/** Commission TeamHouse sur prix partenaire HT (15%) */
export const TH_COMMISSION_RATE = 0.15;

/** Frais de service facturés au client (10%) */
export const SERVICE_FEE_RATE = 0.10;

/** Seuil de participants au-dessus duquel les frais de service ne s'appliquent pas */
export const SERVICE_FEE_MAX_PAX = 30;

/** TVA France standard (20%) - appliquée sur le prix client */
export const VAT_RATE = 0.20;

/** Marge sur prestations à la carte (activités, transferts, etc.) */
export const EXTRA_SERVICES_MARGIN = 0.15;

// ----- Paiement -----
/** Acompte réservation en % du total TTC */
export const DEPOSIT_RATE = 0.30;

/** Nombre de jours avant séjour pour paiement du solde */
export const BALANCE_DUE_DAYS_BEFORE = 30;

// ----- Séjour -----
export const MIN_PARTICIPANTS = 4;
export const MAX_PARTICIPANTS = 200;
export const MIN_NIGHTS = 1;
export const MAX_NIGHTS = 14;

// ----- Steps du wizard -----
export const WIZARD_STEPS = [
  { id: 'organization', label: 'Votre entreprise', short: 'Entreprise' },
  { id: 'details',      label: 'Le séjour',        short: 'Séjour' },
  { id: 'budget',       label: 'Budget & options', short: 'Budget' },
  { id: 'services',     label: 'Prestations',      short: 'Services' },
  { id: 'validation',   label: 'Récapitulatif',    short: 'Récap' },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]['id'];

// ----- Types métier (labels FR) -----
export const SEJOUR_TYPES = [
  { value: 'seminaire',       label: 'Séminaire' },
  { value: 'team-building',   label: 'Team building' },
  { value: 'incentive',       label: 'Incentive' },
  { value: 'kick-off',        label: 'Kick-off / lancement' },
  { value: 'workshop',        label: 'Workshop stratégique' },
  { value: 'autre',           label: 'Autre' },
] as const;

export const OBJECTIFS_SEJOUR = [
  { value: 'cohesion',        label: 'Renforcer la cohésion' },
  { value: 'strategie',       label: 'Aligner la stratégie' },
  { value: 'creativite',      label: 'Stimuler la créativité' },
  { value: 'celebration',     label: 'Célébrer un succès' },
  { value: 'onboarding',      label: 'Intégrer de nouveaux arrivants' },
  { value: 'formation',       label: 'Former les équipes' },
] as const;

export const REGIONS_FR = [
  'Île-de-France',
  'Normandie',
  'Bretagne',
  'Pays de la Loire',
  'Centre-Val de Loire',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Provence-Alpes-Côte d\'Azur',
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Grand Est',
  'Hauts-de-France',
  'Corse',
] as const;

// ----- Statuts séjour -----
export const SEJOUR_STATUSES = {
  DRAFT: 'Brouillon',
  BRIEF_SUBMITTED: 'Brief soumis',
  OPTIONS_SENT: 'Options envoyées',
  BOOKED: 'Réservé',
  DEPOSIT_PAID: 'Acompte payé',
  BALANCE_PAID: 'Soldé',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
} as const;

// ----- Contact / branding -----
export const TH_INFO = {
  name: 'TeamHouse',
  legalName: 'TeamHouse SAS',
  email: 'contact@teamhouse.fr',
  phone: '+33 1 XX XX XX XX',
  website: 'https://teamhouse.fr',
  tagline: 'Vos séjours d\'équipe, clé-en-main.',
} as const;
