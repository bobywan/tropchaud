#!/usr/bin/env bash
# init-project.sh
# À lancer une seule fois après avoir créé un nouveau projet depuis le boilerplate.
# Renomme le fichier .code-workspace et met à jour le nom dans package.json.

set -euo pipefail

reset="\033[0m"
bold="\033[1m"
green="\033[32m"
yellow="\033[33m"
dim="\033[2m"

# Nom du projet = nom du dossier courant
project_name="$(basename "$PWD")"

echo ""
echo -e "${bold}  Initialisation du projet${reset} ${yellow}${project_name}${reset}"
echo ""

# ── 1. Renommer le fichier .code-workspace ────────────────────────────────────
workspace_src="$(ls ./*.code-workspace 2>/dev/null | head -n1)"

if [ -n "$workspace_src" ] && [ "$workspace_src" != "./${project_name}.code-workspace" ]; then
  mv "$workspace_src" "${project_name}.code-workspace"
  echo -e "  ${green}✓${reset} Workspace renommé : ${dim}${workspace_src}${reset} → ${bold}${project_name}.code-workspace${reset}"
elif [ -f "${project_name}.code-workspace" ]; then
  echo -e "  ${dim}—${reset} Workspace déjà nommé correctement"
else
  echo -e "  ${dim}—${reset} Aucun fichier .code-workspace trouvé"
fi

# ── 2. Mettre à jour le nom dans package.json ─────────────────────────────────
if [ -f "package.json" ]; then
  if command -v node &>/dev/null; then
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      pkg.name = '${project_name}';
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
    echo -e "  ${green}✓${reset} package.json : name → ${bold}${project_name}${reset}"
  else
    echo -e "  ${yellow}!${reset} Node non disponible — mets à jour ${bold}package.json${reset} manuellement (champ \"name\")"
  fi
fi

echo ""
echo -e "  ${bold}Projet initialisé.${reset} Lance ${yellow}npm install${reset} si ce n'est pas encore fait."
echo ""
