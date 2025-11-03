# 🎯 STRATÉGIE DE MIGRATION LOCALSTORAGE → SUPABASE

**Migration en 2 temps** :
- Phase 1 :
    - Migrer le process Localstorage -> Supabase
        - Pour les étapes 1 à 5
        - Jusqu'à l"envoi des prompts vers OpenAI
- Phase 2 :
    - Migrer le process Localstorage -> Supabase
        - De Etape5animation avec process d'animation et de gestion du statut pendant la phase d'attente des données provenant de open ai
        - En passant par la récupération des données envoyée par Open ai : 7 générations OpenAI
        - Jusqu'à la récupération par etape6communication
        - Et l'utilisation par les 8 canaux
---
---
## Étapes 1 à Étape 5 (Phase 1)
---
## 📋 PRINCIPE GÉNÉRAL MIGRATION PHASE 1

**Objectif** : 
- Migrer les **14 champs `propertyData`** des étapes 1-4 vers Supabase
- Préparer et envoyer les données à OpenAI (INPUT)
- Utiliser les **7 prompts spécifiques** (définis dans `src/services/openai/1.GenerateurAnnoncesOutilsSeo/7.PromptsOpenAi/`)

**Ce qui reste en localStorage dans cette phase 1** : 
- Les **7 générations OpenAI** restent en l'état, on les laisse temporairement dans `localStorage`
- Le **statut de génération** (`generation_status`) reste également dans `localStorage`
- Afin de laisser la compatibilité temporaire avec **Étape 6 Communication** qui reste en `localStorage`
- Afin de **limiter les risques** et identifier plus facilement de potentiels bugs

**Table unique** : `etapes_1to5` (contient uniquement les données utilisateur collectées)

---

## 1️⃣ STRUCTURE DE LA TABLE `etapes_1to5`

```sql
TABLE: etapes_1to5
├── id (uuid, PK, auto-généré)
├── organisation_id (uuid, FK, NOT NULL)  
├── user_id (uuid, FK, NOT NULL)
│
├── ===== MÉTADONNÉES =====
├── statut (text: 'brouillon', 'en_cours', 'complete', 'archive')
├── created_at (timestamptz, auto)
├── updated_at (timestamptz, auto)
├── derniere_etape_completee (integer: 1-5)
│
├── ===== ÉTAPE 1 : ÉLÉMENTS CLÉS (10 champs) =====
├── agency_name (text, NOT NULL)
├── reference (text, NOT NULL, UNIQUE per organisation)
├── exclusivite (text: 'Oui', 'Non', default: 'Non')
├── location (text, NOT NULL)
├── property_type (text, NOT NULL)
├── sale_type (text: 'à vendre', 'à louer', default: 'à vendre')
├── price (text, nullable si location)
├── rent_amount (text, nullable si vente)
├── rent_periodicity (text: 'Mensuel', 'Trimestriel', 'Annuel', nullable)
├── key_elements (text, NOT NULL, formaté avec puces)
│
├── ===== ÉTAPE 2 : DESCRIPTION (1 champ) =====
├── property_description (text, NOT NULL, formaté avec puces)
│
├── ===== ÉTAPE 3 : FINANCIALS (1 champ) =====
├── financials (text, NOT NULL, formaté avec puces)
│
└── ===== ÉTAPE 4 : DÉTAILS (2 champs) =====
    ├── details (text, nullable, formaté avec puces)
    └── has_no_details (boolean, default false)
```

**⚠️ IMPORTANT : Aucun champ de génération OpenAI dans cette table pour Phase 1**

---

## 2️⃣ HOOKS ET FONCTIONS À CRÉER

### A. **Hook principal : `useProjetAnnonce`** (remplace les opérations localStorage)

**Responsabilités** :
- Créer un nouveau projet
- Charger un projet existant
- Sauvegarder (upsert) les données d'une étape
- Récupérer les données pour toutes les étapes
- **Ne gère PAS** les générations OpenAI (restent dans localStorage)

**Méthodes exposées** :
```typescript
{
  // Données du projet actuel
  projetData: EtapesData | null,
  isLoading: boolean,
  error: string | null,

  // Actions
  creerNouveauProjet: () => Promise, // Retourne projetId
  chargerProjet: (projetId: string) => Promise,
  sauvegarderEtape: (etapeNum: 1-4, data: Partial) => Promise,

  // Utility
  getProjetActuel: () => EtapesData | null,
  marquerEtapeComplete: (etapeNum: number) => Promise,

  // Export pour Étape 5 (transformation des données pour OpenAI)
  getPropertyDataForOpenAI: () => PropertyData
}
```

### B. **Hook de progression : `useStepProgress`** (mise à jour)

**Changements** :
- Ne plus lire/écrire dans `localStorage.stepProgress`
- Lire `derniere_etape_completee` depuis Supabase via `useProjetAnnonce`
- Sauvegarder la progression via `marquerEtapeComplete()`

**Signature reste identique** :
```typescript
{
  availableSteps: number[],
  disabledSteps: number[],
  completeStep: (step: number) => Promise,
  hasCompletedStep4: boolean,
  goToEtape5: () => void,
  handleConfirmNewProject: () => Promise,
  isStepAvailable: (step: number) => boolean
}
```

---

## 3️⃣ ANALYSE ÉTAPE PAR ÉTAPE

### **ÉTAPE 1 - 10 champs + logique de validation**

**Champs concernés** :
- `agencyName` (text, required, capitalisation 1ère lettre)
- `reference` (text, required, capitalisation 1ère lettre)
- `exclusivite` (radio: Oui/Non, default: Non)
- `location` (text, required, capitalisation 1ère lettre)
- `propertyType` (text, required, capitalisation 1ère lettre)
- `saleType` (radio: "à vendre"/"à louer", default: "à vendre")
- `price` (text monétaire, required SI saleType="à vendre", formatage: espaces + €)
- `rentAmount` (text monétaire, required SI saleType="à louer", formatage: espaces + €)
- `rentPeriodicity` (radio: Mensuel/Trimestriel/Annuel, default: Mensuel, visible SI location)
- `keyElements` (textarea, required, formatage puces automatiques)

**Contraintes Supabase** :
```sql
-- Contrainte conditionnelle pour price/rentAmount
CREATE OR REPLACE FUNCTION check_etape1_price_rent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sale_type = 'à vendre' AND (NEW.price IS NULL OR NEW.price = '') THEN
    RAISE EXCEPTION 'Le prix est obligatoire pour une vente';
  END IF;

  IF NEW.sale_type = 'à louer' AND (NEW.rent_amount IS NULL OR NEW.rent_amount = '') THEN
    RAISE EXCEPTION 'Le loyer est obligatoire pour une location';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_etape1_price_rent
  BEFORE INSERT OR UPDATE ON etapes_1to5
  FOR EACH ROW
  EXECUTE FUNCTION check_etape1_price_rent();
```

**Bouton "Modifier"** :
- Actuellement géré via navigation directe `/etape1` avec pré-remplissage
- **Pas de changement** : même logique, mais données depuis Supabase au lieu de localStorage

**Fonction de sauvegarde** :
```typescript
// Dans EnsembleFormulairesEtape1Form.tsx
const handleValidation = async () => {
  // Validations côté client (inchangées)
  if (!agencyName.trim()) { /* toast error */ return false; }
  // ... autres validations

  // Sauvegarde Supabase (au lieu de updatePropertyData)
  await sauvegarderEtape(1, {
    agency_name: agencyName,
    reference,
    exclusivite,
    location,
    property_type: propertyType,
    sale_type: saleType,
    price,
    rent_amount: rentAmount,
    rent_periodicity: rentPeriodicity,
    key_elements: keyElements
  });

  await marquerEtapeComplete(1);
  toast({ title: "Informations validées" });
  return true;
};
```

---

### **ÉTAPE 2 - 1 champ + logique de formatage**

**Champ concerné** :
- `propertyDescription` (textarea, required, formatage puces automatiques + capitalisation)

**Particularité** :
- Formatage automatique via `FormulaireSaisie` (préservé côté client)
- Valeur **déjà formatée** envoyée à Supabase

**Fonction de sauvegarde** :
```typescript
const handleValidation = async () => {
  if (!propertyDescription.trim()) { /* toast error */ return; }

  await sauvegarderEtape(2, { property_description: propertyDescription });
  await marquerEtapeComplete(2);
  toast({ title: "Description validée" });
  navigate("/etape3");
};
```

---

### **ÉTAPE 3 - 1 champ + logique de formatage**

**Champ concerné** :
- `financials` (textarea, required, formatage puces automatiques + capitalisation)

**Fonction de sauvegarde** :
```typescript
const handleValidation = async () => {
  if (!financials.trim()) { /* toast error */ return; }

  await sauvegarderEtape(3, { financials });
  await marquerEtapeComplete(3);
  toast({ title: "Informations financières validées" });
  navigate("/etape4");
};
```

---

### **ÉTAPE 4 - 2 champs + logique conditionnelle**

**Champs concernés** :
- `details` (textarea, optional, formatage puces)
- `hasNoDetails` (checkbox, default: false)

**Contrainte métier** :
- Choix **obligatoire** : soit `details` rempli, soit `hasNoDetails=true`

**Contrainte Supabase** :
```sql
CREATE OR REPLACE FUNCTION check_etape4_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Si hasNoDetails=false ET details vide -> Erreur
  IF (NEW.has_no_details = false) AND (NEW.details IS NULL OR NEW.details = '') THEN
    RAISE EXCEPTION 'Veuillez saisir des informations complémentaires ou cocher la case "Je n''ai pas d''informations"';
  END IF;

  -- Si hasNoDetails=true -> Forcer details à vide
  IF NEW.has_no_details = true THEN
    NEW.details = '';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_etape4_details
  BEFORE INSERT OR UPDATE ON etapes_1to5
  FOR EACH ROW
  EXECUTE FUNCTION check_etape4_details();
```

**Fonction de sauvegarde** :
```typescript
const handleValidation = async () => {
  if (!hasNoDetails && details.trim() === "") {
    toast({ title: "Attention", description: "Choix obligatoire..." });
    return;
  }

  await sauvegarderEtape(4, {
    details: hasNoDetails ? "" : details,
    has_no_details: hasNoDetails
  });
  await marquerEtapeComplete(4);
  toast({ title: hasNoDetails ? "Pas d'infos complémentaires" : "Informations validées" });
  navigate("/etape5");
};
```

---

### **ÉTAPE 5 - Préparation et envoi à OpenAI**

**⚠️ CHANGEMENT MAJEUR POUR PHASE 1** :
- **On récupère** les 14 champs depuis Supabase
- **On envoie** les prompts à OpenAI
- **On stocke les résultats** dans `localStorage` (comme actuellement)
- **On stocke `generation_status`** dans `localStorage` (comme actuellement)

**Process adapté** :
```typescript
// Etape5.tsx - handleValidateAndFinish()
const handleValidateAndFinish = async () => {
  setIsGenerating(true);

  // 1. Récupérer les données du projet depuis Supabase
  const propertyData = await getPropertyDataForOpenAI();

  // 2. Initialiser le statut de génération dans localStorage (inchangé)
  localStorage.setItem('generation_status', JSON.stringify({
    startTime: Date.now(),
    websiteAd: false,
    summarySheet: false,
    newsletter: false,
    seoTools: false,
    smsAd: false,
    googleBusinessProfile: false,
    reseauxSociaux: false,
    completed: false,
    progress: 0
  }));

  navigate("/etape5/animation");

  // 3. Lancer les 7 générations séquentielles
  // GÉNÉRATION 1
  const websiteAdResult = await openAIService.generateWebsiteAd(propertyData);
  localStorage.setItem('generation_website_ad', JSON.stringify(websiteAdResult));

  // Mise à jour du statut
  const currentStatus = JSON.parse(localStorage.getItem('generation_status') || '{}');
  localStorage.setItem('generation_status', JSON.stringify({
    ...currentStatus,
    websiteAd: true,
    progress: 14
  }));

  // ... (répéter pour les 6 autres générations)

  // 4. Marquer comme terminé dans Supabase
  await marquerEtapeComplete(5);

  // 5. Marquer comme terminé dans localStorage
  localStorage.setItem('generation_status', JSON.stringify({
    ...currentStatus,
    completed: true,
    progress: 100
  }));

  navigate("/etape6communication");
};
```

**✅ Avantages de cette approche** :
- Minimise les changements dans Étape 5
- Aucun changement dans Animation.tsx
- Aucun changement dans Étape 6 Communication
- Permet de tester la migration des étapes 1-4 indépendamment

---

---

## 4️⃣ GESTION DES BOUTONS "MODIFIER"

**Scénario** : Utilisateur sur Étape 5 → Clique "Modifier Étape 2" → Modifie la description → Retour Étape 5

**Logique actuelle (localStorage)** :
```typescript
// Dans SaisieDescriptionForm.tsx
const handleBackToEtape5 = () => {
  if (propertyDescription.trim()) {
    updatePropertyData({ propertyDescription }); // localStorage
    toast({ title: "Modifications sauvegardées" });
  }
  goToEtape5();
};
```

**Logique Supabase** :
```typescript
const handleBackToEtape5 = async () => {
  if (propertyDescription.trim()) {
    await sauvegarderEtape(2, { property_description: propertyDescription });
    toast({ title: "Modifications sauvegardées" });
  }
  goToEtape5();
};
```

**✅ Pas de changement d'UX** : même comportement, juste persistance différente

---

## 5️⃣ PRÉPARATION DES DONNÉES POUR OPENAI

**Données utilisées par les prompts** :

| Prompt | Champs `propertyData` utilisés | Champ `details` inclus ? |
|--------|-------------------------------|-------------------------|
| **Site Internet** | Tous SAUF `details` | ❌ Non |
| **Fiche Synthèse** | **TOUS** (y compris `details`) | ✅ Oui |
| **Newsletter** | Tous SAUF `details` | ❌ Non |
| **Outils SEO** | Tous SAUF `details` | ❌ Non |
| **SMS** | Tous SAUF `details` | ❌ Non |
| **Google** | Tous SAUF `details` | ❌ Non |
| **Réseaux** | Tous SAUF `details` | ❌ Non |

**Transformation Supabase → PropertyData** :
```typescript
// Dans useProjetAnnonce.ts
const getPropertyDataForOpenAI = (): PropertyData => {
  if (!projetData) throw new Error("Aucun projet chargé");

  return {
    agencyName: projetData.agency_name,
    reference: projetData.reference,
    exclusivite: projetData.exclusivite,
    location: projetData.location,
    propertyType: projetData.property_type,
    saleType: projetData.sale_type,
    price: projetData.price,
    rentAmount: projetData.rent_amount,
    rentPeriodicity: projetData.rent_periodicity,
    keyElements: projetData.key_elements,
    propertyDescription: projetData.property_description,
    financials: projetData.financials,
    details: projetData.details,
    hasNoDetails: projetData.has_no_details
  };
};
```

**⚠️ Point crucial** : Les prompts OpenAI utilisent déjà le formatage avec puces (`• `). **Conserver le formatage** dans les champs textarea AVANT envoi à Supabase.

---

## 6️⃣ COMPATIBILITÉ AVEC ÉTAPE 6 COMMUNICATION

**Aucun changement requis pour Phase 1** :
- Étape 6 continue de lire depuis `localStorage`
- Les 7 générations OpenAI sont déjà dans `localStorage` (stockées par Étape 5)
- Le `generation_status` est déjà dans `localStorage`

**⚠️ Point d'attention** :
- Si l'utilisateur recharge la page avant d'atteindre Étape 6 → risque de perte des générations OpenAI
- **Solution temporaire** : Ajouter un message d'avertissement sur Étape 5animation ("Ne fermez pas cette page")
- **Solution Phase 2** : Migrer les générations vers Supabase

---

## 7️⃣ GESTION DU NOUVEAU PROJET

**Scénario** : Utilisateur termine Étape 6 → Clique "Nouveau projet"

**Logique actuelle** :
```typescript
const handleConfirmNewProject = () => {
  localStorage.clear();
  toast({ title: "✅ Nouveau projet créé avec succès" });
  navigate("/etape1");
  window.location.reload();
};
```

**Logique Supabase** :
```typescript
const handleConfirmNewProject = async () => {
  // 1. Archiver le projet actuel dans Supabase
  await sauvegarderEtape(1, { statut: 'archive' });

  // 2. Nettoyer localStorage
  localStorage.clear();

  // 3. Créer un nouveau projet dans Supabase
  const nouveauProjetId = await creerNouveauProjet();

  toast({ title: "✅ Nouveau projet créé avec succès" });
  navigate("/etape1");
  window.location.reload();
};
```

---

## 8️⃣ POLICIES RLS SUPABASE

**Accès organisationnel strict** :

```sql
-- SELECT : Utilisateur peut voir ses projets
CREATE POLICY "organisation_select_etapes"
ON etapes_1to5 FOR SELECT
USING (organisation_id = get_user_organisation_id(auth.uid()));

-- INSERT : Utilisateur peut créer un projet
CREATE POLICY "organisation_insert_etapes"
ON etapes_1to5 FOR INSERT
WITH CHECK (
  organisation_id = get_user_organisation_id(auth.uid())
  AND user_id = auth.uid()
);

-- UPDATE : Utilisateur peut modifier ses projets
CREATE POLICY "organisation_update_etapes"
ON etapes_1to5 FOR UPDATE
USING (
  organisation_id = get_user_organisation_id(auth.uid())
  AND user_id = auth.uid()
);

-- DELETE : Uniquement admin PRESENCA
CREATE POLICY "admin_delete_etapes"
ON etapes_1to5 FOR DELETE
USING (is_admin_presenca(auth.uid()));

-- Admin PRESENCA : Accès total
CREATE POLICY "admin_full_access_etapes"
ON etapes_1to5 FOR ALL
USING (is_admin_presenca(auth.uid()))
WITH CHECK (is_admin_presenca(auth.uid()));
```

---

## 9️⃣ PLAN D'IMPLÉMENTATION PAR PRIORITÉ

### **PHASE 1A : Infrastructure Supabase**
1. Créer la table `etapes_1to5` (14 champs)
2. Créer les triggers de validation (price/rent, details)
3. Créer les policies RLS
4. Tester la table manuellement

### **PHASE 1B : Hooks et services**
5. Créer `useProjetAnnonce.ts`
6. Adapter `useStepProgress.ts`
7. Tester les hooks isolément

### **PHASE 1C : Migration des composants**
8. Migrer Étape 1 (10 champs)
9. Migrer Étape 2 (1 champ)
10. Migrer Étape 3 (1 champ)
11. Migrer Étape 4 (2 champs)
12. Adapter Étape 5 (récupération Supabase → envoi OpenAI → stockage localStorage)


### **PHASE 1D : Tests et validation**
14. Tester le flux complet Étape 1 → 5animation
15. Tester les boutons "Modifier"
16. Tester "Nouveau projet"
17. Valider la compatibilité avec Étape 6

---

## 1️⃣1️⃣ CRITÈRES DE SUCCÈS PHASE 1

✅ **Table `etapes_1to5` créée et fonctionnelle**  
✅ **RLS policies validées** (isolation organisation)  
✅ **Hooks `useProjetAnnonce` et `useStepProgress` opérationnels**  
✅ **Étapes 1-4 sauvegardent dans Supabase**  
✅ **Étape 5 récupère depuis Supabase et envoie à OpenAI**  
✅ **Générations OpenAI stockées dans localStorage**  
✅ **Animation.tsx fonctionne sans modification**  
✅ **Étape 6 Communication fonctionne sans modification**  
✅ **Boutons "Modifier" fonctionnels**  
✅ **"Nouveau projet" crée une nouvelle entrée Supabase**

---

## 1️⃣2️⃣ PRÉPARATION PHASE 2

**Ce qui sera migré en Phase 2** :
- Etape5animation
- Les **7 générations OpenAI** (depuis localStorage → Supabase)
- Le **statut de génération** (`generation_status`)
- Les **modifications utilisateur** d'Étape 6 (`key-modifs-*`)
- Migration **canal par canal** (8 canaux)

**Tables supplémentaires à créer en Phase 2** :
- `generations_openai` (pour stocker les 7 générations)
- `modifications_utilisateur` (pour stocker les personnalisations canal par canal)

---


