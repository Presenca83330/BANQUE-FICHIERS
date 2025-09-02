import { useCallback } from "react";
import { useCurrentUser } from "@/components/HOOKS-STRATEGIQUE/2.HOOK-useCurrentUser/useCurrentUser";

// Hook multi-tenant : gère la redirection post-login et la validation organisation
export function useMultiTenant() {
  const { user, isLoading } = useCurrentUser();

  // Déterminer la route post-login
  const getPostLoginRoute = useCallback((): string => {
    if (isLoading) return "/loading"; // état transitoire
    if (!user) return "/login";

    // Vérifier statut utilisateur
    if (user.statut !== "actif") {
      return "/login";
    }

    // Vérifier organisation
    if (!user.organisationId) {
      return "/login";
    }

    // Redirections basées sur le rôle système
    if (["admin_presenca", "superadmin"].includes(user.roleSysteme || "")) {
      return "/admin-presenca";
    }

    // Redirections basées sur le type de compte
    if (["reseau", "reseau_direction"].includes(user.utilisateurTypeCompte || "")) {
      return "/espace-reseau";
    }

    // Tout le reste (agences, responsables, collaborateurs)
    return "/accueil-leadgenai";
  }, [user, isLoading]);

  return {
    getPostLoginRoute,
  };
}
