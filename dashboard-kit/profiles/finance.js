{
  "dept": "Finance",
  "locale": "en",
  "brand": {
    "logo": "FN",
    "title": "Finance Command Center",
    "subtitle": "Financial Intelligence",
    "org": "Finance Department",
    "accent": "#14B8A6"
  },
  "dataModel": {
    "primaryMetric": "transactions",
    "primaryMetricLabel": "Transactions",
    "secondaryMetric": "budget",
    "secondaryMetricLabel": "Budget",
    "entityName": "Initiative",
    "entityPlural": "Initiatives",
    "personName": "Analyst",
    "personPlural": "Analysts",
    "hasGit": false,
    "hasRepos": false,
    "hasBranches": false,
    "hasGraph": false,
    "hasCommitFeed": false,
    "hasMVP": true,
    "hasFase": false
  },
  "nav": {
    "overview": "Dashboard",
    "activity": "Transactions",
    "project": "Initiative",
    "person": "Analyst",
    "presentation": "Presentation",
    "team": "Team",
    "hidden": "Archived",
    "inactive": "Closed",
    "other": "Other"
  },
  "kpiTiles": [
    {"id": "total_budget", "label": "Budget", "compute": "budget_total", "suffix": "YTD", "format": "currency"},
    {"id": "active_initiatives", "label": "Initiatives", "compute": "active_initiatives", "suffix": "active / total", "format": "countFraction"},
    {"id": "active_analysts", "label": "Analysts", "compute": "analysts_active", "suffix": "with activity", "format": "number"},
    {"id": "variance", "label": "Variance", "compute": "budget_variance", "suffix": "vs plan", "format": "percent"}
  ],
  "classification": {
    "activeList": ["Active", "Under Review", "Pending Approval"],
    "inactiveList": ["Completed", "Cancelled", "On Hold"]
  },
  "semaforo": {
    "Green": "On Budget",
    "Yellow": "Near Limit",
    "Red": "Over Budget"
  },
  "autoRefreshMs": 600000
}
