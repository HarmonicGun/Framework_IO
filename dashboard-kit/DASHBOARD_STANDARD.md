# Dashboard Kit — Standard

Dark-mode engineering team observatory dashboard kit.
Single-page app: sidebar nav, ECharts, snapshot-driven data.

## Stack

- HTML5 + vanilla JS (ES6)
- ECharts 5.6.0 (CDN)
- snapdom 2.12.8 (CDN, for PNG export)
- Python 3.8+ (build script only)

## File structure

```
dashboard-kit/
  source/
    tokens.css              Design tokens (CSS variables)
    components.css          All UI components
    kpi-utils.js            Utility functions (esc, ymd, addDays, kpi, etc.)
    core/
      chart-kit.js          ECharts wrappers (heatmap, graph, scatter, donut, bars)
    modal-kit.js            Expand and slice popup modals
    overlay-kit.js          Sync/refresh SSE overlay
    presentation-engine.js  Fullscreen presentation mode
    data-render.example.js  Main render logic + router (adapt this to your project)
  snapshot.example.json     Example data structure — replace with real data
  build_dashboard.py        Builds dashboard.html from source/ files
  DASHBOARD_STANDARD.md     This file
  dashboard.html            OUTPUT — generated, do not edit directly
```

## How to use

1. Copy `source/data-render.example.js` -> `source/data-render.js`
2. Edit `data-render.js`: replace placeholder strings with your team names/labels
3. Produce a `snapshot.json` matching the structure in `snapshot.example.json`
4. Create `dashboard.html` shell (see Shell HTML section below)
5. Run `python3 build_dashboard.py` to inject CSS + JS into the shell
6. Open `dashboard.html` in a browser (needs snapshot.json in same dir, or a server)

## Design tokens (tokens.css)

```css
--o   #FB670B  Primary accent (orange)
--ow  #F97316  Secondary orange
--bg  #09090B  Page background
--s1  #111113  Sidebar surface
--s2  #18181B  Card surface
--s3  #27272A  Tertiary surface
--bd  rgba(255,255,255,.07)   Border subtle
--bd2 rgba(255,255,255,.12)   Border strong
--t1  #FAFAFA  Text primary
--t2  #A1A1AA  Text secondary
--t3  #52525B  Text muted
--ve  #00A36E  Green (health)
--am  #D97706  Amber (warning)
--ro  #E53E3E  Red (critical)
```

Fonts (load via Google Fonts or local):
- `Space Grotesk` — headings, brand
- `Inter` — body
- `JetBrains Mono` — numbers, code, commits

## Project color palette

Each project gets one fixed color across all charts:

| Slot | Color | Hex |
|------|-------|-----|
| 1    | Orange  | #FB670B |
| 2    | Teal    | #14B8A6 |
| 3    | Blue    | #38BDF8 |
| 4    | Violet  | #A78BFA |
| 5    | Green   | #00A36E |
| 6    | Amber   | #F59E0B |

Max 6 projects with unique colors. Extras get gray #606060.

## Adapting data-render.example.js

Key areas to change:

```js
// 1. Semaforo keys — match your snapshot.json
const SEM={Green:'#00A36E', Yellow:'#D97706', Red:'#E53E3E', ...};

// 2. Date anchor — set to your data's last day or compute from snapshot
let ANCHOR='2024-01-31';

// 3. Label strings — change department name, section headers
document.getElementById('tbar-title').textContent='Department';

// 4. presentation-engine.js scene 0 — change team name/logo text
'<div class="p-logo">TI</div><div class="p-h1">Team Intelligence</div>'
```

## snapshot.json format

Top-level keys required:

```json
{
  "generated_at": "ISO datetime",
  "department": {
    "commits_total": 42,
    "active_projects": 3,
    "contributors_active": 3,
    "semaforo": {"Green": 2, "Yellow": 1, "Red": 0},
    "range": {"from": "YYYY-MM-DD", "to": "YYYY-MM-DD"},
    "commits_by_day": [{"date": "YYYY-MM-DD", "commits": 5}, ...]
  },
  "projects": [
    {
      "slug": "my-project",
      "pct_mvp": 65,
      "owner": "dev_alice",
      "fase": 5,
      "classification": "development",
      "semaforo": "Green",
      "active": true,
      "visible": true,
      "commits_7d": 8,
      "commits_30d": 22,
      "git_dias_sin_actividad": 1,
      "bloqueo": null,
      "colabs": []
    }
  ],
  "contributors": [{"person": "dev_alice", "commits": 18, "repos": 2}],
  "portfolio": {"by_classification": {"development": 2, "pilot": 1}},
  "activity": {"repos": [...], "contributors": [...], "edges": [...]},
  "projects_detail": {"my-project": {...}},
  "persons_detail": {"dev_alice": {...}},
  "config": {"projects": {}}
}
```

See `snapshot.example.json` for full structure with all nested fields.

## Shell HTML

The build script injects CSS into `<style></style>` and JS into the last `<script></script>`.
Minimal shell:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Observatory</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/snapdom@2.12.8/dist/snapdom.min.js"></script>
<style>
/* injected by build_dashboard.py */
</style>
</head>
<body>
<div class="shell">
  <aside>
    <div class="brand">
      <div class="logo">TI</div>
      <div><div class="brand-t">Team Intel</div><div class="brand-s">Observatory</div></div>
    </div>
    <div class="nav-item on" data-route="overview" onclick="go('overview')"><span class="ic">&#9632;</span> Overview</div>
    <div class="nav-item" data-route="activity" onclick="go('activity')"><span class="ic">&#9670;</span> Activity</div>
    <div class="nav-section"><span>Projects</span></div>
    <div id="aside-projects"></div>
    <div class="nav-section"><span>Team</span></div>
    <div id="aside-persons"></div>
  </aside>
  <main>
    <div class="accent"></div>
    <div class="topbar">
      <span class="topbar-title" id="tbar-title">Overview</span>
      <div class="vbar" id="tbar-verdict"></div>
      <div class="spacer"></div>
      <div class="drpills">
        <span class="drpill on" data-d="30" onclick="setRange(30)">30d</span>
        <span class="drpill" data-d="14" onclick="setRange(14)">14d</span>
        <span class="drpill" data-d="7" onclick="setRange(7)">7d</span>
      </div>
      <input class="dinput" type="date" id="dFrom">
      <input class="dinput" type="date" id="dTo">
      <button class="btn sm" onclick="setCustom()">Apply</button>
      <button class="btn sm prim" id="syncBtn" disabled onclick="startRefresh()">Refresh</button>
      <button class="btn sm" onclick="openConfig()">Config</button>
      <button class="btn sm" onclick="startPres()">Present</button>
      <button class="btn sm" onclick="exportImg()">Export PNG</button>
      <span id="expmsg"></span>
    </div>
    <div id="app" class="page"></div>
  </main>
</div>

<!-- Modals -->
<div id="expModal" class="on" style="display:none">
  <div class="exp-card">
    <div class="exp-head">
      <h2 class="sh" id="expTitle"></h2>
      <button class="btn sm" onclick="closeExp()">Close</button>
    </div>
    <div id="expBody"></div>
  </div>
</div>

<div id="cfgModal" class="modal">
  <div class="modal-card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h2 class="sh">Configuration</h2>
      <button class="btn sm" onclick="closeConfig()">Close</button>
    </div>
    <div id="cfg-list"></div>
  </div>
</div>

<div id="syncModal">
  <div class="sync-card">
    <div class="sync-ey">Data sync</div>
    <div class="sync-title" id="syncTitle">Syncing</div>
    <div class="sync-dots" id="syncDots"></div>
    <div class="sync-track"><i id="syncTrack"></i></div>
    <div class="sync-shimmer" id="syncShim"></div>
    <div class="sync-pct" id="syncPct">0%</div>
    <div class="sync-log" id="syncLog"></div>
    <div class="sync-foot">
      <div class="sync-summary" id="syncSummary"></div>
      <button class="btn sm prim" id="syncClose" style="display:none" onclick="closeSync()">Close</button>
    </div>
  </div>
</div>

<div id="pres">
  <div id="pscene"></div>
  <div class="pnav">
    <button class="btn sm" onclick="pNav(-1)">&#8592;</button>
    <div id="pdots"></div>
    <button class="btn sm" onclick="pNav(1)">&#8594;</button>
  </div>
  <button class="pclose" onclick="endPres()">ESC / close</button>
  <div class="pprog" id="pprog"></div>
</div>

<script>
/* injected by build_dashboard.py */
</script>
</body>
</html>
```

## Sync / server mode

The Refresh button calls `/api/refresh/stream` (SSE endpoint).
If no server runs, that button stays disabled — the dashboard still works
from a static `snapshot.json` file.

To run with a server: implement a FastAPI (or any) server that:
- `GET /api/health` -> 200 JSON
- `GET /api/refresh/stream` -> SSE events with `{phase, pct, label, status, summary, result}`
- `GET /snapshot.json` -> current snapshot
- `POST /api/config/project/{slug}` -> save visibility/owner overrides

## Export (PNG)

The Export PNG button uses snapdom to capture `#app` at 2x scale.
Requires snapdom CDN loaded. Works in modern browsers without a server.
