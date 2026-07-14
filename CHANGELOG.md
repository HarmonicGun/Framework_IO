# Changelog

## [1.2.0] — 2026-07-14

### Added
- `CLAUDE.md` seccion 0.6 "Principios de Karpathy" — REGLA PERMANENTE nueva, en paridad con `framework_operative_enforcement/CLAUDE.md`: vibe coding tiene limite, el agente es junior rapido no oraculo, el slider de autonomia se gana, el prompt es codigo, iterar en bloques chicos verificables
- `CLAUDE.md` seccion 13 "MCP Servers — NotebookLM" (faltaba, era omision simple — contenido 100% generico)
- `CLAUDE.md` 0.4: bullet `Esc + Esc` → `/rewind` en estrategia de compactacion, subseccion "Ciclo de vida de memoria" (umbrales de dias sin actividad, ver `ONBOARDING.md`)
- `CLAUDE.md` seccion 6: bullet de referencia a `scripts/framework_status.py full`
- `FRAMEWORK.md`: "Formato del veredicto final" (plantillas NO APTO / APTO CON RIESGOS CONTROLADOS) en la seccion de revision Fase 6 — se habia perdido en la condensacion previa
- `FRAMEWORK.md` 4.9 "Tool descriptions = documentacion del LLM" — regla que tampoco sobrevivio la condensacion previa
- `ONBOARDING.md` seccion 3.5 "Git workflow para el equipo (opcional)" y seccion 10 "NotebookLM MCP" — existian en `framework_operative_enforcement/ONBOARDING.md` y nunca se habian sincronizado
- `plantillas/registry.json`: schema 1.1 → 1.2 (dict-keyed por id de proyecto, agrega bloque `metricas_agentes` con tokens/subagentes/costo interno)
- `scripts/framework_status.py`: reemplazado por la version robusta de enforcement (busqueda de registry en multiples ubicaciones, helper `get_short()`, set `INACTIVAS` mas amplio)
- `scripts/install-git-guard.sh`: v1 (single-owner) → v3 (autoriza por `operador.maquina` contra `OPERADOR_MAQUINA` o lista `INTEGRADOR_MASTER` de `OWNERS.md`, auto-contenido para clones standalone)

### Fixed
- `plantillas/PORTFOLIO.md`: referencias rotas a `agent_operating_mode.md` y `playbook_departamental.md` (archivos que no existen en el kit) → corregidas a `CLAUDE.md` y `PLAYBOOK.md`

### Changed
- `VERSION`: 1.1.0 → 1.2.0

## [1.1.0] — 2026-07-09

### Fixed — hallazgo critico de sincronizacion
- `CLAUDE.md`, `PLAYBOOK.md` y `FRAMEWORK.md` no se habian vuelto a commitear desde el commit inicial `Add files via upload` (confirmado via `git log -- <archivo>`). Quince entradas de este CHANGELOG (v0.2.0 a v1.0.4) documentaban cambios a estos 3 archivos que nunca llegaron al working tree real — el CHANGELOG avanzaba, los archivos no. `GIT_PROTOCOL.md`, `CHANGELOG.md`, `VERSION` y `LICENSE.md` si se habian sincronizado correctamente en su momento.
- Reconstruidos los 3 archivos desde la copia privada (`framework_operative_enforcement/`) sanitizada, incorporando todo lo documentado en versiones anteriores mas todo lo agregado en enforcement desde entonces.
- `PLAYBOOK.md` — ejemplo de statusline volvia a filtrar nombres de proyecto reales (regresion sobre el fix ya aplicado en v0.2.0). Reemplazado por placeholders genericos.
- `AUTHORS.md` / `LICENSE.md` — habian vuelto a filtrar nombre de empresa/departamento/branch real (regresion sobre el fix ya aplicado en v0.2.0). Sincronizados con la version limpia de enforcement.
- `FRAMEWORK.md` — referencia fantasma a `PLAN.md` en "Punto de entrada del agente" (el fix de v0.2.0 tampoco habia llegado al archivo real). Eliminada.
- `CLAUDE.md` — bug de lettering duplicado en frases de activacion (dos secciones "C"). Corregido A-I.
- `scripts/framework_status.py` — diccionario `SHORT` hardcodeado con 13 nombres de proyectos/carpetas reales (mismo fix que el changelog de v0.2.0 ya declaraba hecho y nunca aplico). Eliminado; ahora lee `short_name` del proyecto en el registry, con fallback al id truncado.
- `dashboard-kit/profiles/tech.js` y `dashboard-kit/source/config/defaults.js` — el perfil "tech" y el fallback base traian hardcodeado el nombre real de la empresa y del producto interno como default, inconsistente con los perfiles `sales.js`/`finance.js` (que si estaban genericos). Alineado al mismo patron generico.

### Fixed — segunda pasada (verificacion adversarial post-escritura)
- `dashboard_semanal.js` / `generar_imagenes.js` (raiz) — eliminados. Eran scripts sueltos, sin referencia en ninguna documentacion, con datos reales de un reporte historico (nombre de persona real, 2 codenames de proyecto reales, fecha real) y uno de los dos referenciaba un archivo HTML que ni siquiera existe en el kit. Superados por `scripts/screenshot_report.js` + `scripts/friday_report_to_html.py`, que si estan documentados.
- `dashboard-kit/source/presentation-engine.js`, `dashboard-kit/source/config/defaults.js`, `dashboard-kit/source/dashboard.template.html` — 3 defaults hardcodeados con el nombre real del producto interno (contradiciendo el propio comentario del template que dice "sin referencias especificas de organizacion"). Alineados al placeholder generico.
- `dashboard-kit/source/core/chart-kit.js` — comentario de codigo con 5 slugs de proyecto reales. Genericizado.
- `scripts/friday_dashboard.html.template` + `scripts/friday_report_to_html.py` — logo/titulo/pie de pagina del reporte ejecutivo estaban hardcodeados con marca real, nunca parametrizados por el script. Agregados placeholders `___BRAND_LOGO___`/`___BRAND_TITLE___`/`___BRAND_FOOTER___` con default generico real (antes era texto fijo sin mecanismo de configuracion).
- `dashboard_gen.py` — pie de pagina con nombre real de departamento en 2 vistas (desktop/mobile), el resto del archivo ya estaba genericizado.
- `CASO_DE_USO.md` — una linea filtraba el nombre real de departamento pese a que el resto del caso disfraza al cliente como empresa ficticia.
- `CLASE_30MIN.md` — la tabla de tokens de marca (paleta/tipografia/variables CSS) no aclaraba que son el ejemplo real del autor para adaptar, no un requisito fijo. Agregado disclaimer explicito.
- `PLAYBOOK.md` seccion 6 — "Fase 1/Fase 2" del pipeline de intake colisionaba con la numeracion canonica de Fases 0-9 de `FRAMEWORK.md` (dos definiciones distintas del mismo numero). Renombrado a "Paso 1-4" + nota aclaratoria.
- `CLAUDE.md` — referencia rota "seccion 11" (deberia decir `PLAYBOOK.md` seccion 12) al consolidar metricas de agentes el viernes.
- `CLAUDE.md` 0.5 vs 0.3.2 — la escalera de escalamiento y Modo Quirurgico daban dos respuestas distintas para el mismo disparador ("3+ archivos"). Alineados: nivel Critico ahora replica exactamente el disparador de Modo Quirurgico; nivel Significativo ya no se solapa con el.
- `CLAUDE.md` 0.3.1 vs 0.5 — construccion adversarial "sin excepcion" no dejaba lugar para el nivel Moderado de la escalera (cambios chicos y reversibles). Agregada excepcion de escala explicita.
- `PLAYBOOK.md` — la separacion "costo interno vs presentacion" no tenia mecanismo real: las metricas de agentes se anexaban al mismo reporte que lee direccion. Ahora se generan en archivo separado por diseño, no solo con una etiqueta "(uso interno)".
- `CLAUDE.md` seccion 11 — anotado que los nombres de modelo (Sonnet/Fable/Haiku) son ejemplos de la familia Claude vigente al escribir esto, no una promesa fija — evita presentar nombres de modelo como hecho inmutable.
- `PLAYBOOK.md` 5.0.1 — duplicaba casi textual la estrategia de compactacion ya definida en `CLAUDE.md` 0.4. Reemplazado por referencia cruzada.

### Added — protocolo git
- `GIT_PROTOCOL.md` FASE 6 — segundo loop de verificacion (replica master→ramas, no solo tags) + re-fetch previo al cierre.
- `GIT_PROTOCOL.md` R4 — tecnica `git show :1:/:2:/:3:` para inspeccionar conflictos antes de resolver; gate semantico explicito (sin marcadores + suite verde).
- `GIT_PROTOCOL.md` R2 — remoto de master como blanco de reset igualmente prohibido.
- `GIT_PROTOCOL.md` R5 — el porque del patron de lease (nunca decidir sobre datos obsoletos).
- `GIT_PROTOCOL.md` R8 — stash drop/clear/pop y branch -f/checkout -B agregados a la lista de operaciones que exigen materializar cambios primero.
- `GIT_PROTOCOL.md` R11 — bundles fuera de carpetas sincronizadas + verificacion explicita de integridad.
- `GIT_PROTOCOL.md` R1 — accion explicita cuando el gate de pusheado falla.
- `GIT_PROTOCOL.md` FASE 0 — comando exacto de driver de merge.
- `GIT_PROTOCOL.md` Enforcement — self-test obligatorio del hook (caso permitido + caso bloqueado) antes de confiar en el.

### Added — metodologia (sync completo desde enforcement)
- `CLAUDE.md` 0.1-0.4 — anti-complacencia, honestidad y precision, planeacion/tareas atomicas, construccion adversarial, Modo Quirurgico, optimizacion de contexto (lectura por niveles, path-scoped rules, compaction, handoff de sesion).
- `CLAUDE.md` seccion 6 — ordenamiento dinamico de proyectos (formula de prioridad + auto-escalado).
- `CLAUDE.md` seccion 7 — auditoria periodica obligatoria (15 dias).
- `FRAMEWORK.md` Fase 3.5 — Modo Quirurgico como fase formal del pipeline.
- `FRAMEWORK.md` Fase 6 — Metodologia de Revision Critica completa (10 roles adversariales, 10 preguntas por modulo, formato de reporte, severidad, pruebas curl, integridad DB).
- `FRAMEWORK.md` — Metodologia de implementacion y verificacion (10 subsecciones): verificacion dual, clasificacion de hallazgos por origen, blast radius, anti-patrones de codigo, trazabilidad de bugs.
- `FRAMEWORK.md` — Observabilidad SIEM/EDR/XDR completa (endpoints, formato ECS, tabla DB, checklist).
- `FRAMEWORK.md` — excepcion README para proyectos tecnicos, confidencialidad de proyectos, gobernanza de componentes UI compartidos, modo oscuro por defecto.
- `PLAYBOOK.md` principio 8 — referencia a Modo Quirurgico.
- `PLAYBOOK.md` 5.0.1 — gestion de sesiones (naming, compaction, higiene de contexto).

### Added — nuevo: gobernanza para direccion y administrativos
- `CLAUDE.md` seccion 0.5 — escalera de escalamiento a humano (trivial/moderado/significativo/critico), pensada para quien no programa.
- `CLAUDE.md` seccion 10 — regla de capa ejecutiva: todo entregable que pueda leer alguien no tecnico arranca con 3 lineas (que paso / que significa / que se necesita de direccion) antes del detalle.
- `PLAYBOOK.md` seccion 7 — reporte semanal con capa ejecutiva y panel de "Top riesgos del portafolio" consolidado (antes solo existia por proyecto).
- `PLAYBOOK.md` seccion 8 — presentacion mensual ejecutiva no-tecnica (timeline + panel, reglas de contenido cero-financiero, checklist), version generica.
- `PLAYBOOK.md` seccion 12 — Metricas de Agentes (tokens, sub-agentes, tasa de exito, costo estimado), explicitamente marcada como uso interno, nunca en presentacion.
- Regla explicita de separacion costo-interno vs presentacion-cero-financiero en `CLAUDE.md` y `PLAYBOOK.md`.

### Added — nuevo: uso agentico avanzado (Sonnet / Fable / orquestacion)
- `CLAUDE.md` seccion 11 — matriz de seleccion de modelo por tipo de tarea (razonamiento vs redaccion ejecutiva/creativa vs exploracion economica vs decision humana), reglas de cuando SI y cuando NO orquestar multiples agentes en paralelo (disciplina de costo), patrones reutilizables (exploracion paralela, revision adversarial independiente, pipeline vs barrera, loop-hasta-vacio), regla de no delegar el entendimiento.
- `FRAMEWORK.md` "Tooling — Claude Code" — reescrita: quito referencia obsoleta a `/ultrathink`, agrega tabla de referencia tecnica de sub-agentes/orquestacion, cross-ref a la matriz de modelos.

### Changed
- `PLAYBOOK.md` seccion 11 (antes) — lista de scripts sincronizada con lo que realmente existe en `scripts/`.
- `VERSION` — 1.0.4 → 1.1.0

## [1.0.4] — 2026-06-13

### Added
- Modo Quirurgico v2.0.0 — Planeacion de cambios criticos (CLAUDE.md 0.3.2 + 3.H, FRAMEWORK.md Fase 3.5, PLAYBOOK.md principio 8)
- `plantillas/PLAN_QUIRURGICO_TEMPLATE.md` — Template canonico para planes ultra-detallados
- Procedimiento: 3 Explore + AskUserQuestion + 1 Plan + 3 Adversarial + plan linea-por-linea
- Criterios de activacion: OV/NetSuite/DB/estados/dinero/3+ archivos

## [0.7.1] — 2026-06-11

### Added
- `CLASE_30MIN.md` — Charla framework 30min (bloques 1-8): instalacion, ciclo semanal, diseno visual, MCPs, sub-agentes, adversarial, caveman.
- `GIT_PROTOCOL.md` REGLA 7 — Protocolo de sincronizacion multi-rama sin perder mejoras (diagnostico, solapamiento, dry-run, merge ordenado, FF a ramas).

### Changed
- `.gitignore` — Patrones de snapshot/data ampliados (`**/snapshot*.json`, `**/dashboard_data*.js`).
- `CLAUDE.md` seccion 14 — Sync rule actualizada: menciona `dashboard-kit/` como capa generica portable.
- `FRAMEWORK.md` — Referencia de implementaciones UI Shell actualizada.

### Fixed
- `GIT_PROTOCOL.md` — REGLA 7 duplicada eliminada (estaba dos veces, fusionado en copia unica detallada).

## [0.7.0] — 2026-06-01

### Added
- `GIT_PROTOCOL.md` — verificacion obligatoria antes de git + REGLA 6 (sincronizacion de ramas).

### Removed
- Contenido comercial: `SAAS_PLAN.md`, `BOOTSTRAPPING.md`, `PRECIOS.md`, `CASO_DE_USO.md`, `AUDIT_PRODUCTO.md`.
- Data operativa real: `checkpoints/`, `reportes_playbook/`, `reportes_checkpoint/`, `kpi_history/`, `servers/`.
- `playbook_registry.json` poblado (ahora se genera desde `plantillas/registry.json`; añadido a `.gitignore`).

### Changed
- Sanitizacion completa: removidos nombres de personas, empresa, proyectos reales, ERP, IPs y hosts de todos los docs y scripts. Framework listo para compartir.
- Historial git reescrito desde commit limpio inicial.

## [0.6.5] — 2026-06-01

### Added
- `DECISIONES.md` — Registro central de decisiones cross-proyecto (sanitizado)
- `GLOSARIO.md` — Definiciones precisas de ~25 terminos del framework con wikilinks

### Changed
- Frontmatter YAML agregado a archivos core y plantillas en enforcement
- Frontmatter YAML propagado a `context.md` y `status.md` de proyectos activos en enforcement

## [0.6.4] — 2026-06-01

### Changed
- `playbook_registry.json` — Metrica de departamento actualizada (total proyectos, activos, pausados). Proyectos nuevos registrados con estructura estandar.

## [0.6.3] — 2026-06-01

### Changed
- `CLAUDE.md` — Sincronizada seccion Captura UHD con enforcement: script `capturar_uhd.js`, fallback Chrome headless, reglas de graficos canva.
- `CLAUDE.md` — Seccion "Presentacion estilo canva" sincronizada con enforcement. Sanitizado: paths sin `framework_operative_enforcement/`.

## [0.6.2] — 2026-05-28

### Added
- `FRAMEWORK.md` — Secciones 8, 9, 10 de "Metodologia de implementacion y verificacion":
  - Seccion 8: Analisis de dependencias — trazado de callers/callees, orden de ejecucion, verificacion de no-regresion.
  - Seccion 9: Tipos de bugs por origen — error de reemplazo, gap de checklist incompleta.
  - Seccion 10: Reglas adversariales post-fixes — 7 subreglas (capas, diff Pydantic, math.isfinite, tool descriptions, rate limiting vs idempotencia, parsers numericos, trazabilidad de bugs).
> Fuente: lecciones de ejecucion real. Sincronizado desde enforcement v0.5.4. Integracion 100% completa.

## [0.6.1] — 2026-05-28

### Removed
- `PRECIOS.md` — Eliminado. Informacion comercial interna no distribuible.

### Changed
- `README.md` — Tono interno, sin pitch comercial. Lenguaje de herramienta operativa.
- `AUTHORS.md` — Sin referencias a licenciamiento comercial.
- `LICENSE.md` — Sin lenguaje de suscripcion activa. Licencia de uso interno.

## [0.5.3] — 2026-05-28

### Added
- `FRAMEWORK.md` — Nueva seccion "Metodologia de implementacion y verificacion — REGLAS UNIVERSALES" (7 subsecciones, secciones 1-7).
  - Protocolo de verificacion dual post-implementacion (Agente A hipercontextualizado + Agente B cero contexto).
  - Clasificacion obligatoria de hallazgos por origen (gap de planeacion / error de implementacion / pre-existente).
  - Checklist de planeacion con analisis de blast radius obligatorio antes de aprobar planes.
  - 7 reglas de implementacion anti-patterns (size check, Pydantic tipado, allow-list, rate limiting, etc.).
  - Protocolo de uso de agentes especializados (hipercontextualizado vs cero contexto) con formato de reporte.
  - Clasificacion de severidad extendida (CRITICO/ALTO/MEDIO/BAJO) con criterios accionables.
  - Leccion meta: regla permanente de grep explicito de funciones que leen/escriben entidades nuevas.
> Fuente: `docs/mejora_framework.md` (Proyecto A, sesion Excel→Preorden Express 2026-05-27).

## [0.5.2] — 2026-05-27

### Added
- `AUDITORIA_PROFUNDA.md` — Metodologia de bug hunting exhaustivo para apps web. Cobertura: frontend, backend, API, DB, routing, navegacion, seguridad funcional, UX. Incluye segunda pasada con agentes sin contexto (AGENTS.md) y planeacion atomica post-auditoria (CLAUDE.md 0.3).

## [0.5.1] — 2026-05-26

### Added
- `CLAUDE.md` seccion 12 — Sistema de diseno visual: `context_desing_go/` como fuente unica de verdad para todo output visual.
- Regla mandatoria: clonar `https://github.com/joseaguilar-wq/context_desing_go.git` antes de generar dashboards, reportes, presentaciones, web, canvas.
- Tokens base obligatorios documentados en CLAUDE.md (paleta, tipografia, modo oscuro).
- `FRAMEWORK.md` referencias actualizadas: `IDENTIDAD DE MARCA/` → `context_desing_go/`.
- `scripts/check_update.py` portado desde framework_kit.
- `githooks/` portado desde framework_kit (pre-commit, pre-push).
- `.mcp.json` portado desde framework_kit (configuracion notebooklm MCP).
- `checkpoints/`, `kpi_history/`, `reportes_playbook/` en framework_kit con .gitkeep.

### Changed
- `FRAMEWORK.md` — Sistema de diseno visual: referencias unificadas a `context_desing_go/`.
- `FRAMEWORK.md` kit — Sincronizado con enforcement: UI components, dark mode, brand alignment.
- `CLAUDE.md` kit — Agregada seccion 12 Sistema de diseno visual + renumber MCP a 13.
- `CLAUDE.md` enforcement — Agregada seccion 12 Sistema de diseno visual.
- `CHANGELOG.md` enforcement — Agregada entrada 0.3.2 (githooks/auto-update) que existia en kit.

## [0.5.0] — 2026-05-25

### Added
- `FRAMEWORK.md` nueva seccion "Observabilidad y telemetria a SIEM/EDR/XDR — REGLA PERMANENTE".
- Endpoints estandar mandatorios: `/health`, `/ready`, `/metrics`, `/siem/events`, `/siem/audit`, `/version`.
- Formato ECS minimo, 4 modos de salida (pull/syslog/webhook/stdout).
- Tabla DB `siem_events` estandarizada.
- `plantillas/SIEM_INTEGRATION.md` nueva plantilla obligatoria.
- `plantillas/SECURITY.md` ampliada con checklist SIEM.
- Checklist Fase 6 actualizado con verificacion SIEM.
- Variables `.env` estandar `SIEM_*`.

### Reason
- Anti-complacencia: sin telemetria no hay deteccion.
- Compatible Elastic, Wazuh, Splunk, Graylog, Datadog, Sentinel, EDR/XDR.
- Preparacion para integracion SOC la organizacion.

## [0.4.1] — 2026-05-22

### Added
- FRAMEWORK.md seccion "Sistema de diseno visual" → subseccion "Componentes UI reciclables (la organizacion)" con tabla de componentes shell oficiales y reglas de adopcion
- Referencia explicita al `ui_shell_component.md` v1.1 (sidebar colapsable plug-and-play) como fuente unica de verdad para apps web

### Changed
- Cualquier proyecto del ecosistema GO con UI navegable debe usar el sidebar shell. NO inventar uno propio. Customizacion limitada a navItems + iconos catalog.

---

## [0.4.0] — 2026-05-18

### Added
- MCP server `framework-enforcement` en `servers/notebooklm_mcp/` con 9 tools
- `src/registry.py` — CRUD completo sobre `playbook_registry.json`
- `src/templates.py` — templates Python para Next Actions, avances diarios, cortes semanales, reportes
- `src/tools.py` — 9 tools: list_all_projects, get_project_details, update_project_field, add_new_project, get_traffic_lights, get_next_actions, record_checkpoint, run_framework_status, get_weekly_consolidation
- `src/server.py` — entrypoint FastMCP
- `.mcp.json` — configuracion para Claude Code

## [0.3.2] — 2026-05-18

### Added
- `scripts/check_update.py` — Auto-update check. Compara local HEAD con origin/master, auto-pull si hay fast-forward, advierte si diverge o tiene commits locales.
- `githooks/pre-push` — Bloquea push a master. Solo bypass con `FRAMEWORK_ADMIN=true`.
- `githooks/pre-commit` — Advierte si commiteas directamente en master.
- `CLAUDE.md` "PRIMERO CERO" — Auto-actualizacion antes de cualquier otra logica. El agente ejecuta `check_update.py` como primer paso.
- `CLAUDE.md` "PRIMERO" — Politica de ramas: NUNCA push/merge a master. Pull permitido. Ramas propias sin limite. Solo el lead actualiza master.
- `ONBOARDING.md` seccion 3 — Dos opciones de instalacion: git clone (recomendado, con auto-update) y copia manual (legacy, sin auto-update).
- `ONBOARDING.md` seccion 3.5 — Git workflow para el equipo: regla de oro, recibir updates, crear ramas, que hacer si tu cambio deberia ir a master.
- `githooks/` — Directorio de hooks versionado. Configurar con `git config core.hooksPath githooks`.

### Changed
- `VERSION` — 0.3.1 → 0.3.2
- `ONBOARDING.md` seccion 3 — Reescrita con flujo de instalacion dual (git clone + copia manual). Agregada activacion de hooks.
- `FRAMEWORK.md` — Sincronizado desde copia personal (enforcement): excepcion README para proyectos tech + Metodologia Revision Critica (10 roles, 10 preguntas por modulo).

## [0.3.1] — 2026-05-15

### Added (research de doc oficial Claude Code)
- `AGENTS.md` seccion 10 — Custom subagent files en `.claude/agents/` con frontmatter (name, description, tools, model, autoMemoryEnabled)
- `AGENTS.md` seccion 11 — Writer/Reviewer multi-sesion pattern (sesion escribe, otra revisa con contexto limpio)
- `AGENTS.md` seccion 12 — Fan-out paralelo con `claude -p` y `--allowedTools` para batch operations
- `AGENTS.md` seccion 13 — Auto memory de sub-agentes independiente del agente principal
- `AGENTS.md` anti-patrones 9 y 10 — Kitchen sink session + corregir y corregir (2 fallos = /clear)
- `CLAUDE.md` 0.4 — Path-scoped rules (`.claude/rules/` con frontmatter paths, glob patterns, symlinks)
- `CLAUDE.md` 0.4 — Compaction strategy (`/clear`, `/compact`, `/rewind`, que sobrevive y que no)
- `CLAUDE.md` 0.4 — Side questions (`/btw` para dudas que no entran en historial)
- `CLAUDE.md` 0.4 — Tamano objetivo CLAUDE.md: max 200 lineas (fuente doc oficial), poda regular
- `PLAYBOOK.md` 5.0.1 — Gestion de sesiones (naming, compaction rhythm, context hygiene, /clear obligatorio)

### Changed
- `VERSION` — 0.3.0 → 0.3.1
- `AGENTS.md` — Extendido con 4 secciones nuevas + 2 anti-patrones
- `CLAUDE.md` seccion 0.4 — Extendida con 4 subsecciones nuevas
- `PLAYBOOK.md` seccion 5 — Agregada subseccion 5.0.1 Gestion de sesiones

## [0.3.0] — 2026-05-15

### Added
- `AGENTS.md` — Protocolo de delegacion de agentes (arbol de decision, tipos, atomicidad, paralelizacion, handoff, model tiering, aislamiento de contexto, anti-patrones)
- `CLAUDE.md` seccion 0.4 — Estrategia de optimizacion de contexto (lectura por niveles L1/L2/L3, presupuesto por sesion, aislamiento via sub-agentes, Lost in the Middle, carga condicional, ciclo de vida de memoria)
- `CLAUDE.md` seccion 6 — Ordenamiento dinamico de proyectos (formula de prioridad con pesos, auto-escalado por bloqueo/zombie/estancamiento, capacidad max 3-4 activos)
- `PLAYBOOK.md` seccion 12 — Metricas de agentes (consumo de tokens, conteo de sub-agentes, tasa de exito, costo estimado, procedimiento de recoleccion)
- `FRAMEWORK.md` — Subseccion Optimizacion de Contexto + Principio 10 (delegar para aislar contexto)
- `plantillas/registry.json` — Campo `metricas_agentes` en schema de proyecto

### Changed
- `CLAUDE.md` seccion 0.3 — Agregada referencia a AGENTS.md para delegacion
- `CLAUDE.md` seccion 6 — Reescrita de lista estatica a formula dinamica con senales
- `PLAYBOOK.md` seccion 8 — Agregada subseccion Prioridad dinamica
- `PLAYBOOK.md` seccion 5.3 — Agregado paso de recoleccion de metricas de agentes
- `FRAMEWORK.md` — Agregadas referencias a AGENTS.md y CLAUDE.md 0.4
- `CLAUDE.md` (root) — Reemplazada lista estatica de prioridades con referencia a sistema dinamico
- `VERSION` — 0.2.2 → 0.3.0

## [0.2.2] — 2026-05-15

### Added
- Regla "Planeacion y Tareas Atomicas" en CLAUDE.md (seccion 0.3) y FRAMEWORK.md (Filosofia base) — regla permanente
- Modo planeacion por defecto para tareas o proyectos largos
- Tareas atomicas obligatorias para preservar consistencia entre modelos baratos/rapidos
- Memoria viva: mantener `context.md`, `status.md`, `context_proyectos.md`, `playbook_registry.json` siempre actualizados para reducir gasto de tokens
- Roles optimizan tokens: modelo elige practicas segun rol (planeador/ejecutor/revisor/auditor)
- Sprints autoverificables: bloque de N tareas atomicas cierra solo con verificacion explicita
- Orden estricto: no avanzar sin terminar anterior, salvo tareas completamente excluyentes

## [0.2.1] — 2026-05-15

### Added
- Regla "Honestidad y Precision" expandida en FRAMEWORK.md (seccion Filosofia base) y CLAUDE.md (seccion 0.2) — regla permanente
- Cubre: incertidumbre, fuentes, estadisticas, eventos recientes, personas y citas, nivel de confianza, correcciones
- Niveles de confianza obligatorios en preguntas de hecho: [Alta confianza] / [Confianza media — verifica] / [Baja confianza — verifica antes de usar]
- Regla MANDATORIA de dashboards duales en CLAUDE.md seccion 3.E y PLAYBOOK.md seccion 5.4 — siempre 4 archivos (desktop HTML+JPG, mobile HTML+JPG)
- Pipeline de captura JPG con Chrome headless 2x retina, altura medida con JS `scrollHeight`

## [0.2.0] — 2026-05-12

### Fixed
- Registry data structure: template ahora usa `proyectos` como dict, alineado con script (A1)
- Nombres de campo unificados a espanol en script y template: `clasificacion`, `proyectos` (A2)
- Template registry.json ahora es JSON valido con defaults en lugar de `{{PLACEHOLDER}}` (A3)
- ONBOARDING: eliminada referencia a `_framework_kit/` inexistente (A6)
- ONBOARDING: corregida contradiccion entre setup manual y auto-deteccion (A7)
- CLAUDE.md: eliminada seccion 3.C duplicada, renumerado C-F (B1)
- FRAMEWORK.md: eliminada referencia a PLAN.md que contradice regla minimal (B2)
- README.md: alineado umbral zombie con CLAUDE.md/PLAYBOOK.md (10d → 5+d) (B5)
- CLAUDE.md: sincronizado criterio amarillo con PLAYBOOK.md ("owner no responde 24h") (B6)
- PLAYBOOK.md: eliminadas referencias a scripts no existentes y screenshot_report.js (A4)
- PLAYBOOK.md: reemplazado ejemplo statusline con nombres genericos (C)

### Added
- Filosofia Anti-Complacencia en CLAUDE.md (seccion 0.1) y FRAMEWORK.md (Filosofia base) — regla permanente adversarial
- `.gitignore` con reglas para OS, Python, Node, y configuracion local (D2)
- `checkpoints/` directorio (A5)
- `plantillas/Next_Actions.md` — template de acciones de checkpoint
- `plantillas/AVANCES_DIARIOS.md` — template standalone de log diario
- `plantillas/MVP_BREAKDOWN.md` — template standalone de desglose MVP
- `plantillas/SECURITY.md` — template de checklist de seguridad
- `plantillas/DESIGN_SYSTEM.md` — template de sistema visual
- `plantillas/REPORTE_SEMANAL.md` — template de reporte ejecutivo
- `plantillas/CORTE_SEMANAL.md` — template LUN/MIE/VIE
- `scripts/zombie_detector.py` — deteccion automatica de proyectos zombie
- `scripts/semaforo_calculator.py` — calculo automatico de semaforos
- `scripts/validate_registry.py` — validacion de estructura del registry
- `scripts/setup.py` — wizard interactivo de onboarding
- `scripts/playbook_report.py` — stub (en desarrollo)
- `scripts/friday_report_to_html.py` — stub (en desarrollo)
- `scripts/init_project.py` — stub (en desarrollo)
- `scripts/archive_week.py` — stub (en desarrollo)
- `VERSION` — versionado semantico
- `CHANGELOG.md` — este archivo

### Changed
- `scripts/framework_status.py`: eliminado diccionario SHORT hardcodeado GO; lee `short_name` del registry (C1)
- `plantillas/registry.json`: reestructurado a `"proyectos": {dict}`, agregado campo `short_name`
- `plantillas/SEGUIMIENTO.md`: extraida seccion AVANCES DIARIOS a template standalone
- `plantillas/PROYECTO.md`: extraida seccion MVP Breakdown a template standalone
- `plantillas/PORTFOLIO.md`: eliminadas referencias a archivos fantasma
- `AUTHORS.md`, `LICENSE.md`, `CASO_DE_USO.md`: eliminado contenido GO-especifico
- `PLAYBOOK.md` seccion 11: actualizada lista de scripts a los existentes

## [0.1.0] — 2026-05-01

### Added
- Primer release del framework operativo
- CLAUDE.md, PLAYBOOK.md, FRAMEWORK.md, ONBOARDING.md
- Plantillas base: PORTFOLIO, PROYECTO, SEGUIMIENTO, registry.json
- Script framework_status.py
- README, CASO_DE_USO, LICENSE, AUTHORS, PRECIOS
