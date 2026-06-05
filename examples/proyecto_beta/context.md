# Proyecto Beta

> En construccion. Sistema de gestion de usuarios con auth y roles.

---

## 1. Identidad

**Que es:** Plataforma interna de gestion de usuarios y permisos

**Stack:** Python 3.12 + FastAPI + PostgreSQL + React

**Owner:** Luis
**Supervisor:** Direccion
**Sponsor:** CTO

**Repo:** github.com/ejemplo/beta · **Branch:** develop · **Puerto:** 8002

---

## 2. Estado actual

- **Fecha de corte:** 12/05/26
- **Fase:** 5 — Build
- **Semaforo:** Amarillo
- **En produccion:** no

---

## 3. Decisiones clave

| Fecha | Decision | Por que |
|---|---|---|
| 15/04 | FastAPI sobre Flask | Mejor soporte async para auth |
| 28/04 | PostgreSQL sobre SQLite | Requisito de concurrencia multi-usuario |

---

## 4. Metrica semanal

| Metrica | Valor |
|---|---|
| Flujos implementados | 6 |
| Flujos testeados | 5 |
| Entregables MVP cerrados esta semana | 1 |
| Dias con actividad | 3/7 |
| Bloqueo activo | si — diseno de roles pendiente con sponsor |
