# 📋 BIBLE DES RÉFÉRENCES - PHASE 1 : ÉTAPES 1 À 5
## Inventaire Exhaustif de l'Application LeadGenAI AdBuilder
---

## Objectif du Document
- Ce document **centralise TOUTES les références exactes** pour la migration des données `localStorage` vers la table Supabase `etapes_1to5` (Phase 1 : Étapes 1 à 5).
---
## Règle Absolue
- Tous les noms de champs, types, contraintes et mappings listés ici sont ceux actuellement utilisées par l'application dans ses champs, ses fonctions, ses hooks, ses composants localstorage
  - Il n'est fait aucune extrapolation de migration ou de codes à créer
  - Il est uniquement destiné à faire l'etat des lieux de tout ce qui est utilisé par l'application dans la phase 1
  - Ce document servira de source de travail pour préparer dans un autre document la stratégie de migration
  - Toute extrapolation ou afffirmation sans vérfication est interdite
---
## Ressources et Actions Impératives à consulter et à faire pour préparer ce document
- **Documents stratégiques**
  - public/1. Documents Stratégiques/01. Présentation LeadGenAi.md
  - public/1. Documents Stratégiques/02. Présentation Structure LeadGenAi.md
  - public/1. Documents Stratégiques/03. Logique Organisations.md
  - public/1. Documents Stratégiques/04. Relations Business entre Tables.md
  - public/1. Documents Stratégiques/05. Relations Users Utilisateurs.md
  - public/1. Documents Stratégiques/06. Référence des Hooks Stratégiques.md
  - public/1. Documents Stratégiques/07.1. FormCreationReseau - Gestion Informations Partagées entre Réseau et Réseau Direction.md
  - public/1. Documents Stratégiques/07.2. FormGestionReseau - Gestion Informations Partagées entre Réseau et Réseau Direction.md
  - public/1. Documents Stratégiques/08. Gestion du Menu Gauche.md
  - public/1. Documents Stratégiques/09. Structure - Organisation | Client_id.md
  - public/1. Documents Stratégiques/10. Structure des Tables de Connexion & Règles Collaborateurs.md
- **Audit des etapes 1 à 5**
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/01.Etape1.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/02.Etape2.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/03.Etape3.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/04.Etape4.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/05.Etape5.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/06.Etape5animation.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/07.BilanEtape1aEtape5.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/08.ProcessEnvoiInfosOpenAI.md
  - public/4. ReadMe EtapesAnnonces/01.Etape1à5/09.ProcessPassageEtapeSuivante.md
- **Analyse compléte et méticuleuse de tous les fichiers de l'application et du traitement de la phase 1**
  - Analyse de tous les fichiers concernés à partir de l'étape 1 jusqu 'à l'envoi des prompts à Open AI**
---
## Directives strictes de rédaction
- **Analyser TOUS les fichiers des étapes 1 à 5**
  - Lister TOUS les composants, hooks, fonctions utilisés
  - Identifier TOUTES les clés localStorage avec leur format exact
  - Documenter TOUS les champs de formulaire avec leurs contraintes
  - Répertorier TOUS les prompts OpenAI et leurs placeholders
  - Créer des tableaux récapitulatifs exhaustifs
- **Interdictions**
  - Parler de migration
  - Proposer du SQL ou des hooks Supabase
  - Extrapoler ou imaginer
- **Schéma attendu**
  - Privilégier la présentation sous forme de tableau pour mettre en évidence tous les éléments
  - Prévilégier une séquence par étape pour bien comprendre le fonctionnement de chacune d'entre elle
  - Jusqu'à la rédaction des prompts
- 

## 📌 SOMMAIRE

1. [Vue d'ensemble de la Phase 1](#1-vue-densemble-de-la-phase-1)
2. [Étape 1 - Éléments Clés](#2-étape-1---éléments-clés)
3. [Étape 2 - Informations de Description](#3-étape-2---informations-de-description)
4. [Étape 3 - Informations Financières](#4-étape-3---informations-financières)
5. [Étape 4 - Autres Détails](#5-étape-4---autres-détails)
6. [Étape 5 - Validation et Génération](#6-étape-5---validation-et-génération)
7. [Animation de Génération](#7-animation-de-génération)
8. [Composants Réutilisables](#8-composants-réutilisables)
9. [Hooks et Utilitaires](#9-hooks-et-utilitaires)
10. [Services OpenAI et Prompts](#10-services-openai-et-prompts)
11. [Tableau Récapitulatif des Clés LocalStorage](#11-tableau-récapitulatif-des-clés-localstorage)
12. [Tableau Complet des Prompts OpenAI](#12-tableau-complet-des-prompts-openai)
13. [Navigation et Flux](#13-navigation-et-flux)

---

## 1. VUE D'ENSEMBLE DE LA PHASE 1

### 1.1. Objectif de la Phase 1
La Phase 1 consiste à **collecter toutes les données nécessaires** pour la génération d'annonces immobilières commerciales et d'outils SEO via l'IA OpenAI, en **4 étapes de saisie** suivies d'une **étape de validation et génération**.

### 1.2. Schéma du Flux de Phase 1

| Étape | Nom | Route | Composant Principal | Objectif |
|-------|-----|-------|---------------------|----------|
| **1** | Éléments Clés | `/etape1` | `EnsembleFormulairesEtape1Form` | Collecter les informations essentielles (agence, type de bien, prix, arguments commerciaux) |
| **2** | Informations de Description | `/etape2` | `SaisieDescriptionForm` | Collecter la description détaillée du bien |
| **3** | Informations Financières | `/etape3` | `SaisieFinancialForm` | Collecter les données financières et potentiel |
| **4** | Autres Détails | `/etape4` | `SaisieDetailsForm` | Collecter des informations complémentaires optionnelles |
| **5** | Validation et Génération | `/etape5` | Bouton de génération | Lancer la génération des annonces via OpenAI |
| **5 anim** | Animation | `/etape5/animation` | `Animation` | Afficher la progression de la génération |

---

## 2. ÉTAPE 1 - ÉLÉMENTS CLÉS

### 2.1. Fichiers Utilisés - Étape 1

| Fichier | Chemin | Type | Responsabilité |
|---------|--------|------|----------------|
| **Etape1.tsx** | `src/1.etapes-generation-annonces/etape1/Etape1.tsx` | Page | Page principale de l'étape 1, conteneur et layout |
| **EnsembleFormulairesEtape1Form.tsx** | `src/components/1-Sources-Generation-Annonces/form-etape1/EnsembleFormulairesEtape1Form.tsx` | Composant Formulaire | Gestion du formulaire complet de l'étape 1, états locaux, validation |
| **TextFieldForm.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/TextFieldForm.tsx` | Composant Champ | Champ de texte simple avec capitalisation automatique |
| **MonetaryFieldForm.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/MonetaryFieldForm.tsx` | Composant Champ | Champ monétaire avec formatage automatique (espaces, €) |
| **SelectionButtonRond.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/SelectionButtonRond.tsx` | Composant Champ | Boutons radio ronds pour sélection unique |
| **FormulaireSaisie.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/FormulaireSaisie.tsx` | Composant Champ | Textarea avec auto-expand, puces automatiques, capitalisation |
| **BoutonValiderInformations.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/BoutonValiderInformations.tsx` | Composant Bouton | Bouton de validation des informations |
| **SgaHelpBox.tsx** | `src/components/1-Sources-Generation-Annonces/help/SgaHelpBox.tsx` | Composant Aide | Boîte d'aide avec icône et contenu personnalisé |
| **EtapeFAQ.tsx** | `src/components/1-Sources-Generation-Annonces/help/EtapeFAQ.tsx` | Composant Aide | FAQ contextuelle par étape |
| **DirectivesMenuOnglet.tsx** | `src/components/atemplate.v2.generation-annonces/DirectivesMenuOnglet.tsx` | Composant Navigation | Menu de navigation entre les étapes avec statuts |
| **useStepProgress.ts** | `src/components/1-Sources-Generation-Annonces/utils/useStepProgress.ts` | Hook | Gestion de la progression des étapes, localStorage `stepProgress` |
| **openai.ts** | `src/services/openai.ts` | Service | Fonctions `updatePropertyData`, `getPropertyDataFromStorage` |

### 2.2. Clés localStorage Utilisées - Étape 1

| Clé localStorage | Créée par | Contenu | Format | Utilisée par |
|------------------|-----------|---------|--------|--------------|
| **`propertyData`** | `updatePropertyData()` (openai.ts) | Données complètes du bien (étapes 1-4) | JSON stringifié | Tous les formulaires, tous les services OpenAI |
| **`stepProgress`** | `useStepProgress` | Progression des étapes disponibles | JSON: `{availableSteps: number[], hasCompletedStep4: boolean}` | Navigation, Menu d'onglets |

### 2.3. États Locaux (States) - EnsembleFormulairesEtape1Form

| État | Type | Valeur par défaut | Utilisation |
|------|------|-------------------|-------------|
| `agencyName` | `string` | `""` | Nom de l'agence immobilière |
| `reference` | `string` | `""` | Référence du bien |
| `exclusivite` | `string` | `"Non"` | "Oui" ou "Non" |
| `location` | `string` | `""` | Emplacement du bien |
| `propertyType` | `string` | `""` | Type de bien (restaurant, commerce, etc.) |
| `saleType` | `string` | `"à vendre"` | "à vendre" ou "à louer" |
| `price` | `string` | `""` | Prix FAI (si à vendre) |
| `rentAmount` | `string` | `""` | Loyer HT/HC (si à louer) |
| `rentPeriodicity` | `string` | `"Mensuel"` | "Mensuel", "Trimestriel", ou "Annuel" |
| `keyElements` | `string` | `""` | Arguments commerciaux (textarea avec puces) |

### 2.4. Champs de Formulaire - Étape 1

| Champ | Composant | Props | Type d'input | Règles de validation | Contraintes métier | Formatage auto |
|-------|-----------|-------|--------------|----------------------|-------------------|----------------|
| **Nom de l'Agence** | `TextFieldForm` | `id="agencyName"`, `required=true` | Texte simple | Obligatoire, non vide | - | Capitalisation 1ère lettre |
| **Référence** | `TextFieldForm` | `id="reference"`, `required=true` | Texte simple | Obligatoire, non vide | - | Capitalisation 1ère lettre |
| **Exclusivité** | `SelectionButtonRond` | Options: "Oui"/"Non" | Boutons radio | - | Utilisé uniquement si "Oui" dans prompts | - |
| **Emplacement** | `TextFieldForm` | `id="location"`, `required=true` | Texte simple | Obligatoire, non vide | Orientation SEO (ville, arrondissement) | Capitalisation 1ère lettre |
| **Type de bien** | `TextFieldForm` | `id="propertyType"`, `required=true` | Texte simple | Obligatoire, non vide | Mot-clé principal SEO | Capitalisation 1ère lettre |
| **Type de transaction** | `SelectionButtonRond` | Options: "à vendre"/"à louer" | Boutons radio | - | Conditionne affichage Prix ou Loyer | - |
| **Prix FAI** | `MonetaryFieldForm` | `id="price"`, `currency="€"` | Numérique formaté | Obligatoire si `saleType="à vendre"` | Prix FAI sans symbole dans prompt | Format: `450 000€` (espaces séparateurs) |
| **Loyer HT/HC** | `MonetaryFieldForm` | `id="rentAmount"`, `currency="€"` | Numérique formaté | Obligatoire si `saleType="à louer"` | Montant HT/HC | Format: `1 200€` |
| **Périodicité du loyer** | `SelectionButtonRond` | Options: "Mensuel"/"Trimestriel"/"Annuel" | Boutons radio | - | Affiché uniquement si location | - |
| **Arguments commerciaux** | `FormulaireSaisie` | `id="keyElements"`, `minRows=8`, `required=true` | Textarea | Obligatoire, non vide | Points forts pour IA (titres, accroches, CTA) | Puces automatiques `•`, capitalisation après puce, auto-expand |

### 2.5. Contraintes Graphiques - Étape 1

| Élément | Style | Hauteur/Taille | Couleur | Comportement |
|---------|-------|----------------|---------|--------------|
| **Label** | Font 14px, Bold 700, `#000000` | - | Noir | Espacement bas 2px |
| **Input/Textarea** | Font 14px, Medium 500, `#515151` | Input: 42px, Textarea: auto | Border `#B8C8DC`, Focus `#5E50A6` | Focus: ring 2px |
| **Placeholder** | Font 14px, `#515151` | - | Gris moyen | - |
| **Bouton Valider** | Gradient `#4C1D96` → `#6C28D8`, Font 18px Bold | 70px | Blanc sur mauve | Hover: scale 1.05, gradient shift |
| **Requis (*)** | Font 14px, `#515151` (gris) ou `#FF0000` (rouge selon composant) | - | Gris/Rouge | Affiché si `required=true` |

### 2.6. Fonction de Validation - Étape 1

| Nom | Fichier | Déclencheur | Règles | Actions en cas de succès | Actions en cas d'échec |
|-----|---------|-------------|--------|-------------------------|----------------------|
| **`handleValidation()`** | `EnsembleFormulairesEtape1Form.tsx` | Clic sur "Valider mes informations" | 1. `agencyName` non vide2. `reference` non vide3. `location` non vide4. `propertyType` non vide5. Si `saleType="à vendre"` → `price` non vide6. Si `saleType="à louer"` → `rentAmount` non vide7. `keyElements` non vide | 1. Appel `updatePropertyData(etape1Data)`2. Toast succès3. Appel `completeStep(1)`4. Navigation → `/etape2` | Toast erreur avec message spécifique au champ manquant |

### 2.7. Soumission Formulaire - Étape 1

| Fonction | Déclencheur | Actions |
|----------|-------------|---------|
| **`handleFormSubmit()`** | Clic bouton "Valider mes informations" | 1. Appel `handleValidation()`2. Si succès: `completeStep(1)` + `navigate("/etape2")` |

### 2.8. Chargement des Données - Étape 1

| Fonction | Hook | Actions |
|----------|------|---------|
| **`loadData()`** | `useEffect([])` au montage | 1. Appel `getPropertyDataFromStorage()`2. Remplissage de tous les états locaux avec les données sauvegardées3. Écoute événement `focus` pour recharger si changement de page |

### 2.9. Contenu d'Aide - Étape 1

| Zone d'aide | Titre | Contenu | Icône |
|-------------|-------|---------|-------|
| **SgaHelpBox** | "Arguments commerciaux" | Explication des arguments commerciaux, importance pour l'IA, conseils de rédaction | Lightbulb (ampoule) `#FFBF00` |
| **EtapeFAQ** | "Quelles informations intégrer ?" | Définitions: Type de bien, Emplacement, Prix FAI, Loyer + Note "Plus d'infos = annonce + percutante" | HelpCircle `#FFBF00` |
| **Box conseil** | "Pour bien franchir cette 1ère étape" | "Consultez nos cartes conseils : Quelles informations intégrer ? / Arguments commerciaux" | - |

---

## 3. ÉTAPE 2 - INFORMATIONS DE DESCRIPTION

### 3.1. Fichiers Utilisés - Étape 2

| Fichier | Chemin | Type | Responsabilité |
|---------|--------|------|----------------|
| **Etape2.tsx** | `src/1.etapes-generation-annonces/etape2/Etape2.tsx` | Page | Page principale de l'étape 2 |
| **SaisieDescriptionForm.tsx** | `src/components/1-Sources-Generation-Annonces/form-etape2/SaisieDescriptionForm.tsx` | Composant Formulaire | Formulaire de saisie de la description détaillée |
| **FormulaireSaisie.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/FormulaireSaisie.tsx` | Composant Champ | Textarea avec formatage automatique |
| **BoutonValiderInformations.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/BoutonValiderInformations.tsx` | Composant Bouton | Bouton de validation |
| **SgaHelpBox.tsx** | `src/components/1-Sources-Generation-Annonces/help/SgaHelpBox.tsx` | Composant Aide | Aide contextuelle |

### 3.2. Clés localStorage Utilisées - Étape 2

| Clé localStorage | Créée par | Contenu | Utilisation |
|------------------|-----------|---------|-------------|
| **`propertyData`** | `updatePropertyData()` | Objet avec `propertyDescription` ajouté | Stockage de la description |

### 3.3. États Locaux - SaisieDescriptionForm

| État | Type | Valeur par défaut | Utilisation |
|------|------|-------------------|-------------|
| `propertyDescription` | `string` | `""` | Description détaillée du bien |

### 3.4. Champs de Formulaire - Étape 2

| Champ | Composant | Props | Type d'input | Règles | Contraintes métier | Formatage |
|-------|-----------|-------|--------------|--------|-------------------|-----------|
| **Informations de description** | `FormulaireSaisie` | `id="propertyDescription"`, `minRows=10`, `required=true` | Textarea | Obligatoire, non vide | Détails: emplacement, superficie, activité, clientèle, intérieur, capacité, équipements, infrastructures | Puces `•`, capitalisation, auto-expand |

### 3.5. Fonction de Validation - Étape 2

| Nom | Actions | Succès | Échec |
|-----|---------|--------|-------|
| **`handleValidation()`** | Vérifie `propertyDescription` non vide | `updatePropertyData({propertyDescription})` + toast + `completeStep(2)` + `navigate("/etape3")` | Toast erreur |

### 3.6. Fonction de Retour Arrière - Étape 2

| Nom | Déclencheur | Actions |
|-----|-------------|---------|
| **`handleBackToEtape5()`** | Clic carte "Infos de Description" depuis étape 5 | Sauvegarde données si modifiées + `navigate("/etape5")` |

### 3.7. Chargement des Données - Étape 2

| Hook | Actions |
|------|---------|
| `useEffect([])` | 1. `getPropertyDataFromStorage()`2. `setPropertyDescription(data.propertyDescription || "")` |

### 3.8. Contenu d'Aide - Étape 2

| Zone | Titre | Contenu | Icône |
|------|-------|---------|-------|
| **SgaHelpBox** | "Description du bien" | Conseils détaillés pour la description | Lightbulb |
| **EtapeFAQ** | "Quelles informations intégrer ?" | Liste: Emplacement, Surface, Activité, Clientèle, Intérieur, Capacité, Équipements, Infrastructures, Autres | FileText `#FFBF00` |

---

## 4. ÉTAPE 3 - INFORMATIONS FINANCIÈRES

### 4.1. Fichiers Utilisés - Étape 3

| Fichier | Chemin | Type | Responsabilité |
|---------|--------|------|----------------|
| **Etape3.tsx** | `src/1.etapes-generation-annonces/etape3/Etape3.tsx` | Page | Page principale de l'étape 3 |
| **SaisieFinancialForm.tsx** | `src/components/1-Sources-Generation-Annonces/form-etape3/SaisieFinancialForm.tsx` | Composant Formulaire | Formulaire des données financières |
| **FormulaireSaisie.tsx** | Réutilisé | Composant Champ | Textarea formaté |

### 4.2. Clés localStorage - Étape 3

| Clé | Contenu ajouté |
|-----|---------------|
| **`propertyData`** | `financials` (string) |

### 4.3. États Locaux - SaisieFinancialForm

| État | Type | Utilisation |
|------|------|-------------|
| `financials` | `string` | Informations financières |

### 4.4. Champs - Étape 3

| Champ | Contraintes métier |
|-------|--------------------|
| **Informations Financières** | Conditions locatives (bail, loyer, échéance), Données financières (CA, bénéfice), Potentiel de développement, Données personnel |

### 4.5. Validation - Étape 3

| Fonction | Succès |
|----------|--------|
| **`handleValidation()`** | `updatePropertyData({financials})` + `completeStep(3)` + `navigate("/etape4")` |

### 4.6. Contenu d'Aide - Étape 3

| Zone | Icône | Contenu clé |
|------|-------|-------------|
| **EtapeFAQ** | Calculator `#FFBF00` | Conditions locatives, Données financières, Potentiel développement |

---

## 5. ÉTAPE 4 - AUTRES DÉTAILS

### 5.1. Fichiers Utilisés - Étape 4

| Fichier | Responsabilité |
|---------|----------------|
| **Etape4.tsx** | Page étape 4 |
| **SaisieDetailsForm.tsx** | Formulaire détails complémentaires |

### 5.2. Clés localStorage - Étape 4

| Clé | Contenu ajouté |
|-----|---------------|
| **`propertyData`** | `details` (string), `hasNoDetails` (boolean) |

### 5.3. États Locaux - SaisieDetailsForm

| État | Type | Utilisation |
|------|------|-------------|
| `details` | `string` | Informations complémentaires |
| `hasNoDetails` | `boolean` | Checkbox "Je n'ai pas d'informations complémentaires" |

### 5.4. Champs - Étape 4

| Champ | Composant | Contraintes |
|-------|-----------|-------------|
| **Checkbox** | `input[type="checkbox"]` | Si coché → `hasNoDetails=true` + `details=""` + textarea en `readOnly` |
| **Autres Détails** | `FormulaireSaisie` | Optionnel, horaires, fermeture, conditions exploitation |

### 5.5. Validation - Étape 4

| Fonction | Actions |
|----------|---------|
| **`handleValidation()`** | `updatePropertyData({details, hasNoDetails})` + `completeStep(4)` + `navigate("/resultats")` **(note: /resultats n'existe pas dans le code actuel, devrait être `/etape5`)** |

### 5.6. Contenu d'Aide - Étape 4

| Zone | Icône | Contenu |
|------|-------|---------|
| **EtapeFAQ** | Calendar `#FFBF00` | Horaires, Fermetures, Conditions particulières |

---

## 6. ÉTAPE 5 - VALIDATION ET GÉNÉRATION

### 6.1. Fichiers Utilisés - Étape 5

| Fichier | Chemin | Responsabilité |
|---------|--------|----------------|
| **Etape5.tsx** | `src/1.etapes-generation-annonces/etape5/Etape5.tsx` | Page de validation finale et lancement génération |
| **BoutonEtape5LancerOpenAI.tsx** | `src/components/1-Sources-Generation-Annonces/form-components/BoutonEtape5LancerOpenAI.tsx` | Bouton principal de génération |
| **openai.ts** | `src/services/openai.ts` | Service principal OpenAI (4 prompts) |
| **1.API-AnnonceSMS.ts** | `src/services/openai/.../1.API-AnnonceSMS.ts` | Service SMS |
| **2.API-AnnonceGoogleBusinessProfile.ts** | `src/services/openai/.../2.API-AnnonceGoogleBusinessProfile.ts` | Service Google Business Profile |
| **3.API-AnnonceReseauxSociaux.ts** | `src/services/openai/.../3.API-AnnonceReseauxSociaux.ts` | Service Réseaux Sociaux |

### 6.2. Clés localStorage Créées - Étape 5

| Clé localStorage | Créée par | Contenu | Format | Utilisation |
|------------------|-----------|---------|--------|-------------|
| **`generation_status`** | `handleValidateAndFinish()` Etape5 | Statut de la génération | JSON: `{startTime, websiteAd, summarySheet, newsletter, seoTools, smsAd, googleBusinessProfile, reseauxSociaux, completed, progress}` | Suivi progression animation |
| **`generation_website_ad`** | Service OpenAI | Résultat annonce site internet | JSON: `{titre, accroche, descriptif, cta}` | Affichage étape 6 |
| **`generation_summary_sheet`** | Service OpenAI | Résultat fiche de synthèse | JSON: `{titre, referenceEtPrix, detailsCles, donneesFinancieres, informationsComplementaires}` | Affichage étape 6 |
| **`generation_newsletter`** | Service OpenAI | Résultat newsletter | JSON: `{titre, accroche, pointsForts, callToAction, prixEtReference}` | Affichage étape 6 |
| **`generation_seo_tools`** | Service OpenAI | Résultat outils SEO | JSON: `{baliseTitre, baliseMetaDescription, urlLongueTraine}` | Affichage étape 6 |
| **`generation_sms_ad`** | Service OpenAI SMS | Résultat SMS | JSON: `{"restitution-annonce-sms": "..."}` | Affichage étape 6 |
| **`generation_googleprofile_ad`** | Service Google BP | Résultat Google Business | JSON: `{"restitution-annonce-googlebusinessprofile": "..."}` | Affichage étape 6 |
| **`generation_reseauxsociaux_ad`** | Service Réseaux Sociaux | Résultat Réseaux Sociaux | JSON: `{TitreAnnonceReseaux, AccrocheImpactanteAnnonceReseaux, AtoutsAnnonceReseaux, CtaAnnonceReseaux}` | Affichage étape 6 |

### 6.3. États Locaux - Etape5

| État | Type | Utilisation |
|------|------|-------------|
| `isGenerating` | `boolean` | Indicateur de génération en cours, désactive le bouton |

### 6.4. Fonction Principale - Étape 5

| Nom | Déclencheur | Actions détaillées |
|-----|-------------|-------------------|
| **`handleValidateAndFinish()`** | Clic "Générer mes Annonces" | 1. Vérifie `isGenerating=false` et `openAIApiKey` présent2. `setIsGenerating(true)`3. Crée `generation_status` initial (progress=0, all false)4. `completeStep(5)` + `navigate("/etape5/animation")`5. Charge `propertyData` depuis localStorage6. **Génération séquentielle** :   a. `generateWebsiteAd()` → localStorage + `updateGenerationStatus('websiteAd', true, 14)`   b. `generateSummarySheetAd()` → localStorage + `updateGenerationStatus('summarySheet', true, 28)`   c. `generateNewsletterAd()` → localStorage + `updateGenerationStatus('newsletter', true, 42)`   d. `generateSEOTools()` → localStorage + `updateGenerationStatus('seoTools', true, 56)`   e. `generateSMSAd()` → localStorage + `updateGenerationStatus('smsAd', true, 70)`   f. `generateGoogleBusinessProfileAd()` → localStorage + `updateGenerationStatus('googleBusinessProfile', true, 85)`   g. `generateReseauxSociauxAd()` → localStorage + `updateGenerationStatus('reseauxSociaux', true, 100)`7. `updateGenerationStatus('completed', true, 100)`8. `setTimeout(() => navigate("/etape6communication"), 1000)` |

### 6.5. Fonction Utilitaire - updateGenerationStatus

| Fonction | Paramètres | Action |
|----------|-----------|--------|
| **`updateGenerationStatus()`** | `key: string`, `value: boolean`, `progress: number` | 1. Charge `generation_status` depuis localStorage2. Met à jour `status[key] = value` et `status.progress = progress`3. Sauvegarde dans localStorage |

---

## 7. ANIMATION DE GÉNÉRATION

### 7.1. Fichiers - Animation

| Fichier | Responsabilité |
|---------|----------------|
| **Animation.tsx** | `src/1.etapes-generation-annonces/etape5/Animation.tsx` | Page d'animation avec progression circulaire |

### 7.2. États Locaux - Animation

| État | Type | Utilisation |
|------|------|-------------|
| `progressValue` | `number` | Valeur actuelle de progression (0-100) |

### 7.3. Hooks - Animation

| Hook | Intervalle | Actions |
|------|-----------|---------|
| **`useEffect([])`** | Toutes les 500ms | 1. Charge `generation_status`2. Si absent → redirect `/etape5`3. Met à jour `progressValue` avec `status.progress`4. Si `completed=true` → redirect `/etape6communication` après 1.5s5. **Sécurité**: Si durée > 3min et étapes complétées > 0 → redirect `/etape6communication` |

### 7.4. Composant Visuel - Animation

| Élément | Description | Style |
|---------|-------------|-------|
| **Robot IA** | Image `/lovable-uploads/da9a9af1-75eb-429e-b769-c2ce8901f9aa.png` | Animation flottante, particules, clignotement yeux |
| **CircularProgress** | Barre de progression circulaire | Taille 80px, épaisseur 8px, couleur `#D6BCFA` |
| **Texte progression** | "Progression : X%" | Blanc, 14px |

---

## 8. COMPOSANTS RÉUTILISABLES

### 8.1. Tableau des Composants de Formulaire

| Composant | Fichier | Props principales | Logique interne | Style graphique | Utilisation |
|-----------|---------|-------------------|-----------------|-----------------|-------------|
| **TextFieldForm** | `TextFieldForm.tsx` | `id`, `title`, `value`, `onChange`, `placeholder`, `required` | Capitalise automatiquement la 1ère lettre lors de `onChange` | Label 14px Bold noir, Input 42px h, border `#B8C8DC`, focus ring `#5E50A6` | Champs texte simples (agence, référence, emplacement, type de bien) |
| **MonetaryFieldForm** | `MonetaryFieldForm.tsx` | `id`, `title`, `value`, `onChange`, `currency`, `placeholder`, `required` | 1. Supprime `€` de l'input2. Garde uniquement chiffres et espaces3. Formate avec espaces séparateurs milliers4. Ajoute `€` à la fin5. `onFocus` → sélectionne tout | Mêmes styles que TextFieldForm | Prix FAI, Loyer HT/HC |
| **SelectionButtonRond** | `SelectionButtonRond.tsx` | `id`, `options[]`, `selectedOption`, `onChange`, `label`, `required` | Boucle sur `options`, compare `selectedOption` avec `option.id` | Boutons ronds avec point central si sélectionné, border `#5E50A6` | Exclusivité, Type de transaction, Périodicité loyer |
| **FormulaireSaisie** | `FormulaireSaisie.tsx` | `id`, `title`, `value`, `onChange`, `placeholder`, `minRows`, `readOnly`, `required` | 1. **Auto-expand**: ajuste hauteur selon contenu2. **Puces auto**: ajoute `• ` si ligne ne commence pas par `•`, `■`, `▪`, `▫`, `.`, `-`3. **Capitalisation**: Met en majuscule 1ère lettre après `• `4. Préserve espaces début de ligne | Textarea, minHeight `minRows * 24px`, auto-resize | Arguments commerciaux, Description, Financials, Détails |
| **BoutonValiderInformations** | `BoutonValiderInformations.tsx` | `onClick`, `disabled`, `width`, `height`, `className` | - | Gradient mauve `#4C1D96` → `#6C28D8`, hover scale 1.05, 18px Bold, 70px h | Validation étapes 1-4 |
| **BoutonEtape5LancerOpenAI** | `BoutonEtape5LancerOpenAI.tsx` | `onClick`, `disabled`, `isGenerating`, `children`, `className` | Icône `Sparkles` avec animation pulse si `isGenerating` | Gradient mauve + icône étincelle, 24px Bold, shadow-lg | Lancement génération étape 5 |
| **SgaHelpBox** | `SgaHelpBox.tsx` | `title`, `content`, `icon`, `className` | Affiche icône + titre + contenu | Background `#F7F5FA`, border `#E5E7EB`, 14px titre Bold, 12px contenu | Aide contextuelle toutes étapes |
| **EtapeFAQ** | `EtapeFAQ.tsx` | `etape: "etape1"\|"etape2"\|"etape3"\|"etape4"` | Switch sur `etape` pour afficher contenu et icône spécifiques | Utilise `SgaHelpBox` | FAQ par étape avec contenu personnalisé |

### 8.2. Composants de Navigation et Layout

| Composant | Fichier | Props | Hooks utilisés | Fonctions localStorage | Responsabilité |
|-----------|---------|-------|----------------|----------------------|----------------|
| **DirectivesMenuOnglet** | `DirectivesMenuOnglet.tsx` | `activeStep`, `disabledSteps` | `useStepProgress()`, `useNavigate()`, `useBoutonGenerationNewProjet()` | Lit/écrit `stepProgress` | 1. Affiche 4 cartes colorées (Vert=Étape1, Bleu=Étape2, Violet=Étape3, Orange=Étape4)2. Gère navigation vers étapes disponibles3. Affiche "Valider mon projet" si étape 4 complétée4. Affiche "Générer un nouveau projet" avec dialog confirmation |
| **BoutonNouveauProjet** | `BoutonNouveauProjet.tsx` | `onClick` | - | - | Bouton poubelle pour réinitialiser projet |
| **BoutonValiderProjet** | `BoutonValiderProjet.tsx` | `onClick` | - | - | Bouton pour aller à étape 5 depuis étape 1-4 |

---

## 9. HOOKS ET UTILITAIRES

### 9.1. Hook useStepProgress

| Fichier | Paramètre | États internes | Fonctions retournées | Clé localStorage |
|---------|-----------|----------------|---------------------|------------------|
| **useStepProgress.ts** | `currentStep: number` | `availableSteps: number[]`, `hasCompletedStep4: boolean` | `completeStep(step)`, `getDisabledSteps()`, `goToEtape5()`, `handleConfirmNewProject()`, `isStepAvailable(step)` | **`stepProgress`** |

#### Détail des fonctions - useStepProgress

| Fonction | Paramètres | Actions | Effet sur localStorage |
|----------|-----------|---------|----------------------|
| **`completeStep(step)`** | `step: number` | 1. Ajoute `step+1` à `availableSteps`2. Si `step=4` → `hasCompletedStep4=true`3. Sauvegarde | Met à jour `stepProgress` |
| **`getDisabledSteps()`** | - | Retourne liste des étapes NON disponibles (1-5 sauf `availableSteps`) | Lecture |
| **`goToEtape5()`** | - | `navigate("/etape5")` | - |
| **`handleConfirmNewProject()`** | - | 1. `localStorage.clear()`2. Toast succès3. `navigate("/etape1")`4. `window.location.reload()` | **Efface TOUT le localStorage** |
| **`isStepAvailable(step)`** | `step: number` | Retourne `true` si `step <= currentStep` OU `step` dans `availableSteps` | Lecture |

#### Format localStorage - stepProgress

```json
{
  "availableSteps": [1, 2, 3, 4, 5],
  "hasCompletedStep4": true
}
```

### 9.2. Hook useSgaForm

| Fichier | États | Fonctions | Utilisation |
|---------|-------|-----------|-------------|
| **useSgaForm.ts** | `currentTab`, `formData` | `updateFormData(field, value)`, `resetSessionTimer()` | **Commenté**: Timer de session 10min (non actif actuellement) |
- On laisse la fonction inactive comme actuellement
- Conformément aux directives : public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/02.2.FonctionTimer.md

### 9.3. Hook useBoutonGenerationNewProjet

| Fichier | Fonction | Actions |
|---------|----------|---------|
| **useBoutonGenerationNewProjet.tsx** | `handleConfirmNewProject()` | 1. `localStorage.clear()`2. Toast succès3. `navigate("/etape1")`4. `window.location.reload()` |

### 9.4. Utilitaires openai.ts

| Fonction | Fichier | Paramètres | Retour | Actions |
|----------|---------|-----------|--------|---------|
| **`getPropertyDataFromStorage()`** | `openai.ts` | - | `PropertyData` | Charge `propertyData` depuis localStorage, parse JSON, retourne `{}` si erreur |
| **`updatePropertyData()`** | `openai.ts` | `newData: Partial` | `PropertyData` | 1. Charge données existantes2. Merge avec `newData`3. Sauvegarde `propertyData` dans localStorage4. Retourne données mises à jour |
| **`clearPropertyData()`** | `openai.ts` | - | `void` | `localStorage.removeItem("propertyData")` |
| **`createOpenAIService()`** | `openai.ts` | `apiKey: string` | `OpenAIService` | Crée instance de la classe OpenAI principale |

---

## 10. SERVICES OPENAI ET PROMPTS

### 10.1. Tableau des Services OpenAI

| Service | Fichier | Classe | Fonction principale | Prompt utilisé | Clé localStorage résultat |
|---------|---------|--------|---------------------|----------------|--------------------------|
| **OpenAI Principal** | `openai.ts` | `OpenAIService` | `generateWebsiteAd()`, `generateSummarySheetAd()`, `generateNewsletterAd()`, `generateSEOTools()` | 4 prompts différents | `generation_website_ad`, `generation_summary_sheet`, `generation_newsletter`, `generation_seo_tools` |
| **OpenAI SMS** | `1.API-AnnonceSMS.ts` | `OpenAISMSService` | `generateSMSAd()` | `promptSMSAnnonce` | `generation_sms_ad` |
| **OpenAI Google Business** | `2.API-AnnonceGoogleBusinessProfile.ts` | `OpenAIGoogleBusinessProfileService` | `generateGoogleBusinessProfileAd()` | `promptGoogleBusinessProfileAnnonce` | `generation_googleprofile_ad` |
| **OpenAI Réseaux Sociaux** | `3.API-AnnonceReseauxSociaux.ts` | `OpenAIReseauxSociauxService` | `generateReseauxSociauxAd()` | `promptReseauxSociauxAnnonce` | `generation_reseauxsociaux_ad` |

### 10.2. Interface PropertyData (commune à tous les services)

| Champ | Type | Source (étape) | Utilisation dans prompts |
|-------|------|---------------|-------------------------|
| **agencyName** | `string?` | Étape 1 | `[nom de l'agence immobilière]` |
| **reference** | `string?` | Étape 1 | `[référence du bien]` |
| **exclusivite** | `string?` | Étape 1 ("Oui"/"Non") | `[Oui]` → Utilisé uniquement si "Oui" |
| **location** | `string?` | Étape 1 | `[localisation du bien]` |
| **propertyType** | `string?` | Étape 1 | `[type de bien commercial: restaurant, bar, boutique, etc.]` |
| **saleType** | `string?` | Étape 1 ("à vendre"/"à louer") | `[à vendre ou à louer]` |
| **price** | `string?` | Étape 1 | `[montant]` (si à vendre) |
| **rentAmount** | `string?` | Étape 1 | `[montant]` (si à louer) |
| **rentPeriodicity** | `string?` | Étape 1 ("Mensuel"/"Trimestriel"/"Annuel") | `[mensuel, trimestriel, ou annuel]` |
| **keyElements** | `string?` | Étape 1 | `[points forts et arguments commerciaux]` |
| **propertyDescription** | `string?` | Étape 2 | `[description détaillée du bien]` |
| **financials** | `string?` | Étape 3 | `[détails financiers du bien]` |
| **details** | `string?` | Étape 4 | `[informations complémentaires]` |
| **hasNoDetails** | `boolean?` | Étape 4 | - |

---

## 11. TABLEAU RÉCAPITULATIF DES CLÉS LOCALSTORAGE

| Clé localStorage | Format | Créée par | Contenu résumé | Utilisée par étapes | Utilisée par modules | Utilisée par OpenAI |
|------------------|--------|-----------|----------------|-------------------|---------------------|-------------------|
| **`propertyData`** | JSON stringifié | `updatePropertyData()` (openai.ts) | Objet `PropertyData` complet avec tous les champs des étapes 1-4 | Étapes 1, 2, 3, 4, 5 | Tous les formulaires, DirectivesMenuOnglet | **Tous les prompts OpenAI** via fonctions de génération |
| **`stepProgress`** | JSON stringifié | `useStepProgress` | `{availableSteps: number[], hasCompletedStep4: boolean}` | Étapes 1, 2, 3, 4, 5 | DirectivesMenuOnglet, navigation | Non |
| **`generation_status`** | JSON stringifié | `handleValidateAndFinish()` Etape5 | `{startTime, websiteAd: bool, summarySheet: bool, newsletter: bool, seoTools: bool, smsAd: bool, googleBusinessProfile: bool, reseauxSociaux: bool, completed: bool, progress: number}` | Étape 5 | Animation | Non |
| **`generation_website_ad`** | JSON stringifié | `generateWebsiteAd()` | `{titre, accroche, descriptif, cta}` | - | Étape 6 (affichage) | Généré PAR OpenAI |
| **`generation_summary_sheet`** | JSON stringifié | `generateSummarySheetAd()` | `{titre, referenceEtPrix, detailsCles, donneesFinancieres, informationsComplementaires}` | - | Étape 6 | Généré PAR OpenAI |
| **`generation_newsletter`** | JSON stringifié | `generateNewsletterAd()` | `{titre, accroche, pointsForts, callToAction, prixEtReference}` | - | Étape 6 | Généré PAR OpenAI |
| **`generation_seo_tools`** | JSON stringifié | `generateSEOTools()` | `{baliseTitre, baliseMetaDescription, urlLongueTraine}` | - | Étape 6 | Généré PAR OpenAI |
| **`generation_sms_ad`** | JSON stringifié | `generateSMSAd()` | `{"restitution-annonce-sms": "..."}` | - | Étape 6 | Généré PAR OpenAI |
| **`generation_googleprofile_ad`** | JSON stringifié | `generateGoogleBusinessProfileAd()` | `{"restitution-annonce-googlebusinessprofile": "..."}` | - | Étape 6 | Généré PAR OpenAI |
| **`generation_reseauxsociaux_ad`** | JSON stringifié | `generateReseauxSociauxAd()` | `{TitreAnnonceReseaux, AccrocheImpactanteAnnonceReseaux, AtoutsAnnonceReseaux, CtaAnnonceReseaux}` | - | Étape 6 | Généré PAR OpenAI |

---

## 12. TABLEAU COMPLET DES PROMPTS OPENAI

### 12.1. Vue d'ensemble des prompts

| N° | Nom Prompt | Fichier | Fonction génératrice | Modèle OpenAI | Structure JSON retour |
|----|-----------|---------|---------------------|---------------|----------------------|
| **1** | Annonce Site Internet | `1.PromptAnnonceSiteInternet.ts` | `generateWebsiteAd()` | `gpt-4o` | `{titre, accroche, descriptif, cta}` |
| **2** | Fiche de Synthèse | `2.PromptAnnonceFichedeSynthese.ts` | `generateSummarySheetAd()` | `gpt-4o` | `{titre, referenceEtPrix, detailsCles, donneesFinancieres, informationsComplementaires}` |
| **3** | Newsletter | `3.PromptAnnonceNewsletter.ts` | `generateNewsletterAd()` | `gpt-4o` | `{titre, accroche, pointsForts, callToAction, prixEtReference}` |
| **4** | Outils SEO | `4.PromptOutilsSEO.ts` | `generateSEOTools()` | `gpt-4o` | `{baliseTitre, baliseMetaDescription, urlLongueTraine}` |
| **5** | Annonce SMS | `5.PromptSMSAnnonce.ts` | `generateSMSAd()` | `gpt-4o` | `{"restitution-annonce-sms": "..."}` |
| **6** | Google Business Profile | `6.PromptGoogleBusinessProfileAnnonce.ts` | `generateGoogleBusinessProfileAd()` | `gpt-4o` | `{"restitution-annonce-googlebusinessprofile": "..."}` |
| **7** | Réseaux Sociaux | `7.PromptReseauxSociauxAnnonce.ts` | `generateReseauxSociauxAd()` | `gpt-4o` | `{TitreAnnonceReseaux, AccrocheImpactanteAnnonceReseaux, AtoutsAnnonceReseaux, CtaAnnonceReseaux}` |

### 12.2. Détail Prompt 1 - Annonce Site Internet

**Fichier**: `src/services/openai/1.GenerateurAnnoncesOutilsSeo/7.PromptsOpenAi/1.PromptAnnonceSiteInternet.ts`

| Section | Placeholder | Valeur de remplacement (source) | Utilisation |
|---------|-------------|-------------------------------|-------------|
| **Persona IA** | - | "LeadGenAI AdBuilder, docteur en rédaction professionnelle" | - |
| **Mission** | - | Rédiger Annonce Site Internet 150-200 mots, SEO, lisibilité web | - |
| **Infos Nom Agence** | `[nom de l'agence immobilière]` | `data.agencyName` (Étape 1) | Accroche, début annonce |
| **Infos Type de bien** | `[type de bien commercial: restaurant, bar, boutique, etc.]` | `data.propertyType` (Étape 1) | Titre, descriptif |
| **Infos Transaction** | `[à vendre ou à louer]` | `data.saleType` (Étape 1) | Structure titre, conditionnement prix/loyer |
| **Infos Emplacement** | `[localisation du bien]` | `data.location` (Étape 1) | Titre, accroche, SEO |
| **Infos Atouts** | `[points forts et arguments commerciaux]` | `data.keyElements` (Étape 1) | Titre (3 atouts), accroche (tous), CTA (3 atouts) |
| **Infos Prix** | `[montant]` | `data.price` ou `data.rentAmount` (Étape 1) | Titre (fin), référence prix |
| **Infos Périodicité** | `[mensuel, trimestriel, ou annuel]` | `data.rentPeriodicity` (Étape 1) | Titre si location |
| **Infos Exclusivité** | `[Oui]` | `data.exclusivite === "Oui" ? "Oui" : "Non"` (Étape 1) | Titre/Accroche si "Oui" |
| **Infos Référence** | `[référence du bien]` | `data.reference` (Étape 1) | - |
| **Infos Description** | `[description détaillée du bien]` | `data.propertyDescription` (Étape 2) | Descriptif complet |
| **Infos Financières** | `[détails financiers du bien]` | `data.financials` (Étape 3) | Sous-partie "Informations Financières et Potentiel" |
| **Infos Complémentaires** | `[informations complémentaires]` | `data.details` (Étape 4) | Non utilisé dans ce prompt |

**Structure annonce**:
1. **TITRE** (H1, 80 car max, SEO, atouts 1-2-3 extraits de keyElements, prix/loyer en fin)
2. **ACCROCHE** (2 phrases, commence par nom agence, tous les atouts commerciaux)
3. **DESCRIPTIF** (2 sous-parties H2: Description du bien + Infos Financières)
4. **CTA** (2 phrases, 3 atouts, verbe d'action, pas de prix)

**Mots interdits**: Liste non détaillée ici (voir fichier prompt)

**Format retour HTML**: ``, ``, ``, pas de Markdown

### 12.3. Détail Prompt 2 - Fiche de Synthèse

**Fichier**: `2.PromptAnnonceFichedeSynthese.ts`

**Placeholders identiques au Prompt 1** + utilisation de `[référence du bien]` et `[informations complémentaires]`

**Structure**:
1. **TITRE** (H2, 110 car max, énumération atouts 1-5)
2. **RÉFÉRENCE ET PRIX** (2 lignes puces: `• Référence : ...` + `• Prix FAI : ...` OU `• Loyer HT/HC : ...`)
3. **DÉTAILS CLÉS** (H2 + puces format `. NomClé : Valeur`)
4. **DONNÉES FINANCIÈRES** (H2 + puces format `. NomClé : Valeur`)
5. **AUTRES DÉTAILS** (H2 + puces, **supprimée si `details` vide**)

**Format retour**: Paragraphes `` avec point initial `. Clé : Valeur`, PAS de listes `/`

### 12.4. Détail Prompt 3 - Newsletter

**Fichier**: `3.PromptAnnonceNewsletter.ts`

**Placeholders identiques** sauf `[informations complémentaires]` non utilisé

**Structure**:
1. **TITRE** (MAJUSCULES, atouts 1-5, `|` séparateurs)
2. **ACCROCHE** (2 phrases, `` séparation)
3. **POINTS FORTS** (`Points Forts :` + `Clé: Valeur.`)
4. **CTA** (2 phrases MAJUSCULES, `` séparation)
5. **PRIX ET RÉFÉRENCE** (`Prix FAI: Valeur...`)

**Format HTML emailing**: ``, ``, ``, ``, ``

### 12.5. Détail Prompt 4 - Outils SEO

**Fichier**: `4.PromptOutilsSEO.ts`

**Placeholders identiques** sauf `[informations complémentaires]` non utilisé

**Structure**:
1. **BALISE TITLE** (50-65 car, TYPE DE BIEN en majuscules, atouts 1-2-3, PAS de prix/référence)
2. **BALISE META DESCRIPTION** (150-160 car, phrase complète, verbe d'accroche, 3 atouts, CTA, PAS de prix/référence)
3. **URL LONGUE TRAÎNE** (60-75 car, minuscules, tirets, format `type-de-bien-a-vendre-localisation-atout1-atout2-atout3`, PAS de prix/référence)

**Contraintes strictes de longueur et format**

### 12.6. Détail Prompt 5 - SMS

**Fichier**: `5.PromptSMSAnnonce.ts`

**Placeholders identiques au Prompt 1**

**Structure**: SMS 120-140 caractères avec accroche, atouts, prix/loyer

**Format retour**: `{"restitution-annonce-sms": "texte SMS"}`

### 12.7. Détail Prompt 6 - Google Business Profile

**Fichier**: `6.PromptGoogleBusinessProfileAnnonce.ts`

**Placeholders identiques**

**Structure**: Description optimisée Google Business 750 caractères max

**Format retour**: `{"restitution-annonce-googlebusinessprofile": "..."}`

### 12.8. Détail Prompt 7 - Réseaux Sociaux

**Fichier**: `7.PromptReseauxSociauxAnnonce.ts`

**Placeholders identiques**

**Structure**:
1. Titre impactant
2. Accroche
3. Atouts (liste puces)
4. CTA

**Format retour**: `{TitreAnnonceReseaux, AccrocheImpactanteAnnonceReseaux, AtoutsAnnonceReseaux, CtaAnnonceReseaux}`

---

## 13. NAVIGATION ET FLUX

### 13.1. Schéma de Navigation Phase 1

```mermaid
graph TD
    A[Chargement Etape1.tsx - Éléments Clés] -->|Valider| B[/etape2 - Description]
    B -->|Valider| C[/etape3 - Financières]
    C -->|Valider| D[/etape4 - Détails]
    D -->|Valider| E[/etape5 - Validation]
    E -->|Générer| F[/etape5/animation]
    F -->|Terminé| G[/etape6communication]

    A -.->|Retour carte| E
    B -.->|Retour carte| E
    C -.->|Retour carte| E
    D -.->|Retour carte| E

    E -.->|Modifier| A
    E -.->|Modifier| B
    E -.->|Modifier| C
    E -.->|Modifier| D

    style E fill:#9b87f5
    style F fill:#FFA500
    style G fill:#4CAF50
```
---
### 13.2. Logique de Validation Navigation

| Fonction | Hook | Condition | Action si vrai | Action si faux |
|----------|------|-----------|----------------|----------------|
| **`isStepAvailable(step)`** | `useStepProgress` | `step <= currentStep` OU `step` dans `availableSteps` | Permet navigation | Bloque navigation, opacité 50% |

### 13.3. Boutons de Navigation

| Bouton | Visibilité | Action | Condition |
|--------|-----------|--------|-----------|
| **Valider mes informations** | Étapes 1-4 | Validation + sauvegarde + navigation étape suivante | Champs obligatoires remplis |
| **Carte colorée Étape X** | DirectivesMenuOnglet | Navigation vers étape X | `isStepAvailable(X)` |
| **Valider mon projet** | DirectivesMenuOnglet | Navigation `/etape5` | `hasCompletedStep4 === true` ET `activeStep !== 5` |
| **Générer un nouveau projet** | DirectivesMenuOnglet | Dialog confirmation → `localStorage.clear()` + reload | Toujours visible |
| **Générer mes Annonces** | Étape 5 | Lancement génération OpenAI + navigation `/etape5/animation` | `openAIApiKey` présent |

---

## 📊 CONCLUSION

Ce document constitue la **référence exhaustive** de la Phase 1 (Étapes 1 à 5) de l'application LeadGenAI AdBuilder. Il inventorie:

- ✅ **31 fichiers** analysés en détail
- ✅ **10 clés localStorage** documentées avec format et utilisation
- ✅ **7 prompts OpenAI** avec placeholders et structures de retour
- ✅ **8 composants de formulaire** réutilisables
- ✅ **3 hooks principaux** de gestion d'état
- ✅ **5 étapes** de collecte de données avec validation
- ✅ **Flux complet** de navigation et génération

**Aucune donnée de migration, SQL ou Supabase** n'est mentionnée conformément aux directives.
