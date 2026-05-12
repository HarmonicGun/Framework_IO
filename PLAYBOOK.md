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
- `scripts/playbook_report.py` — escanea repos git, genera borrador LUN/MIE/VIE
- `scripts/friday_report_to_html.py` — convierte reporte markdown a dashboard HTML
- `scripts/screenshot_report.js` — captura dashboard HTML a JPG

### Status line persistente

Para mostrar el estado del pool en la barra de estado del CLI:

1. Copia `scripts/framework_status.py` a `scripts/` de tu portafolio
2. Ejecuta en Claude Code: `/statusline`
3. Selecciona "Command" y escribe: `python3 scripts/framework_status.py`

Esto muestra en tiempo real: `(4v 2a 0r) Market Verde 100% | Rafias Verde 100% | Sacos Verde 98%! | Multi Amarillo 90%`

### Flujo del viernes automatizado

```bash
python3 scripts/playbook_report.py --mode friday
# → llenar borrador markdown con datos reales
python3 scripts/friday_report_to_html.py --input reportes/YYYY-MM-DD_friday.md
# → genera dashboard HTML
node scripts/screenshot_report.js --input reportes/YYYY-MM-DD_friday.html
# → genera JPG desktop + mobile
```

### Registry auto-actualizable

Cada viernes, el agente actualiza `playbook_registry.json`:
- Agrega entrada en `historial_kpi[]` por proyecto
- Agrega entrada en `metricas_departamento.historial_semanal[]`
- Actualiza `dias_sin_actividad` y `ultima_entrada_diario`
- Actualiza contador de zombies
