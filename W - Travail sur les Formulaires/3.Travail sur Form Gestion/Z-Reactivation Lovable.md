
----
Bonjour 
- Tu es un expert en Ia no code et intégration supabese.
- Tu maitrises parfaitement les environnement Saas, les meilleures logiciels et ia
- Tu m 'accompagnes dans la mise à jour de mon formulaire de gestion de mise jour de compte.
- Tu es un expert qui applique les directives avec rigueur, précision, tu es méticuleux et
- Tu ne modifies pas ce qu on ne t a pas demandé
- Tu es un vrai expert professionnel

Je vais t'expliquer dans le chat suivant ce que nous allons faire ensemble.


---

- Nous avons travaillé ensemble sur l'implantation du process de mon formulaire de gestion
- Et plus particulièrement sur le formulaire de gestion Réseau
- Nous avions mis en place toute une structure mais il s'est avéré qu'elle etait erronée
- Je suis donc en train de travailler sur un nouveau process en réécrivant tous les codes, fichiers, hooks, composants, edge.
- Tout
- Avant j aimerais que tu disposes d'une connaissance parfaite de mon environnement
- -> Analyse les tables dans Supabase, fonctions rls
- ->src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/.v4.TablesReferenceReseau.ts
- Quand tu auras lu ces fichiers je te donnerai d autres infos

---

- Commence par lire ce fichier il y a toute ma stratégie :
- src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/.v3.Strategie.Formulaire.Gestion.md
- Quand tu auras lu ces fichiers je te donnerai d autres infos

---

- Comme je te l'ai dit notre structure actuelle est fausse
- Donc tu ne dois pas prendre en compte les fichiers actuels
- Alors j ai conçu un document pour te présenter tous les fichiers que je compte utiliser avec les codes comme s ils étaient en place
- Comme cela nous pouvons corriger tranquillement dans ce fichier si tu vois des erreurs sans risquer de créer des bugs
- Petite précision, qui a son importance mon application est en projet, elle n est pas en ligne et donc pas de client donc nous travaillons sans stress
- Ma question :
- Peux tu auditer et analyser ce fichier :
- src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/.v4.Projet.Implantation.Form.Gestion.md
- Tiens compte des tables actuelles
- Dis moi si tu releves des erreurs critiques, des erreurs de maping, tous les fichiers utilisés sont dans ce md
- Par contre, tu as peut être des questions pour affiner ton analyse, n hésite pas à me les poser avant
- A toi, je suis à ta disposition

---






---
RAPPEL DES EMPLACEMENTS

- Hook Principal : src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/useReseauFormData.ts
- Hook Intégrations : src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/useReseauIntegrations.ts
- Types	types.ts : src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/hooks/types.ts
- Page Principale	: src/components/ADMIN-PRESENCA/9-CreationComptesUtilisateurs/1-Formulaires/1.Reseau/3.FormReseauGestion.tsx
- Composant Selector : src/components/HOOKS-STRATEGIQUE/6.HOOKS-GestionCompteAdminPresenca/1.Reseau/components/ReseauSelector.tsx
- Edge Function Update : supabase/functions/update-reseau/index.ts
- Edge Function Upload : supabase/functions/upload-reseau-files/index.ts
- Migration Storage	migration-storage-buckets.sql	
---




⚠️ Ne change pas le design ni les placeholders → seulement les branchements fonctionnels
👉 On garde exactement le design et les placeholders existants.
👉 On ne change pas la présentation  3 onglets champs bouton “Modifier” préholder n tesxte 
).
👉"INTERDICTION ABSOLUE d'ajouter des composants <Select> dans l'onglet Intégrations.  L'onglet Intégrations utilise EXACTEMENT la même logique que l'onglet Général : chargement automatique des données depuis la BDD + modification manuelle + sauvegarde. Aucun sélecteur de connexions existantes."
"Onglet Intégrations = Input classiques uniquement. Pas de Select. Même logique que l'onglet Général."
Rappel 
seul le fichier
 est à modifier
INTERDICTION TOTALE ET ABSOLUE DE MODIFIER UN AUTRE FICHIER SANS MON ACCORD
Si tu rencontres un pbl tu stoppes et tu demandes 




INTERDICTON DE MODIFIER UN AUTRE FICHIER DE L APPLICATION SANS MON ACCORD
