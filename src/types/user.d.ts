export type Organization = {
  id: string;
  name: string | null;
  cnpj: string | null;
  phone: string | null;
  contact_email: string | null;
  user_id: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  organization?: Organization | null;
};

export type ApiError = {
  message: string;
};
