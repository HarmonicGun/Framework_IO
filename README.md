# KP-IA Frameworks

> Framework de inteligencia operativa. Sistema operativo departamental sobre Claude Code.
> Version 0.7.0

---

## El problema

Tu equipo tiene 5, 10, 15 proyectos corriendo al mismo tiempo.

Nadie sabe cuales avanzan. Nadie sabe cuales estan bloqueados. El CEO pregunta y preparas slides por 3 horas.

Notion y Jira muestran lo que la gente escribe. Este framework muestra lo que la gente hizo.

---

## El resultado

Reporte ejecutivo semanal en 5 minutos.

Antes: 2-3 horas de preparacion, 3-4 veces por semana.
Ahora: 5 minutos. El agente genera el reporte. El director solo lo lee.

El reporte refleja avance real — no datos tecnicos. Legible para el CEO sin traduccion.

---

## Como funciona

Un sistema operativo departamental sobre Claude Code.

Dices una frase natural y el agente hace el trabajo:

| Frase | Que produce |
|---|---|
| `arranquemos un lunes mas` | Sprint planning semanal |
| `vamos con el checkpoint` | Revision de bloqueos y semaforos |
| `prepara el informe` | Reporte ejecutivo con metricas |
| `registra sesion` | Entrada en log diario del proyecto |

**La diferencia con cualquier template:** el semaforo no se edita — se computa. Si un proyecto no tiene evidencia real en 3 dias, pasa a amarillo automatico. 5+ dias, rojo — proyecto zombie. No se puede falsificar el avance.

---

## Que incluye

```
CLAUDE.md              Entry point del agente (autoridad maxima, modos de activacion)
PLAYBOOK.md            Sistema operativo: cadencia, roles, metricas, semaforos
FRAMEWORK.md           Framework universal: fases 0-9, seguridad, diseno
ONBOARDING.md          Guia de instalacion automatica (el agente configura solo)
plantillas/            11 templates para portfolios, proyectos, seguridad, reportes
scripts/               9 scripts de automatizacion del ciclo semanal
checkpoints/           Directorio para acciones priorizadas del checkpoint
examples/              Departamento ficticio pre-configurado con 3 proyectos
VERSION                Versionado semantico
CHANGELOG.md           Historial de cambios
```

### Scripts

| Script | Funcion |
|---|---|
| `framework_status.py` | Estado del pool (compact para statusline, full para /hoy) |
| `zombie_detector.py` | Detecta proyectos sin actividad |
| `semaforo_calculator.py` | Calcula semaforos automaticamente desde datos reales |
| `validate_registry.py` | Valida estructura y campos del registry |
| `setup.py` | Wizard interactivo de onboarding |
| `playbook_report.py` | Genera borrador LUN/MIE/VIE (en desarrollo) |
| `friday_report_to_html.py` | Convierte reporte markdown a dashboard HTML (en desarrollo) |
| `init_project.py` | Inicializa proyecto desde templates (en desarrollo) |
| `archive_week.py` | Automatiza backup semanal (en desarrollo) |

### Templates

| Template | Para |
|---|---|
| `PORTFOLIO.md` | `context_proyectos.md` del departamento |
| `PROYECTO.md` | Identidad, estado y metricas de un proyecto |
| `SEGUIMIENTO.md` | BACKLOG + RISKS de un proyecto |
| `AVANCES_DIARIOS.md` | Log diario de sesiones |
| `MVP_BREAKDOWN.md` | Desglose del MVP en entregables |
| `SECURITY.md` | Checklist de seguridad |
| `DESIGN_SYSTEM.md` | Sistema visual para UI y dashboards |
| `REPORTE_SEMANAL.md` | Reporte ejecutivo de viernes |
| `CORTE_SEMANAL.md` | Corte LUN/MIE/VIE |
| `Next_Actions.md` | Acciones priorizadas del checkpoint |
| `registry.json` | `playbook_registry.json` con historial |

---

## Instalacion rapida

```
1. Copia CLAUDE.md, PLAYBOOK.md, FRAMEWORK.md a la raiz de tu portafolio
2. Abre Claude Code: cd /ruta/portafolio && claude
3. Escribe cualquier cosa. El agente detecta primer uso y configura todo.
```

Tiempo de setup: 10-15 minutos. El agente crea `context_proyectos.md`, `playbook_registry.json` y los archivos minimos por proyecto. Ver `ONBOARDING.md` para guia completa.

---

## Requisitos

- Claude Code instalado
- Carpeta con los proyectos a gestionar
- Saber que proyectos existen (nombres y owners)

---

## Para quien es

Directores de TI, CTOs y responsables de transformacion digital en empresas medianas con 5+ proyectos corriendo en paralelo sin sistema de gobernanza.

Aplica a proyectos tecnicos, administrativos, comerciales, operativos y de IA. Ver `FRAMEWORK.md` para la clasificacion completa.

Sectores con mayor adopcion: manufactura, distribucion, retail, servicios financieros.

---

## Fases del framework (0-9)

```
0 Intake → 1 Discovery → 2 Classification → 3 Operating Design →
4 Technical Design → 5 Build → 6 Critical Review →
7 Pilot → 8 Production → 9 Continuous Improvement
```

---

## Licencia

Uso comercial. Prohibida la redistribucion o reventa sin autorizacion.
Copyright 2026 KP-IA Frameworks. Todos los derechos reservados.
