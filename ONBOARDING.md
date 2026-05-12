# ONBOARDING — Framework de Inteligencia Operativa

> Para nuevos departamentos. Tiempo de setup: 10-15 minutos.

---

## 1. Que es esto

Un sistema operativo departamental sobre Claude Code. Convierte frases naturales en acciones: sprint planning, checkpoints, reportes ejecutivos generados automaticamente por IA.

Gestiona un **pool de proyectos** — cada uno en su carpeta con stack, owner y ciclo de vida propios.

**El resultado central:** el reporte ejecutivo semanal que antes tomaba 2-3 horas se genera en 5 minutos. El agente hace el trabajo. El director solo lo lee.

---

## 2. Requisitos

- Claude Code instalado
- Carpeta raiz para el portafolio
- Saber que proyectos existen

---

## 3. Instalacion

### Paso 1: Copiar archivos del framework a la raiz

Copia estos 3 archivos desde `_framework_kit/` a la raiz de tu portafolio:

```
CLAUDE.md
PLAYBOOK.md
FRAMEWORK.md
```

### Paso 2: Crear contexto de proyectos

Copia `plantillas/PORTFOLIO.md` a la raiz como `context_proyectos.md`. Llena: departamento, proyectos, prioridades.

### Paso 3: Crear registry

Copia `plantillas/registry.json` a la raiz como `playbook_registry.json`. Llena metadata de proyectos.

### Paso 4: Abrir Claude Code

```bash
cd /ruta/a/tu/carpeta/raiz
claude
```

CLAUDE.md se carga automaticamente. No necesitas @-mencionar nada.

### Paso 5: Activar

Escribe cualquier cosa: `hola`, `arranquemos`, `empecemos`.

O si quieres ir directo:

```
usa el framework para empezar a trabajar el dia de hoy en mis proyectos
```

El agente detecta que es primer uso (no existe `context_proyectos.md`), configura el sistema, detecta el dia de la semana y te deja listo para trabajar. No necesitas saber frases magicas.

---

## 4. Archivos del kit

| Archivo | Funcion |
|---|---|
| `CLAUDE.md` | Entry point del agente. Autoridad maxima. Modos de activacion. |
| `PLAYBOOK.md` | Sistema operativo: cadencia, roles, metricas, semaforos. |
| `FRAMEWORK.md` | Framework universal: fases 0-9, seguridad, diseño. |
| `ONBOARDING.md` | Este manual. |
| `README.md` | Landing y posicionamiento. |
| `CASO_DE_USO.md` | Caso real: 18 proyectos, reporte en 5 minutos. |
| `LICENSE.md` | Terminos de uso comercial. |
| `plantillas/` | Templates para portfolios y proyectos. |

---

## 5. Estructura tras instalacion

```
RAIZ/
├── CLAUDE.md
├── PLAYBOOK.md
├── FRAMEWORK.md
├── context_proyectos.md          ← creado por ti
├── playbook_registry.json        ← creado por ti
├── _framework_kit/               ← kit original (no se toca)
├── proyecto_1/
│   ├── context.md
│   ├── status.md
│   ├── BACKLOG.md
│   ├── RISKS.md
│   ├── avances_diarios.md
│   └── MVP_BREAKDOWN.md
├── proyecto_2/
└── Backups/
```

---

## 6. Flujo semanal

| Dia | Frase | Produce |
|---|---|---|
| Lun | `arranquemos un lunes mas` | Sprint planning, objetivos |
| Mar/Jue/Sab | `registra sesion` | Entrada en avances_diarios.md |
| Mie | `vamos con el checkpoint` | Bloqueos, semaforos |
| Vie | `prepara el informe` | Reporte ejecutivo, metricas |

---

## 7. Crear proyecto nuevo

1. Crea carpeta en raiz
2. Di: `hay una nueva carpeta, revisala`
3. El agente clasifica, propone owner, crea archivos minimos

Archivos minimos por proyecto: `context.md`, `status.md`, `BACKLOG.md`, `RISKS.md`, `avances_diarios.md`, `MVP_BREAKDOWN.md`

---

## 8. Plantillas disponibles

| Plantilla | Para |
|---|---|
| `plantillas/PORTFOLIO.md` | `context_proyectos.md` del departamento |
| `plantillas/registry.json` | `playbook_registry.json` |
| `plantillas/PROYECTO.md` | `context.md` + `status.md` + MVP de un proyecto |
| `plantillas/SEGUIMIENTO.md` | `BACKLOG.md` + `RISKS.md` + `avances_diarios.md` |

---

## 9. FAQ

**Menos de 3 proyectos?** Si. La cadencia se adapta.

**Cambiar frases de activacion?** Si. Edita `CLAUDE.md`.

**Compartir con otro depto?** Si. Copia la carpeta completa a la nueva ubicacion.
