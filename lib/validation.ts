/**
 * Schémas Zod - validation form + API
 */

import { z } from 'zod';
import {
  MIN_PARTICIPANTS,
  MAX_PARTICIPANTS,
  MIN_NIGHTS,
  MAX_NIGHTS,
} from './constants';

// ==============================================
// STEPS
// ==============================================

export const OrganizationSchema = z.object({
  companyName: z.string().min(2, 'Nom de l\'entreprise requis'),
  contactFirstName: z.string().min(1, 'Prénom requis'),
  contactLastName: z.string().min(1, 'Nom requis'),
  contactEmail: z.string().email('Email invalide'),
  contactPhone: z.string().optional(),
  contactRole: z.string().optional(),
  companySize: z.string().optional(),
});
export type OrganizationInput = z.infer<typeof OrganizationSchema>;

export const DetailsSchema = z
  .object({
    sejourType: z.string().min(1, 'Type de séjour requis'),
    objectifs: z.array(z.string()).min(1, 'Choisissez au moins un objectif'),
    nbParticipants: z
      .number({ invalid_type_error: 'Nombre requis' })
      .int()
      .min(MIN_PARTICIPANTS, `Minimum ${MIN_PARTICIPANTS} participants`)
      .max(MAX_PARTICIPANTS, `Maximum ${MAX_PARTICIPANTS} participants`),
    dateStart: z.string().min(1, 'Date de début requise'),
    dateEnd: z.string().min(1, 'Date de fin requise'),
    nbNights: z
      .number()
      .int()
      .min(MIN_NIGHTS)
      .max(MAX_NIGHTS),
    region: z.string().optional(),
    ville: z.string().optional(),
    flexibilite: z.enum(['strict', 'flexible']).optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.dateEnd) >= new Date(data.dateStart),
    { message: 'La date de fin doit être après la date de début', path: ['dateEnd'] },
  );
export type DetailsInput = z.infer<typeof DetailsSchema>;

export const BudgetSchema = z.object({
  budgetTotal: z.number().positive().optional(),
  budgetPerPerson: z.number().positive().optional(),
  hebergementIds: z.array(z.string()).default([]),
});
export type BudgetInput = z.infer<typeof BudgetSchema>;

export const ServicesSchema = z.object({
  activiteIds: z.array(z.string()).default([]),
  besoinTransfert: z.boolean().default(false),
  besoinCatering: z.boolean().default(false),
  besoinAnimateur: z.boolean().default(false),
  autresBesoins: z.string().optional(),
});
export type ServicesInput = z.infer<typeof ServicesSchema>;

// ==============================================
// SEJOUR complet (envoyé à Airtable)
// ==============================================

export const CreateSejourSchema = z.object({
  organization: OrganizationSchema,
  details: DetailsSchema,
  budget: BudgetSchema,
  services: ServicesSchema,
});
export type CreateSejourInput = z.infer<typeof CreateSejourSchema>;

// ==============================================
// STRIPE
// ==============================================

export const CreatePaymentIntentSchema = z.object({
  sejourId: z.string().min(1),
  amount: z.number().int().positive(), // centimes
  currency: z.string().optional(),
});
