// tableMapping.ts
import { TableName, TableMapping } from './types';

const TABLE_MAPPINGS: Record<TableName, TableMapping> = {
  users: {
    organisationField: 'users_organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  utilisateurs: {
    organisationField: 'utilisateur_organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  organisations: {
    organisationField: null,
    accessLevel: 'admin_only',
    allowedOperations: ['read', 'write', 'delete'],
  },
  '1_historique_supabase': {
    organisationField: 'organisation_id',
    accessLevel: 'admin_only',
    allowedOperations: ['read'],
  },
  abonnement_stripe: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  agence_independante: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  agence_independante_collaborateur: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  agence_independante_responsable: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  reseau: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  reseau_agence: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  reseau_agence_collaborateur: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  reseau_agence_responsable: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  reseau_direction: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  brevo_connexion: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  facebook_connexion: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  instagram_connexion: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  linkedin_connexion: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  openai_connexion: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
  zoho_connexion: {
    organisationField: 'organisation_id',
    accessLevel: 'organization',
    allowedOperations: ['read', 'write', 'delete'],
  },
};

export function getTableMapping(tableName: TableName): TableMapping {
  return TABLE_MAPPINGS[tableName];
}
