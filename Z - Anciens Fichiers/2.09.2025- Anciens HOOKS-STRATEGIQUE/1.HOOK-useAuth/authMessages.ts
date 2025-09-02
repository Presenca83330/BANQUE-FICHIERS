import { AuthError } from './authTypes';

// Messages d'erreur d'authentification centralisés
export const AUTH_ERROR_MESSAGES = {
  // Erreurs de validation
  INVALID_EMAIL: 'Adresse email invalide',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas',
  MISSING_EMAIL: 'L\'adresse email est requise',
  MISSING_PASSWORD: 'Le mot de passe est requis',
  
  // Erreurs Supabase Auth
  INVALID_LOGIN_CREDENTIALS: 'Email ou mot de passe incorrect',
  EMAIL_NOT_CONFIRMED: 'Veuillez confirmer votre email avant de vous connecter',
  TOO_MANY_REQUESTS: 'Trop de tentatives de connexion. Veuillez réessayer plus tard',
  USER_NOT_FOUND: 'Aucun utilisateur trouvé avec cette adresse email',
  EMAIL_ALREADY_REGISTERED: 'Cette adresse email est déjà enregistrée',
  WEAK_PASSWORD: 'Le mot de passe est trop faible',
  SIGNUP_DISABLED: 'L\'inscription est actuellement désactivée',
  
  // Erreurs de session
  SESSION_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter',
  INVALID_SESSION: 'Session invalide',
  TOKEN_REFRESH_FAILED: 'Impossible de rafraîchir la session',
  
  // Erreurs réseau
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard',
  
  // Erreurs génériques
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite',
  OPERATION_FAILED: 'L\'opération a échoué',
  
  // Messages de récupération de mot de passe
  RESET_PASSWORD_SUCCESS: 'Un email de réinitialisation a été envoyé',
  RESET_PASSWORD_ERROR: 'Impossible d\'envoyer l\'email de réinitialisation'
} as const;

// Messages de succès
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  SIGNUP_SUCCESS: 'Inscription réussie. Vérifiez votre email',
  PASSWORD_RESET_SENT: 'Email de réinitialisation envoyé',
  SESSION_REFRESHED: 'Session mise à jour'
} as const;

// Messages d'information
export const AUTH_INFO_MESSAGES = {
  CHECKING_SESSION: 'Vérification de la session...',
  LOGGING_IN: 'Connexion en cours...',
  LOGGING_OUT: 'Déconnexion en cours...',
  SIGNING_UP: 'Inscription en cours...',
  SENDING_RESET: 'Envoi de l\'email de réinitialisation...'
} as const;

/**
 * Mappe les codes d'erreur Supabase vers des messages utilisateur
 */
export const mapSupabaseError = (error: any): AuthError => {
  const message = error?.message || '';
  const code = error?.error_description || error?.code || '';

  // Mapping des erreurs courantes
  if (message.includes('Invalid login credentials') || code.includes('invalid_credentials')) {
    return {
      message: AUTH_ERROR_MESSAGES.INVALID_LOGIN_CREDENTIALS,
      code: 'invalid_credentials',
      type: 'supabase'
    };
  }
  
  if (message.includes('Email not confirmed') || code.includes('email_not_confirmed')) {
    return {
      message: AUTH_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED,
      code: 'email_not_confirmed',
      type: 'supabase'
    };
  }
  
  if (message.includes('Too many requests') || code.includes('too_many_requests')) {
    return {
      message: AUTH_ERROR_MESSAGES.TOO_MANY_REQUESTS,
      code: 'too_many_requests',
      type: 'supabase'
    };
  }
  
  if (message.includes('User not found') || code.includes('user_not_found')) {
    return {
      message: AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
      code: 'user_not_found',
      type: 'supabase'
    };
  }
  
  if (message.includes('already registered') || code.includes('email_address_already_in_use')) {
    return {
      message: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED,
      code: 'email_already_registered',
      type: 'supabase'
    };
  }
  
  if (message.includes('Password is too weak') || code.includes('weak_password')) {
    return {
      message: AUTH_ERROR_MESSAGES.WEAK_PASSWORD,
      code: 'weak_password',
      type: 'supabase'
    };
  }
  
  if (message.includes('Signups not allowed') || code.includes('signup_disabled')) {
    return {
      message: AUTH_ERROR_MESSAGES.SIGNUP_DISABLED,
      code: 'signup_disabled',
      type: 'supabase'
    };
  }

  // Erreurs de connexion réseau
  if (message.includes('fetch') || message.includes('network')) {
    return {
      message: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
      code: 'network_error',
      type: 'network'
    };
  }

  // Erreur générique pour les cas non mappés
  return {
    message: message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
    code: code || 'unknown',
    type: 'unknown'
  };
};

/**
 * Valide les données de connexion
 */
export const validateLoginCredentials = (email: string, password: string): AuthError | null => {
  if (!email.trim()) {
    return {
      message: AUTH_ERROR_MESSAGES.MISSING_EMAIL,
      type: 'validation'
    };
  }
  
  if (!isValidEmail(email)) {
    return {
      message: AUTH_ERROR_MESSAGES.INVALID_EMAIL,
      type: 'validation'
    };
  }
  
  if (!password.trim()) {
    return {
      message: AUTH_ERROR_MESSAGES.MISSING_PASSWORD,
      type: 'validation'
    };
  }
  
  return null;
};

/**
 * Valide les données d'inscription
 */
export const validateSignUpCredentials = (
  email: string, 
  password: string, 
  confirmPassword?: string
): AuthError | null => {
  // Validation de base
  const basicValidation = validateLoginCredentials(email, password);
  if (basicValidation) return basicValidation;
  
  // Validation de la force du mot de passe
  if (password.length < 8) {
    return {
      message: AUTH_ERROR_MESSAGES.INVALID_PASSWORD,
      type: 'validation'
    };
  }
  
  // Validation de la confirmation de mot de passe
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return {
      message: AUTH_ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
      type: 'validation'
    };
  }
  
  return null;
};

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};