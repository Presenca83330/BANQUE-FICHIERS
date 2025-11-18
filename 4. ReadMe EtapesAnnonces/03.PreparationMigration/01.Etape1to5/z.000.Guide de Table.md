## 📐 GUIDE DE REMPLISSAGE - Colonnes du tableau de conception

| **Colonne à remplir** | **Explication / Méthodologie pour bien la remplir** |
|----------------------|---------------------------------------------------|
| **Table** | Nom de la table Supabase concernée (ex: `etapes_1to5`, `organisations`) |
| **Code champ** | Nom exact du champ en base (`camelCase` pour champs métier, `snake_case` pour champs système) |
| **Description** | Description fonctionnelle du champ : à quoi sert-il ? Quelle donnée contient-il ? |
| **Obligatoire** | **Comment savoir** : Vérifier dans les formulaires si le champ bloque la validation (`if (!field.trim()) { toast error }`). Regarder les audits des étapes (règles métier). Si absence = erreur de validation → **Oui** |
| **Facultatif** | **Comment savoir** : Inverse de "Obligatoire". Si le formulaire permet de passer à l'étape suivante sans remplir → **Oui**. Exemples : `details`, `hasNoDetails` |
| **Condition de remplissage** | **Comment identifier** : Chercher dans les fichiers de formulaires les conditions `if/else` liées au champ. Exemple : `rentAmount` est requis SI `saleType === 'location'`. Documenter ici la logique conditionnelle |
| **Droits de modification tables** | **Comment définir** : Qui peut UPDATE ce champ après création initiale ? Options : `user_owner` (créateur uniquement), `organisation` (tous les users de l'organisation), `admin_presenca` (uniquement admin), `readonly_after_validation` (figé après validation), `always_editable` |
| **Droits de modification presenca** | **Comment définir** : Est-ce que `admin_presenca` peut corriger/modifier ce champ métier ? Options : `Oui` (admin peut corriger les erreurs), `Non` (données métier intouchables), `Uniquement via audit` (correction tracée dans logs) |
| **Type SQL** | **Comment choisir** : Analyser le type de donnée JavaScript actuel dans `propertyDataStorage.ts` et `EnsembleFormulairesEtape1Form.tsx`. Mappings : `string` → `TEXT`, `number` → `NUMERIC`, `boolean` → `BOOLEAN`, `Date` → `TIMESTAMPTZ`, objet complexe → `JSONB` |
| **Clé primaire (PK)** | **Comment identifier** : Uniquement pour le champ identifiant unique de la table (ex: `id UUID`). Un seul PK par table. Si c'est un champ métier → **Non** |
| **Clé étrangère (FK)** | **Comment identifier** : Le champ référence-t-il un `id` d'une autre table ? Exemples : `organisation_id` → FK vers `organisations.organisation_id`, `user_id` → FK vers `users.users_id`. Si non → laisser vide |
| **Référence vers table** | **Comment remplir** : Si FK = Oui, indiquer la table et colonne cible. Format : `nom_table.nom_colonne` (ex: `organisations.organisation_id`) |
| **Contraintes Supabase** | **Comment définir** : Lister les contraintes SQL à ajouter : `NOT NULL`, `UNIQUE`, `CHECK (length(...) > 0)`, `CHECK (field IN ('vente', 'location'))`, `DEFAULT valeur`, index, etc. S'inspirer des validations actuelles dans les formulaires |
| **Type d'identifiant** | **Comment identifier** : Uniquement pour les champs de type ID. Options : `UUID` (gen_random_uuid()), `SERIAL`, `TEXT` (pour codes métier), `NULL` (si ce n'est pas un identifiant) |
| **Actions à prévoir** | **Comment identifier** : Lister les actions techniques nécessaires : création d'index ? Trigger de synchronisation ? Fonction de validation ? Policy RLS spécifique ? Migration de données depuis localStorage ? Intégration avec OpenAI ? |
| **Étape collecte** | Indiquer à quelle étape du processus (Étape 1, 2, 3, 4, 5) ce champ est saisi par l'utilisateur |

---

### 🔍 Sources à consulter pour remplir correctement

Pour chaque champ `PropertyData`, tu dois vérifier :

1. **Fichiers de formulaires** (validation côté client) :
   - `src/components/1-Sources-Generation-Annonces/form-etape1/EnsembleFormulairesEtape1Form.tsx`
   - `src/components/1-Sources-Generation-Annonces/form-etape2/SaisieDescriptionForm.tsx`
   - `src/components/1-Sources-Generation-Annonces/form-etape3/SaisieFinancialForm.tsx`
   - `src/components/1-Sources-Generation-Annonces/form-etape4/SaisieDetailsForm.tsx`

2. **Audits des étapes** (règles métier) :
   - `public/4. ReadMe EtapesAnnonces/01.Etape1à5/01.Etape1.md`
   - `public/4. ReadMe EtapesAnnonces/01.Etape1à5/02.Etape2.md`
   - `public/4. ReadMe EtapesAnnonces/01.Etape1à5/03.Etape3.md`
   - `public/4. ReadMe EtapesAnnonces/01.Etape1à5/04.Etape4.md`

3. **Stockage actuel** :
   - `src/services/openai.ts` (fonctions `updatePropertyData`, `getPropertyDataFromStorage`)

---


