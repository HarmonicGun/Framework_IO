# AGENTS.md — Protocolo de Delegacion de Agentes

> Como usar el Agent tool, sub-agentes, y tareas atomicas. Gobernado por `CLAUDE.md`.
> Version: 0.3.0

---

## 1. Arbol de decision

Cuando usar Agent tool vs herramientas directas:

```
Tarea recibida
|
+-- > 3 archivos para leer? ................... SI → Agent Explore
+-- > 30min estimadas? ....................... SI → Agent Plan primero
+-- I/O bien definido (objetivo claro)? ...... SI → Agent (tipo segun tarea)
+-- Modifica archivos compartidos? ........... SI → Main agent (no delegar)
+-- Necesita decision del usuario? ........... SI → Main agent
+-- Tarea < 2min? ............................ SI → Directo (Bash/Read/Edit)
+-- Tarea trivial (1 archivo, 1 cambio)? ..... SI → Directo
+-- Duda? .................................... Agent Plan (que decida como)
```

Regla: "cuando dudes, delegar a Plan. cuando sepas, ejecutar directo."

---

## 2. Tipos de sub-agente

| Tipo | Modelo | Costo | Usar para |
|------|--------|-------|-----------|
| `Explore` | haiku | 1x | Buscar archivos, grep, investigar codebase, leer multi-archivo |
| `Plan` | sonnet | 3x | Disenar arquitectura, planificar fases, descomponer tareas |
| `code-reviewer` | opus | 15x | Auditoria de seguridad, revision critica (fase 6), bugs sutiles |
| `general-purpose` | sonnet | 3x | Build, refactor, implementacion multi-archivo |
| `claude` | sonnet | 3x | Tareas generales, asistencia estandar |

Reglas:
- Explore siempre con modelo barato. Su trabajo es leer, no crear.
- Plan siempre con modelo medio. Su trabajo es disenar, no ejecutar.
- code-reviewer siempre con modelo caro. Su trabajo es encontrar fallos.
- general-purpose con modelo medio. Su trabajo es construir.
- Elegir el tipo correcto > elegir el modelo correcto.

---

## 3. Atomicidad de tareas

Que hace una tarea atomica:

- 1 tarea = 1 accion verificable = 1 salida concreta
- Max 2-3 archivos de entrada
- Max ~500 lineas de salida
- Sin side effects fuera del scope
- Se puede verificar con una sola comprobacion

Cuando dividir:

- > 4 pasos → dividir en sub-tareas
- > 3 archivos de salida → dividir por archivo
- No sabes cuantos pasos → Agent Plan primero
- Tarea ambigua → Agent Plan para descomponer
- Side effects cruzados → separar en tareas aisladas

Verificacion de cierre:

- Cada tarea atomica cierra con evidencia
- Sin evidencia = no cerrada
- Sprint de N tareas = verificacion explicita al final

---

## 4. Paralelizacion

- Max 3-4 agentes simultaneos
- Solo tareas sin dependencia mutua
- Nunca paralelo sobre mismo archivo
- Convergencia en agente principal
- Misma herramienta + mismo archivo = error

Casos validos de paralelo:
- Leer 3 archivos distintos → 1 Explore (lee todos)
- Auditar 2 proyectos separados → 2 code-reviewer en background
- Investigar + planificar → 1 Explore + 1 Plan (Explore termina primero)

Casos invalidos:
- 2 agentes editando mismo archivo
- Agente construyendo + agente auditando mismo codigo
- > 4 agentes simultaneos (colapso de contexto)

---

## 5. Foreground vs Background

| Foreground | Background |
|------------|------------|
| Bloqueante (necesitas resultado ya) | No bloqueante (puedes seguir) |
| Necesita validacion inmediata | Resultado se revisa al llegar |
| Interactivo (pide confirmacion) | Autonomo (sin interrupciones) |
| Construccion, decision, revision | Research, scan, busqueda, exploracion |

Background = caso principal para aislamiento de contexto.
Usar `run_in_background: true`. Notifica al terminar.
No dormir, no esperar, no hacer polling. Seguir trabajando.

---

## 6. Protocolo de handoff

### Input contract — que pasar al sub-agente

```
Objetivo: [1 frase — que debe lograr]
Archivos: [rutas absolutas + proposito de cada uno]
Salida esperada: [formato, max lineas, estructura]
Modelo: [haiku/sonnet/opus — cual usar]
Reglas: [caveman, anti-complacencia, restricciones especificas]
```

### Output contract — que esperar del sub-agente

- Lista de archivos tocados (con ruta)
- Resumen: max 3 lineas
- Solo anomalias: no reportar "todo ok"
- Si no hay cambios: decir "sin cambios"
- Si fallo: decir "fallo: [razon]" (1 linea)

### Que NO pasar al sub-agente

- Contexto completo de la conversacion
- Reglas que ya estan en CLAUDE.md del proyecto
- Archivos que no necesita
- Historia de decisiones (a menos que sea relevante)
- "Por si acaso" — solo lo necesario

---

## 7. Model tiering

Tres tiers de modelo segun costo y capacidad:

| Tier | Modelo | Costo | Usar para |
|------|--------|-------|-----------|
| Barato | Haiku / Flash | 1x | Explore, research, file scanning, busquedas |
| Medio | Sonnet / Pro | 3x | Plan, general-purpose, build, claude, refactor |
| Caro | Opus / Ultra | 15x | code-reviewer, auditoria, arquitectura critica, fase 6 |

Reglas de seleccion:
- Barato primero. Si no alcanza, subir a medio.
- Caro solo si el rol lo justifica (auditoria, critica, seguridad).
- /ultrathink solo para fase 6 y auditorias de seguridad.
- Sub-agente explore SIEMPRE con modelo barato.
- Si dudas entre medio y caro → medio. Solo subir si el resultado fue insuficiente.

Costos relativos (referencia):
- 1K tokens barato ~= 1 unidad
- 1K tokens medio ~= 3 unidades
- 1K tokens caro ~= 15 unidades

---

## 8. Aislamiento de contexto

Cuando spawnear sub-agente SOLO para ahorrar contexto del main:

Disparadores:
- Leer > 3 archivos grandes (>200 lineas cada uno)
- Explorar estructura de directorios (find, ls recursivo)
- Investigar schema de base de datos
- Revisar > 5 commits o diff extenso
- Cualquier tarea que lea > 2000 lineas total
- Investigacion que requiere leer 5+ archivos

Beneficio:
- El main agent recibe resumen de 3 lineas
- No gasta tokens en archivos que solo necesitaba explorar
- El sub-agente (modelo barato) absorbe el costo de lectura

Cuando NO aislar:
- Leer 1-2 archivos conocidos → directo
- Tarea que requiere entender el contexto completo → main agent
- Editar archivos → siempre main agent

---

## 9. Anti-patrones

Prohibiciones explicitas:

1. **Tarea ambigua** — Sin objetivo claro, sin salida definida. Resultado: agente deambula.
2. **Necesita decision humana** — El agente no puede decidir por el usuario. Resultado: output inutil.
3. **> 4 agentes simultaneos** — Colapso de contexto. Resultado: outputs inconsistentes.
4. **Tarea < 2min** — Overhead de spawn > beneficio. Resultado: mas lento que directo.
5. **Ignorar output del sub-agente** — Desperdicio de tokens. Si no vas a usar el resultado, no spawnes.
6. **Sub-agentes en cascada** — Agente → Agente → Agente. Pierde contexto cada salto. Max 1 nivel.
7. **Pasar contexto completo del padre** — El sub-agente recibe solo lo necesario. Nada mas.
8. **Asumir reglas implicitas** — Pasar CLAUDE.md relevante o reglas explicitas. No asumir que "ya sabe".
9. **Kitchen sink session** — Multiples temas no relacionados en misma sesion. Contexto se llena de info irrelevante. Fix: `/clear` entre tareas no relacionadas.
10. **Corregir y corregir** — Mas de 2 correcciones al mismo issue. Contexto contaminado con enfoques fallidos. Fix: `/clear` y empezar con mejor prompt.

---

## 10. Archivos de sub-agente custom (`.claude/agents/`)

Definir sub-agentes especializados como archivos en `.claude/agents/` del proyecto:

```markdown
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Revision de seguridad de codigo
tools: Read, Grep, Glob, Bash
model: opus
---
Eres un ingeniero de seguridad senior. Revisa:
- SQL injection, XSS, command injection
- Secretos o credenciales en codigo
- Fallos de autenticacion y autorizacion
- Manejo inseguro de datos

Provee lineas especificas y fixes sugeridos.
```

Frontmatter:
- `name`: identificador unico
- `description`: cuando Claude debe delegar a este agente
- `tools`: herramientas permitidas (Read, Grep, Glob, Bash, Edit, Write)
- `model`: haiku (barato), sonnet (medio), opus (caro)

Reglas:
- Archivos en `.claude/agents/` disponibles para todo el proyecto.
- Archivos en `~/.claude/agents/` disponibles para todos los proyectos (user-level).
- Sin `paths` = siempre disponible. Con `paths` = solo con archivos matching.
- Auto memory de sub-agentes: activar con `autoMemoryEnabled: true` en frontmatter.

---

## 11. Writer/Reviewer multi-sesion

Patron para calidad: una sesion escribe, otra revisa.

```
Sesion A (Writer)                    Sesion B (Reviewer)
"Implementa rate limiter             "Revisa rate limiter en
 para API endpoints"                 @src/middleware/rateLimiter.ts
                                     Busca edge cases, race
                                     conditions, consistencia"

"Feedback: [output B].              (sesion independiente,
 Corrige estos issues."              contexto limpio)
```

Beneficios:
- Reviewer no esta sesgado por como se escribio el codigo.
- Contexto limpio = revision mas profunda.
- Mismo patron para tests: uno escribe tests, otro escribe codigo que los pasa.

---

## 12. Fan-out paralelo

Para migraciones o analisis masivos. Distribuir trabajo en N invocaciones paralelas:

```bash
# 1. Generar lista de archivos a migrar
claude -p "Lista todos los archivos Python que necesitan migracion" > files.txt

# 2. Loop paralelo
for file in $(cat files.txt); do
  claude -p "Migra $file de React a Vue. Responde OK o FAIL." \
    --allowedTools "Edit,Bash(git commit *)" &
done
wait
```

Flags clave:
- `--allowedTools`: restringe herramientas (seguridad en batch).
- `--output-format json`: salida parseable.
- `-p`: non-interactive mode.
- `&`: background para paralelismo real.

Precaucion: probar con 2-3 archivos primero. Refinar prompt. Luego escala completa.

---

## 13. Auto memory de sub-agentes

Sub-agentes pueden mantener su propia memoria entre sesiones:

```markdown
---
name: code-reviewer
description: Revision de codigo
tools: Read, Grep, Glob, Bash
model: opus
autoMemoryEnabled: true
---
```

- Auto memory del sub-agente es independiente del agente principal.
- Util para sub-agentes que aprenden patrones del proyecto.
- Misma estructura: `MEMORY.md` + topic files en `.claude/projects/.../memory/`.

---

## Referencias cruzadas

- `CLAUDE.md` — Gobierno del agente, secciones 0.3 (tareas atomicas) y 0.4 (contexto)
- `PLAYBOOK.md` — Metricas de agentes, seccion 12 + Gestion de sesiones
- `FRAMEWORK.md` — Principio 10 (delegar para aislar)
- Claude Code docs — `https://code.claude.com/docs/en/sub-agents`
