# PLAYBOOK — Sistema Operativo del Departamento

> Como operar el departamento: roles, cadencia, metricas, pipeline y automatizacion.
> Gobernado por `CLAUDE.md`. Complementado por `FRAMEWORK.md`.
> Version: 1.2

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
8. **Planeacion quirurgica para cambios criticos.** Antes de tocar dinero, estados de negocio, base de datos o 3+ archivos: exploracion paralela + clarificacion + plan + revision adversarial + plan linea-por-linea. Cero bugs escapados. Ver `CLAUDE.md` seccion 0.3.2 y `FRAMEWORK.md` Fase 3.5.

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

**Direccion / administrativos:** no operan el framework directamente, pero consumen sus salidas (reporte semanal, presentacion mensual, escalamientos de seccion 0.5 de `CLAUDE.md`). Pueden exigir Modo Quirurgico antes de aprobar cualquier cambio sensible con solo pedirlo.

---

## 5. Ciclo semanal

### 5.0 Log diario — Todos los dias activos

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
- Nombrar la sesion al iniciar con algo descriptivo: `proyecto-b-fase6-auth`, `proyecto-a-bugfix-erp`.
- Tratar cada sesion como una rama de trabajo: cada workstream con su propio contexto persistente.

**Ritmo de compactacion:** ver `CLAUDE.md` seccion 0.4 (estrategia de compactacion) — no se repite aqui, es la misma regla.

**Higiene de contexto:**
- Sub-agentes para investigacion (no llenar el contexto principal).
- Preguntas rapidas por un canal lateral que no entra al historial.
- Sesiones de "quien construye" y "quien revisa" separadas (ver `AGENTS.md`).
- Sesion de viernes (consolidacion) → siempre arrancar en limpio.

### 5.1 Lunes — Sprint Planning

Objetivo: definir guia de la semana.
El agente lee `avances_diarios.md` de semana anterior como fuente primaria.
Cada proyecto sale con objetivo en 1 frase y entregable esperado.

### 5.2 Miercoles — Checkpoint

Objetivo: revisar avance real, detectar bloqueos.
El agente lee `avances_diarios.md` para ver actividad de la semana en curso.
Formato: que se termino, que esta en proceso, que no avanzo, bloqueos, decisiones necesarias.

### 5.3 Viernes — Consolidacion

Objetivo: reporte ejecutivo con metricas.
El agente lee `avances_diarios.md` de TODA la semana.
Actualiza `playbook_registry.json` con historial fresco.
Recolecta metricas de agentes de la semana (tokens, sub-agentes, tasa de exito — seccion 12) y las consolida en un anexo INTERNO SEPARADO del reporte semanal (ver seccion 12) — nunca como seccion dentro del mismo archivo que circula a direccion.

**Deteccion de zombies:**
- 3 dias sin entrada → alerta amarilla
- 5 dias sin entrada → rojo, proyecto zombie
- % MVP estancado 2 semanas → alerta amarilla

### 5.4 Dashboards

Si el portafolio tiene un dashboard visual, generarlo cada viernes como entregable fijo: una version desktop y una version movil, guardadas siempre en la misma carpeta de trabajo activo (ej. `reportes_playbook/`). Al iniciar la semana siguiente, mover los archivos de la semana anterior a un archivo historico, dejando la carpeta activa lista para la nueva semana. Esto evita versiones sueltas tipo "v2" o "final".

---

## 6. Pipeline de intake para nuevos proyectos

**Nota de numeracion:** estos son los PASOS de entrada de un proyecto al portafolio, distintos de las Fases 0-9 de construccion (`FRAMEWORK.md`). Un proyecto nuevo pasa por estos 4 pasos y luego arranca en Fase 0 del framework de construccion.

1. **Paso 1 — Intake:** entender que se quiere automatizar y por que. Salida: aprobado / rechazado / en espera.
2. **Paso 2 — Descubrimiento delegado (opcional):** el contributor documenta el proceso AS-IS antes de disenar.
3. **Paso 3 — Diseno de solucion:** el lider define tipo de solucion, arquitectura, stack, plan de fases.
4. **Paso 4 — Asignacion de owner:** se asigna owner, se define primer entregable, arranca cadencia semanal.

---

## 7. Reporte ejecutivo semanal (viernes)

```md
## Reporte semanal — [DEPARTAMENTO] — [FECHA]

### Capa ejecutiva (3 lineas, antes que nada)
- Que paso esta semana:
- Que significa para el negocio:
- Que se necesita de direccion (si algo):

### Resumen
- Produccion: [N] | Piloto: [N] | Desarrollo: [N] | Zombies: [N]
- Riesgo principal de la semana:

### Top avances
1.
2.
3.

### Top riesgos del portafolio (consolidado, no solo por proyecto)
| Riesgo | Proyecto | Severidad | Mitigacion / decision pendiente |
|---|---|---|---|

### Metricas por proyecto

| Proyecto | Owner | % MVP | Semaforo | Bloqueo |
|---|---|---|---|---|

### Decisiones requeridas
-

### Prioridad siguiente semana
-
```

**Cero cifras financieras en este archivo.** Este es el documento que llega a direccion (ver seccion 4). El costo operativo de agentes (seccion 12) NUNCA es una seccion de este archivo — vive en un archivo interno separado (ej. `reportes_playbook/costo_operativo_interno_[fecha].md`) que solo lee el lider del departamento. Si direccion pide ver ese dato, se comparte aparte y explicito, no se anexa al reporte semanal por defecto.

---

## 8. Presentacion mensual — Slides ejecutivos no tecnicos

**Cadencia:** ultimo viernes de cada mes, despues del cierre semanal.
**Audiencia:** direccion + personal no tecnico.
**Objetivo:** mostrar el avance del departamento como sistema — construido, operando, escalable — sin jerga tecnica.

### 8.1 Frases de activacion

`prepara las slides del mes`, `presentacion mensual`, `slides para direccion`

### 8.2 Entregables

| Pieza | Descripcion |
|---|---|
| Timeline mensual | 4 hitos semanales clave, con cifra destacada por hito |
| Panel ejecutivo | Numeros del portafolio: proyectos por estado, tecnologias integradas, modelos IA en uso, proyectos estrella |
| Guion breve | 5 minutos para quien presenta |
| Copy exacto | Listo para pegar en la herramienta de presentacion del equipo |

Capturas a alta resolucion (3x) si se van a insertar como imagen en una herramienta externa (Canva, slides, etc.).

### 8.3 Reglas de contenido — obligatorias

- Cero cifras financieras (gastos, montos, presupuesto, ROI). Eso es SOLO interno.
- Cero nombres de personas individuales. Se habla del equipo / area.
- Porcentaje estandar por fase: produccion=100%, piloto activo=95%, pre-piloto=70%, construccion avanzada=75%, construccion=65%, diseno=15%.
- Mencionar los modelos IA en uso de forma generica (ej: "modelo principal de razonamiento", "modelo de redaccion ejecutiva") o con su nombre si el equipo quiere mostrarlo — actualizar cada mes, no fijar version.
- Proyectos estrella: 1-2 con mayor avance en piloto/produccion.
- Max 20% texto del area visual. 80% visual.
- Cero emojis, cero tecnicismos.

### 8.4 Diseno

Usar el sistema de diseno / tokens de marca de tu propio departamento (paleta, tipografia, logo). Si no existe uno, usar una paleta neutra consistente y documentarla en `DESIGN_SYSTEM.md` del portafolio.

### 8.5 Checklist antes de generar capturas

- [ ] Porcentajes verificados contra `status.md` actualizados
- [ ] Tecnologias contadas (no adivinadas)
- [ ] Proyecto(s) estrella identificados correctamente
- [ ] Cifras del framework actualizadas (fases activas, plantillas, proyectos)
- [ ] Cero cifras financieras, cero nombres individuales
- [ ] Capturas a resolucion suficiente para proyectarse sin pixelarse

---

## 9. Criterios de semaforo (CALCULADOS, no autodeclarados)

**Verde:** entrada en `avances_diarios.md` en ultimas 48h + % MVP avanzo esta semana + sin bloqueos activos.

**Amarillo:** sin entrada en 3 dias + % MVP estancado 2 semanas + bloqueo activo < 48h + owner no responde en 24h.

**Rojo:** sin entrada en 5+ dias (zombie) + bloqueo > 48h sin plan + % MVP estancado > 3 semanas + sin owner.

### Prioridad dinamica

La prioridad no se asigna manualmente. Se calcula con la formula documentada en `CLAUDE.md` seccion 6.

Fuente: `playbook_registry.json`. Campos usados: `dias_sin_actividad`, `%_mvp`, `fase`, `bloqueo_principal`, `clasificacion`.

Max 3-4 proyectos prioritarios por semana. Resto a cola "EN ESPERA". Recalculo: cada lunes y cada viernes.

---

## 10. Metricas por proyecto

| Metrica | Fuente |
|---|---|
| % MVP | `MVP_BREAKDOWN.md` (completados/totales * 100) |
| Flujos implementados | `avances_diarios.md` |
| Flujos testeados | `avances_diarios.md` |
| Bloqueo principal | `avances_diarios.md` |
| Semaforo | Calculado segun criterios seccion 9 |
| Evidencia principal | `avances_diarios.md` (commit/PR/endpoint) |
| Owner | `context.md` |
| Fase actual | 0-9 segun `FRAMEWORK.md` |
| Dias sin actividad | Calculado desde ultima entrada en `avances_diarios.md` |
| Delta % MVP semanal | `playbook_registry.json` historial |

---

## 11. Archivos obligatorios

**Por departamento:** `CLAUDE.md`, `PLAYBOOK.md`, `FRAMEWORK.md`, `GIT_PROTOCOL.md`, `AGENTS.md`, `context_proyectos.md`, `playbook_registry.json`

**Por proyecto activo:** `context.md`, `status.md`, `BACKLOG.md`, `RISKS.md`, `avances_diarios.md`, `MVP_BREAKDOWN.md`

---

## 12. Metricas de Agentes — uso INTERNO, archivo separado

Registro de uso de agentes y sub-agentes. Fuente: auto-registro del agente en `avances_diarios.md`. Consumo interno del lider del departamento unicamente.

**Mecanismo de separacion (no solo etiqueta):** esta metrica se escribe en un archivo propio (ej. `reportes_playbook/costo_operativo_interno_[fecha].md`), NUNCA como seccion del reporte semanal (seccion 7) ni de la presentacion mensual (seccion 8) — esos dos son los documentos que circulan fuera del equipo tecnico. Si direccion pide verla, se comparte ese archivo aparte, de forma explicita.

### 12.1 Consumo de tokens

- Registrar al final de cada sesion en `avances_diarios.md`.
- Almacenar en `playbook_registry.json` → `historial_kpi[].tokens_gastados`.
- Formato: `{semana, tokens_entrada, tokens_salida, modelo_principal}`.
- El agente estima si la herramienta no expone un contador exacto.

### 12.2 Conteo de sub-agentes

- Total de sub-agentes usados por semana, por tipo (exploracion, plan, revision, generico) y por proyecto.
- Almacenar en `metricas_agentes.subagent_exitosos` y `subagent_fallidos`.

### 12.3 Tasa de exito

- Exito: tarea completada + resultado usable sin retrabajo.
- Falla: resultado no usable, incompleto, o requirio repetir la tarea completa.
- Tasa objetivo > 80%. Si cae bajo 50% → revisar el protocolo de traspaso de contexto (`AGENTS.md`).

### 12.4 Costo estimado

- `costo = tokens_entrada * precio_input + tokens_salida * precio_output`.
- Los precios por modelo cambian con frecuencia — consultar la tabla de precios vigente del proveedor antes de reportar una cifra (si usas Claude Code, el skill/documentacion de referencia del proveedor tiene los precios actuales).
- Mostrar en el reporte del viernes bajo "Costo operativo": estimacion de orden de magnitud, no facturacion exacta.

### 12.5 Procedimiento de recoleccion

1. Al final de cada sesion, el agente auto-registra en `avances_diarios.md`.
2. El viernes, el agente consolida metricas de la semana.
3. Actualiza `playbook_registry.json` → `metricas_agentes` por proyecto.

### 12.6 Campos en registry

```json
"metricas_agentes": {
  "tokens_entrada": 0,
  "tokens_salida": 0,
  "subagent_exitosos": 0,
  "subagent_fallidos": 0,
  "costo_estimado": 0.0
}
```

---

## 13. Automatizacion

### Scripts

Los scripts de automatizacion viven en `scripts/` en la raiz del portafolio:

- `scripts/framework_status.py` — estado del pool (compact para statusline, full para chequeo diario)
- `scripts/zombie_detector.py` — detecta proyectos zombie segun criterios seccion 9
- `scripts/semaforo_calculator.py` — calcula semaforos automaticamente desde datos reales
- `scripts/validate_registry.py` — valida estructura y campos de `playbook_registry.json`
- `scripts/setup.py` — wizard interactivo de onboarding
- `scripts/playbook_report.py` — genera borrador LUN/MIE/VIE
- `scripts/friday_report_to_html.py` — convierte reporte markdown a dashboard HTML
- `scripts/screenshot_report.js` — captura dashboard HTML a JPG
- `scripts/init_project.py` — inicializa proyecto desde plantillas
- `scripts/archive_week.py` — automatiza backup semanal
- `scripts/check_update.py` — verifica actualizaciones del framework

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
python3 scripts/playbook_report.py --mode friday
# → llenar borrador markdown con datos reales
python3 scripts/friday_report_to_html.py --input reportes/YYYY-MM-DD_friday.md
# → genera dashboard HTML (si aplica)
node scripts/screenshot_report.js --input reportes/YYYY-MM-DD_friday.html
# → genera JPG desktop + mobile (si aplica)
```

### Registry auto-actualizable

Cada viernes, el agente actualiza `playbook_registry.json`:
- Agrega entrada en `historial_kpi[]` por proyecto
- Agrega entrada en `metricas_departamento.historial_semanal[]`
- Actualiza `dias_sin_actividad` y `ultima_entrada_diario`
- Actualiza contador de zombies
- Actualiza `metricas_agentes` (seccion 12)
