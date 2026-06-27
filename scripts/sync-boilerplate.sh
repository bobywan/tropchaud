#!/usr/bin/env bash
# sync-boilerplate.sh
# Synchronise les fichiers de config depuis boby-boilerplate vers ce projet.
# À lancer depuis la racine du projet à synchroniser.
#
# Usage :
#   ./scripts/sync-boilerplate.sh           # branche main
#   BRANCH=feat/xxx ./scripts/sync-boilerplate.sh  # branche custom
#   ./scripts/sync-boilerplate.sh --check   # vérification sans écriture (CI-safe)

set -euo pipefail

# SHA-256 compatible macOS (shasum) et Linux (sha256sum)
_sha256() {
  if command -v sha256sum &>/dev/null; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

# Liste des fichiers à synchroniser — partagée entre main et --check
_list_files() {
  local is_nextjs=false
  if ls next.config.* &>/dev/null 2>&1 || ([ -f "package.json" ] && grep -q '"next"' package.json); then
    is_nextjs=true
  fi

  cat <<'FILES'
biome.json
.nvmrc
.vscode/settings.json
.vscode/extensions.json
.cursor/mcp.json
.cursor/hooks.json
.cursor/rules/project-stack.mdc
.cursor/rules/typescript-react.mdc
.cursor/rules/tailwind.mdc
.cursor/rules/context-mode.mdc
.cursor/rules/ponytail.mdc
.cursor/rules/00-general.mdc
.cursor/rules/01-code-quality.mdc
.cursor/rules/02-architecture.mdc
.cursor/rules/03-git-workflow.mdc
.cursor/rules/04-security.mdc
.cursor/rules/05-documentation.mdc
.cursor/rules/06-docker.mdc
.cursor/skills/boilerplate-conventions/SKILL.md
.ai/README.md
scripts/init-project.sh
FILES

  if [ "$is_nextjs" = true ]; then
    cat <<'NEXTJS'
tsconfig.json
.github/workflows/ci.yml
.cursor/rules/nextjs-app-router.mdc
scripts/dev-start.mjs
NEXTJS
  fi
}

# Auto-mise à jour : télécharge la version distante, remplace si différente, relance.
# Si curl échoue, on continue sans planter.
_self_update() {
  local branch="${BRANCH:-main}"
  local url="https://raw.githubusercontent.com/bobywan/boby-boilerplate/${branch}/scripts/sync-boilerplate.sh"
  local tmp
  tmp="$(mktemp)"

  if ! curl -fsSL "$url" -o "$tmp" 2>/dev/null; then
    rm -f "$tmp"
    return 0
  fi

  if diff -q "$tmp" "$0" &>/dev/null; then
    rm -f "$tmp"
    return 0
  fi

  cp "$tmp" "$0"
  chmod +x "$0"
  rm -f "$tmp"
  echo "↻ sync-boilerplate.sh mis à jour — relancement…"
  exec bash "$0" "$@"
}

# Mode --check / -c : compare les hashes SHA-256 sans écrire de fichier.
# Exit 0 si tout est à jour, 1 sinon (CI-safe).
_check_mode() {
  local branch="${BRANCH:-main}"
  local repo="bobywan/boby-boilerplate"
  local base_url="https://raw.githubusercontent.com/${repo}/${branch}"

  local reset="\033[0m" bold="\033[1m" green="\033[32m"
  local yellow="\033[33m" red="\033[31m" dim="\033[2m"

  echo ""
  echo -e "${bold}  Check depuis ${yellow}${repo}${reset}${bold} (${branch})${reset}"
  echo ""

  local tmp_dir
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "$tmp_dir"' EXIT

  local files=()
  while IFS= read -r f; do [[ -n "$f" ]] && files+=("$f"); done < <(_list_files)

  local all_ok=0

  for file in "${files[@]}"; do
    local tmp_file="${tmp_dir}/$(echo "$file" | tr '/' '_')"
    if ! curl -fsSL "${base_url}/${file}" -o "$tmp_file" 2>/dev/null; then
      echo -e "  ${yellow}?${reset} ${file} ${dim}(introuvable sur ${branch})${reset}"
      all_ok=1
      continue
    fi
    if [ ! -f "$file" ]; then
      echo -e "  ${yellow}?${reset} ${file} ${dim}(absent localement)${reset}"
      all_ok=1
      continue
    fi
    local h_local h_remote
    h_local="$(_sha256 "$file")"
    h_remote="$(_sha256 "$tmp_file")"
    if [ "$h_local" = "$h_remote" ]; then
      echo -e "  ${green}✓${reset} ${file}"
    else
      echo -e "  ${red}✗${reset} ${file} ${dim}(différent)${reset}"
      all_ok=1
    fi
  done

  # Vérification du script lui-même
  local self_tmp="${tmp_dir}/sync-boilerplate.sh"
  if curl -fsSL "${base_url}/scripts/sync-boilerplate.sh" -o "$self_tmp" 2>/dev/null; then
    local h_self h_self_remote
    h_self="$(_sha256 "$0")"
    h_self_remote="$(_sha256 "$self_tmp")"
    if [ "$h_self" = "$h_self_remote" ]; then
      echo -e "  ${green}✓${reset} scripts/sync-boilerplate.sh"
    else
      echo -e "  ${red}✗${reset} scripts/sync-boilerplate.sh ${dim}(différent)${reset}"
      all_ok=1
    fi
  else
    echo -e "  ${yellow}?${reset} scripts/sync-boilerplate.sh ${dim}(introuvable sur ${branch})${reset}"
    all_ok=1
  fi

  echo ""
  if [ "$all_ok" -eq 0 ]; then
    echo -e "  ${bold}${green}Tout est à jour.${reset}"
  else
    echo -e "  ${bold}${red}Des fichiers diffèrent ou sont absents.${reset} Lance ${yellow}npm run sync${reset} pour mettre à jour."
  fi
  echo ""

  trap - EXIT
  rm -rf "$tmp_dir"
  return "$all_ok"
}

main() {
  local REPO="bobywan/boby-boilerplate"
  local BRANCH="${BRANCH:-main}"
  local BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

  local reset="\033[0m" bold="\033[1m" green="\033[32m"
  local yellow="\033[33m" red="\033[31m" dim="\033[2m"

  # Détection Next.js
  local is_nextjs=false
  if ls next.config.* &>/dev/null 2>&1 || ([ -f "package.json" ] && grep -q '"next"' package.json); then
    is_nextjs=true
  fi

  echo ""
  if [ "$is_nextjs" = true ]; then
    echo -e "${bold}  Sync depuis ${yellow}${REPO}${reset}${bold} (${BRANCH}) — mode Next.js${reset}"
  else
    echo -e "${bold}  Sync depuis ${yellow}${REPO}${reset}${bold} (${BRANCH}) — mode universel${reset}"
  fi
  echo ""

  local errors=0

  local files=()
  while IFS= read -r f; do [[ -n "$f" ]] && files+=("$f"); done < <(_list_files)

  for file in "${files[@]}"; do
    local dir
    dir="$(dirname "$file")"
    [ "$dir" != "." ] && mkdir -p "$dir"
    if curl -fsSL "${BASE_URL}/${file}" -o "$file" 2>/dev/null; then
      echo -e "  ${green}✓${reset} ${file}"
    else
      echo -e "  ${red}✗${reset} ${file} ${dim}(erreur — fichier introuvable sur ${BRANCH})${dim}"
      errors=$((errors + 1))
    fi
  done

  echo ""

  # Fichier .code-workspace renommé selon le projet courant
  local project_name workspace_target
  project_name="$(basename "$PWD")"
  workspace_target="${project_name}.code-workspace"
  if curl -fsSL "${BASE_URL}/boby-boilerplate.code-workspace" -o "$workspace_target" 2>/dev/null; then
    for old_ws in ./*.code-workspace; do
      [ "$old_ws" = "./${workspace_target}" ] && continue
      rm -f "$old_ws"
      echo -e "  ${dim}~${reset} ${old_ws#./} supprimé (remplacé)"
    done
    echo -e "  ${green}✓${reset} ${workspace_target}"
  else
    echo -e "  ${red}✗${reset} .code-workspace ${dim}(erreur de téléchargement)${dim}"
    errors=$((errors + 1))
  fi

  # Merge du .gitignore
  sync_gitignore "$BASE_URL" "$green" "$red" "$reset" "$dim" || errors=$((errors + 1))

  echo ""

  # Merge des scripts boilerplate dans package.json local
  if [ -f "package.json" ] && command -v node &>/dev/null; then
    local tmp_pkg
    tmp_pkg="$(mktemp)"
    if curl -fsSL "${BASE_URL}/package.json" -o "$tmp_pkg" 2>/dev/null; then
      node - "$tmp_pkg" <<'EOF'
const fs = require("fs");
const [,, remotePath] = process.argv;
const local = JSON.parse(fs.readFileSync("package.json", "utf8"));
const remote = JSON.parse(fs.readFileSync(remotePath, "utf8"));
const merged = { ...local, scripts: { ...local.scripts, ...remote.scripts } };
fs.writeFileSync("package.json", JSON.stringify(merged, null, 2) + "\n");
EOF
      echo -e "  ${green}✓${reset} package.json : scripts mis à jour"
    else
      echo -e "  ${yellow}!${reset} package.json : impossible de récupérer le package.json distant"
    fi
    rm -f "$tmp_pkg"
  fi

  echo ""

  if [ "$errors" -eq 0 ]; then
    echo -e "  ${bold}Sync terminé.${reset} Pense à relancer ${yellow}npm install${reset} si les configs ont changé."
  else
    echo -e "  ${bold}Sync terminé avec ${red}${errors} erreur(s)${reset}. Vérifie les fichiers marqués ✗."
  fi

  echo ""
}

sync_gitignore() {
  local remote_url="$1" green="$2" red="$3" reset="$4" dim="$5"
  local tmp_remote
  tmp_remote="$(mktemp)"

  if ! curl -fsSL "${remote_url}/.gitignore" -o "$tmp_remote" 2>/dev/null; then
    echo -e "  ${red}✗${reset} .gitignore ${dim}(erreur de téléchargement)${dim}"
    rm -f "$tmp_remote"
    return 1
  fi

  if [ ! -f ".gitignore" ]; then
    cp "$tmp_remote" .gitignore
    echo -e "  ${green}✓${reset} .gitignore (créé)"
    rm -f "$tmp_remote"
    return 0
  fi

  local added=0
  local new_lines=""
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    if ! grep -qxF "$line" .gitignore; then
      new_lines+="${line}"$'\n'
      added=$((added + 1))
    fi
  done < "$tmp_remote"

  if [ "$added" -gt 0 ]; then
    printf '\n# synced from boilerplate\n%s' "$new_lines" >> .gitignore
    echo -e "  ${green}✓${reset} .gitignore (${added} ligne(s) ajoutée(s))"
  else
    echo -e "  ${green}✓${reset} .gitignore (déjà à jour)"
  fi

  rm -f "$tmp_remote"
}

_self_update "$@"

for arg in "$@"; do
  case "$arg" in
    --check|-c)
      _check_mode || exit 1
      exit 0
      ;;
  esac
done

main "$@"
