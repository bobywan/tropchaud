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

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditer `.env.local` et adapter les valeurs :

```env
DATABASE_URL=postgresql://tropchaud:motdepasse@localhost:5432/tropchaud
AUTH_SECRET=<générer avec : openssl rand -base64 32>
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=tropchaud
MINIO_USE_SSL=false
```

### 3. Démarrer les services (PostgreSQL + MinIO)

```bash
docker compose up -d postgres minio
```

### 4. Appliquer les migrations

```bash
npm run db:migrate
```

### 5. Créer le compte administrateur

```bash
npm run db:seed
```

### 6. Lancer l'application

```bash
npm run dev
```

---

## Déploiement sur NAS Synology via Portainer

### Prérequis

- Portainer installé sur le NAS
- Reverse proxy Synology configuré (HTTPS + domaine personnalisé)

### 1. Préparer les fichiers sur le NAS

Créer un dossier sur le NAS (ex : `/volume1/docker/tropchaud`) et y déposer :
- `docker-compose.yml`
- `.env` (copié depuis `.env.example` avec les vraies valeurs)

### 2. Variables d'environnement de production

```env
DATABASE_URL=postgresql://tropchaud:<mot-de-passe-fort>@postgres:5432/tropchaud
AUTH_SECRET=<chaine-aleatoire-securisee-32-chars>
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<acces-key-fort>
MINIO_SECRET_KEY=<secret-key-fort>
MINIO_BUCKET=tropchaud
MINIO_USE_SSL=false
NEXT_PUBLIC_APP_URL=https://votre-domaine.fr
```

### 3. Déployer via Portainer

Dans Portainer > Stacks > Add stack, coller le contenu du `docker-compose.yml` ou pointer vers le fichier.

### 4. Appliquer les migrations en production

```bash
docker compose exec app npm run db:migrate
```

### 5. Créer le compte admin en production

```bash
docker compose exec app npm run db:seed
```

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
