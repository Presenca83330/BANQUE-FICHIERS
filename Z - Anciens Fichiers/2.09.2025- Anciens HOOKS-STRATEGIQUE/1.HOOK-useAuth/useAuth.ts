// src/hooks/useAuth.ts
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthOk = { ok: true; code?: string; message?: string };
type AuthErr = { ok: false; code?: string; message: string };
export type AuthResult = AuthOk | AuthErr;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial session load
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, code: error.status?.toString(), message: error.message };
    return { ok: true };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, code: error.status?.toString(), message: error.message };
    return { ok: true };
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { ok: false, code: error.status?.toString(), message: error.message };
    return { ok: true };
  }, []);

  const signInWithProvider = useCallback(
    async (provider: "google"): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) return { ok: false, code: error.status?.toString(), message: error.message };
      return { ok: true };
    },
    []
  );

  return {
    // state
    user,
    session,
    isAuthenticated,
    isLoading,
    // actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithProvider,
  };
}