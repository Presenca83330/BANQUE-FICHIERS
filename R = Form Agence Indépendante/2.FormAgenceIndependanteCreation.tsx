import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2 } from "lucide-react";
import SuccessAccountInfo from "./SuccessAccountInfo";
import { useToast } from "@/hooks/use-toast";

// Types locaux temporaires (en attendant la vraie implémentation)
interface FormData {
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

interface ValidationErrors {
  [key: string]: string | undefined;
}

interface CreationResult {
  email: string;
  tempPassword: string;
}

interface FormAgenceIndependanteCreationProps {
  onBack: () => void;
}

export default function FormAgenceIndependanteCreation({ onBack }: FormAgenceIndependanteCreationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
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

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [creationResult, setCreationResult] = useState<CreationResult | null>(null);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.nomReseau) newErrors.nomReseau = "Nom de l'Agence Indépendante requis";
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
    
    const isValid = validateForm();
    if (!isValid) return;

    toast({
      title: "Fonctionnalité en développement",
      description: "La création d'agences indépendantes sera bientôt disponible.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <CardTitle>Création d'une nouvelle Agence Indépendante</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations Réseau */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomReseau">Nom de l'Agence Indépendante *</Label>
                <Input
                  id="nomReseau"
                  value={formData.nomReseau}
                  onChange={(e) => updateFormData("nomReseau", e.target.value)}
                  placeholder="Nom de l'Agence Indépendante"
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
                  placeholder="N° Siret de l'Agence Indépendante"
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
                placeholder="Adresse. Siège Agence Indépendante"
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
                  placeholder="Code Postal. Siège Agence Indépendante"
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
                  placeholder="Ville. Siège Agence Indépendante"
                />
                {errors.ville && (
                  <p className="text-sm text-red-500">{errors.ville}</p>
                )}
              </div>
            </div>

            {/* Responsable */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenomResponsable">Prénom. Responsable Agence Indépendante *</Label>
                <Input
                  id="prenomResponsable"
                  value={formData.prenomResponsable}
                  onChange={(e) =>
                    updateFormData("prenomResponsable", e.target.value)
                  }
                  placeholder="Prénom. Responsable Agence Indépendante"
                />
                {errors.prenomResponsable && (
                  <p className="text-sm text-red-500">
                    {errors.prenomResponsable}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="nomResponsable">Nom. Responsable Agence Indépendante *</Label>
                <Input
                  id="nomResponsable"
                  value={formData.nomResponsable}
                  onChange={(e) =>
                    updateFormData("nomResponsable", e.target.value)
                  }
                  placeholder="Nom. Responsable Agence Indépendante"
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
                <Label htmlFor="emailResponsable">Email. Responsable Agence Indépendante *</Label>
                <Input
                  id="emailResponsable"
                  value={formData.emailResponsable}
                  onChange={(e) =>
                    updateFormData("emailResponsable", e.target.value)
                  }
                  placeholder="Email. Responsable Agence Indépendante"
                />
                {errors.emailResponsable && (
                  <p className="text-sm text-red-500">
                    {errors.emailResponsable}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="telephoneResponsable">
                  Tél. Responsable Agence Indépendante *
                </Label>
                <Input
                  id="telephoneResponsable"
                  value={formData.telephoneResponsable}
                  onChange={(e) =>
                    updateFormData("telephoneResponsable", e.target.value)
                  }
                  placeholder="Tél. Responsable Agence Indépendante"
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
