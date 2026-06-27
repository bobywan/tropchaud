# Projet : Application web de gestion de demandes de devis climatisation

## Rôle

Tu es un développeur full-stack senior spécialisé en applications web modernes avec une forte expérience en architecture, sécurité, Docker et déploiement sur serveur privé.

Tu dois m'accompagner dans la création complète d'une application web professionnelle mais simple, destinée à un artisan dans le domaine de la climatisation.

Tu dois agir comme un architecte logiciel :
- analyser les besoins ;
- proposer une architecture propre ;
- créer un code maintenable ;
- éviter la complexité inutile ;
- privilégier une solution fiable et facile à maintenir.

---

# Contexte métier

L'application permet à des clients de déposer une demande de devis pour une installation de climatisation.

Le client reçoit un code personnel après avoir envoyé sa demande.

Plus tard, il peut revenir sur le site avec ce code pour :
- consulter les informations de sa demande ;
- modifier certaines informations si nécessaire ;
- télécharger son devis PDF lorsque le professionnel l'aura ajouté.

Le professionnel dispose d'un espace administrateur sécurisé permettant :
- de voir toutes les demandes ;
- consulter le détail d'une demande ;
- ajouter un fichier PDF correspondant au devis ;
- modifier le statut de la demande.

Ce projet est destiné à un usage réel par un artisan proche.
Il ne s'agit pas d'un SaaS commercial.

---

# Contraintes générales

- Le projet doit être simple, robuste et évolutif.
- Pas de fonctionnalités inutiles.
- Priorité à une première version fonctionnelle rapidement.
- Le code doit être propre et documenté.
- Utiliser TypeScript partout.
- Préparer le projet pour un déploiement Docker.
- Le projet sera hébergé sur un NAS Synology personnel via Portainer.
- Le dépôt source sera hébergé sur GitHub privé.

---

# Stack technique imposée

## Frontend / Backend

Utiliser :

- Next.js dernière version stable
- TypeScript
- App Router
- Tailwind CSS
- composants modernes et réutilisables

Le backend sera intégré dans Next.js avec les API nécessaires.

---

## Base de données

Utiliser :

- PostgreSQL
- Prisma ORM

Créer une architecture permettant une évolution future.

---

## Authentification

Le professionnel sera le seul utilisateur administrateur dans la première version.

Créer un système simple :

- connexion email + mot de passe ;
- mot de passe sécurisé hashé ;
- session sécurisée.

Prévoir une architecture pouvant accepter plusieurs comptes plus tard.

---

## Stockage fichiers

Les fichiers ne doivent pas être stockés directement dans PostgreSQL.

Utiliser :

- MinIO compatible S3

Stocker dans MinIO :
- photos envoyées par les clients ;
- documents PDF des devis.

---

# Architecture attendue

Préparer un projet structuré :

```
/
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── services/
├── docker/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── README.md
└── package.json
```

---

# Fonctionnalités V1

## Partie publique client

Créer une page permettant de déposer une demande de devis.

Champs minimum :

- Nom
- Prénom
- Téléphone
- Email
- Adresse
- Message libre

Prévoir également :

- upload de fichiers facultatifs ;
- photos ;
- documents PDF.

Après validation :

Créer une demande.

Générer automatiquement un code unique permettant au client de retrouver sa demande.

Exemple :

```
CLIM-A82F91
```

Afficher ce code au client.

---

# Partie client suivi de demande

Créer une page :

```
/suivi
```

Le client saisit son code.

Il peut voir :

- ses informations ;
- la date de création ;
- le statut ;
- le devis disponible.

Si un devis existe :

Afficher un bouton :

"Télécharger mon devis PDF"

---

# Partie administration

Créer :

```
/admin
```

avec authentification.

Créer un dashboard simple.

Fonctionnalités :

## Liste des demandes

Afficher :

- nom client ;
- date ;
- statut.

Statuts :

- Nouvelle demande
- En cours
- Devis disponible
- Terminée

---

## Détail d'une demande

Afficher :

- informations client ;
- message ;
- fichiers envoyés ;
- historique éventuel.

Permettre :

- modifier le statut ;
- ajouter un devis PDF ;
- remplacer un devis existant.

---

# Interface utilisateur

Créer une interface moderne mais simple.

Style souhaité :

- propre ;
- professionnel ;
- responsive ;
- facile à utiliser sur ordinateur et tablette.

Pour l'administration :

Créer un layout type dashboard :

- sidebar ;
- navigation ;
- tableau des demandes ;
- pages détail.

---

# Sécurité

Mettre en place les bonnes pratiques :

- validation serveur des formulaires ;
- protection des routes admin ;
- vérification des fichiers uploadés ;
- limitation taille fichiers ;
- variables sensibles dans .env ;
- aucune donnée sensible dans Git.

---

# Docker

Créer :

## Dockerfile

Pour l'application Next.js.

## docker-compose.yml

Prévoir les services :

```
app
postgres
minio
```

Le projet doit pouvoir être lancé avec :

```
docker compose up -d
```

---

# Déploiement NAS

Préparer le projet pour fonctionner derrière :

- reverse proxy Synology ;
- HTTPS ;
- domaine personnalisé.

Documenter dans README :

- installation ;
- configuration ;
- variables environnement ;
- migration base de données ;
- sauvegardes.

---

# Méthode de travail demandée

Ne génère pas tout le projet en une seule fois.

Travaille par étapes :

## Étape 1

Analyser ce cahier des charges.

Créer :
- architecture technique ;
- arborescence projet ;
- modèle de données Prisma.

Attendre ma validation.

---

## Étape 2

Créer la base du projet Next.js.

---

## Étape 3

Implémenter la base PostgreSQL + Prisma.

---

## Étape 4

Créer l'espace client.

---

## Étape 5

Créer l'espace administrateur.

---

## Étape 6

Ajouter MinIO et les uploads.

---

## Étape 7

Préparer Docker et déploiement Synology.

---

# Règles importantes

Avant chaque étape :
- expliquer ce qui va être créé ;
- indiquer les fichiers modifiés ;
- expliquer les choix techniques.

Le code doit rester simple.

Ne pas ajouter de librairies inutiles.

Privilégier les solutions natives Next.js quand possible.

Commence par analyser le projet et proposer l'architecture complète avant d'écrire du code.
