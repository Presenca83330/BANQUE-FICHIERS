# ✅ Projet.Implantation.Form.Gestion — PATCH v2 (corrections Lovable)

Ce patch **n’affecte que votre nouveau projet** et **remplace** les fragments concernés dans  
`src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/.Projet.Implantation.Form.Gestion.md`.

## 🎯 Corrections incluses
1) **CORS sur Edge Functions** (`update-reseau`, `upload-reseau-files`)  
2) **.single() → .maybeSingle()** dans les hooks (robustesse si 0 résultat)  
3) **OpenAI `openai_email_compte` NOT NULL** (type + insert/update côté hook)  
4) **Cohérence Storage** : utilisation homogène de `filePath` (pas de `fileUrl`)  
5) Vérification : `GraphBoutonModifier` a bien `export default` (aucun changement requis)

---

## 1) `types.ts` — Mise à jour OpenAI (email non-null)

```ts
// src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/types.ts

// Types partagés pour la gestion des réseaux

export interface ReseauFormData {
  reseau_id: string;
  reseau_nom: string;
  reseau_identite_commerciale?: string;
  reseau_adresse: string;
  reseau_code_postal: string;
  reseau_ville: string;
  reseau_siret: string;
  reseau_statut?: string;
  reseau_logo?: string | null;
  reseau_documents?: string[];

  // FKs Intégrations (dans table reseau)
  reseau_brevo_connexion_id?: string | null;
  reseau_zoho_connexion_id?: string | null;
  reseau_openai_connexion_id?: string | null;

  // Lecture seule (venant de reseau_direction)
  direction_telephone?: string | null;
  direction_email?: string | null;

  // Confort pour l'onglet Intégrations (valeurs injectées si existantes)
  brevo_connexion?: BrevoIntegration | null;
  zoho_connexion?: ZohoIntegration | null;
  openai_connexion?: OpenAIIntegration | null;

  // Pivot pour les insertions (utile à l'upsert connexions)
  organisation_id?: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ReseauSelectorItem {
  reseau_id: string;
  reseau_nom: string;
  reseau_statut?: string;
  organisation_id?: string;
}

// -----------------------------
// Tables connexions (historisation API)
// -----------------------------
export interface BrevoIntegration {
  brevo_connexion_id: string;
  organisation_id: string;
  client_id: string;
  client_type: 'reseau';
  brevo_api_key: string;
  brevo_email_compte?: string | null;
  brevo_nom_compte?: string | null;
}

export interface ZohoIntegration {
  zoho_connexion_id: string;
  organisation_id: string;
  client_id: string;
  client_type: 'reseau';
  zoho_api_key: string;
  zoho_email_compte?: string | null;
  zoho_nom_compte?: string | null;
}

export interface OpenAIIntegration {
  openai_connexion_id: string;
  organisation_id: string;
  client_id: string;
  client_type: 'reseau';
  openai_api_key: string;
  // ⚠️ NOT NULL côté DB → type non-null côté TS
  openai_email_compte: string;
}

// -----------------------------
// Aides pour l'onglet Intégrations (forme des états locaux)
// -----------------------------
export type IntegrationKind = 'brevo' | 'zoho' | 'openai';

export interface BrevoFormState {
  brevo_connexion_id?: string | null;
  brevo_api_key?: string;
  brevo_email_compte?: string;
  brevo_nom_compte?: string;
}

export interface ZohoFormState {
  zoho_connexion_id?: string | null;
  zoho_api_key?: string;
  zoho_email_compte?: string;
  zoho_nom_compte?: string;
}

export interface OpenAIFormState {
  openai_connexion_id?: string | null;
  openai_api_key?: string;
  // État local facultatif, mais on forcera '' à l'insertion
  openai_email_compte?: string;
}

export interface IntegrationsState {
  organisation_id?: string;
  brevo: BrevoFormState;
  zoho: ZohoFormState;
  openai: OpenAIFormState;
}
```

---

## 2) `useReseauFormData.ts` — `.maybeSingle()` + garde “introuvable”

```ts
// src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/useReseauFormData.ts

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ReseauFormData, ReseauSelectorItem, ValidationErrors } from './types';

export function useReseauFormData() {
  const [reseaux, setReseaux] = useState<ReseauSelectorItem[]>([]);
  const [selectedReseauId, setSelectedReseauId] = useState<string>('');
  const [formData, setFormData] = useState<Partial<ReseauFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();

  const loadReseaux = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reseau')
        .select('reseau_id, reseau_nom, reseau_statut, organisation_id')
        .order('reseau_nom');
      if (error) throw error;
      setReseaux(data || []);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les réseaux', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadReseauData = useCallback(async (reseauId: string) => {
    if (!reseauId) return;
    setIsLoading(true);
    try {
      const { data: reseau, error } = await supabase
        .from('reseau')
        .select(`
          reseau_id,
          reseau_nom,
          reseau_identite_commerciale,
          reseau_adresse,
          reseau_code_postal,
          reseau_ville,
          reseau_siret,
          reseau_statut,
          reseau_logo,
          reseau_documents,
          reseau_brevo_connexion_id,
          reseau_zoho_connexion_id,
          reseau_openai_connexion_id,
          organisation_id,
          reseau_direction!inner (
            reseau_direction_telephone,
            reseau_direction_email
          )
        `)
        .eq('reseau_id', reseauId)
        .maybeSingle(); // ← robustesse si 0 résultat

      if (error) throw error;
      if (!reseau) {
        setFormData({});
        toast({ title: 'Introuvable', description: 'Réseau introuvable', variant: 'destructive' });
        return;
      }

      const direction_telephone = reseau.reseau_direction?.[0]?.reseau_direction_telephone ?? null;
      const direction_email = reseau.reseau_direction?.[0]?.reseau_direction_email ?? null;

      setFormData({ ...reseau, direction_telephone, direction_email });
      setErrors({});
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les données du réseau', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const validateForm = useCallback((data: Partial<ReseauFormData>): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!data.reseau_nom?.trim()) newErrors.reseau_nom = 'Le nom du réseau est obligatoire';
    if (!data.reseau_adresse?.trim()) newErrors.reseau_adresse = "L'adresse est obligatoire";
    if (!data.reseau_code_postal?.trim()) newErrors.reseau_code_postal = 'Le code postal est obligatoire';
    else if (!/^\d{5}$/.test(data.reseau_code_postal)) newErrors.reseau_code_postal = 'Le code postal doit contenir 5 chiffres';
    if (!data.reseau_ville?.trim()) newErrors.reseau_ville = 'La ville est obligatoire';
    if (!data.reseau_siret?.trim()) newErrors.reseau_siret = 'Le SIRET est obligatoire';
    else if (!/^\d{14}$/.test(data.reseau_siret.replace(/\s/g, ''))) newErrors.reseau_siret = 'Le SIRET doit contenir 14 chiffres';
    return newErrors;
  }, []);

  const saveReseau = useCallback(async (dataToSave: Partial<ReseauFormData>) => {
    if (!selectedReseauId) return false;

    const validationErrors = validateForm(dataToSave);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast({ title: 'Erreurs de validation', description: 'Veuillez corriger les erreurs', variant: 'destructive' });
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('update-reseau', {
        body: JSON.stringify({ reseauId: selectedReseauId, generalData: dataToSave }),
      });
      if (error) throw error;
      toast({ title: 'Succès', description: 'Réseau mis à jour avec succès' });
      await loadReseauData(selectedReseauId);
      return true;
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder les modifications', variant: 'destructive' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [selectedReseauId, validateForm, toast, loadReseauData]);

  const updateFormField = useCallback((field: keyof ReseauFormData | string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  }, [errors]);

  const selectReseau = useCallback((reseauId: string) => {
    setSelectedReseauId(reseauId);
    if (reseauId) { loadReseauData(reseauId); } else { setFormData({}); setErrors({}); }
  }, [loadReseauData]);

  return {
    reseaux,
    selectedReseauId,
    formData,
    isLoading,
    isSaving,
    errors,
    loadReseaux,
    selectReseau,
    updateFormField,
    saveReseau,
    validateForm,
    loadReseauData,
  };
}
```

---

## 3) `useReseauIntegrations.ts` — `.maybeSingle()` + OpenAI email forcé non-null

```ts
// src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/useReseauIntegrations.ts

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type {
  IntegrationsState,
  IntegrationKind,
  BrevoFormState,
  ZohoFormState,
  OpenAIFormState,
} from './types';

export function useReseauIntegrations() {
  const { toast } = useToast();
  const [state, setState] = useState<IntegrationsState>({
    organisation_id: undefined,
    brevo: {},
    zoho: {},
    openai: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadForReseau = useCallback(async (reseauId: string) => {
    if (!reseauId) return;
    setIsLoading(true);
    try {
      const { data: reseau, error } = await supabase
        .from('reseau')
        .select(`
          organisation_id,
          reseau_brevo_connexion_id,
          reseau_zoho_connexion_id,
          reseau_openai_connexion_id
        `)
        .eq('reseau_id', reseauId)
        .maybeSingle(); // ← robustesse
      if (error) throw error;
      if (!reseau) {
        setState({ organisation_id: undefined, brevo: {}, zoho: {}, openai: {} });
        toast({ title: 'Introuvable', description: 'Réseau introuvable', variant: 'destructive' });
        return;
      }

      const next: IntegrationsState = {
        organisation_id: reseau.organisation_id,
        brevo: {},
        zoho: {},
        openai: {},
      };

      if (reseau.reseau_brevo_connexion_id) {
        const { data: b } = await supabase
          .from('brevo_connexion')
          .select('brevo_connexion_id, brevo_api_key, brevo_email_compte, brevo_nom_compte')
          .eq('brevo_connexion_id', reseau.reseau_brevo_connexion_id)
          .maybeSingle(); // ← robustesse
        if (b) {
          next.brevo = {
            brevo_connexion_id: b.brevo_connexion_id,
            brevo_api_key: b.brevo_api_key,
            brevo_email_compte: b.brevo_email_compte ?? undefined,
            brevo_nom_compte: b.brevo_nom_compte ?? undefined,
          };
        }
      }

      if (reseau.reseau_zoho_connexion_id) {
        const { data: z } = await supabase
          .from('zoho_connexion')
          .select('zoho_connexion_id, zoho_api_key, zoho_email_compte, zoho_nom_compte')
          .eq('zoho_connexion_id', reseau.reseau_zoho_connexion_id)
          .maybeSingle(); // ← robustesse
        if (z) {
          next.zoho = {
            zoho_connexion_id: z.zoho_connexion_id,
            zoho_api_key: z.zoho_api_key,
            zoho_email_compte: z.zoho_email_compte ?? undefined,
            zoho_nom_compte: z.zoho_nom_compte ?? undefined,
          };
        }
      }

      if (reseau.reseau_openai_connexion_id) {
        const { data: o } = await supabase
          .from('openai_connexion')
          .select('openai_connexion_id, openai_api_key, openai_email_compte')
          .eq('openai_connexion_id', reseau.reseau_openai_connexion_id)
          .maybeSingle(); // ← robustesse
        if (o) {
          next.openai = {
            openai_connexion_id: o.openai_connexion_id,
            openai_api_key: o.openai_api_key,
            openai_email_compte: o.openai_email_compte ?? undefined,
          };
        }
      }

      setState(next);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les intégrations', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateField = useCallback((kind: IntegrationKind, field: string, value: string) => {
    setState(prev => ({ ...prev, [kind]: { ...(prev as any)[kind], [field]: value } }));
  }, []);

  const saveIntegration = useCallback(
    async (reseauId: string, kind: IntegrationKind) => {
      if (!reseauId) return false;
      setIsSaving(true);
      try {
        const orgId = state.organisation_id;
        if (!orgId) throw new Error('organisation_id introuvable');

        if (kind === 'brevo') {
          const data: BrevoFormState = state.brevo;
          if (data.brevo_connexion_id) {
            const { error } = await supabase
              .from('brevo_connexion')
              .update({
                brevo_api_key: data.brevo_api_key,
                brevo_email_compte: data.brevo_email_compte ?? null,
                brevo_nom_compte: data.brevo_nom_compte ?? null,
              })
              .eq('brevo_connexion_id', data.brevo_connexion_id);
            if (error) throw error;
          } else {
            const { data: inserted, error } = await supabase
              .from('brevo_connexion')
              .insert({
                organisation_id: orgId,
                client_id: reseauId,
                client_type: 'reseau',
                brevo_api_key: data.brevo_api_key ?? '',
                brevo_email_compte: data.brevo_email_compte ?? null,
                brevo_nom_compte: data.brevo_nom_compte ?? null,
              })
              .select('brevo_connexion_id')
              .maybeSingle(); // ← robustesse
            if (error) throw error;

            if (inserted?.brevo_connexion_id) {
              await supabase.functions.invoke('update-reseau', {
                body: JSON.stringify({ reseauId, generalData: { reseau_brevo_connexion_id: inserted.brevo_connexion_id } }),
              });
              setState(prev => ({ ...prev, brevo: { ...prev.brevo, brevo_connexion_id: inserted.brevo_connexion_id } }));
            }
          }
        }

        if (kind === 'zoho') {
          const data: ZohoFormState = state.zoho;
          if (data.zoho_connexion_id) {
            const { error } = await supabase
              .from('zoho_connexion')
              .update({
                zoho_api_key: data.zoho_api_key,
                zoho_email_compte: data.zoho_email_compte ?? null,
                zoho_nom_compte: data.zoho_nom_compte ?? null,
              })
              .eq('zoho_connexion_id', data.zoho_connexion_id);
            if (error) throw error;
          } else {
            const { data: inserted, error } = await supabase
              .from('zoho_connexion')
              .insert({
                organisation_id: orgId,
                client_id: reseauId,
                client_type: 'reseau',
                zoho_api_key: data.zoho_api_key ?? '',
                zoho_email_compte: data.zoho_email_compte ?? null,
                zoho_nom_compte: data.zoho_nom_compte ?? null,
              })
              .select('zoho_connexion_id')
              .maybeSingle(); // ← robustesse
            if (error) throw error;

            if (inserted?.zoho_connexion_id) {
              await supabase.functions.invoke('update-reseau', {
                body: JSON.stringify({ reseauId, generalData: { reseau_zoho_connexion_id: inserted.zoho_connexion_id } }),
              });
              setState(prev => ({ ...prev, zoho: { ...prev.zoho, zoho_connexion_id: inserted.zoho_connexion_id } }));
            }
          }
        }

        if (kind === 'openai') {
          const data: OpenAIFormState = state.openai;
          if (data.openai_connexion_id) {
            const { error } = await supabase
              .from('openai_connexion')
              .update({
                openai_api_key: data.openai_api_key,
                // ⚠️ NOT NULL → jamais null
                openai_email_compte: data.openai_email_compte || '',
              })
              .eq('openai_connexion_id', data.openai_connexion_id);
            if (error) throw error;
          } else {
            const { data: inserted, error } = await supabase
              .from('openai_connexion')
              .insert({
                organisation_id: orgId,
                client_id: reseauId,
                client_type: 'reseau',
                openai_api_key: data.openai_api_key ?? '',
                // ⚠️ NOT NULL → forcer une chaîne vide si non fournie
                openai_email_compte: data.openai_email_compte || '',
              })
              .select('openai_connexion_id')
              .maybeSingle(); // ← robustesse
            if (error) throw error;

            if (inserted?.openai_connexion_id) {
              await supabase.functions.invoke('update-reseau', {
                body: JSON.stringify({ reseauId, generalData: { reseau_openai_connexion_id: inserted.openai_connexion_id } }),
              });
              setState(prev => ({ ...prev, openai: { ...prev.openai, openai_connexion_id: inserted.openai_connexion_id } }));
            }
          }
        }

        toast({ title: 'Succès', description: 'Intégrations mises à jour avec succès' });
        return true;
      } catch {
        toast({ title: 'Erreur', description: "Impossible de sauvegarder l'intégration", variant: 'destructive' });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [state, toast]
  );

  const setBrevo = useCallback((patch: Partial<BrevoFormState>) => setState(prev => ({ ...prev, brevo: { ...prev.brevo, ...patch } })), []);
  const setZoho = useCallback((patch: Partial<ZohoFormState>) => setState(prev => ({ ...prev, zoho: { ...prev.zoho, ...patch } })), []);
  const setOpenAI = useCallback((patch: Partial<OpenAIFormState>) => setState(prev => ({ ...prev, openai: { ...prev.openai, ...patch } })), []);

  return {
    integrations: state,
    isLoading,
    isSaving,
    loadForReseau,
    updateField,
    saveIntegration,
    setBrevo,
    setZoho,
    setOpenAI,
  };
}
```

---

## 4) Edge `update-reseau` — +CORS (préflight + réponses)

```ts
// supabase/functions/update-reseau/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reseauId, generalData } = await req.json();
    if (!reseauId || !generalData) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), { status: 400, headers: corsHeaders });
    }

    const { error } = await supabase
      .from('reseau')
      .update(generalData)
      .eq('reseau_id', reseauId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch {
    return new Response(JSON.stringify({ error: 'Erreur interne update-reseau' }), { status: 500, headers: corsHeaders });
  }
});
```

---

## 5) Edge `upload-reseau-files` — +CORS (préflight + réponses)

```ts
// supabase/functions/upload-reseau-files/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' | 'document'
    const reseauId = formData.get('reseauId') as string;

    if (!file || !type || !reseauId) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), { status: 400, headers: corsHeaders });
    }

    const folder = type === 'logo' ? '1-logos' : '2-documents-institutionnels';
    const filePath = `reseau-${reseauId}/${folder}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase
      .storage
      .from('bucket-table-reseau')
      .upload(filePath, file.stream(), {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true, filePath }), { status: 200, headers: corsHeaders });
  } catch {
    return new Response(JSON.stringify({ error: 'Erreur interne upload-reseau-files' }), { status: 500, headers: corsHeaders });
  }
});
```

---

## 6) Rappel — Page Form (pas de changement requis)
- Le composant **conserve 100% le graphisme** validé (titres, placeholders, structure).  
- La logique **filePath** est déjà homogène côté page (`uploadFile` retourne `filePath` et les boutons *Voir* génèrent une URL signée à partir du **path**).  
- `GraphBoutonModifier` exporte bien `default` → rien à modifier.

---

## ✅ Conclusion
- **Vous pouvez coller ces fichiers tels quels** dans votre projet refondu.  
- Ils traitent **toutes** les remarques Lovable **sans toucher** à l’UI validée.  
- Votre **Formulaire de Gestion Réseau** est prêt à être implanté proprement.  
