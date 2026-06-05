# FRAMEWORK.md — Framework Universal de Construccion

> Como construir proyectos: fases 0-9, seguridad, diseño, metricas.
> Gobernado por `CLAUDE.md`. Complementa a `PLAYBOOK.md`.

## Proposito

Framework universal para construir, estructurar, programar, ensamblar, documentar, evaluar, auditar, revisar y mejorar proyectos de cualquier departamento.

Aplica a proyectos:

- tecnicos
- no tecnicos
- administrativos
- comerciales
- operativos
- financieros
- RH
- marketing
- logistica
- direccion
- estrategia
- automatizacion
- IA / agentes
- dashboards
- reportes
- paginas web
- sistemas internos
- documentacion
- procesos
- integraciones

Objetivo: crear proyectos mas claros, medibles, seguros, automatizables, homogeneos y mejorables.

---

## Filosofia base

Todo proyecto debe convertirse en un sistema operativo util.

Cada proyecto debe dejar:

- estructura
- contexto
- owner
- objetivo
- evidencia
- metricas
- seguridad revisada
- diseno consistente
- documentacion viva
- backlog accionable
- revision critica
- oportunidades de automatizacion
- aprendizaje reutilizable

Nada debe depender solo de memoria humana.
Nada debe quedar como "idea suelta".
Nada debe aprobarse sin evidencia.

### Anti-Complacencia — REGLA PERMANENTE

- NUNCA ser complaciente. Jamas validar por validar.
- Siempre retar al sistema: buscar el error mas pequeño.
- Si algo "parece funcionar", asumir que tiene un bug oculto y probarlo.
- Cada revision: buscar activamente lo que falla, no confirmar lo que funciona.
- Decir "esto esta mal por X razon" vale mas que "esto se ve bien".
- Cero falsos positivos: si no encontraste bugs, revisaste mas profundo.
- Aplicar en: code reviews, QA, auditorias, revisiones de seguridad, respuestas diarias.
- El objetivo es produccion sin una sola falla. Eso requiere adversarialidad.

### Honestidad y Precision — REGLA PERMANENTE

**El agente esta comprometido con la honestidad y precision por encima de todo.**

- **Incertidumbre:** Si no esta completamente seguro de un dato, decirlo claramente. Usar "No estoy seguro, pero...", "Verifica esto...", "Puede que me equivoque, pero...". Nunca presentar algo incierto como hecho.
- **Fuentes:** No inventar citas, titulos, URLs ni referencias bibliograficas. Si no puedes nombrar fuente real y verificable, admitirlo. Mejor decir que no conoces la fuente que fabricarla.
- **Estadisticas y numeros:** Senalar cualquier cifra de la que no estes 100% seguro. Decir "Creo que es aproximadamente..." y recomendar verificacion en fuente oficial o primaria.
- **Eventos recientes:** Avisar cuando el tema puede haber cambiado desde la fecha de corte de conocimiento. No especular sobre eventos actuales ni presentar info desactualizada como vigente.
- **Personas y citas:** Nunca atribuir una cita a una persona real a menos que estes seguro de que la dijo. Si no, decir "No puedo confirmar que esta cita sea exacta".
- **Nivel de confianza:** En preguntas de hecho, incluir nota: [Alta confianza], [Confianza media — verifica] o [Baja confianza — verifica antes de usar].
- **Correcciones:** Si el usuario corrige algo, reconocerlo abiertamente y corregirse. No defender respuestas equivocadas.

**Objetivo: ser genuinamente util. Eso significa ser honesto sobre los limites del conocimiento en lugar de sonar seguro cuando no lo estas.**

### Optimizacion de Contexto — REGLA PERMANENTE

**El contexto es recurso finito. Cada token gastado en leer = token no disponible para pensar.**

Protocolo completo en `CLAUDE.md` seccion 0.4. Reglas clave:

- **Lectura por niveles:** L1 headers → L2 secciones relevantes → L3 archivo completo. L3 solo justificado.
- **Sub-agente para lecturas pesadas:** exploracion e investigacion van a sub-agente con modelo barato. Aisla contexto del agente principal.
- **Presupuesto por sesion:** planning 15K, checkpoint 20K, consolidacion 30K, diario 10K tokens.
- **Carga condicional:** solo archivos necesarios. Saltar DESIGN_SYSTEM sin UI, SECURITY sin datos.
- **Lost in the Middle:** info critica al inicio, referencias al final. No reglas operativas entre archivos de referencia.
- **Memoria viva:** actualizar status.md y avances_diarios.md al cerrar sesion. Memoria fresca = menos re-lectura.

### Planeacion y Tareas Atomicas — REGLA PERMANENTE

**Tareas o proyectos largos → modo planeacion por defecto. Siempre.**

- **Modo planeacion obligatorio:** toda tarea larga arranca con plan explicito antes de ejecutar.
- **Tareas atomicas:** descomponer en unidades atomicas. Una tarea = una accion verificable.
- **Razon:** modelos baratos o rapidos pierden hilo en tareas ambiguas. Atomicidad preserva consistencia entre modelos.
- **Memoria viva:** mantener al dia memoria de proyecto (`context.md`, `status.md`) y pool (`context_proyectos.md`, `playbook_registry.json`). Menos tokens en re-contextualizar.
- **Roles optimizan tokens:** modelo elige mejores practicas segun rol (planeador, ejecutor, revisor, auditor). Modelo barato cuando alcance, caro solo si el rol lo justifica.
- **Sprints autoverificables:** bloque de N tareas atomicas se cierra con verificacion explicita. Sin verificacion, no cierra.
- **Orden estricto:** no avanzar sin terminar la anterior. Excepcion: tareas completamente excluyentes sin dependencia.
- **Delegacion a sub-agentes:** ver `AGENTS.md`. Usar sub-agente para exploracion, investigacion y lecturas grandes. Aisla contexto del agente principal. Sub-agente explore siempre con modelo barato.

---

## Modo de comunicacion — Caveman MANDATORY

El agente opera en modo caveman SIEMPRE. Ver `CLAUDE.md` seccion 0.

Reglas:
- Hablar muy corto. 3-6 palabras por linea.
- Cero relleno. Cero cortesia. Cero explicaciones.
- Chat corto. Archivo largo.
- NO emojis. Cero. Ni en chat, ni en archivos, ni en codigo, ni en dashboards, ni en reportes, ni en commits. En ningun lado.

El chat se usa solo para confirmar accion, ruta o bloqueo.

Ejemplos de respuesta correcta:

```
Generado: FRAMEWORK.md
Actualizado: context.md
No generado. Falta acceso de escritura.
Revision creada: Review_05_05_26_Proyecto.md
```

No explicar en chat lo que ya quedo en archivo.
No pegar reportes largos en chat salvo que el usuario lo pida.
Violacion de caveman o uso de emojis = rechazo.

---

## Archivos minimos por proyecto

Regla: menos docs > mas docs. Cada archivo debe justificar su existencia. Nada de archivos que dupliquen info. Nada de `_v2`, `_old`, `_backup`.

Todo proyecto activo debe tener solo estos archivos:

```
context.md              # identidad, stack, objetivo, decisiones clave
status.md               # estado actual, semaforo, avance, bloqueos
BACKLOG.md              # tareas accionables priorizadas
RISKS.md                # riesgos vivos con mitigacion
avances_diarios.md      # log de sesiones (LUN a SAB)
MVP_BREAKDOWN.md        # desglose del MVP en entregables
```

Si tiene interfaz visual, reportes, paginas o dashboards:

```
DESIGN_SYSTEM.md
```

Si maneja datos, usuarios, accesos, integraciones o dinero:

```
SECURITY.md
```

Estructura de carpetas:

```
/proyecto/
├── context.md
├── status.md
├── BACKLOG.md
├── RISKS.md
├── avances_diarios.md
├── MVP_BREAKDOWN.md
├── DESIGN_SYSTEM.md    # solo si UI
├── SECURITY.md         # solo si datos/usuarios
├── docs/               # cortes LUN/MIE/VIE
└── reviews/            # revisiones criticas (fase 6)
```

Nada mas. Sin PLAN.md, sin NOTES, sin METRICS.md, sin AUTOMATION.md. Todo eso vive dentro de los 6 archivos base.

**Excepcion README.md — Proyectos TECH:** Todo proyecto que sea sistema de software, aplicacion, web, API, herramienta CLI, libreria, o cualquier desarrollo de TI/Sistemas/Software Engineering DEBE tener `README.md` como vista inicial del repositorio GitHub. Es la cara publica del repo. Contenido: que es, stack, inicio rapido, documentacion relevante. Sin duplicar lo que ya vive en `context.md` — solo lo esencial para quien entra por primera vez.

---

## Punto de entrada del agente

Cuando un agente entre a un proyecto, debe leer primero:

1. `CLAUDE.md` si existe
2. `context.md`
3. `status.md`
4. `avances_diarios.md` (ultima sesion para saber donde se quedo)
5. `MVP_BREAKDOWN.md` (para calcular % MVP real, no opinion)
6. `BACKLOG.md`
7. `RISKS.md`
8. `SECURITY.md` si existe
9. `DESIGN_SYSTEM.md` si hay UI, reportes, paginas o visuales

Si esta en el root del portafolio, debe leer:

1. `CLAUDE.md`
2. `PLAYBOOK.md`
3. `context_proyectos.md`
4. `playbook_registry.json`

---

## Sistema de diseno visual (opcional, configurable)

Si el departamento tiene un sistema de diseno visual (repositorio de marca, tokens, fuentes, colores), configurarlo en `context_proyectos.md`.

Todo proyecto que genere dashboards, landing pages, reportes visuales, PDFs, presentaciones, interfaces web o paneles admin debe aplicar el sistema de diseno del departamento.

### Componentes UI reciclables (la organizacion)

Para apps web del ecosistema GO, existen componentes shell plug-and-play documentados como fuente unica de verdad. Usar EXACTAMENTE como estan; cualquier desviacion debe ir como PR al componente master.

| Componente | Fuente canonica | Implementaciones |
|---|---|---|
| **UI Shell completo** (topbar + sidebar + main) | `context_desing_go/guias y manuales/markdowns/ui_shell_component.md` v1.1 | `proyecto-a`, `proyecto-b` |
| **Sidebar colapsable** | seccion 3-5 del shell doc | `proyecto-a` v1.1 (con boton plegar) |
| **Tokens GO base** | `context_desing_go/context_design.md` | Todos los proyectos visuales |

Reglas:

- Si tu proyecto tiene UI con navegacion entre vistas, usa el sidebar shell. NO inventes uno propio.
- Copia bloque CSS + JS del componente. NO modifiques las reglas core (activo, transiciones, layout).
- Customizable solo: `navItems`, iconos del catalogo, colores secundarios. Resto inmutable.
- Antes de aplicar: leer `ui_shell_component.md` secciones 2 (reglas) + 10 (permitido vs prohibido).
- Al aplicarlo: actualizar tabla seccion 11 del shell doc con tu proyecto.

Regla:

- identificar tokens visuales
- aplicar identidad consistente
- documentar que lineamientos se usaron
- no inventar estilos aislados si existe fuente visual del departamento

Si el repositorio de diseno no esta disponible, el agente debe crear una nota:

```
No se pudo validar contra el sistema de diseno. Riesgo: inconsistencia visual.
```

---

## Principios de diseno visual

Todo entregable visual debe cumplir:

- consistencia de marca
- jerarquia clara
- lectura rapida
- contraste suficiente
- responsive si es web
- lenguaje ejecutivo
- tablas limpias
- saturacion visual cero
- componentes reutilizables
- estados claros: vacio, error, carga, exito
- diseno pensado para operacion real

### Modo oscuro por defecto — REGLA PERMANENTE

**Todo proyecto nuevo del framework arranca en dark-first. Sin excepcion.**

- `:root` define tokens dark. Light mode va en `[data-mode="light"]`.
- Fondo default: `#0A0A0A`. Texto default: `#FFFFFF`.
- Light es alternativo secundario via toggle, nunca el default.
- Aplica a: web apps, dashboards, reportes HTML, paneles admin, landing pages.
- Fuente de tokens dark: `context_desing_go/context_design.md`.
- Si el proyecto es solo PDF/impresion, usar fondo `#ECEBE0` (crema GO).

**Razon: decision del usuario (2026-05-26). Dark-first protege la vista en uso operativo prolongado.**

### Alineacion a identidad de marca — REGLA PERMANENTE

**Los tokens de `context_desing_go/context_design.md` son fuente unica de verdad. No se inventan colores, fuentes ni espaciados.**

- Paleta: naranja `#FB670B`, negro `#262626`, gris `#535353`, gris claro `#C5C5C5`, crema `#ECEBE0`, blanco `#FFFFFF`.
- Tipografia: Morganite Pro (display), Blauer Nue (UI/headings), Conthic (cuerpo), JetBrains Mono (cifras).
- Si un token no existe en `context_design.md`, no se usa. Se documenta la necesidad y se consulta al usuario.
- Cualquier desviacion debe estar explicita en `DESIGN_SYSTEM.md` del proyecto con justificacion.

Todo dashboard debe tener:

- titulo claro
- fecha / corte
- owner o area
- KPI principal
- semaforo
- ultima actualizacion
- fuente de datos
- accion siguiente
- errores o alertas visibles

Todo reporte debe tener:

- resumen ejecutivo
- top hallazgos
- evidencia
- riesgos
- decisiones requeridas
- siguientes pasos
- fecha
- responsable

---

## Seguridad y ciberseguridad obligatoria

Todo proyecto debe ser revisado por seguridad cuando tenga cualquiera de estos elementos:

- usuarios
- login
- contrasenas
- tokens
- API keys
- datos personales
- datos financieros
- datos comerciales
- clientes
- proveedores
- integraciones
- bases de datos
- endpoints
- dashboards
- despliegue web
- tuneles
- servidores
- repositorios Git
- archivos subidos
- documentos sensibles
- automatizaciones que ejecutan acciones

La seguridad no es opcional.

---

## Checklist minimo de seguridad

| Area | Pregunta |
|---|---|
| Secretos | Hay claves, passwords, tokens o credenciales en archivos? |
| Auth | Hay login, roles, permisos y sesiones bien definidos? |
| Autorizacion | El backend valida permisos o solo el frontend oculta botones? |
| Datos | Que datos sensibles se guardan? |
| Exposicion | Hay endpoints publicos sin proteccion? |
| Archivos | Se validan uploads, extension, tamano y contenido? |
| Logs | Los logs exponen secretos o datos sensibles? |
| Backups | Los respaldos estan protegidos? |
| Dependencias | Hay librerias obsoletas o vulnerables? |
| Git | Se subieron secretos, bases de datos o archivos privados? |
| Red | Hay puertos abiertos, tuneles o dominios expuestos? |
| Errores | Los errores revelan informacion interna? |
| Auditoria | Se puede saber quien hizo que? |
| Recuperacion | Hay plan si algo falla? |

---

## Checklist ciberseguridad tecnica

Para proyectos tecnicos, revisar ademas:

```
- rate limiting
- brute force protection
- CSRF si aplica
- CORS
- XSS
- SQL injection
- command injection
- path traversal
- file upload abuse
- dependency audit
- secret scanning
- .env fuera de git
- cookies secure / httponly / samesite
- token expiration
- revocacion de usuarios
- backups cifrados si aplica
- principio de minimo privilegio
- separacion dev / prod
- logs sin credenciales
- validacion server-side
```

Comandos sugeridos segun stack:

```bash
grep -R "password\|token\|secret\|api_key\|apikey\|PRIVATE" .
python -m pip list --outdated
npm audit
pytest
```

Si no se pueden correr, registrar:

```
No verificado por ejecucion. Solo revision documental.
```

---

## Observabilidad y telemetria a SIEM/EDR/XDR — REGLA PERMANENTE

Todo proyecto que exponga endpoints, ejecute jobs, mueva datos o interactue con usuarios DEBE exponer un endpoint de monitoreo apto para SIEM/EDR/XDR.

Aplica a: Elastic Stack, Wazuh, Splunk, Graylog, Datadog, Sentinel, CrowdStrike, SentinelOne, OpenSearch, Loki, Prometheus + Alertmanager.

### Por que es obligatorio

- Sin telemetria, no hay deteccion. Sin deteccion, no hay respuesta.
- Auditoria interna y externa exige trazabilidad.
- Anti-complacencia: si no se mide, no se sabe que falla.
- Integracion futura con SOC del la organizacion queda lista de origen.

### Endpoints obligatorios por proyecto

| Endpoint | Metodo | Proposito |
|---|---|---|
| `/health` | GET | Liveness. Responde 200 si app viva. |
| `/ready` | GET | Readiness. 200 si DB/deps OK, 503 si no. |
| `/metrics` | GET | Formato Prometheus. KPIs tecnicos y de negocio. |
| `/siem/events` | GET | Stream JSON de eventos de seguridad y auditoria. NDJSON o Elastic Common Schema (ECS). Paginado o tail. |
| `/siem/audit` | GET | Log estructurado de acciones admin (quien hizo que cuando). |
| `/version` | GET | Version, build, git sha. |

Todos los endpoints `/siem/*` y `/metrics` DEBEN estar protegidos con token de servicio (header `X-SIEM-Token`). Nunca publicos.

### Formato de eventos — Elastic Common Schema (ECS) minimo

```json
{
  "@timestamp": "2026-05-25T10:00:00.000Z",
  "ecs.version": "8.11.0",
  "event": {
    "kind": "event",
    "category": ["authentication"],
    "type": ["start"],
    "outcome": "success",
    "action": "login"
  },
  "host": {"name": "proyecto-c-host"},
  "service": {"name": "proyecto-c", "version": "1.0.0"},
  "user": {"name": "admin"},
  "source": {"ip": "192.168.1.10"},
  "message": "admin login OK",
  "labels": {"project": "proyecto-c", "dept": "it_ia"}
}
```

ECS minimo: `@timestamp`, `event.kind`, `event.category`, `event.outcome`, `service.name`, `message`. Resto opcional.

### Categorias de eventos minimas a emitir

- `authentication` (login, logout, fallo, lockout)
- `iam` (cambios de roles, alta/baja usuarios)
- `configuration` (cambios admin)
- `web` (4xx, 5xx, rate-limit hit)
- `database` (errores, conexion caida, migracion)
- `process` (arranque, parada, crash, restart)
- `network` (timeout, retry, circuit-breaker abierto)
- `threat` (sospechoso: SQLi probe, XSS probe, bruteforce, scan)
- `file` (upload, modificacion, borrado de assets criticos)
- `email` (envio, fallo, bounce)
- `job` (cron iniciado, fallo, exit code)

### Salida — al menos uno de estos canales

1. **Pull HTTP:** SIEM hace polling a `/siem/events?since=cursor`. Default para Wazuh, Splunk, Elastic Beats.
2. **Push Syslog RFC5424:** envia a `udp://siem:514` o `tcp://siem:6514` (TLS). Default para Graylog.
3. **Push HTTPS webhook:** POST batch NDJSON a URL configurada. Default para Datadog/Sentinel.
4. **Stdout estructurado:** JSON por linea a stdout. Filebeat/Fluent Bit local lo recoge.

Minimo MVP: opcion 1 (pull) + opcion 4 (stdout estructurado).

### Reglas tecnicas

- Logging: librerias `structlog` (Python), `pino` (Node), `slog` (Go). Salida JSON siempre.
- Sin PII en claro. Hash o redact email, telefono, dni.
- Sin secretos en logs. Filtro mandatory de `password|token|secret|api_key|authorization`.
- Timestamp UTC con timezone explicito. ISO 8601.
- IDs estables: `event.id` (uuid v7), `trace.id`, `request.id`.
- Retencion local: 30 dias minimo en disco antes de purgar.
- Rate-limit: max 100 eventos/seg por proceso (evitar DoS al SIEM).
- Backpressure: si SIEM caido, bufferear en disco (cola) sin perder eventos criticos.

### Variables de entorno estandar (.env)

```
SIEM_ENABLED=true
SIEM_MODE=pull                 # pull | syslog | webhook | stdout
SIEM_TOKEN=<token-largo>       # auth de /siem/*
SIEM_WEBHOOK_URL=              # si mode=webhook
SIEM_SYSLOG_HOST=              # si mode=syslog
SIEM_SYSLOG_PORT=6514
SIEM_TLS=true
SIEM_RETENTION_DAYS=30
SIEM_RATE_LIMIT_PER_SEC=100
SIEM_PROJECT_LABEL=<nombre>
SIEM_DEPT_LABEL=<depto>
```

### Tabla obligatoria en DB

```sql
CREATE TABLE siem_events (
    id            TEXT PRIMARY KEY,               -- uuid v7
    ts            TEXT NOT NULL,                  -- ISO 8601 UTC
    kind          TEXT NOT NULL,                  -- event | alert | metric
    category      TEXT NOT NULL,                  -- authentication, web, threat...
    type          TEXT NOT NULL,
    outcome       TEXT NOT NULL,                  -- success | failure | unknown
    action        TEXT,
    service       TEXT NOT NULL,
    user_name     TEXT,
    source_ip     TEXT,
    message       TEXT NOT NULL,
    ecs_json      TEXT NOT NULL,                  -- payload ECS completo
    forwarded     INTEGER NOT NULL DEFAULT 0,
    forwarded_at  TEXT
);
CREATE INDEX idx_siem_ts ON siem_events(ts);
CREATE INDEX idx_siem_forwarded ON siem_events(forwarded);
CREATE INDEX idx_siem_category ON siem_events(category);
```

### Checklist obligatorio antes de Fase 6 (Review)

- [ ] `/health`, `/ready`, `/metrics`, `/version` responden
- [ ] `/siem/events` y `/siem/audit` exigen token y devuelven NDJSON
- [ ] Eventos en formato ECS minimo
- [ ] Tabla `siem_events` creada y poblandose
- [ ] Auth, IAM, threat, process, job emiten eventos
- [ ] Sin PII en claro, sin secretos en logs
- [ ] Rate limit configurado
- [ ] Buffer local funciona si SIEM caido
- [ ] Probe `curl -H "X-SIEM-Token: ..." /siem/events?limit=10` returns datos
- [ ] README de proyecto documenta como integrar con Wazuh/Elastic

### Plantilla incluida

Ver `plantillas/SIEM_INTEGRATION.md` y `plantillas/SECURITY.md` (seccion SIEM).

---

## Clasificacion universal de proyecto

Todo proyecto debe clasificarse antes de construir.

| Nivel | Tipo | Uso |
|---|---|---|
| 0 | Nota / documento | idea, politica, manual, propuesta |
| 1 | Proceso | flujo operativo sin software nuevo |
| 2 | Automatizacion simple | script, macro, reporte automatico |
| 3 | Automatizacion de flujo | varias reglas, varios inputs, salida repetible |
| 4 | Sistema funcional | usuarios, UI, backend, DB, roles |
| 5 | Sistema critico | dinero, clientes, produccion, ERP, seguridad |
| 6 | Sistema multi-agente | agentes, tools, memoria, orquestador |
| 7 | Plataforma | varios modulos, varios departamentos, escalamiento |

Regla:

No construir multi-agente si basta con proceso, script o automatizacion simple.
No construir sistema si el proceso todavia no esta entendido.
No automatizar caos sin mapearlo primero.

---

## Pipeline universal de creacion

Todo proyecto debe pasar por estas fases.

### Fase 0 — Intake

Archivo sugerido: `INTAKE.md` (opcional, crear solo si la fase esta activa)

Contenido:

```md
# Intake — [Proyecto]

- Departamento:
- Sponsor:
- Owner:
- Problema:
- Dolor principal:
- Usuario afectado:
- Proceso actual:
- Resultado esperado:
- Urgencia:
- Impacto estimado:
- Confidencialidad:
- Fecha:
```

Salida: `Aprobado para analisis / En espera / Rechazado / Confidencial`

---

### Fase 0.5 — Descubrimiento delegado (opcional)

Objetivo: asignar a un contributor la tarea de documentar como opera hoy el proceso antes de disenar la solucion.

Aplica cuando:
- El lider no tiene visibilidad directa del proceso
- El proceso lo ejecuta otra persona o area
- Se necesita documentar el AS-IS antes de disenar el TO-BE

Salida: documento de discovery con el proceso actual documentado (pasos, sistemas, datos, dolor).

---

### Fase 1 — Descubrimiento

Objetivo: entender como funciona hoy.

Archivo sugerido: `DISCOVERY.md` (opcional, crear solo si la fase esta activa)

Preguntas:

```md
- Quien ejecuta el proceso?
- Que pasos sigue?
- Que documentos usa?
- Que sistemas toca?
- Que datos necesita?
- Que errores ocurren?
- Que excepciones existen?
- Cuanto tarda?
- Donde se pierde tiempo?
- Donde se pierde dinero?
- Que depende de una persona?
- Que se hace por WhatsApp, Excel o memoria?
```

---

### Fase 2 — Clasificacion de solucion

Archivo sugerido: `SOLUTION_CLASSIFICATION.md` (opcional, crear solo si la fase esta activa)

Formato:

```md
# Clasificacion de solucion

- Tipo recomendado:
- Por que:
- Que se descarta:
- Riesgo de hacerlo mas simple:
- Riesgo de hacerlo mas complejo:
- Nivel de automatizacion:
- Nivel de seguridad requerido:
- Nivel visual requerido:
```

---

### Fase 3 — Diseno operativo

Archivo sugerido: `OPERATING_DESIGN.md` (opcional, crear solo si la fase esta activa)

Debe definir:

```md
- usuarios
- roles
- flujo futuro
- entradas
- salidas
- validaciones
- excepciones
- responsables
- evidencia
- auditoria
- metricas
- soporte
```

---

### Fase 4 — Diseno tecnico

Archivo sugerido: `TECHNICAL_DESIGN.md` (opcional, crear solo si la fase esta activa)

Debe definir:

```md
- stack
- arquitectura
- componentes
- integraciones
- base de datos
- seguridad
- despliegue
- monitoreo
- plan de pruebas
```

---

### Fase 5 — Build (construccion)

Objetivo: construir lo definido en fases 3 y 4.

Reglas:

- construir en sprints cortos
- cada sprint debe producir algo funcional
- evidencia obligatoria por sprint
- tests desde el inicio
- documentacion viva
- cada sesion de trabajo se registra en `avances_diarios.md`

---

### Fase 6 — Revision critica

Objetivo: revision independiente antes de exponer a usuarios reales.

Checklist:

```md
- Seguridad revisada?
- Tests pasan?
- Documentacion actualizada?
- Backlog priorizado?
- Riesgos identificados?
- Owner confirmado?
- Sponsor validado?
- Diseno revisado?
```

### Metodologia de Revision Critica — REGLAS UNIVERSALES

> Fuente: `CLAUDE_REVIEW_BRUTAL_TECH.md` (Proyecto A). Aplicable a todo proyecto TECH en Fase 6.

#### Mentalidad obligatoria del revisor

- No asumir que el sistema funciona porque los tests pasan.
- No felicitar el proyecto antes de haberlo intentado romper.
- No decir "parece correcto" si no se verifico el flujo completo.
- No revisar solo happy paths.
- No ignorar inconsistencias pequenas: en produccion se vuelven errores grandes.
- No tratar la documentacion como verdad absoluta: comprobarla contra codigo, DB, endpoints, permisos y comportamiento real.
- Objetivo: encontrar bugs reales antes que los usuarios. No ser amable.

#### Roles que debe adoptar el revisor

1. QA senior adversarial
2. Ingeniero de produccion
3. Auditor de permisos y seguridad
4. Usuario sin paciencia
5. Usuario que no lee instrucciones
6. Operador que sube archivos incorrectos
7. Usuario que intenta acciones antes de tiempo
8. Admin que espera trazabilidad
9. Desarrollador que busca bugs de borde
10. Cliente final que solo ve fallas, no excusas

#### Las 10 preguntas por cada modulo

1. Que pasa si el usuario hace lo correcto?
2. Que pasa si el usuario hace algo incompleto?
3. Que pasa si el usuario hace algo incorrecto?
4. Que pasa si el usuario repite la accion?
5. Que pasa si dos usuarios lo hacen al mismo tiempo?
6. Que pasa si el archivo, dato o estado no coincide con lo esperado?
7. Que pasa si el backend falla a la mitad?
8. Que pasa si servicios externos (API, LLM, DB, tunnel) fallan?
9. Que error ve el usuario?
10. El sistema se recupera o queda corrupto?

#### Prohibido en una revision

Frases prohibidas: "El sistema parece robusto", "Todo esta bien implementado", "Los tests cubren el flujo", "No veo problemas importantes", "Esta listo para produccion".

Solo se pueden decir si se probo explicitamente: permisos por rol, estados invalidos, doble submit, datos incorrectos, sesion expirada, falla de red, error de servicios externos, DB bloqueada, datos nulos, datos mal formateados, flujo completo end-to-end, mensajes de error visibles, auditoria y trazabilidad.

#### Formato obligatorio de salida

```md
# Revision critica — [Proyecto]

## Veredicto ejecutivo
- Estado: APTO / APTO CON RIESGOS / NO APTO
- Riesgo principal:
- Que romperia primero un usuario real:
- Que arreglar antes de produccion:

## Hallazgos criticos
| Severidad | Area | Bug/Riesgo | Como reproducir | Impacto | Fix |

## Hallazgos altos
| Severidad | Area | Bug/Riesgo | Como reproducir | Impacto | Fix |

## Hallazgos medios
| Severidad | Area | Bug/Riesgo | Como reproducir | Impacto | Fix |

## Hallazgos bajos
| Severidad | Area | Bug/Riesgo | Como reproducir | Impacto | Fix |

## Pruebas intentadas
| Prueba | Resultado | Evidencia |

## Pruebas faltantes
| Prueba | Por que importa | Como correrla |

## Checklist "a prueba de idiotas"
| Escenario | Pasa? | Evidencia |

## Recomendacion final
Decision clara y sin suavizar.
```

#### Criterios de severidad

- **CRITICO:** Perdida de dinero, corrupcion de datos, facturacion incorrecta, acceso indebido, envio incorrecto a ERP, bloqueo operativo.
- **ALTO:** Usuario real lo topa rapido y frena operacion diaria.
- **MEDIO:** Bug molesto, confuso o que requiere workaround.
- **BAJO:** Mejora de UX, claridad, logs, validacion o documentacion.

#### Checklist universal "a prueba de idiotas"

Para cada funcionalidad, evaluar como si el usuario:
- No sabe que hace el sistema
- No sabe que archivo o dato usar
- Usa el archivo o dato equivocado
- Repite la misma accion (doble click, doble submit)
- Escribe mal datos
- Pide mas de lo disponible
- Tiene internet inestable
- Deja la sesion abierta todo el dia
- Usa dispositivo movil
- Se equivoca de entidad (cliente, producto, etc.)
- Quiere cancelar algo ya completado
- Quiere confirmar algo que aun no cumple requisitos
- No lee mensajes largos
- Reporta "no sirve" sin dar detalles

Para cada caso responder: Lo bloquea? Lo guia? Explica el problema? Evita corrupcion? El admin puede auditar que paso?

#### Pruebas minimas obligatorias antes de aprobar Fase 6

```bash
# Tests del proyecto
pytest tests/ -v

# Health check del servidor
curl -i http://localhost:<PUERTO>/health

# Si usa LLM local: verificar que responde
curl http://localhost:<LLM_PORT>/api/tags
```

Ademas, exigir pruebas manuales con navegador para cada rol del sistema y pruebas manuales de: flujo correcto, flujo incorrecto, permisos bloqueados, sesion expirada, doble click/doble submit.

#### Pruebas adversariales con curl

Probar endpoints directamente. No confiar en que el frontend bloquea acciones. Ejemplos genericos:

```bash
# Sin auth debe fallar
curl -i http://localhost:<PUERTO>/<ruta-protegida>

# Rol sin permiso debe fallar
curl -i -X POST http://localhost:<PUERTO>/<endpoint-restringido> \
  -H "Cookie: <session_cookie>=<token_rol_sin_permiso>"

# Accion sobre entidad inexistente
curl -i -X POST http://localhost:<PUERTO>/<endpoint>/99999
```

#### Verificacion de integridad DB

Ejecutar queries de integridad. Si cualquiera devuelve filas, el sistema NO esta bien:

- Entidades en estado X sin registro relacionado en tabla Y
- Entidades huerfanas (FK rota)
- Entidades completadas sin dato obligatorio (peso, ID externo, etc.)
- Registros duplicados donde deberian ser unicos
- Entidades en estado final sin trazabilidad del paso anterior

#### Formato del veredicto final

NO APTO:
```
NO APTO para produccion todavia.
Razon: aunque los tests pasan, encontre N rutas donde un usuario real puede romper el flujo en menos de 5 minutos:
1. ...
Antes de seguir operando, arreglar en este orden: 1. ... 2. ... 3. ...
```

APTO CON RIESGOS:
```
APTO CON RIESGOS CONTROLADOS.
No encontre corrupcion de datos ni bypass de permisos en las pruebas realizadas, pero faltan pruebas manuales de navegador con usuarios reales y simulacion de falla de servicios externos.
```

#### Instruccion final para el revisor

El trabajo NO es confirmar que el sistema esta bien. Es proteger la operacion.

Ser esceptico, especifico y accionable. Cada bug debe venir con: archivo probable, endpoint/funcion probable, como reproducir, impacto real, fix sugerido, test que debe agregarse.

Si no se puede comprobar algo, decir: "No puedo afirmar que esto este bien porque no vi evidencia de prueba en X." Esa frase es mejor que una falsa seguridad.

---

### Metodologia de implementacion y verificacion — REGLAS UNIVERSALES

> Fuente: `docs/mejora_framework.md` (Proyecto A, sesion Excel→Preorden Express 2026-05-27). Refina el proceso de build+review con lecciones de ejecucion real.

#### 1. Protocolo de verificacion dual post-implementacion

Toda implementacion no trivial (nueva feature, estado nuevo, nuevo endpoint) requiere DOS agentes en paralelo antes de declarar completo:

**Agente A — Hipercontextualizado:**
- Lee el plan completo
- Verifica item por item que el codigo coincide exactamente con lo planeado
- Busca lo que el plan dijo y el codigo no hizo
- Reporta SOLO discrepancias y omisiones

**Agente B — Cero contexto:**
- No lee el plan, no lee el historial de conversacion
- Lee solo el codigo nuevo como si fuera codigo de un extraño
- Audita: seguridad, edge cases, consistencia con patrones existentes, bugs logicos
- Reporta SOLO hallazgos negativos

**Regla:** Ambos agentes corren en paralelo. El resultado se consolida clasificando cada hallazgo por origen antes de hacer cualquier fix. No actuar con el resultado de un solo agente.

#### 2. Clasificacion obligatoria de hallazgos por origen

Antes de corregir, cada hallazgo debe clasificarse:

| Origen | Definicion | Accion |
|--------|-----------|--------|
| **Gap de planeacion** | El plan no lo cubrio / lista incompleta / blast radius parcial | Corregir el proceso de planificacion + el codigo |
| **Error de implementacion** | El plan era correcto pero el codigo no lo siguio o introdujo algo nuevo | Corregir solo el codigo |
| **Pre-existente** | Existia antes de esta sesion | Documentar en BACKLOG, no bloquear el PR |

Si solo se corrige el codigo sin corregir el proceso, el mismo gap de planeacion se repite en la siguiente feature.

#### 3. Checklist de planeacion — antes de aprobar cualquier plan

##### 3.1 Para features con nuevo estado en una maquina de estados

Antes de declarar la lista de archivos a tocar, ejecutar (o buscar con grep):

```
grep -rn "def.*entidad\|estado.*in\|estado==" <archivos_db> | listar todas las funciones
```

Para cada funcion que escribe en la entidad:
- [ ] Bloquea el nuevo estado si corresponde?
- [ ] Llama a `_update_estado` o funcion similar que pueda degradar el estado?
- [ ] El estado nuevo esta en la exclusion de esa funcion?

**Regla:** Toda feature que agrega un estado nuevo a una entidad debe incluir en el plan un grep explicito de TODAS las funciones que leen o escriben esa entidad, clasificando cada una como "necesita cambio / no necesita / puede corromper si no se actualiza".

##### 3.2 Para nuevos endpoints

Checklist minimo por endpoint:
- [ ] Rate limiting (comparar con patron de endpoints similares)
- [ ] Validacion tipada (Pydantic con validators, no `list[dict]` raw)
- [ ] Size check ANTES de leer en memoria (no despues)
- [ ] Allow-list para valores que se insertan en URLs o queries
- [ ] Manejo diferenciado de `ValueError` (400) vs `PermissionError` (403)

##### 3.3 Para nuevas variables de estado en UI

Para cada variable JS que controla visibilidad de botones (`canConfirm`, `showConfirm`, `canEdit`, etc.):
- [ ] El plan listo TODAS las variables que necesitan cambio?
- [ ] Hay botones que deben ocultarse/mostrarse para el nuevo estado que el plan no menciono?
- [ ] El nuevo estado es visualmente distinguible y el usuario entiende que puede hacer?

##### 3.4 Blast radius — analisis completo

El plan debe responder explicitamente:
1. Que funciones existentes pueden CORROMPER el nuevo estado si no se actualizan?
2. Que vistas/formularios existentes muestran datos incoherentes para el nuevo estado?
3. Que patrones de seguridad aplican a los nuevos endpoints y estan presentes en todos?

#### 4. Reglas de implementacion (anti-patterns)

##### 4.1 No agregar extensiones sin verificar soporte de libreria

Si el plan dice "acepta .xlsx", no agregar .xls por iniciativa sin verificar que la libreria lo soporta.

##### 4.2 Size check antes de leer en memoria

```python
# MAL
data = await file.read()
if len(data) > MAX_BYTES: raise ...

# BIEN
data = await file.read(MAX_BYTES + 1)
if len(data) > MAX_BYTES: raise ...
```

##### 4.3 Modelos Pydantic tipados, no `list[dict]`

Cada endpoint que acepta arrays de objetos debe tener un modelo Pydantic con validators, no `list[dict]`. Consultar los modelos existentes como referencia de patron.

##### 4.4 Allow-list para valores de config que se usan en URLs

```python
# MAL
item_type = _cfg("ns.new_item.item_type") or "inventoryItem"
_request("POST", f"/{item_type}", ...)

# BIEN
VALID_ITEM_TYPES = {"inventoryItem", "nonInventoryResaleItem", "nonInventorySaleItem"}
item_type = _cfg("ns.new_item.item_type") or "inventoryItem"
if item_type not in VALID_ITEM_TYPES:
    raise ValueError(f"item_type invalido: {item_type}")
```

##### 4.5 Filtrar valores cero/negativos en parsers

```python
# MAL
if kg is None or pzas is None: continue

# BIEN
if not kg or not pzas or kg <= 0 or pzas <= 0: continue
```

##### 4.6 Rate limiting por consistencia de patron

Cuando se agrega un endpoint que escribe en DB o hace operaciones costosas, buscar el endpoint mas similar existente y replicar su rate limiting.

##### 4.7 Estado nuevo → excluirlo explicitamente en `_update_estado`

Cualquier funcion generica de transicion de estado debe recibir el estado nuevo en su lista de exclusion. Patron:

```sql
-- Agregar 'nuevo_estado' a TODAS las exclusiones
AND estado NOT IN ('facturada','cancelada','parcialmente_facturada','nuevo_estado')
```

#### 5. Protocolo de uso de agentes especializados

##### Cuando usar agente hipercontextualizado
- Verificar cobertura de un plan aprobado
- Detectar items del plan que no se implementaron
- Cruzar documentacion con codigo

##### Cuando usar agente cero contexto
- Auditoria de seguridad de codigo nuevo
- Detectar bugs que el autor no ve por proximidad
- Verificar que el codigo es comprensible sin contexto previo (si no lo entiende el agente, no lo entendera un dev nuevo)

##### Formato de reporte obligatorio

```
[CRITICO|ALTO|MEDIO|BAJO] archivo:linea — descripcion concisa
```

Seguido de tabla:

```
| Plan dice | Codigo hace | Estado |
```

##### Regla de consolidacion

Correr ambos agentes en paralelo y consolidar antes de actuar. Nunca actuar con el resultado de un solo agente.

#### 6. Reglas de clasificacion de severidad

| Nivel | Criterio |
|-------|---------|
| **CRITICO** | Corrompe datos silenciosamente, DoS, o viola invariante de negocio core |
| **ALTO** | Bug funcional visible, vector de seguridad, UX que genera operaciones incorrectas |
| **MEDIO** | Edge case no manejado, inconsistencia de patron, UX confusa sin consecuencias de datos |
| **BAJO** | Semantica HTTP incorrecta, naming, codigo muerto |

Regla: los CRITICOS y ALTOS bloquean merge. Los MEDIOS y BAJOS van a BACKLOG si no hay tiempo.

#### 7. Leccion meta

El plan aprobado suele ser 80% correcto. Los gaps no son errores conceptuales sino omisiones de cobertura:
- La maquina de estados puede ser correcta
- El flujo puede ser correcto
- Los archivos identificados pueden ser correctos

Lo que falta es el paso: "dado el nuevo estado/codigo/feature, que funciones existentes NO en la lista necesitan saber de el/ella?"

**Regla permanente:** Toda feature que agrega un estado nuevo a una entidad debe incluir en el plan un grep explicito de todas las funciones que leen o escriben esa entidad, clasificando cada una como "necesita cambio / no necesita / puede corromper si no se actualiza".

#### 8. Analisis de dependencias — obligatorio antes de tocar codigo

##### 8.1 Trazado completo de callers y callees

Antes de modificar cualquier linea, responder:

1. **Quien llama a esta funcion?** — lista exhaustiva de callers directos e indirectos
2. **Que llama esta funcion?** — funciones que se ejecutan despues dentro del mismo flujo
3. **Quien lee el estado/dato que voy a cambiar?** — funciones que dependen del valor actual
4. **Que pasa si el valor viejo ya no se produce?** — impacto en condiciones, filtros, branches

```
Ejemplo — funcion C():
  Callers: caller_1 → REST + LLM, caller_2 → REST
  Callees: nueva_funcion (nuevo), update_estado (eliminado)
  Lectores del estado: check_y_marcar (require estado A/B),
                       confirmar (require estado C/D),
                       get_entidades (incluye estado E),
                       auto_procesar (incluye estado E)
  Impacto: flujo normal nunca llega a estado C → confirmacion rota
```

##### 8.2 Orden de ejecucion por dependencias

Los cambios no son independientes. Regla:

```
1. PRIMERO — protecciones (exclusiones, guards, validaciones)
2. DESPUES — restauraciones (llamadas que dependen de las protecciones)
3. FINAL — nuevos comportamientos
```

Si A debe proteger antes de que B llame, A va primero. Si B y C no comparten dependencia, pueden ir en paralelo.

##### 8.3 Verificacion de no-regresion por cambio

Para cada fix, verificar que el comportamiento POSTERIOR al fix es identico al comportamiento ANTERIOR a la feature para los flujos no afectados.

```
Checklist:
- [ ] Un flujo normal (sin el nuevo parametro/estado) se comporta exactamente igual que antes?
- [ ] Los filtros de dashboard/produccion muestran los mismos resultados?
- [ ] Las transiciones de estado automaticas siguen funcionando?
```

#### 9. Tipos de bugs por origen — lecciones de ejecucion real

##### 9.1 Error de implementacion tipo "reemplazo"

Cuando se reemplaza una llamada a funcion generica por una especifica, verificar que la generica sigue siendo necesaria para OTROS casos.

**Ejemplo:** `update_estado()` → `marcar_nuevo_estado()`. La nueva solo cubre el nuevo estado. La vieja cubria TODAS las transiciones. El fix: llamar AMBAS, no reemplazar.

**Regla:** Si una funcion F() se reemplaza por G(), verificar que G() cubre el 100% de los casos que cubria F(). Si no, llamar ambas con guards apropiados.

##### 9.2 Gap de plan tipo "checklist incompleta"

El plan puede listar correctamente las funciones obvias a modificar. Pero el paso de "grep TODAS las funciones de escritura y verificar una por una" es obligatorio.

**Regla:** El plan debe incluir el output literal del grep como anexo. No basta con "pensar en las funciones obvias".

#### 10. Reglas adversariales — ejecucion real post-fixes

##### 10.1 Nuevo estado confirmable → grep TODAS las capas

Cuando se agrega un estado que es confirmable, verificar CADA capa del stack:

```
[ ] endpoint REST — acepta el estado
[ ] tool LLM — acepta el estado
[ ] agente que ejecuta la accion — acepta el estado ← CAPA FACIL DE OLVIDAR
```

**Leccion:** Server y agent_tools son "guardias de la puerta". El agente que ejecuta es "el que camina". Los 3 deben aceptar el estado. El plan puede listar server.py y agent_tools.py pero omitir el agente ejecutor.

##### 10.2 Modelos Pydantic nuevos → diff contra el modelo mas similar

Cada modelo nuevo debe compararse campo por campo contra el modelo existente mas parecido:

```
ModeloNuevo (nuevo)         vs    ModeloExistente (referencia)
─────────────────────────────────────────────────────────
campo1: tipo                     campo1: tipo + validator() ← COPIAR
campo2: tipo + validator()       campo2: tipo
                                 ← COPIAR _clean_user_text si existe
```

**Leccion:** Al crear modelos nuevos, copiar TODOS los validators y sanitizers del modelo de referencia. No solo los obvios.

##### 10.3 Validadores numericos → `math.isfinite()` obligatorio

```python
# MAL — inf y nan pasan
if v <= 0:
    raise ValueError("debe ser positivo")

# BIEN
if not math.isfinite(v) or v <= 0:
    raise ValueError("debe ser un numero finito positivo")
```

`float('inf') <= 0` = False. `float('nan') <= 0` = False. Ambos pasan cualquier validador que solo use `<=` o `>=`.

##### 10.4 Tool descriptions = documentacion del LLM

Las descripciones de tools son LO UNICO que el LLM lee para saber como usar una herramienta. Si la descripcion dice "solo funciona en estado X" pero el codigo acepta Y, el LLM NUNCA usara Y.

**Regla:** Cuando se modifica la logica de una tool, verificar que su `"description"` refleje el cambio.

##### 10.5 Rate limiting != idempotencia

Rate limiting previene abuso por volumen. Idempotencia previene duplicados por doble click. Son defensas complementarias, no redundantes.

**Regla:** El checklist de nuevos endpoints (3.2) debe incluir EXPLICITAMENTE ambos items separados:
- [ ] Rate limiting
- [ ] Idempotencia (check_idem o equivalente)

##### 10.6 Parsers numericos → conocer el locale del usuario

Mexico y varios paises usan coma decimal (`,`) y punto como separador de miles (`.`). El parser `re.sub(r"[,\s]", "", "24,95")` produce `2495` — error 100x.

```python
# MAL — asume formato americano
s = re.sub(r"[,\s]", "", str(v).strip())  # "24,95" -> "2495"

# BIEN — normaliza coma->punto primero, luego limpia
s = str(v).strip().replace(",", ".").replace(" ", "")
```

##### 10.7 Trazabilidad de bugs — formato obligatorio

Cada bug encontrado debe trazarse a su origen:

```
Bug: descripcion
Archivo:linea
Commit origen: <hash> — <mensaje>
Clasificacion: gap de plan | error de implementacion | pre-existente
Nuestros fixes lo causaron?: si | no | amplificaron
Por que no se detecto antes?: razon especifica
```

Esto permite distinguir bugs que YA existian (pre-existentes) de bugs que NOSOTROS introdujimos al hacer fixes. Sin esta trazabilidad, cada ronda de fixes es a ciegas.

---

### Fase 7 — Pilot

Objetivo: validar con usuarios reales.

Requisitos:

- entornos separados (dev/prod)
- usuarios piloto definidos
- canal de feedback activo
- rollback plan si falla
- metricas de adopcion

---

### Fase 8 — Produccion

Objetivo: operacion estable y monitoreada.

Requisitos:

- deployment automatizado
- backups programados
- monitoreo activo
- on-call definido
- documentacion de operacion
- plan de recuperacion

---

### Fase 9 — Mejora continua

Objetivo: iterar basado en datos reales.

Ciclo:

1. medir
2. detectar friccion
3. priorizar mejora
4. implementar
5. validar
6. repetir

---

## Regla de cierre de fase — MANDATORY, todos los proyectos

Al completar CUALQUIER fase (0-9) en CUALQUIER proyecto, actualizar estos 4 archivos antes de marcar la fase como terminada:

1. **BACKLOG.md** — Marcar items de la fase [x], actualizar header de fase actual
2. **status.md** — Actualizar fase actual, estado, salud
3. **context.md** — Actualizar tabla de fases
4. **CHANGELOG.md** — Registrar que se agrego/actualizo/elimino

Sin excepciones. La fase NO esta completa hasta que estos 4 archivos esten actualizados.
Aplica a cada proyecto del portafolio.

---

## Confidencialidad de proyectos

Proyectos marcados como `Confidencial` tienen reglas operativas estrictas:

- NUNCA mencionar en reportes semanales LUN/MIE/VIE
- NUNCA incluir en metricas del portafolio
- NUNCA incluir en `context_proyectos.md`
- NUNCA incluir en dashboards, resumenes ni sweeps diarios
- NUNCA nombrar frente al equipo
- Si el agente genera cualquier reporte de portafolio, el proyecto confidencial NO existe

Tratar como si no estuviera en el portafolio. Solo visible para lider y CEO.

---

## Principios de construccion

1. **Primero funciona, luego escala.** MVP funcional antes que arquitectura perfecta.
2. **Un owner, un proyecto.** Sin duenos compartidos.
3. **Evidencia semanal.** Sin evidencia no hay avance.
4. **Seguridad desde fase 0.** No al final.
5. **Reutilizar antes que construir.** Patrones, codigo, plantillas.
6. **Documentar mientras se construye.** No despues.
7. **Backlog vivo.** Siempre priorizado, siempre accionable.
8. **Clasificar antes de construir.** No todo necesita ser un sistema.
9. **Backlog vivo.** Siempre priorizado, siempre accionable.
10. **Delegar para aislar contexto.** Exploracion e investigacion van a sub-agente con modelo barato. El agente principal conserva contexto para decision y construccion.

---

## Metricas estandar por proyecto

| Metrica | Que mide | Fuente |
|---|---|---|
| % MVP | % de entregables completados del MVP | `MVP_BREAKDOWN.md` (formula: completados/totales * 100) |
| # Flujos implementados | Funcionalidades terminadas | `avances_diarios.md` |
| # Flujos testeados | Funcionalidades con tests pasando | `avances_diarios.md` |
| Bloqueo principal | Que impide avanzar (con tipo: tecnico/sponsor/datos) | `avances_diarios.md` |
| Semaforo | Verde/Amarillo/Rojo (calculado, no autodeclarado) | Criterios en `PLAYBOOK.md` seccion 8 |
| Evidencia principal | Prueba concreta del avance (commit, PR, endpoint) | `avances_diarios.md` |
| Owner | Responsable directo | `context.md` |
| Fase actual | 0-9 del framework | `status.md` |
| Dias sin actividad | Dias desde ultima entrada en `avances_diarios.md` | Calculado automaticamente |
| Delta % MVP semanal | Cambio en % MVP esta semana vs anterior | `playbook_registry.json` historial |

---

## Tooling — Claude Code

El framework corre sobre Claude Code como motor de ejecucion.

### Requisitos

- Claude Code instalado (`npm install -g @anthropic-ai/claude-code`)
- API key de Anthropic configurada

### Setup

```bash
cd /ruta/a/tu/portafolio
claude
```

CLAUDE.md se carga automaticamente al abrir Claude Code en la carpeta del portafolio.

### Uso diario vs. revision critica

| Momento | Que hacer |
|---|---|
| Uso diario (planning, checkpoints, logs) | `claude` — modelo estandar |
| Auditorias, revision de seguridad, Fase 6 | `/ultrathink` al inicio de sesion para razonamiento profundo |

### Registro de adopcion

Cuando un equipo adopte el framework: anotar en `context.md` del portafolio la linea `LLM: Claude Code (Anthropic)`.
