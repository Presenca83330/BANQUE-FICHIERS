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

  /**
   * 🔑 SERVICE_ROLE_KEY - Charger la liste des réseaux (sélecteur dropdown)
   */
  const loadReseaux = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gestion-reseau-admin');
      if (error) throw error;
      setReseaux(data || []);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les réseaux',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * 🔑 SERVICE_ROLE_KEY - Charger les données complètes d'un réseau sélectionné
   */
  const loadReseauData = useCallback(
    async (reseauId: string) => {
      if (!reseauId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('gestion-reseau-admin-donnees', {
          body: { reseauId }
        });
        if (error) throw error;
        
        if (!data?.reseau) {
          setFormData({});
          toast({
            title: 'Introuvable',
            description: 'Réseau introuvable',
            variant: 'destructive',
          });
          return;
        }

        setFormData(data.reseau);
        setErrors({});
      } catch {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du réseau',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  /**
   * Validation côté frontend avant sauvegarde
   * ⚠️ Dans le formulaire de gestion → uniquement des validations de forme.
   * (Les champs étaient obligatoires uniquement lors de la création.)
   */
  const validateForm = useCallback(
    (data: Partial<ReseauFormData>): ValidationErrors => {
      const newErrors: ValidationErrors = {};

      if (data.reseau_code_postal && !/^\d{5}$/.test(data.reseau_code_postal)) {
        newErrors.reseau_code_postal =
          'Le code postal doit contenir 5 chiffres';
      }

      if (data.reseau_siret && !/^\d{14}$/.test(data.reseau_siret.replace(/\s/g, ''))) {
        newErrors.reseau_siret = 'Le SIRET doit contenir 14 chiffres';
      }

      return newErrors;
    },
    []
  );

  /**
   * 🔑 SERVICE_ROLE_KEY - Sauvegarder les données d'un réseau
   */
  const saveReseau = useCallback(
    async (dataToSave: Partial<ReseauFormData>) => {
      if (!selectedReseauId) return false;

      const validationErrors = validateForm(dataToSave);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        toast({
          title: 'Erreurs de validation',
          description: 'Veuillez corriger les erreurs',
          variant: 'destructive',
        });
        return false;
      }

      setIsSaving(true);
      try {
        const { data, error } = await supabase.functions.invoke('gestion-reseau-admin-update', {
          body: { 
            reseauId: selectedReseauId,
            generalData: dataToSave 
          }
        });
        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Réseau mis à jour avec succès',
        });
        await loadReseauData(selectedReseauId);
        return true;
      } catch {
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder les modifications',
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [selectedReseauId, validateForm, toast, loadReseauData]
  );

  /**
   * Mise à jour d'un champ dans l'état local
   */
  const updateFormField = useCallback(
    (field: keyof ReseauFormData | string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const e = { ...prev };
          delete e[field];
          return e;
        });
      }
    },
    [errors]
  );

  /**
   * Sélection d'un réseau dans le dropdown
   */
  const selectReseau = useCallback(
    (reseauId: string) => {
      setSelectedReseauId(reseauId);
      if (reseauId) {
        loadReseauData(reseauId);
      } else {
        setFormData({});
        setErrors({});
      }
    },
    [loadReseauData]
  );

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
