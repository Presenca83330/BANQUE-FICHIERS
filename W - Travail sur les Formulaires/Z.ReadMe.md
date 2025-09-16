# README - FormReseauGestion - MÉMOIRE PROJET
## 🎯 APPLICATION LEADGENAI ADBUILDER
Tu es un expert en Ia no code et intégration supabese.
Tu maitrises parfaitement les environnement Saas, les meilleures logiciels et ia
Tu m 'accompagnes dans la mise à jour de mes formulaires de création et de mise  jour de compte.
- 1/ En 1er, je te demande de prendre note de la stratégie de mon application et de lire les fichiers du dossier : -  public/1. Documents Stratégiques et notamment public/1. Documents Stratégiques/6. Stratégie – Gestion des informations partagées entre Réseau et Réseau Direction.md
- 2/ En 2ème, je te demande de prendre note des tables de mon application et de lire tous les fichierts du dossier : public/2. Etats des Tables
- 3/ En 3ème, tu poursuivras ton analyse de Supabase, de toutes les tables et fonctions.
- 4/ En 4ème, tu analyseras tous nos Hooks du dossier : src/components/HOOKS-STRATEGIQUE

## 🎯 OBJECTIF DU PROJET
Développement d'un formulaire de gestion des réseaux existants pour les administrateurs PRESENCA.
Nous travaillons sur un espace qui me permet de créer et de mettre à jour des comptes utilisateurs.
Ce ne sont pas de simples formulaires CRUD ce sont des formulaires de gestion des clinets de Presenca.
En effet, cette application est en développement, n est pas en ligne et n'a pas de clients et il n est pas prévu pour l instant de permettre aux personnes de créer des comptes directement sur mon site.
Tout passera par moi. 
Ces formulaires permettront de créer des comptes suite à des demandes ou des contacts de prospects et de mettre à jour des tables clients car souvent ils n aiment pas le faire eux-memes


## 📚 DOCUMENTS DE RÉFÉRENCE (À RELIRE )
Nous travaillons sur le projet de formulaire Reseau et nous avons déjà créé
src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/2.FormReseauCreation.tsx
il est finalisé, tu as l explication, 
Analyse bien les hooks et fonctions utilisées.
src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/2.FormReseauCreation.tsx

IMPERATIF: Tant que nous n aurons pas rédigé tous les documents toute modification en dur, de modification ou de création de fichier est interdite.
Nous créons tout dedans ce fichier
src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/DétailsProcessEtFichiers.md
Nous travaillons à mettre en place la structure parfaite pour trouver les meilleures solutions pour
- Paramétrer la section Sélection réseau pour récupérer de Supabase les données et identifier les réseaux 
- Paramétrer la sélection pour choisir le réseau
- Paramétrer l'intégration des données de la tables, si elles existent dans les champs des formulaires
- Paramétrer les fonctions modifier pour permettre de renseigner (si vide) ou mettre à jour ou corriger les champs des formulaires
- Paramétrer l'envoi vers Supabase des données modifiées



## 🏗️ ARCHITECTURE DU FORMULAIRE

### Structure principale
```
FormReseauGestion.tsx (3 onglets)
├── ÉTAPE 1: Sélection du réseau (dropdown avec recherche)
├── ONGLET GÉNÉRAL: Champs pour mettre à jour les Informations de base du réseau
├── ONGLET INTÉGRATIONS: Champs pour mettre à jour les connexions Brevo/Zoho/OpenAI  
└── ONGLET FICHIERS: Champs pour uploader le logo du réseau, des documents et aussi supprimer un ancien logo ou de vieux documents du réseau présent dans supabase
```

### Workflow utilisateur
1. **Sélection** → Admin sélectionne un réseau dans dropdown
2. **Lecture seule** → Tous les champs se remplissent automatiquement (disabled)
3. **Édition** → Clic sur "Modifier" active l'édition d'une section
4. **Sauvegarde** → "Enregistrer" sauve et retourne en lecture seule

---

## 🛠️ Fichiers à créer / valider

### Étape 1 – Sélection réseau
- `useReseauSelection.ts` ✅  
- `SelecteurDuReseau.tsx` ✅  

### Étape 2 – Hooks stratégiques
- `useReseauFormData.ts` ✅  
- `useReseauValidation.ts` ✅  
- `useReseauFiles.ts` ✅  
- `useReseauIntegrations.ts` ✅  
- `types.ts` ✅  

### Étape 3 – Composants UI
- `Composants/FormOngletGeneral.tsx` ✅  
- `Composants/FormOngletIntegrations.tsx` ✅  
- `Composants/FormOngletFichiers.tsx` ✅  
- `Composants/IntegrationBrevo.tsx` ✅  
- `Composants/IntegrationZoho.tsx` ✅  
- `Composants/IntegrationOpenAI.tsx` ✅  

### Étape 4 – Base de données
- **Migration** bucket `bucket-table-reseau` + policies RLS ✅  
- **Edge functions à implémenter** :  
  - `supabase/functions/reseau-gestion-upload-files/index.ts`  
  - `supabase/functions/reseau-gestion-validate-data/index.ts`  
  - `supabase/functions/reseau-gestion-sync-integrations/index.ts`  

### Étape 5 – Fichier principal
- `FormReseauGestion.tsx` → intègre les onglets et la logique de gestion ✅  

---


## 📋 ARCHITECTURE TECHNIQUE

### Tables Supabase impliquées
- `reseau` → Informations principales (6 champs éditables + 2 bloqués)
- `brevo_connexion` → API Brevo (3 champs prioritaires)
- `zoho_connexion` → API Zoho (3 champs prioritaires)
- `openai_connexion` → API OpenAI (2 champs prioritaires)

### Champs ÉDITABLES (onglet Général)
- `reseau_nom` → Nom du réseau ⭐
- `reseau_identite_commerciale` → Identité commerciale
- `reseau_adresse` → Adresse siège ⭐
- `reseau_code_postal` → Code postal ⭐
- `reseau_ville` → Ville ⭐
- `reseau_siret` → SIRET ⭐

### Champs BLOQUÉS (ReseauDirection)
- `reseau_telephone` → LECTURE SEULE + message 
- `reseau_email` → LECTURE SEULE + message
car champs relié à ReseauDirection lire public/1. Documents Stratégiques/6. Stratégie – Gestion des informations partagées entre Réseau et Réseau Direction.md

## 🎯 ELEMENTS

. **Hook principal** → `useReseauFormData.ts` (orchestrateur)
. **Composants UI** → Sections isolées par onglet
. **Storage** → Bucket et upload fichiers
. **Intégrations** → Hooks spécialisés Brevo/Zoho/OpenAI

## 🔗 LIENS STRATÉGIQUES

### Hooks créés
- ✅ `useReseauSelection.ts` → TERMINÉ
- ✅ `useReseauFormData.ts` → Hook orchestrateur principal → TERMINÉ
- ✅ `useReseauValidation.ts` → Validation champs → TERMINÉ
- ✅ `useReseauFiles.ts` → Upload storage → TERMINÉ
- ✅ `useReseauIntegrations.ts` → Gestion API externes → TERMINÉ

### Composants existants réutilisables
- ✅ `GraphBoutonModifier.tsx` → Boutons Modifier/Annuler/Sauver
- ✅ `GraphSelectdansSupabase.tsx` → Sélection dropdown
- ✅ `GraphBrevo.tsx`, `GraphZoho.tsx`, `GraphOpenAI.tsx` → Icônes intégrations

## ⚠️ RÈGLES IMPORTANTES

### Sécurité multi-tenant
- RLS activée sur toutes les tables
- Admin PRESENCA = accès complet

### Vérification du maping
- Consulter Supabase et le fichier `TablesReferenceReseau.ts`

### Architecture des fichiers
- Formulaire : src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/3.FormReseauGestion.tsx
- Hooks → `src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/`
- Composants → `src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/Composants/
- Edges`-> supabase/functions/reseau-gestion-upload-files/index.ts/supabase/functions/reseau-gestion-validate-data/index.ts/supabase/functions/reseau-gestion-sync-integrations/index.ts
- Storage → Bucket `bucket-table-reseau` avec isolation par UUID

**Développeur:** Suivre strictement ce ReadMe pour éviter perte de mémoire !


## ⚠️ NOUS ALLONS CORRIGER DES FICHIERS ET PROCESS CAR J AI IDENTIFIE DES ERREURS 

----

Nous allons commcencer la dernière phase l i'ntégration des fichiers et le paramétrage avec supabase 
Mais nous avons encore des vérifications à faire.


- Je te rappelle que nous travaillons s ->ur le paramétrage du formulaire de gestion
- actuellement aucun fichier, hook, edge n est en place nous créons tous les codes parfait dans
- src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/DétailsProcessEtFichiers.md
avant migration
Je te rappelle
- que FormReseauGestion.tsx = FORMULAIRE DE GESTION (pas création) :
- 1/ Sélection : admin_presenca choisit un réseau EXISTANT dans le dropdown
- 2/ Chargement : Les données du réseau s'affichent automatiquement
- 3/ Modification : admin_presenca peut corriger/mettre à jour certains champs dans supabase
- 4/ Restriction : reseau_telephone et reseau_email restent non-éditables ici car ce sont les données de la table reseau_direction et ces données peuvent uniquement être corrigées dans le formulaire reseau_direction (quand il sera créé)

## 🚀 Étapes du Workflow
1. L’admin ouvre le formulaire.  
2. Sélectionne un réseau existant (dropdown avec recherche).  
3. Les données générales, intégrations et fichiers se chargent.  
4. Peut cliquer sur "Modifier" pour éditer une section.  
5. Les validations s’appliquent (front + edge).  
6. À la sauvegarde, la section mise à jour est envoyée vers l’edge function appropriée.  
7. Retour en lecture seule après succès.  

## ⚠️ DEMARCHE A SUIVRE ABOSOLUMENT
----
✅ Workflow validé :
- Tous les codes seront d'abord documentés dans DétailsProcessEtFichiers.md
- Aucune intégration directe tant que tout n'est pas finalisé
- Seul ce fichier de documentation pourra être enrichi
- Intégration uniquement après votre validation complète
-----
✅ Directive comprise : 
- Quand tu lis "C'EST UNE QUESTION. INTERDICTION TOTALE ET ABSOLUE DE MODIFIER DES FICHIERS SANS MON ACCORD"
- Tu dois répondre sans toucher aux fichiers de l'application
- Exception unique : enrichissement du fichier DétailsProcessEtFichiers.md si demandé

