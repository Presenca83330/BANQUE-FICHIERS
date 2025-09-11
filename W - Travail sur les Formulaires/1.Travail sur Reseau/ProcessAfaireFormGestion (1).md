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
- Passer aux autres onglets (Abonnement, Paramètres)

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
- **Sécurité** : RLS policies pour isolation parfaite par organisation

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
- **Filtrage** : Par organisation_id via get_user_organisation_id()
- **Pattern** : `name LIKE 'reseau-' || org_uuid || '/%'`

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
2. **Policies RLS** pour isolation par organisation
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

**Format d'affichage obligatoire** :
```
{reseau_nom}
{organisation_nom} • {reseau_ville} • Statut: {reseau_statut}
```

**Exemple concret** :
```
Réseau Immobilier Sud
PRESENCA SARL • Marseille • Statut: actif
```

**Données source** : 
- Table principale : `reseau`
- Jointure avec : `organisations` (pour organisation_nom)
- Champs requis : `reseau_nom`, `reseau_ville`, `reseau_statut`, `organisation_nom`

#### 🔍 Fonctionnalité de recherche

**Comportement** :
- Recherche en temps réel (pas de bouton rechercher)
- Filtrage sur : `reseau_nom`, `organisation_nom`, `reseau_ville`
- Recherche insensible à la casse
- Debouncing 300ms pour optimiser les requêtes

**Requête Supabase** :
```javascript
const { data } = await supabase
  .from('reseau')
  .select(`
    reseau_id,
    reseau_nom,
    reseau_ville,
    reseau_statut,
    organisations(organisation_nom)
  `)
  .or(`reseau_nom.ilike.%${searchTerm}%,reseau_ville.ilike.%${searchTerm}%,organisations.organisation_nom.ilike.%${searchTerm}%`)
  .eq('reseau_statut', 'actif')
  .order('reseau_nom');
```

#### ⚙️ Composant technique

**Base component** : Utiliser shadcn `Select` avec customisation
**Props requis** :
- `onValueChange: (reseauId: string) => void` → Déclenche Étape 2
- `placeholder?: string` → Default: "Sélectionner un réseau..."
- `disabled?: boolean` → Pour états de chargement

**État interne** :
- `searchTerm: string` → Terme de recherche actuel
- `isLoading: boolean` → État chargement liste
- `reseaux: ReseauWithOrg[]` → Liste filtrée des réseaux

#### 🎯 Integration dans FormReseauGestion

**Position** : Tout en haut du formulaire, avant les onglets
**Label** : "Réseau à gérer"
**Taille** : Pleine largeur du container
**Espacement** : Margin-bottom pour séparer des onglets

---

## ✅ ÉTAPE 2 - INTÉGRATION CHAMPS VALIDÉE

**Statut** : Option 2 validée - Workflow GraphBoutonModifier défini - Ready pour implémentation

### 🎯 Solution choisie : Mode lecture seule + bouton modifier

**Décision validée** : Option 2 (Lecture seule d'abord) vs Option 1 (Édition directe)

#### 🔄 Workflow complet défini

**1. Sélection réseau (trigger automatique)** :
- Utilisateur sélectionne réseau dans dropdown (Étape 1)
- `onValueChange` déclenche automatiquement `loadReseauData(reseauId)`
- Tous les onglets reçoivent les données complètes du réseau

**2. Affichage lecture seule** :
- TOUS les champs se remplissent automatiquement
- TOUS les champs sont en mode `disabled={true}` (lecture seule)
- Bouton "Modifier" visible dans chaque section (Général, Intégrations, Fichiers)
- Utilisateur peut voir toutes les données mais ne peut pas les modifier

**3. Mode édition (après clic "Modifier")** :
- Clic sur bouton "Modifier" dans une section spécifique
- Les champs de CETTE SECTION deviennent `disabled={false}` (éditables)
- Le bouton "Modifier" disparaît
- Apparition des boutons "Annuler" et "Enregistrer"

**4. Sauvegarde ou annulation** :
- "Enregistrer" → Sauvegarde en base + retour mode lecture seule
- "Annuler" → Reset des champs + retour mode lecture seule

#### 📋 Données à charger par onglet

**ONGLET GÉNÉRAL (table: reseau)** :
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

**ONGLET INTÉGRATIONS (tables: brevo_connexion, zoho_connexion, openai_connexion)** :
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

**ONGLET FICHIERS (table: reseau)** :
```javascript
const filesData = {
  reseau_logo,        // → URL du logo
  reseau_ressources   // → Array des URLs documents
}
```

#### ⚙️ Hook de gestion des données

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

#### 🎮 Intégration GraphBoutonModifier

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

#### 🔄 Requête de chargement complète

**Query Supabase obligatoire** :
```javascript
const loadCompleteReseauData = async (reseauId) => {
  const { data, error } = await supabase
    .from('reseau')
    .select(`
      *,
      organisations(*),
      brevo_connexion(*),
      zoho_connexion(*),
      openai_connexion(*)
    `)
    .eq('reseau_id', reseauId)
    .single();
    
  return data;
};
```

#### 📱 UX Messages

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

### 🎯 Ordre d'implémentation recommandé

1. **Hook useReseauFormData** → Gestion état/données
2. **Composant DropdownReseauSelector** → Sélection réseau  
3. **Integration onglet Général** → Premier cas d'usage
4. **Integration onglets Intégrations + Fichiers** → Completion
5. **Tests et ajustements UX** → Finalisation

---

## 🚀 APPROCHE PROGRESSIVE ET MÉTHODIQUE - 4 PHASES

**Méthodologie validée** : Développement séquentiel avec fondations solides

### PHASE 1 - FONDATIONS (Hooks de base)
**Objectif** : Créer l'infrastructure de base
1. **useReseauSelector** → Sélection/recherche des réseaux
2. **useReseauFormData** → Gestion des données du formulaire  
3. **Types/interfaces de base** → Définition des contrats TypeScript

**Livrables Phase 1** :
- Hook de sélection fonctionnel
- Hook de gestion des données centralisé
- Structure de données typée et cohérente

### PHASE 2 - FORMULAIRE PRINCIPAL (Onglet Général)  
**Objectif** : Premier cas d'usage complet et fonctionnel
1. **useReseauValidation** → Validation des champs
2. **Composant FormReseauGeneral** → Interface utilisateur
3. **Edge function de mise à jour** → Backend de sauvegarde

**Livrables Phase 2** :
- Onglet Général entièrement fonctionnel
- Validation en temps réel
- Sauvegarde sécurisée via API

### PHASE 3 - INTÉGRATIONS (Onglet Intégrations)
**Objectif** : Gestion des connexions API tierces
1. **useReseauIntegrations** → Gestion des connexions API
2. **Composant FormReseauIntegrations** → Interface spécialisée
3. **Edge functions spécialisées** → APIs dédiées par intégration

**Livrables Phase 3** :
- Gestion Brevo/Zoho/OpenAI complète
- Validation des clés API
- Interface intuitive par intégration

### PHASE 4 - FICHIERS & FINALISATION (Onglet Fichiers)
**Objectif** : Upload sécurisé et finalisation du projet
1. **useReseauFiles** → Gestion upload/storage
2. **Migration SQL** → Bucket + policies de sécurité
3. **Composant FormReseauFiles** → Interface d'upload
4. **FormReseauGestion final** → Intégration complète

**Livrables Phase 4** :
- Upload de fichiers sécurisé
- Storage organisé par réseau
- Application complète et testée

### 🎯 Avantages de cette approche
- **Testabilité** : Chaque phase est testable indépendamment
- **Réduction des risques** : Détection précoce des problèmes
- **Feedback continu** : Validation utilisateur à chaque étape
- **Maintenabilité** : Code modulaire et bien structuré

---

## 📊 ANALYSE ARCHITECTURE COMPLÈTE - FormReseauGestion

**Date d'analyse** : Phase d'étude architecture
**Objectif** : Estimation précise des fichiers, hooks et composants nécessaires

### 🎯 SYNTHÈSE QUANTITATIVE

**En plus du fichier principal** `FormReseauGestion.tsx` (qui sera modifié), voici l'architecture complète :

#### 📁 **HOOKS STRATÉGIQUES** → 6 nouveaux fichiers
```
src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/
├── useReseauFormData.ts           → Hook orchestrateur principal
├── useReseauSelector.ts           → Dropdown sélection + recherche  
├── useReseauValidation.ts         → Validation champs par section
├── useReseauFiles.ts              → Upload fichiers + storage
├── useReseauIntegrations.ts       → Gestion Brevo/Zoho/OpenAI
└── types.ts                       → Interfaces TypeScript (modifié)
```

#### 🧩 **COMPOSANTS UI** → 7 nouveaux composants
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

#### 🗄️ **BASE DE DONNÉES** → 1 migration SQL
```
supabase/migrations/
└── [timestamp]_create_storage_bucket_reseau.sql  → Bucket + RLS policies
```

#### ⚡ **EDGE FUNCTIONS** → 3 nouvelles fonctions
```
supabase/functions/
├── update-reseau-general/         → MAJ onglet Général
├── update-reseau-integrations/    → MAJ onglet Intégrations  
└── update-reseau-files/           → MAJ onglet Fichiers + Storage
```

#### 📋 **TYPES TYPESCRIPT** → 7 nouvelles interfaces principales
```typescript
ReseauCompleteData                 → Données réseau avec jointures
ReseauSelectorOption               → Option dropdown sélection
ReseauEditingStates                → États d'édition par section
ReseauValidationErrors             → Erreurs validation
ReseauIntegrationsData             → Données intégrations
ReseauFilesData                    → Données fichiers/storage
ReseauFormSections                 → Sections du formulaire
```

### 🔧 **DÉTAIL FONCTIONNEL PAR HOOK**

#### **1. useReseauFormData** (Hook principal - Complexité: 🔴 Élevée)
**Rôle** : Orchestrateur central - gestion état global
**Responsabilités** :
- Chargement données complètes réseau avec jointures
- Gestion états d'édition par section (général/intégrations/fichiers)
- Coordination sauvegarde multi-tables
- Interface avec tous les autres hooks

**Fonctions exposées** :
```typescript
loadReseauData, updateField, saveSection, cancelEdit, 
toggleEditMode, resetSection
```

#### **2. useReseauSelector** (Complexité: 🟡 Moyenne)
**Rôle** : Dropdown de sélection avec recherche intelligente
**Responsabilités** :
- Recherche temps réel sur reseau_nom, organisation_nom, reseau_ville
- Requête avec jointure organisations
- Debouncing 300ms optimisation
- Formatting affichage items

#### **3. useReseauValidation** (Complexité: 🟡 Moyenne)  
**Rôle** : Validation métier par section
**Responsabilités** :
- Validation champs obligatoires Général
- Validation format API keys Intégrations  
- Validation types fichiers (images/PDF)
- Messages d'erreur contextuels

#### **4. useReseauFiles** (Complexité: 🔴 Élevée)
**Rôle** : Gestion storage multi-fichiers
**Responsabilités** :
- Upload vers bucket storage avec paths calculés
- Gestion logo unique + documents multiples
- Preview fichiers uploadés
- Suppression fichiers + nettoyage storage

#### **5. useReseauIntegrations** (Complexité: 🟡 Moyenne)
**Rôle** : Gestion connexions externes
**Responsabilités** :
- Sauvegarde multi-tables (brevo_connexion, zoho_connexion, openai_connexion)
- Gestion relations FK depuis table reseau
- Test validation connexions API (futur)

### 🎯 **COMPLEXITÉ PAR COMPOSANT**

#### **COMPOSANTS SIMPLES** (🟢 Faible complexité)
- `IntegrationBrevo.tsx` → Formulaire 3 champs
- `IntegrationZoho.tsx` → Formulaire 3 champs  
- `IntegrationOpenAI.tsx` → Formulaire 2 champs

#### **COMPOSANTS MOYENS** (🟡 Moyenne complexité)
- `DropdownReseauSelector.tsx` → Search + formatting
- `FormOngletGeneral.tsx` → 6 champs + champs bloqués
- `FormOngletIntegrations.tsx` → 3 sous-composants

#### **COMPOSANTS COMPLEXES** (🔴 Haute complexité)
- `FormOngletFichiers.tsx` → Upload + preview + storage
- `FormReseauGestion.tsx` → Orchestration complète

### 🗄️ **MIGRATION SQL DÉTAILLÉE**

**Contenu obligatoire** :
```sql
-- Création bucket storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bucket-table-reseau', 'bucket-table-reseau', false);

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

### ⚡ **EDGE FUNCTIONS STRATÉGIQUES**

#### **update-reseau-general**
- MAJ table `reseau` champs général
- Validation SIRET, codes postaux
- Audit log changements

#### **update-reseau-integrations**  
- MAJ tables `brevo_connexion`, `zoho_connexion`, `openai_connexion`
- Gestion relations FK
- Test validation API keys

#### **update-reseau-files**
- Gestion upload storage
- MAJ champs `reseau_logo`, `reseau_ressources`
- Nettoyage fichiers supprimés

### 📈 **ESTIMATION DÉVELOPPEMENT**

**Projet substantiel mais bien structuré** :
- **6 hooks stratégiques** pour architecture modulaire
- **7 composants UI** spécialisés et réutilisables  
- **1 migration storage** avec sécurité RLS complète
- **3 edge functions** pour logique backend
- **7 interfaces TypeScript** pour typage fort

**Architecture évolutive** permettant extensions futures (nouvelles intégrations, nouveaux types fichiers, etc.)