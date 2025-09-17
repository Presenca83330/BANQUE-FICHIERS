import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BrevoIntegration, ZohoIntegration, OpenAIIntegration } from './types';

export function useReseauIntegrations() {
  const [brevoConnections, setBrevoConnections] = useState<BrevoIntegration[]>([]);
  const [zohoConnections, setZohoConnections] = useState<ZohoIntegration[]>([]);
  const [openaiConnections, setOpenaiConnections] = useState<OpenAIIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Charger toutes les connexions
  const loadAllConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: brevoData, error: brevoError } = await supabase.from('brevo_connexion').select('*');
      const { data: zohoData, error: zohoError } = await supabase.from('zoho_connexion').select('*');
      const { data: openaiData, error: openaiError } = await supabase.from('openai_connexion').select('*');

      if (brevoError || zohoError || openaiError) {
        throw brevoError || zohoError || openaiError;
      }

      setBrevoConnections(brevoData || []);
      setZohoConnections(zohoData || []);
      setOpenaiConnections(openaiData || []);
    } catch (error: any) {
      console.error('Erreur chargement connexions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les connexions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Sauvegarder les intégrations pour un réseau
  const saveIntegrations = useCallback(async (reseauId: string, integrations: { brevo?: string; zoho?: string; openai?: string }) => {
    try {
      if (integrations.brevo) {
        const { error } = await supabase.from('reseau').update({ reseau_brevo_connexion_id: integrations.brevo }).eq('reseau_id', reseauId);
        if (error) throw error;
      }
      if (integrations.zoho) {
        const { error } = await supabase.from('reseau').update({ reseau_zoho_connexion_id: integrations.zoho }).eq('reseau_id', reseauId);
        if (error) throw error;
      }
      if (integrations.openai) {
        const { error } = await supabase.from('reseau').update({ reseau_openai_connexion_id: integrations.openai }).eq('reseau_id', reseauId);
        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Intégrations mises à jour avec succès",
      });
    } catch (error: any) {
      console.error('Erreur sauvegarde intégrations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les intégrations",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    brevoConnections,
    zohoConnections,
    openaiConnections,
    isLoading,
    loadAllConnections,
    saveIntegrations,
  };
}
