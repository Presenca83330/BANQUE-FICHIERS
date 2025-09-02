// Types utilisés par le hook useAuth

export interface AuthUser {
  id: string;
  email: string;
  [key: string]: any; // permet d’accepter d’autres champs éventuels
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface AuthResponse {
  session: AuthSession | null;
  user: AuthUser | null;
  error?: any;
}

// ✅ Type ajouté pour les résultats standardisés
export interface AuthResult {
  ok: boolean;
  message?: string;
}
