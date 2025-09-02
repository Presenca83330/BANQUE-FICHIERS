import { DbUser, Permissions } from './types';

export const computeIsAdminPresenca = (user: DbUser | null): boolean =>
  (user?.users_role_systeme ?? null) === 'admin_presenca';

export const getPermissions = (user: DbUser | null): Permissions => {
  const isAdminPresenca = computeIsAdminPresenca(user);
  return {
    isAdminPresenca,
    canImpersonate: isAdminPresenca,
    canManageOrganisation: (user?.users_role ?? 'client') === 'admin',
  };
};

export const buildQueryKey = (authUserId: string | null) => ['useCurrentUser', authUserId];

export const logError = (scope: string, error: unknown) => {
  // Phase 2: brancher le logger centralisé (query/network)
  if (error instanceof Error) {
    console.error(`[${scope}]`, error.message, error.stack);
  } else {
    console.error(`[${scope}]`, error);
  }
};
