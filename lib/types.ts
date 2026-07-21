/**
 * Interfaces TypeScript - modèle de données TeamHouse V2
 */

import type { WizardStepId } from './constants';
export type { WizardStepId };

// ==============================================
// AIRTABLE - schémas simplifiés (à ajuster selon la vraie base)
// ==============================================

export interface AirtableRecord<T> {
  id: string;
  createdTime?: string;
  fields: T;
}

/** Table: Hebergements */
export interface HebergementFields {
  Nom: string;
  Ville?: string;
  Region?: string;
  Description?: string;
  'Capacite max'?: number;
  'Nombre de chambres'?: number;
  'Prix nuit HT'?: number;   // prix partenaire HT (pour un booking type / min)
  Photos?: Array<{ url: string; thumbnails?: any }>;
  Amenities?: string[];      // multi-select : piscine, jacuzzi, cheminée...
  Statut?: string;           // "Actif", "Inactif"
  'Type de lieu'?: string;   // "Château", "Domaine", "Villa"...
  Latitude?: number;
  Longitude?: number;
}

export type Hebergement = AirtableRecord<HebergementFields>;

/** Table: Activites */
export interface ActiviteFields {
  Nom: string;
  Description?: string;
  Categorie?: string;         // "Sport", "Culture", "Team building"...
  'Prix HT'?: number;         // prix partenaire par personne HT
  'Prix HT groupe'?: number;  // prix forfait groupe si applicable
  Duree?: string;             // "2h", "demi-journée"...
  'Capacite min'?: number;
  'Capacite max'?: number;
  Photos?: Array<{ url: string; thumbnails?: any }>;
  Region?: string;
  Statut?: string;
}

export type Activite = AirtableRecord<ActiviteFields>;

/** Table: Sejour (table centrale) */
export interface SejourFields {
  // Client
  'Nom entreprise': string;
  'Contact prenom'?: string;
  'Contact nom'?: string;
  'Contact email': string;
  'Contact telephone'?: string;
  'Fonction contact'?: string;

  // Séjour
  'Type sejour'?: string;
  Objectifs?: string[];
  'Nombre participants'?: number;
  'Date debut'?: string;      // ISO
  'Date fin'?: string;
  'Nombre nuits'?: number;
  Region?: string;
  'Ville souhaitee'?: string;

  // Budget
  'Budget total'?: number;    // TTC souhaité par le client
  'Budget par personne'?: number;

  // Sélection
  'Hebergement souhaite'?: string[];  // linked records
  Activites?: string[];               // linked records
  Prestations?: string[];             // transferts, catering...

  // Financier (calculé)
  'Prix partenaire HT'?: number;
  'Commission TH'?: number;
  'Frais service'?: number;
  'Total HT'?: number;
  'Total TTC'?: number;
  Acompte?: number;

  // Statut
  Statut?: string;
  Source?: string;   // "Webapp", "Site vitrine", "Direct"
  Notes?: string;

  // Stripe
  'Stripe payment intent'?: string;
  'Stripe session id'?: string;
}

export type Sejour = AirtableRecord<SejourFields>;

// ==============================================
// FORM STATE - Brief Wizard
// ==============================================

export interface OrganizationData {
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone?: string;
  contactRole?: string;
  companySize?: string;
}

export interface DetailsData {
  sejourType: string;
  objectifs: string[];
  nbParticipants: number;
  dateStart: string;   // YYYY-MM-DD
  dateEnd: string;
  nbNights: number;
  region?: string;
  ville?: string;
  flexibilite?: 'strict' | 'flexible';
  notes?: string;
}

export interface BudgetData {
  budgetTotal?: number;
  budgetPerPerson?: number;
  hebergementIds: string[];    // sélection multi-lieux (options)
}

export interface ServicesData {
  activiteIds: string[];
  besoinTransfert: boolean;
  besoinCatering: boolean;
  besoinAnimateur: boolean;
  autresBesoins?: string;
}

export interface BriefFormState {
  organization: Partial<OrganizationData>;
  details: Partial<DetailsData>;
  budget: Partial<BudgetData>;
  services: Partial<ServicesData>;
  currentStep: WizardStepId;
  completedSteps: WizardStepId[];
}

// ==============================================
// CALCULS FINANCIERS
// ==============================================

export interface PriceBreakdown {
  /** Prix partenaire HT (base) */
  prixPartenaireHT: number;
  /** Commission TH (15% du prix partenaire HT) */
  commissionTH: number;
  /** Prix client HT (avant frais service) = prix partenaire / 0.85 */
  prixClientHT: number;
  /** Frais de service (10% si <30 pax, sinon 0) */
  fraisService: number;
  /** Total HT = prix client HT + frais service */
  totalHT: number;
  /** TVA (20% sur total HT) */
  tva: number;
  /** Total TTC */
  totalTTC: number;
  /** Acompte à payer (30% du TTC par défaut) */
  acompte: number;
  /** Solde restant */
  solde: number;
  /** Prix par personne (TTC) */
  prixParPersonne: number;
  /** Frais de service appliqué ou non */
  serviceFeeApplied: boolean;
}

// ==============================================
// API RESPONSES
// ==============================================

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ==============================================
// STRIPE
// ==============================================

export interface CreatePaymentIntentInput {
  sejourId: string;
  amount: number;   // en centimes
  currency?: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentIntentOutput {
  clientSecret: string;
  paymentIntentId: string;
}
