# AUDITORIA PROFUNDA — Bug Hunting Exhaustivo para App Web

> Framework de auditoria total. Fase 6 del FRAMEWORK.md — Critical Review.
> Gobernado por `CLAUDE.md` seccion 0.1 (Filosofia Anti-Complacencia).
> Version: 0.1.0 | Creado: 2026-05-27

---

## 0. PROPOSITO

Auditoria TOTAL de app web a todos los niveles. NO asumir que algo funciona porque existe. VALIDAR TODO.

### 0.1. Regla de oro

Si no se verifico, no funciona. Todo boton, toda ruta, todo endpoint, toda funcion debe demostrar que opera. Sin excepcion.

---

## 1. REGLAS CRITICAS

### 1.1. No confiar en la UI

Si existe un boton:
1. verificar que tenga handler
2. verificar que invoque logica real
3. verificar que la logica responda
4. verificar efectos reales
5. verificar persistencia
6. verificar respuesta visual
7. verificar errores

### 1.2. Todo debe probarse

No listar funciones teoricas. EJECUTAR mentalmente y analizar:
- rutas, flujos, estados, dependencias
- callbacks, side effects, APIs, loaders
- eventos, permisos, excepciones

### 1.3. Detectar funciones fantasma

Buscar:
- funciones declaradas pero nunca llamadas
- botones visuales sin backend
- llamadas frontend a endpoints inexistentes
- endpoints sin consumidor
- handlers vacios, TODO/FIXME criticos
- placeholders, mocks olvidados
- logica incompleta, returns vacios
- catches silenciosos, errores ignorados

### 1.4. Simular usuarios reales

Probar:
- happy paths, edge cases, spam clicks
- inputs invalidos, navegacion rapida
- sesiones expiradas, perdida de red
- multiples tabs, refreshes, back button
- formularios incompletos, datos extremos
- estados concurrentes

---

## 2. COBERTURA OBLIGATORIA

### A. MAPEO COMPLETO DE LA APP

Construir:
- mapa de paginas
- mapa de rutas
- mapa de componentes
- mapa de APIs
- mapa de eventos
- mapa de navegacion
- mapa de estados
- mapa de permisos
- mapa de dependencias

Detectar:
- rutas inaccesibles
- rutas huerfanas
- componentes muertos
- features parcialmente implementadas

### B. AUDITORIA DE UI

Verificar cada:
- boton, link, icono clickeable
- dropdown, modal, tooltip
- input, checkbox, tabla
- paginacion, buscador, filtro
- shortcut, drag/drop
- uploader, toast, notificacion

Para cada elemento, 10 preguntas:
1. Hace algo?
2. Hace LO correcto?
3. Llama algo real?
4. Responde visualmente?
5. Tiene manejo de error?
6. Puede romperse?
7. Puede quedar en loading infinito?
8. Puede duplicar requests?
9. Tiene validaciones?
10. Su estado queda consistente?

### C. AUDITORIA DE FRONTEND

Analizar:
- componentes no usados
- props invalidas
- renders innecesarios
- estados corruptibles
- hooks incorrectos
- memory leaks
- listeners huerfanos
- async race conditions
- stale state, closures rotas
- hydration issues
- imports muertos
- lazy loading roto
- errores de suspense
- problemas de cache

Especial atencion:
- React/Vue lifecycle
- stores globales, context, reducers
- query caching, optimistic updates
- websocket sync

### D. AUDITORIA DE BACKEND

Verificar:
- endpoints funcionales
- validaciones, auth, permisos
- manejo de errores, status codes
- payloads, sanitizacion
- concurrencia, transacciones
- retries, idempotencia
- rate limits, logs
- excepciones silenciosas

Detectar:
- endpoints no usados
- endpoints rotos
- inconsistencias REST
- contratos rotos
- respuestas incompatibles
- schemas inconsistentes

### E. AUDITORIA DE INTEGRACION

Verificar:
- frontend <-> backend
- backend <-> DB
- backend <-> servicios externos
- sincronizacion, retries
- timeout handling
- estados intermedios, rollback

Buscar:
- requests huerfanas
- respuestas ignoradas
- retries infinitos, loops
- polling roto

### F. SEGURIDAD FUNCIONAL BASICA

Buscar:
- auth bypass
- rutas expuestas
- secrets visibles
- tokens inseguros
- CORS incorrecto
- validaciones client-only
- IDOR, XSS basico, CSRF basico
- inputs no sanitizados
- debug endpoints
- stack traces expuestos

### G. TESTING DE FLUJOS REALES

Ejecutar:
- onboarding completo
- login/logout
- CRUD completo
- uploads, busquedas, filtros
- exports, imports
- pagos (si aplica)
- notificaciones
- roles/permisos
- recuperacion de sesion
- navegacion completa

---

## 3. PROFUNDIDAD DE ANALISIS

NO detenerse en bugs superficiales.

Para cada hallazgo:
- encontrar causa raiz
- impacto
- reproducibilidad
- severidad
- alcance
- modulos afectados
- posibles efectos secundarios

---

## 4. FORMATO DEL INFORME

Generar:

```
1. RESUMEN EJECUTIVO
   - estado general, nivel de estabilidad
   - riesgos criticos, score de calidad

2. MAPA DE COBERTURA
   - paginas analizadas, componentes, endpoints
   - rutas, flujos

3. BUGS CRITICOS
   Para cada bug: ID, severidad, descripcion, pasos exactos,
   resultado esperado, resultado actual, causa probable,
   archivos implicados, impacto tecnico, impacto negocio, evidencia

4. BUGS MEDIOS

5. BUGS MENORES

6. FUNCIONES ROTAS O HUERFANAS

7. BOTONES / EVENTOS SIN IMPLEMENTACION

8. ENDPOINTS NO FUNCIONALES

9. CODIGO MUERTO DETECTADO

10. RIESGOS DE ESCALABILIDAD

11. RIESGOS DE SEGURIDAD

12. PROBLEMAS UX IMPORTANTES

13. FLUJOS INCONSISTENTES

14. RECOMENDACIONES PRIORIZADAS

15. MATRIZ FINAL DE RIESGO
```

---

## 5. MODO DE OPERACION

Trabajar como:
- QA destructivo
- ingeniero senior
- auditor tecnico
- usuario malicioso
- usuario torpe
- pentester funcional

Debe:
- pensar como atacante
- pensar como usuario real
- pensar como maintainer
- pensar como arquitecto

Si algo NO puede verificarse completamente:
- decirlo explicitamente
- explicar por que
- indicar riesgo potencial

Nunca asumir funcionalidad. TODO debe demostrarse o cuestionarse.

---

## 6. SEGUNDA PASADA — AGENTES SIN CONTEXTO

Una vez completada la primera pasada de auditoria, ejecutar una SEGUNDA PASADA con agentes independientes sin contexto previo.

### 6.1. Por que

El auditor principal tiene sesgo de contexto. Ve lo que ya vio. Los agentes sin contexto encuentran lo que el auditor principal paso por alto.

### 6.2. Procedimiento

1. **Preparar el scope:** del informe de primera pasada, extraer:
   - Lista de archivos criticos
   - Lista de rutas/endpoints
   - Lista de componentes/flujos
   - Zonas marcadas como "no verificado" o "baja confianza"

2. **Lanzar agentes en paralelo** (ver `AGENTS.md` para tipos y modelos):

   ```
   Agente A — Auditoria de Codigo Muerto:
     Scope: frontend + backend completo
     Tarea: encontrar funciones declaradas nunca llamadas, imports muertos,
            componentes huerfanos, endpoints sin consumidor, codigo inaccesible.
     Prompt: "Actua como QA destructivo. Busca SOLO codigo muerto.
              No me digas lo que funciona. Solo lo que NO se usa.
              Para cada hallazgo: archivo, linea, por que esta muerto."

   Agente B — Auditoria de Integridad Funcional:
     Scope: mapa de rutas + handlers + APIs
     Tarea: verificar que cada ruta tiene handler, cada handler tiene logica,
            cada boton tiene accion, cada accion tiene efecto.
     Prompt: "Actua como auditor de integridad. Mapea cada elemento UI
              a su handler backend. Reporta SOLO elementos rotos o huerfanos."

   Agente C — Auditoria de Seguridad Funcional:
     Scope: auth, permisos, validaciones, secretos
     Tarea: buscar auth bypass, rutas expuestas, tokens en codigo,
            validaciones client-only, IDOR, XSS, CSRF.
     Prompt: "Actua como pentester funcional. Busca SOLO vulnerabilidades
              de seguridad funcional. No reportes bugs de UI ni de logica."

   Agente D — Auditoria UX y Estados:
     Scope: flujos completos, estados intermedios, edge cases
     Tarea: simular usuario real, usuario torpe, usuario malicioso.
            Probar navegacion, refreshes, back button, multi-tab.
     Prompt: "Actua como usuario destructivo. Encuentra estados inconsistentes,
              flujos rotos, UX confusa, race conditions visibles al usuario."
   ```

3. **Consolidar hallazgos:**
   - Cada agente entrega su propio mini-informe
   - El auditor principal consolida en informe unificado
   - Marcar hallazgos que aparecen en AMBAS pasadas (alta confianza)
   - Marcar hallazgos unicos de segunda pasada (posibles falsos negativos de primera)

4. **Regla de discrepancia:**
   - Si un agente encuentra algo que el auditor principal NO vio → revisar manualmente
   - Si dos agentes independientes encuentran lo mismo → critico confirmado
   - Si un agente reporta "no encontre nada" → desconfiar, revisar scope

### 6.3. Modelos recomendados

| Agente | Tipo | Modelo | Razon |
|--------|------|--------|-------|
| A (Dead code) | Explore | haiku | Mucha lectura, poca sintesis |
| B (Integridad) | code-reviewer | opus | Requiere juicio de conectividad |
| C (Seguridad) | code-reviewer | opus | Requiere conocimiento de vulnerabilidades |
| D (UX/Estados) | general-purpose | sonnet | Sintesis de flujos |

---

## 7. PLANEACION ATOMICA POST-AUDITORIA

Una vez consolidado el informe final, planear correcciones en tareas atomicas segun `CLAUDE.md` seccion 0.3.

### 7.1. Reglas

1. **Verificar antes de tocar:** para cada archivo a modificar, leerlo completo. Saber que hay, que depende de el, que rompe si cambia.
2. **Una tarea = un archivo = un resultado verificable.** Max 2-3 archivos de entrada, max ~500 lineas de salida.
3. **Cada tarea debe responder:**
   - QUE archivo se toca
   - POR QUE se toca (que bug/hallazgo resuelve)
   - RESULTADO ESPERADO linea por linea
   - COMO se verifica que funciono
4. **Orden estricto:** no avanzar sin terminar la tarea anterior. Excepcion: tareas sin dependencia mutua.
5. **Plan escrito:** presentar plan completo al usuario. Sin luz verde = sin build.

### 7.2. Formato de tarea atomica

```markdown
### Tarea N: [Titulo corto]

**Archivos:**
- `path/file.ts` (modificar)
- `path/other.ts` (leer, no modificar)

**Bug que resuelve:** ID-003 del informe de auditoria

**Por que se toca:** el handler onClick no llama a ninguna funcion real

**Cambios linea por linea:**
| Linea | Cambio | Resultado esperado |
|-------|--------|--------------------|
| 42 | `onClick={undefined}` -> `onClick={handleSubmit}` | El boton dispara submit |
| 15 | Agregar `const handleSubmit = () => {...}` | La funcion existe y es llamada |

**Verificacion:**
- [ ] El boton responde a click
- [ ] La funcion handleSubmit se ejecuta
- [ ] El estado del formulario cambia
- [ ] No hay errores en consola
```

### 7.3. Orden de prioridad

1. Bugs criticos (rompen la app en primer uso)
2. Seguridad funcional (auth bypass, rutas expuestas)
3. Funciones huerfanas/rotas (features incompletas)
4. Bugs medios (flujos rotos con workaround)
5. Code dead (limpieza, no funcional)
6. UX y menores

### 7.4. Verificacion adversarial pre-build

Antes de ejecutar el plan, lanzar agente adversarial (ver `CLAUDE.md` 0.3.1):

```
Agente adversarial:
  Recibe: plan completo de tareas atomicas
  Tarea: desafiar activamente el plan. Buscar:
    - Dependencias no mapeadas
    - Efectos secundarios no previstos
    - Regresiones posibles
    - Condiciones de borde ignoradas
    - Errores de logica en el plan
  NO busca confirmar. Busca romper.
```

Incorporar hallazgos del adversarial antes de pedir aprobacion al usuario.

### 7.5. Aprobacion

Presentar al usuario:
1. Informe de auditoria (1a + 2a pasada)
2. Plan de tareas atomicas
3. Resultado del agente adversarial
4. Riesgos residuales

Usuario aprueba → build. Usuario rechaza → revisar plan.

---

## 8. INTEGRACION CON EL FRAMEWORK

### 8.1. Fase del framework

Esta auditoria corresponde a **Fase 6 — Critical Review** del `FRAMEWORK.md`. Debe ejecutarse antes de pasar a Fase 7 (Pilot) o Fase 8 (Production).

### 8.2. Periodicidad

- **Pre-release:** auditoria completa (1a + 2a pasada) antes de cada release mayor
- **Quincenal:** auditoria ligera (solo 1a pasada, secciones B, C, D, G)
- **Pre-produccion:** auditoria completa obligatoria

### 8.3. Archivos relacionados

| Archivo | Rol |
|---------|-----|
| `FRAMEWORK.md` | Fases 0-9, checklist de seguridad |
| `AGENTS.md` | Delegacion de sub-agentes |
| `CLAUDE.md` sec 0.1 | Filosofia Anti-Complacencia |
| `CLAUDE.md` sec 0.3 | Planeacion y Tareas Atomicas |
| `CLAUDE.md` sec 0.3.1 | Construccion Adversarial |
| `AUDIT_PRODUCTO.md` | Auditoria de producto (framework mismo) |
| `SECURITY.md` (proyecto) | Checklist de seguridad especifica |

---

## 9. CHECKLIST RAPIDO PRE-AUDITORIA

Antes de arrancar auditoria completa, verificar:

- [ ] La app compila sin errores
- [ ] La app arranca sin crasheos
- [ ] Tests existentes pasan
- [ ] Dependencias actualizadas (`npm audit`, `pip list --outdated`)
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada y sincronizada
- [ ] Rutas principales accesibles
- [ ] Auth funcional (login/logout basico)

Si alguno falla, documentar como bug critico y decidir si continuar.
