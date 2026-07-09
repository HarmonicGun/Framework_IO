# GIT_PROTOCOL — integrar sin perder NADA (anti-desastre)

> Nacido de desastres reales: (1) `git branch -f rama master` / "Reset to master" huerfano commits
> de un ingeniero; (2) alguien commiteo local y NO pusheo -> casi se pierde un dia; (3) ramas
> divergieron -> tentacion de force; (4) merge resolvio al lado equivocado. Este protocolo existe
> para que eso NO se repita. El hook `git-guard` lo refuerza mecanicamente.

## PRINCIPIO 0 — el trabajo solo existe cuando esta en origin

Trabajo en UN solo lugar (disco local) = riesgo de perdida total. Regla raiz:
**push primero, mover punteros despues.** Nada se integra, alinea ni resetea si no esta en `origin`.
Push diario obligatorio al cerrar.

## La regla de oro

```
Las ramas SUBEN a master una por una (merge, conflictos resueltos hunk por hunk),
LUEGO master BAJA a las ramas (fast-forward puro),
LUEGO master baja a los locales (ff-only).
Nunca al reves. Nunca con force. Nunca con reset. Nunca a ciegas.
```

---

## PROCEDIMIENTO OFICIAL DE INTEGRACION (FASE 0 -> 6)

### FASE 0 — Freeze + identidad + entorno
- Anunciar ventana de integracion. Durante ella NINGUN ingeniero pushea/pullea/mergea-master.
- Un solo integrador toca master a la vez. Tomar lock: `git push origin HEAD:refs/heads/lock-master` (si falla = otro lo tiene; esperar).
- Integrar desde un clon FUERA de cualquier carpeta sincronizada (Drive/Dropbox), o pausar la sync toda la ventana (el `.git` sincronizado se corrompe a media operacion).
- Por clon: `git config operador.maquina "<Nombre exacto de OWNERS.md>"`. Si `.gitattributes` declara un driver de merge (ej. `archivo.lock merge=ours`), registrarlo con el comando exacto: `git config merge.ours.driver true`. Hook `pre-push` presente y self-test verde (ver Enforcement mecanico). En Windows: `git config core.autocrlf input`.

### FASE 1 — Gate de PUSHED (cada ingeniero en SU clon)
```bash
git status                                  # working tree limpio
git add <rutas explicitas>                  # NUNCA git add -A / git add .
git commit -m "..."
git push origin <su-rama>
git log origin/<su-rama>..HEAD --oneline    # DEBE salir VACIO
```
Vacio = todo subido. El integrador NO arranca hasta que TODAS las ramas confirmen y `git fetch` muestre cada `origin/<rama>` avanzada. El integrador no ve commits locales: depende de este push.

### FASE 2 — Red de seguridad (integrador)
```bash
git fetch --all --prune --tags
TS=$(date +%Y%m%d-%H%M%S)
for r in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | sed 's#origin/##' | grep -vE '^(HEAD|master)$'); do
  git tag "pre-integracion/$r-$TS" "origin/$r"
  git rev-parse "pre-integracion/$r-$TS" >/dev/null || { echo "TAG FALLO $r"; exit 1; }
  git push origin "pre-integracion/$r-$TS"          # los tags se PUSHEAN: el reflog es local
done
git bundle create "$HOME/<repo>_$TS.bundle" --all && git bundle verify "$HOME/<repo>_$TS.bundle"
```
Tag fija el tip aunque luego se mueva el puntero. Bundle saca el trabajo del disco unico.

### FASE 3 — Integrar ramas -> master, UNA A LA VEZ (mas adelantada primero)
Por cada rama `B` de la lista dinamica:
```bash
git fetch origin B
SHA=$(git rev-parse origin/B)               # FIJAR el SHA; trabajar por SHA (anti-carrera)
git log master..$SHA --oneline              # que aporta B
git log $SHA..master --oneline              # que le falta (si ambos traen algo = divergido)
git merge-tree --write-tree master $SHA >/dev/null && echo "dry-run sin conflicto" || echo "habra conflicto"
git merge --no-ff "$SHA" -m "integra B (<desc>) a master"
#   conflicto: UNION hunk por hunk (R4). git add <rutas explicitas>. suite verde.
git log "$SHA"..origin/B --oneline          # re-fetch: si llegaron commits en la carrera, integrarlos
git log master..origin/B --oneline          # VERIFICACION: DEBE quedar VACIO
git push origin master                      # FF; non-ff = otro movio master -> re-fetch+merge, NUNCA -f
```
Entregar la verificacion de `B` ANTES de la siguiente. TODAS las ramas se integran antes de cualquier replica.

### FASE 4 — Replicar master -> cada rama (FF puro)
```bash
for r in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | sed 's#origin/##' | grep -vE '^(HEAD|master)$'); do
  git log origin/master..origin/$r --oneline   # DEBE estar vacio
  git push origin master:$r                     # FF, SIN -f. Nombre EXACTO de for-each-ref
done                                            # non-ff -> esa rama tiene trabajo sin integrar -> FASE 3
```

### FASE 5 — Locales al final
- Cada ingeniero: `git merge --ff-only origin/<su-rama>`.
- El integrador en su local: `git pull --ff-only` de ULTIMO.

### FASE 6 — Cierre (prueba de cero perdida, DOS loops)
```bash
git fetch --all --prune --tags     # re-fetch: no verificar contra datos viejos

# Loop 1 — nada del trabajo original quedo fuera de master
for t in $(git tag -l "pre-integracion/*-$TS"); do echo "== $t =="; git log --oneline "master..$t"; done
#   ^ TODO debe salir VACIO. Ningun autor debe desaparecer. Suite verde.

# Loop 2 — CADA rama replicada quedo identica a master (no desactualizada, no parcial)
for r in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | sed 's#origin/##' | grep -vE '^(HEAD|master)$'); do
  echo "== $r =="; git log --oneline "origin/master..origin/$r"
done
#   ^ TODO debe salir VACIO.
```
Solo con AMBOS loops vacios se declara "prueba de cero perdida" cumplida. Recien entonces soltar lock (`git push origin --delete lock-master`), reanudar sync pausada, declarar ventana cerrada. No borrar tags/bundle sin visto bueno explicito del dueno del repo.

---

## FLUJO DIARIO DEL INGENIERO (pull / push de TU rama, sin perder local)

Aplica PRINCIPIO 0 + R1/R3/R8. NUNCA `git pull` pelado, NUNCA reset/force, NUNCA tocar master.

### "haz pull de mi rama" (despues de que el integrador sincronizo)
Bajar lo nuevo SIN borrar lo local; el resultado (local + lo nuevo) se commitea como punto de partida.
```bash
git status
git stash -u                                # si hay cambios sin commitear (incluye untracked)
git fetch origin
git merge --ff-only origin/<TU-RAMA> 2>/dev/null \
  || git merge --no-ff origin/<TU-RAMA> -m "merge: sync de master en <TU-RAMA>"   # divergida: merge, conserva ambos
git stash pop                                # resolver conflicto a UNION (ambos lados)
git add <rutas explicitas> && git commit -m "chore: punto de partida tras sync (local + master)"
```
Si `merge --ff-only` pasa, estabas limpio detras de origin. Si falla, tu rama tenia trabajo -> merge (no reset) lo une. Conflicto = conservar AMBOS lados.

### "haz push a mi rama" (respetando el sync)
Solo a TU rama, jamas master. Si origin avanzo, integrar ANTES de pushear.
```bash
git fetch origin
git merge --ff-only origin/<TU-RAMA> 2>/dev/null \
  || git merge --no-ff origin/<TU-RAMA> -m "merge: sync de master en <TU-RAMA>"
git push origin <TU-RAMA>                     # FF; si non-ff -> re-fetch + re-merge, NUNCA -f
```

### ¿El integrador ya sincronizo?
```bash
git fetch origin && git log --oneline origin/<TU-RAMA>..origin/master   # vacio = tu rama ya tiene todo master
```
Si aun no, sigue commiteando normal a tu rama. Cuando avise "ya sincronice", corre el pull de arriba.

---

## REGLAS DURAS (cada una mata un desastre)

**R1 — Push primero.** Commit local sin push se evapora si alguien mueve el puntero. Antes de alinear/resetear: `git log origin/<rama>..HEAD` VACIO. Si NO sale vacio, la accion obligatoria es pushear esos commits primero — nunca alinear/resetear/reemplazar la rama mientras haya commits locales sin subir.

**R2 — CERO reset-to-master.** PROHIBIDO para "alinear": `git reset --hard master`, `git reset --hard origin/master` (el remoto es blanco tan prohibido como el local), `git branch -f <rama> master`, `git checkout -B <rama> master`, GUI "Reset to master", `git push -f origin master:<rama>`. Alinear = SOLO `git merge --ff-only` o `git push origin master:<rama>` (FF). El FF que falla protege; el reset pisa.

**R3 — Divergencia = merge, nunca force.** Rama y master avanzaron ambos: se unen SOLO con `git merge --no-ff` (2 padres = cero perdida). Nunca `git push -f`, nunca `git pull` pelado.

**R4 — Conflicto = UNION hunk por hunk.** El archivo resuelto es SUPERSET de ambos lados. PROHIBIDO `-X ours/theirs` y `git checkout --ours/--theirs <archivo>` en bloque. Para inspeccionar cada lado ANTES de decidir la union: `git show :1:<archivo>` (base comun), `:2:<archivo>` (nuestro lado), `:3:<archivo>` (lado entrante) — nunca resolver a ciegas. Cierre = gate semantico, no solo sintactico: (1) sin marcadores de conflicto Y (2) suite verde. Un archivo "limpio" puede seguir logicamente roto si solo se verifico (1).

**R5 — Integracion por lease.** Ninguna decision de merge, conflicto o verificacion es valida si se basa en una lectura vieja del remoto. Re-fetch JUSTO antes de cada operacion; fijar `SHA=$(git rev-parse origin/B)` y mergear el SHA fijo (no el nombre de la rama, que puede seguir avanzando). Re-verificar carrera tras integrar (re-fetch la rama origen, confirmar que no llegaron commits nuevos durante la operacion).

**R6 — Un integrador a la vez.** Serializar con lock + freeze. Push a master non-ff = el otro movio master: re-fetch + merge, NUNCA -f.

**R7 — Replicar = FF puro.** `git push origin master:<rama>` sin -f. Rechazo non-ff = rama con trabajo sin integrar -> FASE 3.

**R8 — Working dir sucio se materializa** (`git stash -u` / commit a rama WIP / bundle) antes de checkout/reset/pull/merge/rebase/clean. Aplica IGUAL antes de descartar o aplicar un stash guardado (`drop`/`clear`/`pop`) y antes de forzar o recrear un puntero de rama (`branch -f`, `checkout -B`). Prohibido un checkout que descarte cambios de archivos trackeados o un reset duro con cambios sin guardar.

**R9 — El guard viaja con el repo.** Hook versionado en `.githooks/pre-push` + `core.hooksPath` o instalador dentro del repo. Ningun clon pushea master sin self-test verde + identidad configurada.

**R10 — Pusheado = jamas rebase.** Solo se rebasea lo 100% local sin pushear. Verificar `git log origin/<rama>..HEAD`.

**R11 — Tags y bundles SE PUSHEAN.** El reflog es local. `git push origin <tag>`. Nombres unicos (timestamp a segundo). Bundles y clones de integracion fuera de CUALQUIER carpeta con sincronizacion en la nube (Drive/Dropbox/OneDrive) — ese tipo de carpeta corrompe el `.git` a media operacion. No dar por buena la creacion solo porque el comando no mostro error: verificar explicitamente que el tag apunta a un commit real (`git rev-parse <tag>`) y que el bundle es integro y restaurable (`git bundle verify`).

**R12 — Enumerar ramas dinamicamente; nombres EXACTOS.** `git for-each-ref refs/remotes/origin`, nunca lista hardcodeada ni teclear nombres (typos/case crean ramas fantasma).

**R13 — Borrar rama = solo tras `git log master..origin/<rama>` VACIO + bundle.** `-D` borra aunque haya commits sin integrar.

**R14 — Prohibida la reescritura de historial** (filter-repo/BFG/rebase de master/amend pusheado) sin protocolo propio + orden explicita: tag+bundle de master Y de cada rama, re-clonado del equipo despues.

**R15 — No commitear bombas** (`*.db`/`*.sqlite`/backups/secretos): `.gitignore` + pre-commit. Fuerzan el rewrite que orfana ramas.

**R16 — Normalizar fin de linea.** `.gitattributes` con `* text=auto eol=lf`; Windows `core.autocrlf input`.

**R17 — Override = decision humana.** `GO_PUSH_OVERRIDE=1` / `GO_FORCE_OK=1` solo con orden explicita del responsable para ESE repo. El agente nunca los activa solo.

---

## Enforcement mecanico (git-guard v3)

Hook `pre-push` en cada repo. Bloquea: push a `master`/`main` salvo identidad autorizada
(`git config operador.maquina` coincide con `OPERADOR_MAQUINA` o un nombre de `INTEGRADOR_MASTER`
—lista separada por comas— del `OWNERS.md` mas cercano, o el owner del repo); force/non-ff/borrado
de branch. Auto-contenido: funciona en clones standalone. Para autorizar a un segundo integrador,
agregarlo a `INTEGRADOR_MASTER` en OWNERS.md y que configure su `operador.maquina`.

```bash
bash deploy/install-git-guard.sh        # o el instalador del framework
git config operador.maquina "Tu Nombre Completo"
```

**Self-test obligatorio antes de confiar en el hook** (R9): un hook instalado pero nunca probado puede dejar pasar todo (falso positivo de seguridad) o bloquear al dueno legitimo. Verificar AMBOS casos antes de asumir que protege:

```bash
# (a) debe PERMITIR push a master con la identidad autorizada configurada
git config operador.maquina "<Nombre exacto de OWNERS.md>" && git push origin master   # o --dry-run si existe

# (b) debe BLOQUEAR push a master simulando una identidad no autorizada
git config operador.maquina "Nombre Cualquiera" && git push origin master   # debe fallar
```
Solo si (a) pasa y (b) falla como se espera, el guard se considera operativo.

## Recuperacion si algo ya se orfano

```bash
git reflog show <rama> | head -40        # el tip viejo / "Reset to master"
git fsck --lost-found                     # huerfanos
git tag recuperacion/<rama>-<TS> <sha> && git push origin recuperacion/<rama>-<TS>
```
Si el accidente fue en otra maquina: el reflog vive AHI. Sin commit: backup/Time Machine de esa maquina.
Server-side: el API de eventos del remoto muestra los push (before/after) y deja el SHA viejo accesible un tiempo.
