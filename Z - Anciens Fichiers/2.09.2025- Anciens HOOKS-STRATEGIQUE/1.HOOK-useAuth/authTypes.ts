import { User, Session } from '@supabase/supabase-js';

// Types d'authentification principaux
export interface AuthUser extends User {
  id: string;
  email?: string;
}

export interface AuthSession extends Session {
  user: AuthUser;
  access_token: string;
}

// États d'authentification
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';

// Données de connexion
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ResetPasswordData {
  email: string;
}

// Réponses d'authentification
export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: AuthUser;
  session?: AuthSession;
}

export interface AuthError {
  message: string;
  code?: string;
  type: 'validation' | 'supabase' | 'network' | 'unknown';
}

// Configuration d'authentification
export interface AuthConfig {
  redirectTo?: string;
  emailRedirectTo?: string;
  autoRefreshToken?: boolean;
  persistSession?: boolean;
}

// Contexte d'authentification
export interface AuthContextType {
  // État
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authState: AuthState;
  
  // Actions d'authentification
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthResponse>;
  refreshSession: () => Promise<AuthResponse>;
  
  // Utilitaires
  getRedirectPath: () => string;
  clearError: () => void;
  
  // Erreur courante
  error: AuthError | null;
}

// Types pour les rôles utilisateur (à étendre selon les besoins)
export type UserRole = 'admin_presenca' | 'client' | 'admin' | 'superadmin' | 'support';

export interface UserProfile {
  users_id: string;
  users_auth_id: string;
  users_email: string;
  users_nom: string;
  users_prenom: string;
  users_role: UserRole;
  users_role_systeme?: UserRole;
  users_interface_par_defaut: 'client_espace' | 'admin_presenca';
  users_organisation_id?: string;
}