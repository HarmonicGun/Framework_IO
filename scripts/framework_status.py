#!/usr/bin/env python3
"""Framework status: compact (statusline) or full (/hoy) mode.
Schema registry v1.1: clave 'projects', campo 'classification'."""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # framework_operative_enforcement
PORTFOLIO = ROOT.parent                                 # proyectos_go (registry vive en root del portafolio)


def _find_registry():
    for c in (PORTFOLIO / "playbook_registry.json", ROOT / "playbook_registry.json"):
        if c.exists():
            return c
    return PORTFOLIO / "playbook_registry.json"


REGISTRY = _find_registry()
ICONS = {"Verde": "V", "Amarillo": "A", "Rojo": "R", "Gris": "-", "Excluido": "X"}
INACTIVAS = ("Archivo", "Referencia", "Referencia perpetua", "Finalizado")


def load():
    try:
        with open(REGISTRY) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"projects": {}, "metricas_departamento": {}}


def is_active(p):
    return p.get("semaforo") not in ("Excluido", "Gris") and p.get("classification") not in INACTIVAS


def get_short(pid, p):
    short = p.get("short_name", "")
    if short:
        return short
    return pid[:14]


def compact(data):
    parts = []
    v = a = r = z = 0
    for pid, p in data.get("projects", {}).items():
        if not is_active(p):
            if p.get("classification") == "Archivo":
                z += 1
            continue
        sem = p.get("semaforo", "")
        if sem == "Verde":
            v += 1
        elif sem == "Amarillo":
            a += 1
        elif sem == "Rojo":
            r += 1
        icon = ICONS.get(sem, "?")
        name = get_short(pid, p)
        mvp = p.get("%_mvp", "?")
        has_block = p.get("bloqueo_principal")
        marker = "!" if has_block else ""
        parts.append(f"{name} {icon}{mvp}%{marker}")
    line = " | ".join(parts)
    return f"({v}v {a}a {r}r {z}z) {line}"


def full(data):
    lines = ["=== HOY ===\n"]
    lines.append(f"{'Proyecto':<14} {'MVP':>5}  Semaforo  Bloqueo")
    lines.append(f"{'-'*14}  {'-'*5}  {'-'*8}  {'-'*30}")

    for pid, p in data.get("projects", {}).items():
        if not is_active(p):
            continue
        name = get_short(pid, p)
        mvp = f"{p.get('%_mvp', '?')}%"
        sem = p.get("semaforo", "?")
        bloqueo = (p.get("bloqueo_principal") or "-")[:30]
        icon = ICONS.get(sem, "?")
        lines.append(f"{name:<14} {mvp:>5}  [{icon}] {sem:<7} {bloqueo}")

    next_files = sorted(Path(ROOT, "checkpoints").glob("Next_Actions_*.md"), reverse=True)
    if next_files:
        lines.append("\n--- PENDIENTES HOY ---")
        content = next_files[0].read_text()
        for section in ["ALTA", "MEDIA", "BAJA"]:
            marker = f"## Prioridad {section}"
            if marker in content:
                lines.append(f"\n[{section}]")
                start = content.index(marker)
                end = content.find("\n## Prioridad", start + 1)
                chunk = content[start:end if end != -1 else len(content)]
                for line in chunk.split("\n"):
                    s = line.strip()
                    if s.startswith("**") and "**" in s[2:]:
                        parts = s.split("**")
                        if len(parts) >= 3:
                            lines.append(f"  * {parts[1].strip('*').strip()}")

    m = data.get("metricas_departamento", {})
    lines.append(f"\nPool: {m.get('activos', '?')} activos, "
                 f"{m.get('zombies', 0)} zombies, "
                 f"actualizado {data.get('_ultima_actualizacion', '?')}")

    return "\n".join(lines)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "compact"
    data = load()
    print(compact(data) if mode == "compact" or mode != "full" else full(data))
