#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Iterable


IGNORED_DIRS = {
    ".git",
    ".obsidian",
    "node_modules",
    ".venv",
    "__pycache__",
    ".astro",
    "dist",
    "browser_profile",
    "logs",
    "data",
    "run",
}

DEFAULT_EXCLUDE = {
    "Backups",
    "scripts",
    "reportes_playbook",
    "kpi_history",
}


@dataclass
class RegistryEntry:
    owner: str = ""
    classification: str = ""
    status: str = ""
    priority: str = ""
    notes: str = ""


@dataclass
class ProjectSnapshot:
    name: str
    path: Path
    owner: str
    classification: str
    status: str
    priority: str
    notes: str
    is_git: bool
    branch: str
    last_commit_date: str
    last_commit_subject: str
    dirty_files: int
    untracked_files: int
    latest_file_date: str
    latest_file_path: str


def run(cmd: list[str], cwd: Path) -> str:
    result = subprocess.run(
        cmd,
        cwd=str(cwd),
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def load_registry(root: Path) -> dict[str, RegistryEntry]:
    registry_path = root / "playbook_registry.json"
    if not registry_path.exists():
        return {}
    data = json.loads(registry_path.read_text(encoding="utf-8"))
    projects = data.get("projects", {})
    out: dict[str, RegistryEntry] = {}
    for name, entry in projects.items():
        out[name] = RegistryEntry(
            owner=entry.get("owner", ""),
            classification=entry.get("classification", ""),
            status=entry.get("status", ""),
            priority=entry.get("priority", ""),
            notes=entry.get("notes", ""),
        )
    return out


def latest_file_snapshot(project: Path) -> tuple[str, str]:
    latest_mtime = 0.0
    latest_path = ""
    for current_root, dirs, files in os.walk(project):
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        for filename in files:
            path = Path(current_root) / filename
            try:
                stat = path.stat()
            except OSError:
                continue
            if stat.st_mtime > latest_mtime:
                latest_mtime = stat.st_mtime
                latest_path = str(path.relative_to(project))
    if not latest_path:
        return "", ""
    return datetime.fromtimestamp(latest_mtime).strftime("%Y-%m-%d"), latest_path


def git_snapshot(project: Path) -> tuple[bool, str, str, str, int, int]:
    if not (project / ".git").exists():
        return False, "", "", "", 0, 0

    branch = run(["git", "rev-parse", "--abbrev-ref", "HEAD"], project)
    last_commit_date = run(["git", "log", "-1", "--date=short", "--pretty=format:%ad"], project)
    last_commit_subject = run(["git", "log", "-1", "--pretty=format:%s"], project)
    status = run(["git", "status", "--porcelain"], project)
    dirty_files = 0
    untracked_files = 0
    for line in status.splitlines():
        if not line.strip():
            continue
        if line.startswith("??"):
            untracked_files += 1
        else:
            dirty_files += 1
    return True, branch, last_commit_date, last_commit_subject, dirty_files, untracked_files


def discover_projects(root: Path, selected: set[str] | None) -> list[Path]:
    projects = []
    for child in sorted(root.iterdir(), key=lambda p: p.name.lower()):
        if not child.is_dir():
            continue
        if child.name.startswith("."):
            continue
        if child.name in DEFAULT_EXCLUDE:
            continue
        if selected and child.name not in selected:
            continue
        projects.append(child)
    return projects


def collect_snapshots(root: Path, selected: set[str] | None) -> list[ProjectSnapshot]:
    registry = load_registry(root)
    snapshots: list[ProjectSnapshot] = []
    for project in discover_projects(root, selected):
        entry = registry.get(project.name, RegistryEntry())
        is_git, branch, commit_date, commit_subject, dirty, untracked = git_snapshot(project)
        latest_date, latest_path = latest_file_snapshot(project)
        snapshots.append(
            ProjectSnapshot(
                name=project.name,
                path=project,
                owner=entry.owner,
                classification=entry.classification,
                status=entry.status,
                priority=entry.priority,
                notes=entry.notes,
                is_git=is_git,
                branch=branch,
                last_commit_date=commit_date,
                last_commit_subject=commit_subject,
                dirty_files=dirty,
                untracked_files=untracked,
                latest_file_date=latest_date,
                latest_file_path=latest_path,
            )
        )
    return snapshots


def format_summary_table(snapshots: Iterable[ProjectSnapshot]) -> str:
    lines = [
        "| Proyecto | Owner | Clasificación | Estado | Git | Último commit | Último movimiento | Cambios locales |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for s in snapshots:
        commit = s.last_commit_date if s.last_commit_date else "—"
        latest = s.latest_file_date if s.latest_file_date else "—"
        git_state = "Sí" if s.is_git else "No"
        changes = f"{s.dirty_files} mod / {s.untracked_files} new" if s.is_git else "—"
        lines.append(
            f"| `{s.name}` | {s.owner or '—'} | {s.classification or '—'} | {s.status or '—'} | {git_state} | {commit} | {latest} | {changes} |"
        )
    return "\n".join(lines)


def monday_section(s: ProjectSnapshot) -> str:
    return f"""## {s.name}

- Owner: {s.owner or '[definir]'}
- Clasificación: {s.classification or '[definir]'}
- Estado actual: {s.status or '[definir]'}
- Prioridad: {s.priority or '[definir]'}
- Evidencia más reciente: {s.last_commit_date or s.latest_file_date or '[sin dato]'}{f" — {s.last_commit_subject}" if s.last_commit_subject else ""}
- Objetivo de la semana:
- Entregable esperado al viernes:
- Tareas principales:
- Riesgos conocidos:
- Bloqueos actuales:
- Métricas que se actualizarán:
"""


def wednesday_section(s: ProjectSnapshot) -> str:
    return f"""## {s.name}

- Owner: {s.owner or '[definir]'}
- Qué se terminó:
- Qué está en proceso:
- Qué no avanzó:
- Bloqueos:
- Decisiones necesarias:
- Ajuste al objetivo del viernes:
- Evidencia principal:
- Semáforo:
"""


def friday_section(s: ProjectSnapshot) -> str:
    return f"""## {s.name}

- Owner: {s.owner or '[definir]'}
- Clasificación: {s.classification or '[definir]'}
- Estado:
- Objetivo de la semana:
- Resultado logrado:
- Evidencia:
- % avance MVP:
- # flujos implementados:
- # flujos probados:
- # flujos totales:
- # bugs abiertos:
- # bugs cerrados:
- Bloqueo principal:
- Siguiente paso:
- Delta WoW:
- Semáforo:
"""


def render(mode: str, root: Path, snapshots: list[ProjectSnapshot]) -> str:
    today = date.today().isoformat()
    parts = [
        f"# Reporte Playbook — {mode.capitalize()}",
        "",
        f"- Fecha: {today}",
        f"- Raíz analizada: `{root}`",
        f"- Total de proyectos incluidos: {len(snapshots)}",
        "",
        "## Resumen automático",
        "",
        format_summary_table(snapshots),
        "",
    ]

    if mode == "monday":
        parts.extend(
            [
                "## Uso",
                "",
                "Este borrador sirve para sprint planning. Completa objetivo semanal, entregable del viernes y métricas por proyecto.",
                "",
            ]
        )
        parts.extend(monday_section(s) for s in snapshots)
    elif mode == "wednesday":
        parts.extend(
            [
                "## Uso",
                "",
                "Este borrador sirve para checkpoint técnico. Enfatiza bloqueos, evidencia y ajuste de objetivo.",
                "",
            ]
        )
        parts.extend(wednesday_section(s) for s in snapshots)
    elif mode == "friday":
        parts.extend(
            [
                "## Uso",
                "",
                "Este borrador sirve para consolidar métricas y preparar reporte ejecutivo.",
                "",
            ]
        )
        parts.extend(friday_section(s) for s in snapshots)
    else:
        raise ValueError(f"Modo no soportado: {mode}")

    return "\n".join(parts).rstrip() + "\n"


def default_output(root: Path, mode: str) -> Path:
    folder = root / "reportes_playbook"
    folder.mkdir(parents=True, exist_ok=True)
    return folder / f"{date.today().isoformat()}_{mode}.md"


def main() -> int:
    parser = argparse.ArgumentParser(description="Genera borradores playbook de lunes/miércoles/viernes.")
    parser.add_argument("--mode", required=True, choices=["monday", "wednesday", "friday"])
    parser.add_argument("--root", default=".")
    parser.add_argument("--project", action="append", default=[])
    parser.add_argument("--output")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    selected = set(args.project) if args.project else None
    snapshots = collect_snapshots(root, selected)
    content = render(args.mode, root, snapshots)
    output_path = Path(args.output).resolve() if args.output else default_output(root, args.mode)
    output_path.write_text(content, encoding="utf-8")
    print(str(output_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
