{
  "dept": "Technology",
  "locale": "es",
  "brand": {
    "logo": "go",
    "title": "Observatorio IO",
    "subtitle": "Inteligencia Operativa",
    "org": "Grupo Ortiz",
    "accent": "#FB670B"
  },
  "dataModel": {
    "primaryMetric": "commits",
    "primaryMetricLabel": "Commits",
    "secondaryMetric": "repos",
    "secondaryMetricLabel": "Repos",
    "entityName": "Proyecto",
    "entityPlural": "Proyectos",
    "personName": "Persona",
    "personPlural": "Personas",
    "hasGit": true,
    "hasRepos": true,
    "hasBranches": true,
    "hasGraph": true,
    "hasCommitFeed": true,
    "hasMVP": true,
    "hasFase": true
  },
  "nav": {
    "overview": "Departamento",
    "activity": "Actividad",
    "project": "Proyecto",
    "person": "Persona",
    "presentation": "Presentacion",
    "config": "config",
    "team": "Equipo",
    "hidden": "Ocultos",
    "inactive": "Otros estatus",
    "other": "Otros"
  },
  "kpiTiles": [
    {"id": "total_activity", "label": "Commits", "compute": "commits_total", "suffix": "por dia · rango", "format": "avgPerDay"},
    {"id": "active_projects", "label": "Proyectos", "compute": "active_projects", "suffix": "activos / total", "format": "countFraction"},
    {"id": "active_people", "label": "Personas", "compute": "contributors_active", "suffix": "activas en rango", "format": "number"},
    {"id": "data_sources", "label": "Repos", "compute": "repos_count", "suffix": "con actividad", "format": "number"}
  ],
  "autoRefreshMs": 300000
}
