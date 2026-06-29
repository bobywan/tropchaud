# TropChaud

Application web de gestion des demandes de devis pour un artisan en climatisation.

- Les clients déposent une demande et reçoivent un code de suivi unique (`CLIM-XXXXXX`).
- L'artisan gère les demandes depuis un espace admin sécurisé et peut uploader les devis PDF.

---

## Stack technique

| Couche | Outil |
|--------|-------|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript strict |
| Styles | Tailwind CSS v4 |
| Base de données | PostgreSQL + Prisma 7 |
| Authentification | Auth.js v5 (NextAuth) |
| Stockage fichiers | MinIO (S3 compatible) |
| Déploiement | Docker + NAS Synology |

---

## Installation (développement local)

### Prérequis

- Node.js >= 24
- Docker & Docker Compose

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd tropchaud
```

### 2. Installer les dépendances

```bash
npm install
```

Le client Prisma est généré automatiquement via le script `postinstall`.

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` et adapter les valeurs (`POSTGRES_PASSWORD`, `AUTH_SECRET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `ADMIN_PASSWORD`). Le `DATABASE_URL` pointe déjà sur `localhost:5433` (port hôte Docker Compose).

Créer ensuite un fichier `.env.local` pour que le dev server Next.js contacte MinIO via le port hôte :

```env
# .env.local
MINIO_ENDPOINT=localhost
MINIO_PORT=9010
```

### 4. Démarrer les services (PostgreSQL + MinIO)

```bash
docker compose up -d postgres minio createbuckets
```

### 5. Appliquer les migrations

```bash
npm run db:migrate
```

### 6. Créer le compte administrateur

```bash
npm run db:seed
```

### 7. Lancer l'application

```bash
npm run dev
```

---

## Déploiement sur NAS Synology via Portainer

### Prérequis

- Portainer installé sur le NAS
- Reverse proxy Synology configuré (HTTPS + domaine personnalisé)

### 1. Configurer la stack dans Portainer

Dans Portainer > **Stacks > Add stack** :
- **Build method** : Repository
- **Repository URL** : `https://github.com/bobywan/tropchaud`
- **Authentication** : activé, avec ton nom d'utilisateur GitHub et un Personal Access Token (scope `repo`)
- **Compose path** : `docker-compose.yml`

### 2. Variables d'environnement de production

Dans l'onglet **Environment variables** de la stack Portainer, ajouter :

```env
POSTGRES_PASSWORD=<mot-de-passe-fort>
AUTH_SECRET=<chaine-aleatoire-32-chars : openssl rand -base64 32>
AUTH_URL=https://votre-domaine.fr
MINIO_ACCESS_KEY=<acces-key-fort>
MINIO_SECRET_KEY=<secret-key-fort>
MINIO_PUBLIC_URL=http://votre-domaine.fr:9010
ADMIN_EMAIL=admin@votre-domaine.fr
ADMIN_PASSWORD=<mot-de-passe-admin>
NEXT_PUBLIC_APP_URL=https://votre-domaine.fr
```

### 3. Déployer

Cliquer sur **Deploy the stack**. Les services `migrate` et `seeder` s'exécutent automatiquement au démarrage — aucune commande manuelle n'est nécessaire.

---

## Scripts disponibles

```bash
npm run dev          # Démarrage en développement
npm run build        # Build de production
npm run start        # Démarrage en production
npm run check        # Lint + format (BiomeJS)
npm run typecheck    # Vérification TypeScript
npm run db:migrate   # Appliquer les migrations Prisma
npm run db:seed      # Créer le compte administrateur
```

---

## Sauvegardes

### Base de données (PostgreSQL)

```bash
docker compose exec postgres pg_dump -U tropchaud tropchaud > backup_$(date +%Y%m%d).sql
```

### Fichiers (MinIO)

Les données MinIO sont persistées dans le volume Docker `minio_data`. Sauvegarder ce volume régulièrement depuis l'interface Portainer ou via `rsync`.

---

## Structure du projet

```
app/
├── page.tsx                 # Formulaire de demande de devis
├── confirmation/            # Affichage du code après soumission
├── suivi/                   # Suivi de demande par code
├── admin/                   # Espace administrateur
└── api/                     # API Routes

lib/
├── prisma.ts                # Client Prisma
├── auth.ts                  # Config Auth.js
├── minio.ts                 # Client MinIO/S3
├── code.ts                  # Génération code CLIM-XXXXXX
└── validations.ts           # Schémas Zod

services/
├── demandes.ts              # Logique métier demandes
└── fichiers.ts              # Logique uploads/downloads

prisma/
└── schema.prisma            # Modèle de données
```
