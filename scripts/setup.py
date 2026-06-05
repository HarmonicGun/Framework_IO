#!/usr/bin/env python3
"""Wizard interactivo de onboarding. Configura el departamento paso a paso."""
import json, os
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
PLANTILLAS = ROOT / "plantillas"


def preguntar(prompt, default=""):
    val = input(f"{prompt} " + (f"[{default}]: " if default else ": "))
    return val.strip() or default


def main():
    print("=" * 50)
    print("KP-IA Frameworks — Configuracion inicial")
    print("=" * 50)
    print()

    depto = preguntar("Nombre del departamento")

    # Crear context_proyectos.md
    portfolio_tpl = PLANTILLAS / "PORTFOLIO.md"
    if portfolio_tpl.exists():
        contenido = portfolio_tpl.read_text()
        contenido = contenido.replace("{{NOMBRE_DEPARTAMENTO}}", depto)
        contenido = contenido.replace("{{FECHA}}", datetime.now().strftime("%Y-%m-%d"))
        (ROOT / "context_proyectos.md").write_text(contenido)
        print(f"\nCreado: context_proyectos.md")

    # Crear playbook_registry.json desde plantilla
    registry_tpl = PLANTILLAS / "registry.json"
    if registry_tpl.exists():
        registry = json.loads(registry_tpl.read_text())
        registry["departamento"] = depto
        registry["_ultima_actualizacion"] = datetime.now().strftime("%Y-%m-%d")
        registry["proyectos"] = {}  # Vacio, se llena luego
        (ROOT / "playbook_registry.json").write_text(
            json.dumps(registry, indent=2, ensure_ascii=False)
        )
        print(f"Creado: playbook_registry.json")

    # Crear checkpoints/
    ckp = ROOT / "checkpoints"
    ckp.mkdir(exist_ok=True)
    (ckp / ".gitkeep").touch()

    print(f"\nSetup completo. Departamento '{depto}' configurado.")
    print("Abre Claude Code y escribe: arranquemos")


if __name__ == "__main__":
    main()
