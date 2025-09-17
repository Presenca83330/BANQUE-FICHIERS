// Types partagés pour le formulaire de gestion Réseau

export interface ReseauFormData {
  reseau_id: string;
  reseau_nom: string;
  reseau_identite_commerciale?: string;
  reseau_adresse: string;
  reseau_code_postal: string;
  reseau_ville: string;
  reseau_siret: string;
  reseau_statut?: string;
  reseau_logo?: string;
  reseau_documents?: string[];

  // Intégrations optionnelles
  reseau_brevo_connexion_id?: string;
  reseau_zoho_connexion_id?: string;
  reseau_openai_connexion_id?: string;

  // Champs direction (lecture seule)
  reseau_telephone?: string;
  reseau_email?: string;
  direction_telephone?: string;
  direction_email?: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ReseauSelectorItem {
  reseau_id: string;
  reseau_nom: string;
  reseau_statut?: string;
  organisation_id?: string;
}

export interface BrevoIntegration {
  id: string;
  nom: string;
  email: string;
}

export interface ZohoIntegration {
  id: string;
  nom: string;
  email: string;
}

export interface OpenAIIntegration {
  id: string;
  nom: string;
}
