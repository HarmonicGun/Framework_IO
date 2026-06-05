# RISKS — Proyecto Alfa

## Activos

| # | Riesgo | Severidad | Fecha | Impacto | Mitigacion |
|---|---|---|---|---|---|
| 1 | Dependencia de un solo dev (Ana) | Medio | 01/05 | Si Ana no esta, nadie mantiene | Documentar runbooks |
| 2 | Sin backup automatico de DB | Alto | 12/05 | Perdida de datos historicos | Agendar cron job esta semana |

## Cerrados

| # | Riesgo | Fecha cerrado | Como se resolvio |
|---|---|---|---|
| 1 | Timeout en queries grandes | 08/05 | Agregado indice y paginacion |
