
🗺️ ROADMAP DÉTAILLÉE DES MODIFICATIONS
---------------------
Directives 
1. Je souhaite voir tous les fichiers complets avant intégration
2. Tu me transmets le ou les fichiers de l'étape tu comptes intégrer dans 
src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/ROADMAP.md
3. Je les étudie, te pose des questions ou valide
4. Tu intégres et tu procédes à l etapes
5. si tu rencontres un bug tu stoppes tout tu ne corriges pas tout seul je veux savoir avant car toute modif est grave pour mon appli
6. on analyse ensemble et on trouve la soltuion
7. Lorsque l etape est finie tu me le dis
et tu stoppes
8. tu me montres les fichiers de l'etaztp uisvante et ainis de site ok?
------------------




PHASE 1 : VÉRIFICATION DES SECRETS
Action : Vérifier si SUPABASE_SERVICE_ROLE_KEY existe

Si absent → Ajouter le secret via l'outil
Si présent → Continuer
----------------------
PHASE 2 : CRÉATION EDGE FUNCTION
Fichier : supabase/functions/create-reseau-admin/index.ts Contenu :


// 1. Import Supabase avec service_role depuis les secrets Deno
// 2. Headers CORS pour appels frontend
// 3. Validation des données d'entrée (types, format email, SIRET)
// 4. Génération mot de passe temporaire (uuid.slice(0,12))
// 5. Création utilisateur Auth via supabaseAdmin.auth.admin.createUser()
// 6. Appel fonction SQL create_reseau_compte_complet()
// 7. Rollback Auth si SQL échoue
// 8. Retour résultat structuré avec tempPassword
Mise à jour : supabase/config.toml


[
functions.create-reseau-admin
]
verify_jwt = false  # Accessible aux admins PRESENCA

----------------------------------
PHASE 3 : MODIFICATION DU HOOK
Fichier : src/components/HOOKS-STRATEGIQUE/5.HOOKS-CreationCompteAdminPresenca/1.Reseau/useReseauCreation.ts

Modifications :

SUPPRIMER : Toutes les lignes avec supabaseAdmin
REMPLACER : L'appel admin par Edge Function

// ANCIEN (lignes 18-58)
const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser(...)
const { data, error } = await supabase.rpc("create_reseau_compte_complet", ...)

// NOUVEAU
const { data, error } = await supabase.functions.invoke('create-reseau-admin', {
  body: formData
});
CONSERVER : Gestion d'erreurs, loading, types

--------
PHASE 4 : CORRECTION CLIENT SUPABASE
Fichier : src/integrations/supabase/client.ts

Modification :


// SUPPRIMER cette ligne incorrecte :
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);
PHASE 5 : FICHIERS INCHANGÉS
✅ FormReseauCreation.tsx → AUCUNE MODIFICATION
✅ Fonction SQL → DÉJÀ PARFAITE
✅ Types TypeScript → CONSERVÉS
📋 RÉSUMÉ DES CHANGEMENTS
| Fichier | Action | Détail | |---------|--------|--------| | supabase/functions/create-reseau-admin/index.ts | CRÉER | Edge Function complète | | supabase/config.toml | MODIFIER | Ajouter config fonction | | useReseauCreation.ts | MODIFIER | Remplacer admin par fonction | | client.ts | NETTOYER | Supprimer supabaseAdmin | | FormReseauCreation.tsx | AUCUNE | Interface inchangée |
----------------------------------

⚠️ POINTS D'ATTENTION
Service Role Key → Vérification obligatoire avant création
Gestion d'erreurs → Même comportement qu'actuellement
Interface utilisateur → Aucun impact visible
Sécurité → Amélioration (plus de clé sensible côté client)
Validation : Cette roadmap vous convient-elle avant que je procède aux modifications ?
--------------------

