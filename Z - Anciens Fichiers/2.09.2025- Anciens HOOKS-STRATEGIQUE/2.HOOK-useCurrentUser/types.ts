import type { Tables } from '@/integrations/supabase/types';

export type DbUser = Tables<'users'>;

export interface OrganisationInfo {
  organisation_id: string;
  organisation_nom: string | null;
  calculated_type: string | null; // Fonction dynamique get_organisation_type()
  organisation_siret: string | null;
  organisation_identite_commerciale: string | null;
  organisation_adresse: string | null;
  organisation_code_postal: string | null;
  organisation_ville: string | null;
  organisation_email: string | null;
  organisation_telephone: string | null;
  organisation_plan_stripe: string | null;
  organisation_statut_compte: string | null;
  organisation_statut_paiement: string | null;
  organisation_date_creation: string | null; // ISO string
}

export interface Permissions {
  isAdminPresenca: boolean;
  canImpersonate: boolean;
  canManageOrganisation: boolean;
}

export interface UpdateProfileInput {
  users_nom?: string;
  users_prenom?: string;
  users_telephone?: string;
}

export interface UseCurrentUserReturn {
  authUser: import('@supabase/supabase-js').User | null;
  user: DbUser | null;
  organisation: OrganisationInfo | null;
  permissions: Permissions;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<DbUser | null>;
}
