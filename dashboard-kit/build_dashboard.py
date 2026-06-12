#!/usr/bin/env python3
"""Build dashboard.html from source/ modules.

Usage:
  python3 build_dashboard.py          # build dashboard.html
  python3 build_dashboard.py --check  # node --check on JS bundle, no write
"""
import sys, subprocess, pathlib

HERE = pathlib.Path(__file__).parent
SRC  = HERE / 'source'
OUT  = HERE / 'dashboard.html'

CSS_ORDER = [
    SRC / 'tokens.css',
    SRC / 'components.css',
]

# Order matters: dependencies must precede dependents
JS_ORDER = [
    SRC / 'kpi-utils.js',
    SRC / 'core' / 'chart-kit.js',
    SRC / 'modal-kit.js',
    SRC / 'overlay-kit.js',
    SRC / 'pres-config-kit.js',
    SRC / 'presentation-engine.js',
    SRC / 'data-render.example.js',  # Replace with your own data-render.js
]

_HEADER = '<!-- GENERATED -- edit source/ files and run build_dashboard.py to rebuild -->\n'


def _concat(files):
    parts = []
    for f in files:
        parts.append(f'/* ===== {f.name} ===== */\n')
        parts.append(f.read_text(encoding='utf-8').rstrip())
        parts.append('\n')
    return '\n'.join(parts)


def _inject_css(html, css):
    start = html.index('<style>') + len('<style>')
    end   = html.index('</style>')
    return html[:start] + '\n' + css + '\n' + html[end:]


def _inject_js(html, js):
    # Target the LAST <script> block (inline, not CDN)
    last_open  = html.rfind('<script>')
    last_close = html.rfind('</script>')
    if last_open == -1 or last_close == -1 or last_open > last_close:
        raise ValueError('inline <script> block not found in dashboard.html')
    start = last_open + len('<script>')
    return html[:start] + '\n' + js + '\n' + html[last_close:]


def _add_header(html):
    if _HEADER in html:
        return html
    return html.replace('<!doctype html>\n', '<!doctype html>\n' + _HEADER, 1)


def build(check=False):
    # Verify all source files exist
    missing = [f for f in CSS_ORDER + JS_ORDER if not f.exists()]
    if missing:
        for f in missing:
            print(f'MISSING: {f}', file=sys.stderr)
        sys.exit(1)

    css = _concat(CSS_ORDER)
    js  = _concat(JS_ORDER)

    if check:
        tmp = HERE / '_check_bundle.js'
        try:
            tmp.write_text(js, encoding='utf-8')
            r = subprocess.run(['node', '--check', str(tmp)],
                               capture_output=True, text=True)
            if r.returncode != 0:
                print(f'node --check FAILED:\n{r.stderr}', file=sys.stderr)
                sys.exit(1)
            print('node --check: OK')
        finally:
            if tmp.exists():
                tmp.unlink()
        return

    if not OUT.exists():
        print(f'ERROR: {OUT} not found. Create a dashboard.html shell first.', file=sys.stderr)
        sys.exit(1)

    html = OUT.read_text(encoding='utf-8')
    html = _inject_css(html, css)
    html = _inject_js(html, js)
    html = _add_header(html)
    OUT.write_text(html, encoding='utf-8')
    lines = len(html.splitlines())
    print(f'Built: {OUT.name} ({lines} lines)')


if __name__ == '__main__':
    build(check='--check' in sys.argv)
