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

**Alternativa — distribucion por git (si tu equipo ya usa un repo compartido):** en vez de copiar archivos a mano, cada quien puede `git clone` el repo del kit y copiar `CLAUDE.md`/`PLAYBOOK.md`/`FRAMEWORK.md` a la raiz del portafolio, o usar el clon directo como raiz. Ventaja: auto-actualizacion (el agente puede correr un script de chequeo de commits nuevos en master al abrir Claude Code). Ver seccion 3.5 para el flujo de equipo completo con esta opcion.

---

## 3.5. Git workflow para el equipo (opcional — solo si distribuyes el kit por git)

### Regla de oro

**Solo el lead actualiza master.** Nadie mas. Sin excepciones.

Esto se refuerza con:
- Hook `pre-push` que bloquea cualquier push a master salvo identidad autorizada
- `CLAUDE.md` que prohibe al agente hacer push/merge a master por su cuenta
- Proteccion de rama en la plataforma de git que uses (settings del repo)

### Recibir actualizaciones (todos los dias)

Si automatizas la verificacion, al abrir Claude Code:
1. El agente corre un chequeo de commits nuevos en master
2. Si hay novedades → auto-pull
3. Si todo OK → continuas trabajando

Manual:
```bash
git pull origin master
```

### Crear tu propia rama (cuantas quieras)

```bash
git checkout -b tu-nombre/lo-que-hiciste
git commit -m "tu cambio"
```

Puedes crear todas las ramas que necesites. No hay limite.

### Si tu cambio deberia ir a master

1. NO hagas push a master
2. NO hagas merge local a master
3. Contacta al lead con el detalle del cambio
4. El revisa, aprueba y mergea si corresponde

### Si accidentalmente commiteaste en master

```bash
# NO hagas push. Contacta al lead.
git log --oneline -3  # mira tus commits locales
```

Ver `GIT_PROTOCOL.md` para el procedimiento completo de integracion sin perder trabajo.

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

---

## 10. NotebookLM MCP — Setup por compañero (opcional)

El servidor MCP de NotebookLM puede preconfigurarse en `.mcp.json` en la raiz del portafolio.
Se carga automaticamente cuando abres Claude Code en esa carpeta.

**Prerequisito unico:**
```
Node.js >= 18 instalado
```

**Auth Google (una vez por compañero):**

1. Abre Claude Code en la raiz del portafolio
2. Escribe: `usa el tool setup_auth del servidor notebooklm`
3. Se abre Chrome — login normal con tu cuenta Google
4. Listo. Las cookies persisten. No se repite.

**Verificar que funciona:**
```
usa el tool get_health del servidor notebooklm
```

**Tools disponibles (perfil standard — 9 tools):**

| Tool | Para que |
|---|---|
| `ask_question` | Preguntar contra un notebook con citas |
| `add_source` | Agregar URL o texto a un notebook |
| `add_notebook` | Registrar notebook en la libreria local |
| `list_notebooks` | Ver notebooks disponibles |
| `select_notebook` | Activar un notebook |
| `search_notebooks` | Buscar por nombre o tema |
| `generate_audio` | Generar resumen en audio (podcast) |
| `get_health` | Verificar estado del servidor |
| `setup_auth` | Autenticar con Google (solo primera vez) |

**Rate limit:** ~50 preguntas/dia en cuenta Google free. Cuenta AI Pro/Ultra: sin limite practico.
**Sin credenciales en texto plano:** la auth usa cookies de Chrome, no passwords.
