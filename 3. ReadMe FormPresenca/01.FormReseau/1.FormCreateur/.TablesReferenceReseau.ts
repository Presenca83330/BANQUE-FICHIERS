/**
 * RÉFÉRENCE DES TABLES SUPABASE POUR FORMULAIRES - MAJ 23/09/2025
 * Fichier de référence pour le développement des formulaires de création/gestion de comptes
 * Mise à jour avec la nouvelle architecture des tables de connexion
 */

// ========================================
// TABLE: users (table système auth)
// ========================================
export const USERS_FIELDS = {
  users_id: 'uuid PRIMARY KEY',
  users_auth_id: 'uuid NOT NULL (référence auth.users)',
  users_nom: 'text NOT NULL',
  users_prenom: 'text NOT NULL', 
  users_email: 'text NOT NULL',
  users_telephone: 'text',
  users_role_systeme: 'text (admin_presenca, etc.)',
  users_organisation_id: 'uuid',
  users_created_at: 'timestamp with time zone NOT NULL DEFAULT now()'
} as const;

// ========================================
// TABLE: utilisateurs (profils utilisateurs)
// ========================================
export const UTILISATEURS_FIELDS = {
  utilisateur_id: 'uuid PRIMARY KEY',
  utilisateur_auth_uid: 'uuid NOT NULL',
  utilisateur_email: 'text NOT NULL',
  utilisateur_type_compte: 'text NOT NULL',
  utilisateur_statut: 'text NOT NULL DEFAULT actif',
  utilisateur_role_systeme: 'text',
  utilisateur_organisation_id: 'uuid NOT NULL',
  utilisateur_date_inscription: 'timestamp with time zone NOT NULL DEFAULT now()'
} as const;

// ========================================
// TABLE: organisations
// ========================================
export const ORGANISATIONS_FIELDS = {
  organisation_id: 'uuid PRIMARY KEY',
  organisation_nom: 'text NOT NULL',
  organisation_siret: 'text',
  organisation_identite_commerciale: 'text',
  organisation_adresse: 'text',
  organisation_code_postal: 'text',
  organisation_ville: 'text',
  organisation_email: 'text',
  organisation_telephone: 'text',
  organisation_plan_stripe: 'text',
  organisation_statut_compte: 'text',
  organisation_statut_paiement: 'text',
  organisation_date_creation: 'timestamp with time zone NOT NULL DEFAULT now()'
} as const;

// ========================================
// TABLE: reseau (spécifique au type reseau)
// ========================================
export const RESEAU_FIELDS = {
  reseau_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  client_id: 'uuid NOT NULL',
  client_type: 'text NOT NULL DEFAULT reseau',
  
  // Informations générales
  reseau_nom: 'text NOT NULL',
  reseau_identite_commerciale: 'text',
  reseau_adresse: 'text NOT NULL',
  reseau_code_postal: 'text NOT NULL',
  reseau_ville: 'text NOT NULL',
  reseau_telephone: 'text NOT NULL',
  reseau_email: 'text NOT NULL',
  reseau_siret: 'text NOT NULL',
  
  // Statuts et abonnement
  reseau_statut: 'text NOT NULL DEFAULT actif',
  reseau_statut_abonnement: 'text',
  reseau_plan: 'text',
  reseau_statut_paiement: 'text',
  reseau_date_inscription: 'timestamp with time zone NOT NULL DEFAULT now()',
  reseau_date_debut_abonnement: 'timestamp with time zone',
  reseau_date_resiliation_abonnement: 'timestamp with time zone',
  reseau_abonnement_id: 'uuid',
  
  // Accès et ressources
  autorisation_acces_reseau_presenca: 'boolean NOT NULL DEFAULT true',
  reseau_espace_client: 'boolean NOT NULL DEFAULT true',
  reseau_logo: 'text',
  reseau_ressources: 'ARRAY',
  
  // Connexions externes
  reseau_brevo_connexion_id: 'uuid',
  reseau_openai_connexion_id: 'uuid',
  reseau_zoho_connexion_id: 'uuid',
  
  // Extensions IA et audit
  reseau_ia_extensions: 'jsonb',
  reseau_audit_log: 'jsonb',
  
  // Audit fields
  reseau_created_at: 'timestamp with time zone NOT NULL DEFAULT now()',
  reseau_created_by: 'uuid',
  reseau_updated_at: 'timestamp with time zone DEFAULT now()',
  reseau_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: brevo_connexion - NOUVELLE ARCHITECTURE
// ========================================
export const BREVO_CONNEXION_FIELDS = {
  brevo_connexion_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  reseau_id: 'uuid',
  reseau_agence_id: 'uuid',
  agence_indep_id: 'uuid',
  
  // Champs modifiables principaux
  brevo_api_key: 'text',
  brevo_email_compte: 'text',
  brevo_nom_compte: 'text',
  brevo_commentaire: 'text',
  
  // Statuts et configuration
  brevo_actif: 'boolean DEFAULT true',
  brevo_statut_connexion: 'text DEFAULT active',
  brevo_derniere_erreur: 'text',
  brevo_last_synchro: 'timestamp with time zone',
  brevo_date_activation: 'timestamp with time zone DEFAULT now()',
  
  // Quotas et limites
  brevo_limite_quotidienne: 'integer',
  brevo_usage_quotidien: 'integer DEFAULT 0',
  brevo_reset_quota_at: 'timestamp with time zone',
  
  // Extensions et audit
  brevo_ia_extensions: 'jsonb DEFAULT {}',
  brevo_audit_log: 'jsonb DEFAULT {}',
  
  // Audit fields
  brevo_created_at: 'timestamp with time zone DEFAULT now()',
  brevo_created_by: 'uuid',
  brevo_updated_at: 'timestamp with time zone DEFAULT now()',
  brevo_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: zoho_connexion - NOUVELLE ARCHITECTURE
// ========================================
export const ZOHO_CONNEXION_FIELDS = {
  zoho_connexion_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  reseau_id: 'uuid',
  reseau_agence_id: 'uuid',
  agence_indep_id: 'uuid',
  
  // Champs modifiables principaux
  zoho_api_key: 'text',
  zoho_email_compte: 'text',
  zoho_nom_compte: 'text',
  zoho_commentaire_presenca: 'text',
  
  // Configuration spécifique Zoho
  zoho_region: 'text',
  
  // Statuts et configuration
  zoho_actif: 'boolean DEFAULT true',
  zoho_statut_connexion: 'text DEFAULT active',
  zoho_derniere_erreur: 'text',
  zoho_derniere_synchro: 'timestamp with time zone',
  zoho_date_activation: 'timestamp with time zone DEFAULT now()',
  
  // Quotas et limites
  zoho_limite_quotidienne: 'integer',
  zoho_usage_quotidien: 'integer DEFAULT 0',
  zoho_reset_quota_at: 'timestamp with time zone',
  
  // Extensions et audit
  zoho_ia_extensions: 'jsonb DEFAULT {}',
  zoho_audit_log: 'jsonb DEFAULT {}',
  
  // Audit fields
  zoho_created_at: 'timestamp with time zone DEFAULT now()',
  zoho_created_by: 'uuid',
  zoho_updated_at: 'timestamp with time zone DEFAULT now()',
  zoho_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: openai_connexion - NOUVELLE ARCHITECTURE
// ========================================
export const OPENAI_CONNEXION_FIELDS = {
  openai_connexion_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  reseau_id: 'uuid',
  reseau_agence_id: 'uuid',
  agence_indep_id: 'uuid',
  
  // Champs modifiables principaux
  openai_api_key: 'text',
  openai_email_compte: 'text',
  
  // Configuration spécifique OpenAI
  openai_project_id: 'text',
  openai_organisation_id: 'text',
  openai_modeles_autorises: 'ARRAY DEFAULT {gpt-3.5-turbo,gpt-4}',
  
  // Statuts et configuration
  openai_actif: 'boolean DEFAULT true',
  openai_statut_connexion: 'text DEFAULT active',
  openai_derniere_erreur: 'text',
  openai_derniere_synchro: 'timestamp with time zone',
  openai_date_activation: 'timestamp with time zone DEFAULT now()',
  
  // Quotas et coûts
  openai_limite_quotidienne: 'integer',
  openai_usage_quotidien: 'integer DEFAULT 0',
  openai_reset_quota_at: 'timestamp with time zone',
  openai_limite_cout_mois: 'numeric',
  openai_cout_actuel_mois: 'numeric DEFAULT 0.0000',
  
  // Extensions et audit
  openai_ia_extensions: 'jsonb DEFAULT {}',
  openai_audit_log: 'jsonb DEFAULT {}',
  
  // Audit fields
  openai_created_at: 'timestamp with time zone DEFAULT now()',
  openai_created_by: 'uuid',
  openai_updated_at: 'timestamp with time zone DEFAULT now()',
  openai_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: linkedin_connexion - NOUVELLE ARCHITECTURE
// ========================================
export const LINKEDIN_CONNEXION_FIELDS = {
  linkedin_connexion_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  reseau_id: 'uuid',
  reseau_agence_id: 'uuid',
  agence_indep_id: 'uuid',
  
  // Champs modifiables principaux
  linkedin_connexion_key: 'text',
  linkedin_email_compte: 'text',
  
  // Configuration spécifique LinkedIn
  linkedin_access_token: 'text',
  linkedin_refresh_token: 'text',
  linkedin_token_expire_at: 'timestamp with time zone',
  linkedin_profil_entreprise_id: 'text',
  linkedin_permissions: 'ARRAY DEFAULT {r_liteprofile,r_emailaddress,w_member_social}',
  
  // Statuts et configuration
  linkedin_actif: 'boolean DEFAULT true',
  linkedin_statut_connexion: 'text DEFAULT active',
  linkedin_derniere_erreur: 'text',
  linkedin_derniere_synchro: 'timestamp with time zone',
  linkedin_date_activation: 'timestamp with time zone DEFAULT now()',
  
  // Quotas et limites
  linkedin_limite_quotidienne: 'integer',
  linkedin_usage_quotidien: 'integer DEFAULT 0',
  linkedin_reset_quota_at: 'timestamp with time zone',
  
  // Extensions et audit
  linkedin_ia_extensions: 'jsonb DEFAULT {}',
  linkedin_audit_log: 'jsonb DEFAULT {}',
  
  // Audit fields
  linkedin_created_at: 'timestamp with time zone DEFAULT now()',
  linkedin_created_by: 'uuid',
  linkedin_updated_at: 'timestamp with time zone DEFAULT now()',
  linkedin_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: facebook_connexion - NOUVELLE ARCHITECTURE
// ========================================
export const FACEBOOK_CONNEXION_FIELDS = {
  facebook_connexion_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  reseau_id: 'uuid',
  reseau_agence_id: 'uuid',
  agence_indep_id: 'uuid',
  
  // Champs modifiables principaux
  facebook_connexion_key: 'text',
  facebook_email_compte: 'text',
  
  // Configuration spécifique Facebook
  facebook_access_token: 'text',
  facebook_page_access_token: 'text',
  facebook_token_expire_at: 'timestamp with time zone',
  facebook_business_id: 'text',
  facebook_page_id: 'text',
  facebook_permissions: 'ARRAY DEFAULT {public_profile,email,pages_read_engagement,pages_manage_posts}',
  
  // Statuts et configuration
  facebook_actif: 'boolean DEFAULT true',
  facebook_statut_connexion: 'text DEFAULT active',
  facebook_derniere_erreur: 'text',
  facebook_derniere_synchro: 'timestamp with time zone',
  facebook_date_activation: 'timestamp with time zone DEFAULT now()',
  
  // Quotas et limites
  facebook_limite_quotidienne: 'integer',
  facebook_usage_quotidien: 'integer DEFAULT 0',
  facebook_reset_quota_at: 'timestamp with time zone',
  
  // Extensions et audit
  facebook_ia_extensions: 'jsonb DEFAULT {}',
  facebook_audit_log: 'jsonb DEFAULT {}',
  
  // Audit fields
  facebook_created_at: 'timestamp with time zone DEFAULT now()',
  facebook_created_by: 'uuid',
  facebook_updated_at: 'timestamp with time zone DEFAULT now()',
  facebook_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: instagram_connexion - NOUVELLE ARCHITECTURE
// ========================================
export const INSTAGRAM_CONNEXION_FIELDS = {
  instagram_connexion_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  reseau_id: 'uuid',
  reseau_agence_id: 'uuid',
  agence_indep_id: 'uuid',
  
  // Champs modifiables principaux
  instagram_connexion_key: 'text',
  instagram_email_compte: 'text',
  
  // Configuration spécifique Instagram
  instagram_access_token: 'text',
  instagram_token_expire_at: 'timestamp with time zone',
  instagram_business_account_id: 'text',
  instagram_page_id: 'text',
  instagram_type_compte: 'text',
  instagram_permissions: 'ARRAY DEFAULT {instagram_basic,pages_read_engagement,instagram_manage_insights}',
  
  // Statuts et configuration
  instagram_actif: 'boolean DEFAULT true',
  instagram_statut_connexion: 'text DEFAULT active',
  instagram_derniere_erreur: 'text',
  instagram_derniere_synchro: 'timestamp with time zone',
  instagram_date_activation: 'timestamp with time zone DEFAULT now()',
  
  // Quotas et limites
  instagram_limite_quotidienne: 'integer',
  instagram_usage_quotidien: 'integer DEFAULT 0',
  instagram_reset_quota_at: 'timestamp with time zone',
  
  // Extensions et audit
  instagram_ia_extensions: 'jsonb DEFAULT {}',
  instagram_audit_log: 'jsonb DEFAULT {}',
  
  // Audit fields
  instagram_created_at: 'timestamp with time zone DEFAULT now()',
  instagram_created_by: 'uuid',
  instagram_updated_at: 'timestamp with time zone DEFAULT now()',
  instagram_updated_by: 'uuid'
} as const;

// ========================================
// TABLE: abonnement_stripe - NOUVELLE ARCHITECTURE
// ========================================
export const ABONNEMENT_STRIPE_FIELDS = {
  abonnement_id: 'uuid PRIMARY KEY',
  organisation_id: 'uuid NOT NULL',
  abonnement_appli_client_id: 'uuid NOT NULL',
  abonnement_appli_souscripteur: 'text NOT NULL',
  abonnement_stripe_payeur_id: 'uuid NOT NULL',
  abonnement_stripe_payeur_type: 'text NOT NULL',
  abonnement_stripe_numero_client_id: 'text NOT NULL',
  abonnement_stripe_numero_abonnement_id: 'text NOT NULL',
  abonnement_stripe_plan: 'text NOT NULL',
  abonnement_stripe_debut: 'timestamp with time zone NOT NULL',
  abonnement_stripe_terme_prevu: 'timestamp with time zone',
  abonnement_stripe_date_resiliation: 'timestamp with time zone',
  abonnement_stripe_statut_appli: 'text NOT NULL DEFAULT en_cours',
  abonnement_stripe_statut_paiement: 'text',
  abonnement_stripe_statut_essai: 'boolean NOT NULL DEFAULT false',
  abonnement_stripe_fin_essai: 'timestamp with time zone',
  abonnement_stripe_montant_ht: 'numeric NOT NULL',
  abonnement_stripe_devise: 'text NOT NULL DEFAULT eur',
  abonnement_stripe_fractionnement: 'text NOT NULL DEFAULT mois',
  abonnement_stripe_quantite: 'numeric NOT NULL DEFAULT 1',
  abonnement_stripe_tva: 'boolean NOT NULL DEFAULT true',
  abonnement_stripe_taux_tva: 'numeric DEFAULT 20.0',
  abonnement_stripe_pays: 'text NOT NULL DEFAULT FR',
  abonnement_stripe_raison_sociale: 'text',
  abonnement_stripe_siret: 'text',
  abonnement_stripe_mode: 'text',
  abonnement_stripe_next_echeance: 'timestamp with time zone',
  abonnement_stripe_retard: 'boolean NOT NULL DEFAULT false',
  abonnement_stripe_paiement_date: 'timestamp with time zone',
  abonnement_stripe_paiement_montant: 'numeric',
  abonnement_stripe_paiement_reussi: 'numeric DEFAULT 0',
  abonnement_stripe_paiement_refus: 'numeric DEFAULT 0',
  abonnement_stripe_paiement_total: 'numeric DEFAULT 0',
  abonnement_stripe_facture_suspens: 'numeric DEFAULT 0',
  abonnement_stripe_last_facture: 'timestamp with time zone',
  abonnement_stripe_last_synchro: 'timestamp with time zone DEFAULT now()',
  abonnement_stripe_commentaire_presenca: 'text',
  abonnement_created_at: 'timestamp with time zone NOT NULL DEFAULT now()',
  abonnement_created_by: 'uuid',
  abonnement_updated_at: 'timestamp with time zone NOT NULL DEFAULT now()',
  abonnement_updated_by: 'uuid'
} as const;

// ========================================
// MAPPINGS POUR FORMULAIRES
// ========================================

// Champs essentiels pour la CRÉATION (minimum requis)
export const RESEAU_CREATION_REQUIRED = {
  // Organisation
  organisation_nom: 'Nom de l\'organisation',
  
  // Users
  users_nom: 'Nom',
  users_prenom: 'Prénom', 
  users_email: 'Email',
  users_telephone: 'Téléphone',
  
  // Reseau spécifique
  reseau_nom: 'Nom du réseau',
  reseau_adresse: 'Adresse',
  reseau_code_postal: 'Code postal',
  reseau_ville: 'Ville',
  reseau_telephone: 'Téléphone réseau',
  reseau_email: 'Email réseau',
  reseau_siret: 'SIRET'
} as const;

// Champs pour la GESTION (sections organisées)
export const RESEAU_GESTION_SECTIONS = {
  informations_generales: {
    label: 'Informations Générales',
    fields: [
      'organisation_nom',
      'reseau_nom', 
      'reseau_identite_commerciale',
      'reseau_adresse',
      'reseau_code_postal',
      'reseau_ville',
      'reseau_telephone',
      'reseau_email',
      'reseau_siret'
    ]
  },
  integrations: {
    label: 'Intégrations',
    fields: [
      // Liens depuis table reseau (FK)
      'reseau_brevo_connexion_id',
      'reseau_openai_connexion_id', 
      'reseau_zoho_connexion_id'
    ]
  },
  fichiers: {
    label: 'Fichiers et Ressources',
    fields: [
      'reseau_logo',
      'reseau_ressources'
    ]
  },
  statuts: {
    label: 'Statuts et Abonnement',
    fields: [
      'reseau_statut',
      'reseau_statut_abonnement',
      'reseau_plan',
      'reseau_statut_paiement'
    ]
  }
} as const;

// ========================================
// CHAMPS D'INTÉGRATION POUR FORMULAIRES
// ========================================

// Champs modifiables pour Brevo (⭐ = prioritaires)
export const BREVO_GESTION_FIELDS = {
  brevo_api_key: 'Clé API Brevo', // ⭐
  brevo_email_compte: 'Email du compte Brevo', // ⭐
  brevo_nom_compte: 'Nom du compte Brevo', // ⭐
  brevo_actif: 'Statut actif/inactif',
  brevo_statut_connexion: 'Statut de la connexion',
  brevo_commentaire: 'Commentaire admin'
} as const;

// Champs modifiables pour Zoho (⭐ = prioritaires)
export const ZOHO_GESTION_FIELDS = {
  zoho_api_key: 'Clé API Zoho', // ⭐
  zoho_email_compte: 'Email du compte Zoho', // ⭐
  zoho_nom_compte: 'Nom du compte Zoho', // ⭐
  zoho_region: 'Région Zoho',
  zoho_actif: 'Statut actif/inactif',
  zoho_statut_connexion: 'Statut de la connexion',
  zoho_commentaire_presenca: 'Commentaire admin'
} as const;

// Champs modifiables pour OpenAI (⭐ = prioritaires)
export const OPENAI_GESTION_FIELDS = {
  openai_api_key: 'Clé API OpenAI', // ⭐
  openai_email_compte: 'Email du compte OpenAI', // ⭐
  openai_project_id: 'ID projet OpenAI',
  openai_organisation_id: 'ID organisation OpenAI',
  openai_actif: 'Statut actif/inactif',
  openai_statut_connexion: 'Statut de la connexion',
  openai_limite_cout_mois: 'Limite coût mensuel'
} as const;

// Champs modifiables pour LinkedIn (⭐ = prioritaires)
export const LINKEDIN_GESTION_FIELDS = {
  linkedin_connexion_key: 'Clé API LinkedIn', // ⭐
  linkedin_email_compte: 'Email du compte LinkedIn', // ⭐
  linkedin_profil_entreprise_id: 'ID profil entreprise',
  linkedin_actif: 'Statut actif/inactif',
  linkedin_statut_connexion: 'Statut de la connexion'
} as const;

// Champs modifiables pour Facebook (⭐ = prioritaires)
export const FACEBOOK_GESTION_FIELDS = {
  facebook_connexion_key: 'Clé API Facebook', // ⭐
  facebook_email_compte: 'Email du compte Facebook', // ⭐
  facebook_business_id: 'ID Business Facebook',
  facebook_page_id: 'ID Page Facebook',
  facebook_actif: 'Statut actif/inactif',
  facebook_statut_connexion: 'Statut de la connexion'
} as const;

// Champs modifiables pour Instagram (⭐ = prioritaires)
export const INSTAGRAM_GESTION_FIELDS = {
  instagram_connexion_key: 'Clé API Instagram', // ⭐
  instagram_email_compte: 'Email du compte Instagram', // ⭐
  instagram_business_account_id: 'ID compte business Instagram',
  instagram_page_id: 'ID Page Instagram',
  instagram_type_compte: 'Type de compte',
  instagram_actif: 'Statut actif/inactif',
  instagram_statut_connexion: 'Statut de la connexion'
} as const;

// ========================================
// TYPES POUR TYPESCRIPT
// ========================================
export type UsersField = keyof typeof USERS_FIELDS;
export type UtilisateursField = keyof typeof UTILISATEURS_FIELDS;
export type OrganisationsField = keyof typeof ORGANISATIONS_FIELDS;
export type ReseauField = keyof typeof RESEAU_FIELDS;
export type BrevoConnexionField = keyof typeof BREVO_CONNEXION_FIELDS;
export type ZohoConnexionField = keyof typeof ZOHO_CONNEXION_FIELDS;
export type OpenaiConnexionField = keyof typeof OPENAI_CONNEXION_FIELDS;
export type LinkedinConnexionField = keyof typeof LINKEDIN_CONNEXION_FIELDS;
export type FacebookConnexionField = keyof typeof FACEBOOK_CONNEXION_FIELDS;
export type InstagramConnexionField = keyof typeof INSTAGRAM_CONNEXION_FIELDS;
export type AbonnementStripeField = keyof typeof ABONNEMENT_STRIPE_FIELDS;

export type ReseauCreationData = {
  [K in keyof typeof RESEAU_CREATION_REQUIRED]: string;
};

export type ReseauSectionType = keyof typeof RESEAU_GESTION_SECTIONS;

// ========================================
// VALEURS PAR DÉFAUT
// ========================================
export const DEFAULT_VALUES = {
  client_type: 'reseau',
  reseau_statut: 'actif',
  utilisateur_statut: 'actif',
  utilisateur_type_compte: 'reseau',
  autorisation_acces_reseau_presenca: true,
  reseau_espace_client: true
} as const;

// ========================================
// RÈGLES DE VALIDATION
// ========================================
export const VALIDATION_RULES = {
  required_fields: Object.keys(RESEAU_CREATION_REQUIRED),
  email_fields: ['users_email', 'reseau_email', 'brevo_email_compte', 'zoho_email_compte', 'openai_email_compte', 'linkedin_email_compte', 'facebook_email_compte', 'instagram_email_compte'],
  phone_fields: ['users_telephone', 'reseau_telephone'],
  siret_pattern: /^\d{14}$/,
  postal_code_pattern: /^\d{5}$/,
  
  // Intégrations - champs recommandés (mais pas obligatoires car NULLABLE)
  integration_recommended_fields: {
    brevo: ['brevo_api_key', 'brevo_email_compte'],
    zoho: ['zoho_api_key', 'zoho_email_compte', 'zoho_nom_compte'],
    openai: ['openai_api_key', 'openai_email_compte'],
    linkedin: ['linkedin_connexion_key', 'linkedin_email_compte'],
    facebook: ['facebook_connexion_key', 'facebook_email_compte'],
    instagram: ['instagram_connexion_key', 'instagram_email_compte']
  }
} as const;
