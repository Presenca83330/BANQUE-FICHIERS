import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CurrentUser } from "./types";

// Hook qui récupère le profil utilisateur enrichi
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // 1️⃣ Récupérer l'utilisateur auth courant
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      setUser(null);
      setIsLoading(false);
      setError("Utilisateur non authentifié");
      return;
    }

    // 2️⃣ Récupérer son profil dans `utilisateurs`
    const { data: utilisateur, error: utilisateurError } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("utilisateur_auth_uid", authUser.id)
      .maybeSingle();

    if (utilisateurError) {
      setError("Erreur lors du chargement du profil utilisateur");
      setIsLoading(false);
      return;
    }

    if (!utilisateur) {
      setError("Profil utilisateur introuvable");
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Vérifier statut actif
    if (utilisateur.utilisateur_statut !== "actif") {
      setError("Compte inactif ou suspendu");
      setUser(null);
      setIsLoading(false);
      return;
    }

    // 3️⃣ Récupérer le rôle système dans `users`
    const { data: userSystem, error: userSystemError } = await supabase
      .from("users")
      .select("users_role_systeme, users_role, users_organisation_id")
      .eq("users_auth_id", authUser.id)
      .maybeSingle();

    if (userSystemError) {
      setError("Erreur lors du chargement des infos système");
      setIsLoading(false);
      return;
    }

    // 4️⃣ Construire l'objet CurrentUser enrichi
    const enrichedUser: CurrentUser = {
      id: utilisateur.utilisateur_id,
      usersAuthId: utilisateur.utilisateur_auth_uid,
      email: utilisateur.utilisateur_email,
      utilisateurTypeCompte: utilisateur.utilisateur_type_compte,
      roleSysteme: utilisateur.utilisateur_role_systeme || userSystem?.users_role_systeme || null,
      role: utilisateur.utilisateur_role || userSystem?.users_role || null,
      organisationId: utilisateur.utilisateur_organisation_id,
      statut: utilisateur.utilisateur_statut,
    };

    setUser(enrichedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    user,
    isLoading,
    error,
    reload: fetchCurrentUser,
  };
}
