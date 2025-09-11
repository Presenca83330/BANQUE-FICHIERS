# PENSE-BÊTE - FormReseauGestion 

## État actuel du développement

**Contexte** : Développement du formulaire de gestion des réseaux pour les administrateurs PRESENCA
**Fichier principal** : `3.FormReseauGestion.tsx`
**Onglet en cours** : **GÉNÉRAL**

## Architecture des champs - Onglet Général

### ✅ Champs réseau pur (OK à modifier ici)
Ces champs relèvent de l'entité Réseau (organisation/business) :

- `reseau_nom` → Nom du réseau 
- `reseau_identite_commerciale` → Identité commerciale du Réseau
- `reseau_adresse` → Adresse. Siège Réseau
- `reseau_code_postal` → Code Postal. Siège Réseau
- `reseau_ville` → Ville. Siège Réseau
- `reseau_siret` → N° du Siret du Réseau

👉 **Action** : Je peux les modifier directement dans Formulaire Réseau.

### ⚠️ Champs liés au responsable de réseau (PAS ICI)
Ces champs concernent ReseauDirection :

- `reseau_telephone` → Tél. ReseauDirection
- `reseau_email` → Email. ReseauDirection 

👉 **Restriction** : Ces champs ne doivent pas être modifiés dans Formulaire Réseau car ils concernent ReseauDirection. Ils seront gérés dans le futur formulaire Réseau Direction.

### Message pour les champs bloqués
```
"Ce champ correspond aux informations du ReseauDirection.
À modifier dans le formulaire RÉSEAU Direction"
```

## Prochaines étapes
- Implémenter les champs modifiables dans l'onglet Général
- Bloquer les champs telephone et email avec message explicatif
- Passer aux autres onglets (Intégrations, Fichiers)

---

## ONGLET INTÉGRATIONS - Architecture validée ✅

**Statut** : Analyse terminée - Ready pour implémentation

### 🔗 Architecture des champs d'intégration

**Principe** : 4 tables impliquées
- 1 table principale `reseau` (liens FK)
- 3 tables spécialisées `brevo_connexion`, `zoho_connexion`, `openai_connexion`

### 📋 Champs à implémenter dans le formulaire

#### **1. BREVO (table: brevo_connexion)**
- `brevo_api_key` → Clé API Brevo ⭐
- `brevo_email_compte` → Email du compte Brevo ⭐  
- `brevo_nom_compte` → Nom du compte Brevo ⭐

#### **2. ZOHO (table: zoho_connexion)**
- `zoho_api_key` → Clé API Zoho ⭐
- `zoho_email_compte` → Email du compte Zoho ⭐
- `zoho_nom_compte` → Nom du compte Zoho ⭐

#### **3. OPENAI (table: openai_connexion)**
- `openai_api_key` → Clé API OpenAI ⭐
- `openai_email_compte` → Email du compte OpenAI ⭐

### ✅ Validation technique
- **Tous les ID vérifiés** ✅ (correspondent aux colonnes Supabase)
- **Champs obligatoires identifiés** ✅ (selon contraintes NOT NULL)
- **Architecture multi-tables validée** ✅

### 🎯 Prochaine étape pour l'onglet Intégrations
- Créer les composants de formulaire pour chaque intégration
- Gérer les relations FK depuis table `reseau` vers tables de connexions
- Implémenter la validation des champs obligatoires par intégration

---

## ONGLET FICHIER - Architecture Storage validée ✅

**Statut** : Analyse terminée - Architecture définie - Ready pour implémentation

### 🗂️ Problématique Storage identifiée

**Situation analysée** :
- ✅ **Champ table** : `reseau_logo` (text) existe dans table `reseau`
- ❌ **Storage bucket** : Aucun bucket configuré dans Supabase
- ❌ **Policies RLS** : Pas de policies storage définies

**Besoin** : Upload et stockage sécurisé des fichiers (logos, documents) par réseau

### 🏗️ Architecture Storage définie - IMPÉRATIVE

#### **Bucket unique multi-tenant** (approche validée)
- **Nom bucket** : `bucket-table-reseau`
- **Organisation** : Isolation par UUID réseau + sous-dossiers typés
- **Sécurité** : RLS policies pour isolation parfaite par reseau_id

#### **Structure de dossiers OBLIGATOIRE** 📁
```
bucket-table-reseau/
└── reseau-{uuid}/                    ← UUID = reseau_id exact
    ├── 1-logos/                      ← Dossier logos
    │   ├── logo-principal.png
    │   └── logo-alternatif.png
    ├── 2-documents-institutionnels/  ← Dossier documents
    │   ├── presentation.pdf
    │   ├── reglement.pdf
    │   └── statuts.pdf
    └── 3-charte-graphique/           ← Extensible futur
        └── charte-couleurs.pdf
```

#### **Exemples de chemins complets**
```
bucket-table-reseau/reseau-550e8400-e29b-41d4-a716-446655440000/1-logos/logo.png
bucket-table-reseau/reseau-550e8400-e29b-41d4-a716-446655440000/2-documents-institutionnels/presentation.pdf
```

### 🛡️ Sécurité RLS Storage - Isolation garantie

**Principe** : Chaque réseau voit UNIQUEMENT ses fichiers
- **Protection** : RLS policies sur storage.objects
- **Filtrage** : Par reseau_id (chaque dossier est nommé reseau-{uuid})
- **Pattern** : `name LIKE 'reseau-' || reseau_id::text || '/%'`

**Garantie zéro mélange** : Même niveau de sécurité que les tables

### 📋 Champs formulaire - Mapping défini

#### **CHAMP 1 : Logo principal** 
- **Type formulaire** : Upload fichier unique (image)
- **Table destination** : `reseau_logo` (text)
- **Contenu stocké** : URL/chemin complet du fichier
- **Format** : `bucket-table-reseau/reseau-{uuid}/1-logos/nom-fichier.ext`

#### **CHAMP 2 : Documents institutionnels**
- **Type formulaire** : Upload multiple fichiers (PDF, DOC)
- **Table destination** : `reseau_ressources` (ARRAY)
- **Contenu stocké** : Array des URLs/chemins
- **Format** : 
```json
[
  "bucket-table-reseau/reseau-{uuid}/2-documents-institutionnels/presentation.pdf",
  "bucket-table-reseau/reseau-{uuid}/2-documents-institutionnels/reglement.pdf"
]
```

### 🔄 Workflow d'upload défini

1. **Étape 1** : User sélectionne fichier(s) dans formulaire
2. **Étape 2** : Upload vers bucket storage (avec path calculé)
3. **Étape 3** : Storage retourne URL(s) du/des fichier(s)
4. **Étape 4** : Sauvegarde URL(s) dans champ(s) table `reseau`
5. **Étape 5** : Affichage via URL(s) stockée(s)

### ⚙️ Ce qui doit être créé AVANT codage

1. **Bucket storage** `bucket-table-reseau`
2. **Policies RLS** pour isolation par reseau_id
3. **Policies upload** pour admins PRESENCA

### 🎯 Prochaines étapes onglet Fichier
- Créer le bucket et policies storage
- Implémenter composant upload logo (champ unique)
- Implémenter composant upload documents (multi-fichiers)
- Gérer preview/suppression des fichiers uploadés

---

## ✅ ÉTAPE 1 - SÉLECTION RÉSEAU VALIDÉE

**Statut** : Option A validée - Architecture complète définie - Ready pour implémentation

### 🎯 Solution choisie : Dropdown avec recherche intégrée

**Décision validée** : Option A (Dropdown avec recherche) vs Option B (Champ de recherche séparé)

#### 🎨 Comportement visuel défini

**État fermé** :
- Dropdown standard avec placeholder "Sélectionner un réseau..."
- Icône chevron down à droite
- Design cohérent avec le design system (bg-background, border-border)

**État ouvert** :
- Liste déroulante avec barre de recherche en haut
- Zone de recherche : input avec placeholder "Rechercher un réseau..."
- Liste filtrée en temps réel selon la saisie
- Scroll si plus de 8-10 résultats
- Background solid (bg-popover) avec z-index élevé pour éviter transparence

**État sélectionné** :
- Dropdown se ferme automatiquement
- Affichage du nom du réseau sélectionné dans le champ
- Déclenche automatiquement le chargement des données (Étape 2)

#### 📋 Contenu de chaque item dans la liste

**Format d'affichage simplifié** :
```
{reseau_nom}
```

**Données source** : 
- Table principale : `reseau`
- Champs requis : `reseau_nom`

#### 🔍 Fonctionnalité de recherche

**Comportement** :
- Recherche en temps réel (pas de bouton rechercher)
- Filtrage sur : `reseau_nom`
- Recherche insensible à la casse
- Debouncing 300ms pour optimiser les requêtes

**Requête Supabase** :
```javascript
const { data } = await supabase
  .from('reseau')
  .select('reseau_id, reseau_nom')
  .eq('reseau_statut', 'actif')
  .order('reseau_nom');
```

---

## ✅ ÉTAPE 2 - INTÉGRATION CHAMPS VALIDÉE
# ÉTAPE 2 — Intégration champs validée

---

**Décision validée** : Option 2 (lecture seule d'abord) vs Option 1 (édition directe)

## Workflow complet défini

- Sélection réseau (déclenchement automatique)
  - L'utilisateur sélectionne un réseau dans le dropdown (Étape 1)
  - `onValueChange` déclenche automatiquement `loadReseauData(reseauId)`
  - Tous les onglets reçoivent les données complètes du réseau
- Affichage lecture seule
  - Tous les champs se remplissent automatiquement
  - Tous les champs sont en mode `disabled={true}` (lecture seule)
  - Un bouton « Modifier » est visible dans chaque section (Général, Intégrations, Fichiers)
  - L'utilisateur peut voir toutes les données mais ne peut pas les modifier
- Mode édition (après clic « Modifier »)
  - Clic sur le bouton « Modifier » dans une section spécifique
  - Les champs de cette section deviennent `disabled={false}` (éditables)
  - Le bouton « Modifier » disparaît
  - Apparition des boutons « Annuler » et « Enregistrer »
- Sauvegarde ou annulation
  - « Enregistrer » : sauvegarde en base puis retour en lecture seule
  - « Annuler » : reset des champs puis retour en lecture seule

## Données à charger par onglet

**Onglet Général** (table : `reseau`) :
```javascript
const generalData = {
  reseau_nom,
  reseau_identite_commerciale,
  reseau_adresse,
  reseau_code_postal,
  reseau_ville,
  reseau_siret,
  // BLOQUÉS (ReseauDirection):
  reseau_telephone, // → Affichage seul avec message
  reseau_email      // → Affichage seul avec message
}
```

**Onglet Intégrations** (tables : `brevo_connexion`, `zoho_connexion`, `openai_connexion`) :
```javascript
const integrationsData = {
  brevo: {
    brevo_api_key,
    brevo_email_compte,
    brevo_nom_compte
  },
  zoho: {
    zoho_api_key,
    zoho_email_compte,
    zoho_nom_compte
  },
  openai: {
    openai_api_key,
    openai_email_compte
  }
}
```

**Onglet Fichiers** (table : `reseau`) :
```javascript
const filesData = {
  reseau_logo,        // → URL du logo
  reseau_ressources   // → Array des URLs documents
}
```

## Hook de gestion des données

**Nom** : `useReseauFormData`

**Responsabilités** :
- Chargement des données complètes du réseau sélectionné
- Gestion des états d'édition par section
- Sauvegarde des modifications
- Reset en cas d'annulation

**Interface** :
```typescript
interface UseReseauFormDataReturn {
  // Données
  reseauData: ReseauCompleteData | null;
  isLoading: boolean;
  
  // Actions
  loadReseauData: (reseauId: string) => Promise<void>;
  updateField: (section: string, field: string, value: any) => void;
  
  // États d'édition
  editingStates: {
    general: boolean;
    integrations: boolean;
    files: boolean;
  };
  toggleEditMode: (section: string) => void;
  
  // Sauvegarde
  saveSection: (section: string) => Promise<void>;
  cancelEdit: (section: string) => void;
}
```

## Intégration `GraphBoutonModifier`

**Composant existant** : `GraphBoutonModifier.tsx` (déjà fonctionnel)

**Usage dans chaque section** :
```tsx
// ONGLET GÉNÉRAL
<GraphBoutonModifier
  onEditingChange={(isEditing) => toggleEditMode('general')}
  onSave={() => saveSection('general')}
  onCancel={() => cancelEdit('general')}
  isLoading={isLoadingSave}
/>

// ONGLET INTÉGRATIONS
<GraphBoutonModifier
  onEditingChange={(isEditing) => toggleEditMode('integrations')}
  onSave={() => saveSection('integrations')}
  onCancel={() => cancelEdit('integrations')}
  isLoading={isLoadingSave}
/>

// ONGLET FICHIERS
<GraphBoutonModifier
  onEditingChange={(isEditing) => toggleEditMode('files')}
  onSave={() => saveSection('files')}
  onCancel={() => cancelEdit('files')}
  isLoading={isLoadingSave}
/>
```

**Contrôle des champs** :
```tsx
// Exemple pour onglet Général
<Input
  value={reseauData?.reseau_nom || ''}
  onChange={(e) => updateField('general', 'reseau_nom', e.target.value)}
  disabled={!editingStates.general}
/>
```

## Requête de chargement complète

**Query Supabase obligatoire** :
```javascript
const loadCompleteReseauData = async (reseauId) => {
  const { data, error } = await supabase
    .from('reseau')
    .select(`
      *,
      reseau_direction(*),
      brevo_connexion(*),
      zoho_connexion(*),
      openai_connexion(*)
    `)
    .eq('reseau_id', reseauId)
    .single();
    
  return data;
};
```

## UX Messages

**Champs bloqués (telephone/email)** :
```tsx
<div className="relative">
  <Input value={reseauData?.reseau_telephone} disabled />
  <p className="text-sm text-muted-foreground mt-1">
    Ce champ correspond aux informations du ReseauDirection.
    À modifier dans le formulaire RÉSEAU Direction
  </p>
</div>
```

**États de chargement** :
- Spinner pendant `loadReseauData`
- Skeleton des champs pendant chargement
- Toast de confirmation après sauvegarde

## Ordre d'implémentation recommandé

- Hook `useReseauFormData` → Gestion état/données
- Composant `DropdownReseauSelector` → Sélection réseau
- Intégration onglet Général → Premier cas d'usage
- Intégration onglets Intégrations et Fichiers → Complétion
- Tests et ajustements UX → Finalisation

---

# Analyse architecture complète — `FormReseauGestion`

**Date d'analyse** : Phase d'étude architecture  
**Objectif** : Estimation précise des fichiers, hooks et composants nécessaires

## Synthèse quantitative

**En plus du fichier principal** `FormReseauGestion.tsx` (qui sera modifié), voici l'architecture complète :

### Hooks stratégiques — 6 nouveaux fichiers

```
src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/
├── useReseauFormData.ts           → Hook orchestrateur principal
├── useReseauSelector.ts           → Dropdown sélection + recherche
├── useReseauValidation.ts         → Validation champs par section
├── useReseauFiles.ts              → Upload fichiers + storage
├── useReseauIntegrations.ts       → Gestion Brevo/Zoho/OpenAI
└── types.ts                       → Interfaces TypeScript (modifié)
```

### Composants UI — 7 nouveaux composants

```
src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/Components/
├── DropdownReseauSelector.tsx     → Dropdown avec recherche intégrée
├── FormOngletGeneral.tsx          → Section Général isolée
├── FormOngletIntegrations.tsx     → Section Intégrations isolée
├── FormOngletFichiers.tsx         → Section Fichiers isolée
├── IntegrationBrevo.tsx           → Sous-composant Brevo
├── IntegrationZoho.tsx            → Sous-composant Zoho
└── IntegrationOpenAI.tsx          → Sous-composant OpenAI
```

### Base de données — 1 migration SQL

```
supabase/migrations/
└── [timestamp]_create_storage_bucket_reseau.sql  → Bucket + RLS policies
```

### Edge functions — 3 nouvelles fonctions

```
supabase/functions/
├── update-reseau-general/         → MAJ onglet Général
├── update-reseau-integrations/    → MAJ onglet Intégrations
└── update-reseau-files/           → MAJ onglet Fichiers + Storage
```

### Types TypeScript — 7 nouvelles interfaces principales

```typescript
ReseauCompleteData                 → Données réseau avec jointures
ReseauSelectorOption               → Option dropdown sélection
ReseauEditingStates                → États d'édition par section
ReseauValidationErrors             → Erreurs validation
ReseauIntegrationsData             → Données intégrations
ReseauFilesData                    → Données fichiers/storage
ReseauFormSections                 → Sections du formulaire
```

## Détail fonctionnel par hook

### 1. `useReseauFormData` (Complexité : Élevée)

**Rôle** : Orchestrateur central, gestion de l'état global

**Responsabilités** :
- Chargement des données complètes réseau avec jointures
- Gestion des états d'édition par section (général, intégrations, fichiers)
- Coordination de la sauvegarde multi-tables
- Interface avec les autres hooks

**Fonctions exposées** :
```typescript
loadReseauData, updateField, saveSection, cancelEdit, toggleEditMode, resetSection
```

### 2. `useReseauSelector` (Complexité : Moyenne)

**Rôle** : Dropdown de sélection avec recherche intelligente

**Responsabilités** :
- Recherche temps réel sur `reseau_nom`, `organisation_nom`, `reseau_ville`
- Requête avec jointure `organisations`
- Debouncing 300 ms pour optimisation
- Formatage d'affichage des items

### 3. `useReseauValidation` (Complexité : Moyenne)

**Rôle** : Validation métier par section

**Responsabilités** :
- Validation des champs obligatoires (Général)
- Validation du format des API keys (Intégrations)
- Validation des types de fichiers (images, PDF)
- Messages d'erreur contextuels

### 4. `useReseauFiles` (Complexité : Élevée)

**Rôle** : Gestion du storage multi-fichiers

**Responsabilités** :
- Upload vers bucket storage avec chemins calculés
- Gestion logo unique et documents multiples
- Preview des fichiers uploadés
- Suppression des fichiers et nettoyage storage

### 5. `useReseauIntegrations` (Complexité : Moyenne)

**Rôle** : Gestion des connexions externes

**Responsabilités** :
- Sauvegarde multi-tables (`brevo_connexion`, `zoho_connexion`, `openai_connexion`)
- Gestion des relations FK depuis la table `reseau`
- Tests de validation des connexions API (futur)

## Complexité par composant

### Composants simples (faible complexité)

- `IntegrationBrevo.tsx` → Formulaire 3 champs
- `IntegrationZoho.tsx` → Formulaire 3 champs
- `IntegrationOpenAI.tsx` → Formulaire 2 champs

### Composants moyens (complexité moyenne)

- `DropdownReseauSelector.tsx` → Search et formatage
- `FormOngletGeneral.tsx` → 6 champs et champs bloqués
- `FormOngletIntegrations.tsx` → 3 sous-composants

### Composants complexes (haute complexité)

- `FormOngletFichiers.tsx` → Upload, preview, storage
- `FormReseauGestion.tsx` → Orchestration complète

## Migration SQL détaillée

**Contenu obligatoire** :
```sql
-- Création bucket storage
INSERT INTO storage.buckets (id, name, public) VALUES ('bucket-table-reseau', 'bucket-table-reseau', false);

-- RLS policies isolation par organisation
CREATE POLICY "Organisation access files" ON storage.objects
FOR ALL USING (
  bucket_id = 'bucket-table-reseau'
  AND name LIKE 'reseau-' || get_user_organisation_id(auth.uid())::text || '/%'
);

-- Admin PRESENCA full access
CREATE POLICY "Admin PRESENCA full access storage" ON storage.objects
FOR ALL USING (is_admin_presenca(auth.uid()));
```

## Edge functions stratégiques

### `update-reseau-general`
- Mise à jour table `reseau` (champs généraux)
- Validation SIRET et codes postaux
- Audit log des changements

### `update-reseau-integrations`
- Mise à jour tables `brevo_connexion`, `zoho_connexion`, `openai_connexion`
- Gestion des relations FK
- Tests de validation API keys

### `update-reseau-files`
- Gestion des uploads storage
- Mise à jour champs `reseau_logo`, `reseau_ressources`
- Nettoyage des fichiers supprimés

## Estimation développement

**Projet substantiel mais structuré** :
- 6 hooks stratégiques pour une architecture modulaire
- 7 composants UI spécialisés et réutilisables
- 1 migration storage avec sécurité RLS complète
- 3 edge functions pour la logique backend
- 7 interfaces TypeScript pour un typage fort

**Architecture évolutive** permettant des extensions futures (nouvelles intégrations, nouveaux types de fichiers, etc.).

---

## Approche progressive et méthodique — 4 phases

**Méthodologie** : Développement séquentiel avec fondations solides

### Phase 1 — Interface First (création des formulaires)

**Objectif** : Créer et valider les interfaces utilisateur de tous les onglets
- `FormOngletGeneral` → Champs généraux (6 champs éditables et 2 bloqués)
- `FormOngletIntegrations` → Sections Brevo, Zoho, OpenAI
- `FormOngletFichiers` → Upload logo et documents multiples
- Validation visuelle → Vérification UX et cohérence design

**Livrables Phase 1** :
- 3 composants de formulaires complets et fonctionnels visuellement
- Champs avec placeholders et labels appropriés
- Design cohérent avec le design system
- Validation de l'ergonomie avant logique métier

### Phase 2 — Core Infrastructure (hooks de base)

**Objectif** : Créer l'infrastructure de données et de gestion d'état
- `useReseauSelector` → Sélection et recherche des réseaux
- `useReseauFormData` → Hook central de gestion des données
- `useReseauValidation` → Hook de validation métier
- Types et interfaces → Définition des contrats TypeScript

**Livrables Phase 2** :
- Hooks fonctionnels et testés indépendamment
- Sélection de réseau avec recherche opérationnelle
- Structure de données typée et cohérente
- Validation des champs en temps réel

### Phase 3 — Persistence by Tab (sauvegarde par onglet)

**Objectif** : Connecter chaque onglet à la persistance en base
- Onglet Général → Connexion hook et sauvegarde table `reseau`
- Onglet Intégrations → Connexion hooks et sauvegarde tables connexions
- Onglet Fichiers → Création bucket storage et upload sécurisé
- Edge functions → APIs de sauvegarde spécialisées par onglet

**Livrables Phase 3** :
- Chaque onglet entièrement fonctionnel avec persistance
- Bucket storage configuré avec RLS policies
- Edge functions optimisées par cas d'usage
- Tests de bout en bout par section

### Phase 4 — Finalisation et intégration complète

**Objectif** : Assemblage final et optimisations
- `FormReseauGestion` final → Intégration complète des trois onglets
- `GraphBoutonModifier` → Intégration du système d'édition
- Tests complets → Validation de tous les workflows
- Optimisations UX → Messages, toasts, états de chargement

**Livrables Phase 4** :
- Application complète et testée
- Workflows utilisateur fonctionnels
- UX finalisée avec feedbacks appropriés
- Documentation technique finalisée

**Avantages de l'approche Interface First** :
- Visuel et testable → Validation immédiate des interfaces
- Évite l'over-engineering → Hooks créés selon besoins réels
- Itératif → Feedback utilisateur dès la Phase 1
- Modulaire → Phases indépendantes et testables
- Pragmatique → Logique métier adaptée aux contraintes UI
