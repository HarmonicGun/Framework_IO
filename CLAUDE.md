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

### Jerarquia de archivos del sistema

| Archivo | Rol |
|---|---|
| `CLAUDE.md` | **Gobierna al agente.** Autoridad maxima. |
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

### C. Miercoles — Checkpoint

Frases: `vamos con el checkpoint`, `miercoles de bloqueos`, `revisemos como vamos`

1. Leer `PLAYBOOK.md` + `context_proyectos.md`
2. Leer `avances_diarios.md` para actividad LUN-MAR
3. Detectar bloqueos, verificar semaforos, detectar zombies
4. Separar avance real de trabajo no validado

Salida: que avanzo, que no, bloqueos, decisiones necesarias, ajuste al viernes.

### D. Viernes — Consolidacion Ejecutiva

Frases: `prepara el informe`, `consolida las metricas`, `vamos al cierre`

1. Leer `PLAYBOOK.md` + `context_proyectos.md` + `playbook_registry.json`
2. Leer `avances_diarios.md` de TODA la semana
3. Consolidar metricas desde registry + avances
4. Detectar top avances, riesgos, zombies
5. Preparar reporte ejecutivo
6. Actualizar `playbook_registry.json` con historial fresco
7. Si hay scripts: generar dashboard HTML + JPG

Salida: reporte markdown, registry actualizado, dashboard si aplica.

**Deteccion de zombies en checkpoint y viernes:**
- 3 dias sin entrada → alerta amarilla
- 5 dias sin entrada → rojo, proyecto zombie
- % MVP estancado 2 semanas → amarilla

### E. Nuevo proyecto

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

## 6. Proyectos prioritarios

Orden segun `context_proyectos.md` > "Prioridades para reporte semanal".
Si el usuario menciona proyecto concreto, ese sube al frente.

---

## 7. Metricas obligatorias (cada viernes)

Owner, clasificacion, % MVP (segun `MVP_BREAKDOWN.md`), objetivo semanal, resultado, evidencia (commit/PR), flujos implementados, flujos testeados, bloqueo principal, semaforo, dias sin actividad.

### Criterios de semaforo (CALCULADOS, no preguntados)

**Verde:** entrada en 48h + %MVP avanzo + sin bloqueos
**Amarillo:** sin entrada en 3 dias + %MVP estancado 2 semanas + bloqueo < 48h
**Rojo:** sin entrada 5+ dias (zombie) + bloqueo > 48h + %MVP estancado 3 semanas

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
| Playbook | `PLAYBOOK.md` |
| Framework | `FRAMEWORK.md` |
| Portfolio | `context_proyectos.md` |
| Registry | `playbook_registry.json` |
| Plantillas | `plantillas/` |
