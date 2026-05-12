# Caso de Uso — Empresa Industrial Mexico

> Empresa mediana. Sector manufactura y distribucion. 200-500 empleados.
> Implementacion activa desde 2025.

---

## El problema antes del framework

La empresa tenia 18 proyectos de IA corriendo en paralelo:

- Automatizacion de ventas por division
- Inteligencia de mercado
- Estudios multi-mercado
- Agentes de operaciones
- Plataformas de analisis
- Integraciones con ERP

**Sin framework:**
- Nadie sabia cuales proyectos avanzaban y cuales estaban bloqueados
- El reporte ejecutivo semanal tomaba 2-3 horas de preparacion, 3-4 veces por semana
- Los semaforos de avance se autodeclaraban — no reflejaban realidad
- Bloqueos se descubrian semanas despues de que ocurrian
- El CEO recibia datos tecnicos que no podia interpretar

---

## La implementacion

El framework se implemento como sistema operativo del departamento de Inteligencia Operativa.

Archivos de configuracion: 3 archivos raiz + 1 archivo de contexto + 1 registry.

Tiempo de setup inicial: menos de 1 hora.

---

## El resultado

**Reporte ejecutivo semanal:** de 2-3 horas a 5 minutos.

El agente genera el reporte automaticamente. El director solo lo lee y lo comparte.

| Metrica | Antes | Despues |
|---|---|---|
| Tiempo de preparacion de reporte | 2-3 horas x 3-4 veces/semana | 5 minutos cuando se necesite |
| Horas semanales en reporting | 8-12 horas | ~0 |
| Proyectos con semaforo real | 0 (todos autodeclarados) | 18 (computados automaticamente) |
| Tiempo para detectar un bloqueo | Semanas | 48-72 horas (siguiente checkpoint) |
| Formato del reporte CEO | Datos tecnicos | Avance operativo en lenguaje ejecutivo |

---

## Como funciona hoy

El equipo usa frases naturales para operar:

**Lunes:**
> "arranquemos un lunes mas"

El agente lee el historial de la semana anterior, define objetivos por proyecto, detecta riesgos y genera el plan de la semana.

**Miercoles:**
> "vamos con el checkpoint"

El agente revisa actividad de los ultimos 2 dias, detecta bloqueos, ajusta semaforos, identifica proyectos zombie.

**Viernes:**
> "prepara el informe"

El agente consolida metricas de toda la semana, genera el reporte ejecutivo en markdown, genera dashboard HTML y exporta a JPG para compartir.

El Director recibe el reporte listo. Lo comparte en la junta del lunes. No preparo nada.

---

## Semaforo computado — la diferencia central

El semaforo no se edita. Se calcula automaticamente:

- **Verde:** actividad real en las ultimas 48 horas + avance en % MVP + sin bloqueos activos
- **Amarillo:** sin actividad en 3 dias, o % MVP estancado 2 semanas, o bloqueo activo < 48h
- **Rojo:** sin actividad en 5+ dias (proyecto zombie), o bloqueo > 48h sin plan

Nadie puede poner verde un proyecto que lleva 8 dias sin evidencia real.

---

## Por que no basta con Notion o Jira

Notion y Jira muestran lo que la gente escribe. El framework muestra lo que la gente hizo.

En Notion puedes escribir "avance del 80%". El framework solo acepta evidencia: commit, endpoint funcional, test pasando, demo grabado.

El reporte en Notion lo prepara una persona. El reporte del framework lo genera el agente. Son 5 minutos vs. 3 horas.

---

## Lectura recomendada

- `ONBOARDING.md` — instalacion en 10-15 minutos
- `PLAYBOOK.md` — como opera el sistema semana a semana
- `FRAMEWORK.md` — fases 0-9, metricas, semaforos, seguridad
- `plantillas/` — templates listos para usar
