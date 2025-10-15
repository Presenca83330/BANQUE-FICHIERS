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
