#!/usr/bin/env python3
"""Calcula semaforos segun criterios PLAYBOOK.md seccion 8.
Los semaforos son CALCULADOS, no autodeclarados.
Schema registry v1.1: clave 'projects', campos 'classification'/'status'."""
import json, sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # framework_operative_enforcement
PORTFOLIO = ROOT.parent                                 # proyectos_go (registry vive en root del portafolio)


def _find_registry():
    for c in (PORTFOLIO / "playbook_registry.json", ROOT / "playbook_registry.json"):
        if c.exists():
            return c
    return PORTFOLIO / "playbook_registry.json"


REGISTRY = _find_registry()


def load():
    try:
        with open(REGISTRY) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"projects": {}}


def dias_desde(fecha_str):
    if not fecha_str:
        return 999
    try:
        fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
        return (datetime.now() - fecha).days
    except ValueError:
        return 999


def calcular_semaforo(p):
    """Calcula semaforo segun criterios PLAYBOOK.md sec 8."""
    dias = dias_desde(p.get("ultima_entrada_diario", ""))
    mvp_actual = p.get("%_mvp", 0)
    bloqueo = p.get("bloqueo_principal", "")

    # Verificar historial para % MVP estancado
    historial = p.get("historial_kpi", [])
    mvp_estancado = False
    if len(historial) >= 2:
        ultimas = historial[-2:]
        if ultimas[0].get("%_mvp", 0) == ultimas[1].get("%_mvp", 0):
            mvp_estancado = True

    # ROJO: sin entrada 5+ dias, o bloqueo > 48h, o % MVP estancado > 3 semanas
    if dias >= 5:
        return "Rojo"
    if bloqueo and dias >= 2:
        return "Rojo"

    # AMARILLO: sin entrada 3+ dias, o % MVP estancado 2 semanas, o bloqueo < 48h
    if dias >= 3:
        return "Amarillo"
    if mvp_estancado:
        return "Amarillo"
    if bloqueo:
        return "Amarillo"

    # VERDE: entrada < 48h, % MVP avanzo, sin bloqueos
    return "Verde"


def actualizar_semaforos(data, dry_run=False):
    cambios = []
    for pid, p in data.get("projects", {}).items():
        # No recalcular estados terminales/excluidos/referencia
        if p.get("semaforo") in ("Excluido", "Gris") or \
           p.get("classification") in ("Archivo", "Referencia", "Referencia perpetua", "Finalizado"):
            continue
        actual = p.get("semaforo", "Verde")
        calculado = calcular_semaforo(p)
        if actual != calculado:
            cambios.append({
                "id": pid,
                "nombre": pid,
                "antes": actual,
                "despues": calculado,
            })
            if not dry_run:
                p["semaforo"] = calculado
    return cambios


def reportar(cambios):
    if not cambios:
        print("Sin cambios de semaforo.")
        return

    print(f"=== {len(cambios)} CAMBIOS DE SEMAFORO ===\n")
    for c in cambios:
        print(f"  {c['id']}: {c['antes']} -> {c['despues']}")


if __name__ == "__main__":
    data = load()
    dry = "--dry-run" in sys.argv
    cambios = actualizar_semaforos(data, dry_run=dry)

    if dry:
        print("(DRY RUN — sin cambios en disco)\n")

    reportar(cambios)

    if not dry and cambios:
        with open(REGISTRY, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\nActualizado: {REGISTRY}")
