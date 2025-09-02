// Gestion centralisée des erreurs Supabase

export function mapSupabaseError(errorMessage: string): string {
  if (!errorMessage) return "Une erreur inconnue est survenue";

  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("permission denied")) {
    return "Accès refusé. Vous n’avez pas les droits nécessaires.";
  }
  if (normalized.includes("row-level security")) {
    return "Accès refusé : vos droits ne permettent pas cette action.";
  }
  if (normalized.includes("suspendu")) {
    return "Votre compte est suspendu.";
  }
  if (normalized.includes("organisation")) {
    return "Organisation non trouvée ou invalide.";
  }

  return "Erreur : " + errorMessage;
}
