import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UseCurrentUserReturn, DbUser, OrganisationInfo, UpdateProfileInput } from './types';
import { buildQueryKey, getPermissions, logError } from './helpers';

async function fetchOrganisation(): Promise<OrganisationInfo | null> {
  const { data, error } = await (supabase as any).rpc('get_current_user_organisation');
  if (error) throw error;
  const org = Array.isArray(data) ? data[0] : null;
  return (org as OrganisationInfo) ?? null;
}

async function fetchDbUser(authUserId: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('users_auth_id', authUserId)
    .maybeSingle();
  if (error) throw error;
  return (data as DbUser) ?? null;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const queryClient = useQueryClient();
  const [authUser, setAuthUser] = useState<import('@supabase/supabase-js').User | null>(null);

  // Initial load + subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) logError('useCurrentUser.getUser', error);
      if (!mounted) return;
      setAuthUser(data?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const queryKey = useMemo(() => buildQueryKey(authUser?.id ?? null), [authUser?.id]);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    enabled: true, // exécute même si pas d'utilisateur pour renvoyer des nulls contrôlés
    queryFn: async () => {
      try {
        if (!authUser) {
          return { authUser: null, user: null, organisation: null } as const;
        }
        const [user, organisation] = await Promise.all([
          fetchDbUser(authUser.id),
          fetchOrganisation(),
        ]);
        return { authUser, user, organisation } as const;
      } catch (err) {
        logError('useCurrentUser.query', err);
        throw err;
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!authUser) throw new Error('Utilisateur non authentifié');

      const payload: UpdateProfileInput = {};
      if (typeof input.users_nom !== 'undefined') payload.users_nom = input.users_nom;
      if (typeof input.users_prenom !== 'undefined') payload.users_prenom = input.users_prenom;
      if (typeof input.users_telephone !== 'undefined') payload.users_telephone = input.users_telephone;

      if (Object.keys(payload).length === 0) return (data as any)?.user ?? null;

      const { data: updated, error } = await supabase
        .from('users')
        .update(payload)
        .eq('users_auth_id', authUser.id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return updated as DbUser | null;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => logError('useCurrentUser.updateProfile', err),
  });

  const user = (data as any)?.user as DbUser | null;
  const organisation = (data as any)?.organisation as OrganisationInfo | null;
  const permissions = useMemo(() => getPermissions(user ?? null), [user]);
  const isAuthenticated = !!authUser;

  return {
    authUser,
    user,
    organisation,
    permissions,
    isAuthenticated,
    isLoading,
    isFetching,
    error: error ? (error as any)?.message ?? 'Erreur inconnue' : null,
    refetch: async () => {
      try {
        await refetch();
      } catch (err) {
        logError('useCurrentUser.refetch', err);
      }
    },
    updateProfile: async (input) => updateProfileMutation.mutateAsync(input),
  };
}
