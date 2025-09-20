

Lorsqu’on a conçu le formulaire de création réseau, on s’est posé la question :
- À qui appartient l’email et le téléphone saisis lors de la création du réseau
- Et la réponse avait été :L’email et le téléphone que tu saisis ne sont pas vraiment des coordonnées génériques du réseau,
- Ce sont les coordonnées du responsable de direction (le premier utilisateur rattaché au réseau).

Donc dans le schéma :
- reseau = entité juridique/business (nom, adresse, SIRET, etc.)
- reseau_direction = la direction courante (personnalisée, avec nom/prénom/email/téléphone)
- On avait mis email et téléphone du formulaire dans reseau_direction parce qu’à ce moment-là, c’était l’utilisateur obligatoire pour rendre le réseau fonctionnel.

En clair :
- 📌 Sans responsable, le réseau ne servait à rien (pas de login possible, pas de gestionnaire).
- 📌 C’est pourquoi reseau_email et reseau_telephone n’avaient pas été utilisés directement → ils étaient “dupliqués” dans reseau_direction.
- ⚠️ Mais plus tard, Lovable et moi avions déjà relevé que ça créait une confusion :
- reseau devrait avoir ses coordonnées institutionnelles (siège, contact générique, hotline).
- reseau_direction devrait avoir les coordonnées personnelles du directeur.
- 👉 On avait donc conclu : il faut dupliquer (mettre les deux dans reseau ET reseau_direction), pour éviter de perdre l’historique si la direction change.
