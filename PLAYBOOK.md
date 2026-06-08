# PLAYBOOK — Sistema Operativo del Departamento

> Como operar el departamento: roles, cadencia, metricas, pipeline y automatizacion.
> Gobernado por `CLAUDE.md`. Complementado por `FRAMEWORK.md`.
> Version: 1.1

---

## 1. Mision

Construir sistemas de automatizacion e inteligencia operativa que aumenten la eficiencia del departamento mediante IA, agentes, integraciones y arquitectura reutilizable.

---

## 2. Principios operativos

1. **Evidencia sobre discurso.** Nada es avance sin prueba verificable (commit, PR, endpoint, test, demo).
2. **Un proyecto, un owner.** Sin duenos compartidos.
3. **Menos proyectos, mas profundidad.** Maximo 3-4 proyectos activos prioritarios por semana.
4. **Primero sistema vivo, luego perfeccion.** MVP funcional antes que arquitectura perfecta.
5. **Reutilizacion obligatoria.** Patrones, codigo, plantillas, arquitectura.
6. **Descubrimiento delegado, arquitectura centralizada.** El contributor documenta el AS-IS. El lider disena el TO-BE.
7. **El lider disena direccion, no solo construye.** Ordenar, asignar, revisar, escalar, institucionalizar.

---

## 3. Clasificacion de proyectos

| Tipo | Descripcion |
|---|---|
| Produccion | Sistema operativo generando valor |
| Piloto | Validacion con usuarios reales |
| Desarrollo activo | En construccion tecnica |
| Diseno / planeacion | Definicion sin ejecucion completa |
| Exploracion | Prueba conceptual o prototipo |
| Confidencial | Reservado por direccion |

---

## 4. Roles

**Lider del departamento:** prioridades, arquitectura, asignacion de owners, reporte ejecutivo, confidencialidad.

**Owner de proyecto:** ejecutar, documentar, reportar avances, medir progreso, escalar bloqueos.

**Ingeniero contributor:** ejecutar tareas, documentar cambios, reportar avance diario.

**Sponsor de negocio:** confirmar reglas, validar flujo, probar sistema, dar feedback.

---

## 5. Ciclo semanal

### 5.0 Log diario — Todos los dias (LUN a SAB)

Cada proyecto activo mantiene `avances_diarios.md`. Una entrada por sesion.

**El agente auto-registra** al final de cada sesion. El owner solo revisa.

Formato minimo:
```md
### [DIA] DD/MM — [Titulo]

**Que hice:** [1-2 acciones concretas]
**Evidencia:** [commit `hash` | test `X` | endpoint `POST /x`]
**MVP:** [X]% (entregable [N]/[TOTAL])
**Bloqueo:** [ninguno / descripcion]
**Siguiente:** [1 frase]
**Semaforo:** Verde/Amarillo/Rojo
```

### 5.0.1 Gestion de sesiones — Todos los dias

Practicas obligatorias para mantener contexto limpio:

**Naming:**
- `/rename` al iniciar sesion. Nombre descriptivo: `proyecto-b-fase6-auth`, `proyecto-a-bugfix-erp`.
- Sesiones como ramas: cada workstream su propio contexto persistente.
- `claude --continue` retoma ultima sesion. `claude --resume` elige de lista.

**Compaction rhythm:**
- `/clear` entre tareas no relacionadas. Obligatorio. No acumular temas distintos.
- `/compact <instrucciones>` para compresion dirigida en sesiones largas.
- Despues de 2 correcciones fallidas al mismo tema → `/clear` y prompt nuevo.
- Al compactar, asegurar que instrucciones criticas estan en CLAUDE.md (sobreviven).

**Context hygiene:**
- Sub-agentes para investigacion (no llenar main context).
- `/btw` para dudas rapidas (no entran en historial).
- Sesiones de writer/reviewer separadas (ver `AGENTS.md` seccion 11).
- Sesion de viernes (consolidacion) → siempre sesion fresca con `/clear` previo.

### 5.1 Lunes — Sprint Planning

Objetivo: definir guia de la semana.
El agente lee `avances_diarios.md` de semana anterior como fuente primaria.
Cada proyecto sale con objetivo en 1 frase y entregable esperado.

### 5.2 Miercoles — Checkpoint

Objetivo: revisar avance real, detectar bloqueos.
El agente lee `avances_diarios.md` para ver actividad LUN-MAR.
Formato: que se termino, que esta en proceso, que no avanzo, bloqueos, decisiones necesarias.

### 5.3 Viernes — Consolidacion

Objetivo: reporte ejecutivo con metricas.
El agente lee `avances_diarios.md` de TODA la semana.
Actualiza `playbook_registry.json` con historial fresco.

**Deteccion de zombies:**
- 3 dias sin entrada → alerta amarilla
- 5 dias sin entrada → rojo, proyecto zombie
- % MVP estancado 2 semanas → alerta amarilla

**Recoleccion de metricas de agentes:**
- Recolectar tokens gastados y sub-agentes usados de avances_diarios
- Consolidar en reporte bajo "Costo operativo"
- Actualizar `playbook_registry.json` con `metricas_agentes`

### 5.4 Dashboards — REGLA MANDATORIA

**Siempre se generan 4 archivos.** Sin excepciones. Sin excusas.

| Archivo | Spec |
|---|---|
| `Dashboard_[DIA]_[DD]_[Mes]_desktop.html` | Multi-columna, contenido completo |
| `Dashboard_[DIA]_[DD]_[Mes]_desktop.jpg` | Screenshot 1440 x altura-contenido |
| `Dashboard_[DIA]_[DD]_[Mes]_mobile.html` | Single-columna 390px, diseno compacto |
| `Dashboard_[DIA]_[DD]_[Mes]_mobile.jpg` | Screenshot 390 x altura-contenido-medida |

#### Desktop spec

- Multi-columna: hero, semaforos en row de 5, KPIs en row de 3, tabla + grafico Chart.js, highlights, pulls del dia
- Altura: capturar a altura real del contenido (detectar con JS `scrollHeight` o usar 1250px seguro)
- Incluir: tabla detallada de proyectos, grafico MVP%, avances, alertas, pulls recientes
- NO omitir secciones por espacio — hay suficiente con multi-columna

#### Mobile spec

- **PROHIBIDO:** `overflow: hidden`, `height: 100%` en html/body. Causa recorte en captura.
- Contenedor: `.screen { width:390px; margin:0 auto; }` — sin altura fija, flujo natural.
- Estructura: topbar → hero → signals (3) → titulo → project grid (2x2) → focus → footer
- Diseno: fondo con gradiente radial naranja, cards con bordes redondeados, tipografia Inter
- Proyectos: max 4 en grid 2x2. Si hay 5+, el resto va en seccion focus
- NO tablas. NO graficos. NO `overflow:hidden`. Solo metricas esenciales.
- Paleta: naranja #FB670B, verde #16c784, azul #4db6ff, violeta #b18cff, teal #14B8A6
- **Altura se mide con JS.** Igual que desktop. NUNCA se adivina ni se fija a 844px.

#### Captura JPG

**Paso 0 — Medir altura real del contenido (OBLIGATORIO):**
```bash
# Inyectar script que reporta scrollHeight en document.title
cp dashboard.html _measure.html
sed -i '' 's|</body>|<script>window.onload=function(){setTimeout(function(){document.title="HT:"+document.body.scrollHeight;},1500);};</script></body>|' _measure.html
HEIGHT=$(chrome --headless=new --disable-gpu --dump-dom --window-size=[W],[H] --virtual-time-budget=10000 "file://_measure.html" 2>/dev/null | grep -oP 'HT:\K[0-9]+' | head -1)
rm _measure.html
```

**Paso 1 — Captura con retina (2x) y altura exacta MEDIDA:**
```bash
# Desktop: 1440 CSS px de ancho, altura = contenido real medido + 20px
DESK_H=$((DESK_HEIGHT + 20))
chrome --headless=new --disable-gpu --force-device-scale-factor=2 \
  --screenshot=desktop.png --window-size="1440,$DESK_H" \
  --virtual-time-budget=10000 "file://dashboard_desktop.html"

# Mobile: 390 CSS px de ancho, altura = contenido real medido + 20px
# NUNCA usar altura fija. Siempre medir con JS primero.
MOB_H=$((MOB_HEIGHT + 20))
chrome --headless=new --disable-gpu --force-device-scale-factor=2 \
  --screenshot=mobile.png --window-size="390,$MOB_H" \
  --virtual-time-budget=10000 "file://dashboard_mobile.html"
```

**Paso 2 — Convertir PNG a JPG:**
```bash
sips -s format jpeg desktop.png --out Dashboard_[DIA]_[DD]_[Mes]_desktop.jpg
sips -s format jpeg mobile.png --out Dashboard_[DIA]_[DD]_[Mes]_mobile.jpg
rm desktop.png mobile.png
```

**Resultado esperado:**
- Desktop JPG: ~2880 x ~[altura*2] px (2x retina), 1-2 MB
- Mobile JPG: 780 x ~[altura*2] px (2x retina), 150-300 KB
- NO capturas a 1x. NO altura fija ni adivinada. NO `overflow:hidden`. NO contenido cortado.
- Altura mobile varia segun contenido (normalmente 700-900px CSS). SIEMPRE se mide.

**Regla de nomenclatura:** `Dashboard_[DIA]_[DD]_[Mes]_[tipo].[ext]`
- DIA: LUN, MAR, MIE, JUE, VIE, SAB
- Mes: Mayo, Junio, Julio... (texto, no numero)
- tipo: desktop | mobile
- ext: html | jpg

**Archivo:** `reportes_playbook/`

**Editar el dashboard:** NO editar `dashboard.html` directamente. Editar archivos en `source/` y reconstruir:
```bash
cd dashboard-kit/api/static
python3 build_dashboard.py --check  # verifica JS (node --check sobre bundle)
python3 build_dashboard.py          # reconstruye dashboard.html
```

**Pipeline source-modules (arquitectura):**

Los archivos fuente viven en `dashboard-kit/api/static/source/`. El orden de carga (JS_ORDER) es critico:

```
kpi-utils.js        → hashSlug, colorForIndex (golden-angle), helpers KPI
core/chart-kit.js   → ECharts helpers: lineOption, barOption, donutOption
modal.js            → modal base reutilizable
overlay.js          → overlay base
pres-config-kit.js  → configurador presentacion: PRES_CFG, filtros, modal
presentation-engine.js → buildScenes() lee PRES_CFG, escenas fullscreen, dispose()
enroll-kit.js       → badge proyectos sin registrar, modal enrollment
data-render.js      → renderizado tarjetas + grid auto-fill + badge git/no-git
```

Regla: nunca mover un modulo antes de sus dependencias. `pres-config-kit` SIEMPRE antes de `presentation-engine`. Al agregar modulo nuevo: actualizar JS_ORDER en build_dashboard.py.

**Auto-discovery (no-git):**

```bash
PYTHONPATH=. python3 -m dashboard_kit.collector.folder_scan   # descubre carpetas
PYTHONPATH=. python3 -m dashboard_kit.enroll --auto FOLDER    # enrola carpeta
PYTHONPATH=. python3 -m dashboard_kit.enroll --ignore FOLDER  # ignora permanente
```

Enrollment persiste en tabla `folder_registry` (SQLite). Proyectos sin git aparecen con badge "sin git" y se nutren de `file_activity` (senales filesystem).

---

## 6. Pipeline para nuevos proyectos

1. **Fase 0 — Intake:** entender que se quiere automatizar y por que. Salida: aprobado / rechazado / en espera.
2. **Fase 0.5 — Descubrimiento delegado (opcional):** el contributor documenta el proceso AS-IS antes de disenar.
3. **Fase 1 — Diseno de solucion:** el lider define tipo de solucion, arquitectura, stack, plan de fases.
4. **Fase 2 — Asignacion de owner:** se asigna owner, se define primer entregable, arranca cadencia semanal.

---

## 7. Reporte ejecutivo semanal (viernes)

```md
## Reporte semanal — [DEPARTAMENTO] — [FECHA]

### Resumen
- Produccion: [N] | Piloto: [N] | Desarrollo: [N] | Zombies: [N]
- Riesgo principal de la semana:

### Top avances
1.
2.
3.

### Metricas por proyecto

| Proyecto | Owner | % MVP | Semaforo | Bloqueo |
|---|---|---|---|---|

### Decisiones requeridas
-

### Prioridad siguiente semana
-
```

---

## 8. Criterios de semaforo (CALCULADOS, no autodeclarados)

**Verde:** entrada en `avances_diarios.md` en ultimas 48h + % MVP avanzo esta semana + sin bloqueos activos.

**Amarillo:** sin entrada en 3 dias + % MVP estancado 2 semanas + bloqueo activo < 48h + owner no responde en 24h.

**Rojo:** sin entrada en 5+ dias (zombie) + bloqueo > 48h sin plan + % MVP estancado > 3 semanas + sin owner.

### Prioridad dinamica

La prioridad no se asigna manualmente. Se calcula con formula documentada en `CLAUDE.md` seccion 6.

Fuente: `playbook_registry.json`. Campos usados: `dias_sin_actividad`, `%_mvp`, `fase`, `bloqueo_principal`, `clasificacion`.

Max 3-4 proyectos prioritarios por semana. Resto a cola "EN ESPERA".
Recalculo: cada lunes y cada viernes.

---

## 9. Metricas por proyecto

| Metrica | Fuente |
|---|---|
| % MVP | `MVP_BREAKDOWN.md` (completados/totales * 100) |
| Flujos implementados | `avances_diarios.md` |
| Flujos testeados | `avances_diarios.md` |
| Bloqueo principal | `avances_diarios.md` |
| Semaforo | Calculado segun criterios seccion 8 |
| Evidencia principal | `avances_diarios.md` (commit/PR/endpoint) |
| Owner | `context.md` |
| Fase actual | 0-9 segun `FRAMEWORK.md` |
| Dias sin actividad | Calculado desde ultima entrada en `avances_diarios.md` |
| Delta % MVP semanal | `playbook_registry.json` historial |

---

## 10. Archivos obligatorios

**Por departamento:** `CLAUDE.md`, `PLAYBOOK.md`, `FRAMEWORK.md`, `context_proyectos.md`, `playbook_registry.json`

**Por proyecto activo:** `context.md`, `status.md`, `BACKLOG.md`, `RISKS.md`, `avances_diarios.md`, `MVP_BREAKDOWN.md`

---

## 11. Automatizacion

### Scripts

Los scripts de automatizacion viven en `scripts/` en la raiz del portafolio:

- `scripts/framework_status.py` — estado del pool (compact para statusline, full para /hoy)
- `scripts/zombie_detector.py` — detecta proyectos zombie segun criterios seccion 8
- `scripts/semaforo_calculator.py` — calcula semaforos automaticamente desde datos reales
- `scripts/validate_registry.py` — valida estructura y campos del registry.json
- `scripts/setup.py` — wizard interactivo de onboarding
- `scripts/playbook_report.py` — genera borrador LUN/MIE/VIE (en desarrollo)
- `scripts/friday_report_to_html.py` — convierte reporte markdown a dashboard HTML (en desarrollo)
- `scripts/init_project.py` — inicializa proyecto desde templates (en desarrollo)
- `scripts/archive_week.py` — automatiza backup semanal (en desarrollo)

### Status line persistente

Para mostrar el estado del pool en la barra de estado del CLI:

1. Copia `scripts/framework_status.py` a `scripts/` de tu portafolio
2. Ejecuta en Claude Code: `/statusline`
3. Selecciona "Command" y escribe: `python3 scripts/framework_status.py`

Esto muestra en tiempo real: `(4v 2a 0r) ProyectoA Verde 100% | ProyectoB Verde 100% | ProyectoC Verde 98%! | ProyectoD Amarillo 90%`

### Flujo del viernes automatizado

```bash
python3 scripts/zombie_detector.py
# → detecta proyectos sin actividad
python3 scripts/semaforo_calculator.py
# → recalcula semaforos y actualiza registry
python3 scripts/framework_status.py full
# → genera tabla completa de estado
```

### 11.1 Flujo completo del viernes — Dashboard visual

Pipeline markdown → HTML → JPG desktop + mobile.

#### Piezas del sistema

| Archivo | Rol |
|---|---|
| `scripts/playbook_report.py` | Genera borrador markdown del viernes |
| `playbook_registry.json` | Metadata de proyectos (owners, clasificacion) |
| `scripts/friday_report_to_html.py` | Convierte markdown → HTML + actualiza KPI history |
| `scripts/friday_dashboard.html.template` | Template HTML con variables sustituibles |
| `scripts/screenshot_report.js` | Puppeteer: HTML → JPG desktop + mobile |
| `kpi_history/YYYY/MM-month.json` | Historico de metricas semanales |
| `reportes_playbook/` | Salida de reportes activos |
| `reportes_playbook/archive/` | Historico de reportes archivados |

#### Pipeline paso a paso

```bash
# 1. Generar borrador markdown
python3 scripts/playbook_report.py --mode friday

# 2. Llenar metricas en el markdown (agente o manual)

# 3. Convertir a HTML desktop + actualizar KPI history
python3 scripts/friday_report_to_html.py --input reportes_playbook/YYYY-MM-DD_friday.md

# 4. Convertir a HTML mobile
python3 scripts/friday_report_to_html.py --input reportes_playbook/YYYY-MM-DD_friday.md --output reportes_playbook/YYYY-MM-DD_friday_mobile.html --mode mobile

# 5. Generar JPG desktop (viewport 1440x900)
node scripts/screenshot_report.js --desktop --input reportes_playbook/YYYY-MM-DD_friday.html --output reportes_playbook/YYYY-MM-DD_friday_desktop.jpg

# 6. Generar JPG mobile (viewport 390x844, 2x DPR)
node scripts/screenshot_report.js --mobile --input reportes_playbook/YYYY-MM-DD_friday_mobile.html --output reportes_playbook/YYYY-MM-DD_friday_mobile.jpg
```

#### KPIs trackeados (WoW / MoM)

Cada viernes se guarda snapshot en `kpi_history/YYYY/MM-month.json`.

Por proyecto: MVP %, flujos implementados, flujos probados, bugs abiertos/cerrados, semaforo, blocker.

Comparacion WoW: semana actual vs semana anterior del mismo mes.
Comparacion MoM: semana actual vs semana 1 del mes previo.

#### Reglas perpetuas de dashboards

Estructura de `reportes_playbook/`:
```
reportes_playbook/
├── archive/
│   └── YYYY-MM-DD_*.{html,md,jpg}
├── Dashboard_<CONTEXTO>_<DD>_<MES>.html
├── Dashboard_<CONTEXTO>_<DD>_<MES>_mobile.html
├── Dashboard_<CONTEXTO>_<DD>_<MES>_desktop.jpg
└── Dashboard_<CONTEXTO>_<DD>_<MES>_mobile.jpg
```

Todo dashboard debe producir exactamente 4 archivos. Sin excepcion.

**Contenido obligatorio:** solo proyectos activos, semaforos calculados, datos verificados con git log/status.md, footer con fecha y origen.

**HTML mobile:** CSS override forzado. Grids a 1fr, hero-title 18px, kpi-val 28px, viewport 390px, tabla columnas 3 y 5 ocultas, chart height 180px.

**Archivo semanal:** Al lunes siguiente, mover los 4 assets activos a `archive/`. Raiz de `reportes_playbook/` queda vacia para la nueva semana.

#### Requisitos

- Python 3.11+ (para `friday_report_to_html.py`)
- Node.js + Puppeteer (`npm install` en `framework_operative_enforrcement/`)
- `playbook_registry.json` actualizado

### Registry auto-actualizable

Cada viernes, el agente actualiza `playbook_registry.json`:
- Agrega entrada en `historial_kpi[]` por proyecto
- Agrega entrada en `metricas_departamento.historial_semanal[]`
- Actualiza `dias_sin_actividad` y `ultima_entrada_diario`
- Actualiza contador de zombies

---

## 12. Metricas de Agentes

Registro de uso de agentes y sub-agentes. Fuente: auto-registro del agente en avances_diarios.md.

### 12.1 Consumo de tokens

- Registrar al final de cada sesion en `avances_diarios.md`.
- Almacenar en `playbook_registry.json` → `historial_kpi[].tokens_gastados`.
- Formato: `{semana, tokens_entrada, tokens_salida, modelo_principal}`.
- Estimacion: Claude Code no expone contador exacto. Usar estimacion del agente.

### 12.2 Conteo de sub-agentes

- Total de sub-agentes usados por semana.
- Por tipo: explore, plan, code-reviewer, general-purpose.
- Por proyecto.
- Almacenar en `metricas_agentes.subagent_exitosos` y `subagent_fallidos`.

### 12.3 Tasa de exito

- Exito: tarea completada + output usable sin re-work.
- Falla: output no usable, incompleto, o requirio re-run completo.
- Tasa = exitos / total (objetivo > 80%).
- Tasa < 50% → revisar protocolo de handoff (AGENTS.md seccion 6).

### 12.4 Costo estimado

- `costo = tokens_entrada * precio_input + tokens_salida * precio_output`.
- Precios de referencia en `PRECIOS.md`.
- Mostrar en reporte del viernes: "Costo estimado LLM: $X.XX".
- No es facturacion exacta. Es estimacion de orden de magnitud.

### 12.5 Procedimiento de recoleccion

1. Al final de cada sesion, el agente auto-registra en `avances_diarios.md`.
2. El viernes, el agente consolida metricas de la semana.
3. Actualiza `playbook_registry.json` → `metricas_agentes` por proyecto.

### 12.6 Campos en registry

Cada proyecto en `playbook_registry.json` gana campo opcional:

```json
"metricas_agentes": {
  "tokens_entrada": 0,
  "tokens_salida": 0,
  "subagent_exitosos": 0,
  "subagent_fallidos": 0,
  "costo_estimado": 0.0
}
```

Campos en `historial_kpi[]` por semana:

```json
{
  "semana": "2026-05-15",
  "tokens_entrada": 0,
  "tokens_salida": 0,
  "modelo_principal": "sonnet"
}
```

---

## 13. Presentacion mensual CEO — Slides Canva

**Cadencia:** ultimo viernes de cada mes, despues del cierre semanal.
**Audiencia:** CEO + personal no tecnico.
**Objetivo:** mostrar avance del departamento — construido, operando, escalable.

### 13.1 Frases de activacion

- `prepara las slides del mes`
- `slides para el CEO`
- `presentacion mensual`
- `canva cierre de mes`

### 13.2 Entregables obligatorios (6 archivos)

| Archivo | Descripcion |
|---|---|
| `slide_1.html` | Timeline 4 semanas — hitos clave |
| `slide_2.html` | Dashboard ejecutivo — numeros y portafolio |
| `slide_1_UHD.png` | Captura 3x (5760x3240) lista para Canva |
| `slide_2_UHD.png` | Captura 3x (5760x3240) lista para Canva |
| `GUION_5MIN.md` | Guion de 5 minutos para el presentador |
| `COPY_SLIDES.md` | Copy exacto para pegar en Canva |

Carpeta destino: `reportes_playbook/canva_[mes]_[anio]/`

Ejemplo: `reportes_playbook/canva_mayo_2026/`

### 13.3 Reglas de contenido

- Sin dinero. Sin owners. Solo "Departamento de IA".
- Porcentajes reales: produccion=100%, piloto activo=95%, pre-piloto=70%, construccion avanzada=75%, construccion=65%, diseno=15%.
- Mencionar los 5 modelos en uso: Sonnet 4.6, Opus 4.7, DeepSeek V4 Pro, DeepSeek V4 Flash, GPT 5.5.
- Mencionar total de tecnologias integradas (actualizar cada mes desde proyectos activos).
- Proyectos estrella: los 2 con mayor avance en piloto/produccion. Marcar con estrella.
- Contenido estrella fijo: Framework GO — siempre aparece en slide 2 como activo replicable.
- Max 20% texto del area del slide. 80% visual.
- Cero emojis. Cero dinero. Cero tecnicismos.

### 13.4 Paleta y diseno

Fuente visual: `context_desing_go/context_design.md`

| Token | Valor |
|---|---|
| Naranja GO | `#FB670B` |
| Negro | `#262626` |
| Crema | `#ECEBE0` |
| Blanco | `#FFFFFF` |
| Naranja gradiente | `#FB670B` → `#D95C00` |

Tipogproyecto-a: Blauer Nue (display), Conthic (body), Morganite Pro (cifras grandes).

### 13.5 Estructura slide 1 — Timeline mensual

- Header: logo imagotipo_go.png + titulo + badge mes
- Timeline horizontal: 4 nodos S1–S4, cards alternados arriba/abajo
- Cada card: eyebrow + titulo + 3 bullets + cifra destacada
- Cards estrella (S3 y S4 normalmente): borde naranja resaltado
- Footer: 4 mini-cards proyectos paralelos con estado

### 13.6 Estructura slide 2 — Dashboard ejecutivo

- Header: misma identidad slide 1
- Q1 top-left: 4 KPIs grandes (proyectos, modelos, tecnologias, en operacion) + barras capacidad
- Q2 top-right: donut estado portafolio con leyenda
- Q3 mid-left: barras horizontales por proyecto (con estrella en top 2)
- Q4 mid-right: grafico stack tecnologico por categoria
- Q5 bottom-left: linea de crecimiento semanal (tests + conexiones)
- Q6 bottom-right: Framework spotlight — fondo naranja, 3 cifras (fases / plantillas / proyectos)
- Footer: badges de los 5 modelos IA

### 13.7 Captura UHD para Canva

```bash
cd "reportes_playbook/canva_[mes]_[anio]/"

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless=new --force-device-scale-factor=3 \
  --hide-scrollbars \
  --screenshot=slide_1_UHD.png \
  --window-size=1920,1080 \
  "file://$(pwd)/slide_1.html"

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless=new --force-device-scale-factor=3 \
  --hide-scrollbars \
  --screenshot=slide_2_UHD.png \
  --window-size=1920,1080 \
  "file://$(pwd)/slide_2.html"
```

Resultado: 5760x3240 px a ~72 DPI efectivo. Subir directo a Canva.

### 13.8 Fuentes de datos — donde leer cada cifra

| Dato | Fuente |
|---|---|
| % MVP por proyecto | `[proyecto]/status.md` + `MVP_BREAKDOWN.md` |
| Tests aprobados | `[proyecto]/avances_diarios.md` o CHANGELOG |
| Tecnologias integradas | Contar desde stacks en `context_proyectos.md` |
| Usuarios piloto | `[proyecto]/status.md` campo usuarios |
| Operaciones el ERP | `proyecto-a/` o `proyecto-b/` avances |
| Agentes por proyecto | `[proyecto]/context.md` o CHANGELOG |
| Modelos en uso | `context_proyectos.md` → sección stack |
| Framework fases | `framework_operative_enforcement/FRAMEWORK.md` |

### 13.9 Logos GO

Fuente: `context_desing_go/01_LOGO/`

| Archivo | Uso |
|---|---|
| `imagotipo_go.png` | Header slide 1 y slide 2 (fondo blanco) |
| `isotipo_go.png` | Decoracion esquina / watermark |
| `isotipo_go_blanco.png` | Framework spotlight (fondo naranja) |

### 13.10 Checklist antes de generar capturas

- [ ] Porcentajes verificados contra status.md actualizados
- [ ] Tecnologias contadas (no adivinadas)
- [ ] Proyectos estrella identificados correctamente
- [ ] Framework cifras actualizadas (fases / plantillas / proyectos)
- [ ] Logos cargando (paths relativos correctos)
- [ ] Slide 2 Q6 usa isotipo_go_blanco.png (no el naranja)
- [ ] Ambos slides abren sin errores de consola
- [ ] Capturas a 3x (slide_*_UHD.png)
