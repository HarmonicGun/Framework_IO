{
  "dept": "Sales",
  "locale": "en",
  "brand": {
    "logo": "SL",
    "title": "Sales Command Center",
    "subtitle": "Revenue Intelligence",
    "org": "Sales Department",
    "accent": "#FB670B"
  },
  "dataModel": {
    "primaryMetric": "deals",
    "primaryMetricLabel": "Deals",
    "secondaryMetric": "revenue",
    "secondaryMetricLabel": "Revenue",
    "entityName": "Deal",
    "entityPlural": "Deals",
    "personName": "Rep",
    "personPlural": "Reps",
    "hasGit": false,
    "hasRepos": false,
    "hasBranches": false,
    "hasGraph": false,
    "hasCommitFeed": false,
    "hasMVP": true,
    "hasFase": false
  },
  "nav": {
    "overview": "Pipeline",
    "activity": "Activity",
    "project": "Deal",
    "person": "Rep",
    "presentation": "Presentation",
    "team": "Team",
    "hidden": "Closed",
    "inactive": "Lost / Dead",
    "other": "Other"
  },
  "kpiTiles": [
    {"id": "total_revenue", "label": "Revenue", "compute": "revenue_total", "suffix": "this quarter", "format": "currency"},
    {"id": "active_deals", "label": "Active Deals", "compute": "active_deals", "suffix": "open / won", "format": "countFraction"},
    {"id": "active_reps", "label": "Reps", "compute": "reps_active", "suffix": "with activity", "format": "number"},
    {"id": "win_rate", "label": "Win Rate", "compute": "win_rate", "suffix": "closed-won / total", "format": "percent"}
  ],
  "classification": {
    "activeList": ["Qualifying", "Proposal", "Negotiation", "Closing"],
    "inactiveList": ["Closed Won", "Closed Lost", "Stalled"]
  },
  "semaforo": {
    "Green": "On Track",
    "Yellow": "At Risk",
    "Red": "Blocked"
  },
  "autoRefreshMs": 300000
}
