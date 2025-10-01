import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ReseauSelectorItem } from '../hooks/types';

interface ReseauSelectorProps {
  reseaux: ReseauSelectorItem[];
  selectedReseauId: string;
  onSelect: (reseauId: string) => void;
  isLoading: boolean;
}

export const ReseauSelector: React.FC<ReseauSelectorProps> = ({
  reseaux,
  selectedReseauId,
  onSelect,
  isLoading,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Sélection du Réseau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Select
            value={selectedReseauId}
            onValueChange={onSelect}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={
                  isLoading ? "Chargement des réseaux..." : 
                  "Sélectionner un réseau"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {reseaux?.map((reseau) => (
                <SelectItem key={reseau.reseau_id} value={reseau.reseau_id}>
                  {reseau.reseau_nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReseauSelector;
