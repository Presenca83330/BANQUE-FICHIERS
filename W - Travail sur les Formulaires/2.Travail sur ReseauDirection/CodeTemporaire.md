import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../3-Utilitaires/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Trash2, Eye } from 'lucide-react';
import GraphBoutonModifier from '../../5-Graphisme/1.GraphFormulaires/5.GraphBoutonModifier';
import GraphBrevo from '../../5-Graphisme/6.GraphIntegConnexion/1.GraphBrevo';
import GraphZoho from '../../5-Graphisme/6.GraphIntegConnexion/2.GraphZoho';
import GraphOpenAI from '../../5-Graphisme/6.GraphIntegConnexion/3.GraphOpenAI';
import ReseauSelector from '@/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/components/ReseauSelector';
import { useReseauFormData } from '@/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/useReseauFormData';
import { useReseauIntegrations } from '@/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/useReseauIntegrations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack?: () => void;
}

const FormReseauGestion: React.FC<Props> = ({ onBack }) => {
  // ✅ Hook principal pour données
  const {
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
  } = useReseauFormData();

  // ✅ Hook intégrations ajouté
  const {
    brevoConnections,
    zohoConnections,
    openaiConnections,
    loadAllConnections,
    saveIntegrations,
  } = useReseauIntegrations();

  const { toast } = useToast();

  // États locaux pour les modes d'édition
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingIntegrations, setIsEditingIntegrations] = useState(false);
  const [isEditingFichiers, setIsEditingFichiers] = useState(false);

  // Chargement initial
  useEffect(() => {
    loadReseaux();
    loadAllConnections();
  }, [loadReseaux, loadAllConnections]);

  // ✅ CORRECTION 3 : Utilisation Edge Function update-reseau
  const handleSaveGeneral = async () => {
    if (!selectedReseauId) return;

    try {
      const payload = {
        reseauId: selectedReseauId,
        generalData: {
          reseau_nom: formData.reseau_nom,
          reseau_identite_commerciale: formData.reseau_identite_commerciale,
          reseau_adresse: formData.reseau_adresse,
          reseau_code_postal: formData.reseau_code_postal,
          reseau_ville: formData.reseau_ville,
          reseau_siret: formData.reseau_siret,
        }
      };

      const { data, error } = await supabase.functions.invoke('update-reseau', {
        body: JSON.stringify(payload)
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Informations générales mises à jour",
      });

      setIsEditingGeneral(false);
    } catch (error: any) {
      console.error('Erreur sauvegarde générale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive",
      });
    }
  };

  // ✅ CORRECTION 2 : Sauvegarde intégrations fonctionnelle
  const handleSaveIntegrations = async () => {
    if (!selectedReseauId) return;

    await saveIntegrations(selectedReseauId, {
      brevo: formData.reseau_brevo_connexion_id,
      zoho: formData.reseau_zoho_connexion_id,
      openai: formData.reseau_openai_connexion_id,
    });

    setIsEditingIntegrations(false);
  };

  // ✅ CORRECTION 4 : Upload fichiers via Edge Function
  const handleFileUpload = async (file: File, type: 'logo' | 'document') => {
    if (!selectedReseauId) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('reseauId', selectedReseauId);

      const { data, error } = await supabase.functions.invoke('upload-reseau-files', {
        body: formData
      });

      if (error) throw error;

      const { fileUrl } = data;

      if (type === 'logo') {
        updateFormField('reseau_logo', fileUrl);
      } else {
        const currentDocs = formData.reseau_documents || [];
        updateFormField('reseau_documents', [...currentDocs, fileUrl]);
      }

      toast({
        title: "Succès",
        description: `${type === 'logo' ? 'Logo' : 'Document'} téléchargé avec succès`,
      });
    } catch (error: any) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Soumission FormReseauGestion:', formData);
  };

  return (
    <div className="space-y-6">
      {/* ÉTAPE 1 - SÉLECTION DU RÉSEAU */}
      <ReseauSelector
        reseaux={reseaux}
        selectedReseauId={selectedReseauId}
        onSelect={selectReseau}
        isLoading={isLoading}
      />

      {/* FORMULAIRE PRINCIPAL - 3 ONGLETS */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="text-base font-semibold">Général</TabsTrigger>
          <TabsTrigger value="integrations" className="text-base font-semibold">Intégrations</TabsTrigger>
          <TabsTrigger value="fichiers" className="text-base font-semibold">Fichiers</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          
          {/* ==========================================
              ONGLET 1 - GÉNÉRAL
              ========================================== */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Informations Générales</CardTitle>
                  <GraphBoutonModifier 
                    onSave={handleSaveGeneral}
                    onCancel={() => setIsEditingGeneral(false)}
                    onEditingChange={setIsEditingGeneral}
                    isLoading={isSaving}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* COLONNE GAUCHE - 4 champs éditables */}
                  <div className="space-y-4">
                    
                    {/* CHAMP 1 - reseau_nom */}
                    <div>
                      <Label htmlFor="reseau_nom">Nom du Réseau *</Label>
                      <Input 
                        id="reseau_nom" 
                        value={formData.reseau_nom || ''} 
                        onChange={e => updateFormField('reseau_nom', e.target.value)} 
                        placeholder="Nom du Réseau"
                        disabled={!isEditingGeneral}
                        required 
                      />
                      {errors.reseau_nom && <p className="text-sm text-destructive">{errors.reseau_nom}</p>}
                    </div>
                    
                    {/* CHAMP 2 - reseau_identite_commerciale */}
                    <div>
                      <Label htmlFor="reseau_identite_commerciale">Identité Commerciale du Réseau</Label>
                      <Input 
                        id="reseau_identite_commerciale" 
                        value={formData.reseau_identite_commerciale || ''} 
                        onChange={e => updateFormField('reseau_identite_commerciale', e.target.value)} 
                        placeholder="Optionnel. Si Nom Commercial différent"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    
                    {/* CHAMP 3 - reseau_adresse */}
                    <div>
                      <Label htmlFor="reseau_adresse">Adresse *</Label>
                      <Input 
                        id="reseau_adresse" 
                        value={formData.reseau_adresse || ''} 
                        onChange={e => updateFormField('reseau_adresse', e.target.value)} 
                        placeholder="Adresse. Siège Réseau"
                        disabled={!isEditingGeneral}
                        required 
                      />
                      {errors.reseau_adresse && <p className="text-sm text-destructive">{errors.reseau_adresse}</p>}
                    </div>
                    
                    {/* CHAMP 4 - reseau_code_postal */}
                    <div>
                      <Label htmlFor="reseau_code_postal">Code Postal *</Label>
                      <Input 
                        id="reseau_code_postal" 
                        value={formData.reseau_code_postal || ''} 
                        onChange={e => updateFormField('reseau_code_postal', e.target.value)} 
                        placeholder="Code Postal. Siège Réseau"
                        disabled={!isEditingGeneral}
                        required 
                      />
                      {errors.reseau_code_postal && <p className="text-sm text-destructive">{errors.reseau_code_postal}</p>}
                    </div>

                  </div>

                  {/* COLONNE DROITE - 2 éditables + 2 bloqués */}
                  <div className="space-y-4">
                    
                    {/* CHAMP 5 - reseau_ville */}
                    <div>
                      <Label htmlFor="reseau_ville">Ville *</Label>
                      <Input 
                        id="reseau_ville" 
                        value={formData.reseau_ville || ''} 
                        onChange={e => updateFormField('reseau_ville', e.target.value)} 
                        placeholder="Ville. Siège Réseau"
                        disabled={!isEditingGeneral}
                        required 
                      />
                      {errors.reseau_ville && <p className="text-sm text-destructive">{errors.reseau_ville}</p>}
                    </div>
                    
                    {/* CHAMP 6 - reseau_siret */}
                    <div>
                      <Label htmlFor="reseau_siret">Siret *</Label>
                      <Input 
                        id="reseau_siret" 
                        value={formData.reseau_siret || ''} 
                        onChange={e => updateFormField('reseau_siret', e.target.value)} 
                        placeholder="N° Siret du Réseau"
                        disabled={!isEditingGeneral}
                        required 
                      />
                      {errors.reseau_siret && <p className="text-sm text-destructive">{errors.reseau_siret}</p>}
                    </div>
                    
                    {/* CHAMP BLOQUÉ 1 - reseau_telephone */}
                    <div className="relative">
                      <Label htmlFor="reseau_telephone">Téléphone Direction *</Label>
                      <Input 
                        id="reseau_telephone" 
                        value={formData.direction_telephone || ''}
                        placeholder="Tél. Reseau Direction" 
                        disabled={true}
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Ce champ correspond aux informations du ReseauDirection.
                        À modifier dans le formulaire RÉSEAU Direction
                      </p>
                    </div>
                    
                    {/* CHAMP BLOQUÉ 2 - reseau_email */}
                    <div className="relative">
                      <Label htmlFor="reseau_email">Email Direction *</Label>
                      <Input 
                        id="reseau_email" 
                        type="email" 
                        value={formData.direction_email || ''}
                        placeholder="Email. Reseau Direction" 
                        disabled={true}
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Ce champ correspond aux informations du ReseauDirection.
                        À modifier dans le formulaire RÉSEAU Direction
                      </p>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==========================================
              ONGLET 2 - INTÉGRATIONS ✅ CORRIGÉ
              ========================================== */}
          <TabsContent value="integrations" className="space-y-6">
            
            {/* SECTION BREVO */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    Intégration Brevo
                  </CardTitle>
                  <GraphBoutonModifier 
                    onSave={handleSaveIntegrations}
                    onCancel={() => setIsEditingIntegrations(false)}
                    onEditingChange={setIsEditingIntegrations}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="brevo_connexion_select">Sélectionner une connexion Brevo</Label>
                  <Select
                    value={formData.reseau_brevo_connexion_id || ''}
                    onValueChange={(value) => updateFormField('reseau_brevo_connexion_id', value)}
                    disabled={!isEditingIntegrations}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une connexion Brevo" />
                    </SelectTrigger>
                    <SelectContent>
                      {brevoConnections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.id}>
                          {connection.nom} ({connection.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SECTION ZOHO */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    Intégration Zoho
                  </CardTitle>
                  <GraphBoutonModifier 
                    onSave={handleSaveIntegrations}
                    onCancel={() => setIsEditingIntegrations(false)}
                    onEditingChange={setIsEditingIntegrations}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="zoho_connexion_select">Sélectionner une connexion Zoho</Label>
                  <Select
                    value={formData.reseau_zoho_connexion_id || ''}
                    onValueChange={(value) => updateFormField('reseau_zoho_connexion_id', value)}
                    disabled={!isEditingIntegrations}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une connexion Zoho" />
                    </SelectTrigger>
                    <SelectContent>
                      {zohoConnections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.id}>
                          {connection.nom} ({connection.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* SECTION OPENAI */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    Intégration OpenAI
                  </CardTitle>
                  <GraphBoutonModifier 
                    onSave={handleSaveIntegrations}
                    onCancel={() => setIsEditingIntegrations(false)}
                    onEditingChange={setIsEditingIntegrations}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="openai_connexion_select">Sélectionner une connexion OpenAI</Label>
                  <Select
                    value={formData.reseau_openai_connexion_id || ''}
                    onValueChange={(value) => updateFormField('reseau_openai_connexion_id', value)}
                    disabled={!isEditingIntegrations}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une connexion OpenAI" />
                    </SelectTrigger>
                    <SelectContent>
                      {openaiConnections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.id}>
                          {connection.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* ==========================================
              ONGLET 3 - FICHIERS ✅ CORRIGÉ
              ========================================== */}
          <TabsContent value="fichiers" className="space-y-6">
                
            {/* SECTION 1 - LOGO DU RÉSEAU */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">
                    Logo du Réseau
                  </CardTitle>
                  <GraphBoutonModifier 
                    onSave={() => console.log('Sauvegarde logo:', formData.reseau_logo)}
                    onCancel={() => console.log('Annulation modifications logo')}
                    onEditingChange={(editing) => setIsEditingFichiers(editing)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  {/* Upload nouveau logo */}
                  <div className="space-y-2">
                    <Label htmlFor="reseau_logo_upload">Télécharger le Logo du Réseau</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 text-muted-foreground flex justify-center items-center">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm">Cliquer pour sélectionner le logo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="reseau_logo_upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'logo');
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('reseau_logo_upload')?.click()}
                        >
                          Sélectionner un fichier
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Logo actuel */}
                  {formData.reseau_logo && (
                    <div className="space-y-2">
                      <Label>Logo actuel</Label>
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <img 
                          src={formData.reseau_logo} 
                          alt="Logo réseau" 
                          className="w-16 h-16 object-contain rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Logo du réseau</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(formData.reseau_logo, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            disabled
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>

            {/* SECTION 2 - DOCUMENTS INSTITUTIONNELS */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">
                    Documents Institutionnels
                  </CardTitle>
                  <GraphBoutonModifier 
                    onSave={() => console.log('Sauvegarde documents:', formData.reseau_documents)}
                    onCancel={() => console.log('Annulation modifications documents')}
                    onEditingChange={(editing) => setIsEditingFichiers(editing)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  {/* Upload nouveaux documents */}
                  <div className="space-y-2">
                    <Label htmlFor="reseau_documents_upload">Télécharger Documents Institutionnels</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 text-muted-foreground flex justify-center items-center">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm">Cliquer pour sélectionner les documents</p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX jusqu'à 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="reseau_documents_upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'document');
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('reseau_documents_upload')?.click()}
                        >
                          Sélectionner un fichier
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Documents existants */}
                  {formData.reseau_documents && formData.reseau_documents.length > 0 && (
                    <div className="space-y-2">
                      <Label>Documents existants</Label>
                      <div className="space-y-2">
                        {formData.reseau_documents.map((docUrl, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">Document {index + 1}</p>
                              <p className="text-xs text-muted-foreground">{docUrl}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(docUrl, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>

          </TabsContent>

        </form>
      </Tabs>

      {/* BOUTON RETOUR */}
      {onBack && (
        <div className="flex justify-start">
          <Button variant="outline" onClick={onBack}>
            ← Retour
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormReseauGestion;
