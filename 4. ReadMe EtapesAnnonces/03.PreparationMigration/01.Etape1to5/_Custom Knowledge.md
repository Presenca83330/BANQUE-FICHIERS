## **1/ Présentation**
Bonjour 
- Tu es un expert en Ia no code et intégration supabese.
- Lis et Mémorise toutes ces directives et parcours tous ces liens
- J'ai besoin de toi pour corriger mon process de migration localstorage vers supabase qui a des erreurs
- Mais avant tu dois
- ETAPE 1 -> Analyser tout ce qui fonctionne à merveille en localstorage
- ETAPE2 -> Comprendre ce qui avait été prévu et coder
- ETAPE 3 -> On fera ensemble la correction
---
**# ETAPE 1** - **ANALYSE DE LA L'APPLICATION EN MODE LOCALSTORAGE**
---
## **DIRECTIVE 1/  Lis et Analyse les Docs Stratégiques**
Pour mener ta mission, tu dois avoir une vision complète de mon application commence par lire les documents suivants : 
  - public/1. Documents Stratégiques/01. Présentation LeadGenAi.md
  - public/1. Documents Stratégiques/02. Présentation Structure LeadGenAi.md
  - public/1. Documents Stratégiques/03. Logique Organisations.md
  - public/1. Documents Stratégiques/04. Relations Business entre Tables.md
  - public/1. Documents Stratégiques/05. Relations Users Utilisateurs.md
  - public/1. Documents Stratégiques/06. Référence des Hooks Stratégiques.md
  - public/1. Documents Stratégiques/07.1. Stratégie - Gestion des informations partagées entre Réseau et Réseau Direction.md
  - public/1. Documents Stratégiques/08. Gestion du Menu Gauche.md
  - public/1. Documents Stratégiques/09. Structure - Organisation | Client_id.md
  - public/1. Documents Stratégiques/10. Structure des Tables de Connexion & Règles Collaborateurs.md
---
## **DIRECTIVE 2/ Lis et Analyse les Process d'authentification et d'intégration supabase**
  - src/components/HOOKS-STRATEGIQUE/1.HOOK-useAuth
  - src/components/HOOKS-STRATEGIQUE/2.HOOK-useCurrentUser
  - src/components/HOOKS-STRATEGIQUE/3.HOOK-useMultiTenant
  - src/components/HOOKS-STRATEGIQUE/4.HOOK-useSupabaseOperations
  - src/integrations/supabase
 ---  
 ## **DIRECTIVE 3/ Lis et Analyse le process de création / modification de table par admin_presenca**   
    - public/3. ReadMe FormPresenca/00.BibleGenerationFormTables/02.TemplateFormCreation.md
    - public/3. ReadMe FormPresenca/00.BibleGenerationFormTables/03.TemplateFormGestion.md
    - src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau
    - src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/6.AgenceIndependante
---
## **DIRECTIVE 4/ Lis et Analyse les tables dans Supabase**
    - Analyse la structure des tables stratégiques/clients/connexion dans supabase
---
## **DIRECTIVE 5/ lis et Analyse les fichiers et fonctions actuelles de l'application**
    - Analyse les fichiers à partir de : src/
---
## **DIRECTIVE 6/ Analyse et mémorise tous les process en Localstorage**
- **PARTIE 1 : Lis et Analyse les process de récolte des informations dans les étapes 1 à 5 et envoi des données structurées à Open AI**
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/01.Etape1.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/02.Etape2.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/03.Etape3.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/04.Etape4.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/05.Etape5.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/06.Etape5animation.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/07.BilanEtape1aEtape5.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/08.ProcessEnvoiInfosOpenAI.md
    - public/4. ReadMe EtapesAnnonces/01.Etape1à5/09.ProcessPassageEtapeSuivante.md
- **PARTIE 2 : Lis et Analyse comment sont récupérées les données de OPen Ai et utilisée dans etape6communication**
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/00.ProcessRecuperationOpenAI.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/01.SiteInternetAnnonces.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/02.SiteInternetOutilsSeo.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/03.PortailsImmobiliers.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/04.CréerEmailingCampagneNewsletter.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/05.EnvoyerCampagneSMS.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/06.CréerLandingPage.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/07.DiffuserGoogleMB.md
    - public/4. ReadMe EtapesAnnonces/02.Etape6Communication/08.DiffuserReseaux.md
---
## **DIRECTIVE 7/ Analyse les documents références**
- Ces ressources permettent d'avoir toutes les données sous la main
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/02--0.BibleRéférences.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/02--1.MenuGaucheNavLinks.md
---
# **FIN ETAPE 1** -> **ANALYSE DE LA L'APPLICATION EN MODE LOCALSTORAGE**
---
---
# **ETAPE 2** -> **COMPRENDRE MA STRATEGIE ET LES FICHIERS QUI ONT ETE CREES POUR LA MIGRATOIN**
--
## **DIRECTIVE 8 : Mon projet de migration Supabase**
  - Je vais te parler maintenant de mon projet de migration. J ai travaillé avec toi sur un projet d application simple c'est pour ça que l'on a  travaillé en localstorage
  - Puis je me suis aperçu qu'elle etait géniale en localstorage tout fonctionne à merveille mais il m est impossible de la commercialiser en l etat je dois passer par supabase
  - mais pour que tu comprennes, et c'est essentiel, je veux juste passer d un process localstorage à un process supabase mais tout doit rester en l'etat, pas d'optimisation, pas d'amélioration
  - Tout fonctionne parfaitement
    - Il faut garder les champs, les process... les validatons tout.
    - Et simplement basculer
  - Cette condition est impérative et non négociable
  - En résumé, mission actuelle migrer d'un modèle MVP en LocalStorage vers un modèle structuré Supabase

### **Objectif global**
 - Créer une architecture SaaS multi-tenant complète permettant
   - à chaque utilisateur, (réseau, réseau direction, réseau agence, réseau agence responsable, réseau agence collaborateur, agence indépendante, agence indépendante responsable, agence indépendante collaborateur)
   - d’accéder à leur espace et tout particulièrement leur espace de création d’annonces en 5 étapes relié à OpenAI,
   - avec gestion sécurisée des données via Supabase.
   - Objectif clair : mettre en place la structre avec Supabse pour que lorsqu'un utilisateur se connecte (reseau, reseau direction, agence independante etc)
   - Il puisse travailler sur son espace
     - pour récupérer des informations via le process en 5 étapes (etape1/2/3/4/5/5animation)
     - pour envoyer les données vers open ai
     - qui restituera les annonces sous un format imposé pour être utilisées dans etape6communication
     - et permettre à l'utilisateur de choisir les fonctions qu'il souhaite utiliser (annonce site internet, outils seo, emailing, sms etc...)
    
  ### **Impératif : MIGRER A L'IDENTIQUE**
  - Aujourd'hui l'application fonctionne à merveille,
  - L'OBJECTIF : est simplement de Passer de localStorage à Supabase
  - SANS RIEN CHANGER D'AUTRE
  - Garder TOUS les champs (noms, types, structures)
  - Garder TOUS les processus (création, validation, gestion)
  - Garder TOUTES les validations (côté client identiques)
  - Garder TOUTE la logique métier (hooks, formulaires, flows)
  - Garder TOUTE l'UX/UI (même comportement utilisateur)
    - C'est une migration technique pure, pas une refonte.

### **Structure multi-tenant Supabase et Règles de visibilité hiérarchique**
- Chaque entité dispose d’un espace de travail isolé et sécurisé, basé sur son organisation_id ou client_id.
- La visibilité hiérarchique est contrôlée par admin_presenca.

La visibilité hiérarchique et les accès utilisateurs sont gérés exclusivement via les RLS policies SQL, appliquées sur les tables principales. Les hooks front n’assurent que l’injection des identifiants organisationnels.

### **Flux utilisateur global**
- Connexion / Authentification
  - Authentification via Supabase (email / mot de passe)
- Accès à l’espace personnel
  - Redirection automatique selon le rôle :
    - RESEAU-ESPACE
    - CLIENT-ESPACE
    - COLLABORATEUR-ESPACE
    - Chaque espace ouvre un accès aux données propres accessibles à l'utilisateur et au module accueil-leadgenai pour lancer le générateur d'annonces et d'outils seo
    - Prochainement il permettra de récupérer les historiques des annonces en fonction de ses projets propres ou de son statut dans la structure multi tenant.
---
## **Directive 9/ Stratégie de migration en 2 phases**
- Nous utilisons une stratégie de migration en 2 phases non négociable
- **Phase 1** :
    - Migrer le process Localstorage vers -> Supabase
        - Pour les étapes 1 à 5
        - Jusqu'à l"envoi des prompts vers OpenAI
- **Phase 2** :
    - Migrer le process Localstorage vers -> Supabase
        - De Etape5animation avec process d'animation et de gestion du statut pendant la phase d'attente des données provenant de open ai
        - En passant par la récupération des données envoyée par Open ai : 7 générations OpenAI
        - Jusqu'à la récupération par etape6communication
        - Et l'utilisation par les 8 canaux
  - ** Nous travaillons exclusivement sur la migration Phase 1**
---
## **Directive 10/ Conservation non négociable du nommage camelCase**
  - Nous suivons une architecture avec CONSERVATION DU NOMMAGE camelCase non négociable
  - Tous les hooks, fonctions, et interactions Supabase créés lors de la migration
    - **DOIVENT impérativement** :
      - Conserver la structure camelCase existante pour les champs métier (agencyName, propertyType, saleType, price, rentAmount, rentPeriodicity, keyElements, propertyDescription, financials, details, exclusivite, location, reference).
      - Utiliser snake_case uniquement pour les champs système Supabase (organisation_id, user_id, created_at, updated_at, project_id, etc.).
  - Cette directive s'apppliquera à chacune de tes creations de fichier
    - (ce n est pas la peine de me faire de synthèse)

**Règles concernant le nommage des camelCase**
- **Règle SQL - Création de table**
    - Champs métier : `"camelCase"` (avec guillemets doubles)
    - Champs système : `snake_case` (sans guillemets)
- **Règle TypeScript - Hooks & Services**
    - Utilisation directe du `camelCase` pour champs métier
    - Utilisation directe du `snake_case` pour champs système
    - **AUCUNE fonction de conversion n'est nécessaire**
- **Règle Triggers**
    - Utiliser : `NEW."camelCase"` ou `NEW.snake_case`
    - Préférer les fonctions génériques réutilisables
  - Cette directive s'apppliquera à chacune de tes creations de fichier

---
## **Directive 11/ Structure Multi tenant**
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

La visibilité hiérarchique et les accès utilisateurs sont gérés exclusivement via les RLS policies SQL, appliquées sur les tables principales. Les hooks front n’assurent que l’injection des identifiants organisationnels.
---
## **DIRECTIVE 12/ Analyse des documents préparatoires
- Pour m'aider à mettre en place, j ai demandé à OPen ai et Claude de me préparer des documents préparatoires jusqu'aux codes finaux
- Mais j'ai qu'il y avait des erreurs
- Ta mission va être ici de lire tous les documents qui ont été préparés, ils sont dans l'ordre de création, donc parfois il y a des amenagements mais tu dois comprnndre le process
- 
- **1/ lis comment j ai défini ma stratégie de migration localstorage - vers supabase**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/.00--0.StrategiePhase1.md
- **2/ lis ces documents qui prévoit la creation de la table pour cette migrationt, la logique multi tenant associé, et une focntion qu on va laisser en stand by**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/01--0.Table_etapes1to5.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/01--1.GestionStrategieMultiTenant.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/01--2.FonctionTimer.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/01--3.ExplicationdesChamps.md
- **3/ Lis les documets qui présentent les gdes lignes de la road map de la stratégie migration phase 1**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/03--0.DétailStratégiePhase1.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/03--1.TableauRecapElementsACréer.md
- **4/ Lis les directives concernant les services open ai,  et la création de 2 nouvelles tables**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/04--0.Section4-Directives.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/04--1.Section4-TableOpenAiKeys.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/04--2.Section4-TableOpenAILogs.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/04--3.Section4-Précisions.md
      - (Ce dernier do a ete fait par Claude ia qui a apporté des correctifs section 4 qui l ont conduit a coder différemment
- **5/ Lis ce sont les docs que open ai et claude on rédigé pour préparer le codage, un sorte de cahier des cahrges et une separation en 5 section**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/05--0.DocsPréparatoireCodagePhase1.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/05--1.DocSection1Validée.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/05--2.DocSection2Validée.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/05--3.DocSection3Validée.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/05--4.DocSection4Validée.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/05--5.DocSection5Validée.md
- **6/ Lis ce sont les Codes définitifs qui ont été écrit par open ai et claude et devaient etre utilisés il faut que tu travailles sur ces documents car ce sont eux qui sont défnitifs et permettaient de soutenir l architecture**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/08--1.CodesSection1.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/08--2.CodesSection2.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/08--3.CodesSection3.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/08--4.CodesSection4.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/08--5.CodesSection5.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/08--6.CodesSqlTables.md
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/09--PlandeMigration.md
- **7/ Lis le plan de migration fait par Claude mais il n a intégré aucun fichier et codes prévus dans les codes de la section 1**
    - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/09--PlandeMigration.md
- **8/ Lis ce document de Claude - une sorte d'analyse**
    - Claude a tenté de restituer l architecture de codes des 5 sections + sql faite
    - Attention doc à utiliser avec modération il peut y avoi des errerus public
      - public/4. ReadMe EtapesAnnonces/03.PreparationMigration/01.Etape1to5/11--ArchitClaudeSections.md

---
---
---
## DIRECTIVE FINALE**

- Ton travail de correction et de codage final doit s'inscrire dans des obligations impératives
- 1. Respecter tous les process actuels Localstorage
  2. Ne pas modifier ces process qui fonctionnent
  3. Juste permettre la migration vers Supabase
  4. Se libérer d'un modèle Localstorage vers un modèle 100% supabase en Phase 1
  5. Mais, pour l'instant la récupération des données de open ai restent en localstorage, le passage en supabase sera fait si la mission Phase 1 est validée
  6. Respecter une structure multi tenant
---
---
---
