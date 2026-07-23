/**
 * Constantes Airtable — Table IDs confirmés
 * Base: appFWg6elYrhlYYip (TeamHouse Webapp)
 */

export const AIRTABLE_TABLES = {
  HEBERGEMENTS: 'tblt35hl2mtdHNpP8',
  ACTIVITES: 'tblS5Z8Bgm2TxXWps',
  SEJOURS: 'tblE8nJE5jJOyV1fS',
  SERVICES: 'tblpGz7ad4kWCZ2CW',
  RESTAURATION: 'tblfBzJ1KP0Qg0m9s',
} as const;

/**
 * Champs Airtable exacts (ex traits de l'API)
 * Noms littéraux — ne pas inventer
 */

export const HEBERGEMENT_FIELDS = {
  Nom: 'Nom',
  Region: 'Région',
  Communes: 'Commune',
  Departement: 'Département',
  Adresse: 'Adresse',
  CodesPostaux: 'CP',
  Latitude: 'lat',
  Longitude: 'lng',
  
  NombreCouchages: 'Nombre de couchages',
  NombreChambres: 'Nombre de chambres',
  NombreSallesBains: 'Nombre de sdb',
  NombreParkings: 'Nb place de parking',
  NombreEspacessTravail: 'Nombre d\'espaces de travail',
  
  TypeLieu: 'Type de lieu',
  Description: 'Description',
  PartiesCommunes: 'Parties communes',
  
  // Tarification
  PrixParNuit: 'Tarif location', // ou "Prix" ou "Prix défaut"
  FraisReservation: 'Frais de réservation',
  TauxCommission: 'Taux de commission',
  
  // Services & Amenités
  Photos: 'Photos',
  Restauration: 'Restauration', // lien vers table
  Activites: 'Activités', // lien vers table
  Services: 'Services', // lien vers table
  
  // Status
  Statut: 'Statut',
  VisibleApp: 'Visible sur l\'app ?',
  DateCreation: 'Date de création',
  
  // WiFi, Parking, autres
  DebitWifi: 'Débit Wi-fi',
  AutorisationFumerInterieur: 'Autorisation fumer interieur',
  AutorisationFumerExterieur: 'Autorisation fumer extérieur',
  AnimalsSurPlace: 'Animaux sur place?',
  AdaptePMR: 'Adapté PMR',
} as const;

export const ACTIVITE_FIELDS = {
  Nom: 'Nom',
  Departement: 'Département',
  Type: 'Type',
  Theme: 'Thème',
  Description: 'Description courte activité',
  DescriptionLongue: 'Description longue activité',
  
  // Localisation
  Hebergement: 'Hébergement', // lien
  DeplacementDomicile: 'Déplacement à domicile?',
  DeplacementRayon: 'Déplacement dans un rayon de',
  DeplacementZones: 'Déplacement dans les zones',
  InterieurExterieur: 'Intérieur ou extérieur',
  
  // Participants & durée
  NbMinParticipants: 'Nb min participants',
  NbMaxParticipants: 'Nb max participants',
  LanguesPossibles: 'Langues possibles',
  
  // Tarification
  Prix: 'Prix',
  ModeeTarification: 'Mode de tarification (from Tarifs activités)',
  TarifForfaitaire: 'Tarif Forfaitaire (from Tarifs activités)',
  
  // Contenu
  Photos: 'Photos activité',
  PourQuelPublic: 'Pour quel public?',
  
  // Status & dates
  DateCreation: 'Date de création',
  VisibleApp: 'Visible sur l\'app',
} as const;

export const SEJOUR_FIELDS = {
  Nom: 'Nom Organisateur', // ou mieux: créer un champ "Nom Séjour"
  Organisateur: 'Organisateur', // lien
  
  // Client
  NomOrganisateur: 'Nom Organisateur (from Organisateur)',
  PrenomOrganisateur: 'Prénom Organisateur (from Organisateur)',
  MailOrganisateur1: 'Mail Organisateur 1',
  MailOrganisateur2: 'Mail Organisateur 2',
  TelephoneOrganisateur: 'Téléphone organisateur',
  
  // Dates
  DateArrivee: 'Date d\'arrivée',
  DateDepart: 'Date de Départ (avec jr de la sem.)',
  HorairesArrivee: 'Horaires d\'arrivée',
  HorairesDepart: 'Horaires de départ',
  NombreNuits: 'Nombre de nuit',
  
  // Contenu du séjour
  NombreParticipants: 'Nombre de participants',
  ObjectifsEvenement: 'Objectif du séjour',
  TypeEvenement: 'Type d\'évenement',
  CategorieSejour: 'Catégorie du séjour',
  
  // Budget & budget
  Budget: 'Budget',
  
  // Status
  StatutSejour: 'Statut séjour',
  
  // Services
  DemandServices: 'Demande service', // lien vers Services
  RestuarationSejour: 'Restauration séjour', // lien
  FormuleRestauration: 'Formule de restauration de ce séjour',
  
  // Admin
  DateCreation: 'Date de création',
  DerniereModification: 'Dernière modification',
  Notes: 'Notes internes TH',
} as const;

// ============================================
// Constantes métier
// ============================================

export const SEJOUR_STATUSES = [
  'Nouveau brief',
  'Qualification',
  'Devis envoyé',
  'Signé',
  'En cours',
  'Terminé',
  'Refusé',
] as const;

export const SEJOUR_TYPES = [
  'Team building',
  'Incentive',
  'Séminaire',
  'Conférence',
  'Retraite',
  'Formation',
] as const;

export const OBJECTIFS_SEJOUR = [
  'Cohésion / teambuilding',
  'CODIR / COMEX',
  'Stratégie',
  'Reconnaissance / récompense',
  'Formation',
  'Innovation',
] as const;

export const REGIONS_FR = [
  'Île-de-France',
  'Provence-Alpes-Côte d\'Azur',
  'Auvergne-Rhône-Alpes',
  'Bretagne',
  'Occitanie',
  'Nouvelle-Aquitaine',
  'Bourgogne-Franche-Comté',
  'Grand Est',
  'Pays de la Loire',
  'Centre-Val de Loire',
  'Hauts-de-France',
  'Normandie',
  'Corse',
] as const;

export const MIN_PARTICIPANTS = 10;
export const MAX_PARTICIPANTS = 500;

export const WIZARD_STEPS = [
  { id: 'org', label: 'Organisation', number: 1 },
  { id: 'details', label: 'Détails', number: 2 },
  { id: 'budget', label: 'Budget & lieux', number: 3 },
  { id: 'services', label: 'Prestations', number: 4 },
  { id: 'validation', label: 'Validation', number: 5 },
] as const;

export type WizardStepId = typeof WIZARD_STEPS[number]['id'];
