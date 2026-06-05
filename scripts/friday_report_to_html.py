#!/usr/bin/env python3
"""Convierte un reporte markdown del viernes en dashboard HTML + actualiza KPI history."""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_PATH = Path(__file__).resolve().parent / "friday_dashboard.html.template"
KPI_DIR = ROOT / "kpi_history"

TRAFFIC_MAP = {
    "verde": "green", "amarillo": "yellow", "rojo": "red",
    "green": "green", "yellow": "yellow", "red": "red",
}

STATUS_CLASS = {
    "produccion": "st-p", "piloto": "st-d", "desarrollo activo": "st-d",
    "activo": "st-p", "operativo": "st-p", "en construccion": "st-d",
    "diseno / planeacion": "st-n", "exploracion": "st-n", "referencia": "st-n",
    "activo interno": "st-n", "biblioteca": "st-n", "temprano": "st-n",
    "completo": "st-n", "cerrado": "st-n", "fuente de verdad": "st-n",
    "mvp funcional": "st-d", "en progreso": "st-d", "piloto conceptual": "st-n",
    "en definicion": "st-n",
}

SECTION_RE = re.compile(r'^## (.+)$')
KV_RE = re.compile(r'^- ([^:]+):\s*(.*)$')


def parse_markdown(md_path: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Extrae metadatos globales y lista de proyectos del markdown del viernes."""
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    meta: dict[str, Any] = {"date": "", "total_projects": 0}
    projects: list[dict[str, Any]] = []
    current_project: dict[str, Any] | None = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line.startswith("- Fecha:"):
            meta["date"] = line.split(":", 1)[1].strip()
        elif line.startswith("- Total de proyectos incluidos:"):
            meta["total_projects"] = int(line.split(":", 1)[1].strip())

        sec_match = SECTION_RE.match(line)
        if sec_match:
            name = sec_match.group(1).strip()
            if name in ("Resumen automático", "Uso"):
                current_project = None
                continue
            if current_project:
                projects.append(current_project)
            current_project = {"name": name, "raw": {}}
            continue

        if current_project is not None:
            kv_match = KV_RE.match(line)
            if kv_match:
                key = kv_match.group(1).strip()
                val = kv_match.group(2).strip()
                current_project["raw"][key] = val

    if current_project:
        projects.append(current_project)

    return meta, projects


def safe_int(val: str | None) -> int | None:
    if val is None or val.strip() == "":
        return None
    try:
        return int(val)
    except ValueError:
        return None


def safe_pct(val: str | None) -> int | None:
    if val is None or val.strip() == "":
        return None
    val = val.strip().rstrip("%")
    try:
        return int(val)
    except ValueError:
        return None


def extract_metrics(proj: dict[str, Any]) -> dict[str, Any]:
    """Convierte raw key:value en diccionario de metricas tipadas."""
    r = proj.get("raw", {})
    return {
        "owner": r.get("Owner", "").strip() or "[sin owner]",
        "classification": r.get("Clasificación", "").strip(),
        "status": r.get("Estado", "").strip(),
        "mvp_pct": safe_pct(r.get("% avance MVP")),
        "flows_implemented": safe_int(r.get("# flujos implementados")),
        "flows_tested": safe_int(r.get("# flujos probados")),
        "bugs_open": safe_int(r.get("# bugs abiertos")),
        "bugs_closed": safe_int(r.get("# bugs cerrados")),
        "blocker": r.get("Bloqueo principal", "").strip(),
        "next_step": r.get("Siguiente paso", "").strip(),
        "traffic_light": TRAFFIC_MAP.get(r.get("Semáforo", "").strip().lower(), "unknown"),
        "week_objective": r.get("Objetivo de la semana", "").strip(),
        "week_result": r.get("Resultado logrado", "").strip(),
        "evidence": r.get("Evidencia", "").strip(),
    }


def load_registry() -> dict[str, dict[str, Any]]:
    reg_path = ROOT / "playbook_registry.json"
    if not reg_path.exists():
        return {}
    data = json.loads(reg_path.read_text(encoding="utf-8"))
    return data.get("projects", {})


def load_kpi_history(year: int, month: int) -> list[dict[str, Any]]:
    month_name = date(year, month, 1).strftime("%m-%B").lower().replace(" ", "-")
    month_path = KPI_DIR / str(year) / f"{month_name}.json"
    if not month_path.exists():
        return []
    return json.loads(month_path.read_text(encoding="utf-8"))


def save_kpi_history(year: int, month: int, snapshots: list[dict[str, Any]]) -> None:
    month_name = date(year, month, 1).strftime("%m-%B").lower().replace(" ", "-")
    month_path = KPI_DIR / str(year) / f"{month_name}.json"
    month_path.parent.mkdir(parents=True, exist_ok=True)
    month_path.write_text(
        json.dumps(snapshots, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def make_kpi_snapshot(
    week_start: str, week_end: str, projects: list[dict[str, Any]]
) -> dict[str, Any]:
    snap: dict[str, Any] = {"week_start": week_start, "week_end": week_end, "projects": {}}
    for p in projects:
        m = p.get("metrics", {})
        snap["projects"][p["name"]] = {
            "mvp_pct": m.get("mvp_pct"),
            "flows_implemented": m.get("flows_implemented"),
            "flows_tested": m.get("flows_tested"),
            "bugs_open": m.get("bugs_open"),
            "bugs_closed": m.get("bugs_closed"),
            "traffic_light": m.get("traffic_light"),
            "blocker": m.get("blocker"),
        }
    return snap


def compute_wow(
    current: list[dict[str, Any]], history: list[dict[str, Any]]
) -> dict[str, dict[str, Any]]:
    """Compara semana actual vs anterior. Retorna dict nombre_proyecto -> {deltas}."""
    if not history:
        return {}
    prev = history[-1].get("projects", {})
    wow: dict[str, dict[str, Any]] = {}
    for p in current:
        name = p["name"]
        m = p.get("metrics", {})
        pm = prev.get(name, {})
        wow[name] = {
            "mvp_delta": (m.get("mvp_pct") or 0) - (pm.get("mvp_pct") or 0),
            "flows_delta": (m.get("flows_implemented") or 0) - (pm.get("flows_implemented") or 0),
            "tested_delta": (m.get("flows_tested") or 0) - (pm.get("flows_tested") or 0),
            "bugs_closed_delta": (m.get("bugs_closed") or 0) - (pm.get("bugs_closed") or 0),
            "tl_prev": pm.get("traffic_light", "unknown"),
        }
    return wow


def delta_badge(delta: int | None, label: str) -> str:
    if delta is None:
        return ""
    if delta > 0:
        return f'<span class="badge b-gr">+{delta} {label}</span>'
    if delta < 0:
        return f'<span class="badge b-rd">{delta} {label}</span>'
    return f'<span class="badge" style="background:rgba(255,255,255,0.03);color:var(--muted)">= {label}</span>'


def render_kpi_row(projects: list[dict[str, Any]]) -> str:
    active = [p for p in projects if p.get("metrics", {}).get("traffic_light") != "unknown"]
    mvp_vals = [p["metrics"]["mvp_pct"] for p in projects if p["metrics"].get("mvp_pct") is not None]
    avg_mvp = sum(mvp_vals) // len(mvp_vals) if mvp_vals else 0
    total_flows = sum(p["metrics"].get("flows_implemented") or 0 for p in projects)
    total_bugs = sum(p["metrics"].get("bugs_closed") or 0 for p in projects)

    items = [
        (str(len(active)), "Proyectos activos"),
        (f"{avg_mvp}%", "% MVP promedio"),
        (str(total_flows), "Flujos totales"),
        (str(total_bugs), "Bugs cerrados"),
    ]
    parts = []
    for val, label in items:
        parts.append(
            f'<div class="kpi-card"><div class="kpi-val">{val}</div>'
            f'<div class="kpi-sub">{label}</div></div>'
        )
    return "\n".join(parts)


def render_traffic_lights(projects: list[dict[str, Any]]) -> str:
    green = sum(1 for p in projects if p.get("metrics", {}).get("traffic_light") == "green")
    yellow = sum(1 for p in projects if p.get("metrics", {}).get("traffic_light") == "yellow")
    red = sum(1 for p in projects if p.get("metrics", {}).get("traffic_light") == "red")
    items = [
        (str(green), "Verde", "var(--gr)", "var(--gr-dim)"),
        (str(yellow), "Amarillo", "var(--ye)", "var(--ye-dim)"),
        (str(red), "Rojo", "var(--rd)", "var(--rd-dim)"),
    ]
    parts = []
    for val, label, color, bg in items:
        parts.append(
            f'<div class="tl-card" style="border-left:3px solid {color}">'
            f'<div class="tl-val" style="color:{color}">{val}</div>'
            f'<div class="tl-label">{label}</div></div>'
        )
    return "\n".join(parts)


def render_project_card(proj: dict[str, Any], wow: dict[str, dict[str, Any]]) -> str:
    m = proj.get("metrics", {})
    tl = m.get("traffic_light", "unknown")
    tl_text = {"green": "Verde", "yellow": "Amarillo", "red": "Rojo"}.get(tl, "—")
    tl_class = {"green": "b-gr", "yellow": "b-ye", "red": "b-rd"}.get(tl, "")
    tl_border = {"green": "var(--gr)", "yellow": "var(--ye)", "red": "var(--rd)"}.get(tl, "var(--border)")
    st_class = STATUS_CLASS.get(m.get("status", "").lower(), "st-n")

    mvp = m.get("mvp_pct")
    mvp_bar = ""
    if mvp is not None:
        mvp_bar = (
            f'<div class="prog"><div class="prog-fill" '
            f'style="width:{mvp}%;background:var(--go)"></div></div>'
        )

    w = wow.get(proj["name"], {})
    badges = " ".join(filter(None, [
        delta_badge(w.get("mvp_delta"), "% MVP"),
        delta_badge(w.get("flows_delta"), "flujos"),
        delta_badge(w.get("tested_delta"), "probados"),
        delta_badge(w.get("bugs_closed_delta"), "bugs"),
    ]))

    blocker_line = ""
    if m.get("blocker") and tl in ("red", "yellow"):
        blocker_line = (
            f'<div style="font-size:11px;color:var(--rd);margin-top:6px">'
            f'Bloqueo: {m["blocker"]}</div>'
        )

    return f"""<div class="pcard" style="border-left:3px solid {tl_border}">
  <div class="pcard-header">
    <div>
      <div class="pcard-name">{proj["name"]}</div>
      <div class="pcard-owner">{m.get("owner", "—")} · {m.get("classification", "—")}</div>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <span class="{st_class}">{m.get("status", "—")}</span>
      <span class="badge {tl_class}" style="font-size:12px;padding:3px 12px">{tl_text}</span>
    </div>
  </div>
  <div style="margin-bottom:8px">
    <div class="card-label">% MVP</div>
    <span class="kpi-val" style="font-size:22px">{mvp if mvp is not None else "N/A"}</span>
    {mvp_bar}
  </div>
  <div class="pcard-metrics">
    <div class="pcard-meta"><div class="pcard-meta-val">{m.get("flows_implemented") or "—"}</div><div class="pcard-meta-label">Flujos impl</div></div>
    <div class="pcard-meta"><div class="pcard-meta-val">{m.get("flows_tested") or "—"}</div><div class="pcard-meta-label">Probados</div></div>
    <div class="pcard-meta"><div class="pcard-meta-val">{m.get("bugs_open") or "—"}</div><div class="pcard-meta-label">Bugs abiertos</div></div>
    <div class="pcard-meta"><div class="pcard-meta-val">{m.get("bugs_closed") or "—"}</div><div class="pcard-meta-label">Bugs cerrados</div></div>
  </div>
  <div class="pcard-badges">{badges}</div>
  {blocker_line}
</div>"""


def render_wow_table(
    projects: list[dict[str, Any]], wow: dict[str, dict[str, Any]]
) -> str:
    rows = []
    rows.append(
        "<tr><th>Proyecto</th><th>Semáforo</th><th>Δ MVP</th>"
        "<th>Δ Flujos</th><th>Δ Probados</th><th>Δ Bugs</th></tr>"
    )
    for p in projects:
        m = p.get("metrics", {})
        tl = m.get("traffic_light", "unknown")
        dot = {"green": "d-gr", "yellow": "d-ye", "red": "d-rd"}.get(tl, "")
        w = wow.get(p["name"], {})
        mvp_d = w.get("mvp_delta")
        flows_d = w.get("flows_delta")
        tested_d = w.get("tested_delta")
        bugs_d = w.get("bugs_closed_delta")

        def _cell(delta: int | None) -> str:
            if delta is None:
                return '<td style="color:var(--muted)">N/A</td>'
            if delta > 0:
                return f'<td class="wow-up">+{delta}</td>'
            if delta < 0:
                return f'<td class="wow-down">{delta}</td>'
            return '<td class="wow-flat">0</td>'

        rows.append(
            f"<tr><td>{p['name']}</td>"
            f'<td><span class="dot {dot}"></span> {tl.capitalize()}</td>'
            f"{_cell(mvp_d)}{_cell(flows_d)}{_cell(tested_d)}{_cell(bugs_d)}</tr>"
        )
    return "<table class='wow-table'>" + "".join(rows) + "</table>"


def render_html(
    template: str,
    meta: dict[str, Any],
    projects: list[dict[str, Any]],
    wow: dict[str, dict[str, Any]],
    verdicted: bool = False,
) -> str:
    report_date = meta.get("date", date.today().isoformat())
    green_n = sum(1 for p in projects if p.get("metrics", {}).get("traffic_light") == "green")
    yellow_n = sum(1 for p in projects if p.get("metrics", {}).get("traffic_light") == "yellow")
    red_n = sum(1 for p in projects if p.get("metrics", {}).get("traffic_light") == "red")

    if not verdicted:
        verdict = "Complete las metricas y reemplace este texto con la narrativa ejecutiva de la semana."
    else:
        verdict = f"Portafolio: {green_n} verde, {yellow_n} amarillo, {red_n} rojo."

    active = [p for p in projects if p.get("metrics", {}).get("traffic_light") != "unknown"]
    project_cards = "\n".join(render_project_card(p, wow) for p in active)

    html = template
    html = html.replace("___HEADER_DATE___", f"Semana del {report_date}")
    html = html.replace("___HEADER_BADGE___", f"SEMANA {report_date}")
    html = html.replace("___VERDICT_TEXT___", verdict)
    html = html.replace("___KPI_ROW___", render_kpi_row(active))
    html = html.replace("___TRAFFIC_LIGHTS___", render_traffic_lights(active))
    html = html.replace("___PROJECT_CARDS___", project_cards or '<div class="card"><p style="color:var(--muted)">No hay proyectos activos con metricas.</p></div>')
    html = html.replace("___WOW_TABLE___", render_wow_table(active, wow))
    html = html.replace("___FOOTER_DATE___", f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M')} · {report_date}")
    return html


def main() -> int:
    parser = argparse.ArgumentParser(description="Convierte reporte markdown del viernes en dashboard HTML")
    parser.add_argument("--input", required=True, help="Archivo markdown del viernes")
    parser.add_argument("--output", help="Archivo HTML de salida (por defecto: mismo nombre .html)")
    parser.add_argument("--update-kpi", action="store_true", default=True, help="Actualizar KPI history")
    args = parser.parse_args()

    md_path = Path(args.input).resolve()
    if not md_path.exists():
        print(f"ERROR: no existe {md_path}")
        return 1

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    meta, projects_raw = parse_markdown(md_path)

    projects: list[dict[str, Any]] = []
    for p in projects_raw:
        p["metrics"] = extract_metrics(p)
        projects.append(p)

    # WoW comparison
    report_date = meta.get("date", date.today().isoformat())
    try:
        dt = datetime.strptime(report_date, "%Y-%m-%d")
    except ValueError:
        dt = datetime.now()
    history = load_kpi_history(dt.year, dt.month)
    wow = compute_wow(projects, history)

    html = render_html(template, meta, projects, wow, verdicted=len(history) > 0)

    output_path = Path(args.output) if args.output else md_path.with_suffix(".html")
    output_path.write_text(html, encoding="utf-8")
    print(str(output_path))

    # Update KPI history
    if args.update_kpi:
        today = date.today()
        monday = today - timedelta(days=today.weekday())
        sunday = monday + timedelta(days=6)
        snapshot = make_kpi_snapshot(
            monday.isoformat(), sunday.isoformat(), projects
        )
        history.append(snapshot)
        save_kpi_history(dt.year, dt.month, history)
        kpi_path = KPI_DIR / str(dt.year) / f"{dt.strftime('%m-%B').lower()}.json"
        print(f"KPI actualizado: {kpi_path} ({len(history)} semanas)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
