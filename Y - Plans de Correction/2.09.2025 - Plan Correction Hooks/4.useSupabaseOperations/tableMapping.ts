// Mapping logique des noms de tables (front → back)

export function getTableName(key: string): string {
  const mapping: Record<string, string> = {
    // Tables principales
    utilisateurs: "utilisateurs",
    users: "users", 
    organisations: "organisations",

    // Réseau
    reseau: "reseau",
    reseau_direction: "reseau_direction",
    reseau_agence: "reseau_agence",
    reseau_agence_responsable: "reseau_agence_responsable",
    reseau_agence_collaborateur: "reseau_agence_collaborateur",

    // Agences indépendantes
    agence_independante: "agence_independante",
    agence_independante_responsable: "agence_independante_responsable",
    agence_independante_collaborateur: "agence_independante_collaborateur",

    // Connexions externes
    brevo_connexion: "brevo_connexion",
    zoho_connexion: "zoho_connexion", 
    openai_connexion: "openai_connexion",
    linkedin_connexion: "linkedin_connexion",
    facebook_connexion: "facebook_connexion",
    instagram_connexion: "instagram_connexion",

    // Paiements / Abonnements
    abonnement_stripe: "abonnement_stripe",

    // Historique
    "1_historique_supabase": "1_historique_supabase",
  };

  if (!(key in mapping)) {
    throw new Error(`Table inconnue dans le mapping: ${key}`);
  }

  return mapping[key];
}
