import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client"; // adapte le chemin si besoin
import { AuthResult, AuthUser } from "./authTypes";
import { mapSupabaseError } from "./authMessages";

// Hook d'authentification : gère uniquement connexion / déconnexion / erreurs
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Charger la session au démarrage
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (mounted) {
        if (error) {
          setError(mapSupabaseError(error.message));
          setUser(null);
        } else {
          setUser(data.session?.user ?? null);
        }
        setIsLoading(false);
      }
    };

    initSession();

    // Écoute des changements d'état d'auth
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // 🔑 Connexion email/password
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      setIsLoading(false);
      if (error) {
        const message = mapSupabaseError(error.message);
        setError(message);
        return { ok: false, message };
      }

      return { ok: true };
    },
    []
  );

  // 🔑 Connexion avec Google (admin-only, pas de signup)
  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);
    if (error) {
      const message = mapSupabaseError(error.message);
      setError(message);
      return { ok: false, message };
    }

    return { ok: true };
  }, []);

  // 🚪 Déconnexion
  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(mapSupabaseError(error.message));
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    error,
    clearError: () => setError(null),
    signIn,
    signInWithGoogle,
    signOut,
  };
}
