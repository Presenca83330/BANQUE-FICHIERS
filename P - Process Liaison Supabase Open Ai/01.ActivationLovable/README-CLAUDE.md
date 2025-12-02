# READ ME
---
- Bonjour, je vais te présenter ma plateforme **LeadGenAI AdBuilder*LeadGenAI AdBuilder est une plateforme SaaS B2B hautement spécialisée dans le marketing digital des professionnels de l'immobilier commercial.
  - **Proposition de Valeur**
    - LeadGenAI AdBuilder est la première plateforme IA conçue pour automatiser toute la prospection commerciale dans l'immobilier B2B. Agents, agences et réseaux spécialisés en fonds de commerce, murs, locaux ou entreprises peuvent déléguer à l'IA l'ensemble de leurs actions marketing : rédaction, diffusion, sourcing, relance, landing pages, newsletters et campagnes.
  - **Promesse Client**
    - **En 3 clics** : LeadGenAI AdBuilder génère, diffuse et pilote des opérations marketing et commerciales.
    - **Sans compétence technique** requise.
    - **Résultats mesurables** : plus de leads, moins de travail manuel, plus de temps pour vos mandats.
---
## Bénéfices Quantifiés
  - Des centaines d'heures gagnées chaque année.
  - Des milliers d'euros économisés annuellement.
  - Un bond incroyable en Référencement local optimisé automatiquement.
  - Leads vendeurs et acquéreurs générés en masse.
---
---
# **Comprendre mon projet de migration Supabase**
  - Au départ, j ai travaillé sur Lovable sur un projet d'application simple de génération d'annonces c'est pour ça que nous avons travaillé tout d'abord en localstorage.
  - Puis je me suis aperçu qu'elle etait géniale en localstorage tout fonctionnait à merveille.
  - J'ai rajouté progressivement d'autres fonctions : génération de campagnes newsletters, sms, etc
  - Mais, il m'était pas possible de la commercialiser mon application en l'état, il fallait que je passe en gestion Supabase
  - En fait, MON OBJECTIF est simplement de Passer de localStorage à Supabase. SANS RIEN CHANGER D'AUTRE
      - Garder TOUS les champs (noms, types, structures),TOUS les processus, TOUTES les validations,TOUTE la logique métier, TOUTE l'UX/UI (même comportement utilisateur)
      - **C'est une migration technique pure, pas une refonte.**

# **Mon Objectif global**
 - Créer une architecture SaaS multi-tenant complète permettant
   - à chaque utilisateur, (réseau, réseau direction, réseau agence, réseau agence responsable, réseau agence collaborateur, agence indépendante, agence indépendante responsable, agence indépendante collaborateur)
   - d’accéder à leur espace et tout particulièrement leur espace de création d’annonces en 5 étapes relié à OpenAI,
   - avec gestion sécurisée des données via Supabase.
    
# **Rappel du Flux utilisateur global**
  - Connexion / Authentification : Authentification via Supabase (email / mot de passe)
  - Accès à l’espace personnel avec Redirection automatique selon le rôle :
    - RESEAU-ESPACE
    - CLIENT-ESPACE
    - COLLABORATEUR-ESPACE
    - Chaque espace ouvre un accès aux données propres accessibles à l'utilisateur et au module accueil-leadgenai pour lancer le générateur d'annonces et d'outils seo
---
# **Structure multi-tenant avec des Règles de visibilité hiérarchique**
  - Chaque entité dispose d’un espace de travail isolé et sécurisé, basé sur son organisation_id ou client_id.
  - La visibilité hiérarchique et les accès utilisateurs sont gérés exclusivement via les RLS policies SQL, appliquées sur les tables principales.
  - Les hooks front n’assurent que l’injection des identifiants organisationnels.
  - Nous suivons une structure multi tenant avec une structure de visibilité imposée.

**Pour les structures** **Réseaux**
| Type utilisateur | Accès espace | Voit les projets de |
|------------------|--------------|---------------------|
| `reseau` | `/accueil-leadgenai` | reseau + reseau_direction (projets internes au réseau et à sa direction) (Par respect confidentialité : Ne voit pas les projets des agences du réseau) |
| `reseau_direction` | `/accueil-leadgenai` | reseau + reseau_direction (projets internes au réseau et à sa direction) (Par respect confidentialité : Ne voit pas les projets des agences du réseau)  |
| `reseau_agence` | `/accueil-leadgenai` | reseau_agence + reseau_agence_responsable + reseau_agence_collaborateur |
| `reseau_agence_responsable` | `/accueil-leadgenai` | reseau_agence + reseau_agence_responsable + reseau_agence_collaborateur |
| `reseau_agence_collaborateur` | `/accueil-leadgenai` | **Uniquement ses propres projets** |

**Pour les structures** **Agences Indépendantes**
| Type utilisateur | Accès espace | Voit les projets de |
|------------------|--------------|---------------------|
| `agence_independante` | `/accueil-leadgenai` | agence_independante + agence_independante_responsable + agence_independante_collaborateur |
| `agence_independante_responsable` | `/accueil-leadgenai` | agence_independante + agence_independante_responsable + agence_independante_collaborateur |
| `agence_independante_collaborateur` | `/accueil-leadgenai` | **Uniquement ses propres projets** |
---
# **Architecture de NOMMAGE camelCase**
  - Tous les hooks, fonctions, et interactions Supabase créés lors de la migration **DOIVENT impérativement** :
      - Conserver la structure camelCase existante pour les champs métier (agencyName, propertyType, saleType, price, rentAmount, rentPeriodicity, keyElements, propertyDescription, financials, details, exclusivite, location, reference).
      - Utiliser snake_case uniquement pour les champs système Supabase (organisation_id, user_id, created_at, updated_at, project_id, etc.).
      - Contrairement à une idée reçue, PostgreSQL/Supabase accepte parfaitement les noms de colonnes en camelCase, ils sont simplement encadrés par des guillemets doubles dans les requêtes si nécessaire.
      - **Règles concernant le nommage des camelCase** :
      - **Règle SQL - Création de table** : Champs métier : `"camelCase"` (avec guillemets doubles) // Champs système : `snake_case` (sans guillemets)
      - **Règle TypeScript - Hooks & Services** : Utilisation directe du `camelCase` pour champs métier // Utilisation directe du `snake_case` pour champs système // AUCUNE fonction de conversion n'est nécessaire
      - **Règle Triggers** : Utiliser : `NEW."camelCase"` ou `NEW.snake_case` // Préférer les fonctions génériques réutilisables
---
#  **Stratégie de migration en 2 phases**
- Nous utilisons une stratégie de migration en 2 phases 
  - **Phase 1** : **Migrer l'ancien process Localstorage de récupération des infos au cours de 5 étapes et d'envoi vers -> Supabase**
    - Avec Récupération des données saisies par Utilisateur lors des étapes 1 à 5
    - Jusqu'à l'envoi des prompts vers OpenAI
    - Gérer Etape5animation avec process d'animation et de gestion du statut pendant la phase d'attente des données provenant de open ai
    
 - **Phase 2** : **Migrer l'ancien process Localstorage de récupération des données envoyée par Open ai et injection dans etape6communication vers -> Supabase**
   - Avec Récupération des données renvoyées par OpenAi
   - Avec injection dans la page etape6communication
   - Jusqu'à leur utilisation par les différents canaux
---
**Nous avons terminé la migration phase 1**
---

