import { useMemo, useCallback } from "react";
import { useAuth } from "../1.HOOK-useAuth/useAuth";
import { useCurrentUser } from "../2.HOOK-useCurrentUser/useCurrentUser";
import { useImpersonation } from "@/contexts/ImpersonationContext";

export type OrganisationStatus = 
  | "ready"           // Organisation disponible et valide
  | "pending"         // Utilisateur authentifié mais pas d'organisation
  | "loading"         // Chargement en cours
  | "unauthenticated" // Pas connecté

export type SystemRole = "admin_presenca" | "superadmin" | "support";

export interface TenantContext {
  isAuthenticated: boolean;
  organisationStatus: OrganisationStatus;
  isAdminPresenca: boolean;
  isSystemAdmin: boolean;
  isImpersonating: boolean;
  organisationId: string | null;
  impersonatedOrganisationId: string | null;
  effectiveOrganisationId: string | null;
  organisationType: string | null;
}

export interface TenantValidation {
  valid: boolean;
  reason: string;
  message: string;
}

export function useMultiTenant() {
  const { isAuthenticated } = useAuth();
  const { user: dbUser, organisation, isLoading } = useCurrentUser();
  
  // Protection useImpersonation avec fallback
  let impersonationHook;
  try {
    impersonationHook = useImpersonation();
  } catch (error) {
    console.warn("useImpersonation non disponible, mode dégradé");
    impersonationHook = { 
      isImpersonating: false, 
      impersonatedOrganisation: null 
    };
  }
  
  const { isImpersonating, impersonatedOrganisation } = impersonationHook;

  // Gestion robuste des données organisation
  const organisationId = useMemo(() => {
    return dbUser?.users_organisation_id ?? organisation?.organisation_id ?? null;
  }, [dbUser?.users_organisation_id, organisation?.organisation_id]);

  // NOUVELLE LOGIQUE ALIGNÉE STRUCTURE BUSINESS OPENAI - utilise calculated_type
  const organisationType = (organisation as any)?.calculated_type || null;
  
  // Gestion complète des rôles système
  const systemRole = dbUser?.users_role_systeme as SystemRole | null;
  const isAdminPresenca = systemRole === "admin_presenca";
  const isSystemAdmin = ["admin_presenca", "superadmin", "support"].includes(systemRole || "");
  
  // Gestion impersonation avec validation
  const impersonatedOrganisationId = (isImpersonating && impersonatedOrganisation?.organisation_id) 
    ? impersonatedOrganisation.organisation_id 
    : null;
  
  const effectiveOrganisationId = isImpersonating ? impersonatedOrganisationId : organisationId;

  // Statut organisation intelligent
  const organisationStatus = useMemo((): OrganisationStatus => {
    if (!isAuthenticated) return "unauthenticated";
    if (isLoading) return "loading";
    
    // Admin système sans impersonation = toujours "ready"
    if (isSystemAdmin && !isImpersonating) return "ready";
    
    // Autres cas = besoin d'organisation
    return effectiveOrganisationId ? "ready" : "pending";
  }, [isAuthenticated, isLoading, isSystemAdmin, isImpersonating, effectiveOrganisationId]);

  // Préparation impersonation
  const canImpersonate = isSystemAdmin;

  // CLASSIFICATIONS SIMPLIFIÉES - STRUCTURE BUSINESS RÉELLE
  const isReseau = organisationType === "reseau";           // inclut reseau + reseau_agence
  const isAgenceIndep = organisationType === "agence_independante";
  const isPresenca = systemRole === "admin_presenca";  // géré par rôle système
  const hasKnownOrgType = isReseau || isAgenceIndep;

  // Context pour useSupabaseOperations
  const getTenantContext = useCallback((): TenantContext => ({
    isAuthenticated,
    organisationStatus,
    isAdminPresenca,
    isSystemAdmin,
    isImpersonating,
    organisationId,
    impersonatedOrganisationId,
    effectiveOrganisationId,
    organisationType
  }), [
    isAuthenticated, 
    organisationStatus, 
    isAdminPresenca, 
    isSystemAdmin, 
    isImpersonating, 
    organisationId, 
    impersonatedOrganisationId, 
    effectiveOrganisationId, 
    organisationType
  ]);

  // Validation sans crash
  const validateTenantAccess = useCallback((operation: string = "operation"): TenantValidation => {
    if (organisationStatus === "unauthenticated") {
      return { valid: false, reason: "authentication_required", message: "Connexion requise" };
    }
    
    if (organisationStatus === "loading") {
      return { valid: false, reason: "loading", message: "Chargement en cours..." };
    }
    
    if (organisationStatus === "pending") {
      return { 
        valid: false, 
        reason: "organisation_pending", 
        message: "Votre compte est en cours de configuration. Contactez votre administrateur." 
      };
    }
    
    // Admin système sans impersonation = toujours valide
    if (isSystemAdmin && !isImpersonating) {
      return { valid: true, reason: "system_admin", message: "Accès administrateur" };
    }
    
    // Autres cas = organisation requise
    if (!effectiveOrganisationId) {
      return { 
        valid: false, 
        reason: "organisation_missing", 
        message: `Organisation requise pour ${operation}` 
      };
    }
    
    return { valid: true, reason: "organisation_access", message: "Accès autorisé" };
  }, [organisationStatus, isSystemAdmin, isImpersonating, effectiveOrganisationId]);

  // Guard avec gestion d'erreur appropriée
  const requireTenantAccess = useCallback((operation: string = "cette opération") => {
    const validation = validateTenantAccess(operation);
    if (!validation.valid) {
      throw new Error(`${validation.message} (Code: ${validation.reason})`);
    }
  }, [validateTenantAccess]);

  return useMemo(() => ({
    // États et données
    isAuthenticated,
    organisationStatus,
    user: dbUser,
    organisation,
    organisationId,
    organisationType,
    effectiveOrganisationId,
    
    // Permissions étendues
    isAdminPresenca,
    isSystemAdmin,
    canImpersonate,
    isImpersonating,
    systemRole,
    
    // Classification métier - Structure Business Réelle
    isReseau,
    isAgenceIndep,
    isPresenca,
    hasKnownOrgType,
    
    // API sécurisée pour useSupabaseOperations
    getTenantContext,
    validateTenantAccess,
    requireTenantAccess,
    
    // Helpers d'état
    isReady: organisationStatus === "ready",
    isPending: organisationStatus === "pending",
    isLoading: organisationStatus === "loading"
  }), [
    isAuthenticated,
    organisationStatus,
    dbUser,
    organisation,
    organisationId,
    organisationType,
    effectiveOrganisationId,
    isAdminPresenca,
    isSystemAdmin,
    canImpersonate,
    isImpersonating,
    systemRole,
    isReseau,
    isAgenceIndep,
    isPresenca,
    hasKnownOrgType,
    getTenantContext,
    validateTenantAccess,
    requireTenantAccess
  ]);
}

export type UseMultiTenantReturn = ReturnType<typeof useMultiTenant>;