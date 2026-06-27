# Plan de continuation — TropChaud

## Contexte

Application Next.js 16 (App Router) de gestion de devis climatisation.

Stack : Next.js 16.2.6, TypeScript, Tailwind CSS v4, Prisma 7 + PostgreSQL, Auth.js v5 (next-auth@beta), MinIO (S3), BiomeJS v2, Docker.

---

## État actuel

### Ce qui fonctionne (validé le 27/06/2026)
- Base de données migrée (`prisma migrate dev` → migration `20260625211151_init`)
- Compte admin créé (`npm run db:seed` → `admin@tropchaud.fr`)
- Serveur Next.js démarre sans erreur (`npm run dev`)
- Page d'accueil accessible (`GET / 200`)
- Proxy (`proxy.ts`) — protection routes `/admin/*` (Node.js runtime, Next.js 16)
- `bodySizeLimit: "50mb"` configuré dans `next.config.ts`
- Port MinIO API `9000` exposé dans `docker-compose.yml`
- Service `createbuckets` (minio/mc) dans `docker-compose.yml` — bucket `tropchaud` créé automatiquement
- `scripts/entrypoint.sh` + `CMD` Dockerfile — `prisma migrate deploy` au démarrage du container
- Cache `.next` vidé (Turbopack repart de zéro)
- Boilerplate resynchronisé (`npm run sync` le 27/06/2026)
- **`.env.local` créé** avec les valeurs `localhost` pour dev local (PostgreSQL + MinIO + AUTH_SECRET)
- **PostgreSQL** : connexion OK, tables `User/Demande/Fichier/Devis` présentes, CRUD validé
- **MinIO** : bucket `tropchaud` présent, upload/URL signée/suppression validés
- **Compte admin** : `admin@tropchaud.fr` / `changez-ce-mot-de-passe` — hash bcrypt valide

### ⚠️ Écart de mot de passe PostgreSQL
Le volume Docker a été initialisé avec `POSTGRES_PASSWORD=tropchaud_secret`, mais le défaut dans `docker-compose.yml` est `motdepasse`. La variable dans `.env.local` est correcte (`tropchaud_secret`). Pour un déploiement Docker fresh (nouveau volume), le mot de passe sera `motdepasse` sauf si `POSTGRES_PASSWORD` est explicitement défini dans un `.env` Docker.

### Fichiers clés
```
app/
├── actions/demandes.ts         # Server Action soumission devis (console.error activé pour debug)
├── actions/auth.ts             # Server Action login admin
├── actions/admin.ts            # Server Actions admin (statut, upload devis)
├── admin/(auth)/login/         # Page login sans sidebar
├── admin/(protected)/          # Layout avec sidebar + dashboard + détail
├── api/auth/[...nextauth]/     # Route handler Auth.js
├── confirmation/               # Page affichage code CLIM-XXXXXX
└── suivi/[code]/               # Page suivi client

lib/
├── prisma.ts       # Singleton Prisma 7 + adapter-pg
├── auth.ts         # Config Auth.js v5 (Credentials provider)
├── minio.ts        # Client S3/MinIO
├── code.ts         # Génération CLIM-XXXXXX
└── validations.ts  # Schémas Zod

services/
├── demandes.ts     # CRUD demandes
└── fichiers.ts     # Upload/download fichiers MinIO

proxy.ts                  # Protection routes /admin/* (Node.js runtime)
scripts/entrypoint.sh     # Migration DB + démarrage prod
prisma/schema.prisma
docker-compose.yml
Dockerfile
```

---

## Bug P1001 — RÉSOLU (27/06/2026)

**Cause réelle** : il n'existait pas de fichier `.env.local`. Next.js chargeait l'`.env.example` qui contient le hostname `postgres` (réseau Docker interne) au lieu de `localhost`. Le cache Turbopack n'était pas en cause.

**Fix** : création de `.env.local` avec `DATABASE_URL=postgresql://tropchaud:tropchaud_secret@localhost:5432/tropchaud` et `MINIO_ENDPOINT=localhost`.

---

## Tâches restantes

### 1. Test de bout en bout (à tester manuellement dans le navigateur)

- [ ] Formulaire client → soumission sans fichier → confirmation avec code `CLIM-XXXXXX`
- [ ] Formulaire client → soumission avec fichier image/PDF → confirmation
- [ ] `/suivi` → saisir le code → voir la demande
- [ ] `/admin/login` → connexion avec `admin@tropchaud.fr` / `changez-ce-mot-de-passe`
- [ ] Dashboard → voir la demande
- [ ] Détail → changer le statut → vérifier côté client
- [ ] Détail → uploader un PDF → vérifier que le client voit "Télécharger mon devis PDF"

### 2. ~~Nettoyer le console.error temporaire~~ ✓ FAIT

`console.error` retiré de `app/actions/demandes.ts`. Le bloc `catch` retourne toujours `erreurGlobale` à l'utilisateur.
`POSTGRES_PASSWORD` ajouté dans `.env.example` + stratégie deux-fichiers documentée (`.env` pour Docker Compose, `.env.local` pour dev Next.js).

### 3. Étape 6 — MinIO (uploads en production)

- [ ] Tester l'upload de photos (JPEG/PNG/WebP) depuis le formulaire client
- [ ] Tester l'upload de devis PDF depuis l'interface admin
- [ ] Vérifier les URLs signées (téléchargement) côté client

### 4. Étape 7 — Docker & déploiement Synology

- [ ] Tester le build Docker complet : `docker compose up -d`
- [ ] Vérifier que la migration se lance automatiquement au démarrage (`entrypoint.sh`)
- [ ] Configurer le reverse proxy Synology pour pointer vers le port 3000
- [ ] Configurer HTTPS avec le domaine personnalisé
- [ ] Changer tous les secrets pour la production (AUTH_SECRET, POSTGRES_PASSWORD, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)

---

## Commandes utiles (rappel)

```bash
# Démarrer les services Docker (dev)
docker compose up -d postgres minio

# Créer le bucket MinIO (une seule fois, ou automatique avec createbuckets)
docker compose up createbuckets

# Lancer en dev
npm run dev

# Si la DB est réinitialisée
npm run db:migrate:dev
npm run db:seed

# Vérifier TypeScript
npm run typecheck

# Lint / format
npm run check
```

## Accès locaux

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | — |
| Admin | http://localhost:3000/admin/login | admin@tropchaud.fr / changez-ce-mot-de-passe |
| MinIO console | http://localhost:9001 | minioadmin / minioadmin |
