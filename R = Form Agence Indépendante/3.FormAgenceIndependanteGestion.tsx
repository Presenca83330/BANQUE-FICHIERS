import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../3-Utilitaires/tabs";
import { Upload, Download, Trash2, Eye } from 'lucide-react';
import GraphBoutonModifier from '../../5-Graphisme/1.GraphFormulaires/5.GraphBoutonModifier';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  onBack?: () => void;
}

const FormAgenceIndependanteGestion: React.FC<Props> = ({ onBack }) => {
  const { toast } = useToast();

  // Données mockées pour l'affichage graphique
  const [selectedAgenceIndependanteId, setSelectedAgenceIndependanteId] = useState('');
  const mockAgences = [
    { reseau_id: '1', reseau_nom: 'Agence Test 1' },
    { reseau_id: '2', reseau_nom: 'Agence Test 2' },
  ];

  const [formData, setFormData] = useState({
    reseau_nom: '',
    reseau_identite_commerciale: '',
    reseau_adresse: '',
    reseau_code_postal: '',
    reseau_ville: '',
    reseau_siret: '',
    reseau_telephone: '',
    reseau_email: '',
    reseau_logo: '',
    reseau_ressources: [] as string[],
    agence_indep_plan: '',
    agence_indep_date_debut_abonnement: '',
  });

  const [brevo, setBrevo] = useState({ brevo_api_key: '', brevo_email_compte: '', brevo_nom_compte: '' });
  const [zoho, setZoho] = useState({ zoho_api_key: '', zoho_email_compte: '', zoho_nom_compte: '' });
  const [openai, setOpenAI] = useState({ openai_api_key: '', openai_email_compte: '' });
  const [linkedin, setLinkedin] = useState({ linkedin_connexion_key: '', linkedin_email_compte: '' });
  const [facebook, setFacebook] = useState({ facebook_connexion_key: '', facebook_email_compte: '' });
  const [instagram, setInstagram] = useState({ instagram_connexion_key: '', instagram_email_compte: '' });

  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingAbonnement, setIsEditingAbonnement] = useState(false);
  const [isEditingBrevo, setIsEditingBrevo] = useState(false);
  const [isEditingZoho, setIsEditingZoho] = useState(false);
  const [isEditingOpenAI, setIsEditingOpenAI] = useState(false);
  const [isEditingLinkedin, setIsEditingLinkedin] = useState(false);
  const [isEditingFacebook, setIsEditingFacebook] = useState(false);
  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const docsInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);

  const handleSaveGeneral = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingGeneral(false);
  };

  const handleSaveAbonnement = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde abonnement bientôt disponible" });
    setIsEditingAbonnement(false);
  };

  const handleSaveBrevo = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingBrevo(false);
  };

  const handleSaveZoho = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingZoho(false);
  };

  const handleSaveOpenAI = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingOpenAI(false);
  };

  const handleSaveLinkedin = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingLinkedin(false);
  };

  const handleSaveFacebook = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingFacebook(false);
  };

  const handleSaveInstagram = () => {
    toast({ title: "Fonctionnalité en développement", description: "Sauvegarde bientôt disponible" });
    setIsEditingInstagram(false);
  };

  const handleSaveLogo = () => {
    toast({ title: "Fonctionnalité en développement", description: "Upload de logo bientôt disponible" });
    setIsEditingLogo(false);
  };

  const handleSaveDocuments = () => {
    toast({ title: "Fonctionnalité en développement", description: "Upload de documents bientôt disponible" });
    setIsEditingDocuments(false);
  };

  const handleDeleteLogo = () => {
    toast({ title: "Fonctionnalité en développement", description: "Suppression bientôt disponible" });
  };

  const handleDeleteDocument = (docPath: string) => {
    toast({ title: "Fonctionnalité en développement", description: "Suppression bientôt disponible" });
  };

  const reloadAll = () => {
    setSelectedLogo(null);
    setSelectedDocs([]);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); };

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Sélection de l'Agence Indépendante</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedAgenceIndependanteId} onValueChange={setSelectedAgenceIndependanteId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une agence indépendante" />
            </SelectTrigger>
            <SelectContent>
              {mockAgences.map((agence) => (
                <SelectItem key={agence.reseau_id} value={agence.reseau_id}>
                  {agence.reseau_nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="text-base font-semibold">Général</TabsTrigger>
          <TabsTrigger value="abonnement" className="text-base font-semibold">Abonnement</TabsTrigger>
          <TabsTrigger value="integrations" className="text-base font-semibold">Intégrations</TabsTrigger>
          <TabsTrigger value="fichiers" className="text-base font-semibold">Fichiers</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          {/* Informations Générales */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Informations Générales</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveGeneral}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingGeneral}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reseau_nom">Nom de l'Agence Indépendante</Label>
                      <Input
                        id="reseau_nom"
                        value={formData.reseau_nom || ''}
                        onChange={e => updateFormField('reseau_nom', e.target.value)}
                        placeholder="Nom de l'Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reseau_identite_commerciale">Identité Commerciale de l'Agence Indépendante</Label>
                      <Input
                        id="reseau_identite_commerciale"
                        value={formData.reseau_identite_commerciale || ''}
                        onChange={e => updateFormField('reseau_identite_commerciale', e.target.value)}
                        placeholder="Optionnel. Si Nom Commercial différent"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reseau_adresse">Adresse</Label>
                      <Input
                        id="reseau_adresse"
                        value={formData.reseau_adresse || ''}
                        onChange={e => updateFormField('reseau_adresse', e.target.value)}
                        placeholder="Adresse. Siège Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reseau_code_postal">Code Postal</Label>
                      <Input
                        id="reseau_code_postal"
                        value={formData.reseau_code_postal || ''}
                        onChange={e => updateFormField('reseau_code_postal', e.target.value)}
                        placeholder="Code Postal. Siège Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reseau_ville">Ville</Label>
                      <Input
                        id="reseau_ville"
                        value={formData.reseau_ville || ''}
                        onChange={e => updateFormField('reseau_ville', e.target.value)}
                        placeholder="Ville. Siège Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reseau_siret">Siret</Label>
                      <Input
                        id="reseau_siret"
                        value={formData.reseau_siret || ''}
                        onChange={e => updateFormField('reseau_siret', e.target.value)}
                        placeholder="N° Siret de l'Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reseau_telephone">Téléphone Responsable Agence Indépendante</Label>
                      <Input
                        id="reseau_telephone"
                        value={formData.reseau_telephone || ''}
                        onChange={e => updateFormField('reseau_telephone', e.target.value)}
                        placeholder="Tél. Responsable Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reseau_email">Email. Responsable Agence Indépendante</Label>
                      <Input
                        id="reseau_email"
                        type="email"
                        value={formData.reseau_email || ''}
                        onChange={e => updateFormField('reseau_email', e.target.value)}
                        placeholder="Email. Responsable Agence Indépendante"
                        disabled={!isEditingGeneral}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Abonnement */}
          <TabsContent value="abonnement" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Abonnement Actuel</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveAbonnement}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingAbonnement}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="agence_indep_plan">Plan d'abonnement</Label>
                    <Input
                      id="agence_indep_plan"
                      value={formData.agence_indep_plan || ''}
                      onChange={e => updateFormField('agence_indep_plan', e.target.value)}
                      placeholder="Plan d'abonnement"
                      disabled={!isEditingAbonnement}
                    />
                  </div>
                  <div>
                    <Label htmlFor="agence_indep_date_debut_abonnement">Date de début d'abonnement</Label>
                    <Input
                      id="agence_indep_date_debut_abonnement"
                      type="datetime-local"
                      value={formData.agence_indep_date_debut_abonnement || ''}
                      onChange={e => updateFormField('agence_indep_date_debut_abonnement', e.target.value)}
                      disabled={!isEditingAbonnement}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intégrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">Intégration Brevo</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveBrevo}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingBrevo}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brevo_api_key">Clé API Brevo</Label>
                    <Input
                      id="brevo_api_key"
                      type="password"
                      placeholder="Renseigner. N° Clé API"
                      value={brevo.brevo_api_key || ''}
                      onChange={e => setBrevo({ ...brevo, brevo_api_key: e.target.value })}
                      disabled={!isEditingBrevo}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brevo_email_compte">Email Compte Brevo</Label>
                    <Input
                      id="brevo_email_compte"
                      type="email"
                      placeholder="Renseigner. Email associé compte Brevo"
                      value={brevo.brevo_email_compte || ''}
                      onChange={e => setBrevo({ ...brevo, brevo_email_compte: e.target.value })}
                      disabled={!isEditingBrevo}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brevo_nom_compte">Nom Compte Brevo</Label>
                    <Input
                      id="brevo_nom_compte"
                      placeholder="Renseigner. Nom compte Brevo"
                      value={brevo.brevo_nom_compte || ''}
                      onChange={e => setBrevo({ ...brevo, brevo_nom_compte: e.target.value })}
                      disabled={!isEditingBrevo}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">Intégration Zoho</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveZoho}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingZoho}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zoho_api_key">Clé API Zoho</Label>
                    <Input
                      id="zoho_api_key"
                      type="password"
                      placeholder="Renseigner. Clé API Zoho"
                      value={zoho.zoho_api_key || ''}
                      onChange={e => setZoho({ ...zoho, zoho_api_key: e.target.value })}
                      disabled={!isEditingZoho}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zoho_email_compte">Email Compte Zoho</Label>
                    <Input
                      id="zoho_email_compte"
                      type="email"
                      placeholder="Renseigner. Email associé compte Zoho"
                      value={zoho.zoho_email_compte || ''}
                      onChange={e => setZoho({ ...zoho, zoho_email_compte: e.target.value })}
                      disabled={!isEditingZoho}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zoho_nom_compte">Nom Compte Zoho</Label>
                    <Input
                      id="zoho_nom_compte"
                      placeholder="Renseigner. Nom compte Zoho"
                      value={zoho.zoho_nom_compte || ''}
                      onChange={e => setZoho({ ...zoho, zoho_nom_compte: e.target.value })}
                      disabled={!isEditingZoho}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">Intégration OpenAI</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveOpenAI}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingOpenAI}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openai_api_key">Clé API OpenAI</Label>
                    <Input
                      id="openai_api_key"
                      type="password"
                      placeholder="Renseigner. Clé API OpenAI"
                      value={openai.openai_api_key || ''}
                      onChange={e => setOpenAI({ ...openai, openai_api_key: e.target.value })}
                      disabled={!isEditingOpenAI}
                    />
                  </div>
                  <div>
                    <Label htmlFor="openai_email_compte">Email Compte OpenAI</Label>
                    <Input
                      id="openai_email_compte"
                      type="email"
                      placeholder="Renseigner. Email associé compte OpenAI"
                      value={openai.openai_email_compte || ''}
                      onChange={e => setOpenAI({ ...openai, openai_email_compte: e.target.value })}
                      disabled={!isEditingOpenAI}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">Intégration LinkedIn</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveLinkedin}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingLinkedin}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin_connexion_key">Clé Connexion LinkedIn</Label>
                    <Input
                      id="linkedin_connexion_key"
                      type="password"
                      placeholder="Renseigner. Clé Connexion LinkedIn"
                      value={linkedin.linkedin_connexion_key || ''}
                      onChange={e => setLinkedin({ ...linkedin, linkedin_connexion_key: e.target.value })}
                      disabled={!isEditingLinkedin}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_email_compte">Email Compte LinkedIn</Label>
                    <Input
                      id="linkedin_email_compte"
                      type="email"
                      placeholder="Renseigner. Email associé compte LinkedIn"
                      value={linkedin.linkedin_email_compte || ''}
                      onChange={e => setLinkedin({ ...linkedin, linkedin_email_compte: e.target.value })}
                      disabled={!isEditingLinkedin}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">Intégration Facebook</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveFacebook}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingFacebook}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook_connexion_key">Clé Connexion Facebook</Label>
                    <Input
                      id="facebook_connexion_key"
                      type="password"
                      placeholder="Renseigner. Clé Connexion Facebook"
                      value={facebook.facebook_connexion_key || ''}
                      onChange={e => setFacebook({ ...facebook, facebook_connexion_key: e.target.value })}
                      disabled={!isEditingFacebook}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook_email_compte">Email Compte Facebook</Label>
                    <Input
                      id="facebook_email_compte"
                      type="email"
                      placeholder="Renseigner. Email associé compte Facebook"
                      value={facebook.facebook_email_compte || ''}
                      onChange={e => setFacebook({ ...facebook, facebook_email_compte: e.target.value })}
                      disabled={!isEditingFacebook}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">Intégration Instagram</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveInstagram}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingInstagram}
                    isLoading={false}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram_connexion_key">Clé Connexion Instagram</Label>
                    <Input
                      id="instagram_connexion_key"
                      type="password"
                      placeholder="Renseigner. Clé Connexion Instagram"
                      value={instagram.instagram_connexion_key || ''}
                      onChange={e => setInstagram({ ...instagram, instagram_connexion_key: e.target.value })}
                      disabled={!isEditingInstagram}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_email_compte">Email Compte Instagram</Label>
                    <Input
                      id="instagram_email_compte"
                      type="email"
                      placeholder="Renseigner. Email associé compte Instagram"
                      value={instagram.instagram_email_compte || ''}
                      onChange={e => setInstagram({ ...instagram, instagram_email_compte: e.target.value })}
                      disabled={!isEditingInstagram}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ✅ Fichiers - GRAPHISME CORRIGÉ (IDENTIQUE À FormReseauGestion) */}
          <TabsContent value="fichiers" className="space-y-6">
            {/* 🎨 Logo de l'Agence Indépendante */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Logo de l'Agence Indépendante</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveLogo}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingLogo}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reseau_logo_upload">Télécharger le Logo de l'Agence Indépendante</Label>
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer"
                      onClick={() => isEditingLogo && logoInputRef.current?.click()}
                    >
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
                    <input
                      ref={logoInputRef}
                      id="reseau_logo_upload"
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={!isEditingLogo}
                      onChange={e => setSelectedLogo(e.target.files?.[0] || null)}
                    />
                  </div>

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
                              <p className="font-medium break-all">{formData.reseau_logo}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleDeleteLogo}
                              disabled={!isEditingLogo}
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

            {/* 📄 Documents Institutionnels */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">Documents Institutionnels</CardTitle>
                  <GraphBoutonModifier
                    onSave={handleSaveDocuments}
                    onCancel={reloadAll}
                    onEditingChange={setIsEditingDocuments}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Télécharger les documents</Label>
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer"
                      onClick={() => isEditingDocuments && docsInputRef.current?.click()}
                    >
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
                    <input
                      ref={docsInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      hidden
                      disabled={!isEditingDocuments}
                      onChange={e => setSelectedDocs(e.target.files ? Array.from(e.target.files) : [])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Supprimer un fichier existant</Label>
                    <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
                      {formData.reseau_ressources && formData.reseau_ressources.length > 0 ? (
                        <>
                          {formData.reseau_ressources.map((p) => (
                            <div key={p} className="flex items-center justify-between p-3 border rounded bg-white">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                  <Download className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="max-w-[60ch]">
                                  <p className="font-medium break-all">{p}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    const { data } = await supabase.storage
                                      .from('bucket-table-agence-independante')
                                      .createSignedUrl(p, 60);
                                    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteDocument(p)}
                                  disabled={!isEditingDocuments}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          ))}
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

export default FormAgenceIndependanteGestion;
