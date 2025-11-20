# 📘 BIBLE DE RÉFÉRENCE : LeadGenAi - LocalStorage → Supabase Migration

**Date:** 19/11/2025  
**Objectif:** CE DOCUMENT EST UNE PHOTOGRAPHIE DE LA STRUCTURE EXISTANTE EN LOCALSTORAGE  


---

---

## 📊 PARTIE 1 : SYSTÈME LOCALSTORAGE EXISTANT 

### 1.1 Architecture Globale

| **Composant** | **Rôle** | **Localisation** | **État** |
|---------------|----------|------------------|----------|
| **Étapes 1-5** | Collecte données bien | `src/1.etapes-generation-annonces/` | ✅ Fonctionnel |
| **Étape 6 Communication** | 7 canaux diffusion | `src/1.etapes-restitution-utilisateur/` | ✅ Fonctionnel |
| **Services OpenAI** | Génération annonces | `src/services/openai.ts` | ✅ Fonctionnel |
| **LocalStorage Keys** | Stockage données | Navigateur | ✅ Fonctionnel |


---

### 1.3 Clés LocalStorage (15 champs + 7 générations)

#### 📦 Données Bien Immobilier (Étapes 1-5)

| **Clé LocalStorage** | **Étape** | **Description** | **Type** |
|----------------------|-----------|-----------------|----------|
| `project-agency-name` | 1 | Nom agence | string |
| `project-reference` | 1 | Référence bien | string |
| `project-exclusivite` | 1 | Exclusivité (oui/non) | string |
| `project-location` | 1 | Localisation | string |
| `project-property-type` | 1 | Type bien | string |
| `project-sale-type` | 1 | Vente/Location | string |
| `project-price` | 1 | Prix vente | string |
| `project-rent-amount` | 1 | Montant loyer | string |
| `project-rent-periodicity` | 1 | Périodicité loyer | string |
| `project-key-elements` | 1 | Points clés | string |
| `project-property-description` | 2 | Description bien | string |
| `project-financials` | 3 | Informations financières | string |
| `project-details` | 4 | Détails complémentaires | string |
| `project-hasNoDetails` | 4 | Aucun détail supplémentaire | boolean |
| `session_start_time` | Timer | Timer session (À IGNORER) | number |

#### 🎨 Annonces Générées (OpenAI → LocalStorage)

| **Clé LocalStorage** | **Canal** | **Structure JSON** |
|----------------------|-----------|-------------------|
| `generation_website_ad` | Site Internet | `{titre, accroche, descriptif, appelAction}` |
| `generation_synthesead` | Fiche Synthèse | `{titre, accroche, descriptif, appelAction}` |
| `generation_newsletter_ad` | Newsletter | `{titre, accroche, descriptif, appelAction}` |
| `generation_seo_tools` | Outils SEO | `{meta_title, meta_description, alt_images, h1, h2}` |
| `generation_sms_ad` | SMS | `{"restitution-annonce-sms": string}` (122 car max) |
| `generation_googleprofile_ad` | Google Business | `{TitreAnnonceGoogle, AccrocheDescriptiveAnnonceGoogle, PointsFortsAnnonceGoogle, CtaAnnonceGoogle}` |
| `generation_reseauxsociaux_ad` | Réseaux Sociaux | `{TitreAnnonceReseaux, AccrocheImpactanteAnnonceReseaux, AtoutsAnnonceReseaux, CtaAnnonceReseaux}` |

#### ✏️ Modifications Utilisateur (Étape 6)

| **Clé LocalStorage** | **Canal** | **Rôle** |
|----------------------|-----------|----------|
| `key-modifs-annonce-site-internet` | Site Internet | Modifications utilisateur |
| `key-modifs-annonce-portails-immobiliers` | Portails Immobiliers | Modifications utilisateur |
| `key-modifs-newsletter` | Newsletter | Modifications utilisateur |
| `key-modifs-creer-campagne-sms` | SMS | Modifications SMS |
| `key-modifs-expediteur-sms` | SMS | Expéditeur |
| `key-modifs-url-annonce-sms` | SMS | URL annonce |
| `key-modifs-destinataires-sms` | SMS | Destinataires |
| `key-modifs-url-annonce-reseaux-sociaux` | Réseaux Sociaux | URL personnalisée |
| `key-modifs-creer-landing-page-annonce` | Landing Page | Modifications landing page |

---

### 1.4 Services OpenAI LocalStorage 

**Fichier:** `src/services/openai.ts`

| **Fonction** | **Rôle** | **Retour** | **Stockage** |
|--------------|----------|------------|--------------|
| `generateWebsiteAd()` | Génère annonce site | `{titre, accroche, descriptif, appelAction}` | `generation_website_ad` |
| `generateSynthèseAd()` | Génère fiche synthèse | Idem | `generation_synthesead` |
| `generateNewsletterAd()` | Génère newsletter | Idem | `generation_newsletter_ad` |
| `generateSEOTools()` | Génère méta SEO | `{meta_title, meta_description, alt_images, h1, h2}` | `generation_seo_tools` |
| `generateSMSAd()` | Génère SMS | `{"restitution-annonce-sms": string}` | `generation_sms_ad` |
| `generateGoogleProfileAd()` | Génère Google Business | `{TitreAnnonceGoogle, ...}` | `generation_googleprofile_ad` |
| `generateReseauxSociauxAd()` | Génère réseaux sociaux | `{TitreAnnonceReseaux, ...}` | `generation_reseauxsociaux_ad` |


---

### 1.5 Hooks Récupération Données Étape 6 

| **Hook** | **Fichier** | **Rôle** | **Clé prioritaire** | **Clé fallback** |
|----------|-------------|----------|---------------------|------------------|
| `useRecuperationAnnonceSiteInternet` | `1.EtapeCopierSiteInternet/HookRecuperationAnnonceSiteInternet.ts` | Récupère annonce site | `key-modifs-annonce-site-internet` | `generation_website_ad` |
| `useRecuperationAnnonceVersPortailsImmobiliers` | `3.EtapeCopierPublierPortailsImmobiliers/HookRecuperationAnnonceVersPortailsImmobiliers.ts` | Récupère annonce portails | `key-modifs-annonce-portails-immobiliers` | `generation_website_ad` |
| `useRecuperationDataSMS` | `5.EtapeCreerSMSCampagne/Hook-1-RecuperationDataSMS.ts` | Récupère SMS | `key-modifs-creer-campagne-sms` | `generation_sms_ad` |
| `usePersonnaliserChampsSMS` | `5.EtapeCreerSMSCampagne/Hook-2-PersonnaliserChamps.tsx` | Gère expéditeur/URL/destinataires | 3 clés distinctes | - |
| `usePersonnaliserUrlReseaux` | `7.EtapeDiffuserReseauxAnnonce/Hook-2-PersonnaliserUrlReseaux.tsx` | Gère URL réseaux | `key-modifs-url-annonce-reseaux-sociaux` | - |
| `useRecuperationAnnonceVersLandingPage` | `8.EtapeCreerLandingPageAnnonce/HookRecuperationAnnonceVersLandingPage.ts` | Récupère landing page | `key-modifs-creer-landing-page-annonce` | `generation_website_ad` |

---


---

# REFRENCES

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
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/01.Etape1.m
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/02.Etape2.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/03.Etape3.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/04.Etape4.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/05.Etape5.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/06.Etape5animation.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/07.BilanEtape1aEtape5.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/08.ProcessEnvoiInfosOpenAI.md
- public/4. ReadMe EtapesAnnonces/01.Etape1à5/09.ProcessPassageEtapeSuivante.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/00.ProcessRecuperationOpenAI.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/01.SiteInternetAnnonces.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/02.SiteInternetOutilsSeo.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/03.PortailsImmobiliers.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/04.CréerEmailingCampagneNewsletter.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/05.EnvoyerCampagneSMS.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/06.CréerLandingPage.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/07.DiffuserGoogleMB.md
- public/4. ReadMe EtapesAnnonces/02.Etape6Communication/08.DiffuserReseaux.md.
- public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/02--0.BibleRéférences.md
- public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/02--1.MenuGaucheNavLinks.md

---
