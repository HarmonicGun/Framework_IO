# Configuracion Claude Code para ingenieros

> **Para:** ingenieros del equipo que trabajan con agentes en repos compartidos
> **Motivo:** un agente sin reglas de git puede destruir trabajo de varios ingenieros. Esto lo previene.

---

## Paso 1 — El hook pre-push (OBLIGATORIO, 30 segundos)

Esto es lo UNICO que tienes que ejecutar. Bloquea mecanicamente que un agente haga push a master si no eres el integrador, y bloquea force-push para todos.

```bash
# Desde la raiz del portafolio:
bash scripts/install-git-guard.sh
```

Verifica que quedo instalado (sustituye por tus repos):
```bash
ls -la <tu_repo>/.git/hooks/pre-push
# Debe mostrar archivo con permisos -rwxr-xr-x
```

---

## Paso 2 — Tu CLAUDE.md de proyecto

Copia esto en el CLAUDE.md de TU proyecto (cada proyecto tiene el suyo en su raiz). Reemplaza los marcadores `[...]`.

```markdown
# CLAUDE.md — [NOMBRE DEL PROYECTO]

> Owner: [TU NOMBRE]
> Mi rama: [TU BRANCH]
> Rama principal: master (la integra el [LEAD/INTEGRADOR])

## Reglas GIT — leer antes de tocar NADA

Antes de cualquier git commit/push/merge:

1. `git status` + `git log --oneline -5`. Siempre.
2. Yo NO pusheo a master. Solo el integrador integra master.
3. Yo pusheo a mi rama: `[TU BRANCH]`.
4. NUNCA `git add -A` ni `git add .` — siempre rutas explicitas.
5. Si un push es rechazado -> PARAR. NUNCA hacer pull-merge a ciegas.
6. Si tengo duda de que hacer -> pregunto. No improviso.

## Que hacer cuando termino cambios

```bash
git add archivo1 archivo2   # rutas explicitas, NUNCA -A
git commit -m "lo que hice"
git push origin [TU BRANCH]  # a MI rama, no a master
```

Luego aviso al integrador para que integre a master.
```

---

## Paso 3 — Instrucciones para darle a Claude en CADA sesion

Al iniciar una sesion de trabajo, dile esto a Claude ANTES de cualquier otra cosa:

```
Reglas de git para esta sesion:

- Estamos en el proyecto [NOMBRE].
- El owner es [TU NOMBRE]. Mi rama es [TU BRANCH].
- master lo integra el [LEAD]. Yo NUNCA pusheo a master.
- NUNCA uses git add -A o git add .
- Siempre rutas explicitas en git add.
- Si un push falla, PARAS y me avisas. No intentas arreglarlo solo.
- Antes de cualquier git, muestrame git status y git log --oneline -5.
```

---

## Las 6 reglas que evitan el desastre

| # | Regla | Sin esto... |
|---|---|---|
| 1 | Verificar `git status` + `git log --oneline -5` antes de tocar | Commiteas en el repo equivocado |
| 2 | Cada quien a SU rama. master solo el integrador | Machacas trabajo de otros |
| 3 | `git add archivo1 archivo2` rutas explicitas. NUNCA `-A` | Metes basura al repo (.venv, temporales, planes) |
| 4 | Push rechazado = PARAR. No pull-merge a ciegas | Creas merge-commits basura y mezclas trabajo ajeno |
| 5 | Force-push solo con permiso explicito del integrador | Borras historia remota y trabajo de otros |
| 6 | Duda = preguntar. No improvisar | El agente "resuelve" solo y la riega |

---

## Por que existe esto

Un agente que trata todos los repos como propios, hace `git add -A`, pushea a master de repos ajenos y mergea a ciegas, puede destruir semanas de trabajo de varios ingenieros en minutos.

El hook pre-push lo bloquea mecanicamente. Las reglas en CLAUDE.md lo evitan por comportamiento. Con ambas capas, no pasa.

---

## FAQ rapido

**P: Que pasa si intento pushear a master?**
R: El hook te bloquea. Ves un mensaje de GIT-GUARD. Si DE VERDAD necesitas pushear a master, habla con el integrador.

**P: Que hago si mi push es rechazado?**
R: PARAR. Le dices a Claude que pare. Luego `git fetch` + `git log origin/tu-rama` para ver que paso. Si no entiendes, preguntas al integrador.

**P: Puedo hacer pull de master a mi rama?**
R: SI. `git pull origin master` es seguro y necesario para mantenerte actualizado.

**P: El hook me va a molestar en mi dia a dia?**
R: No. Solo bloquea 2 cosas: push a master (si no eres el integrador) y force-push (para todos). Tu flujo normal en tu rama no se ve afectado.
