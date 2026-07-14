#!/usr/bin/env bash
# git-guard installer v3 (framework).
# Instala el hook pre-push en los repos del portafolio.
# v3: autoriza push a master por IDENTIDAD LOCAL (git config operador.maquina) que matchee
#     OPERADOR_MAQUINA o INTEGRADOR_MASTER (lista) del OWNERS.md mas cercano, o el owner del repo.
#     Auto-contenido: NO depende de que el OWNERS.md este en la raiz (funciona en clones standalone).
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
# GO-GIT-GUARD v3 — bloquea push a master/main no autorizado + bloquea force/non-ff.
# Autorizacion master = la IDENTIDAD LOCAL de esta maquina (git config operador.maquina)
# coincide con OPERADOR_MAQUINA o con un nombre de INTEGRADOR_MASTER (lista) del OWNERS.md
# mas cercano, O con el owner del repo en la tabla del OWNERS.md raiz.
top="$(git rev-parse --show-toplevel 2>/dev/null)"
repo_name="$(basename "$top")"

operador_global=""   # OPERADOR_MAQUINA (OWNERS.md mas cercano)
integradores=""      # INTEGRADOR_MASTER lista (OWNERS.md mas cercano)
owner=""             # owner del repo (tabla pipe del OWNERS.md raiz, si esta)
d="$top"
for i in 1 2 3 4 5 6; do
  if [ -f "$d/OWNERS.md" ]; then
    [ -z "$operador_global" ] && operador_global="$(grep -i '^OPERADOR_MAQUINA:' "$d/OWNERS.md" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '\r')"
    [ -z "$integradores" ] && integradores="$(grep -i '^INTEGRADOR_MASTER:' "$d/OWNERS.md" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '\r')"
    if [ -z "$owner" ]; then
      owner="$(awk -F'|' -v repo="$repo_name" '
        NR>1 {
          gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2)
          gsub(/^[[:space:]]+|[[:space:]]+$/, "", $3)
          if ($2 == repo) { print $3; exit }
        }' "$d/OWNERS.md" 2>/dev/null)"
    fi
  fi
  [ "$d" = "/" ] && break
  d="$(dirname "$d")"
done

# Identidad de ESTA maquina (cada quien la configura: git config operador.maquina "Su Nombre")
operador_local="$(git config operador.maquina 2>/dev/null || echo '')"

autorizado=0
if [ -n "$operador_local" ]; then
  # A) identidad = operador global declarado
  [ "$operador_local" = "$operador_global" ] && autorizado=1
  # B) identidad esta en la lista INTEGRADOR_MASTER (separada por comas)
  if [ -n "$integradores" ]; then
    OLDIFS="$IFS"; IFS=','
    for nm in $integradores; do
      nm="$(printf '%s' "$nm" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -d '\r')"
      [ "$operador_local" = "$nm" ] && autorizado=1
    done
    IFS="$OLDIFS"
  fi
  # C) identidad = owner del repo (tabla raiz, legacy)
  [ -n "$owner" ] && [ "$operador_local" = "$owner" ] && autorizado=1
fi

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
      if [ "${GO_PUSH_OVERRIDE:-}" != "1" ] && [ "$autorizado" != "1" ]; then
        echo "git-guard: push a $remote_ref BLOQUEADO." >&2
        echo "  operador_local='$operador_local'  operador_global='$operador_global'  integradores='$integradores'  owner='$owner'" >&2
        echo "  Configura tu identidad: git config operador.maquina \"Tu Nombre\" (debe estar en INTEGRADOR_MASTER de OWNERS.md)" >&2
        echo "  Override consciente: GO_PUSH_OVERRIDE=1 git push ..." >&2
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
  echo "ok git-guard v3: $repo"
}

if [ "$TARGET" = "ALL" ]; then
  echo "Instalando git-guard v3 en repos bajo: $PORTFOLIO"
  for dd in "$PORTFOLIO"/*/ ; do install_into "$dd"; done
else
  install_into "$TARGET"
fi
echo "Listo. Verifica: cat <repo>/.git/hooks/pre-push | head -2"
echo ""
echo "=== Identidad por maquina (OBLIGATORIO para integradores de master) ==="
echo "  cd <tu-repo> && git config operador.maquina \"Tu Nombre Completo\""
echo "El nombre debe coincidir EXACTO con OPERADOR_MAQUINA o un nombre de INTEGRADOR_MASTER en OWNERS.md."
echo "Sin identidad valida: solo puedes pushear tu rama; master/main bloqueado."
