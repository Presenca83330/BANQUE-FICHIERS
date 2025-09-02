// Helpers génériques pour useCurrentUser et autres hooks

// Normaliser un email (trim + minuscule)
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Vérifier si l'utilisateur est admin PRESENCA
export function isAdminPresenca(roleSysteme: string | null): boolean {
  return roleSysteme === "admin_presenca" || roleSysteme === "superadmin";
}

// Vérifier si une organisation est active
export function isOrganisationActive(stat: string | null): boolean {
  return stat === "actif";
}
