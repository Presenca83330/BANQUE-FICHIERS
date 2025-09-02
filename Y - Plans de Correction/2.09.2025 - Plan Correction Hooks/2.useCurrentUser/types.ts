// Types liés à useCurrentUser et au profil enrichi

export interface CurrentUser {
  id: string;                        // utilisateur_id
  usersAuthId: string;               // users_auth_id (FK → auth.users)
  email: string;                     // utilisateur_email
  utilisateurTypeCompte: string;     // ex: reseau, agence_independante
  roleSysteme: string | null;        // admin_presenca, superadmin, support...
  role: string | null;               // responsable, collaborateur...
  organisationId: string | null;     // utilisateur_organisation_id
  statut: string;                    // actif, suspendu, en_attente
}
