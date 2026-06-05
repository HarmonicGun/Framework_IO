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

### Opcion A — Git clone (RECOMENDADO para miembros del equipo)

```bash
git clone [URL_DEL_REPO] framework_kit
cd framework_kit
git checkout master
```

**Ventaja:** auto-actualizacion. Cada vez que abras Claude Code, el agente verifica si hay commits nuevos en master y actualiza automaticamente.

Tras clonar, copia `CLAUDE.md`, `PLAYBOOK.md` y `FRAMEWORK.md` a la raiz de tu portafolio, o usa `framework_kit/` como raiz del departamento.

### Opcion B — Copia manual (solo si no usas git)

Copia estos archivos a la raiz de tu portafolio:

```
CLAUDE.md
PLAYBOOK.md
FRAMEWORK.md
```

Sin git, no hay auto-actualizacion. Tendras que re-copiar manualmente cuando haya cambios.

### Paso 2: Activar hooks de git (solo Opcion A)

```bash
cd framework_kit
chmod +x githooks/*
git config core.hooksPath githooks
```

Esto activa:
- **pre-push:** bloquea push a master (solo el lead puede)
- **pre-commit:** avisa si commiteas en master

### Paso 3: Abrir Claude Code

```bash
cd /ruta/a/tu/carpeta/raiz
claude
```

CLAUDE.md se carga automaticamente. El agente ejecuta `check_update.py` antes que nada.

### Paso 4: Activar

Escribe cualquier cosa: `hola`, `arranquemos`, `empecemos`.

El agente detecta que es primer uso (no existe `context_proyectos.md`), configura el sistema automaticamente:
- Crea `context_proyectos.md` desde `plantillas/PORTFOLIO.md`
- Crea `playbook_registry.json` desde `plantillas/registry.json`
- Revisa cada proyecto existente y crea archivos minimos si faltan
- Detecta el dia de la semana y te deja listo para trabajar

No necesitas crear archivos manualmente. El agente lo hace por ti.

**Alternativa manual:** Si prefieres configurar sin el agente, copia `plantillas/PORTFOLIO.md` a la raiz como `context_proyectos.md` y llena los datos. Luego copia `plantillas/registry.json` como `playbook_registry.json`. Pero el camino automatico es mas rapido.

---

## 3.5. Git workflow para el equipo

### Regla de oro

**Solo el lead actualiza master.** Nadie mas. Sin excepciones.

Esto esta reforzado por:
- Hook `pre-push` que bloquea cualquier push a master
- `CLAUDE.md` que prohibe al agente hacer push/merge a master
- Proteccion de rama en GitHub (settings del repo)

### Recibir actualizaciones (todos los dias)

El framework se actualiza solo. Al abrir Claude Code:
1. El agente ejecuta `python3 scripts/check_update.py`
2. Si hay commits nuevos en master → auto-pull
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
3. Contacta a el lead con el detalle del cambio
4. El revisa, aprueba y mergea si corresponde

### Si accidentalmente commiteaste en master

```bash
# NO hagas push. Contacta a el lead.
git log --oneline -3  # mira tus commits locales
```

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
├── plantillas/                   ← templates del sistema
├── proyecto_1/
│   ├── context.md
│   ├── status.md
│   ├── BACKLOG.md
│   ├── RISKS.md
│   ├── avances_diarios.md
│   └── MVP_BREAKDOWN.md
├── proyecto_2/
└── Backups/
└── FW_operative_enforcement/
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

## 10. NotebookLM MCP — Setup por compañero

El servidor MCP de NotebookLM esta preconfigurado en `.mcp.json` en la raiz del portafolio.
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
