/** Possíveis vínculos com o paciente */
export type ContactRelationship =
  | 'father'
  | 'mother'
  | 'relative'
  | 'responsible'
  | 'other';

export interface Contact {
  id: string;
  name: string;
  cpf: string;
  relationship: ContactRelationship;
  email: string;
  phone_primary: string;
  phone_secondary?: string | null;
  patient_id: string;
  created_at: string;
  updated_at: string;
}
