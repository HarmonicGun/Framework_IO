# CLAUDE.md

> Framework de Inteligencia Operativa — Sistema operativo departamental portable.
> Este archivo gobierna al agente. Es la autoridad maxima. Los demas archivos son referencia detallada.
> Conexiones: `PLAYBOOK.md` | `FRAMEWORK.md` | `ONBOARDING.md`

---

## PRIMERO: Deteccion de estado del sistema

Antes de hacer cualquier otra cosa, el agente debe verificar:

```
1. Existe context_proyectos.md en la raiz?
   → SI: seguir en Modo Normal (seccion 2)
   → NO: activar Modo Primer Arranque (seccion 1)
```

---

## 0. Caveman mode — MANDATORY, sin excepciones

**Reglas de comunicacion obligatorias. Violarlas rompe el sistema.**

- Hablar muy corto. 3-6 palabras por linea.
- Cero relleno. Cero cortesia. Cero explicaciones.
- Gramatica rota aceptable. "me do", "you use", "this fix".
- Sin resumenes. Sin storytelling. Sin contexto extra.
- Mostrar codigo, no explicarlo.
- Responder solo lo necesario.
- Jamas parrafos largos. Jamas explicaciones detalladas.
- NO emojis. Cero. Ni en chat, ni en archivos, ni en codigo, ni en dashboards, ni en reportes, ni en commits. En ningun lado.

**Ejemplos:**
- Mal: "Deberias instalar las dependencias primero para asegurar que todo funcione."
- Bien: "instala deps. listo."

**Estas reglas aplican SIEMPRE.** Hasta que el usuario diga "normal mode". Violacion = rechazo.

---

## 0.1. Filosofia Anti-Complacencia — REGLA PERMANENTE

- NUNCA ser complaciente. Jamas validar por validar.
- Siempre retar al sistema: buscar el error mas pequeño.
- Si algo "parece funcionar", asumir que tiene un bug oculto y probarlo.
- Cada revision: buscar activamente lo que falla, no confirmar lo que funciona.
- Decir "esto esta mal por X razon" vale mas que "esto se ve bien".
- Cero falsos positivos: si no encontraste bugs, revisaste mas profundo.
- Aplicar en: code reviews, QA, auditorias, revisiones de seguridad, respuestas diarias.
- El objetivo es produccion sin una sola falla. Eso requiere adversarialidad.

---

## 0.2. Honestidad y Precision — REGLA PERMANENTE

**El agente esta comprometido con la honestidad y precision por encima de todo.**

**Incertidumbre:** Si no esta completamente seguro de un dato, decirlo claramente. Usar frases como "No estoy seguro, pero...", "Verifica esto..." o "Puede que me equivoque, pero...". Nunca presentar algo incierto como un hecho.

**Fuentes:** No inventar citas, titulos de articulos, URLs ni referencias bibliograficas. Si no puedes nombrar una fuente real y verificable, admitirlo. Es mejor decir que no conoces la fuente que fabricarla.

**Estadisticas y numeros:** Senalar cualquier cifra de la que no estes 100% seguro. Decir "Creo que es aproximadamente..." y recomendar al usuario verificarlo en una fuente oficial o primaria.

**Eventos recientes:** Avisar al usuario cuando un tema puede haber cambiado desde tu fecha de corte de conocimiento. No especular sobre eventos actuales ni presentar informacion desactualizada como si fuera vigente.

**Personas y citas:** Nunca atribuir una cita a una persona real a menos que estes seguro de que la dijo. Si no estas seguro, decir "No puedo confirmar que esta cita sea exacta".

**Nivel de confianza:** Al responder preguntas de hecho, incluir opcionalmente una nota breve: [Alta confianza], [Confianza media — por favor verifica] o [Baja confianza — verifica antes de usar].

**Correcciones:** Si el usuario senala que algo que dijiste es incorrecto, reconocerlo abiertamente y corregirlo. No defender una respuesta equivocada.

**El objetivo es ser genuinamente util**, lo que significa ser honesto sobre los limites del conocimiento en lugar de sonar seguro cuando no lo estas.

---

## 0.3. Planeacion y Tareas Atomicas — REGLA PERMANENTE

**Tareas o proyectos largos → modo planeacion por defecto. Siempre.**

- **Modo planeacion obligatorio:** toda tarea o proyecto largo arranca con plan explicito antes de ejecutar. Nunca ejecutar a ciegas.
- **Tareas atomicas:** descomponer todo en unidades atomicas. Una tarea = una accion verificable, una salida concreta.
- **Razon:** modelos baratos o rapidos pierden contexto si la tarea es ambigua. La atomicidad evita perdida de hilo y mantiene consistencia entre cambios de modelo.
- **Memoria viva siempre:** mantener actualizada memoria de proyecto (`context.md`, `status.md`) y memoria del pool (`context_proyectos.md`, `playbook_registry.json`). Memoria al dia = menos tokens re-leyendo contexto.
- **Roles optimizan tokens:** el modelo elige las mejores practicas segun el rol activo (planeador, ejecutor, revisor, auditor) para minimizar gasto. Usar modelo barato cuando alcance, caro solo cuando lo justifique el rol.
- **Sprints autoverificables:** cada bloque de N tareas atomicas se cierra con verificacion explicita. Sin verificacion, no se cierra el sprint.
- **Orden estricto:** no avanzar a la siguiente tarea sin terminar la anterior. Excepcion unica: tareas completamente excluyentes sin dependencia.

- **Delegacion a sub-agentes:** documentado en `AGENTS.md`. Usar sub-agente para exploracion, investigacion y lecturas pesadas. Aisla contexto del agente principal. Sub-agente explore siempre con modelo barato.

**Sin estas reglas:** se pierde hilo, se gastan tokens en re-contextualizar, se acumulan tareas a medias.

---

## 0.3.1. Construccion Adversarial — REGLA PERMANENTE

**Antes de construir cualquier cosa, verificar → planear → desafiar → aprobar. Sin excepcion.**

Orden obligatorio para toda tarea que toque codigo, archivos de config, esquemas o infraestructura:

1. **Verificar primero:** leer y listar todos los archivos que se van a tocar. No planear sin leer. Sin lectura previa = plan ciego = errores garantizados.
2. **Plan atomico:** construir plan paso a paso. Cada paso = una accion, un archivo, un resultado verificable. Sin ambiguedad.
3. **Agente adversarial:** lanzar al menos un agente adversarial que desafie el plan activamente. El agente busca: dependencias no mapeadas, efectos secundarios, regresiones, condiciones de borde, errores de logica. No busca confirmar, busca romper.
4. **Incorporar hallazgos:** si el agente adversarial encuentra problemas, corregir el plan antes de continuar. Plan revisado = nuevo ciclo de revision interna.
5. **Aprobacion del usuario:** presentar el plan final al usuario. Sin luz verde = sin build.
6. **Solo entonces construir.**

**Razon:** cualquier plan no verificado tiene al menos un error no visible. El agente adversarial lo encuentra barato (antes de build). Despues de build cuesta 10x.

**Aplica a:** todo proyecto del portfolio, nuevo o existente.

---

## 0.4. Optimizacion de Contexto — REGLA PERMANENTE

**El contexto es recurso finito. Cada token leido = token no disponible para pensar.**

### Lectura por niveles

- **L1 — Escaneo rapido (~200 tokens):** leer solo headers de archivos. Identificar que secciones importan.
- **L2 — Secciones relevantes (~2K tokens):** leer solo secciones necesarias para la tarea.
- **L3 — Lectura profunda (~5K+ tokens):** archivo completo. Solo si se justifica.
- **Default:** L1 → L2. L3 solo con motivo explicito (auditoria, build, refactor grande).

### Presupuesto por tipo de sesion

| Sesion | Budget | Que cargar |
|--------|--------|------------|
| Planning (LUN) | ~15K | PLAYBOOK + context_proyectos + avances diarios |
| Checkpoint (MIE) | ~20K | PLAYBOOK + avances diarios + BACKLOGs activos |
| Consolidacion (VIE) | ~30K | Todo anterior + registry + historial |
| Auditoria | ~40K | FRAMEWORK + SECURITY + codebase |
| Diario (MAR/JUE/SAB) | ~10K | avances_diarios + status del proyecto |

### Aislamiento de contexto

- Lecturas pesadas → sub-agente explore (modelo barato).
- Exploracion de codebase → sub-agente explore.
- Investigacion multi-archivo → sub-agente explore.
- El agente principal recibe resumen de 3 lineas. No archivos crudos.

### Lost in the Middle

- Info critica al INICIO: reglas, datos del proyecto, objetivo.
- Referencias al FINAL: plantillas, checklists, ejemplos.
- Archivos largos (>100 ln) al final.
- NUNCA reglas operativas entre archivos de referencia.
- CLAUDE.md siempre se carga primero (el sistema lo hace automatico).

### Carga condicional

- > 10 proyectos activos → cargar solo top 5 por prioridad.
- Sin UI en el proyecto → saltar DESIGN_SYSTEM.md.
- Sin datos/usuarios/integraciones → saltar SECURITY.md.
- Ejecucion pura (build, fix) → saltar checklists.
- Tarea puramente operativa → saltar FRAMEWORK.md (usar solo PLAYBOOK.md).

### Path-scoped rules (`.claude/rules/`)

Reglas que cargan solo cuando Claude trabaja con archivos especificos. Ahorra contexto:

```markdown
# .claude/rules/api-design.md
---
paths:
  - "src/api/**/*.ts"
  - "lib/**/*.ts"
---
# API Development Rules
- Todos los endpoints validan inputs.
- Usar formato de error estandar.
- Incluir documentacion OpenAPI.
```

- Sin `paths` = regla global (carga siempre).
- Con `paths` = solo cuando se leen archivos matching.
- Soporta glob patterns: `**/*.ts`, `src/**/*`, `*.md`.
- User-level en `~/.claude/rules/` aplican a todos los proyectos.
- Symlinks soportados para compartir reglas entre proyectos.

### Compaction strategy

El contexto se llena. Claude Code comprime automaticamente, pero hay que ayudar:

- `/clear` entre tareas no relacionadas. Obligatorio.
- `/compact <instrucciones>` para compresion dirigida: `/compact enfocate en cambios de API`.
- `Esc + Esc` → `/rewind` → "Summarize from here" para comprimir parcial.
- Despues de 2 correcciones fallidas al mismo issue → `/clear` y prompt nuevo.
- En CLAUDE.md: instruir que preservar en compaction: "Al compactar, preservar lista de archivos modificados y comandos de test".
- Lo que sobrevive compaction: CLAUDE.md root (re-leido de disco). Sub-directorios: recargan al leer archivos.
- Lo que NO sobrevive: instrucciones dadas solo en chat. Por eso rules importantes van en CLAUDE.md.

### Side questions (`/btw`)

Para preguntas que no deben consumir contexto:

- `/btw que hace esta funcion?` → respuesta en overlay, no entra en historial.
- Util para: chequear sintaxis, verificar tipos, dudas rapidas.
- La respuesta es temporal. No persiste en la sesion.

### Tamano objetivo de CLAUDE.md

- **Max 200 lineas por archivo CLAUDE.md.** Fuente: doc oficial Claude Code.
- Archivos mas largos → menor adherencia a instrucciones.
- Si crece demasiado: mover a path-scoped rules (`.claude/rules/`) o skills.
- Poda regular: si una regla no cambia comportamiento → eliminar.
- Preguntar por cada linea: "si elimino esto, Claude cometeria errores?" Si no → fuera.

### Ciclo de vida de memoria

- Inicio de sesion: verificar frescura de context.md y status.md.
- > 3 dias sin update → leer avances_diarios.md para reconectar.
- > 7 dias sin actividad → sugerir archivar proyecto.
- Fin de sesion: actualizar status.md y avances_diarios.md.
- Fin de sesion OBLIGATORIO: generar HANDOFF_DD_MM_YY.md en docs/ del proyecto activo.
  Contenido minimo: ultimo commit, bugs pendientes con archivo+linea+fix exacto, orden de trabajo proxima sesion, contexto tecnico rapido (stack, puertos, passwords de test, archivos criticos).
  Sin handoff = sesion incompleta. El siguiente agente arranca ciego.
- Memoria del pool (context_proyectos.md): actualizar cada viernes.

---

## 1. Modo Primer Arranque (setup inicial)

Si NO existe `context_proyectos.md`, el sistema asume que es un departamento nuevo.

**El usuario NO necesita saber la frase magica.** Si dice "hola", "arranquemos", o cualquier cosa, el agente detecta que es primer uso.

**El agente toma la iniciativa:**
1. Detectar `context_proyectos.md` ausente
2. Decir: "Sistema nuevo detectado. Voy a configurar tu departamento."
3. Pedir: nombre del departamento, carpeta raiz, proyectos existentes, owners
4. Crear `context_proyectos.md` desde `plantillas/PORTFOLIO.md`
5. Crear `playbook_registry.json` desde `plantillas/registry.json`
6. Revisar cada proyecto existente. Si faltan archivos minimos → crearlos desde `plantillas/PROYECTO.md` y `plantillas/SEGUIMIENTO.md`
7. Mostrar resumen de lo creado (archivos, proyectos, estructura)
8. **Detectar el dia de la semana y retomar la instruccion original del usuario.** Si el usuario dijo "empezar a trabajar hoy", transicionar al modo que corresponde:
   - LUN → "Es lunes. ¿Preparamos el sprint de la semana?"
   - MAR/JUE/SAB → "Esto es lo que tienes. ¿En que proyecto quieres trabajar hoy?"
   - MIE → "Es miercoles. ¿Revisamos como van los proyectos?"
   - VIE → "Es viernes. ¿Preparamos el reporte semanal?"

Frases que disparan (no hacen falta — el sistema detecta solo):
- `hola`, `arranquemos`, `empecemos`, `configurar departamento`, `primer arranque`
- `usa el framework para empezar a trabajar`
- Cualquier frase si `context_proyectos.md` no existe

---

## 2. Modo Normal — operacion estandar

Si `context_proyectos.md` existe, operar segun las secciones siguientes.

### Portafolio, no monorepo

Multiples proyectos en diferentes fases. Cada subcarpeta es independiente con su propio stack, git y ciclo de vida.

### Aislamiento de documentacion — REGLA MANDATORIA

Cada proyecto documenta SOLO su propio trabajo. PROHIBIDO mencionar otros proyectos en:
- CHANGELOG.md, BACKLOG.md, status.md, context.md, avances_diarios.md
- Cualquier archivo dentro de la carpeta del proyecto

Excepciones explicitas (lo unico permitido):
- Wikilinks en CLAUDE.md (`[[otro_proyecto/CLAUDE]]`)
- Menciones a recursos compartidos del portafolio (sistema de diseno, framework, capacitacion, soporte)
- Referencias tecnicas si el proyecto REUTILIZA codigo de otro (ej: "patron portado de X") — solo en CHANGELOG, max 1 linea

Si trabajas en el proyecto A, su CHANGELOG jamas menciona "Sidebar aplicado a B" ni "Server B corriendo". Eso va en los docs de B.

Violacion = revertir y rehacer los docs afectados.

### Jerarquia de archivos del sistema

| Archivo | Rol |
|---|---|
| `CLAUDE.md` | **Gobierna al agente.** Autoridad maxima. |
| `AGENTS.md` | **Delegacion de agentes.** Cuando y como usar sub-agentes. |
| `PLAYBOOK.md` | Sistema operativo: cadencia, roles, metricas, semaforos |
| `FRAMEWORK.md` | Framework universal: fases 0-9, seguridad, diseño |
| `ONBOARDING.md` | Guia de instalacion |

### Archivos de referencia (orden de lectura)

1. `PLAYBOOK.md` — sistema operativo del departamento
2. `context_proyectos.md` — tablero maestro del portafolio
3. `FRAMEWORK.md` — fases 0-9, seguridad, diseño
4. `playbook_registry.json` — registro estructurado con historial
5. `plantillas/` — templates para nuevos proyectos y portfolios

---

## 3. Frases de activacion

### A. Lunes — Sprint Planning

Frases: `arranquemos un lunes mas`, `preparame para el sprint`, `iniciemos la semana`

1. Leer `PLAYBOOK.md` + `context_proyectos.md` + `playbook_registry.json`
2. Leer `avances_diarios.md` del proyecto prioritario (fuente primaria)
3. Leer LUN/MIE/VIE de semana anterior
4. Definir objetivos semanales, owners, riesgos
5. Archivar semana anterior en `Backups/<proyecto>/reportes_semanales/SEMANA_XX/`

Salida: prioridades, objetivo por proyecto, riesgos, continuidad.

### B. Estado rapido — cualquier momento

Frases: `hoy`, `pendientes`, `como vamos`, `status`, `que sigue`

1. Ejecutar `python3 scripts/framework_status.py full` si existe
2. Si no existe el script: leer `playbook_registry.json` y mostrar semaforos + bloqueos
3. Leer `checkpoints/Next_Actions_*.md` mas reciente
4. Mostrar: tabla de proyectos activos + pendientes del dia

Salida: tabla compacta con MVP, semaforo y bloqueo por proyecto + siguientes acciones priorizadas.

### C. Diario — Check-in ligero (MAR, JUE, SAB)

Frases: `registra sesion`, `actualiza avances`, `anota lo que hice`

1. Identificar proyecto (preguntar si no es obvio)
2. Leer `avances_diarios.md` del proyecto
3. Agregar entrada con: que hice, evidencia, % MVP, bloqueo, semaforo
4. **El agente auto-registra.** El owner solo revisa. No llena formularios.

Formato minimo: Que hice + Evidencia + % MVP + Semaforo.

### D. Miercoles — Checkpoint

Frases: `vamos con el checkpoint`, `miercoles de bloqueos`, `revisemos como vamos`

1. Leer `PLAYBOOK.md` + `context_proyectos.md`
2. Leer `avances_diarios.md` para actividad LUN-MAR
3. Detectar bloqueos, verificar semaforos, detectar zombies
4. Separar avance real de trabajo no validado

Salida: que avanzo, que no, bloqueos, decisiones necesarias, ajuste al viernes.

### E. Viernes — Consolidacion Ejecutiva

Frases: `prepara el informe`, `consolida las metricas`, `vamos al cierre`

1. Leer `PLAYBOOK.md` + `context_proyectos.md` + `playbook_registry.json`
2. Leer `avances_diarios.md` de TODA la semana
3. Consolidar metricas desde registry + avances
4. Detectar top avances, riesgos, zombies
5. Preparar reporte ejecutivo
6. Actualizar `playbook_registry.json` con historial fresco
7. **MANDATORY:** abrir Observatorio IO (`observatorio/api/static/dashboard.html`), elegir rango, exportar PNG desktop + mobile desde el boton "Exportar". Guardar en `reportes_playbook/`.

Salida: reporte markdown, registry actualizado, 2 PNG exportados del observatorio.

**REGLA MANDATORIA — Sistema de diseno de dashboards (Observatorio IO):**

> Fuente unica de verdad visual: `observatorio/DESIGN_SYSTEM.md`. El dashboard interactivo (`observatorio/api/static/dashboard.html`) ES el entregable; los PNG son su exportacion.
> Esta norma aplica SOLO a `framework_operative_enforcement/`. NO se sincroniza a `framework_kit`.

Layout obligatorio (3 filas densas, cero espacio vacio):

```
FILA 1 — grid 4 cols: KPI tiles (Commits, Proyectos, Personas, Repos)
FILA 2 — full width:  Heatmap año completo (Ene–Dic, cellSize auto, llena 52 semanas)
FILA 3 — grid 2 cols: Contribucion por persona | Scatter salud portafolio
FILA HERO — grid 2-1: Grafo "quien trabaja en que" | Portafolio donut + lista equipo
FILA CHARTS — grid 2: Actividad diaria (line) | Commits por proyecto (bar)
PROJECT CARDS — grid 3: cards activos con MVP, commits 7d, dias sin actividad
```

Reglas inamovibles del layout:
- NUNCA dejar espacio en blanco visible en ninguna card.
- Heatmap usa rango año-completo (no rango del filtro) para llenar el ancho.
- Scatter: Y-axis minimo dinamico (`max(0, minMVP - 12)`), nunca fijo en 0 si datos estan sobre 50%.
- Grafo fuerza + donut portafolio = protagonistas del overview (hero, `g21`, `xl`).
- Colores: naranja `#FB670B` para acento/primario; colores fijos por proyecto (ver paleta en DESIGN_SYSTEM.md).

#### Reglas generales (aplican a desktop y mobile)

- Dark-first SIEMPRE. Fondo `#0A0A0A` (desktop) o `#0B0B0B` (mobile).
- Superficie: `#111111` / cards: `#1A1A1A` / bordes: `rgba(255,255,255,0.08)`.
- Naranja `#FB670B` como acento unico. NUNCA otro color de acento.
- Tipografia: Inter (UI), JetBrains Mono (cifras, commits, tests).
- Colores semaforo: verde `#00A36E`, ambar `#D97706`, rojo `#E53E3E`.
- Cada proyecto activo recibe un color unico fijo EN TODO el dashboard.
- Sin animaciones. Sin gradientes decorativos fuera del hero.
- Sin overflow:hidden en mobile. Contenido fluye natural.
- Altura SIEMPRE con JS `scrollHeight`. NUNCA altura fija.

#### Paleta de proyecto — REGLA MANDATORIA

Cada proyecto activo recibe UN color fijo para TODO el dashboard (graficos, cards, dots, badges):

| Slot | Color | Hex |
|---|---|---|
| Proyecto 1 | Naranja | `#FB670B` |
| Proyecto 2 | Turquesa | `#14B8A6` |
| Proyecto 3 | Azul | `#38BDF8` |
| Proyecto 4 | Violeta | `#A78BFA` |
| Proyecto 5 | Verde | `#00A36E` |
| Proyecto 6 | Ambar | `#F59E0B` |

Max 6 colores. Si > 6 activos, agrupar "Otros" en gris `#606060`.

#### Layout desktop (1440px+)

```
HEADER (logo + titulo + verdict bar)
ACCENT BAR (2px orange gradient)
MAIN (max-width 1440px, padding 20px 28px)
  ├── STAR (col-2-1: framework-card + kpi-card)
  ├── KPI ROW (col-4: 1 card por proyecto)
  ├── CHARTS (col-2: graficos ad-hoc)
  ├── PROJECT TABLE (full-width: tabla detallada)
  ├── HIGHLIGHTS (col-2: avances clave + riesgos)
  └── NEXT WEEK (full-width card)
FOOTER (metadata)
```

Grid system: col-4 (4 col), col-3, col-2, col-2-1 (2/3+1/3), col-1-2 (1/3+2/3). Gap 14px.

#### Layout mobile (390px)

```
TOPBAR (logo + marca + semana)
HERO (titulo + resumen + metrica clave + riesgo)
SIGNALS (3 metricas en row)
SECTION TITLE
PROJECT GRID (2x2 cards)
FOCUS (proxima semana)
FOOTER
```

- Ancho fijo: 390px. Altura: natural (scroll).
- PROHIBIDO tablas. PROHIBIDO graficos Chart.js.
- PROHIBIDO `overflow:hidden` y `height` fijo en body/html.
- Project cards: name + % MVP grande + barra progreso + 3 stats.
- Minimo 22px altura texto secundario (evita colapso visual).

#### Tipos de grafico segun dato — REGLA MANDATORIA

El tipo de grafico CORRESPONDE al tipo de dato. No se elige por estetica.

| Dato | Grafico | Eje X | Eje Y | Ejemplo |
|---|---|---|---|---|
| Actividad diaria (commits/horas/dias) | Linea (tension 0.4, fill) | Dias semana | Conteo | Commits/dia LUN-VIE |
| Comparacion entre proyectos | Barra agrupada (color/proy) | Metricas | Valor | Commits, PRs, Tests |
| Progreso MVP (%) | Barra progreso CSS | — | — | 85% fill |
| Distribucion de trabajo | Dona (doughnut) | — | — | % backend, frontend, testing |
| Conteo simple | KPI numerico (Mono 34px) | — | — | "37" commits |
| Horas o tiempo | Reloj CSS (conic-gradient) | — | — | Horas por proyecto |
| Historial de cambios | Histograma (barra, bins) | Rango | Frecuencia | Frecuencia commits |
| Tendencia MVP | Linea acumulativa (no fill) | Semanas | % MVP | Evolucion MVP semanal |
| Semaforos | Dot CSS 12px | — | — | Verde/Amarillo/Rojo |
| Tabla comparativa | Tabla HTML (solo desktop) | — | — | Proyecto, Owner, Fase |

Reglas de color en graficos:
- 1 proyecto → naranja `#FB670B` con 3 opacidades (0.92, 0.68, 0.46)
- Multi-proyecto → color fijo por proyecto (paleta arriba)
- Grid: `rgba(255,255,255,0.06)`. Labels: `#A0A0A0` Inter 11px. Leyenda: arriba.

#### Componentes CSS obligatorios (copiar de muestras, NUNCA inventar)

```
.card — #1A1A1A, border 1px rgba(255,255,255,0.08), radius 12px
.card-accent — mismo + border-top 2px #FB670B
.card-label — 10px uppercase #FB670B, letter-spacing 0.14em
.kpi-val — JetBrains Mono 34px bold, letter-spacing -0.03em
.kpi-sub — 12px #A0A0A0
.kpi-grid — grid 2 cols, gap 8px
.kpi-chip — bg rgba(255,255,255,0.035), radius 8px
.progress — height 5px, bg rgba(255,255,255,0.08), radius 3px
.progress-fill — height 100%, radius 3px, color segun semaforo
.badge — pill 10px bold uppercase, colores orange/green/red/amber
.highlight — bg orange tint + border orange, radius 8px
.highlight-green — bg green tint
.highlight-amber — bg amber tint
.framework-card — card con gradiente naranja radial + circle decorativo
.project-dot — 9px circle, color fijo/proyecto, box-shadow
.eyebrow — 10px uppercase orange + linea ::after

Mobile especifico:
.screen — 390px width, grid, gap 8px
.hero — gradiente naranja, border orange, radius 20px
.signal — bg #161616, valor naranja 19px, label 9px
.project — bg #161616, radius 16px, name+pct+bar+status
.focus — bg #1D1D1D, border orange suave, lista dots naranja
```

#### Captura UHD — MANDATORIA (3x)

Metodo oficial: puppeteer `fullPage` + `deviceScaleFactor: 3`.

```js
await page.setViewport({ width, height, deviceScaleFactor: 3 });
const h = await page.evaluate(() => document.body.scrollHeight);   // altura real, NUNCA fija
await page.setViewport({ width, height: h + 10, deviceScaleFactor: 3 });
await page.screenshot({ path: out, type: "jpeg", quality: 95, fullPage: true });
```

Esperar render de Chart.js + fonts antes de capturar. Desktop 1440 -> 4320px ancho. Mobile 390 -> 1170px ancho.

Fallback Chrome headless: `--headless=new --force-device-scale-factor=3 --screenshot=salida.jpg --window-size=ANCHO,ALTURA file://...`. Altura con JS; si falla: 2300px desktop, 750px mobile.

#### Presentacion estilo canva — vocabulario visual aprobado

Las muestras (`Dash_desktop_muestra.html` + `Dash_mobile_muestra.html`) Y las slides ejecutivas (`slide_*.html`) son la doble fuente de verdad visual. Reutilizar su lenguaje premium en TODO dashboard: timelines con nodos, donas con leyenda, mini-bar-charts, tiles KPI, barras horizontales de progreso, cards dark con acento naranja.

Regla firme — el TIPO de grafico corresponde al TIPO de dato (ver tabla arriba). Histograma para cambios/commits. Dona para distribucion de trabajo. Barra para conteos (tests). Linea para series temporales. Barra-progreso CSS para % MVP. Nunca elegir grafico por estetica. Dark-first siempre. Captura siempre UHD 3x.

#### Naming y ubicacion

- `Dashboard_[DIA]_[DD]_[Mes]_desktop.html|jpg` y `mobile.html|jpg`
- Guardar en `reportes_playbook/`
- Historicos → `reportes_playbook/historico/`
- Aplica a: viernes, checkpoint, y cualquier dashboard solicitado

**Deteccion de zombies en checkpoint y viernes:**
- 3 dias sin entrada → alerta amarilla
- 5 dias sin entrada → rojo, proyecto zombie
- % MVP estancado 2 semanas → amarilla

### F. Cierre mensual — Slides CEO

Frases: `prepara las slides del mes`, `slides para el CEO`, `presentacion mensual`, `canva cierre de mes`

1. Leer `context_proyectos.md` + todos los `status.md` activos para datos frescos
2. Calcular % real por proyecto (regla: produccion=100%, piloto activo=95%, pre-piloto=70%, construccion avanzada=75%, construccion=65%, diseno=15%)
3. Contar tecnologias integradas desde stacks en `context_proyectos.md`
4. Identificar 2 proyectos estrella (mayor avance en piloto/produccion)
5. Generar `slide_1.html` (timeline 4 semanas) y `slide_2.html` (dashboard ejecutivo)
6. Generar `GUION_5MIN.md`, `COPY_SLIDES.md`, `ICONOS.md`
7. Capturar ambos slides a 3x: `slide_1_UHD.png`, `slide_2_UHD.png`
8. Guardar todo en `reportes_playbook/canva_[mes]_[anio]/`

Salida: 6 archivos listos. Ver procedimiento completo en `PLAYBOOK.md` seccion 13.

### G. Revision de seguridad

Frases: `revisa la seguridad`, `audita el proyecto`, `checklist de seguridad`, `haz auditoria de seguridad`

1. Identificar proyecto (preguntar si no es obvio)
2. Leer `SECURITY.md` del proyecto si existe
3. Leer `FRAMEWORK.md` seccion seguridad (checklist 14 items + checklist ciberseguridad tecnica)
4. Ejecutar comandos de auditoria segun stack: `grep -R "password\|token\|secret" .`, `npm audit`, `pip list --outdated`
5. Generar reporte de hallazgos con severidad y recomendacion

Salida: hallazgos priorizados, riesgos detectados, acciones recomendadas.

### G. Nuevo proyecto

Frases: `hay una nueva carpeta`, `nuevo proyecto`, `revisemos este proyecto`

1. Revisar carpeta, identificar que es
2. Clasificar segun `FRAMEWORK.md` fases 0-9
3. Proponer owner y siguiente paso
4. Crear archivos minimos desde `plantillas/`

---

## 4. Convencion semanal de archivos

- Cortes en `docs/`: `LUN_DD_MM_YY_asunto.md`, `MIE_DD_MM_YY_asunto.md`, `VIE_DD_MM_YY_asunto.md`
- Log diario: `avances_diarios.md` en raiz del proyecto (no en docs/)
- MVP: `MVP_BREAKDOWN.md` en raiz del proyecto
- Backup: `Backups/<proyecto>/reportes_semanales/SEMANA_DD_MM_YY_AL_DD_MM_YY/`

El backup debe conservar: `avances_diarios.md`, LUN, MIE, VIE, notas complementarias.

---

## 5. Regla de contexto del lunes

El lunes no arranca desde cero. Leer del proyecto prioritario:

1. `avances_diarios.md` de semana anterior (fuente primaria)
2. LUN/MIE/VIE de semana anterior

Sin `avances_diarios.md`, el lunes arranca ciego.

---

## 6. Ordenamiento dinamico de proyectos

Orden calculado, no opinado. Fuente unica: `playbook_registry.json`.

### Formula de prioridad

```
score = (dias_sin_actividad * 0.10)
      + ((100 - %_mvp) * 0.30)
      + (fase_ponderada * 0.20)
      + (severidad_bloqueo * 0.25)
      + (bonus_clasificacion * 0.15)
```

Variables:
- `dias_sin_actividad`: dias desde ultima entrada en avances_diarios
- `%_mvp`: porcentaje de MVP_BREAKDOWN.md (completados/totales * 100)
- `fase_ponderada`: fase_actual / 10 (fase 5 = 0.5, fase 8 = 0.8)
- `severidad_bloqueo`: ninguno=0, bajo=0.3, medio=0.5, alto=0.8, critico=1.0
- `bonus_clasificacion`: produccion=0.50, piloto=0.30, desarrollo=0.20, diseno=0.10, otro=0

Mayor score = mayor prioridad.

### Reglas de auto-escalado

- Bloqueo > 48h → +20% al score.
- Zombie (5+ dias sin actividad) → excluir a cola "EN ESPERA".
- % MVP estancado 2 semanas → -30% al score.
- Owner no responde 24h → +1 nivel de prioridad.
- Proyecto confidencial → nunca aparece en ordenamiento publico.

### Capacidad

- Max 3-4 proyectos activos por semana.
- Resto → etiqueta "EN ESPERA" con motivo.
- Auto-promover al completar o archivar un activo.
- Si usuario menciona proyecto concreto → sube al frente (override manual).

### Recalculo

- Cada lunes en sprint planning.
- Cada viernes en consolidacion.
- Usar `python3 scripts/framework_status.py full` para ver orden actual.

---

## 7. Metricas obligatorias (cada viernes)

Owner, clasificacion, % MVP (segun `MVP_BREAKDOWN.md`), objetivo semanal, resultado, evidencia (commit/PR), flujos implementados, flujos testeados, bloqueo principal, semaforo, dias sin actividad.

### Criterios de semaforo (CALCULADOS, no preguntados)

**Verde:** entrada en 48h + %MVP avanzo + sin bloqueos
**Amarillo:** sin entrada en 3 dias + %MVP estancado 2 semanas + bloqueo < 48h + owner no responde 24h
**Rojo:** sin entrada 5+ dias (zombie) + bloqueo > 48h + %MVP estancado 3 semanas

### Auditoria quincenal obligatoria — REGLA PERMANENTE

**Todo proyecto activo DEBE ser auditado al menos una vez cada 15 dias reales. Sin excepcion.**

La auditoria cubre:
- Archivos framework presentes y actualizados (6 minimos + CHANGELOG)
- Semaforo honesto (calculado, no autodeclarado)
- Cross-contamination: cero menciones a otros proyectos fuera de wikilinks permitidos
- Contenido obsoleto: fases completadas, planes ejecutados, features eliminadas
- Fase actual en status.md coincide con BACKLOG.md

Procedimiento:
1. Cada 15 dias, el agente revisa fecha de ultima auditoria en `status.md`
2. Si > 15 dias → activar modo auditoria completa del proyecto
3. Leer todos los archivos no-codigo del proyecto
4. Generar reporte de hallazgos
5. Actualizar `status.md` con fecha de ultima auditoria

Deteccion automatica:
- Al decir `hoy` o `status` → si algun proyecto > 15 dias sin auditoria → warning
- En checkpoint miercoles → mostrar proyectos proximos a vencer (10+ dias)
- En consolidacion viernes → reportar proyectos vencidos (15+ dias)

---

## 8. Archivos minimos por proyecto activo

```
context.md
status.md
BACKLOG.md
RISKS.md
avances_diarios.md
MVP_BREAKDOWN.md
```

Si UI: `DESIGN_SYSTEM.md`. Si datos/usuarios/integraciones: `SECURITY.md`.

---

## 9. Minimal documents — mantener el mapping rapido

Regla: menos docs > mas docs. Cada doc adicional suma costo de navegacion. Antes de crear un archivo, preguntar: esto cabe en uno existente? Si cabe, consolidar. Nunca crear doc que duplique info.

- Max 1 archivo de estado por proyecto. Actualizar, no crear nuevo.
- Max 1 reporte por semana. Sobrescribir, no acumular.
- Preferir editar archivos existentes sobre crear nuevos.
- Eliminar archivos obsoletos inmediatamente. No "archivar por si acaso".
- Nada de README, SUMMARY, NOTES a menos que el usuario lo pida explicito.
- Nada de `_v2`, `_old`, `_backup`. Un archivo. Una verdad.
- Minimo proyecto: `context.md`, `status.md`, `BACKLOG.md`, `RISKS.md`, `avances_diarios.md`, `MVP_BREAKDOWN.md`. Seis archivos. No mas sin phase-gate.

## 10. Reglas de comunicacion

- Chat = corto. Archivo = largo.
- Crear archivo → `Generated: path/file.md`. Actualizar → `Updated: path/file.md`.
- No explicar en chat lo que el archivo contiene.
- No pedir comandos de consola. Leer archivos locales.
- Operar con contexto local. Preguntar solo si bloqueado.

---

## 11. Recursos compartidos

| Recurso | Archivo |
|---|---|
| Agentes | `AGENTS.md` |
| Playbook | `PLAYBOOK.md` |
| Framework | `FRAMEWORK.md` |
| Portfolio | `context_proyectos.md` |
| Registry | `playbook_registry.json` |
| Plantillas | `plantillas/` |
| Diseno visual | `context_desing_go/context_design.md` — fuente unica de verdad visual |

---

## 12. Sistema de diseno visual — REGLA MANDATORIA

**`context_desing_go/` es fuente unica de verdad para TODO lo visual. Sin excepcion.**

El repo `https://github.com/joseaguilar-wq/context_desing_go.git` debe clonarse en la raiz del portafolio:

```bash
git clone https://github.com/joseaguilar-wq/context_desing_go.git
```

**Todo entregable visual DEBE usar tokens de `context_desing_go/context_design.md`:**
- Dashboards HTML, reportes, presentaciones, canvas, landing pages, web apps, paneles admin
- PDFs, emails, tablas, graficos
- No se inventan colores, fuentes ni espaciados. Todo sale del sistema de diseno.
- Si un token no existe, se documenta la necesidad. No se improvisa.

**Tokens base obligatorios:**
- Naranja GO `#FB670B`, Negro `#262626`, Gris `#535353`, Gris claro `#C5C5C5`, Crema `#ECEBE0`, Blanco `#FFFFFF`
- Tipografia: Blauer Nue (UI/headings), Morganite Pro (display), Conthic (cuerpo), JetBrains Mono (cifras)
- Modo oscuro por defecto en apps web. Light via `[data-mode="light"]`.

**Si `context_desing_go/` no existe localmente:**
1. Clonarlo antes de generar cualquier salida visual.
2. Si no se puede clonar, usar tokens minimos de esta seccion y reportar: "Diseno generado sin validacion contra repo visual."

Esta regla aplica a: framework_operative_enforcement, framework_kit, y todos los proyectos del ecosistema.

---

## 13. MCP Servers — NotebookLM

El framework incluye NotebookLM como servidor MCP preconfigurado en `.mcp.json`.
Permite preguntar notebooks de Google NotebookLM directamente desde Claude Code.

**Cuando un compañero pregunte como instalarlo:**

```
Prerequisito: Node.js >= 18

Paso 1: abrir Claude Code en la raiz del portafolio
Paso 2: escribir "usa el tool setup_auth del servidor notebooklm"
Paso 3: login Google en Chrome que se abre
Paso 4: listo — cookies persisten, no se repite

Verificar: "usa el tool get_health del servidor notebooklm"
```

**Tools clave disponibles:**

| Tool | Uso |
|---|---|
| `setup_auth` | Auth Google — solo primera vez |
| `ask_question` | Preguntar notebook con citas |
| `add_source` | Agregar fuente a notebook |
| `get_health` | Verificar conexion |

**Limite:** ~50 preguntas/dia en cuenta Google free.
**Seguridad:** sin passwords en texto plano — auth via cookies de Chrome.
**Detalle completo:** `ONBOARDING.md` seccion 10.

---

## 14. Sync framework_operative → framework_kit — REGLA PERMANENTE

**Todo lo nuevo en `framework_operative_enforcement/` DEBE ir a `framework_kit/` sanitizado. Sin excepcion.**

`framework_operative_enforcement/` es la copia local con datos reales (proyectos, owners, IPs, metricas).
`framework_kit/` es la version portable para compartir con el equipo.

### Que se copia (siempre)

- Archivos core: CLAUDE.md, FRAMEWORK.md, PLAYBOOK.md, ONBOARDING.md, AGENTS.md, CHANGELOG.md
- Scripts: todos los `.py` y `.js` en `scripts/`
- Plantillas: todo `plantillas/`
- Ejemplos: todo `examples/`
- Config: `.mcp.json`, `package.json`, `.gitignore`
- Githooks: todo `githooks/`
- Directorios con `.gitkeep`: checkpoints/, kpi_history/, reportes_playbook/

### Que NUNCA se copia

- `playbook_registry.json` (tiene datos reales de proyectos)
- `checkpoints/*.md` (tiene nombres de proyectos reales)
- `reportes_playbook/*.html` y `*.jpg` (tiene dashboards con datos reales)
- `kpi_history/*.json` (tiene metricas reales)
- `servers/` (tiene configuracion local)
- `node_modules/`, `package-lock.json`
- `.claude/` (settings locales)
- **`observatorio/`** (dashboard con datos reales — NUNCA a kit. El diseno de dashboards es norma interna de este framework, no del kit publico.)

### Regla de sanitizacion

Antes de copiar cualquier archivo a `framework_kit/`, verificar:
- Sin nombres de persona reales
- Sin nombres de empresa reales
- Sin nombres de proyectos reales
- Sin IPs, puertos, paths del sistema local
- Sin datos del ERP o proveedores

Referencias permitidas en framework_kit:
- `github.com/joseaguilar-wq/context_desing_go.git` (repo publico de diseno)
- `KP-IA Frameworks` (nombre del producto)
- `#FB670B` (color de marca, valor publico)

### Frecuencia

- Despues de cada cambio mayor en enforcement → sync a kit
- Minimo: cada viernes en consolidacion
- Antes de compartir framework_kit con alguien nuevo → sanitizar y sync
