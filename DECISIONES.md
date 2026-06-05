---
name: DECISIONES
description: Registro central de decisiones cross-proyecto del departamento
tags: [framework, decisiones, gobernanza]
created: 2026-06-01
---

# DECISIONES — Departamento

> Registro de decisiones que afectan a >1 proyecto o al departamento completo.
> Decisiones por proyecto van en `DECISIONS.md` del proyecto.
> Formato: fecha, decision, contexto, alternativas, impacto, proyectos.

---

## 2026

| Fecha | Decision | Contexto | Alternativas descartadas | Proyectos afectados |
|---|---|---|---|---|
| 2026-06-01 | Framework incluye GLOSARIO.md, DECISIONES.md, BITACORA.md y frontmatter YAML | Adopcion de patrones utiles de boveda Obsidian sin romper atomicidad | Crear boveda completa (rechazado: 70+ archivos, rompe minimal documents) | framework, todos los activos |
| 2026-05-26 | Dark-first por defecto en todo proyecto nuevo | Protege la vista en uso operativo prolongado | Light-first (rechazado por decision de usuario) | Todo proyecto futuro |
| 2026-05-18 | Modelo Flash para chat diario, Pro solo para validacion de tools criticas | Flash mas rapido y barato. Pro para capa de validacion dual | Usar solo Pro (rechazado: caro, lento para chat) | Proyectos con LLM |
| 2026-05-15 | SQLite en produccion. No migrar a PostgreSQL | Pocos usuarios, operaciones simples, WAL mode suficiente | PostgreSQL (rechazado: complejidad operativa sin beneficio real) | Proyectos con DB |

---

## Reglas

1. **Una entrada por decision cross-proyecto.** Si solo afecta a 1 proyecto, va en `DECISIONS.md` del proyecto.
2. **Orden cronologico inverso.** Mas reciente arriba.
3. **Max 1-2 lineas por campo.** Sin narrativa. Solo datos.
4. **Actualizar al tomar la decision.** No post-mortem.
5. **Wikilinks a proyectos afectados.**

---

> Ver [[GLOSARIO]] para terminos usados.
