// types.ts
export type TableName =
  | 'users'
  | 'utilisateurs'
  | 'organisations'
  | 'reseau'
  | 'reseau_direction'
  | 'reseau_agence'
  | 'reseau_agence_responsable'
  | 'reseau_agence_collaborateur'
  | 'agence_independante'
  | 'agence_independante_responsable'
  | 'agence_independante_collaborateur'
  | 'brevo_connexion'
  | 'zoho_connexion'
  | 'facebook_connexion'
  | 'instagram_connexion'
  | 'linkedin_connexion'
  | 'openai_connexion'
  | 'abonnement_stripe'
  | '1_historique_supabase';

export interface TenantContext {
  organisationId: string | null;
  isAdmin: boolean;
  isImpersonating: boolean;
  currentUserId: string | null;
  organisationStatus: 'actif' | 'suspendu' | 'desactive' | null;
}

export interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

export interface UpdateOptions {
  returning?: boolean;
  select?: string;
}

export interface DeleteOptions {}

export interface QueryContext extends TenantContext {
  tableName: TableName;
}

export interface QueryResult<T> {
  data: T;
  error: Error | null;
  count: number;
  context: QueryContext;
}

export interface MutationResult<T> {
  data: T;
  error: Error | null;
  context: QueryContext;
}

export interface TableMapping {
  organisationField: string | null;
  accessLevel: 'public' | 'organization' | 'admin_only';
  allowedOperations: ('read' | 'write' | 'delete')[];
}
