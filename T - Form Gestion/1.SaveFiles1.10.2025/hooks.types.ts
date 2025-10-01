// Types partagés pour la gestion des réseaux

// ==============================
// Données du Réseau
// ==============================
export interface ReseauFormData {
  reseau_id: string;
  organisation_id: string;
  reseau_nom: string;
  reseau_identite_commerciale?: string | null;
  reseau_adresse?: string | null;
  reseau_code_postal?: string | null;
  reseau_ville?: string | null;
  reseau_siret?: string | null;
  reseau_statut?: string | null;
  reseau_logo?: string | null;
  reseau_ressources?: string[]; // fichiers stockés
  reseau_telephone?: string | null; // Point de vérité
  reseau_email?: string | null;     // Point de vérité
  reseau_brevo_connexion_id?: string | null;
  reseau_zoho_connexion_id?: string | null;
  reseau_openai_connexion_id?: string | null;
}

// ==============================
// Eléments pour le sélecteur
// ==============================
export interface ReseauSelectorItem {
  reseau_id: string;
  reseau_nom: string;
  reseau_statut: string;
  organisation_id: string;
}

// ==============================
// Intégrations - Tables connexions
// ==============================
export interface BrevoIntegration {
  brevo_connexion_id: string;
  organisation_id: string;
  reseau_id: string;
  brevo_api_key?: string | null;
  brevo_email_compte?: string | null;
  brevo_nom_compte?: string | null;
}

export interface ZohoIntegration {
  zoho_connexion_id: string;
  organisation_id: string;
  reseau_id: string;
  zoho_api_key?: string | null;
  zoho_email_compte?: string | null;
  zoho_nom_compte?: string | null;
}

export interface OpenAIIntegration {
  openai_connexion_id: string;
  organisation_id: string;
  reseau_id: string;
  openai_api_key?: string | null;
  openai_email_compte?: string | null;
}

// ==============================
// Etats du formulaire (Front) - UI UNIQUEMENT
// ==============================
export interface BrevoFormState {
  brevo_api_key?: string;
  brevo_email_compte?: string;
  brevo_nom_compte?: string;
}

export interface ZohoFormState {
  zoho_api_key?: string;
  zoho_email_compte?: string;
  zoho_nom_compte?: string;
}

export interface OpenAIFormState {
  openai_api_key?: string;
  openai_email_compte?: string;
}

export interface IntegrationsState {
  brevo: BrevoFormState;
  zoho: ZohoFormState;
  openai: OpenAIFormState;
}

// ==============================
// Erreurs de validation
// ==============================
export type ValidationErrors = {
  [K in keyof Partial<ReseauFormData>]?: string;
};
