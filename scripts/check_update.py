#!/usr/bin/env python3
"""Auto-update check for framework_kit. Called by CLAUDE.md on every session start.

Flow:
  1. Check if this is a git repo with a remote
  2. Fetch from remote (no merge, just check)
  3. Compare local HEAD with remote master
  4. If behind → auto-pull and report version bump
  5. If diverged (local ahead) → warn, skip pull
  6. If up to date → silent, continue
  7. If no git/remote → skip (installed via copy, not clone)

Returns JSON to stdout for the agent to parse.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

FRAMEWORK_ROOT = Path(__file__).resolve().parent.parent


def run(cmd, cwd=None):
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True,
            cwd=cwd or FRAMEWORK_ROOT, timeout=30
        )
        return result.returncode, result.stdout.strip(), result.stderr.strip()
    except subprocess.TimeoutExpired:
        return -1, "", "timeout"
    except Exception as e:
        return -1, "", str(e)


def get_local_hash():
    code, out, _ = run("git rev-parse HEAD")
    return out if code == 0 else None


def get_local_branch():
    code, out, _ = run("git rev-parse --abbrev-ref HEAD")
    return out if code == 0 else None


def main():
    result = {
        "status": "unknown",
        "action": "none",
        "local_version": None,
        "remote_version": None,
        "message": "",
        "behind_count": 0,
        "ahead_count": 0,
    }

    # Check if git repo
    code, _, _ = run("git rev-parse --git-dir")
    if code != 0:
        result["status"] = "no_git"
        result["action"] = "skip"
        result["message"] = "No es un repo git. Instalado por copia manual."
        print(json.dumps(result, ensure_ascii=False))
        return 0

    # Check if remote exists
    code, remote, _ = run("git remote get-url origin")
    if code != 0:
        result["status"] = "no_remote"
        result["action"] = "skip"
        result["message"] = "Sin remote origin. No se puede verificar actualizaciones."
        print(json.dumps(result, ensure_ascii=False))
        return 0

    local_hash = get_local_hash()
    local_branch = get_local_branch()
    result["local_version"] = local_hash[:8] if local_hash else None
    result["branch"] = local_branch

    # Fetch from remote (no merge)
    fetch_code, _, fetch_err = run("git fetch origin master --no-tags 2>&1")
    if fetch_code != 0:
        result["status"] = "fetch_failed"
        result["action"] = "skip"
        result["message"] = f"Fetch fallido: {fetch_err}"
        print(json.dumps(result, ensure_ascii=False))
        return 0

    # Get remote hash
    code, remote_hash, _ = run("git rev-parse origin/master")
    if code != 0:
        result["status"] = "no_remote_branch"
        result["action"] = "skip"
        result["message"] = "No existe origin/master."
        print(json.dumps(result, ensure_ascii=False))
        return 0

    result["remote_version"] = remote_hash[:8] if remote_hash else None

    # Compare
    if local_hash == remote_hash:
        result["status"] = "up_to_date"
        result["action"] = "none"
        result["message"] = "Framework actualizado."
        print(json.dumps(result, ensure_ascii=False))
        return 0

    # Check behind/ahead counts
    code, behind, _ = run(f"git rev-list --count HEAD..origin/master")
    code2, ahead, _ = run(f"git rev-list --count origin/master..HEAD")

    behind_count = int(behind) if behind.isdigit() else 0
    ahead_count = int(ahead) if ahead.isdigit() else 0

    result["behind_count"] = behind_count
    result["ahead_count"] = ahead_count

    if behind_count > 0 and ahead_count == 0:
        # Fast-forward possible: auto-pull
        merge_code, merge_out, merge_err = run("git merge origin/master --ff-only")
        if merge_code == 0:
            # Get new version
            new_hash = get_local_hash()
            result["status"] = "updated"
            result["action"] = "pulled"
            result["local_version"] = new_hash[:8] if new_hash else None
            result["message"] = f"Framework actualizado. {behind_count} commit(s) nuevos."
            # Try to read new version
            version_file = FRAMEWORK_ROOT / "VERSION"
            if version_file.exists():
                result["version"] = version_file.read_text().strip()
        else:
            result["status"] = "merge_failed"
            result["action"] = "skip"
            result["message"] = f"Merge fallido: {merge_err}. Haz pull manual."
    elif behind_count > 0 and ahead_count > 0:
        result["status"] = "diverged"
        result["action"] = "warn"
        result["message"] = (
            f"ALERTA: Tu rama local '{local_branch}' tiene {ahead_count} commit(s) "
            f"no presentes en origin/master y {behind_count} commit(s) nuevos en origin/master. "
            "No se puede hacer pull automatico. Contacta a el lead."
        )
    elif ahead_count > 0 and behind_count == 0:
        result["status"] = "ahead"
        result["action"] = "warn"
        result["message"] = (
            f"Tu rama '{local_branch}' tiene {ahead_count} commit(s) locales. "
            "NUNCA hagas push a master. Si es un cambio necesario, crea tu propia rama y contacta a el lead."
        )

    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
