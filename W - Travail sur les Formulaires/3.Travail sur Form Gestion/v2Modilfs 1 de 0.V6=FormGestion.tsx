import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../3-Utilitaires/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download } from 'lucide-react';
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
  const { toast } = useToast();
  
  // ✅ REMPLACEMENT : État local par useReseauFormData hook
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

  // ✅ AJOUT : Hook intégrations
  const {
    brevoConnections,
    zohoConnections,
    openaiConnections,
    loadAllConnections,
    saveIntegrations,
  } = useReseauIntegrations();

  // États locaux pour les modes d'édition
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingIntegrations, setIsEditingIntegrations] = useState(false);
  const [isEditingFichiers, setIsEditingFichiers] = useState(false);

  // Chargement initial des réseaux et connexions
  useEffect(() => {
    loadReseaux();
    loadAllConnections();
  }, [loadReseaux, loadAllConnections]);

  // ✅ NOUVELLE LOGIQUE : Utilisation de l'Edge Function pour la sauvegarde
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
        description: "Informations générales mises à jour avec succès",
      });
      
      setIsEditingGeneral(false);
    } catch (error: any) {
      console.error('Erreur sauvegarde générale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    }
  };

  // ✅ AJOUT : Sauvegarde des intégrations
  const handleSaveIntegrations = async () => {
    if (!selectedReseauId) return;
    
    try {
      await saveIntegrations(selectedReseauId, {
        brevo: formData.reseau_brevo_connexion_id,
        zoho: formData.reseau_zoho_connexion_id,
        openai: formData.reseau_openai_connexion_id,
      });
      
      setIsEditingIntegrations(false);
    } catch (error: any) {
      console.error('Erreur sauvegarde intégrations:', error);
    }
  };

  // ✅ AJOUT : Upload de fichiers
  const handleFileUpload = async (file: File, type: 'logo' | 'document') => {
    if (!selectedReseauId) return;

    try {
      const payload = {
        reseauId: selectedReseauId,
        type,
        filename: file.name,
      };

      const { data, error } = await supabase.functions.invoke('upload-reseau-files', {
        body: JSON.stringify(payload),
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
              ONGLET 2 - INTÉGRATIONS
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Sélection connexion Brevo */}
                  <div className="md:col-span-3">
                    <Label htmlFor="brevo_connexion">Connexion Brevo *</Label>
                    <Select
                      value={formData.reseau_brevo_connexion_id || ''}
                      onValueChange={(value) => updateFormField('reseau_brevo_connexion_id', value)}
                      disabled={!isEditingIntegrations}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une connexion Brevo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucune connexion</SelectItem>
                        {brevoConnections.map((connection) => (
                          <SelectItem key={connection.id} value={connection.id}>
                            {connection.nom} ({connection.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Sélection connexion Zoho */}
                  <div className="md:col-span-3">
                    <Label htmlFor="zoho_connexion">Connexion Zoho *</Label>
                    <Select
                      value={formData.reseau_zoho_connexion_id || ''}
                      onValueChange={(value) => updateFormField('reseau_zoho_connexion_id', value)}
                      disabled={!isEditingIntegrations}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une connexion Zoho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucune connexion</SelectItem>
                        {zohoConnections.map((connection) => (
                          <SelectItem key={connection.id} value={connection.id}>
                            {connection.nom} ({connection.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Sélection connexion OpenAI */}
                  <div className="md:col-span-2">
                    <Label htmlFor="openai_connexion">Connexion OpenAI *</Label>
                    <Select
                      value={formData.reseau_openai_connexion_id || ''}
                      onValueChange={(value) => updateFormField('reseau_openai_connexion_id', value)}
                      disabled={!isEditingIntegrations}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une connexion OpenAI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucune connexion</SelectItem>
                        {openaiConnections.map((connection) => (
                          <SelectItem key={connection.id} value={connection.id}>
                            {connection.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* ==========================================
              ONGLET 3 - FICHIERS
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
                    onSave={() => {/* Logo sauvegardé automatiquement lors de l'upload */}}
                    onCancel={() => setIsEditingFichiers(false)}
                    onEditingChange={setIsEditingFichiers}
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
                        <div className="mx-auto w-12 h-12 text-muted-foreground">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm">Cliquer pour sélectionner le logo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, SVG - Max 2MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Logo actuel avec possibilité de suppression */}
                  <div className="space-y-2">
                    <Label>Logo actuel</Label>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      {formData.reseau_logo ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 border rounded bg-white flex items-center justify-center">
                              <Upload className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">logo-reseau.png</p>
                              <p className="text-sm text-muted-foreground">125 KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              disabled={!isEditingFichiers}
                            >
                              Voir
                            </Button>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              disabled={!isEditingFichiers}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucun logo uploadé</span>
                      )}
                    </div>
                  </div>
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
                    onSave={() => {/* Documents sauvegardés automatiquement lors de l'upload */}}
                    onCancel={() => setIsEditingFichiers(false)}
                    onEditingChange={setIsEditingFichiers}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  {/* Upload nouveaux documents */}
                  <div className="space-y-2">
                    <Label>Télécharger les documents</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="space-y-2">
                         <div className="mx-auto w-12 h-12 text-muted-foreground">
                           <Download className="h-6 w-6" />
                         </div>
                        <div>
                          <p className="text-sm">Cliquer pour sélectionner les documents</p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX - Max 10MB par fichier</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documents actuels avec possibilité de suppression */}
                  <div className="space-y-2">
                    <Label>Supprimer un fichier existant</Label>
                    <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
                      {formData.reseau_documents && formData.reseau_documents.length > 0 ? (
                        <>
                          {/* Document 1 */}
                          <div className="flex items-center justify-between p-3 border rounded bg-white">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                 <Download className="h-4 w-4 text-red-600" />
                               </div>
                              <div>
                                <p className="font-medium">presentation-reseau.pdf</p>
                                <p className="text-sm text-muted-foreground">2.3 MB • Uploadé il y a 2 jours</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled={!isEditingFichiers}
                              >
                                👁️ Voir
                              </Button>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                disabled={!isEditingFichiers}
                              >
                                🗑️ Supprimer
                              </Button>
                            </div>
                          </div>
                          
                          {/* Document 2 */}
                          <div className="flex items-center justify-between p-3 border rounded bg-white">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                 <Download className="h-4 w-4 text-blue-600" />
                               </div>
                              <div>
                                <p className="font-medium">reglement-interieur.docx</p>
                                <p className="text-sm text-muted-foreground">1.8 MB • Uploadé il y a 1 semaine</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled={!isEditingFichiers}
                              >
                                👁️ Voir
                              </Button>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                disabled={!isEditingFichiers}
                              >
                                🗑️ Supprimer
                              </Button>
                            </div>
                          </div>
                          
                          {/* Document 3 */}
                          <div className="flex items-center justify-between p-3 border rounded bg-white">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                                 <Download className="h-4 w-4 text-green-600" />
                               </div>
                              <div>
                                <p className="font-medium">statuts-association.xlsx</p>
                                <p className="text-sm text-muted-foreground">945 KB • Uploadé il y a 3 jours</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled={!isEditingFichiers}
                              >
                                👁️ Voir
                              </Button>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                disabled={!isEditingFichiers}
                              >
                                🗑️ Supprimer
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucun document uploadé</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

        </form>
      </Tabs>

      {/* BOUTON RETOUR - Déplacé en bas pour une meilleure ergonomie */}
      {onBack && (
        <div className="pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            ← Retour
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormReseauGestion;
