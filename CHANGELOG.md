# Changelog

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
- `FRAMEWORK.md` referencias de diseno actualizadas a `context_desing_go/`.
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
