import React, { useState } from 'react';
import GraphFormAccueil from '../../5-Graphisme/1.GraphFormulaires/4.GraphFormAccueil.jsx';
import FormAgenceIndependanteCreation from './2.FormAgenceIndependanteCreation';
import FormAgenceIndependanteGestion from './3.FormAgenceIndependanteGestion';

interface FormAgenceIndependanteAccueilProps {
  onBack?: () => void;
}

const FormAgenceIndependanteAccueil: React.FC<FormAgenceIndependanteAccueilProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('accueil');
  const handleCreationClick = () => {
    setCurrentView('creation');
  };
  const handleMiseAJourClick = () => {
    setCurrentView('gestion');
  };
  const handleBackToAccueil = () => {
    setCurrentView('accueil');
  };
  if (currentView === 'creation') {
    return <FormAgenceIndependanteCreation onBack={handleBackToAccueil} />;
  }
  if (currentView === 'gestion') {
    return <FormAgenceIndependanteGestion onBack={handleBackToAccueil} />;
  }
  return <GraphFormAccueil onCreationClick={handleCreationClick} onMiseAJourClick={handleMiseAJourClick} />;
};
export default FormAgenceIndependanteAccueil;

