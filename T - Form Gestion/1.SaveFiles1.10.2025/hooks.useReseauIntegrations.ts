import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { BrevoFormState, ZohoFormState, OpenAIFormState } from './types';

export function useReseauIntegrations() {
  const { toast } = useToast();

  // ✅ organisation_id séparé
  const [organisationId, setOrganisationId] = useState<string | null>(null);

  // ✅ États UI (formulaire uniquement)
  const [brevo, setBrevo] = useState<BrevoFormState>({});
  const [zoho, setZoho] = useState<ZohoFormState>({});
  const [openai, setOpenAI] = useState<OpenAIFormState>({});

  // ✅ IDs techniques séparés
  const [brevoConnexionId, setBrevoConnexionId] = useState<string | null>(null);
  const [zohoConnexionId, setZohoConnexionId] = useState<string | null>(null);
  const [openaiConnexionId, setOpenaiConnexionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ================================
  // 🔑 SERVICE_ROLE_KEY - Charger les intégrations d'un réseau
  // ================================
  const loadForReseau = useCallback(async (reseauId: string) => {
    if (!reseauId) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gestion-reseau-admin-donnees', {
        body: { reseauId }
      });
      if (error) throw error;
      
      if (!data?.reseau) {
        // Reset states
        setOrganisationId(null);
        setBrevo({});
        setZoho({});
        setOpenAI({});
        setBrevoConnexionId(null);
        setZohoConnexionId(null);
        setOpenaiConnexionId(null);
        return;
      }
      
      const reseau = data.reseau;
      const integrations = data.integrations;
      
      setOrganisationId(reseau.organisation_id);
      setBrevo(integrations?.brevo || {});
      setZoho(integrations?.zoho || {});
      setOpenAI(integrations?.openai || {});
      setBrevoConnexionId(reseau.reseau_brevo_connexion_id);
      setZohoConnexionId(reseau.reseau_zoho_connexion_id);
      setOpenaiConnexionId(reseau.reseau_openai_connexion_id);
      
    } catch (e: any) {
      console.error('Erreur loadForReseau', e);
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de charger les intégrations', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // ================================
  // 🔑 SERVICE_ROLE_KEY - Sauvegarde d'une intégration (🚀 OPTIMISÉ)
  // ================================
  const saveIntegration = useCallback(
    async (reseauId: string, kind: 'brevo' | 'zoho' | 'openai') => {
      if (!reseauId) return false;
      if (!organisationId) {
        toast({ title: 'Erreur', description: 'organisation_id introuvable', variant: 'destructive' });
        return false;
      }
      setIsSaving(true);

      try {
        let state: any;
        switch (kind) {
          case 'brevo':
            state = brevo;
            break;
          case 'zoho':
            state = zoho;
            break;
          case 'openai':
            state = openai;
            break;
        }

        const { data, error } = await supabase.functions.invoke('gestion-reseau-admin-update', {
          body: { 
            reseauId,
            integrationKind: kind,
            integrationData: state
          }
        });
        if (error) throw error;

        // 🚀 OPTIMISATION : Utiliser les données retournées directement au lieu de recharger
        if (data?.updatedData?.integrations?.[kind]) {
          const updatedIntegration = data.updatedData.integrations[kind];
          
          switch (kind) {
            case 'brevo':
              setBrevo({
                brevo_api_key: updatedIntegration.brevo_api_key,
                brevo_email_compte: updatedIntegration.brevo_email_compte,
                brevo_nom_compte: updatedIntegration.brevo_nom_compte
              });
              setBrevoConnexionId(updatedIntegration.brevo_connexion_id);
              break;
            case 'zoho':
              setZoho({
                zoho_api_key: updatedIntegration.zoho_api_key,
                zoho_email_compte: updatedIntegration.zoho_email_compte,
                zoho_nom_compte: updatedIntegration.zoho_nom_compte
              });
              setZohoConnexionId(updatedIntegration.zoho_connexion_id);
              break;
            case 'openai':
              setOpenAI({
                openai_api_key: updatedIntegration.openai_api_key,
                openai_email_compte: updatedIntegration.openai_email_compte
              });
              setOpenaiConnexionId(updatedIntegration.openai_connexion_id);
              break;
          }
        }

        toast({ title: 'Succès', description: `Intégration ${kind} mise à jour avec succès` });
        return true;
      } catch (e: any) {
        console.error(`Erreur saveIntegration ${kind}`, e);
        toast({ title: 'Erreur', description: e?.message || "Impossible de sauvegarder l'intégration", variant: 'destructive' });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [organisationId, brevo, zoho, openai, toast]
  );

  return {
    organisationId,
    // États UI
    brevo, setBrevo,
    zoho, setZoho,
    openai, setOpenAI,
    // IDs techniques
    brevoConnexionId,
    zohoConnexionId,
    openaiConnexionId,
    // Meta
    isLoading,
    isSaving,
    // Actions
    loadForReseau,
    saveIntegration,
  };
}
