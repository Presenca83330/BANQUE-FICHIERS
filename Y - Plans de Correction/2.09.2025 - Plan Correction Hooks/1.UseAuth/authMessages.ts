// Centralise la gestion des messages d'erreurs Auth

export function mapSupabaseError(errorMessage: string): string {
  if (!errorMessage) return "Une erreur inconnue est survenue";

  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect";
  }
  if (normalized.includes("email not confirmed")) {
    return "Votre adresse email n’a pas encore été confirmée";
  }
  if (normalized.includes("suspended")) {
    return "Votre compte est suspendu";
  }
  if (normalized.includes("disabled")) {
    return "Votre compte est désactivé";
  }

  return "Erreur d'authentification : " + errorMessage;
}
