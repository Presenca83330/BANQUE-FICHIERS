# Expérimentation Formulaires - Dossier 0.Graphisme

## 📋 **Contexte** 
Dossier d'expérimentation pour tester l'architecture formulaires mode création/gestion avec sauvegarde par sections.

## 🏗️ **Fichiers d'expérimentation**

### **1. FormAccueil.tsx** 
**Page d'accueil du formulaire** - Sélection du mode
- ✅ 2 boutons : "Création" et "Mise à jour" 
- ✅ Design : Cadre blanc, icônes mauves (Plus/Edit3)
- ✅ Navigation vers FormCreation ou FormGestion
- 🎨 **Composant graphique** : `../../5-Graphisme/1.GraphFormulaires/4.GraphFormAccueil.jsx`

### **2. FormCreation.tsx**
**Formulaire de création simplifié**
- ✅ Mode création uniquement
- ✅ 7 champs obligatoires minimum :
  - Nom, Prénom, Email (table users)
  - Nom organisation (table organisations)  
  - Téléphone, Adresse, SIRET (table reseau)
- ✅ Bouton retour vers FormAccueil

### **3. HookCreation.jsx**
STRUCTURE EN TEST NE SERA PEUT ETRE PAS UTILISEE
- ✅ Structure multi-étapes avec navigation
- ✅ Validation par étape avec schémas configurables
- ✅ Intégration Supabase avec `useSupabaseOperations`
- ✅ Gestion erreurs et loading avec toast
- ✅ Configuration externe via tableMapping/validationSchema
- ✅ Prêt à dupliquer pour les 8 types de formulaires

### **4. HookGestion.jsx** ✅ NOUVEAU
STRUCUTRE EN TEST NE SERA PEUT ETRE PAS UTILISEE
- ✅ Recherche et chargement de comptes existants
- ✅ Édition par section avec états indépendants
- ✅ Validation avant sauvegarde
- ✅ Gestion des données associées (intégrations)
- ✅ Architecture modulaire identique à HookCreation
- ✅ Configuration externe réutilisable
- AJOUT D UNE FONCTION IMPERATIVE  COMPOSANTS DE SÉLECTION SUPABASE

## 📁 **Structure des Fichiers**

```
0.Graphisme/
├── ReadMe.md                    # Cette documentation
├── Pensebete.md                 # Pense-bête technique pour développeur
├── 1.FormAccueil.tsx           # ✅ Page d'accueil (2 boutons mode)
├── 2.FormCreation.tsx          # ✅ Formulaire création (7 champs minimum)  
├── 3.FormGestion.tsx           # ✅ Formulaire gestion avec onglets
│   ├── 🎯 Usage : Recherche, chargement et mise à jour des comptes
│   ├── 🗂️ Onglets : Général, Intégrations, Fichiers
│   ├── 🔧 Édition par section : Bouton "Modifier/Enregistrer" (GraphBoutonModifier)
│   ├── 🔒 Champs protégés : Non modifiables sans activation du mode édition
│   └── ✅ Validation et sauvegarde par section
├── 4.HookCreation.jsx          # ✅ Hook création réutilisable TEST
└── 5.HookGestion.jsx           # ✅ Hook gestion réutilisable TEST
         
```

## 🔄 **Logique d'architecture testée**

### **Mode création/gestion**
- Formulaire unifié avec comportement adaptatif
- Mode détermine : boutons, validation, actions Supabase
- Interface cohérente pour l'admin

### **Séquence de création réseau** (testée dans le hook)
1️⃣ Créer l'organisation → `INSERT INTO organisations`
2️⃣ Créer l'utilisateur admin → `INSERT INTO users` 
3️⃣ Créer le profil utilisateur → `INSERT INTO utilisateurs`
4️⃣ Créer le réseau → `INSERT INTO reseau`
5️⃣ Créer la direction → `INSERT INTO reseau_direction`

### **Champs obligatoires identifiés**
- **users** : nom, prénom, email, users_auth_id
- **organisations** : organisation_nom
- **utilisateurs** : auth_uid, email, organisation_id, type_compte
- **reseau** : nom, adresse, code_postal, ville, téléphone, email, siret (POUR FORM RESEAU)

## 🎯 **Prochaines étapes**

1. **Duplication** : Créer les 8 dossiers avec cette structure
2. **Spécialisation** : Adapter le hook pour chaque type de compte
3. **Tests** : Valider chaque parcours de création
4. **Integration** : Connecter à l'interface principale

## 💡 ****


- ✅ **Architecture modulaire** : Configuration externe via tableMapping/validationSchema
- ✅ **Édition granulaire** : Modification par section avec états indépendants
- ✅ **Validation progressive** : Champs obligatoires et validation par étape
- ✅ **Design unifié** : Tokens sémantiques, composants shadcn
- ✅ **Sécurité RLS** : organisation_id partout, champs protégés par défaut
- ✅ **Intégrations modulaires** : Composants autonomes pour chaque service API

## 🔗 **Système d'Intégrations**

### **Composants d'intégration** - `../../5-Graphisme/6.GraphIntegConnexion/`

**Formulaires concernés** : RÉSEAU, AGENCE, AGENCE INDÉPENDANTE uniquement

#### **1.GraphBrevo.jsx** 
**Intégration email marketing Brevo**
- ✅ 2 champs : `Clé API` (obligatoire), `Email compte` (optionnel)
- ✅ Bouton modifier/enregistrer intégré
- ✅ Non éditable sans activation du mode édition
- 🎯 Utilisation : Automatisation emails prospects/clients

#### **2.GraphZoho.jsx**
**Intégration CRM Zoho**  
- ✅ 3 champs obligatoires : `zoho_api_key`, `zoho_nom_compte`, `zoho_email_compte`
- ✅ Grille 3 colonnes pour optimiser l'espace
- ✅ Bouton modifier/enregistrer intégré
- 🎯 Utilisation : Synchronisation leads et gestion clients

#### **3.GraphOpenAI.jsx**
**Intégration IA générative**
- ✅ 2 champs obligatoires : `openai_api_key`, `openai_email_compte`  
- ✅ Placeholder "sk-..." pour guider la saisie
- ✅ Bouton modifier/enregistrer intégré
- 🎯 Utilisation : Génération automatique de contenus marketing

#### **4.GraphLinkedin.jsx** *(Préparé)*
**Intégration réseau professionnel**
- ✅ 2 champs obligatoires : `linkedin_api_key`, `linkedin_email_compte`
- ✅ Structure identique aux autres intégrations
- 🎯 Utilisation : Publication automatique et prospection B2B

#### **5.GraphFacebook.jsx** *(Préparé)*
**Intégration réseau social**
- ✅ 2 champs obligatoires : `facebook_api_key`, `facebook_email_compte`
- ✅ Structure identique aux autres intégrations  
- 🎯 Utilisation : Campagnes publicitaires et engagement social

#### **6.GraphInstagram.jsx** *(Préparé)*
**Intégration réseau visuel**
- ✅ 2 champs obligatoires : `instagram_api_key`, `instagram_email_compte`
- ✅ Structure identique aux autres intégrations
- 🎯 Utilisation : Marketing visuel et stories automatisées

### **Implémentation dans FormGestion.tsx**

```jsx
// Import des composants d'intégration
import GraphBrevo from '../../5-Graphisme/6.GraphIntegConnexion/1.GraphBrevo';
import GraphZoho from '../../5-Graphisme/6.GraphIntegConnexion/2.GraphZoho';
import GraphOpenAI from '../../5-Graphisme/6.GraphIntegConnexion/3.GraphOpenAI';

// Intégration dans l'onglet "Intégrations"
<TabsContent value="integrations" className="space-y-6">
  <GraphBrevo 
    onSave={(brevoData) => console.log('Sauvegarde Brevo:', brevoData)}
    onCancel={() => console.log('Annulation Brevo')}
  />
  <GraphZoho 
    onSave={(zohoData) => console.log('Sauvegarde Zoho:', zohoData)}
    onCancel={() => console.log('Annulation Zoho')}
  />
  <GraphOpenAI 
    onSave={(openaiData) => console.log('Sauvegarde OpenAI:', openaiData)}
    onCancel={() => console.log('Annulation OpenAI')}
  />
</TabsContent>
```

### **Logique commune des intégrations**

#### **État et gestion des données**
```jsx
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
  // Champs spécifiques à chaque intégration
});
```

#### **Fonctions de callback**
- `onSave()` : Sauvegarde des données d'intégration
- `onCancel()` : Annulation des modifications
- `onEditingChange()` : Contrôle du mode édition

#### **Sécurité et validation**
- Champs désactivés par défaut (`disabled={!isEditing}`)
- Activation uniquement via bouton "Modifier"
- Validation obligatoire pour clés API critiques
- Sauvegarde sécurisée avec gestion d'erreurs

### **Architecture modulaire**

- ✅ **Composants autonomes** : Chaque intégration = composant indépendant
- ✅ **Réutilisabilité** : Structure identique pour toutes les intégrations
- ✅ **Maintenabilité** : Un fichier par service d'intégration
- ✅ **Évolutivité** : Facile d'ajouter de nouvelles intégrations
- ✅ **Interface unifiée** : Même UX pour toutes les intégrations

## 📁 **Section Fichiers**

### **Gestion des ressources visuelles** - Onglet "Fichiers"

**Formulaires concernés** : RÉSEAU, AGENCE, AGENCE INDÉPENDANTE uniquement (formulaires à onglets)

#### **Structure de la section**
- ✅ **Interface cohérente** : Même design que les autres sections (Card + CardHeader + CardContent)
- ✅ **Bouton modifier/enregistrer** : `GraphBoutonModifier` intégré dans le header
- ✅ **Champs protégés** : `disabled={!isEditingFichiers}` - Non modifiables sans activation
- ✅ **État indépendant** : `isEditingFichiers` séparé des autres sections

#### **Champs disponibles**
```jsx
// Champs de fichiers dans formData
reseau_logo: [],      // Logo de l'agence (URL ou chemin)
reseau_fichier: []    // Ressources diverses (liens)
```

#### **Implémentation technique**
```jsx
// État de la section
const [isEditingFichiers, setIsEditingFichiers] = useState(false);

// Structure de la section
<Card>
  <CardHeader>
    <div className="flex justify-between items-center">
      <CardTitle className="text-2xl font-bold">Fichiers</CardTitle>
      <GraphBoutonModifier 
        onSave={() => console.log('Sauvegarde fichiers:', formData.reseau_logo, formData.reseau_fichier)}
        onCancel={() => console.log('Annulation modifications fichiers')}
        onEditingChange={setIsEditingFichiers}
      />
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="reseau_logo">Logo de l'agence</Label>
        <Input 
          id="reseau_logo" 
          value={formData.reseau_logo} 
          onChange={e => handleInputChange('reseau_logo', e.target.value)}
          placeholder="URL ou chemin du logo" 
          disabled={!isEditingFichiers}
        />
      </div>
      <div>
        <Label htmlFor="reseau_fichier">Ressources</Label>
        <Input 
          value={formData.reseau_fichier} 
          onChange={e => handleInputChange('reseau_fichier', e.target.value)}
          placeholder="Liens vers les ressources" 
          disabled={!isEditingFichiers}
        />
      </div>
    </div>
  </CardContent>
</Card>
```

#### **Utilisation et objectif**
- 🎯 **Logo agence** : URL ou chemin vers le logo pour la marque visuelle
- 🎯 **Ressources** : Liens vers documents, images, ressources marketing
- 🔐 **Sécurité** : Champs verrouillés par défaut, modification contrôlée
- 🎨 **Responsive** : Grille adaptative (1 colonne mobile, 2 colonnes desktop)

#### **Logique métier**
- ✅ **Scope limité** : Uniquement pour entités avec identité visuelle (RÉSEAU/AGENCE)
- ✅ **Gestion indépendante** : Section autonome avec son propre état d'édition
- ✅ **Validation future** : Prêt pour validation URL/format de fichiers
- ✅ **Extension possible** : Structure prête pour upload de fichiers

### **Architecture des sections à onglets**

#### **Pattern unifié pour tous les onglets**
1. **État indépendant** : `isEditing[SectionName]` pour chaque section
2. **Bouton intégré** : `GraphBoutonModifier` dans chaque CardHeader  
3. **Champs protégés** : `disabled={!isEditing[SectionName]}` sur tous les inputs
4. **Callbacks configurables** : `onSave()` et `onCancel()` spécifiques par section

#### **Sections actuelles**
- ✅ **Général** : Informations de base (`isEditingGeneral`)
- ✅ **Intégrations** : Composants API modulaires (état interne à chaque composant)
- ✅ **Fichiers** : Ressources visuelles (`isEditingFichiers`)

#### **Avantages de cette architecture**
- 🔒 **Sécurité** : Modification contrôlée section par section
- 🎯 **UX optimisée** : Utilisateur modifie uniquement ce qui l'intéresse
- 🔧 **Maintenabilité** : Chaque section indépendante et testable
- 📱 **Responsive** : Interface adaptée à tous les écrans

---

---

## 🔧 **ARCHITECTURE DES HOOKS**
ATTENTION ARCHITECTURE EN TEST / PROCESS PAS ENCORE VALIDE DEFINITIVEMENT

### **Hook useCreationCompte (4.HookCreation.jsx)**
**Responsabilité** : Gestion complète du processus de création de comptes

#### **Fonctionnalités principales**
- 🏗️ **Multi-étapes** : Navigation contrôlée entre étapes de création
- ✅ **Validation progressive** : Validation par étape avec schémas configurables
- 💾 **Création multi-tables** : INSERT coordonné dans plusieurs tables Supabase
- 🔄 **États centralisés** : `currentStep`, `formData`, `isLoading`, `errors`
- 🛡️ **Gestion d'erreurs** : Toast automatiques et rollback en cas d'échec

#### **Configuration type**
```jsx
const config = {
  tableMapping: {
    main: 'reseau',                  // Table principale
    related: {                       // Tables associées
      organisation: 'organisations',
      user: 'users',
      profile: 'utilisateurs'
    }
  },
  validationSchema: {                // Validation par étape
    1: z.object({ nom: z.string().min(2), email: z.string().email() }),
    2: z.object({ telephone: z.string().regex(/^0[1-9]/) })
  },
  defaultValues: { /* valeurs par défaut */ },
  onSuccess: (data) => { /* callback succès */ },
  onError: (error) => { /* callback erreur */ }
};
```

#### **Actions disponibles**
- `updateFormData(field, value)` : Mise à jour d'un champ
- `goToNextStep()` : Validation et passage à l'étape suivante
- `goToPreviousStep()` : Retour à l'étape précédente
- `submitForm()` : Validation finale et création en base
- `resetForm()` : Réinitialisation complète

### **Hook useGestionCompte (5.HookGestion.jsx)**
**Responsabilité** : Gestion complète des opérations de mise à jour de comptes existants

#### **Fonctionnalités principales**
- 🔍 **Recherche intelligente** : Recherche de comptes avec debounce automatique
- 📝 **Édition granulaire** : Modification par section avec états indépendants
- 🔒 **Sécurité renforcée** : Champs protégés par défaut, activation contrôlée
- 💾 **Sauvegarde ciblée** : UPDATE par section avec validation préalable
- 🔗 **Données associées** : Chargement automatique des intégrations/relations

#### **Configuration type**
```jsx
const config = {
  tableMapping: {
    main: 'reseau',                  // Table principale à gérer
    related: {                       // Tables associées à charger
      integrations: 'brevo_connexion',
      files: 'reseau_files'
    }
  },
  validationSchema: {                // Validation par section
    general: z.object({ nom: z.string().min(2) }),
    fichiers: z.object({ logo: z.string().url().optional() })
  },
  searchField: 'reseau_nom',         // Champ de recherche
  idField: 'reseau_id',              // Champ ID principal
  defaultValues: { /* valeurs par défaut */ },
  onSuccess: (data) => { /* callback succès */ },
  onError: (error) => { /* callback erreur */ }
};
```

#### **États d'édition**
```jsx
// États indépendants par section
editingStates: {
  general: false,      // Section informations générales
  integrations: false, // Section intégrations API
  fichiers: false      // Section fichiers/ressources
}
```

#### **Actions disponibles**
- `searchAccounts(term)` : Recherche de comptes par terme
- `loadAccountData(accountId)` : Chargement complet d'un compte
- `updateFormData(field, value)` : Mise à jour d'un champ
- `toggleEditMode(section)` : Activation/désactivation édition d'une section
- `saveSection(section)` : Validation et sauvegarde d'une section
- `cancelEdit(section)` : Annulation des modifications d'une section
- `resetForm()` : Réinitialisation complète

#### **Gestion de la recherche**
- ⚡ **Debounce automatique** : Recherche lancée après 300ms d'inactivité
- 🔍 **Filtrage intelligent** : Minimum 2 caractères pour déclencher la recherche
- 📊 **Résultats en temps réel** : `searchResults` mis à jour automatiquement
- 🔄 **État de chargement** : `isSearching` pour feedback utilisateur

### **Avantages de cette architecture**

#### **Réutilisabilité maximale**
- 🔧 **Configuration externe** : Même hook pour tous types de comptes
- 📋 **Schémas modulaires** : Validation adaptée selon le contexte
- 🎯 **Actions génériques** : Logique métier centralisée et réutilisable

#### **Maintenabilité optimale**
- 🗂️ **Séparation des responsabilités** : Création vs Gestion
- 🧩 **Composabilité** : Hooks combinables selon les besoins
- 🔍 **Debugging facilité** : États et actions clairement identifiés

#### **Sécurité intégrée**
- 🛡️ **Validation systématique** : Schémas Zod pour toutes les données
- 🔒 **Permissions granulaires** : RLS + états d'édition contrôlés
- 📝 **Audit automatique** : Traçabilité via `useSupabaseOperations`

---

## 🔍 **COMPOSANTS DE SÉLECTION SUPABASE**

### **Architecture de sélection dans les pages Gestion**

**NOUVEAU PATTERN** : Composant de sélection en haut des pages gestion pour choisir l'enregistrement à modifier

#### **Structure de référence** : `../../5-Graphisme/7.GraphSelectiondansSupabase/1.SelectReseau.jsx`

**Fonctionnalités du composant de sélection** :
- ✅ **Recherche intelligente** : Input avec debounce pour rechercher dans la table
- ✅ **Dropdown dynamique** : Liste des résultats avec nom et informations clés
- ✅ **Sélection rapide** : Click pour charger automatiquement l'enregistrement
- ✅ **Intégration hooks** : Connexion directe avec les hooks stratégiques
- ✅ **Design cohérent** : Utilisation du design system PRESENCA

#### **Pattern d'utilisation** :
```jsx
// En haut de chaque FormGestion.tsx
import SelectReseau from '../../5-Graphisme/7.GraphSelectiondansSupabase/1.SelectReseau';

// Intégration dans le composant
<div className="mb-6">
  <SelectReseau 
    onSelect={(selectedData) => {
      // Charger les données sélectionnées dans le formulaire
      loadAccountData(selectedData.id);
    }}
    placeholder="Rechercher un réseau..."
  />
</div>
```

#### **Composants à créer pour chaque table** :
- `1.SelectReseau.jsx` ✅ (structure de référence)
- `2.SelectAgence.jsx` → Recherche dans table `agence`
- `3.SelectAgenceIndependante.jsx` → Recherche dans table `agence_independante`
- `4.SelectDirectionTemporaire.jsx` → Recherche dans table `direction_temporaire`
- `5.SelectResponsableZone.jsx` → Recherche dans table `responsable_zone`
- `6.SelectResponsableCollaborateur.jsx` → Recherche dans table `responsable_collaborateur`
- `7.SelectCollaborateur.jsx` → Recherche dans table `collaborateur`
- `8.SelectAgenceIndependanteCollaborateur.jsx` → Recherche dans table `agence_independante_collaborateur`

#### **Intégration avec hooks stratégiques** :
- ✅ **Connexion automatique** : Chaque SelectComponent utilise les hooks du dossier `HOOKS-STRATEGIQUE`
- ✅ **Données temps réel** : Requêtes Supabase avec RLS et sécurité
- ✅ **Performance optimisée** : Debounce, cache, et pagination automatique
- ✅ **Gestion d'erreurs** : Toast et fallbacks intégrés

#### **Structure technique du composant** :
```jsx
const SelectReseau = ({ onSelect, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchReseau, isLoading } = useReseauSearch(); // Hook stratégique

  // Logique de recherche avec debounce
  // Affichage dropdown avec résultats
  // Sélection et callback vers parent
  
  return (
    <Card className="relative">
      {/* Input de recherche */}
      {/* Dropdown des résultats */}
      {/* Loading et états d'erreur */}
    </Card>
  );
};
```

---

### **🧠 Notes importantes pour développeur**

#### **Scope des formulaires à onglets**
**ARCHITECTURE COMPLEXE** = RÉSEAU, AGENCE, AGENCE INDÉPENDANTE uniquement
- FormGestion.tsx avec onglets → Entités avec identité visuelle et intégrations
- Autres types (collaborateurs, responsables) → Formulaires simples sans onglets
- Section "Fichiers" et "Intégrations" limitées aux entités complexes

#### **Pattern d'utilisation recommandé**
1. **Analyse du besoin** : Création simple ou gestion complexe ?
2. **Choix du hook** : `useCreationCompte` ou `useGestionCompte`
3. **Configuration** : tableMapping + validationSchema adaptés
4. **Composants** : Réutilisation des composants graphiques existants
5. **Sélection Supabase** : Ajouter le composant de sélection approprié en haut des pages gestion
