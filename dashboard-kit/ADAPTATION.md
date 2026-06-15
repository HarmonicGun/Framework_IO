# Claude Adaptation Protocol — Universal Department Observatory

How Claude adapts the dashboard-kit to ANY department without manual recoding.

---

## Protocol Overview

The dashboard-kit is a universal departmental observatory. Claude adapts it by:

1. **Detecting** the department type and data sources
2. **Selecting** the closest department profile (or creating a new one)
3. **Configuring** the backend collectors
4. **Building** the dashboard
5. **Verifying** the result

All adaptation happens through `window.DEPT_PROFILE` — a JSON config object.
No code changes needed for label/text adaptations. The profile system resolves
every label, KPI name, chart title, and navigation item at render time.

---

## Step-by-Step Protocol

### STEP 1: Detect Department

Ask the user (or read from existing context.md):

```
1. What department is this for?
   [Technology | Sales | Finance | Marketing | HR | Admin | Management | Other]

2. What is the primary language?
   [es | en]

3. What data sources exist?
   [git repos | CSV files | Google Sheets | API endpoints | Manual entry | Framework docs]

4. How many projects/entities are tracked?
   [count]

5. How many people/contributors?
   [count]
```

### STEP 2: Map Entity Names

For each generic concept, determine the department-specific term:

| Generic | Tech | Sales | Finance | Marketing | HR | Admin |
|---------|------|-------|---------|-----------|-----|-------|
| Entity | Proyecto | Deal | Initiative | Campaign | Program | Process |
| Person | Persona | Rep | Analyst | Marketer | Team Member | Staff |
| Activity | Commits | Deals Closed | Transactions | Impressions | Onboardings | Tasks |

### STEP 3: Configure KPIs

For each of the 4 KPI tile slots, define:

```json
{
  "id": "unique_id",
  "label": "Display label",
  "compute": "computation_method",
  "suffix": "subtitle text",
  "format": "number|currency|percent|avgPerDay|countFraction"
}
```

Available compute methods: `commits_total`, `active_projects`, `contributors_active`, `repos_count`, `revenue_total`, `win_rate`, `budget_total`, `budget_variance`, `active_deals`, `reps_active`, `active_initiatives`, `analysts_active`.

### STEP 4: Configure Data Model

Set booleans for what features to show/hide:

```json
{
  "hasGit": false,         // git-specific features (branches, commit feed, graph)
  "hasRepos": false,       // repository list
  "hasBranches": false,    // branch display
  "hasGraph": false,       // force-directed activity graph
  "hasCommitFeed": false,  // recent commits list
  "hasMVP": true,          // MVP progress bar and gauge
  "hasFase": false         // framework phase display
}
```

### STEP 5: Configure Classification

Define the taxonomy for project/entity lifecycle stages:

```json
{
  "activeList": ["Active Stage 1", "Active Stage 2", ...],
  "inactiveList": ["Closed Stage 1", "Closed Stage 2", ...]
}
```

### STEP 6: Configure Semaforo/Health Labels

```json
{
  "Green": "On Track",
  "Yellow": "At Risk",
  "Red": "Blocked",
  "Excluded": "Excluded",
  "Gray": "Gray"
}
```

### STEP 7: Select or Create Profile

If a pre-built profile matches closely:
- `profiles/tech.js` — Technology/Engineering (git, commits, repos)
- `profiles/sales.js` — Sales (deals, revenue, reps)
- `profiles/finance.js` — Finance (initiatives, budget, analysts)

Otherwise, create a new profile file using the closest existing as template.
Change only the fields that differ. The resolution layer fills missing fields
from Spanish tech defaults automatically.

### STEP 8: Configure Backend (if using observatorio server)

For non-tech departments, configure data collectors:

- **Git collector** (tech default): configure `collector/repo_map.py` with actual repos
- **File collector** (non-git): auto-detects framework docs in project folders
- **CSV collector** (Phase B): CSV file with column mapping
- **Manual collector** (Phase B): web form for manual check-ins

Backend profile at: `observatorio/config/department_profiles/default.json`

### STEP 9: Build Dashboard

```bash
cd framework_kit/dashboard-kit

# With a department profile:
python3 build_dashboard.py --profile profiles/sales.js

# Without profile (uses Spanish tech defaults):
python3 build_dashboard.py

# Verify syntax:
python3 build_dashboard.py --check
```

### STEP 10: Verify

1. Open `dashboard.html` in browser
2. Check all navigation items use correct labels
3. Verify KPI tiles show right metrics with right format
4. Check overview: heatmap, charts, project cards
5. Check project view: MVP gauge (if enabled), branches hidden (if disabled)
6. Check activity view: graph hidden (if disabled)
7. Run presentation mode: scenes use correct terminology
8. Export PNG: mobile branding matches profile

---

## Profile File Format

```json
{
  "dept": "Department Name",
  "locale": "en",
  "brand": {
    "logo": "AB",
    "title": "Dashboard Title",
    "subtitle": "Subtitle line",
    "org": "Organization Name",
    "accent": "#FB670B"
  },
  "dataModel": { ... },
  "nav": { ... },
  "kpiTiles": [ ... ],
  "charts": { ... },
  "classification": { ... },
  "semaforo": { ... },
  "autoRefreshMs": 300000
}
```

Only include fields that differ from defaults. The resolution layer in
`config/defaults.js` fills missing fields from Spanish tech fallbacks.

---

## Auto-Refresh Configuration

Set `autoRefreshMs` in the profile:
- `0` = disabled (default)
- `300000` = every 5 minutes (recommended for active departments)
- `60000` = every minute (high-frequency)
- `1800000` = every 30 minutes (low-frequency)

The dashboard polls `snapshot.json` HEAD for changes and the `/api/health`
endpoint for server-side freshness.

---

## Adding a New Department Type

1. Copy the closest existing profile from `profiles/`
2. Modify entity names, KPIs, classification
3. Toggle dataModel booleans for features
4. If new KPI compute methods needed, add to `kpi-utils.js` `formatKPI()`
5. Build with `--profile` flag
6. Test all 5 views
7. Commit the new profile to the kit

---

## Backward Compatibility

- Without `window.DEPT_PROFILE`, dashboard behaves exactly as current Spanish tech version
- All hardcoded labels in `data-render.js` or `data-render.example.js` use `navLabel()`, `chartLabel()`, etc.
- `build_dashboard.py` without `--profile` produces identical output to current
- Snapshot JSON schema is unchanged — only labels change
