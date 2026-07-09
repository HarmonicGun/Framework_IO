# Clase: Framework de Inteligencia Operativa sobre Claude Code

> Duracion: ~30 minutos | Formato: charla + demo en vivo
> Objetivo: salir sabiendo instalar, operar y extender el framework con identidad de marca, MCPs y skills.

---

## BLOQUE 1 — El problema y la solucion (5 min)

### El problema real

Equipos con 5, 10, 15 proyectos en paralelo. Nadie sabe cuales avanzan, cuales estan bloqueados. El reporte ejecutivo toma 2-3 horas de preparacion, 3-4 veces por semana. Los semaforos se autodeclaran: todos "verde" aunque no haya evidencia real. Bloqueos se descubren semanas despues de que ocurrieron.

### La solucion

Un sistema operativo departamental sobre Claude Code. No es un SaaS. No es una app. Son 3 archivos markdown que gobiernan a un agente de IA.

Resultado: reporte ejecutivo semanal en **5 minutos**. Antes 2-3 horas.

### Que es exactamente

Un conjunto de archivos que le dicen a Claude Code como operar un departamento entero. El usuario dice frases naturales en español. El agente ejecuta el trabajo.

| Frase | Que produce |
|---|---|
| `arranquemos un lunes mas` | Sprint planning semanal con objetivos y riesgos |
| `vamos con el checkpoint` | Revision de bloqueos, semaforos reales, zombies |
| `prepara el informe` | Reporte ejecutivo + dashboard HTML + JPG |
| `hoy` | Estado rapido de todos los proyectos |
| `registra sesion` | Entrada en log diario con evidencia |
| `revisa la seguridad` | Auditoria completa del proyecto |

**La diferencia central:** el semaforo no se edita. Se calcula desde evidencia real (commits, tests, endpoints, demos). Si un proyecto no tiene actividad en 5+ dias, pasa a rojo automaticamente. No se puede falsificar.

---

## BLOQUE 2 — Instalacion y primer arranque (5 min)

### Requisitos

- Claude Code instalado (`npm install -g @anthropic-ai/claude-code`)
- Una carpeta con los proyectos a gestionar
- Saber que proyectos existen (nombres y owners)

### Instalacion (2 opciones)

**Opcion A — Git clone (recomendado):**
```bash
git clone [URL_DEL_REPO] framework_kit
cd framework_kit
chmod +x githooks/*
git config core.hooksPath githooks
```

Ventaja: auto-actualizacion. Cada vez que abres Claude Code, el agente ejecuta `check_update.py` y hace pull automatico si hay cambios en master.

**Opcion B — Copia manual:**
Copiar `CLAUDE.md`, `PLAYBOOK.md`, `FRAMEWORK.md` a la raiz del portafolio. Sin auto-update.

### Primer arranque

```bash
cd /ruta/a/tu/portafolio
claude
```

Escribir cualquier cosa: `hola`, `arranquemos`, `empecemos`.

El agente detecta que es primer uso (no existe `context_proyectos.md`) y configura todo automaticamente:
1. Crea `context_proyectos.md` (tablero maestro del portafolio)
2. Crea `playbook_registry.json` (registro de proyectos con historial)
3. Revisa cada carpeta de proyecto, crea archivos minimos si faltan
4. Detecta el dia de la semana y deja listo para trabajar

Tiempo de setup: **10-15 minutos**.

### Archivos que se crean por proyecto

```
proyecto/
  context.md          # identidad, stack, objetivo
  status.md           # estado actual, semaforo, bloqueos
  BACKLOG.md          # tareas accionables priorizadas
  RISKS.md            # riesgos vivos con mitigacion
  avances_diarios.md  # log de sesiones (LUN a SAB)
  MVP_BREAKDOWN.md    # desglose del MVP en entregables
```

Si tiene UI: `DESIGN_SYSTEM.md`. Si tiene datos/usuarios: `SECURITY.md`.

---

## BLOQUE 3 — Ciclo semanal completo (5 min)

### La cadencia operativa

```
LUNES     → Sprint Planning (objetivos, prioridades, riesgos)
MARTES    → Ejecucion (log diario automatico)
MIERCOLES → Checkpoint (bloqueos, semaforos, ajustes)
JUEVES    → Ejecucion (log diario automatico)
VIERNES   → Consolidacion (reporte ejecutivo + dashboards)
SABADO    → Cierre ligero (log diario, deuda tecnica)
```

### Lunes — Sprint Planning

**Frases:** `arranquemos un lunes mas`, `preparame para el sprint`, `iniciemos la semana`

Que hace el agente:
- Lee `avances_diarios.md` de semana anterior (fuente primaria)
- Lee cortes LUN/MIE/VIE de semana anterior
- Define objetivos semanales por proyecto
- Asigna owners, detecta riesgos
- Archiva semana anterior en `Backups/`

**Salida:** prioridades, objetivo por proyecto, riesgos, continuidad.

**Regla clave:** el lunes nunca arranca desde cero. Siempre lee la semana anterior. Sin `avances_diarios.md`, el lunes arranca ciego.

### Miercoles — Checkpoint

**Frases:** `vamos con el checkpoint`, `miercoles de bloqueos`, `revisemos como vamos`

Que hace el agente:
- Revisa actividad de LUN-MAR en `avances_diarios.md`
- Detecta bloqueos activos
- Verifica semaforos (calculados, no autodeclarados)
- Detecta proyectos zombie (5+ dias sin actividad)
- Separa avance real de "trabajo no validado"

**Salida:** que avanzo, que no, bloqueos, decisiones necesarias, ajuste al viernes.

### Viernes — Consolidacion Ejecutiva

**Frases:** `prepara el informe`, `consolida las metricas`, `vamos al cierre`

Que hace el agente:
- Consolida metricas de TODA la semana
- Detecta top avances, riesgos, zombies
- Prepara reporte ejecutivo en markdown
- Actualiza `playbook_registry.json` con historial
- **MANDATORY:** genera 4 archivos dashboard:
  - `Dashboard_VIE_DD_Mes_desktop.html`
  - `Dashboard_VIE_DD_Mes_desktop.jpg`
  - `Dashboard_VIE_DD_Mes_mobile.html`
  - `Dashboard_VIE_DD_Mes_mobile.jpg`

**Salida:** reporte markdown + 4 archivos dashboard listos para compartir.

### Diario — Log automatico

**Frases:** `registra sesion`, `actualiza avances`, `anota lo que hice`

El agente auto-registra en `avances_diarios.md`:
```markdown
### [DIA] DD/MM — [Titulo]

**Que hice:** [1-2 acciones concretas]
**Evidencia:** [commit hash | test X | endpoint POST /x]
**MVP:** [X]% (entregable [N]/[TOTAL])
**Bloqueo:** [ninguno / descripcion]
**Semaforo:** Verde/Amarillo/Rojo
```

El owner solo revisa. No llena formularios.

### Semaforos — Calculados, no autodeclarados

| Color | Criterio |
|---|---|
| Verde | Actividad en < 48h + %MVP avanzo + sin bloqueos |
| Amarillo | Sin actividad en 3 dias, o %MVP estancado 2 semanas, o bloqueo activo |
| Rojo | Sin actividad 5+ dias (zombie), o bloqueo > 48h sin plan |

Nadie puede poner "verde" un proyecto que lleva 8 dias sin evidencia real.

### Ordenamiento dinamico de proyectos

Los proyectos se ordenan por formula matematica, no por opinion:

```
score = (dias_sin_actividad * 0.10)
      + ((100 - %_mvp) * 0.30)
      + (fase_ponderada * 0.20)
      + (severidad_bloqueo * 0.25)
      + (bonus_clasificacion * 0.15)
```

Max 3-4 proyectos activos por semana. Resto → "EN ESPERA".

---

## BLOQUE 4 — Sistema de diseno visual e identidad de marca (5 min)

### Fuente unica de verdad

El framework incluye un sistema de diseno visual completo. Todo output (dashboards, reportes, presentaciones, web apps, PDFs, emails) DEBE usar los tokens del sistema. No se inventan colores, fuentes ni espaciados.

### Repositorio de diseno

```bash
git clone https://github.com/joseaguilar-wq/context_desing_go.git
```

Este repo contiene:
- `context_design.md` — tokens CSS, paleta, tipografia, reglas
- `guias y manuales/markdowns/` — brand system orquestador + 6 submarcas
- `guias y manuales/markdowns/ui_shell_component.md` — componentes UI reciclables
- `01_LOGO/`, `02_TIPOGRAFIA/`, `03_PALETA DE COLORES/`, `04_ELEMENTOS GRAFICOS/` — assets

### Tokens base obligatorios

> Los valores de abajo son el ejemplo real del autor (su propio repo publico de diseno, referenciado arriba). No son un requisito fijo del framework: cada departamento clona o crea SU PROPIO sistema de diseno y sustituye estos valores por los suyos. Lo obligatorio es tener una fuente unica de verdad visual, no estos colores/fuentes especificos.

**Paleta:**
| Color | Hex | Uso |
|---|---|---|
| Naranja | `#FB670B` | CTAs, acentos, KPI principal, marca |
| Negro | `#262626` | Fondos oscuros, texto principal |
| Gris oscuro | `#535353` | Texto secundario, bordes |
| Gris claro | `#C5C5C5` | Separadores, fondos alternos |
| Crema | `#ECEBE0` | Fondos reportes/PDF |
| Blanco | `#FFFFFF` | Fondo principal |

**Tipografia:**
| Fuente | Rol |
|---|---|
| Blauer Nue | UI, headings, logo |
| Morganite Pro | Display, KPIs grandes, portadas |
| Conthic | Cuerpo, tablas, texto corrido |
| JetBrains Mono | Cifras, codigo, datos |

**Tokens CSS:**
```css
:root {
  --go-orange: #FB670B;
  --go-black:  #262626;
  --go-gray-1: #535353;
  --go-gray-2: #C5C5C5;
  --go-cream:  #ECEBE0;
  --go-white:  #FFFFFF;

  --go-bg:     var(--go-white);
  --go-text:   var(--go-black);
  --go-accent: var(--go-orange);
}
```

### Modo oscuro por defecto

Todo proyecto nuevo arranca en **dark-first**:
- `:root` define tokens dark. Fondo `#0A0A0A`, texto `#FFFFFF`
- Light mode va en `[data-mode="light"]` como alternativo
- Aplica a: web apps, dashboards, reportes HTML, paneles admin
- Si es solo PDF/impresion: fondo `#ECEBE0` (crema)

### Componentes UI reciclables

Existe un **UI Shell plug-and-play** (topbar + sidebar + main) documentado en `ui_shell_component.md` v1.1.

Reglas:
- Proyecto con navegacion entre vistas → usa el sidebar shell. NO inventes uno propio
- Copia bloque CSS + JS del componente. NO modifiques reglas core
- Customizable solo: `navItems`, iconos, colores secundarios

---

## BLOQUE 5 — MCPs, Skills y extensiones (5 min)

### MCPs preconfigurados

El framework incluye `.mcp.json` con servidores MCP listos. El principal:

#### NotebookLM MCP

Permite preguntar a notebooks de Google NotebookLM directamente desde Claude Code, con citas a fuentes.

**Instalacion (primera vez):**
```
Prerequisito: Node.js >= 18

1. Abrir Claude Code en la raiz del portafolio
2. Escribir: "usa el tool setup_auth del servidor notebooklm"
3. Login Google en el Chrome que se abre
4. Listo — cookies persisten, no se repite
```

Verificar: `"usa el tool get_health del servidor notebooklm"`

**Tools disponibles:**

| Tool | Uso |
|---|---|
| `setup_auth` | Auth Google — solo primera vez |
| `ask_question` | Preguntar al notebook con citas a fuentes |
| `add_source` | Agregar fuente (URL o texto) |
| `add_notebook` | Registrar notebook en biblioteca |
| `generate_audio` | Audio Overview (podcast IA) |
| `download_audio` | Descargar audio generado |
| `list_notebooks` | Listar notebooks en biblioteca |
| `search_notebooks` | Buscar por tema |

**Limite:** ~50 preguntas/dia en cuenta Google free.

### Skills incluidos

El framework hereda todos los skills del ecosistema Claude Code:

| Skill | Uso |
|---|---|
| `frontend-design` | Interfaces web, landing pages, dashboards con calidad de produccion |
| `claude-api` | Apps con Anthropic SDK, prompt caching, migracion entre modelos |
| `code-review` | Revision de diffs con niveles de profundidad (low/medium/high) |
| `security-review` | Auditoria de seguridad completa del branch actual |
| `review` | Revision de pull requests |
| `init` | Inicializar nuevo CLAUDE.md con documentacion del codebase |
| `run` | Lanzar y validar la app del proyecto |
| `verify` | Verificar que un cambio funciona observando comportamiento real |
| `loop` | Tareas recurrentes (ej: `/loop 5m /check-deploy`) |

### Scripts de automatizacion

El framework incluye scripts Python/Node para el ciclo semanal:

| Script | Funcion |
|---|---|
| `framework_status.py` | Estado del pool (compact/full) |
| `zombie_detector.py` | Detecta proyectos sin actividad |
| `semaforo_calculator.py` | Calcula semaforos desde datos reales |
| `validate_registry.py` | Valida estructura del registry |
| `setup.py` | Wizard interactivo de onboarding |
| `init_project.py` | Inicializa proyecto desde templates |
| `archive_week.py` | Automatiza backup semanal |
| `friday_report_to_html.py` | Convierte reporte markdown a dashboard HTML |
| `screenshot_report.js` | Captura HTML a JPG (Chrome headless) |
| `check_update.py` | Auto-update del framework via git |

---

## BLOQUE 6 — Sub-agentes y construccion adversarial (5 min)

### Sistema de sub-agentes

El framework define una jerarquia de delegacion para no saturar el contexto:

| Agente | Modelo | Costo | Uso |
|---|---|---|---|
| Explore | haiku | 1x | Leer codebase, buscar archivos, investigar |
| Plan | sonnet | 3x | Disenar arquitectura, planificar fases |
| general-purpose | sonnet | 3x | Build, refactor, implementacion |
| code-reviewer | opus | 15x | Auditoria de seguridad, fase 6, bugs sutiles |

Regla: "cuando dudes, delegar a Plan. cuando sepas, ejecutar directo."

### Construccion Adversarial

Antes de construir cualquier cosa:

```
1. VERIFICAR → leer archivos que se van a tocar
2. PLANEAR → plan atomico paso a paso
3. DESAFIAR → agente adversarial busca romper el plan
4. CORREGIR → incorporar hallazgos
5. APROBAR → luz verde del usuario
6. CONSTRUIR → solo entonces
```

Razon: cualquier plan no verificado tiene al menos un error. El agente adversarial lo encuentra barato (antes del build). Despues del build cuesta 10x.

### Fases del framework (0-9)

Todo proyecto sigue el mismo ciclo de construccion:

```
0 Intake → 1 Discovery → 2 Classification → 3 Operating Design →
4 Technical Design → 5 Build → 6 Critical Review →
7 Pilot → 8 Production → 9 Continuous Improvement
```

Cada fase tiene checklist de verificacion. La fase 6 (Critical Review) es la mas intensa: 10 roles de revision, 10 preguntas por modulo.

### Observabilidad SIEM/EDR/XDR

Todo proyecto con endpoints, jobs, datos o usuarios debe exponer:

| Endpoint | Proposito |
|---|---|
| `/health` | Alive check |
| `/ready` | Ready check |
| `/metrics` | Metricas en formato ECS |
| `/siem/events` | Eventos de seguridad |
| `/siem/audit` | Registro de auditoria |
| `/version` | Version del servicio |

4 modos de salida: pull HTTP, syslog RFC5424, webhook HTTPS, stdout JSON.
Compatible con: Elastic, Wazuh, Splunk, Graylog, Datadog, Sentinel, CrowdStrike, SentinelOne.

---

## BLOQUE 7 — Reglas de comunicacion (caveman mode) (2 min)

El agente opera en **caveman mode** siempre:

- Hablar muy corto. 3-6 palabras por linea
- Cero relleno. Cero cortesia. Cero explicaciones
- Chat = corto. Archivo = largo
- NO emojis. Cero. En ningun lado

Ejemplo:
- Mal: "Deberias instalar las dependencias primero para asegurar que todo funcione correctamente."
- Bien: "instala deps. listo."

Para desactivar: decir `"normal mode"`.

---

## BLOQUE 8 — Resumen: que te llevas hoy (3 min)

### El framework en 1 frase

**Un sistema operativo departamental que convierte frases naturales en sprint planning, checkpoints y reportes ejecutivos generados por IA en 5 minutos.**

### 3 archivos, 1 carpeta

```
CLAUDE.md       → gobierna al agente (autoridad maxima)
PLAYBOOK.md     → sistema operativo (cadencia, roles, metricas)
FRAMEWORK.md    → fases 0-9, seguridad, diseno
plantillas/     → templates para todo
scripts/        → automatizacion del ciclo semanal
```

### Que NO es

- No es un SaaS (no necesita servidor, DB, ni internet mas alla de Claude API)
- No es un reemplazo de Jira/Notion (convive con ellos)
- No es un generador de reportes bonitos (es un sistema de gobernanza)

### Que SI es

- Es un multiplicador de velocidad operativa
- Es un eliminador de "trabajo sobre el trabajo"
- Es un sistema que fuerza accountability con evidencia real
- Es portable: funciona en cualquier carpeta con proyectos

### Proximo paso

1. Clonar `framework_kit`
2. Copiar `CLAUDE.md`, `PLAYBOOK.md`, `FRAMEWORK.md` a tu portafolio
3. Abrir Claude Code y decir `hola`
4. El agente configura todo en 10-15 minutos

---

## Referencias rapidas

| Archivo | Para |
|---|---|
| `CLAUDE.md` | Frases de activacion, reglas del agente, MCPs |
| `PLAYBOOK.md` | Ciclo semanal completo, roles, metricas |
| `FRAMEWORK.md` | Fases 0-9, seguridad, diseno, SIEM |
| `AGENTS.md` | Delegacion de sub-agentes, paralelizacion |
| `ONBOARDING.md` | Instalacion paso a paso, git workflow |
| `context_design.md` | Tokens de diseno, paleta, tipografia |
| `plantillas/` | Templates para portfolios, proyectos, seguridad |
| `examples/` | Departamento ficticio pre-configurado |
| `.mcp.json` | Configuracion MCP NotebookLM |
