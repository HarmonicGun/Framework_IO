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

Nada mas. Sin README, sin PLAN.md, sin NOTES, sin METRICS.md, sin AUTOMATION.md. Todo eso vive dentro de los 6 archivos base.

---

## Punto de entrada del agente

Cuando un agente entre a un proyecto, debe leer primero:

1. `CLAUDE.md` si existe
2. `context.md`
3. `status.md`
4. `avances_diarios.md` (ultima sesion para saber donde se quedo)
5. `MVP_BREAKDOWN.md` (para calcular % MVP real, no opinion)
6. `PLAN.md` o `BACKLOG.md`
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

Archivo sugerido: `INTAKE.md`

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

Archivo sugerido: `DISCOVERY.md`

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

Archivo sugerido: `SOLUTION_CLASSIFICATION.md`

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

Archivo sugerido: `OPERATING_DESIGN.md`

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

Archivo sugerido: `TECHNICAL_DESIGN.md`

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

## Principios de construccion

1. **Primero funciona, luego escala.** MVP funcional antes que arquitectura perfecta.
2. **Un owner, un proyecto.** Sin duenos compartidos.
3. **Evidencia semanal.** Sin evidencia no hay avance.
4. **Seguridad desde fase 0.** No al final.
5. **Reutilizar antes que construir.** Patrones, codigo, plantillas.
6. **Documentar mientras se construye.** No despues.
7. **Backlog vivo.** Siempre priorizado, siempre accionable.
8. **Clasificar antes de construir.** No todo necesita ser un sistema.

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
