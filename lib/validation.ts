/**
 * Validation utilities pour les formulaires
 */

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 9;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export function validateBudget(budget: number): boolean {
  return budget > 0;
}

export function validateParticipants(nb: number): boolean {
  return nb >= 10 && nb <= 500;
}

export function validateDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

export function validateDateRange(
  dateDebut: string,
  dateFin: string,
): boolean {
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  return start < end;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateOrganizationData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateName(data.nomOrganisation)) {
    errors.push({
      field: 'nomOrganisation',
      message: 'Nom de l\'organisation invalide',
    });
  }

  if (!validateEmail(data.mailContact)) {
    errors.push({
      field: 'mailContact',
      message: 'Email invalide',
    });
  }

  if (!validateParticipants(data.nombreParticipants)) {
    errors.push({
      field: 'nombreParticipants',
      message: 'Nombre de participants invalide (10-500)',
    });
  }

  return errors;
}
