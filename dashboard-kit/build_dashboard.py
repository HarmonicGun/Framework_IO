#!/usr/bin/env python3
"""Build dashboard.html from source/ modules.

Usage:
  python3 build_dashboard.py                        # build dashboard.html
  python3 build_dashboard.py --check                # node --check on JS bundle, no write
  python3 build_dashboard.py --profile profiles/sales.js  # inject DEPT_PROFILE

The build reads a dashboard.template.html shell and injects CSS + JS.
Set DASHBOARD_TEMPLATE env var to use a different template.
Use --profile to inject a department profile before the JS bundle.
"""

import sys, subprocess, pathlib, json, os

HERE = pathlib.Path(__file__).parent
SRC  = HERE / 'source'
TEMPLATE = pathlib.Path(os.environ.get('DASHBOARD_TEMPLATE', str(SRC / 'dashboard.template.html')))
OUT  = HERE / 'dashboard.html'

CSS_ORDER = [
    SRC / 'tokens.css',
    SRC / 'components.css',
]

# Order matters: dependencies must precede dependents.
# config/defaults.js MUST be first — provides profile resolution layer.
JS_ORDER = [
    SRC / 'config' / 'defaults.js',
    SRC / 'kpi-utils.js',
    SRC / 'core' / 'chart-kit.js',
    SRC / 'modal-kit.js',
    SRC / 'overlay-kit.js',
    SRC / 'pres-config-kit.js',
    SRC / 'presentation-engine.js',
    SRC / 'data-render.js',  # your department-specific renderer
]

# Fallback: if data-render.js doesn't exist, use the example
if not JS_ORDER[-1].exists():
    JS_ORDER[-1] = SRC / 'data-render.example.js'

_HEADER = '<!-- GENERATED -- edit source/ files and run build_dashboard.py to rebuild -->\n'
_PROFILE_SCRIPT_TEMPLATE = '<script>\n/* Injected department profile */\nwindow.DEPT_PROFILE = {data};\n</script>\n'


def _concat(files):
    parts = []
    for f in files:
        if not f.exists():
            print(f'WARNING: skipping missing {f.name}', file=sys.stderr)
            continue
        parts.append(f'/* ===== {f.name} ===== */\n')
        parts.append(f.read_text(encoding='utf-8').rstrip())
        parts.append('\n')
    return '\n'.join(parts)


def _inject_css(html, css):
    idx = html.index('<style>') + len('<style>')
    end = html.index('</style>')
    return html[:idx] + '\n' + css + '\n' + html[end:]


def _inject_js(html, js):
    last_open = html.rfind('<script>')
    last_close = html.rfind('</script>')
    if last_open == -1 or last_close == -1 or last_open > last_close:
        raise ValueError('inline <script> block not found in template')
    start = last_open + len('<script>')
    return html[:start] + '\n' + js + '\n' + html[last_close:]


def _inject_profile(html, profile_data):
    """Inject window.DEPT_PROFILE = {...} before the JS bundle."""
    script_tag = _PROFILE_SCRIPT_TEMPLATE.format(data=json.dumps(profile_data, indent=2))
    last_open = html.rfind('<script>')
    if last_open == -1:
        return script_tag + '\n' + html
    return html[:last_open] + script_tag + '\n' + html[last_open:]


def _add_header(html):
    if _HEADER in html:
        return html
    return html.replace('<!doctype html>\n', '<!doctype html>\n' + _HEADER, 1)


def build(check=False, profile_path=None):
    # Verify all source files exist (warn only for missing optional files)
    missing = [f for f in CSS_ORDER + JS_ORDER[:-1] if not f.exists()]
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

    if not TEMPLATE.exists():
        print(f'ERROR: template not found: {TEMPLATE}', file=sys.stderr)
        print('Create a dashboard.template.html shell first, or set DASHBOARD_TEMPLATE env var.', file=sys.stderr)
        sys.exit(1)

    html = TEMPLATE.read_text(encoding='utf-8')

    # Inject department profile if provided
    if profile_path:
        profile_file = pathlib.Path(profile_path)
        if not profile_file.is_absolute():
            profile_file = HERE / profile_file
        if profile_file.exists():
            profile_data = json.loads(profile_file.read_text(encoding='utf-8'))
            html = _inject_profile(html, profile_data)
            print(f'Profile injected: {profile_file.name}')
        else:
            print(f'WARNING: profile not found: {profile_file}', file=sys.stderr)

    html = _inject_css(html, css)
    html = _inject_js(html, js)
    html = _add_header(html)
    OUT.write_text(html, encoding='utf-8')
    lines = len(html.splitlines())

    # Copy fonts to output directory (self-hosted, zero CDN dependency)
    fonts_src = SRC / 'fonts'
    fonts_dst = HERE / 'fonts'
    fonts_css_src = SRC / 'fonts.css'
    fonts_css_dst = HERE / 'fonts.css'
    if fonts_src.exists() and fonts_src.is_dir():
        import shutil
        if fonts_dst.exists():
            shutil.rmtree(fonts_dst)
        shutil.copytree(fonts_src, fonts_dst)
        print(f'Fonts: {len(list(fonts_dst.iterdir()))} files copied')
    if fonts_css_src.exists():
        import shutil
        shutil.copy2(fonts_css_src, fonts_css_dst)
        print('fonts.css copied')

    print(f'Built: {OUT.name} ({lines} lines)')


if __name__ == '__main__':
    profile_arg = None
    args = [a for a in sys.argv[1:] if not a.startswith('--profile=')]
    for a in sys.argv[1:]:
        if a.startswith('--profile='):
            profile_arg = a.split('=', 1)[1]
    build(check='--check' in sys.argv, profile_path=profile_arg)
