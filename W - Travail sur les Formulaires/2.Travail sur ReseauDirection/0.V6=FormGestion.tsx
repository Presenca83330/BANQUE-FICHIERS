import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download } from 'lucide-react';
import GraphBoutonModifier from '../../5-Graphisme/1.GraphFormulaires/5.GraphBoutonModifier';
import GraphBrevo from '../../5-Graphisme/6.GraphIntegConnexion/1.GraphBrevo';
import GraphZoho from '../../5-Graphisme/6.GraphIntegConnexion/2.GraphZoho';
import GraphOpenAI from '../../5-Graphisme/6.GraphIntegConnexion/3.GraphOpenAI';
import GraphSelectdansSupabase from '../../5-Graphisme/7.GraphSelectiondansSupabase/1.SelectReseau';

interface Props {
  onBack?: () => void;
}

const FormReseauGestion: React.FC<Props> = ({ onBack }) => {
  const [selectedReseau, setSelectedReseau] = useState(null);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingIntegrations, setIsEditingIntegrations] = useState(false);
  const [isEditingFichiers, setIsEditingFichiers] = useState(false);
  
  // DONNÉES FORMULAIRE - NOMS EXACTS selon TablesReferenceReseau.ts
  const [formData, setFormData] = useState({
    // ========================================
    // TABLE: reseau - Champs généraux (6 ÉDITABLES)
    // ========================================
    reseau_nom: '',                        // ÉDITABLE
    reseau_identite_commerciale: '',       // ÉDITABLE
    reseau_adresse: '',                    // ÉDITABLE
    reseau_code_postal: '',                // ÉDITABLE
    reseau_ville: '',                      // ÉDITABLE
    reseau_siret: '',                      // ÉDITABLE
    
    // ========================================
    // TABLE: reseau - Champs BLOQUÉS (ReseauDirection)
    // ========================================
    reseau_telephone: '',                  // LECTURE SEULE + MESSAGE
    reseau_email: '',                      // LECTURE SEULE + MESSAGE
    
    // ========================================
    // TABLE: reseau - Champs fichiers
    // ========================================
    reseau_logo: '',                       // Upload fichier unique
    reseau_ressources: [],                 // Upload multiple fichiers
    
    // ========================================
    // INTÉGRATIONS - Liens FK vers tables connexions
    // ========================================
    reseau_brevo_connexion_id: '',
    reseau_openai_connexion_id: '',
    reseau_zoho_connexion_id: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Soumission FormReseauGestion:', formData);
  };

  return (
    <div className="space-y-6">
      {/* ÉTAPE 1 - SÉLECTION DU RÉSEAU */}
      <GraphSelectdansSupabase 
        selectedValue={selectedReseau?.reseau_id}
        onSelectionChange={setSelectedReseau}
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
                    onSave={() => console.log('Sauvegarde Général:', formData)}
                    onCancel={() => console.log('Annulation Général')}
                    onEditingChange={setIsEditingGeneral}
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
                        value={formData.reseau_nom} 
                        onChange={e => handleInputChange('reseau_nom', e.target.value)} 
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
                        value={formData.reseau_identite_commerciale} 
                        onChange={e => handleInputChange('reseau_identite_commerciale', e.target.value)} 
                        placeholder="Optionnel. Si Nom Commercial différent" 
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    
                    {/* CHAMP 3 - reseau_adresse */}
                    <div>
                      <Label htmlFor="reseau_adresse">Adresse *</Label>
                      <Input 
                        id="reseau_adresse" 
                        value={formData.reseau_adresse} 
                        onChange={e => handleInputChange('reseau_adresse', e.target.value)} 
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
                        value={formData.reseau_code_postal} 
                        onChange={e => handleInputChange('reseau_code_postal', e.target.value)} 
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
                        value={formData.reseau_ville} 
                        onChange={e => handleInputChange('reseau_ville', e.target.value)} 
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
                        value={formData.reseau_siret} 
                        onChange={e => handleInputChange('reseau_siret', e.target.value)} 
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
                        value={formData.reseau_telephone} 
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
                        value={formData.reseau_email} 
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
                    onSave={() => console.log('Sauvegarde Brevo')}
                    onCancel={() => console.log('Annulation Brevo')}
                    onEditingChange={() => setIsEditingIntegrations(!isEditingIntegrations)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* brevo_api_key */}
                  <div>
                    <Label htmlFor="brevo_api_key">Clé API Brevo *</Label>
                    <Input 
                      id="brevo_api_key" 
                      type="password"
                      placeholder="Renseigner. N° Clé API " 
                      disabled={!isEditingIntegrations}
                    />
                  </div>
                  
                  {/* brevo_email_compte */}
                  <div>
                    <Label htmlFor="brevo_email_compte">Email Compte Brevo *</Label>
                    <Input 
                      id="brevo_email_compte" 
                      type="email"
                      placeholder="Renseigner. Email associé compte Brevo" 
                      disabled={!isEditingIntegrations}
                    />
                  </div>
                  
                  {/* brevo_nom_compte */}
                  <div>
                    <Label htmlFor="brevo_nom_compte">Nom Compte Brevo *</Label>
                    <Input 
                      id="brevo_nom_compte" 
                      placeholder="Renseigner.Nom compte Brevo" 
                      disabled={!isEditingIntegrations}
                    />
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
                    onSave={() => console.log('Sauvegarde Zoho')}
                    onCancel={() => console.log('Annulation Zoho')}
                    onEditingChange={() => setIsEditingIntegrations(!isEditingIntegrations)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* zoho_api_key */}
                  <div>
                    <Label htmlFor="zoho_api_key">Clé API Zoho *</Label>
                    <Input 
                      id="zoho_api_key" 
                      type="password"
                      placeholder="Renseigner. Clé API Zoho" 
                      disabled={!isEditingIntegrations}
                    />
                  </div>
                  
                  {/* zoho_email_compte */}
                  <div>
                    <Label htmlFor="zoho_email_compte">Email Compte Zoho *</Label>
                    <Input 
                      id="zoho_email_compte" 
                      type="email"
                      placeholder="Renseigner. Email associé compte Zoho" 
                      disabled={!isEditingIntegrations}
                    />
                  </div>
                  
                  {/* zoho_nom_compte */}
                  <div>
                    <Label htmlFor="zoho_nom_compte">Nom Compte Zoho *</Label>
                    <Input 
                      id="zoho_nom_compte" 
                      placeholder="Renseigner. Nom compte Zoho" 
                      disabled={!isEditingIntegrations}
                    />
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
                    onSave={() => console.log('Sauvegarde OpenAI')}
                    onCancel={() => console.log('Annulation OpenAI')}
                    onEditingChange={() => setIsEditingIntegrations(!isEditingIntegrations)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* openai_api_key */}
                  <div>
                    <Label htmlFor="openai_api_key">Clé API OpenAI *</Label>
                    <Input 
                      id="openai_api_key" 
                      type="password"
                      placeholder="Renseigner. Clé API OpenAI " 
                      disabled={!isEditingIntegrations}
                    />
                  </div>
                  
                  {/* openai_email_compte */}
                  <div>
                    <Label htmlFor="openai_email_compte">Email Compte OpenAI *</Label>
                    <Input 
                      id="openai_email_compte" 
                      type="email"
                      placeholder="Renseigner. Email associé compte OpenAI" 
                      disabled={!isEditingIntegrations}
                    />
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
                    onSave={() => console.log('Sauvegarde documents:', formData.reseau_ressources)}
                    onCancel={() => console.log('Annulation modifications documents')}
                    onEditingChange={(editing) => setIsEditingFichiers(editing)}
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
                      {formData.reseau_ressources && formData.reseau_ressources.length > 0 ? (
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
