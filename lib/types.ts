/**
 * Types TypeScript basés sur les vrais champs Airtable
 */

// ============================================
// Types génériques Airtable
// ============================================

export interface AirtableRecord<T = Record<string, any>> {
  id: string;
  createdTime: string;
  fields: T;
}

export interface AirtableListResponse<T = Record<string, any>> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// ============================================
// Types métier
// ============================================

// --- HEBERGEMENT ---

export interface HebergementFields {
  // Identité
  'Nom': string;
  'Région'?: string;
  'Commune'?: string;
  'Département'?: string;
  'CP'?: string;
  'Adresse'?: string;
  
  // Géolocalisation
  'lat'?: string | number;
  'lng'?: string | number;
  
  // Capacités
  'Nombre de couchages'?: number;
  'Nombre de chambres'?: number;
  'Nombre de sdb'?: number;
  'Nb place de parking'?: number;
  'Nombre d\'espaces de travail'?: number;
  
  // Description
  'Type de lieu'?: string;
  'Description'?: string;
  'Parties communes'?: string;
  
  // Tarifs
  'Tarif location'?: number;
  'Prix'?: number;
  'Prix défaut (from Tarif location)'?: number;
  'Frais de réservation'?: number;
  'Taux de commission'?: number;
  
  // Contenus & liens
  'Photos'?: Array<{ id?: string; url: string; thumbnails?: any }>;
  'Restauration'?: string[]; // record IDs
  'Activités'?: string[]; // record IDs
  'Services'?: string[]; // record IDs
  
  // Status
  'Statut'?: string;
  'Visible sur l\'app ?'?: boolean;
  'Date de création'?: string;
  
  // Amenités
  'Débit Wi-fi'?: string;
  'Autorisation fumer interieur'?: string | boolean;
  'Autorisation fumer extérieur'?: string | boolean;
  'Animaux sur place?'?: string | boolean;
  'Adapté PMR'?: string | boolean;
}

export type Hebergement = AirtableRecord<HebergementFields>;

// --- ACTIVITE ---

export interface ActiviteFields {
  // Identité
  'Nom': string;
  'Département'?: string;
  'Type'?: string;
  'Thème'?: string;
  
  // Descriptions
  'Description courte activité'?: string;
  'Description longue activité'?: string;
  
  // Localisation & format
  'Intérieur ou extérieur'?: string;
  'Hébergement'?: string[]; // record IDs
  'Déplacement à domicile?'?: boolean;
  'Déplacement dans un rayon de'?: string;
  'Déplacement dans les zones'?: string;
  
  // Participants
  'Nb min participants'?: number;
  'Nb max participants'?: number;
  'Langues possibles'?: string;
  'Pour quel public?'?: string;
  
  // Tarifs
  'Prix'?: number;
  'Mode de tarification (from Tarifs activités)'?: string;
  'Tarif Forfaitaire (from Tarifs activités)'?: number;
  
  // Contenu
  'Photos activité'?: Array<{ id?: string; url: string; thumbnails?: any }>;
  
  // Status
  'Visible sur l\'app'?: boolean;
  'Date de création'?: string;
}

export type Activite = AirtableRecord<ActiviteFields>;

// --- SEJOUR ---

export interface SejourFields {
  // Identité du séjour
  // Note: il faudra créer un vrai champ "Nom du séjour" plutôt que de re-utiliser organisateur
  
  // Client (liens)
  'Organisateur'?: string; // record ID
  'Nom Organisateur (from Organisateur)'?: string;
  'Prénom Organisateur (from Organisateur)'?: string;
  'Mail Organisateur 1'?: string;
  'Mail Organisateur 2'?: string;
  'Téléphone organisateur'?: string;
  
  // Dates du séjour
  'Date d\'arrivée'?: string; // format YYYY-MM-DD
  'Date de Départ (avec jr de la sem.)'?: string;
  'Horaires d\'arrivée'?: string;
  'Horaires de départ'?: string;
  'Nombre de nuit'?: number;
  
  // Contenu
  'Nombre de participants'?: number;
  'Objectif du séjour'?: string[];
  'Type d\'évenement'?: string;
  'Catégorie du séjour'?: string;
  
  // Budget
  'Budget'?: number;
  
  // Statuts
  'Statut séjour'?: string; // "Nouveau brief", "Qualification", "Devis envoyé", etc.
  
  // Services / hébergement
  'Demande service'?: string[]; // record IDs
  'Restauration séjour'?: string[]; // record IDs
  'Formule de restauration de ce séjour'?: string;
  
  // Admin
  'Date de création'?: string;
  'Dernière modification'?: string;
  'Notes internes TH'?: string;
  'UniqueID'?: string;
}

export type Sejour = AirtableRecord<SejourFields>;

// ============================================
// API Response types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Frontend types (abstractions)
// ============================================

/**
 * HebergementCard: version "cardée" pour affichage
 * On prend un sous-ensemble des champs Airtable
 */
export interface HebergementCard {
  id: string;
  nom: string;
  ville?: string;
  region?: string;
  capaciteMin: number;
  prixParNuit?: number;
  photoPrincipale?: string;
  type?: string;
}

/**
 * ActiviteCard: version "cardée"
 */
export interface ActiviteCard {
  id: string;
  nom: string;
  type?: string;
  prixParPersonne?: number;
  duree?: string;
  photoPrincipale?: string;
  description?: string;
}

/**
 * BriefData: agrégation pour le Brief Wizard
 */
export interface BriefWizardData {
  step1_organisation?: {
    nomOrganisation: string;
    secteurActivite: string;
    nombreParticipants: number;
    mailContact: string;
  };
  
  step2_details?: {
    region: string;
    dateDebut: string;
    dateFin: string;
    dureeSejours: number;
    typeEvenement: string;
  };
  
  step3_budget?: {
    budgetTotal?: number;
    budgetParPersonne?: number;
    hebergementIds: string[];
  };
  
  step4_services?: {
    activiteIds: string[];
    besoinTransfert: boolean;
    besoinCatering: boolean;
    besoinAnimateur: boolean;
  };
  
  step5_validation?: {
    confirmations: { [key: string]: boolean };
  };
}

/**
 * CommandeClient: ce qu'on crée en Airtable après brief
 * Correspond à un Sejour + Demande Service(s)
 */
export interface CommandeClient {
  sejourId?: string;
  nomOrganisation: string;
  mailContact: string;
  nombreParticipants: number;
  dateArrivee: string;
  dateDepart: string;
  budget?: number;
  hebergementIds: string[];
  activiteIds: string[];
  notes?: string;
}

/**
 * Wizard types
 */
export interface OrganizationData {
  nomOrganisation: string;
  secteur: string;
  nombreParticipants: number;
  mailContact: string;
  nomContact: string;
  prenomContact: string;
}

export interface DetailsData {
  region: string;
  dateDebut: string;
  dateFin: string;
  typeEvenement: string;
  objectif: string[];
  horairesArrivee: string;
  horairesDepart: string;
}

export interface BudgetData {
  budgetTotal?: number;
  budgetParPersonne?: number;
  hebergementIds: string[];
}

export interface ServicesData {
  activiteIds: string[];
  besoinTransfert: boolean;
  besoinCatering: boolean;
  besoinAnimateur: boolean;
}

export interface ValidationData {
  confirmations: { [key: string]: boolean };
}

export interface BriefFormState {
  org?: OrganizationData;
  details?: DetailsData;
  budget?: BudgetData;
  services?: ServicesData;
  validation?: ValidationData;
}
