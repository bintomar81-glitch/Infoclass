# InfoClass — inscription, connexion et contact

Site scolaire en HTML, CSS et JavaScript, avec Supabase pour les comptes et les messages. Hébergement existant : https://infoclass-six.vercel.app/

## Activer le fonctionnement réel

1. Créer un projet sur https://supabase.com/dashboard et conserver son mot de passe de base de données dans un endroit privé.
2. Dans SQL Editor, copier tout le contenu de supabase.sql et cliquer sur Run.
3. Dans les paramètres du projet, récupérer Project URL et la clé publique Publishable (ou l’ancienne clé anon). Les recopier dans les deux chaînes vides de config.js. Ne jamais utiliser une clé secret, service_role ou le mot de passe de la base dans ces fichiers.
4. Dans Authentication > URL Configuration, définir Site URL sur https://infoclass-six.vercel.app/ et autoriser cette même adresse comme redirection.
5. Conserver la confirmation e-mail activée. Après inscription, cliquer sur le lien reçu avant de se connecter. Pour une démonstration scolaire sans dépendre des e-mails, on peut désactiver Confirm email dans les réglages du fournisseur Email : les adresses ne sont alors pas vérifiées. Créer un nouveau compte après ce changement.
6. Remplacer les fichiers du dépôt GitHub par ceux de cette archive, puis enregistrer les modifications. Si Vercel est connecté à ce dépôt, il déclenchera le déploiement ; sinon lancer un redéploiement depuis Vercel.

Le projet est statique : pas de commande de compilation ni de dépendances à installer. Pour le lancer localement, servir ce dossier avec un serveur HTTP, par exemple Live Server dans VS Code.

## Démonstration devant le professeur

1. Inscription : choisir un cours, saisir une adresse e-mail et un mot de passe d’au moins 8 caractères. Confirmer l’adresse si cette option est activée. Vérifier la présence du compte dans Authentication > Users.
2. Connexion : essayer un mauvais mot de passe (message d’erreur), puis le bon. L’espace élève affiche les données du compte vérifié par Supabase.
3. Déconnexion : cliquer sur Se déconnecter, puis ouvrir espace.html : le site revient à la connexion.
4. Contact : envoyer un message, puis ouvrir Table Editor > messages_contact dans Supabase. La nouvelle ligne constitue la preuve de l’enregistrement réel. Ce formulaire enregistre le message ; il n’envoie pas de courrier dans une boîte mail.
5. Recharger le site : les comptes et messages sont conservés dans Supabase, indépendamment du navigateur.

## Fonctionnement et limites

Les mots de passe sont gérés par Supabase Auth, jamais enregistrés par ce site dans une table ou dans le navigateur. Le jeton de session est conservé dans sessionStorage, uniquement pour l’onglet en cours. Une session expirée nécessite une nouvelle connexion. La page élève demande au serveur de vérifier le compte avant d’afficher le profil.

La table de contact autorise seulement l’ajout des champs prévus. Aucun visiteur ne peut lire les messages via la clé publique. Le propriétaire les consulte dans son tableau de bord Supabase. Le nom et le cours sont des informations de profil modifiables par l’utilisateur, pas des autorisations.

Cette version est destinée à la présentation scolaire. Avant d’ouvrir largement le formulaire public, ajouter une protection serveur contre le spam. Les limites d’envoi d’e-mails et d’authentification de Supabase peuvent demander de patienter entre plusieurs essais.

## Fichiers

- index.html : inscription ; connexion.html : connexion ; contact.html : contact.
- espace.html : profil connecté et déconnexion.
- script.js : appels réseau, validation, session et messages de résultat.
- config.js : URL et clé publique du projet à compléter.
- supabase.sql : création de la table et règles d’accès.
- style.css : présentation responsive.

Documentation : https://supabase.com/docs/guides/auth/passwords et https://supabase.com/docs/guides/database/secure-data

## Vérifications réalisées avant livraison

Syntaxe JavaScript et scénarios automatisés avec réponses serveur simulées : inscription, connexion, mauvais mot de passe, message de contact, accès sans session, lecture du profil et configuration absente. Les tests avec une vraie base, les e-mails et le déploiement restent à effectuer après configuration de ton projet Supabase. La mise en page n’a pas été vérifiée dans un navigateur durant cette livraison.
