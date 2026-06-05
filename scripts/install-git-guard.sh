#!/usr/bin/env bash
# git-guard installer (framework).
# Instala el hook pre-push OPERADOR_MAQUINA en los repos del portafolio.
# El hook lee OWNERS.md en runtime: solo la maquina del integrador
# (OPERADOR_MAQUINA == INTEGRADOR_MASTER) pushea master/main; el resto solo ramas; force-push bloqueado.
#
# Uso:
#   bash install-git-guard.sh            # instala en TODOS los repos bajo la raiz del portafolio
#   bash install-git-guard.sh <dir_repo> # instala solo en ese repo (para pruebas)
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PORTFOLIO="$(cd "$HERE/../.." && pwd)"
TARGET="${1:-ALL}"

read -r -d '' HOOK <<'HOOK_EOF'
#!/usr/bin/env bash
# GO-GIT-GUARD v1 — bloquea push a master/main desde maquina no-operadora + bloquea force/non-ff.
top="$(git rev-parse --show-toplevel 2>/dev/null)"
owners=""; d="$top"
for i in 1 2 3 4 5 6; do
  [ -f "$d/OWNERS.md" ] && { owners="$d/OWNERS.md"; break; }
  [ "$d" = "/" ] && break; d="$(dirname "$d")"
done
operador="$(grep -i '^OPERADOR_MAQUINA:' "$owners" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '\r')"
integrador="$(grep -i '^INTEGRADOR_MASTER:' "$owners" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '\r')"
zero="0000000000000000000000000000000000000000"
rc=0
while read -r local_ref local_sha remote_ref remote_sha; do
  [ -z "$remote_ref" ] && continue
  # force / non-ff: el remoto tiene commits que el local reescribe
  if [ "$remote_sha" != "$zero" ] && [ "$local_sha" != "$zero" ]; then
    if ! git merge-base --is-ancestor "$remote_sha" "$local_sha" 2>/dev/null; then
      if [ "${GO_FORCE_OK:-}" != "1" ]; then
        echo "git-guard: force/non-ff push a $remote_ref BLOQUEADO. Override consciente: GO_FORCE_OK=1" >&2
        rc=1
      fi
    fi
  fi
  case "$remote_ref" in
    refs/heads/master|refs/heads/main)
      if [ "${GO_PUSH_OVERRIDE:-}" != "1" ] && { [ -z "$integrador" ] || [ "$operador" != "$integrador" ]; }; then
        echo "git-guard: push a $remote_ref BLOQUEADO (operador='$operador', integrador='$integrador', no autorizado). Usa tu rama. Override: GO_PUSH_OVERRIDE=1" >&2
        rc=1
      fi
      ;;
  esac
done
exit $rc
HOOK_EOF

install_into() {
  local repo="${1%/}"
  if [ ! -d "$repo/.git" ]; then echo "skip (no git): $repo"; return; fi
  printf '%s\n' "$HOOK" > "$repo/.git/hooks/pre-push"
  chmod +x "$repo/.git/hooks/pre-push"
  echo "ok git-guard: $repo"
}

if [ "$TARGET" = "ALL" ]; then
  echo "Instalando git-guard en repos bajo: $PORTFOLIO"
  for dd in "$PORTFOLIO"/*/ ; do install_into "$dd"; done
else
  install_into "$TARGET"
fi
echo "Listo. Verifica: cat <repo>/.git/hooks/pre-push | head -2"
