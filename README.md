# KP-IA Frameworks

> Sistema operativo para equipos que gestionan multiples proyectos de IA en paralelo.

---

## El problema

Tu equipo tiene 5, 10, 15 proyectos de IA corriendo al mismo tiempo.

Nadie sabe cuales avanzan. Nadie sabe cuales estan bloqueados. El CEO pregunta y preparas slides por 3 horas.

Notion y Jira muestran lo que la gente escribe. Este framework muestra lo que la gente hizo.

---

## El resultado

**18 proyectos de IA en paralelo. Reporte ejecutivo semanal en 5 minutos.**

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
| `prepara el informe` | Reporte ejecutivo con metricas, dashboard HTML + JPG |
| `registra sesion` | Entrada en log diario del proyecto |

**La diferencia con cualquier template:** el semaforo no se edita — se computa. Si un proyecto no tiene evidencia real en 5 dias, pasa a amarillo automatico. 10 dias, rojo. No se puede falsificar el avance.

---

## Que incluye

```
CLAUDE.md           Entry point del agente (autoridad maxima, modos de activacion)
PLAYBOOK.md         Sistema operativo: cadencia, roles, metricas, semaforos
FRAMEWORK.md        Framework universal: fases 0-9, seguridad, diseno
ONBOARDING.md       Guia de instalacion (10-15 minutos)
plantillas/         Templates para portfolios, proyectos, registros
scripts/            Automatizacion del ciclo semanal
```

---

## Instalacion rapida

```
1. Copia CLAUDE.md, PLAYBOOK.md, FRAMEWORK.md a la raiz de tu portafolio
2. Crea context_proyectos.md desde plantillas/PORTFOLIO.md
3. Abre Claude Code: cd /ruta/portafolio && claude
4. Escribe: "arranquemos"
```

Tiempo de setup: 10-15 minutos. Ver ONBOARDING.md para guia completa.

---

## Requisitos

- Claude Code instalado
- Carpeta con los proyectos a gestionar
- Saber que proyectos existen (nombres y owners)

---

## Para quien es

Directores de TI, CTOs y responsables de transformacion digital en empresas medianas con 5+ proyectos de IA corriendo en paralelo sin sistema de gobernanza.

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
