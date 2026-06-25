# boby-boilerplate

[![CI](https://github.com/bobywan/boby-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/bobywan/boby-boilerplate/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Node](https://img.shields.io/badge/Node.js-24%20LTS-green?logo=node.js)](https://nodejs.org/)
[![Biome](https://img.shields.io/badge/Biome-lint%20%26%20format-60A5FA?logo=biome)](https://biomejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Boilerplate Next.js (App Router) fullstack, prêt à l'emploi pour démarrer un nouveau projet rapidement.

## Stack

| Outil      | Usage                        |
| ---------- | ---------------------------- |
| Next.js 16 | Framework fullstack          |
| TypeScript | Typage strict                |
| BiomeJS    | Lint + format (remplace ESLint + Prettier) |
| Node.js 24 | Runtime LTS                  |

## Démarrage rapide

```bash
# 1. Créer le projet depuis le boilerplate (sans historique git)
npx degit bobywan/boby-boilerplate mon-projet
cd mon-projet
git init

# 2. Utiliser la bonne version de Node (nvm ou fnm)
nvm use   # ou: fnm use

# 3. Installer les dépendances
npm install

# 4. Initialiser le projet (renomme le workspace, met à jour package.json)
npm run init-project

# 5. Copier les variables d'environnement
cp .env.example .env.local

# 6. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Mise à jour depuis le boilerplate

### Projet qui utilise déjà le boilerplate

```bash
npm run sync
```

### Projet existant sans le boilerplate (première fois)

Copie le script de sync dans le projet, puis lance-le :

```bash
mkdir -p scripts \
  && curl -fsSL https://raw.githubusercontent.com/bobywan/boby-boilerplate/main/scripts/sync-boilerplate.sh \
     -o scripts/sync-boilerplate.sh \
  && chmod +x scripts/sync-boilerplate.sh \
  && ./scripts/sync-boilerplate.sh
```

---

Le script télécharge uniquement les fichiers "infrastructure" depuis la branche `main` du boilerplate. Le code applicatif (`app/`, `next.config.ts`, `package.json`, `.env.example`, `README.md`) n'est jamais écrasé.

Pour pointer vers une autre branche :

```bash
BRANCH=feat/xxx npm run sync
```

> Après une sync, inspecte les changements avec `git diff` avant de commiter.

## Scripts disponibles

| Commande             | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Lance le serveur de dev avec message de démarrage |
| `npm run build`      | Build de production                      |
| `npm run start`      | Démarre le serveur de production         |
| `npm run init-project` | Renomme le workspace et met à jour package.json |
| `npm run typecheck`  | Vérifie les types TypeScript             |
| `npm run sync`       | Synchronise les configs depuis le boilerplate |
| `npm run lint`       | Analyse le code avec Biome               |
| `npm run format`     | Formate le code avec Biome               |
| `npm run check`      | Lint + format + imports en une commande  |
| `npm run ci`         | Vérification CI (lecture seule)          |

## Structure du projet

```
.
├── .github/workflows/ci.yml   # GitHub Actions CI
├── .vscode/                   # Config VSCode / Cursor
├── app/                       # App Router Next.js
│   ├── error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── public/                    # Assets statiques
├── scripts/
│   ├── dev-start.mjs          # Message de démarrage
│   ├── init-project.sh        # Initialisation d'un nouveau projet
│   └── sync-boilerplate.sh    # Synchronisation depuis le boilerplate
├── .env.example               # Variables d'env (template)
├── .nvmrc                     # Node 24 LTS
├── biome.json                 # Config Biome (lint + format)
├── next.config.ts
├── tsconfig.json
└── boby-boilerplate.code-workspace
```

## Variables d'environnement

Copie `.env.example` vers `.env.local` et renseigne les valeurs :

```bash
cp .env.example .env.local
```

> Les fichiers `.env*` sont ignorés par git (sauf `.env.example`).

## Headroom — compression de contexte IA

Ce boilerplate embarque une configuration [Headroom](https://github.com/chopratejas/headroom) dans `.cursor/mcp.json`. Headroom est un serveur MCP qui compresse automatiquement le contexte envoyé aux LLMs (60–95% de tokens économisés).

**Prérequis machine (une seule fois) :**

```bash
# Python 3.10+ requis
pip install "headroom-ai[mcp]"
```

**Vérifier que Cursor détecte le serveur :**

```bash
headroom mcp status
```

Une fois installé, les agents Cursor travaillant sur ce projet ont automatiquement accès aux outils `headroom_compress`, `headroom_retrieve` et `headroom_stats`.

## Licence

MIT
