#!/usr/bin/env bash
set -euo pipefail

say() {
  printf "\n[deploy] %s\n" "$1"
}

die() {
  printf "\n[deploy][error] %s\n" "$1" >&2
  exit 1
}

ensure_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Este directorio no es un repositorio Git."
}

remove_tracked_ignored() {
  say "Buscando archivos trackeados que ahora estan en gitignore..."

  mapfile -d '' tracked_ignored < <(git ls-files -ci --exclude-standard -z)

  if ((${#tracked_ignored[@]})); then
    printf '%s\0' "${tracked_ignored[@]}" | xargs -0 git rm -r --cached --quiet --
    say "Se quitaron del indice ${#tracked_ignored[@]} archivo(s)/carpeta(s) ignorados (se mantienen en local)."
  else
    say "No hay archivos trackeados que coincidan con gitignore."
  fi
}

run_validations() {
  if [[ -f package.json ]] && command -v pnpm >/dev/null 2>&1; then
    if grep -q '"check"' package.json; then
      say "Ejecutando validaciones: pnpm check"
      pnpm check
    else
      say "No existe script check en package.json, se omite validacion."
    fi
  else
    say "No se encontro package.json o pnpm, se omite validacion."
  fi
}

stage_changes() {
  say "Haciendo git add -A (respeta .gitignore)."
  git add -A

  if git diff --cached --quiet; then
    say "No hay cambios para commit despues del add."
    exit 0
  fi
}

commit_changes() {
  local commit_msg

  while true; do
    read -r -p "Nombre del commit: " commit_msg
    commit_msg="${commit_msg//$'\r'/}"
    if [[ -n "${commit_msg// /}" ]]; then
      break
    fi
    printf "El commit no puede estar vacio.\n"
  done

  say "Creando commit."
  git commit -m "$commit_msg"
}

push_changes() {
  local branch

  branch="$(git rev-parse --abbrev-ref HEAD)"
  [[ -n "$branch" && "$branch" != "HEAD" ]] || die "No se pudo detectar una rama activa."

  say "Subiendo cambios a GitHub (rama: $branch)."
  if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
    git push
  else
    git push -u origin "$branch"
  fi
}

hide_local_status() {
  local exclude_file

  exclude_file="$(git rev-parse --git-path info/exclude)"
  mkdir -p "$(dirname "$exclude_file")"
  touch "$exclude_file"

  say "Ocultando untracked locales en .git/info/exclude."
  mapfile -d '' untracked < <(git ls-files --others --exclude-standard -z)
  if ((${#untracked[@]})); then
    printf "\n# Added by deploy-github.sh on %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" >> "$exclude_file"
    for p in "${untracked[@]}"; do
      if ! grep -Fqx -- "$p" "$exclude_file"; then
        printf '%s\n' "$p" >> "$exclude_file"
      fi
    done
    say "Se agregaron ${#untracked[@]} entrada(s) a .git/info/exclude."
  else
    say "No hay untracked por ocultar."
  fi

  say "Ocultando cambios locales en archivos trackeados con skip-worktree."
  mapfile -d '' modified < <(git ls-files -m -z)
  if ((${#modified[@]})); then
    printf '%s\0' "${modified[@]}" | xargs -0 git update-index --skip-worktree --
    say "Se marco skip-worktree para ${#modified[@]} archivo(s)."
  else
    say "No hay archivos modificados por ocultar."
  fi

  say "Estado final de Git:"
  git status --short
}

main() {
  ensure_git_repo
  remove_tracked_ignored
  run_validations
  stage_changes
  commit_changes
  push_changes
  hide_local_status

  say "Proceso completado."
}

main "$@"
