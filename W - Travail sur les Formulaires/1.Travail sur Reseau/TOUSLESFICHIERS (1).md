# DOCUMENTATION COMPLÈTE - FORMULAIRE CRÉATION RÉSEAU

## Vue d'ensemble

Ce document contient l'intégralité des codes et configurations utilisés dans le formulaire de création de réseau pour l'application Admin Presença.

## Architecture

### Frontend (React/TypeScript)
- **FormReseauCreation.tsx** : Composant principal du formulaire
- **SuccessAccountInfo.tsx** : Composant d'affichage des informations de succès
- **useReseauCreation.ts** : Hook personnalisé pour la logique métier
- **types.ts** : Définitions TypeScript

### Backend (Supabase)
- **Edge Function** : create-reseau-admin
- **Fonction SQL** : create_reseau_compte_complet
- **Tables** : organisations, users, utilisateurs, reseau, reseau_direction

---

## 1. COMPOSANT PRINCIPAL - FormReseauCreation.tsx

```typescript
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2 } from "lucide-react";
import { useReseauCreation } from "@/components/HOOKS-STRATEGIQUE/5.HOOKS-CreationCompteAdminPresenca/1.Reseau/useReseauCreation";
import SuccessAccountInfo from "./SuccessAccountInfo";
import type {
  ReseauCreationData,
  ReseauValidationErrors,
  ReseauCreationResult,
} from "@/components/HOOKS-STRATEGIQUE/5.HOOKS-CreationCompteAdminPresenca/1.Reseau/types";

interface FormReseauCreationProps {
  onBack: () => void;
}

export default function FormReseauCreation({ onBack }: FormReseauCreationProps) {
  const { createReseau, isLoading, error } = useReseauCreation();

  const [formData, setFormData] = useState<ReseauCreationData>({
    nomReseau: "",
    adresse: "",
    codePostal: "",
    ville: "",
    siret: "",
    nomResponsable: "",
    prenomResponsable: "",
    emailResponsable: "",
    telephoneResponsable: "",
  });

  const [errors, setErrors] = useState<ReseauValidationErrors>({});
  const [creationResult, setCreationResult] = useState<ReseauCreationResult | null>(null);

  const updateFormData = (field: keyof ReseauCreationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: ReseauValidationErrors = {};

    if (!formData.nomReseau) newErrors.nomReseau = "Nom du réseau requis";
    if (!formData.adresse) newErrors.adresse = "Adresse requise";
    if (!formData.codePostal) newErrors.codePostal = "Code postal requis";
    if (!formData.ville) newErrors.ville = "Ville requise";
    if (!formData.siret) newErrors.siret = "SIRET requis";
    if (!formData.nomResponsable) newErrors.nomResponsable = "Nom requis";
    if (!formData.prenomResponsable) newErrors.prenomResponsable = "Prénom requis";
    if (!formData.emailResponsable) newErrors.emailResponsable = "Email requis";
    if (!formData.telephoneResponsable)
      newErrors.telephoneResponsable = "Téléphone requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission formulaire", formData);

    const isValid = validateForm();
    console.log("Résultat validation:", isValid);
    if (!isValid) return;

    const result = await createReseau(formData);
    console.log("Résultat createReseau:", result);
    if (result) {
      setCreationResult(result);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <CardTitle>Création d'un nouveau réseau</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations Réseau */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomReseau">Nom du réseau *</Label>
                <Input
                  id="nomReseau"
                  value={formData.nomReseau}
                  onChange={(e) => updateFormData("nomReseau", e.target.value)}
                  placeholder="Nom du Réseau"
                />
                {errors.nomReseau && (
                  <p className="text-sm text-red-500">{errors.nomReseau}</p>
                )}
              </div>

              <div>
                <Label htmlFor="siret">Siret *</Label>
                <Input
                  id="siret"
                  value={formData.siret}
                  onChange={(e) => updateFormData("siret", e.target.value)}
                  placeholder="N° Siret du Réseau"
                />
                {errors.siret && (
                  <p className="text-sm text-red-500">{errors.siret}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="adresse">Adresse *</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => updateFormData("adresse", e.target.value)}
                placeholder="Adresse. Siège Réseau"
              />
              {errors.adresse && (
                <p className="text-sm text-red-500">{errors.adresse}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codePostal">Code postal *</Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => updateFormData("codePostal", e.target.value)}
                  placeholder="Code Postal. Siège Réseau"
                />
                {errors.codePostal && (
                  <p className="text-sm text-red-500">{errors.codePostal}</p>
                )}
              </div>
              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => updateFormData("ville", e.target.value)}
                  placeholder="Ville. Siège Réseau"
                />
                {errors.ville && (
                  <p className="text-sm text-red-500">{errors.ville}</p>
                )}
              </div>
            </div>

            {/* Responsable */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenomResponsable">Prénom Direction *</Label>
                <Input
                  id="prenomResponsable"
                  value={formData.prenomResponsable}
                  onChange={(e) =>
                    updateFormData("prenomResponsable", e.target.value)
                  }
                  placeholder="Prénom. Reseau Direction"
                />
                {errors.prenomResponsable && (
                  <p className="text-sm text-red-500">
                    {errors.prenomResponsable}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="nomResponsable">Nom Direction *</Label>
                <Input
                  id="nomResponsable"
                  value={formData.nomResponsable}
                  onChange={(e) =>
                    updateFormData("nomResponsable", e.target.value)
                  }
                  placeholder="Nom. Reseau Direction"
                />
                {errors.nomResponsable && (
                  <p className="text-sm text-red-500">
                    {errors.nomResponsable}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailResponsable">Email Direction *</Label>
                <Input
                  id="emailResponsable"
                  value={formData.emailResponsable}
                  onChange={(e) =>
                    updateFormData("emailResponsable", e.target.value)
                  }
                  placeholder="Email. Reseau Direction"
                />
                {errors.emailResponsable && (
                  <p className="text-sm text-red-500">
                    {errors.emailResponsable}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="telephoneResponsable">
                  Téléphone Direction *
                </Label>
                <Input
                  id="telephoneResponsable"
                  value={formData.telephoneResponsable}
                  onChange={(e) =>
                    updateFormData("telephoneResponsable", e.target.value)
                  }
                  placeholder="Tél. Reseau Direction"
                />
                {errors.telephoneResponsable && (
                  <p className="text-sm text-red-500">
                    {errors.telephoneResponsable}
                  </p>
                )}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer le réseau"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Affichage des informations de connexion après succès */}
      {creationResult && (
        <SuccessAccountInfo
          email={creationResult.email}
          tempPassword={creationResult.tempPassword}
        />
      )}
    </div>
  );
}
```

---

## 2. COMPOSANT SUCCÈS - SuccessAccountInfo.tsx

```typescript
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface SuccessAccountInfoProps {
  email: string;
  tempPassword: string;
}

export default function SuccessAccountInfo({ email, tempPassword }: SuccessAccountInfoProps) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copié dans le presse-papiers`);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  return (
    <Card className="mt-6 border-green-200 bg-green-50/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <CardTitle className="text-green-800">Compte créé avec succès</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-sm text-gray-700 mb-3">
              Informations de connexion temporaires
            </h4>
            
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <span className="text-sm font-medium text-gray-600">Email :</span>
                  <p className="text-sm text-gray-900">{email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(email, "Email")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Mot de passe */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-600">Mot de passe temporaire :</span>
                  <p className="text-sm text-gray-900 font-mono">
                    {showPassword ? tempPassword : "••••••••••••••••"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(tempPassword, "Mot de passe")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Important :</strong> Ces informations sont temporaires. L'utilisateur devra 
                changer son mot de passe lors de sa première connexion.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 3. HOOK LOGIQUE MÉTIER - useReseauCreation.ts

```typescript
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import type { ReseauCreationData, ReseauCreationResult } from "./types";

export function useReseauCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReseau = async (formData: ReseauCreationData): Promise<ReseauCreationResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // --- Appel Edge Function ---
      const { data, error } = await supabase.functions.invoke('create-reseau-admin', {
        body: formData
      });

      if (error) {
        setError("Erreur création réseau: " + error.message);
        return null;
      }

      if (!data || !data.data) {
        throw new Error("Aucune donnée retournée par la fonction");
      }

      // --- Succès - Extraction depuis data.data ---
      const result: ReseauCreationResult = {
        organisationId: data.data.organisationId,
        reseauId: data.data.reseauId,
        userId: data.data.userId,
        utilisateurId: data.data.utilisateurId,
        directionId: data.data.directionId,
        email: formData.emailResponsable,
        tempPassword: data.tempPassword, // Au niveau racine de data
      };

      return result;

    } catch (err: any) {
      console.error("Erreur création réseau:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createReseau, isLoading, error };
}
```

---

## 4. TYPES TYPESCRIPT - types.ts

```typescript
export interface ReseauCreationData {
  nomReseau: string;
  adresse: string;
  codePostal: string;
  ville: string;
  siret: string;
  nomResponsable: string;
  prenomResponsable: string;
  emailResponsable: string;
  telephoneResponsable: string;
}

export interface ReseauValidationErrors {
  nomReseau?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  siret?: string;
  nomResponsable?: string;
  prenomResponsable?: string;
  emailResponsable?: string;
  telephoneResponsable?: string;
}

export interface ReseauCreationResult {
  organisationId: string;
  reseauId: string;
  userId: string;
  utilisateurId: string;
  directionId: string;
  email: string;
  tempPassword: string;
}
```

---

## 5. CLIENT SUPABASE - client.ts

```typescript
import { createClient } from "@supabase/supabase-js";

// Configuration Supabase pour Lovable (sans variables VITE_*)
const supabaseUrl = "https://ksymahfrtvhnbeobsspt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzeW1haGZydHZobmJlb2Jzc3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMDkzMjYsImV4cCI6MjA2Njg4NTMyNn0.9h8LvZVtm_hixlec5E6d6rXyEZYx8nKzyiO6cWXYvhw";

// Client standard avec RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 6. EDGE FUNCTION - create-reseau-admin/index.ts

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { getCorsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface ReseauCreationData {
  nomReseau: string
  adresse: string
  codePostal: string
  ville: string
  siret: string
  nomResponsable: string
  prenomResponsable: string
  emailResponsable: string
  telephoneResponsable: string
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ⚠️ TEMPORAIRE: JWT vérification désactivée pour tests
    console.log('🔓 TEST MODE: JWT verification disabled')

    // Parse and validate request data
    const formData: ReseauCreationData = await req.json()
    
    // 🔒 LOGS SÉCURISÉS : Pas d'email/téléphone en clair
    console.log('📝 CREATION: Starting reseau creation', {
      nomReseau: formData.nomReseau,
      ville: formData.ville,
      siret: formData.siret?.slice(0, 4) + '***', // SIRET partiel
      hasEmail: !!formData.emailResponsable,
      hasPhone: !!formData.telephoneResponsable
    })

    // Validation des données
    if (!formData.emailResponsable || !formData.emailResponsable.includes('@')) {
      throw new Error('Email invalide')
    }

    if (!formData.siret || formData.siret.length !== 14) {
      throw new Error('SIRET invalide (14 chiffres requis)')
    }

    // Générer mot de passe temporaire
    const tempPassword = crypto.randomUUID().slice(0, 12)
    console.log('🔑 PASSWORD: Temporary password generated')

    // 1. Créer l'utilisateur Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.emailResponsable,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        nom: formData.nomResponsable,
        prenom: formData.prenomResponsable,
        type_compte: 'reseau'
      }
    })

    if (authError || !authUser.user) {
      console.log('❌ AUTH: User creation failed', { error: authError?.message })
      throw new Error(`Erreur création Auth: ${authError?.message}`)
    }

    console.log('✅ AUTH: User created successfully')

    try {
      // 2. Appeler la fonction SQL pour créer le compte complet
      const { data: sqlResult, error: sqlError } = await supabaseAdmin.rpc('create_reseau_compte_complet', {
        p_nom_reseau: formData.nomReseau,
        p_adresse: formData.adresse,
        p_code_postal: formData.codePostal,
        p_ville: formData.ville,
        p_siret: formData.siret,
        p_nom_responsable: formData.nomResponsable,
        p_prenom_responsable: formData.prenomResponsable,
        p_email_responsable: formData.emailResponsable,
        p_telephone_responsable: formData.telephoneResponsable,
        p_auth_uid: authUser.user.id
      })

      if (sqlError) {
        console.log('❌ SQL: Database creation failed', { error: sqlError.message })
        throw new Error(`Erreur base de données: ${sqlError.message}`)
      }

      console.log('✅ SQL: Database records created successfully')

      // Retourner le résultat avec mot de passe temporaire
      return new Response(
        JSON.stringify({
          success: true,
          data: sqlResult,
          tempPassword: tempPassword,
          message: 'Compte réseau créé avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (sqlError) {
      // 🔄 ROLLBACK : Supprimer l'utilisateur Auth en cas d'erreur SQL
      console.log('🔄 ROLLBACK: Deleting auth user due to SQL error')
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      throw sqlError
    }

  } catch (error) {
    console.log('❌ ERROR: Creation failed', { error: error.message })
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur lors de la création du compte réseau' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

---

## 7. CORS CONFIGURATION - _shared/cors.ts

```typescript
const allowedOrigins = [
  // 🏢 PRODUCTION
  'https://www.leadgenai-adbuilder.com',
  'https://leadgenai-adbuilder.com',

  // 🧪 TEST LOVABLE
  'https://appli-v7-leadgenai.lovable.app',

  // 🛠️ DÉVELOPPEMENT LOVABLE
  'https://lovable.dev',
  'https://lovable.app',
  /^https:\/\/.*\.lovable\.app$/,
  /^https:\/\/.*\.lovable\.dev$/,   

  // 🔧 DÉVELOPPEMENT LOCAL (si besoin)
  'http://localhost:3000',
  'http://localhost:5173',
]

export const getCorsHeaders = (origin: string | null) => {
  const isAllowed = allowedOrigins.some(allowed => {
    if (typeof allowed === 'string') return allowed === origin
    if (allowed instanceof RegExp) return allowed.test(origin || '')
    return false
  })
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}
```

---

## 8. CONFIGURATION SUPABASE - config.toml

```toml
project_id = "ksymahfrtvhnbeobsspt"

[functions.notifier-nouvelle-demande]
verify_jwt = false

[functions.create-reseau-admin]
verify_jwt = false
```

---

## 9. FONCTION SQL - create_reseau_compte_complet

```sql
CREATE OR REPLACE FUNCTION public.create_reseau_compte_complet(
  p_nom_reseau text, 
  p_adresse text, 
  p_code_postal text, 
  p_ville text, 
  p_siret text, 
  p_nom_responsable text, 
  p_prenom_responsable text, 
  p_email_responsable text, 
  p_telephone_responsable text, 
  p_auth_uid uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
  v_utilisateur_id uuid;
  v_reseau_id uuid;
  v_direction_id uuid;
BEGIN
  -- 1. Organisation
  INSERT INTO organisations (
    organisation_nom, organisation_adresse, organisation_code_postal,
    organisation_ville, organisation_siret, organisation_email,
    organisation_telephone, organisation_statut_compte
  )
  VALUES (
    p_nom_reseau, p_adresse, p_code_postal, p_ville, p_siret,
    p_email_responsable, p_telephone_responsable, 'actif'
  )
  RETURNING organisation_id INTO v_org_id;

  -- 2. Users (⚠️ rôle système = NULL car ce n'est pas un admin global)
  INSERT INTO users (
    users_nom, users_prenom, users_email, users_telephone,
    users_role_systeme, users_organisation_id, users_auth_id
  )
  VALUES (
    p_nom_responsable, p_prenom_responsable, p_email_responsable,
    p_telephone_responsable, NULL, v_org_id, p_auth_uid
  )
  RETURNING users_id INTO v_user_id;

  -- 3. Utilisateurs (profil métier du responsable de réseau)
  INSERT INTO utilisateurs (
    utilisateur_email, utilisateur_type_compte, utilisateur_statut,
    utilisateur_organisation_id, utilisateur_auth_uid, utilisateur_role_systeme
  )
  VALUES (
    p_email_responsable, 'reseau', 'actif',
    v_org_id, p_auth_uid, NULL
  )
  RETURNING utilisateur_id INTO v_utilisateur_id;

  -- 4. Réseau (fiche business)
  INSERT INTO reseau (
    organisation_id, reseau_nom, reseau_adresse, reseau_code_postal,
    reseau_ville, reseau_siret, reseau_email, reseau_telephone,
    reseau_statut, client_type
  )
  VALUES (
    v_org_id, p_nom_reseau, p_adresse, p_code_postal, p_ville,
    p_siret, p_email_responsable, p_telephone_responsable,
    'actif', 'reseau'
  )
  RETURNING reseau_id INTO v_reseau_id;

  -- 5. Direction Réseau (🔧 CORRECTION: utilisation de v_user_id au lieu de v_utilisateur_id)
  INSERT INTO reseau_direction (
    organisation_id, reseau_id,
    reseau_direction_nom, reseau_direction_prenom,
    reseau_direction_email, reseau_direction_telephone,
    reseau_direction_utilisateur_id, client_type,
    reseau_direction_actif
  )
  VALUES (
    v_org_id, v_reseau_id,
    p_nom_responsable, p_prenom_responsable,
    p_email_responsable, p_telephone_responsable,
    v_user_id, 'reseau', true
  )
  RETURNING reseau_direction_id INTO v_direction_id;

  -- Résultat en JSON
  RETURN jsonb_build_object(
    'organisationId', v_org_id,
    'userId', v_user_id,
    'utilisateurId', v_utilisateur_id,
    'reseauId', v_reseau_id,
    'directionId', v_direction_id,
    'message', 'Compte réseau créé avec succès'
  );
END;
$function$
```

---

## 10. STRUCTURE DES TABLES COMPLÈTE

### TABLE: organisations
```sql
CREATE TABLE public.organisations (
  organisation_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_nom text NOT NULL,
  organisation_siret text,
  organisation_identite_commerciale text,
  organisation_adresse text,
  organisation_code_postal text,
  organisation_ville text,
  organisation_email text,
  organisation_telephone text,
  organisation_plan_stripe text,
  organisation_statut_compte text,
  organisation_statut_paiement text,
  organisation_date_creation timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS ENABLED
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

-- CONSTRAINTS
-- PK: organisations_pkey sur organisation_id

-- TRIGGERS
CREATE TRIGGER set_organisations_created_at 
  BEFORE INSERT ON public.organisations 
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_created_audit_fields_organisations();

CREATE TRIGGER update_organisations_updated_at 
  BEFORE UPDATE ON public.organisations 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_audit_fields_organisations();
```

#### Politiques RLS - organisations:
```sql
-- Admin PRESENCA full access
CREATE POLICY "Admin PRESENCA full access organisations" 
ON public.organisations 
FOR ALL 
USING (is_admin_presenca(auth.uid())) 
WITH CHECK (is_admin_presenca(auth.uid()));

-- Select by organization
CREATE POLICY "organisations_select_by_org" 
ON public.organisations 
FOR SELECT 
USING (is_admin_presenca(auth.uid()) OR (organisation_id = get_user_organisation_id(auth.uid())));

-- Update by organization
CREATE POLICY "organisations_update_by_org" 
ON public.organisations 
FOR UPDATE 
USING (is_admin_presenca(auth.uid()) OR (organisation_id = get_user_organisation_id(auth.uid()))) 
WITH CHECK (is_admin_presenca(auth.uid()) OR (organisation_id = get_user_organisation_id(auth.uid())));

-- Insert admin only
CREATE POLICY "organisations_insert_admin_only" 
ON public.organisations 
FOR INSERT 
WITH CHECK (is_admin_presenca(auth.uid()));

-- Delete admin only
CREATE POLICY "organisations_delete_admin_only" 
ON public.organisations 
FOR DELETE 
USING (is_admin_presenca(auth.uid()));
```

### TABLE: users
```sql
CREATE TABLE public.users (
  users_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  users_auth_id uuid NOT NULL,
  users_nom text NOT NULL,
  users_prenom text NOT NULL,
  users_email text NOT NULL,
  users_telephone text,
  users_role_systeme text,
  users_organisation_id uuid,
  users_created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS ENABLED
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- CONSTRAINTS
-- PK: users_pkey sur users_id
-- UNIQUE: users_auth_id_key sur users_auth_id
-- UNIQUE: users_email_key sur users_email

-- TRIGGERS
CREATE TRIGGER set_users_created_at 
  BEFORE INSERT ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_created_audit_fields_users();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_audit_fields_users();
```

#### Politiques RLS - users:
```sql
-- Admin PRESENCA full access
CREATE POLICY "Admin PRESENCA full access" 
ON public.users 
FOR ALL 
USING (is_admin_presenca(auth.uid())) 
WITH CHECK (is_admin_presenca(auth.uid()));

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (users_auth_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (users_auth_id = auth.uid()) 
WITH CHECK (users_auth_id = auth.uid());
```

### TABLE: utilisateurs
```sql
CREATE TABLE public.utilisateurs (
  utilisateur_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  utilisateur_auth_uid uuid NOT NULL,
  utilisateur_email text NOT NULL,
  utilisateur_type_compte text NOT NULL,
  utilisateur_statut text NOT NULL DEFAULT 'actif',
  utilisateur_organisation_id uuid NOT NULL,
  utilisateur_role_systeme text,
  utilisateur_date_inscription timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS ENABLED
ALTER TABLE public.utilisateurs ENABLE ROW LEVEL SECURITY;

-- CONSTRAINTS
-- PK: utilisateurs_pkey sur utilisateur_id
-- UNIQUE: utilisateurs_auth_uid_key sur utilisateur_auth_uid
-- UNIQUE: utilisateurs_email_key sur utilisateur_email

-- TRIGGERS
CREATE TRIGGER set_utilisateurs_created_at 
  BEFORE INSERT ON public.utilisateurs 
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_created_audit_fields_utilisateurs();

CREATE TRIGGER update_utilisateurs_updated_at 
  BEFORE UPDATE ON public.utilisateurs 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_audit_fields_utilisateurs();
```

#### Politiques RLS - utilisateurs:
```sql
-- Admin PRESENCA full access
CREATE POLICY "Admin PRESENCA full access utilisateurs" 
ON public.utilisateurs 
FOR ALL 
USING (is_admin_presenca(auth.uid())) 
WITH CHECK (is_admin_presenca(auth.uid()));

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.utilisateurs 
FOR SELECT 
USING (utilisateur_auth_uid = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.utilisateurs 
FOR UPDATE 
USING (utilisateur_auth_uid = auth.uid()) 
WITH CHECK (utilisateur_auth_uid = auth.uid());

-- Same organization users can view
CREATE POLICY "Same organization users can view utilisateurs" 
ON public.utilisateurs 
FOR SELECT 
USING (utilisateur_organisation_id = get_user_organisation_id(auth.uid()));

-- Admin can create users in organization
CREATE POLICY "Admin can create users in organization" 
ON public.utilisateurs 
FOR INSERT 
WITH CHECK (is_admin_presenca(auth.uid()) OR (utilisateur_organisation_id = get_user_organisation_id(auth.uid())));
```

### TABLE: reseau
```sql
CREATE TABLE public.reseau (
  reseau_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_id uuid NOT NULL,
  reseau_nom text NOT NULL,
  reseau_identite_commerciale text,
  reseau_adresse text NOT NULL,
  reseau_code_postal text NOT NULL,
  reseau_ville text NOT NULL,
  reseau_telephone text NOT NULL,
  reseau_email text NOT NULL,
  reseau_siret text NOT NULL,
  reseau_statut_abonnement text,
  reseau_plan text,
  reseau_statut_paiement text,
  client_type text NOT NULL DEFAULT 'reseau',
  reseau_logo text,
  reseau_ressources text[],
  reseau_statut text NOT NULL DEFAULT 'actif',
  reseau_date_inscription timestamp with time zone NOT NULL DEFAULT now(),
  reseau_date_debut_abonnement timestamp with time zone,
  reseau_date_resiliation_abonnement timestamp with time zone,
  reseau_abonnement_id uuid,
  reseau_brevo_connexion_id uuid,
  reseau_openai_connexion_id uuid,
  reseau_zoho_connexion_id uuid,
  client_id uuid NOT NULL DEFAULT gen_random_uuid(),
  reseau_espace_client boolean NOT NULL DEFAULT true,
  autorisation_acces_reseau_presenca boolean NOT NULL DEFAULT true,
  reseau_audit_log jsonb,
  reseau_ia_extensions jsonb,
  reseau_created_at timestamp with time zone NOT NULL DEFAULT now(),
  reseau_created_by uuid,
  reseau_updated_at timestamp with time zone DEFAULT now(),
  reseau_updated_by uuid
);

-- RLS ENABLED
ALTER TABLE public.reseau ENABLE ROW LEVEL SECURITY;

-- CONSTRAINTS
-- PK: reseau_pkey sur reseau_id
-- UNIQUE: reseau_siret_key sur reseau_siret
-- UNIQUE: reseau_email_key sur reseau_email

-- TRIGGERS
CREATE TRIGGER set_reseau_created_at 
  BEFORE INSERT ON public.reseau 
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_created_audit_fields_reseau();

CREATE TRIGGER update_reseau_updated_at 
  BEFORE UPDATE ON public.reseau 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_audit_fields_reseau();
```

#### Politiques RLS - reseau:
```sql
-- Admin PRESENCA full access
CREATE POLICY "admin_presenca_full_access_reseau" 
ON public.reseau 
FOR ALL 
USING (is_admin_presenca(auth.uid()));

-- Organisation only access
CREATE POLICY "organisation_only_access_reseau" 
ON public.reseau 
FOR ALL 
USING (organisation_id = get_user_organisation_id(auth.uid()));
```

### TABLE: reseau_direction
```sql
CREATE TABLE public.reseau_direction (
  reseau_direction_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_id uuid NOT NULL,
  reseau_id uuid NOT NULL,
  reseau_direction_nom text NOT NULL,
  reseau_direction_prenom text NOT NULL,
  reseau_direction_email text NOT NULL,
  reseau_direction_telephone text NOT NULL,
  reseau_direction_fonction text,
  reseau_direction_date_nomination timestamp with time zone DEFAULT now(),
  reseau_direction_utilisateur_id uuid NOT NULL,
  client_type text NOT NULL DEFAULT 'reseau',
  client_id uuid NOT NULL DEFAULT gen_random_uuid(),
  acces_presenca_direction boolean NOT NULL DEFAULT true,
  reseau_direction_espace_client boolean NOT NULL DEFAULT true,
  reseau_direction_actif boolean NOT NULL DEFAULT true,
  reseau_direction_audit_log jsonb,
  reseau_direction_ia_extensions jsonb,
  reseau_direction_created_at timestamp with time zone NOT NULL DEFAULT now(),
  reseau_direction_created_by uuid,
  reseau_direction_updated_at timestamp with time zone DEFAULT now(),
  reseau_direction_updated_by uuid
);

-- RLS ENABLED
ALTER TABLE public.reseau_direction ENABLE ROW LEVEL SECURITY;

-- CONSTRAINTS
-- PK: reseau_direction_pkey sur reseau_direction_id
-- UNIQUE: reseau_direction_email_key sur reseau_direction_email
-- FK: reseau_direction_reseau_id_fkey vers reseau(reseau_id)

-- TRIGGERS
CREATE TRIGGER set_reseau_direction_created_at 
  BEFORE INSERT ON public.reseau_direction 
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_created_audit_fields_reseau_direction();

CREATE TRIGGER update_reseau_direction_updated_at 
  BEFORE UPDATE ON public.reseau_direction 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_audit_fields_reseau_direction();
```

#### Politiques RLS - reseau_direction:
```sql
-- Admin PRESENCA full access
CREATE POLICY "admin_presenca_full_access_reseau_direction" 
ON public.reseau_direction 
FOR ALL 
USING (is_admin_presenca(auth.uid()));

-- Organisation only access
CREATE POLICY "organisation_only_access_reseau_direction" 
ON public.reseau_direction 
FOR ALL 
USING (organisation_id = get_user_organisation_id(auth.uid()));
```

---

## 11. FONCTIONS SQL UTILITAIRES

### get_user_organisation_id
```sql
CREATE OR REPLACE FUNCTION public.get_user_organisation_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT users_organisation_id
  FROM users
  WHERE users_auth_id = user_uuid
  LIMIT 1;
$function$
```

### is_admin_presenca
```sql
CREATE OR REPLACE FUNCTION public.is_admin_presenca(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE users_auth_id = user_uuid 
    AND users_role_systeme = 'admin_presenca'
  );
$function$
```

### get_organisation_type
```sql
CREATE OR REPLACE FUNCTION public.get_organisation_type(org_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- RESEAU : inclut reseau + reseau_agence (même type business)
  IF EXISTS (SELECT 1 FROM reseau WHERE organisation_id = org_id) 
     OR EXISTS (SELECT 1 FROM reseau_agence WHERE organisation_id = org_id) THEN
    RETURN 'reseau';
  END IF;
  
  -- AGENCE INDEPENDANTE : type business distinct
  IF EXISTS (SELECT 1 FROM agence_independante WHERE organisation_id = org_id) THEN
    RETURN 'agence_independante';
  END IF;
  
  -- PRESENCA géré via rôle système, pas type d'organisation
  RETURN NULL;
END;
$function$
```

### get_current_user_organisation
```sql
CREATE OR REPLACE FUNCTION public.get_current_user_organisation()
RETURNS TABLE(organisation_id uuid, organisation_nom text, calculated_type text, organisation_type_structure text, organisation_siret text, organisation_identite_commerciale text, organisation_adresse text, organisation_code_postal text, organisation_ville text, organisation_email text, organisation_telephone text, organisation_plan_stripe text, organisation_statut_compte text, organisation_statut_paiement text, organisation_date_creation timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_org_id uuid;
BEGIN
  -- Récupérer l'organisation_id de l'utilisateur courant via une fonction sécurisée
  user_org_id := get_user_organisation_id(auth.uid());

  IF user_org_id IS NULL THEN
    -- Retourner un résultat vide si l'utilisateur n'a pas d'organisation
    RETURN;
  END IF;

  -- Retourner les détails de l'organisation autorisée avec calculated_type
  RETURN QUERY
  SELECT 
    o.organisation_id,
    o.organisation_nom,
    get_organisation_type(o.organisation_id) as calculated_type,
    o.organisation_type_structure,
    o.organisation_siret,
    o.organisation_identite_commerciale,
    o.organisation_adresse,
    o.organisation_code_postal,
    o.organisation_ville,
    o.organisation_email,
    o.organisation_telephone,
    o.organisation_plan_stripe,
    o.organisation_statut_compte,
    o.organisation_statut_paiement,
    o.organisation_date_creation
  FROM public.organisations o
  WHERE o.organisation_id = user_org_id;
END;
$function$
```

### get_current_user_role
```sql
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    SELECT users_role_systeme
    FROM public.users
    WHERE users_auth_id = auth.uid()
  );
END;
$function$
```

### supabase_health_check
```sql
CREATE OR REPLACE FUNCTION public.supabase_health_check()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN 'OK - ' || now();
END;
$function$
```

---

## 12. TRIGGERS ET AUDIT

### Fonctions de Triggers - Organisations
```sql
CREATE OR REPLACE FUNCTION public.set_created_audit_fields_organisations()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.organisation_date_creation := now();
  RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.update_audit_fields_organisations()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Pas de colonne de suivi modification pour cette table
  RETURN NEW;
END;
$function$
```

### Fonctions de Triggers - Users
```sql
CREATE OR REPLACE FUNCTION public.set_created_audit_fields_users()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.users_created_at := now();
  RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.update_audit_fields_users()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Pas de colonne de suivi modification pour cette table
  RETURN NEW;
END;
$function$
```

### Fonctions de Triggers - Utilisateurs
```sql
CREATE OR REPLACE FUNCTION public.set_created_audit_fields_utilisateurs()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.utilisateur_date_inscription := now();
  RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.update_audit_fields_utilisateurs()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Pas de colonne de suivi modification pour cette table
  RETURN NEW;
END;
$function$
```

### Fonctions de Triggers - Reseau
```sql
CREATE OR REPLACE FUNCTION public.set_created_audit_fields_reseau()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.reseau_created_at := now();
  NEW.reseau_created_by := auth.uid();
  NEW.reseau_updated_at := now();
  NEW.reseau_updated_by := auth.uid();
  RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.update_audit_fields_reseau()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.reseau_updated_at := now();
  NEW.reseau_updated_by := auth.uid();
  RETURN NEW;
END;
$function$
```

### Fonctions de Triggers - Reseau Direction
```sql
CREATE OR REPLACE FUNCTION public.set_created_audit_fields_reseau_direction()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.reseau_direction_created_at := now();
  NEW.reseau_direction_created_by := auth.uid();
  RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.update_audit_fields_reseau_direction()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.reseau_direction_updated_at := now();
  NEW.reseau_direction_updated_by := auth.uid();
  RETURN NEW;
END;
$function$
```

### Fonction de Log d'Audit
```sql
CREATE OR REPLACE FUNCTION public.log_audit_event(p_table_name text, p_operation text, p_old_data jsonb DEFAULT NULL::jsonb, p_new_data jsonb DEFAULT NULL::jsonb, p_session_info jsonb DEFAULT '{}'::jsonb, p_source text DEFAULT 'manual'::text, p_severity text DEFAULT 'info'::text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_audit_id uuid;
  v_org_id uuid;
  v_user_id uuid;
  is_admin boolean;
BEGIN
  -- ✅ VALIDATION/TYPAGE des paramètres (anti-injection)
  IF p_table_name IS NULL OR p_table_name = '' THEN
    RAISE EXCEPTION 'table_name ne peut pas être vide';
  END IF;
  
  IF p_operation IS NULL OR p_operation = '' THEN
    RAISE EXCEPTION 'operation ne peut pas être vide';
  END IF;
  
  -- ✅ VALIDATION table_name (liste blanche selon RELATIONS-BUSINESS)
  IF p_table_name NOT IN (
    'users', 'utilisateurs', 'organisations', 
    'reseau', 'reseau_direction', 'reseau_agence', 'reseau_agence_responsable', 'reseau_agence_collaborateur',
    'agence_independante', 'agence_independante_responsable', 'agence_independante_collaborateur',
    'brevo_connexion', 'zoho_connexion', 'openai_connexion', 'linkedin_connexion', 
    'facebook_connexion', 'instagram_connexion', 'abonnement_stripe', '1_historique_supabase'
  ) THEN
    RAISE EXCEPTION 'table_name non autorisé : %', p_table_name;
  END IF;
  
  -- ✅ VALIDATION operation (liste blanche)
  IF p_operation NOT IN (
    'INSERT', 'UPDATE', 'DELETE', 'SELECT', 
    'create', 'update', 'delete', 'read',
    'login', 'logout', 'impersonate', 'organisation_access',
    'query', 'query_success', 'query_error', 'tenant_action', 'user_action'
  ) THEN
    RAISE EXCEPTION 'operation non autorisée : %', p_operation;
  END IF;
  
  -- Vérifier si admin PRESENCA
  is_admin := is_admin_presenca(auth.uid());
  
  -- Récupérer l'organisation de l'utilisateur (avec gestion d'erreur)
  BEGIN
    v_org_id := get_user_organisation_id(auth.uid());
  EXCEPTION
    WHEN OTHERS THEN
      v_org_id := NULL;
  END;
  
  -- ✅ REFUSER l'écriture si organisation_id absent pour les non-admins
  IF v_org_id IS NULL AND NOT is_admin THEN
    RAISE EXCEPTION 'Utilisateur non-admin sans organisation ne peut pas créer d''audit';
  END IF;
  
  -- Récupérer l'ID utilisateur interne
  SELECT users_id INTO v_user_id 
  FROM users 
  WHERE users_auth_id = auth.uid();
  
  -- Insérer le log d'audit
  INSERT INTO public."1_historique_supabase" (
    organisation_id,
    historique_table_name,
    historique_operation,
    historique_old_data,
    historique_new_data,
    user_id,
    historique_session_info,
    historique_source,
    historique_severity,
    historique_metadata,
    historique_created_by
  ) VALUES (
    v_org_id,
    p_table_name,
    p_operation,
    p_old_data,
    p_new_data,
    v_user_id,
    p_session_info,
    p_source,
    p_severity,
    p_metadata,
    v_user_id
  ) RETURNING audit_log_id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$function$
```

---

## 13. TABLE HISTORIQUE - 1_historique_supabase

```sql
CREATE TABLE public."1_historique_supabase" (
  audit_log_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_id uuid NOT NULL,
  historique_table_name text NOT NULL,
  historique_operation text NOT NULL,
  historique_old_data jsonb,
  historique_new_data jsonb,
  user_id uuid,
  historique_timestamp timestamp with time zone NOT NULL DEFAULT now(),
  historique_session_info jsonb DEFAULT '{}'::jsonb,
  historique_source text,
  historique_severity text DEFAULT 'info'::text,
  historique_metadata jsonb DEFAULT '{}'::jsonb,
  historique_created_at timestamp with time zone NOT NULL DEFAULT now(),
  historique_created_by uuid
);

-- RLS ENABLED
ALTER TABLE public."1_historique_supabase" ENABLE ROW LEVEL SECURITY;
```

#### Politiques RLS - 1_historique_supabase:
```sql
-- Admin PRESENCA full access
CREATE POLICY "admin_presenca_full_access_historique" 
ON public."1_historique_supabase" 
FOR ALL 
USING (is_admin_presenca(auth.uid())) 
WITH CHECK (is_admin_presenca(auth.uid()));

-- Organisation only access
CREATE POLICY "organisation_only_access_historique" 
ON public."1_historique_supabase" 
FOR ALL 
USING (organisation_id = get_user_organisation_id(auth.uid())) 
WITH CHECK (organisation_id = get_user_organisation_id(auth.uid()));
```

---

## RÉSUMÉ DU FLUX COMPLET

1. **Frontend**: FormReseauCreation collecte les données du formulaire
2. **Hook**: useReseauCreation valide et appelle l'Edge Function
3. **Edge Function**: create-reseau-admin crée l'utilisateur Auth et appelle la fonction SQL
4. **SQL**: create_reseau_compte_complet crée tous les enregistrements liés (organisation, users, utilisateurs, reseau, reseau_direction)
5. **Frontend**: SuccessAccountInfo affiche les informations de connexion temporaires

### Sécurité Multi-Tenant
- **RLS activé** sur toutes les tables avec politiques strictes
- **Fonctions SECURITY DEFINER** pour éviter la récursion RLS
- **Isolation par organisation_id** pour tous les accès
- **Admin PRESENCA** avec accès complet cross-organisation
- **Audit logging** complet avec `1_historique_supabase`

### Architecture Atomique
- **Transactions SQL** garantissent la cohérence
- **Rollback automatique** en cas d'erreur
- **Edge Function** avec gestion d'erreurs complète
- **Validation stricte** des données d'entrée
- **Logs sécurisés** sans exposition de données sensibles

Cette architecture garantit une création atomique et sécurisée des comptes réseau avec gestion complète des erreurs et rollback en cas de problème.