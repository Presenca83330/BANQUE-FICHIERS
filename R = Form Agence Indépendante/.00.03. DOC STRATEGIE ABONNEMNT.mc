# 📋 Stratégie Abonnement Stripe pour Agence Indépendante

## Contexte
Une fois le clone parfait de la structure `reseau` → `agence_independante` réalisé (avec tous les hooks et Edge Functions fonctionnels), vous pourrez aborder l'onglet "Abonnement" en 2 phases progressives.

---

## 🎯 PHASE 1 : Lecture Seule (Affichage Basique)

### Objectif
Afficher les informations d'abonnement **depuis la table `agence_independante`** uniquement, sans interaction Stripe.

### Fichiers à CRÉER

#### 1. Edge Function
📁 `supabase/functions/gestion-agence-independante-abonnement/index.ts`

**Actions implémentées :**
- `load` : SELECT des champs abonnement depuis `agence_independante`
  - `agence_indep_plan`
  - `agence_indep_date_debut_abonnement`
  - `agence_indep_statut_abonnement`
  - `agence_indep_statut_paiement`
  - `agence_indep_date_resiliation_abonnement`

**Pattern :**
- CORS headers
- Logs structurés (requestId, durée)
- Gestion erreurs robuste
- `verify_jwt = false` dans `config.toml`

#### 2. Hook métier
📁 `src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/6.AgenceIndependante/hooks/useAgenceIndependanteAbonnement.ts`

**Fonctionnalités :**
- `loadAbonnementData(agenceIndepId: string)` : Appel Edge Function action `load`
- État `abonnementData` : `AbonnementFormState`
- État `isLoading` : Indicateur chargement
- Gestion valeurs par défaut : `"Aucun abonnement"` si NULL
- Toast erreurs utilisateur

### Fichiers à MODIFIER

#### 1. Types
📁 `src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/6.AgenceIndependante/hooks/types.ts`

**Ajouter :**
```typescript
export interface AbonnementFormState {
  plan: string;
  dateDebut: string | null;
  statut?: string;
  statutPaiement?: string;
  dateResiliation?: string | null;
}
```

#### 2. Supabase Config
📁 `supabase/config.toml`

**Ajouter :**
```toml
[functions.gestion-agence-independante-abonnement]
verify_jwt = false
```

#### 3. Formulaire Gestion
📁 `src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/6.AgenceIndependante/3.FormAgenceIndependanteGestion.tsx`

**Modifications :**
- Import `useAgenceIndependanteAbonnement`
- `useEffect` pour charger au changement d'agence
- Remplacer les valeurs statiques par `abonnementData.plan`, `abonnementData.dateDebut`
- Bouton "Modifier" toujours désactivé avec message "Stripe non configuré"

### Résultat Phase 1
✅ Affichage lecture seule des données abonnement  
✅ Architecture propre et évolutive  
✅ Aucune interaction Stripe  
✅ Bouton "Modifier" visible mais désactivé

---

## 🚀 PHASE 2 : Intégration Complète Stripe

### Objectif
Synchroniser avec Stripe, permettre modification/résiliation des abonnements, et gérer les webhooks.

### Prérequis
- Table `abonnement_stripe` opérationnelle
- Clé API Stripe configurée dans secrets Supabase
- Service Stripe initialisé (inspiré de `src/components/ADMIN-PRESENCA/Stripe/`)

### Edge Function à ENRICHIR
📁 `supabase/functions/gestion-agence-independante-abonnement/index.ts`

**Nouvelles actions :**

#### Action `sync`
- JOIN `agence_independante` + `abonnement_stripe`
- Appel API Stripe pour récupérer statut réel
- Retour données enrichies :
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `stripe_plan_name`
  - `stripe_current_period_end`
  - `stripe_status`
  - `stripe_cancel_at_period_end`

#### Action `update_plan`
- Validation : nouveau plan valide
- Appel Stripe API : `subscriptions.update()`
- Mise à jour `agence_independante.agence_indep_plan`
- Mise à jour `abonnement_stripe`
- Log audit dans `1_historique_supabase`

#### Action `cancel`
- Appel Stripe API : `subscriptions.cancel()` ou `subscriptions.update({ cancel_at_period_end: true })`
- Mise à jour `agence_indep_date_resiliation_abonnement`
- Mise à jour `abonnement_stripe.abonnement_stripe_statut = 'canceled'`
- Log audit

#### Action `reactivate`
- Appel Stripe API : `subscriptions.update({ cancel_at_period_end: false })`
- Réinitialisation `agence_indep_date_resiliation_abonnement = NULL`
- Mise à jour statuts

### Hook à ENRICHIR
📁 `src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/6.AgenceIndependante/hooks/useAgenceIndependanteAbonnement.ts`

**Nouvelles fonctionnalités :**

#### 1. État Stripe enrichi
```typescript
const [stripeData, setStripeData] = useState(null);
```

#### 2. Fonction `syncWithStripe(agenceIndepId)`
- Appel Edge Function action `sync`
- Mise à jour `stripeData`
- Affichage informations Stripe temps réel

#### 3. Fonction `updatePlan(agenceIndepId, newPlan)`
- Validation formulaire
- Appel Edge Function action `update_plan`
- Toast succès/erreur
- Rafraîchissement automatique

#### 4. Fonction `cancelSubscription(agenceIndepId)`
- Confirmation utilisateur (AlertDialog)
- Appel Edge Function action `cancel`
- Toast + rafraîchissement

#### 5. Fonction `reactivateSubscription(agenceIndepId)`
- Appel Edge Function action `reactivate`
- Toast + rafraîchissement

### Types à AJOUTER
📁 `types.ts`

```typescript
export interface StripeAbonnementData {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_plan_name: string;
  stripe_current_period_end: string | null;
  stripe_status: string;
  stripe_cancel_at_period_end: boolean;
}
```

### Composant UI à MODIFIER
📁 `FormAgenceIndependanteGestion.tsx`

**Onglet "Abonnement" enrichi :**

#### Carte 1 : Abonnement Actuel
- Plan actuel (lecture seule)
- Date de début
- Statut Stripe (badge coloré)
- Fin période en cours
- **Bouton "Synchroniser avec Stripe"** → `syncWithStripe()`

#### Carte 2 : Modification Abonnement
- Sélecteur de plan (Select)
- Bouton "Modifier le plan" (actif) → `updatePlan()`
- Bouton "Résilier" (destructive) → `cancelSubscription()`
- Bouton "Réactiver" (visible si `cancel_at_period_end = true`) → `reactivateSubscription()`

#### Carte 3 : Historique Paiements
- Liste des derniers paiements (récupérés via Stripe API)
- Montant, date, statut
- Lien vers facture Stripe

### SQL à AJOUTER (optionnel)
Si vous souhaitez enrichir la logique métier :

#### Vue `v_agence_independante_abonnement_complet`
- JOIN `agence_independante` + `abonnement_stripe` + `organisations`
- Facilite les requêtes complexes

#### Trigger `sync_abonnement_stripe_to_agence`
- Synchronisation automatique `abonnement_stripe` → `agence_independante`
- Garantit cohérence données

### Webhooks Stripe (avancé)
📁 `supabase/functions/stripe-webhook/index.ts` (à créer)

**Événements à gérer :**
- `customer.subscription.updated` → Mise à jour `abonnement_stripe`
- `customer.subscription.deleted` → Résiliation automatique
- `invoice.payment_succeeded` → Log paiement réussi
- `invoice.payment_failed` → Notification admin + client

### Résultat Phase 2
✅ Synchronisation temps réel avec Stripe  
✅ Modification/résiliation/réactivation abonnements  
✅ Historique paiements  
✅ Webhooks automatisés  
✅ Logs audit complets  
✅ UX moderne et intuitive

---

## 📊 Comparaison Phase 1 vs Phase 2

| Critère | Phase 1 | Phase 2 |
|---------|---------|---------|
| **Source données** | `agence_independante` uniquement | `agence_independante` + Stripe API |
| **Modification** | ❌ Désactivée | ✅ Complète |
| **Synchronisation** | ❌ Aucune | ✅ Temps réel |
| **Webhooks** | ❌ Non | ✅ Oui |
| **Complexité** | 🟢 Simple | 🔴 Avancée |
| **Prérequis** | Aucun | API Stripe + `abonnement_stripe` |

---

## 🗺️ Roadmap Recommandée

1. **Aujourd'hui** : Cloner structure `reseau` → `agence_independante`
2. **Semaine prochaine** : Implémenter Phase 1 Abonnement (2-3h)
3. **Dans 2 semaines** : Tester Phase 1 en production
4. **Mois prochain** : Planifier Phase 2 si besoin métier confirmé
5. **Future** : Webhooks Stripe + Dashboard analytics avancé

---

**💡 Conseil :** La Phase 1 est suffisante pour 80% des cas d'usage. N'implémentez la Phase 2 que si vous avez un besoin réel de gestion dynamique des abonnements via l'interface admin.

Ça te convient pour ta to-do liste ? 🎯
