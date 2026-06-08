# GIT_PROTOCOL — verificacion obligatoria antes de tocar git

> Regla nacida de un incidente real. Un agente trato TODOS los repos
> como si fueran del mismo dueno, commiteo con `git add -A`, pusheo a master de repos ajenos
> y mergeo a ciegas. Casi destruye semanas de trabajo de varios ingenieros.
> Esto NO se vuelve a repetir. El hook `pre-push` (git-guard) lo bloquea mecanicamente.

## REGLA 0 — Verificar antes de ejecutar. Siempre.

Antes de CUALQUIER commit / push / merge / pull:

1. `git status` y `git log --oneline -5`. Saber donde estas.
2. Leer `OWNERS.md` (raiz del portafolio). Saber DE QUIEN es el repo.
3. Si una operacion remota falla (rejected, diverged) => PARAR y reportar al usuario. NUNCA jalar+mergear a ciegas para "arreglarlo".

## REGLA 1 — El integrador integra master, cada owner/colab en SU rama

- El integrador esta a cargo: su maquina (la que declara `OPERADOR_MAQUINA == INTEGRADOR_MASTER` en OWNERS.md) pushea master/main en TODOS los repos. **Excepcion:** un repo cuyo owner controla su propio master, segun OWNERS.md.
- Cada owner (que no sea el integrador) y cada colaborador trabaja SIEMPRE en SU propia rama, nunca en master. Una rama por persona, nombrada por convencion (ver `OWNERS.md`). Cada rama parte del master mas reciente.
- El integrador mergea las ramas a master para alinear avances (los equipos trabajan cosas separadas). El agente NO pushea a master por su cuenta: solo cuando el integrador lo pide explicito.
- La tabla de owners/ramas en `OWNERS.md` es la referencia. Lo que autoriza el push a master es `OPERADOR_MAQUINA`/`INTEGRADOR_MASTER`.

## REGLA 2 — Nada de `git add -A` / `git add .`

Agregar siempre rutas explicitas (`git add archivo1 archivo2`). `git add -A` arrastra basura untracked (planes, temporales, .venv). Prohibido salvo que el usuario lo pida explicito y revises `git status` antes.

## REGLA 3 — Nunca pull-merge a ciegas

Si `git push` es rechazado: NO hagas `git pull` automatico.
Primero `git fetch` + `git log origin/<branch>` para ver QUE trae el remoto.
Reportar al usuario el estado divergente. El merge ciego crea commits-basura y mezcla trabajo ajeno.

## REGLA 4 — Force-push = decision humana

`git push --force` / `--force-with-lease` reescribe historia remota. Puede destruir trabajo de otros.
Prohibido sin confirmacion explicita del usuario para ESE repo.
Antes de cualquier reset destructivo: poner tag de seguridad `git tag safety-pre<operacion>-<hash> HEAD`.

## REGLA 5 — Verificar despues

Tras push: `git log --oneline -1` local y `origin/<rama>` deben coincidir.
Confirmar que NO se perdio trabajo de nadie.

## REGLA 6 — Sincronizacion de ramas (OBLIGATORIA)

Objetivo: toda rama en sincronia con su master, mitigando choques de cambios. Orden estricto:

1. **Ramas -> master, una por una.** Si una rama tiene commits unicos/mejoras, se integra a master. Si hay varias ramas con cambios, primero una y LUEGO la otra (secuencial, nunca en paralelo). Antes de cada merge: tag de seguridad y precheck de conflicto (`git merge-tree`). Conflicto => PARAR y reportar.
2. **Master -> ramas.** Despues de integrar, alinear cada rama del repo con master (`git push origin master:<rama>`, fast-forward). Asi todas parten del mismo punto.
3. **Master -> local.** Al final, alinear el local con master (`git pull --ff-only`). El local se actualiza de ULTIMO, ya con master consolidado.

Regla de oro del orden: ramas suben primero (una a una) -> luego master baja a las ramas -> luego master baja al local. Nunca al reves.

Higiene previa: rama de quien NO es owner ni colaborador del repo, sin commits unicos, se borra (con backup `git bundle`). Si tiene trabajo unico, no se borra: se integra o se marca al usuario.

## REGLA 7 — Protocolo de sincronizacion multi-rama sin perder mejoras

Cuando una o mas ramas estan adelantadas a master con mejoras reales, seguir este orden exacto.
Sin este orden se pierden commits o se mergea a ciegas y se destruye trabajo.

### Paso 1 — Diagnostico

```bash
git fetch --all
git log master..rama-A --oneline   # commits en rama-A que no estan en master
git log rama-A..master --oneline   # commits en master que no estan en rama-A
```

Si ambos tienen commits exclusivos => ramas DIVERGIDAS (no fast-forward). Requiere merge 3-way.
Si solo rama-A tiene commits => master es ancestro directo. Fast-forward posible.

### Paso 2 — Detectar archivos solapados entre ramas

Antes de mergear nada, identificar que archivos tocaron TODAS las ramas:

```bash
git diff --name-only master...rama-A
git diff --name-only master...rama-B
```

Archivos en ambas listas = conflicto potencial. Marcarlos.

### Paso 3 — Dry-run obligatorio (antes de tocar master)

Nunca mergear a master sin dry-run si hay archivos solapados.

```bash
git checkout -b test-merge-dry-run rama-A
git merge --no-commit --no-ff rama-B
```

Si hay conflictos: `git status` muestra "modificados por ambos".
Inspeccionar cada conflicto: `grep -n "<<<<<<" archivo_conflicto`

Decidir resolucion ANTES de ejecutar en master:
- Guardar version correcta: `git checkout HEAD -- archivo` (conserva rama-A)
- O aplicar theirs: `git checkout MERGE_HEAD -- archivo` (conserva rama-B)
- Criterio: conservar la version mas completa. La que tiene mas funcionalidad/logica.

Abortar test y limpiar:

```bash
git reset --hard HEAD
git checkout master
git branch -D test-merge-dry-run
```

### Paso 4 — Merge real en orden (una rama a la vez)

**Primero la rama mas adelantada** (mas commits unicos). Si cabe fast-forward, usarlo:

```bash
git merge --ff-only rama-A   # solo si master es ancestro directo
```

Si no cabe FF:

```bash
git merge --no-ff rama-A -m "merge: rama-A -> master (YYYY-MM-DD) — descripcion"
```

**Luego la segunda rama.** Si hay conflicto conocido del dry-run, resolverlo igual:

```bash
git merge --no-ff rama-B -m "merge: rama-B -> master (YYYY-MM-DD) — descripcion"
# conflicto esperado:
git checkout HEAD -- archivo_conflicto   # conservar version correcta
git add archivo_conflicto
git commit
```

### Paso 5 — Push master

```bash
git push origin master
```

Verificar: `git log --oneline -3` debe mostrar los merge commits recien creados.

### Paso 6 — Bajar master a todas las ramas (FF)

Despues de consolidar master, alinear cada rama. Siempre fast-forward:

```bash
git checkout rama-A && git merge --ff-only master && git push origin rama-A
git checkout rama-B && git merge --ff-only master && git push origin rama-B
git checkout master
```

Si FF falla en una rama => esa rama tiene commits nuevos que no se mergearon. PARAR y reportar.

### Regla de oro del orden

```
1. Diagnostico (fetch + log)
2. Detectar solapamiento (diff --name-only)
3. Dry-run en rama temporal (NO en master)
4. Resolver conflictos con criterio (mas completo gana)
5. Abortar dry-run, volver a master limpio
6. Merge ramas -> master (una a una, mas adelantada primero)
7. Push master
8. FF master -> cada rama
9. Push todas las ramas
```

**Nunca saltar el dry-run si hay archivos solapados. Una hora de dry-run evita dias de recuperacion.**

## Enforcement mecanico (git-guard)

El hook `pre-push` instalado en cada repo bloquea automaticamente:

- Push a master/main si la maquina NO es la del integrador (`OPERADOR_MAQUINA` en OWNERS.md no coincide con `INTEGRADOR_MASTER`, o no hay OWNERS.md). Override consciente: `GO_PUSH_OVERRIDE=1`.
- Force / non-fast-forward / borrado de branch (para todos, incluido el integrador). Override consciente: `GO_FORCE_OK=1`.

Instalar / reinstalar en todos los repos:

```bash
bash scripts/install-git-guard.sh
```

Los override (`GO_PUSH_OVERRIDE`, `GO_FORCE_OK`) existen para casos legitimos,
pero obligan un acto consciente. Un agente NO los activa salvo orden explicita del usuario.

## REGLA 7 — Protocolo de sincronizacion multi-rama sin perder mejoras

Cuando una o mas ramas estan adelantadas a master con mejoras reales, seguir este orden exacto.
Sin este orden se pierden commits o se mergea a ciegas y se destruye trabajo.

### Paso 1 — Diagnostico

```bash
git fetch --all
git log master..rama-A --oneline   # commits en rama-A que no estan en master
git log rama-A..master --oneline   # commits en master que no estan en rama-A
```

Si ambos tienen commits exclusivos => ramas DIVERGIDAS. Requiere merge 3-way.
Si solo rama-A tiene commits => master es ancestro directo. Fast-forward posible.

### Paso 2 — Detectar archivos solapados entre ramas

```bash
git diff --name-only master...rama-A
git diff --name-only master...rama-B
```

Archivos en ambas listas = conflicto potencial. Marcarlos.

### Paso 3 — Dry-run obligatorio (antes de tocar master)

```bash
git checkout -b test-merge-dry-run rama-A
git merge --no-commit --no-ff rama-B
```

Si hay conflictos: `git status` muestra "modificados por ambos".
Decidir resolucion ANTES de ejecutar en master. Criterio: version mas completa gana.

Abortar dry-run:

```bash
git reset --hard HEAD
git checkout master
git branch -D test-merge-dry-run
```

### Paso 4 — Merge real (una rama a la vez)

```bash
git merge --ff-only rama-A    # si cabe FF
git merge --no-ff rama-A -m "merge: rama-A -> master (YYYY-MM-DD)"   # si no
```

### Paso 5 — Push master

```bash
git push origin master
```

### Paso 6 — FF master a cada rama

```bash
git checkout rama-A && git merge --ff-only master && git push origin rama-A
git checkout master
```

### Regla de oro del orden

```
1. Diagnostico  2. Solapamiento  3. Dry-run en rama temporal
4. Resolver     5. Abortar dry-run  6. Merge ramas -> master (una a una)
7. Push master  8. FF master -> ramas  9. Push ramas
```

**Nunca saltar el dry-run si hay archivos solapados. Una hora de dry-run evita dias de recuperacion.**
